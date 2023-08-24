export function showEmptyStringError () {
    const errorPopup = document.getElementById('error');
    errorPopup.innerText = "Please enter a valid registration number.";
    errorPopup.classList.add('popup');

    document.getElementById('result-section').style.display = "none";

    setTimeout(() => {
        errorPopup.classList.remove('popup');
    }, 3000);
};

export function showNoMatchError() {
    const errorPopup = document.getElementById('error');
    errorPopup.classList.add('popup');
    errorPopup.innerText = `Registration number not found.
    Please, check the number and try again.`;

    document.getElementById('result-section').style.display = "none";

    setTimeout(() => {
        errorPopup.classList.remove('popup')
    }, 3000);
};

export function noConnectionError() {
    const errorPopup = document.getElementById('error');
    errorPopup.classList.add('popup');
    errorPopup.innerText = `Connection to server failed.
    Please, try again later`;

    setTimeout(() => {
        errorPopup.classList.remove('popup')
    }, 3000);
};

export function restrictedError() {
    const errorPopup = document.getElementById('error');
    errorPopup.classList.add('popup');
    errorPopup.innerText = `You do not have persmission to access this record.`;

    setTimeout(() => {
        errorPopup.classList.remove('popup')
    }, 3000);
};

