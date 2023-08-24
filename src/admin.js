const addRecordBtn = document.getElementById('add-record-btn');
const addStudentForm = document.getElementById('add-student-form');

const selection = document.querySelector('select');

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
                <input type="text" id="course${i}-title" placeholder="Course title" required>
                <input type="number" id="course${i}-unit" placeholder="Units" required>
                <input type="number" id="course${i}-score" placeholder="Student score" required>
            </div>`;
    }
    container.innerHTML = divsHtml;
};


   

function pushToServer(e) {
    e.preventDefault();
    const url = "https://api.jsonbin.io/v3/b/64e27a599d312622a3942cc7";
    const apiKey = "$2b$10$3CDNPj32SsMnLHpq6.ZUf.6.XM8ru37cKr1S1H2HOGzENt3wKSuHq";
    const accesKey = "$2b$10$UuRVQ.xqs60KYXZCyqtzA.00wOFmNeqLyo7qFAB0wjoLaiNsblXrO";

    const xhrGet = new XMLHttpRequest;
    xhrGet.open ('GET', url, true);

    xhrGet.onreadystatechange = function() {

       
        if (this.readyState==4 && this.status == 200) {
            const students = JSON.parse(xhrGet.responseText);

            const inputSurname = document.getElementById('surname-input').value;
            const inputFirstName = document.getElementById('first-name-input').value;
            const inputRegNo = document.getElementById('reg-num-input').value;
            const inputDepartment = document.getElementById('dept-input').value;

            const courseDivs = document.querySelectorAll('.course-div');
                const courses = [];
            
                if (inputSurname === "" && inputFirstName ==="" && inputRegNo ==="" && inputDepartment === "") {
                    message('red', 'Input fields cannot be empty');
                } else {
                    courseDivs.forEach((courseDiv, index) => {
                        const courseTitle = document.getElementById(`course${index + 1}-title`).value;
                        const courseUnit = parseInt(document.getElementById(`course${index + 1}-unit`).value);
                        const courseScore = parseInt(document.getElementById(`course${index + 1}-score`).value);
                
                        const course = {
                            title: courseTitle,
                            unit: courseUnit,
                            score: courseScore
                        };
                
                        courses.push(course);
                    });
                
                   
                
                    message('rgb(11, 173, 111)', 'New record added!');
            
                }
        

            const student = students.record.find(student => student.regNumber === inputRegNo);

            if (student) {
                message('red', 'Student record already exists');

            } else {

                const newStudent = {
                    surname: inputSurname,
                    firstName: inputFirstName,
                    regNumber: inputRegNo,
                    department: inputDepartment,
                    courses: courses
                };
               
             /*    students.record.push(newStudent); */

                //POST REQUEST

                const xhrPost = new XMLHttpRequest;
                xhrPost.open('PUT', url, true);
                xhrPost.onreadystatechange = function() {
                    if (this.readyState==4 && this.status == 200) {
                        var updatedStudents = JSON.parse(xhrPost.responseText);
                    } else {
                        message('red', 'Failed to establish network connection');
                    }

                    xhrPost.onerror = function(err) {
                        message('red', err);
                    }


                    xhrPost.setRequestHeader("Content-Type", "application/json");
                    xhrPost.setRequestHeader("X-Master-Key", apiKey);
                  

                    xhrPost.send(JSON.stringify(newStudent))
                }
            }

            


        }
    }
    xhrGet.onerror = function(err) {
        message('red', err);
    }

    xhrGet.setRequestHeader("X-Bin-Private", "true");
    xhrGet.setRequestHeader("X-Master-Key", apiKey);

    xhrGet.send();
}

/* function addStudentRecord(event) {
    event.preventDefault();

    const inputSurname = document.getElementById('surname-input').value;
    const inputFirstName = document.getElementById('first-name-input').value;
    const inputRegNo = document.getElementById('reg-num-input').value;
    const inputDepartment = document.getElementById('dept-input').value;

    const courseDivs = document.querySelectorAll('.course-div');
    const courses = [];

    if (inputSurname === "" && inputFirstName ==="" && inputRegNo ==="" && inputDepartment === "") {
        message('red', 'Input fields cannot be empty');
    } else {
        courseDivs.forEach((courseDiv, index) => {
            const courseTitle = document.getElementById(`course${index + 1}-title`).value;
            const courseUnit = parseInt(document.getElementById(`course${index + 1}-unit`).value);
            const courseScore = parseInt(document.getElementById(`course${index + 1}-score`).value);
    
            const course = {
                title: courseTitle,
                unit: courseUnit,
                score: courseScore
            };
    
            courses.push(course);
        });
    
        const newStudent = {
            surname: inputSurname,
            firstName: inputFirstName,
            regNumber: inputRegNo,
            department: inputDepartment,
            courses: courses
        };
    
    
        message('rgb(11, 173, 111)', 'New record added!');

    }
} */


function message (color, text) {
    const messageAlert = document.getElementById('success');
    messageAlert.classList.add('show-success');
    messageAlert.style.backgroundColor = color;
    messageAlert.innerText = text;

    setTimeout(() => {
        messageAlert.classList.remove('show-success');
    }, 3000);

};



addStudentForm.addEventListener('submit', pushToServer);
addRecordBtn.addEventListener('click', pushToServer);
