import requests
from bs4 import BeautifulSoup
import json

import re

base_url = "https://scp-wiki.wikidot.com/scp-"

def relax_key(current_key: str) -> str:
    if (current_key == 'Item #:'):
        return 'id'
    elif (current_key == 'Object Class:'):
        return 'class'
    elif (current_key == 'Description:'):
        return 'description'
    elif (current_key == 'Special Containment Procedures:'): 
        return 'containment' 
    return current_key[:-1]

def harmonize_id(_id: int) -> str:
    if _id < 10:
        return '00' + str(_id)
    elif _id < 100:
        return '0' + str(_id)
    return str(_id)

def affix_additional(results):
    
    _results = results
    _additional_info = {}
    
    to_delete = []
    
    for key in _results:
        if key not in ['id', 'class', 'description', 'containment']:
            _additional_info[key] = _results[key]
            to_delete.append(key)
            
    for key in to_delete:
        del _results[key]
        
    _results['more_info'] = _additional_info
        
    return _results

def scrape_scp(id):
    
    result_dict = {}
    _id = harmonize_id(id)
    url = base_url + _id
    response = requests.get(url)
    print(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    page_content = soup.find('div', id='page-content')
    paragraphs = page_content.find_all('p')
    
    #print(page_content.get_text())

    # Process or extract the desired data from the paragraphs
    current_key = None
    current_value = ''
    stop = False
    
    for paragraph in paragraphs:
        
        if not stop:
            strong_tag = paragraph.find('strong')

            if strong_tag:
                if current_key:
                    _k = relax_key(current_key)
                    current_value = re.sub('\u2588+', '[REDACTED]', current_value)
                    result_dict[_k] = current_value.strip()

                current_key = strong_tag.get_text()
                current_value = paragraph.get_text()[len(current_key):].strip()
                

            elif paragraph.get_text().startswith('«'):
                stop = True

            else:
                if current_value:
                    current_value += ' '

                current_value += paragraph.get_text()
                
    # Add the last key-value pair
    if current_key:
        current_value = re.sub('\u2588+', '[REDACTED]', current_value)
        result_dict[current_key] = current_value.strip()
    
    result_dict = affix_additional(result_dict)
    
    return result_dict

#print(str(scrape_scp(2)))
import sys
#sys.exit(0)

start = 2
count = 30
scp = start

r = requests.post("https://30076323.2023.labnet.nz/php_scp_project/src/php/login.php",data=[("email","admin"),("pass",input("enter password: "))])

print(str(r.status_code))
php_sess_id = r.headers['Set-Cookie'].split(';')[0].split('=')[1]

n = start
while (n<start+count):
    try:
        s = scrape_scp(scp)
        r = requests.post("https://30076323.2023.labnet.nz/php_scp_project/src/php/create_subject.php",data=[
                    ("subject",s["id"]),
                    ("class",s["class"]),
                    ("image","a"),
                    ("description",s["description"]),
                    ("containment_info",s["containment"])],headers={"content-type":"application/x-www-form-urlencoded"},
                        cookies={"PHPSESSID":php_sess_id})
        print(r.status_code)
        print(r.content)
        n += 1
    except:
        pass
    scp += 1

print(f"Dictionary written to db successfully.")

