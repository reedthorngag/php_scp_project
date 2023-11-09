

document.addEventListener('keyup',(event) => {
    if (event.key === 'Escape') {
        if (loginVisable) hidelogin();
        else if (signupVisable) hidesignup();
    }
});

document.addEventListener('scroll', scrollHandler);

let userID;

if (document.cookie.includes('auth=')) {
    loadProfile()
} else {
    console.log('not logged in!');
}

function loadProfile() {

    let req = new XMLHttpRequest();
    req.open('GET', '/php_scp_project/src/php/profile.php');
    req.onload = () => {
        switch (req.status) {
            case 200:
                break;
            case 401:
                return;
            default:
                error('Failed to fetch profile! check internet and reload.');
                return;
        }

        let profile = JSON.parse(req.responseText);

        document.getElementById('profile').innerHTML = '<user><span id="name"></span><dropdown-arrow>&lt</dropdown-arrow></user>';

        document.getElementById('name').innerText = profile.username;

    }
    req.onerror = () => {
        error('Request failed! Check internet and reload.')
    }

    req.send();

}

currURI = '../php/fetch_next.php?skip=';
loadNext(true);
