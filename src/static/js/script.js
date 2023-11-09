
let loginVisable = false;
let signupVisable = false;

function showlogin() {
    loginVisable = true;
    document.getElementById('login-overlay').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('login').style.top = '20vh';
    document.getElementById('login').style.opacity = 1;
    document.getElementById('login-overlay').style.opacity = 1;
}

function hidelogin() {
    loginVisable = false;
    document.getElementById('login').style.top = '25vh';
    document.getElementById('login').style.opacity = 0;
    document.getElementById('login-overlay').style.opacity = 0;
    setTimeout(()=>{
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('login').style.display = 'none';
    }, 150);
}

function showsignup() {
    signupVisable = true;
    document.getElementById('signup-overlay').style.display = 'block';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('signup').style.top = '20vh';
    document.getElementById('signup').style.opacity = 1;
    document.getElementById('signup-overlay').style.opacity = 1;
}

function hidesignup() {
    signupVisable = false;
    document.getElementById('signup').style.top = '25vh';
    document.getElementById('signup').style.opacity = 0;
    document.getElementById('signup-overlay').style.opacity = 0;
    setTimeout(()=>{
        document.getElementById('signup-overlay').style.display = 'none';
        document.getElementById('signup').style.display = 'none';
    }, 150);
}

/**
 * shows a generic error box at the top of the page, mostly
 * used to show connection errors or unexpected errors
 * 
 * @param {string} string // error string to show the user
 */
function error(string) {
    const errorElem = document.getElementById('error');
    errorElem.innerText = string;
    errorElem.style.display = 'block';
    errorElem.style.animation = 'showError 3s linear forwards';
    console.log(errorElem.style.animation);
    setTimeout(()=> errorElem.style.display = 'none', 3000);
}

let lastUpdate = 0; // when the posts were last loaded in
let loadFailed = false; // if the last page load failed or not

/**
 * funtion that is run on scroll events which loads the next posts
 * if the user is near the bottom of the page
 */
function scrollHandler() {

    const scrollHeight = document.body.scrollHeight-(window.innerHeight+window.scrollY);
    if (scrollHeight>300) return;

    if (scrollHeight || loadFailed) {
        const timeoutTime = (new Date()).getTime()-lastUpdate;
        if (timeoutTime < 500 || (loadFailed && timeoutTime < 5000)) return;
    }

    lastUpdate = (new Date()).getTime();

    loadNext(true);
}

/**
 * validates the login form data and process the login
 * 
 * @param {HTMLFormElement} form  the form that was submitted
 */
function submitLogin(form) {
    
    form['0'].classList.remove('input-error');
    form['1'].classList.remove('input-error');

    let failed = false;
    if (!form['0'].value) {
        form['0'].classList.add('input-error');
        failed = true;
    }
    if (!form['1'].value) {
        form['1'].classList.add('input-error');
        failed = true;
    }
    if (failed) {
        loginError('Please fill out all fields!');
        return;
    }

    const req = new XMLHttpRequest();
    req.open('POST','../php/login.php');
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onload = () => {

        switch (req.status) {
            case 200:
                window.localStorage.setItem('username',req.responseText.split('\n')[0]);
                window.localStorage.setItem('level',parseInt(req.responseText.split('\n')[1]));
                window.location.reload();
                break;
            case 401:
                loginError('Incorrect username or password!');
                break;
            default:
                loginError('Unexpected server response! Try again.');
                break;
        }
    };
    req.onerror = () => {
        error('Request failed! Check your internet and try again.');
    };
    req.send('email='+encodeURIComponent(form['0'].value)+'&pass='+encodeURIComponent(form['1'].value));
}

function loginError(string) {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('login-error').textContent = string;
}

/**
 * validates the signup form data and process the signup
 * 
 * @param {HTMLFormElement} form  the form that was submitted
 */
