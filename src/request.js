import { showNoMatchError, noConnectionError } from "./error.js";

/* export async function makeRequest() {
    const regNumInput = document.getElementById('regNumber').value;
    const url = "https://www.npoint.io/docs/64270a98a0b93f297e1a";
    try {
        const response = await fetch (url);
        const students = await response.json();

        if (!response.ok) {
            noConnectionError();
            return;
        } else {
            const student = students.find(student => student.regNumber === regNumInput);

            const target = document.getElementById('table-body');


            if (student) {

                function showResult() {
                    const resultSection = document.getElementById('result-section');
                    resultSection.classList.add('show-result');
                    resultSection.scrollIntoView({ behavior: "smooth" });
                
                    document.getElementById('surname').innerText = student.surname;
                    document.getElementById('first-name').innerText = student.firstName;
                    document.getElementById('reg-num').innerText = student.regNumber;
                    document.getElementById('dept').innerText = student.department;

                    const tableBody = document.getElementById('table-body');

                    for (let i = 0; i < student.courses.length; i++) {
                        tableBody.insertAdjacentHTML("beforeend", 
                        `
                    <tr>
                        <td>${student.courses[i].title}</td>
                        <td>${student.courses[i].unit}</td>
                        <td>${student.courses[i].score}</td>
                        <td>${getGrade(student.courses[i].score)}</td>
                        <td>${getGradePoint(student.courses[i].unit, getGrade(student.courses[i].score))}</td>
                    </tr>`)
                    }

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
                };

                if (target.childNodes.length === 0) {
                    showResult();
                } else {
                    target.innerHTML = "";
                    showResult();
                }

               
            } else {
                showNoMatchError();
            } 
        }
    } catch (error) {
        noConnectionError();
    }  
} */
export function makeRequest() {

    const regNumInput = document.getElementById('regNumber').value;
    const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";

    const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";

    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const students = JSON.parse(xhr.responseText);

            const student = students.record.find(student => student.regNumber === regNumInput);

            const target = document.getElementById('table-body');


            if (student) {

                function showResult() {
                    const resultSection = document.getElementById('result-section');
                    resultSection.classList.add('show-result');
                    resultSection.scrollIntoView({ behavior: "smooth" });
                
                    document.getElementById('surname').innerText = student.surname;
                    document.getElementById('first-name').innerText = student.firstName;
                    document.getElementById('reg-num').innerText = student.regNumber;
                    document.getElementById('dept').innerText = student.department;

                    const tableBody = document.getElementById('table-body');

                    for (let i = 0; i < student.courses.length; i++) {
                        tableBody.insertAdjacentHTML("beforeend", 
                        `
                    <tr>
                        <td>${student.courses[i].title.toUpperCase()}</td>
                        <td>${student.courses[i].unit}</td>
                        <td>${student.courses[i].score}</td>
                        <td>${getGrade(student.courses[i].score)}</td>
                        <td>${getGradePoint(student.courses[i].unit, getGrade(student.courses[i].score))}</td>
                    </tr>`)
                    }

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
                };

                if (target.childNodes.length === 0) {
                    showResult();
                } else {
                    target.innerHTML = "";
                    showResult();
                }

               
            } else {
                showNoMatchError();
            }
        } else {
            noConnectionError();
        }
    }

    xhr.onerror = function(err) {
        noConnectionError();
        console.log(`Error: ${err}`);
    }

    xhr.setRequestHeader("X-Bin-Private", "true");
    xhr.setRequestHeader("X-Master-Key", apiKey);

    xhr.send();

};


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