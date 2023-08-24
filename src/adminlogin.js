const inputs = document.querySelectorAll('.password');
const checkboxes = document.querySelectorAll('input[type=checkbox]');

const changePasswordLink = document.getElementById('change-password-link');
const cancelChangePasswordLink = document.getElementById('cancel-change-password-link');

const changePasswordForm = document.getElementById('change-password-form');
const returningAdminForm = document.getElementById('returning-admin');

const loginBtn = document.getElementById('login-btn');
const changePasswordBtn = document.getElementById('change-password-btn');



checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function(){
        if (checkbox.checked) {
            inputs.forEach(input => {
                input.type = 'text';
            })
        } else {
            inputs.forEach(input => {
                input.type = "password"
            })
        }
    })
});

function switchToChangePassword() {
    returningAdminForm.classList.add('form-hide');
    changePasswordForm.classList.remove('form-hide');
}

function cancelChangePassword() {
    returningAdminForm.classList.remove('form-hide');
    changePasswordForm.classList.add('form-hide');
}

function validateLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;

    if (password === "") {

        message('rgb(245, 0, 175)', 'Password cannot be empty.');
    } else if (password.length < 6) {
        message('rgb(245, 0, 175)', 'Password must be 6 characters long or more.');
    } else {
        message('rgb(245, 0, 175)', 'Connecting...');

        const url = "https://api.jsonbin.io/v3/b/64e6c4198e4aa6225ed472d0";
        const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";

        const xhrGet = new XMLHttpRequest();

        xhrGet.open('GET', url, true);
        xhrGet.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const data = JSON.parse(xhrGet.responseText);

                if (password === data.record.password) {
                    message('rgb(245, 0, 175)', 'Login successful.');

                    sessionStorage.setItem("isLoggedIn", "true");
                   
                    location.reload();

                    window.location.href = './admin.html';
                } else {
                    message('red', `Login failed.
                    Password is not a match`);
                    return;
                }
            }else {
                console.log("Error establishing connection")
            };
        };
        xhrGet.onerror = function(error){
            message('red', `Error: ${error}`);
        };
        xhrGet.setRequestHeader("X-Master-Key", apiKey);
        xhrGet.send();
    }
}

function changePassword(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    if (oldPassword == "" || newPassword == "") {
        message('rgb(245, 0, 175)', 'Password cannot be empty.');
        return;
    } else if (newPassword.lentgh < 6 || oldPassword.length < 6) {
        message('rgb(245, 0, 175)', 'Password must be 6 characters long or more.');
        return
    }

    message('rgb(245, 0, 175)', 'Connecting...');

        const url = "https://api.jsonbin.io/v3/b/64e6c4198e4aa6225ed472d0";
        const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";

        const xhrGet = new XMLHttpRequest();

        xhrGet.open('GET', url, true);
        xhrGet.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                const data = JSON.parse(xhrGet.responseText);

                if (oldPassword === data.record.password) {

                    data.record.password = newPassword;

                    const xhrPut = new XMLHttpRequest();
                    xhrPut.open('PUT', url, true);
                    xhrPut.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            message('rgb(245, 0, 175)', 'Password changed');
                        } else {
                            console.log("Error establishing connection")
                        }
                    }
                    xhrPut.onerror = function(err) {
                        message('red', `Error detected: ${err}`);
                    }
                    xhrPut.setRequestHeader("Content-Type", "application/json");
                    xhrPut.setRequestHeader("X-Master-Key", apiKey);
                    xhrPut.send(JSON.stringify(data.record));

                    cancelChangePassword();

                } else {
                    message('red', `Failed
                    Password is not a match`);
                    return;
                }
            }else {
                console.log("Error establishing connection")
            };
        };
        xhrGet.onerror = function(error){
            message('red', `Error: ${error}`);
        };
        xhrGet.setRequestHeader("X-Master-Key", apiKey);
        xhrGet.send();

}

function message(color, text) {
    const message = document.getElementById('message');

    message.style.backgroundColor = color;
    message.innerText = text;
    message.classList.add('show-message');

    setTimeout(() => {
        message.classList.remove('show-message')
    }, 3000);
}




changePasswordLink.addEventListener('click', switchToChangePassword);
cancelChangePasswordLink.addEventListener('click', cancelChangePassword);

loginBtn.addEventListener('click', validateLogin);
returningAdminForm.addEventListener('submit', validateLogin);


changePasswordForm.addEventListener('submit', changePassword);
changePasswordBtn.addEventListener('click', changePassword);