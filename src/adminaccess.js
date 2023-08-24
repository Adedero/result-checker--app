import { createStudentObject } from "./student.js";



function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "./adminlogin.html";
    } else {
        
    }
}

window.onload = checkAuthentication();

updateNumberOfRecords();

const addRecordBtn = document.getElementById('add-record-btn');
const addStudentForm = document.getElementById('add-student-form');

const selection = document.querySelector('select');

const findRecordForm = document.querySelector("#find-record");
const findRecordBtn = document.querySelector("#find-student-btn");

const clearFieldsBtn = document.querySelector("#clear-fields-btn");

const clearAllRecordsBtn = document.querySelector('#clear-all-records-btn');


//This controls the functionality of selecting courses
selection.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    addInputDivs(selectedValue);
});
function addInputDivs(optionValue) {
    const container = document.getElementById('courses-div');
    const number = parseInt(optionValue);
    
    let divsHtml = '';
    for (let i = 1; i <= number; i++) {
        divsHtml += `
            <div class="course-div">
                <p>Course ${i}</p>
                <input type="text" id="course${i}-title" placeholder="Course title">
                <input type="number" id="course${i}-unit" placeholder="Units">
                <input type="number" id="course${i}-score" placeholder="Score">
            </div>`;
    }
    container.innerHTML = divsHtml;
};


//This functions adds a new student record
function pushToServer(e) {
    e.preventDefault();
    const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";
    const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";

    const xhrGet = new XMLHttpRequest();

    xhrGet.open('GET', url, true);

    xhrGet.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const students = JSON.parse(xhrGet.responseText);

            const inputSurname = document.getElementById('surname-input').value;
            const inputFirstName = document.getElementById('first-name-input').value;
            const inputRegNo = document.getElementById('reg-num-input').value;
            const inputDepartment = document.getElementById('dept-input').value;

            const courseDivs = document.querySelectorAll('.course-div');
            const courses = [];

            if (inputSurname === "" || inputFirstName ==="" || inputRegNo ==="" || inputDepartment === "") {
                message('red', 'Input fields cannot be empty');
                return;
            } 

            var newRecord = createStudentObject();

            //Check if the reg number input already exists

            const checkRegNumber = document.getElementById('reg-num-input').value;

            const existingStudent = students.record.find(student => student.regNumber === checkRegNumber);

            if (existingStudent) {
                message('red', 'A student record with this registration number already exists');
            } else {
                students.record.push(newRecord);

                //Creating put request to update the JSON
                const xhrPut = new XMLHttpRequest();
                xhrPut.open('PUT', url, true);
                xhrPut.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.querySelector('header').scrollIntoView({ behavior: "smooth" });
                        message('green', 'Success!');
                    } else {
                        message('red', 'Something happened. Please, try again later');
                    }

                    updateNumberOfRecords();
                }
                xhrPut.onerror = function(err) {
                    message('red', `Error detected: ${err}`);
                }
                xhrPut.setRequestHeader("Content-Type", "application/json");
                xhrPut.setRequestHeader("X-Master-Key", apiKey);
                xhrPut.send(JSON.stringify(students.record));
            }

        } else {
            console.log("Connection error");
        }
    }
    xhrGet.onerror = function(err) {
        message('red', `Error detected: ${err}`);
    }
    xhrGet.setRequestHeader("X-Bin-Private", "true");
    xhrGet.setRequestHeader("X-Master-Key", apiKey);
    xhrGet.send();

    updateNumberOfRecords();
}

//All error messages use this fucntion
export function message (color, text) {
    const messageAlert = document.getElementById('success');
    messageAlert.classList.add('show-success');
    messageAlert.style.backgroundColor = color;
    messageAlert.innerText = text;

    setTimeout(() => {
        messageAlert.classList.remove('show-success');
    }, 3000);

};

//This function clears all input fields
function clearAllFields() {
    let allInput = document.querySelectorAll("#add-student-form input");
    allInput.forEach(oneInput => {
        oneInput.value = "";
    });
};

