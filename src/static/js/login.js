
function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let request = new XMLHttpRequest();
    request.open('POST','/api/login');
    request.setRequestHeader('Content-type','application/json');
    request.onload = () => {
        if (request.status==200) {
            window.location.href = '/';
        } else {
            document.getElementById('error').textContent = 'Invalid credentials!'
        }
    };

    request.send('{"username":"'+username+'","password":"'+password+'"}');
    return false;
}