function submitSignup(form) {
    
    let failed = false;

    for (let i = 0; i < 6; i++) {
        form[i].classList.remove('input-error');
        if (!form[i].value) {
            form[i].classList.add('input-error');
            failed = true;
        }
    }

    if (failed) {
        signupError('Please fill out all fields!');
        return;
    }

    // name validation
    if (form[0].value.length > 48) {
        form[0].classList.add('input-error');
        signupError('Name too long. Max length 48 characters');
        return;
    }
    if (form[0].value.length < 2) {
        form[0].classList.add('input-error');
        signupError('Name too short');
        return;
    }

    // email validation
    if (!form[1].value/*.contains('@')*/) {
        form[1].classList.add('input-error');
        signupError('Please enter a valid email address');
        return;
    }

    // password validation
    if (form[4].length < 11) {
        form[4].classList.add('input-error');
        signupError('Password must be 11 characters or more');
        return;
    }

    if (form[4].value != form[5].value) {
        form[5].classList.add('input-error');
        signupError('Passwords dont\'t match');
        return;
    }

    const req = new XMLHttpRequest();
    req.open('POST','../php/signup.php');
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onload = () => {

        switch (req.status) {
            case 200:
                hidesignup();
                showlogin();
                break;
            case 409:
                if (req.responseText=='username taken!')
                    signupError('Username unavailable!');
                else signupError('Email already in use!');
                break;
            default:
                signupError('Unexpected server response! Try again.');
                break;
        }
    };
    req.onerror = () => {
        error('Request failed! Check your internet and try again.');
    };
    req.send(`username=${encodeURIComponent(form[0].value)}&email=${encodeURIComponent(form[1].value)}&pass=${encodeURIComponent(form[4].value)}`);
}

function signupError(string) {
    document.getElementById('signup-error').style.display = 'block';
    document.getElementById('signup-error').textContent = string;
}

/**
 * function to run when the connection to the server has been lost that
 * pings the server until it gets a response (and blocks for that time if awaited)
 * also shows an error box to the user
 * 
 * @param {string} string  the error string to display to the user
 */
async function connectionError(string) {
    document.getElementById('error-box-text').innerText = string;
    document.getElementById('error-overlay').display = 'block';
    document.getElementById('error-box').display = 'block';
    document.getElementById('error-overlay').style.opacity = 1;
    document.getElementById('error-overlay').style.opacity = 1;

    while ((await ping()) !== 200) {
        await new Promise((resolve) => setTimeout(()=>resolve(),2000)); // sleep for 2s
    }
    
    document.getElementById('error-overlay').style.opacity = 0;
    document.getElementById('error-overlay').style.opacity = 0;

    setTimeout(()=>{
        document.getElementById('error-overlay').display = 'none';
        document.getElementById('error-box').display = 'none';
    },200);
}

/**
 * pings the server and returns the result (or 0 if network error)
 * 
 * @returns status of the request
 */
async function ping() {
    return new Promise((resolve) => {
        const req = new XMLHttpRequest();
        req.open('../php/ping.php','GET');
        req.onload = () => resolve(req.status)
        req.onerror = () => resolve(0);
        req.send();
    });
}

let skip = 0; // keeps track of what post number to load
let currURI; // current URI (so loadNext() can be called from scroll handler without needing context)

/**
 * loads the next 10 posts and adds them to the feed
 * 
 * @param {boolean} retry whether to retry the request or not
 * @returns {boolean} true if loaded more posts, false if failed
 */
function loadNext(retry) {
    let req = new XMLHttpRequest();
    req.open('GET', currURI+skip);
    req.onload = () => {
        if (req.status !== 200) {
            if (retry) setTimeout(loadNext.bind(null,false),3000);
            loadFailed = true;
            error('Couldn\'t load posts! Error code: '+req.status);
            return;
        }

        const data = JSON.parse(req.response);

        if (!data.length) {
            loadFailed = true;
            return;
        }

        for (const postData of data)
            loadPost(postData);

        skip += data.length;
    }
    req.onerror = () => {
        if (retry) setTimeout(loadNext.bind(null,false),3000);
        loadFailed = true;
        error('Request failed! Check your internet.');
    }
    req.send();
}

/**
 * appends a post to the feed based on the json data passed to it
 * 
 * @param {JsonPostData} data  the data for the post including post title and body
 */