//This function finds a student record, views the result and deletes
function findStudent(e) {
    e.preventDefault();
    document.getElementById('section-three').classList.remove('show-result');
    document.getElementById('tbody-target').innerHTML = "";

    const numberToSearch = document.querySelector("#search-reg-num").value;
    if (numberToSearch === "") {
        message('red', 'Please, input a registration number to search');
        return;
    }
    const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";
    const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";

    const xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', url, true);
    xhrGet.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {

            const students = JSON.parse(xhrGet.responseText);
            const student = students.record.find(student => student.regNumber == numberToSearch);

            let tbody = document.getElementById('tbody-target');
            if (student) {
                message('green', 'Record found');

                tbody.scrollIntoView({behavior:"smooth"});
                
                tbody.innerHTML = `
                    <tr>
                        <td>${student.surname} ${student.firstName}</td>
                        <td class="underline">${student.regNumber}</td>
                        <td>${student.department}</td>
                        <td><button id ="view-result-btn">View Result</button></td>
                        <td><button id = "delete-record-btn">Delete Record</button></td>
                    </tr>`;

                    //View Result, Delete Result
                    const target = document.getElementById('table-body-result');
                    const viewResultBtn =document.getElementById("view-result-btn");
                    const deleteRecordBtn = document.getElementById("delete-record-btn");
                    const cancelDeleteBtn = document.getElementById("cancel-delete");

                    deleteRecordBtn.addEventListener('click', function(e){
                        e.preventDefault();

                        const warning = document.getElementById("warning");
                        warning.classList.add('show-warning');
                        warning.scrollIntoView({behavior:"smooth"});

                        document.getElementById("confirm-delete").addEventListener('click', ()=>{

                            document.getElementById('section-three').classList.remove('show-result');
                            const indexOfStudent = students.record.indexOf(student);
                            const numberOfElementsToDelete = 1;
                            //Remove the record from the students.record array
                            students.record.splice(indexOfStudent, numberOfElementsToDelete);
                            //Create PUT request to send the updated record
                            const xhrPut = new XMLHttpRequest();
                            xhrPut.open('PUT', url, true);
                            xhrPut.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {
                                    
                                    message('blue', 'Record deleted.');
                                    document.getElementById('tbody-target').innerHTML = "";
                                    document.getElementById('section-three').innerHTML = "";
                                    warning.classList.remove('show-warning');
                                    document.getElementById('search-reg-num').value = "";
                                    updateNumberOfRecords();
                                } else {
                                    console.log("Connection error");
                                    /* message('red', 'Something happened. Please, try again later'); */
                                }
                            }
                            xhrPut.onerror = function(err) {
                                message('red', `Error detected: ${err}`);
                            }
                            xhrPut.setRequestHeader("Content-Type", "application/json");
                            xhrPut.setRequestHeader("X-Master-Key", apiKey);
                            xhrPut.send(JSON.stringify(students.record));

                            updateNumberOfRecords();
                        });

                        cancelDeleteBtn.addEventListener('click', function(){
                            warning.classList.remove('show-warning');
                        });
                    });

                    viewResultBtn.addEventListener('click', function(e){
                        e.preventDefault();
                        const resultSection = document.getElementById('section-three');
                        resultSection.classList.add('show-result');
                        resultSection.scrollIntoView({behavior:"smooth"});
                        //Display student details
                        document.getElementById('surname').innerText = student.surname;
                        document.getElementById('first-name').innerText = student.firstName;
                        document.getElementById('reg-num').innerText = student.regNumber;
                        document.getElementById('dept').innerText = student.department;

                        target.innerHTML = "";

                        student.courses.forEach(course=>{
                            target.innerHTML += `
                            <td>${course.title.toUpperCase()}</td>
                            <td>${course.unit}</td>
                            <td>${course.score}</td>
                            <td>${getGrade(course.score)}</td>
                            <td>${getGradePoint(course.unit, getGrade(course.score))}</td>
                            <td></td>`
                        });

                        let a = 0;
                        let tcu = 0;
                        while (a < student.courses.length) {
                            tcu += student.courses[a].unit;
                            a ++;
                        };

                        let b = 0;
                        let tgp = 0;
                        while (b < student.courses.length) {
                            tgp += getGradePoint(student.courses[b].unit, getGrade(student.courses[b].score));
                            b++;
                        }

                        let gpa = tgp/tcu;
                        
                        var roundedGpa = Math.round(gpa * 100) / 100;

                        document.getElementById('tcu').innerText = tcu;
                        document.getElementById('tgp').innerText = tgp;
                        document.getElementById('gpa').innerText = roundedGpa;

                        const clearResult = document.querySelector(".footer a");
                        clearResult.addEventListener('click', function(){
                            resultSection.classList.remove('show-result')
                        })
                    });

            } else {
                /* document.getElementById('search-reg-num').value = ""; */
                message('red', 'No student with this registration number exists.');
            }

        } else {
            message('blue', "Connecting...");
        }
    }
    xhrGet.onerror = function(err) {
        message('red', `Error detected: ${err}`);
    }
    xhrGet.setRequestHeader("X-Bin-Private", "true");
    xhrGet.setRequestHeader("X-Master-Key", apiKey);
    xhrGet.send();
};

