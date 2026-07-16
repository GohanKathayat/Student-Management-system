// =====================================
// USER DASHBOARD
// STUDENT VIEW SYSTEM
// =====================================



// =====================================
// LOAD STUDENTS
// =====================================


function loadUserStudents(){



let table =
document.getElementById(
"userStudentTable"
);



if(!table)
return;



let students =
JSON.parse(
localStorage.getItem("students")
) || [];

let facultyFilter = document.getElementById("facultyFilter");
if(facultyFilter){
let faculties = [...new Set(students.map(student => student.faculty).filter(Boolean))].sort();
faculties.forEach(faculty => {
let option = document.createElement("option");
option.value = faculty;
option.textContent = faculty;
facultyFilter.appendChild(option);
});
}



// Clear table

table.innerHTML = "";




// FIFO DISPLAY
// Oldest student appears first


students.forEach(
(student,index)=>{


table.innerHTML += `

<tr>

<td>
${index + 1}
</td>

<td>
${student.photo ? `<img class="student-photo" src="${student.photo}" alt="${student.name}">` : `<span class="photo-placeholder" aria-label="No photo"><i class="fa-solid fa-user"></i></span>`}
</td>


<td>
${student.name}
</td>


<td>
${student.address}
</td>


<td>
${student.contact}
</td>


<td>
${student.email}
</td>


<td>
${student.roll}
</td>


<td>
${student.faculty}
</td>


</tr>

`;



});




// Total students


let total =
document.getElementById(
"totalStudents"
);


if(total){

total.innerHTML =
students.length;

}



}






// =====================================
// SEARCH STUDENT
// =====================================


function searchUserStudent(){

filterUserStudents();

}

function filterUserStudents(){



let searchValue =

document.getElementById(
"search"
)
.value
.toLowerCase();

let selectedFaculty = document.getElementById("facultyFilter").value.toLowerCase();



let rows =

document.querySelectorAll(
"#userStudentTable tr"
);




rows.forEach(
row=>{


let data =
row.innerText.toLowerCase();



if(data.includes(searchValue) && (!selectedFaculty || row.cells[7].innerText.toLowerCase() === selectedFaculty)){


row.style.display="";

}


else{


row.style.display="none";


}



});


}