function loadPost(data) {

    if (data.type !== 'TEXT' && data.type !== 'IMAGE') return; // only text and images are supported so far

    // first build the info header (saying the community and who posted it)
    const communityElem = document.createElement('community');
    communityElem.innerText = data.community;
    const authorElem = document.createElement('author');
    authorElem.innerText = data.author;
    const infoElem = document.createElement('post-header');
    infoElem.append('Community: ',communityElem,' Author: ',authorElem);

    // then create the post data, title + body
    const titleElem = document.createElement('title');
    titleElem.innerText = data.subject;

    const classElem = document.createElement('class');
    classElem.innerText = "Class: "+data.class;

    let imgElem;
    if (data.type === 'IMAGE' && data.image) {
        imgElem = document.createElement('img');
        imgElem.src = './images/'+data.image;
        imgElem.alt = 'post image';
    }
    const bodyPreviewElem = document.createElement('body');
    bodyPreviewElem.innerText = data.description.length > 256 ? data.description.slice(0,256)+'...' : data.description;

    // then build the post from those
    const post = document.createElement('post');
    post.append(infoElem,titleElem,classElem,imgElem ?? '',bodyPreviewElem);

    // add event listeners
    const [authorID, communityID, postID] = [data.author, data.community, data.subject];

    post.onclick = (event) => {
        displayPost(postID,true);
        event.stopPropagation();
    };
    communityElem.onclick = (event) => {
        displayCommunity(communityID,true);
        event.stopImmediatePropagation();
    };
    authorElem.onclick = (event) => {
        displayUserProfile(authorID,true);
        event.stopPropagation();
    };

    // finally, append it to the feed
    document.getElementById('posts-feed').appendChild(post);
}

/**
 * creates an editable post with submit button to submit the changes
 * 
 * @param {JsonPostData} data the post to edit or undefined if creating new
 * @param {boolean} createNew  if its creating a new post or editing an existing one
 */
function editPost(data,createNew) {
    const content = document.getElementById('content');

    if (createNew) {
        oldScrollPos = document.documentElement.scrollTop || document.body.scrollTop;

        document.getElementById('tmp-storage').innerText = '';
        document.getElementById('tmp-storage').append(...content.childNodes);
    }

    content.innerHTML = '';

    const post = document.createElement('post');

    // had to write all of it as raw html because javascript sucks ass
    // and perfectly valid onclick handlers werent working
    post.innerHTML += `
        <back-button onclick="${createNew ? 'goBack()' : 'displayPost(\''+data.subject+'\',false)'};"></back-button>
        <post-header>
            ${createNew ? '' : ''+
                'Community: <community id=community onclick="displayCommunity(\''+data.community+'\',false);"></community>'+
                ' Author: <author id="author" onclick="displayProfile(\''+data.author+'\',false)"></author>'}
                <button onclick="${createNew ? 'submitPost()">Post':'submitEdit(\''+data.subject+'\')">Update'}</button>
                <button class="danger-button" onclick="${createNew ? 'goBack()">Discard':'displayPost(\''+data.subject+'\',false)">Cancel'}</button>
        </post-header>
        ${createNew ? '' : '<title id="subject"></title><br>'}
        <form id="edit-post" onsubmit="return ${createNew ? 'submitPost()' : 'submitEdit()'};">
            ${createNew ? '<label for="subject">Subject</label><br><input type="text" id="subject"><br>' : ''}
            <label for="class">Class</label><br>
            <input type="text" id="class"><br>
            <label for="image">Image URL</label><br>
            <input type="text" id="image"><br>
            <label type="description">Description</label><br>
            <textarea style="max-width:80%" id="description" rows="12" cols="60"></textarea><br>
            <label for="containment-info">Containment info</label><br>
            <textarea style="max-width:80%" id="containment-info" rows="8" cols="60"></textarea><br>
        </form>
    `;

    content.appendChild(post);

    console.log(data);

    if (!createNew) {
        document.getElementById('community').innerText = data.community;
        document.getElementById('author').innerText = data.author;
        document.getElementById('subject').innerText = data.subject;
        document.getElementById('class').value = data.class;
        document.getElementById('image').value = data.image ?? "";
        document.getElementById('description').innerText = data.description;
        document.getElementById('containment-info').innerText = data.containment_info;
    }
}