function updateNumberOfRecords() {
    const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";
    const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";
    const numberOfRecords = document.querySelector(".information > p > span");

    const xhrGet = new XMLHttpRequest();
    xhrGet.open('GET', url, true);
    xhrGet.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const students = JSON.parse(xhrGet.responseText);

            numberOfRecords.innerText = students.record.length - 1;
        } else {
            console.log("Connection error. Retrying...");
        }
    }

    xhrGet.onerror = function(err) {
        message('red', `Error detected: ${err}`);
    }
    xhrGet.setRequestHeader("X-Bin-Private", "true");
    xhrGet.setRequestHeader("X-Master-Key", apiKey);
    xhrGet.send();
}

function clearAllRecords(){
    const warning = document.getElementById('warning');
    const warningText = document.querySelector('#warning > p');

    warning.classList.add('show-warning');
    warningText.innerText = `You are about to delete all records.
    This cannot be undone.`

    const cancelDeleteBtn = document.getElementById('cancel-delete');
    cancelDeleteBtn.addEventListener('click', function(){
        warning.classList.remove('show-warning');
        warningText.innerHTML = "You are about to delete this student's record";
    });

    const confirmDeleteBtn = document.getElementById('confirm-delete');
    confirmDeleteBtn.addEventListener('click', function(){
        warning.classList.remove('show-warning');
        warningText.innerHTML = "You are about to delete this student's record";
        document.getElementById('section-three').innerHTML = "";
        document.getElementById('tbody-target').innerHTML = "";

        const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";
        const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";
        const xhrGet = new XMLHttpRequest();
        xhrGet.open('GET', url, true);
        xhrGet.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                const students = JSON.parse(xhrGet.responseText);

                students.record.splice(1);
        
                const xhrPut = new XMLHttpRequest();
                xhrPut.open('PUT', url, true);
                xhrPut.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        message('red', 'All records deleted.');
                        updateNumberOfRecords();
                        clearAllFields();
                    } else {
                        console.log("Connection error");
                    }
                }
                xhrPut.onerror = function(err) {
                    message('red', `Error detected: ${err}`);
                }
                xhrPut.setRequestHeader("Content-Type", "application/json");
                xhrPut.setRequestHeader("X-Master-Key", apiKey);
                xhrPut.send(JSON.stringify(students.record));  
            } else {
                console.log("Connection error. Retrying...");
            }
        }
    
        xhrGet.onerror = function(err) {
            message('red', `Error detected: ${err}`);
        }
        xhrGet.setRequestHeader("X-Bin-Private", "true");
        xhrGet.setRequestHeader("X-Master-Key", apiKey);
        xhrGet.send();
    });
}

function getGrade (studentScore) {
    if (studentScore > 69) {
        const grade = "A";
        return grade;
    } else if (studentScore < 70 && studentScore > 59) {
        const grade = "B";
        return grade;
    } else if (studentScore < 60 && studentScore > 49) {
        const grade = "C";
        return grade;
    } else if (studentScore < 50 && studentScore > 39) {
        const grade = "D";
        return grade;
    } else if (studentScore < 40 && studentScore > 34) {
        const grade = "E";
        return grade;
    } else {
        const grade = "F";
        return grade;
    }
};


function getGradePoint (courseUnit, studentGrade) {
    if (studentGrade === "A") {
        const gradePoint = courseUnit * 5;
        return gradePoint;
    } else if (studentGrade === "B") {
        const gradePoint = courseUnit * 4;
        return gradePoint;
    } else if (studentGrade === "C") {
        const gradePoint = courseUnit * 3;
        return gradePoint;
    } else if (studentGrade === "D") {
        const gradePoint = courseUnit * 2;
        return gradePoint;
    } else if (studentGrade === "E") {
        const gradePoint = courseUnit * 1;
        return gradePoint;
    } else {
        const gradePoint = 0;
        return gradePoint;
    }
};

clearAllRecordsBtn.addEventListener('click', clearAllRecords);

clearFieldsBtn.addEventListener('click', clearAllFields);

addStudentForm.addEventListener('submit', pushToServer);
addRecordBtn.addEventListener('click', pushToServer);

findRecordForm.addEventListener('submit', findStudent);
findRecordBtn.addEventListener('click', findStudent);


