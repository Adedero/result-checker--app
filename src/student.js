import { message } from "./adminaccess.js";

export function createStudentObject () {
    const inputSurname = document.getElementById('surname-input').value;
    const inputFirstName = document.getElementById('first-name-input').value;
    const inputRegNo = document.getElementById('reg-num-input').value;
    const inputDepartment = document.getElementById('dept-input').value;

    const courseDivs = document.querySelectorAll('.course-div');
    const courses = [];


    
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
            }) 

            const newStudent = {
                surname: inputSurname,
                firstName: inputFirstName,
                regNumber: inputRegNo,
                department: inputDepartment,
                courses: courses
            };
            return newStudent;
}