function submitEdit(subject) {
    const form = document.getElementById('edit-post');

    let failed = false;
    for (let i = 0; i < 4; i++) {
        form[i].classList.remove('input-error');
        if (!form[i].value) {
            form[i].classList.add('input-error');
            failed = true;
        }
    }

    if (failed) return false;

    const req = new XMLHttpRequest();
    req.open('POST','../php/update_subject.php');
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onload = () => {

        switch (req.status) {
            case 200:
                displayPost(subject,false);
                break;
            case 404:
                error('Subject not found! (stop messing with stuff).');
                break;
            case 403:
                error('You can\'t edit this! (stop messing with stuff).');
                break;
            case 422:
                error('Invalid data! A field may be too long.');
                break;
            default:
                error('Unexpected server response! Try again.');
                break;
        }
    };
    req.onerror = () => {
        error('Request failed! Check your internet and try again.');
    };
    req.send(`subject=${encodeURIComponent(subject)}`+
            `&type=${encodeURIComponent(form[1].value ? "IMAGE" : "TEXT")}`+
            `&class=${encodeURIComponent(form[0].value)}`+
            `&image=${encodeURIComponent(form[1].value)}`+
            `&description=${encodeURIComponent(form[2].innerText)}`+
            `&containment_info=${encodeURIComponent(form[3].innerText)}"}`);
    
    return false;
}

function submitPost() {
    const form = document.getElementById('edit-post');

    let failed = false;
    for (let i = 0; i < 5; i++) {
        form[i].classList.remove('input-error');
        if (!form[i].value) {
            form[i].classList.add('input-error');
            failed = true;
        }
    }

    if (failed) return false;

    const req = new XMLHttpRequest();
    req.open('POST','../php/create_subject.php');
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.onload = () => {

        switch (req.status) {
            case 200:
                displayPost(form[0].value,false);
                break;
            case 404:
                error('Subject not found! (stop messing with stuff).');
                break;
            case 403:
                error('You can\'t create posts!');
                break;
            case 422:
                error('Invalid data! A field may be too long.');
                break;
            default:
                error('Unexpected server response! Try again.');
                break;
        }
    };
    req.onerror = () => {
        error('Request failed! Check your internet and try again.');
    };
    req.send(`subject=${encodeURIComponent(form[0].value)}`+
            `&type=${encodeURIComponent(form[2].value ? "IMAGE" : "TEXT")}`+
            `&class=${encodeURIComponent(form[1].value)}`+
            `&image=${encodeURIComponent(form[2].value)}`+
            `&description=${encodeURIComponent(form[3].value)}`+
            `&containment_info=${encodeURIComponent(form[4].value)}"}`);
    
    return false;
}

function deletePost(data) {
    const req = new XMLHttpRequest();
    req.open('POST','../php/delete_subject.php?subject='+encodeURIComponent(data.subject));
    req.onload = () => {

        switch (req.status) {
            case 200:
                goBack();
                break;
            case 404:
                error('Subject not found! (stop messing with stuff).');
                break;
            case 403:
                error('You can\'t delete this! (stop messing with stuff).');
                break;
            default:
                error('Unexpected server response! Try again.');
                break;
        }
    };
    req.onerror = () => {
        error('Request failed! Check your internet and try again.');
    };
    req.send();
}


let onPostsFeed = true; // if currently showing the feed or something else
let oldScrollPos = 0; // scroll pos to go to when switching back to feed

/**
 * switches the page content to a specific post and saves old content for
 * fast return to feed also saves scroll position
 * 
 * @param {string}      postID  id of the post that was clicked on
 * @param {boolean}     save    whether to save old state or not
 */
