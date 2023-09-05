import {showEmptyStringError} from './error.js';
import { restrictedError } from './error.js';
import { makeRequest } from './request.js';

const form = document.getElementById('submit-form');
const btn = document.getElementById('submit');


form.addEventListener('submit', checkRegNum);
btn.addEventListener('click', checkRegNum);

function checkRegNum(e) {
    e.preventDefault();
    const regNumInput = document.getElementById('regNumber').value;

    if (regNumInput === "") {
        showEmptyStringError();
        return;

    } else if (regNumInput === "ADMINACCESS") {
        location.reload();
        openAdmin();
        return;
    } else if (regNumInput === "10001") {
        restrictedError();
        return;
    } 
    else {
        makeRequest();
        return;
    }
};

document.getElementById('print').addEventListener('click', function(){ window.print();});



function openAdmin() {
    window.location.href = "./adminlogin.html";
}

var overlay = document.getElementById("overlay");

// Function to show the loader
export function showOverlay() {
    overlay.style.display = "flex";
}

// Function to hide the loader
export function hideOverlay() {
    overlay.style.display = "none";
}