function displayPost(postID,save) {

    const req = new XMLHttpRequest();
    req.open('GET','../php/fetch_subject.php?subject='+postID);
    req.onload = () => {
        
        switch (req.status) {
            case 404:
                error('Invalid post ID!');
                return;
            case 200:
                break;
            default:
                error('Unexpected error! Code: '+req.status);
                return;
        }

        const content = document.getElementById('content');

        if (save) {
            oldScrollPos = document.documentElement.scrollTop || document.body.scrollTop;

            document.getElementById('tmp-storage').innerText = '';
            document.getElementById('tmp-storage').append(...content.childNodes);
        }

        content.innerText = ''; // clear visable content

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;


        const data = JSON.parse(req.response);

        if (data.type !== 'TEXT' && data.type !== 'IMAGE') return; // only text and images are supported so far

        const editButton = document.createElement('button');
        editButton.innerText = "Edit";
        editButton.onclick = () => editPost(data);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = "delete";
        deleteButton.classList.add('danger-button');
        deleteButton.onclick = () => deletePost(data);

        // first build the header (saying the community and who posted it and a back button)
        const communityElem = document.createElement('community');
        communityElem.innerText = data.community;
        const authorElem = document.createElement('author');
        authorElem.innerText = data.author;
        const infoElem = document.createElement('post-header');
        infoElem.append('Community: ',communityElem,' Author: ',authorElem);

        const user = window.localStorage.getItem('username');
        const level = window.localStorage.getItem('level') || 10;

        //if (user===data.author && level <= 5)
            infoElem.append(editButton);
        //if ((user===data.author && level <= 5) || level <= 3)
            infoElem.append(deleteButton);

        // then create the post data, title + body
        const titleElem = document.createElement('title');
        titleElem.innerText = data.subject;

        const classElem = document.createElement('class');
        classElem.innerText = "Class: "+data.class;

        let imgElem;
        if (data.Type === 'IMAGE' && data.image) {
            imgElem = document.createElement('img');
            imgElem.src = data.image;
            imgElem.alt = 'post image';
        }

        const bodyElem = document.createElement('body');
        const description = document.createElement('p');
        description.innerText = data.description;
        const con_info = document.createElement('p');
        con_info.innerText += data.containment_info;

        bodyElem.append(description,con_info);

        const backbutton = document.createElement('back-button');

        // then build the post from those
        const post = document.createElement('post');
        post.append(backbutton,infoElem,titleElem,classElem,imgElem ?? '',bodyElem);

        // add event listeners
        const [authorID, communityID, postID] = [data.author, data.community, data.subject];

        backbutton.onclick = (event) => {
            goBack();
            event.stopPropagation();
        };
        communityElem.onclick = (event) => {
            displayCommunity(communityID,false);
            event.stopPropagation();
        };
        authorElem.onclick = (event) => {
            displayUserProfile(authorID,false);
            event.stopPropagation();
        };

        document.getElementById('banner').style.display = 'none';

        content.appendChild(post);

    };
    req.onerror = () => {
        error('Request failed! check your internet.');
    };
    req.send();
}

/**
 * goes back to the old saved state
 * 
 */
function goBack() {
    const tmpStorage = document.getElementById('tmp-storage');

    document.getElementById('banner').style.display = 'flex';

    document.getElementById('content').innerText = '';
    document.getElementById('content').append(...tmpStorage.childNodes);

    document.documentElement.scrollTop = oldScrollPos;
    document.body.scrollTop = oldScrollPos;

    tmpStorage.innerText = '';
}

/**
 * searches for the search string in the search input and displays the results
 */
function search() {
    const searchString = document.getElementById('search-input').value;

    if (!searchString) return;

    currURI = '../php/search.php?param='+encodeURIComponent(searchString)+'&skip=';

    let req = new XMLHttpRequest();
    req.open('GET', currURI+0);
    req.onload = () => {
        if (req.status !== 200) {
            error('Couldn\'t load posts! Error code: '+req.status)
            return;
        }

        document.getElementById('posts-feed').innerText = '';

        const data = JSON.parse(req.response);

        if (!data.length) {
            document.getElementById('posts-feed').innerHTML = '<post><body>No posts match your search.</body></post>'
        }

        for (const postData of data)
            loadPost(postData);

        skip = data.length;
    }
    req.onerror = () => {
        error('Request failed! Check your internet.');
    }
    req.send();
}
