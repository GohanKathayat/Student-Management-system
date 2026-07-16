// =======================================
// STUDENT MANAGEMENT CRUD SYSTEM
// =======================================


// Load students when page opens

let students = JSON.parse(
    localStorage.getItem("students")
) || [];

let currentPage = 1;
const recordsPerPage = 10;

function changePage(change){
currentPage += change;
loadStudents();
}

function showAdminMessage(message){
let status = document.getElementById("formStatus");
if(status) status.textContent = message;
}

const adminPhotoInput = document.getElementById("adminPhoto");
const adminProfile = document.querySelector(".admin-profile");
const adminSidebarAvatar = document.getElementById("adminSidebarAvatar");

function showAdminPhoto(photo){
if(!photo) return;
[adminProfile, adminSidebarAvatar].forEach(element => {
if(element){
element.style.backgroundImage = `url("${photo}")`;
element.classList.add("has-photo");
}
});
}

function loadAdminPhoto(){
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(currentUser && currentUser.photo) showAdminPhoto(currentUser.photo);
}

if(adminPhotoInput){
adminPhotoInput.addEventListener("change", function(){
let file = this.files[0];
if(!file) return;
if(!file.type.startsWith("image/") || file.size > 1024 * 1024){
showAdminMessage("Choose a JPG, PNG, or WebP image smaller than 1 MB.");
this.value = "";
return;
}
let reader = new FileReader();
reader.onload = function(event){
let photo = event.target.result;
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if(!currentUser) return;
currentUser.photo = photo;
localStorage.setItem("currentUser", JSON.stringify(currentUser));
let users = JSON.parse(localStorage.getItem("users")) || [];
users = users.map(user => user.email === currentUser.email ? {...user, photo:photo} : user);
localStorage.setItem("users", JSON.stringify(users));
showAdminPhoto(photo);
};
reader.readAsDataURL(file);
});
}

loadAdminPhoto();

let selectedPhoto = "";
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

function processStudentPhoto(file){
if(!file) return;
if(!file.type.startsWith("image/")){
showAdminMessage("Please choose an image file.");
return;
}
if(file.size > 1024 * 1024){
showAdminMessage("Photo must be 1 MB or smaller.");
return;
}
let reader = new FileReader();
reader.onload = function(event){
selectedPhoto = event.target.result;
photoPreview.src = selectedPhoto;
photoPreview.classList.add("has-photo");
document.getElementById("photoDropZone").classList.add("has-photo");
};
reader.readAsDataURL(file);
}

if(photoInput){
photoInput.addEventListener("change", function(){
processStudentPhoto(this.files[0]);
});
}



// =======================================
// ADD / UPDATE STUDENT
// =======================================


const studentForm =
document.getElementById("studentForm");

const requiredFields = ["name", "address", "contact", "studentEmail", "roll", "faculty"];

function setFieldState(input){
let field = input.closest(".field");
let message = field.querySelector(".field-error");
if(!message){
message = document.createElement("small");
message.className = "field-error";
field.appendChild(message);
}
let error = "";
if(!input.value.trim()) error = "This field is required.";
else if(input.id === "contact" && !/^\d{10}$/.test(input.value)) error = "Enter exactly 10 digits.";
else if(input.type === "email" && !input.validity.valid) error = "Enter a valid email address.";
field.classList.toggle("invalid", Boolean(error));
field.classList.toggle("valid", !error && Boolean(input.value));
message.textContent = error;
return !error;
}

requiredFields.forEach(id => {
let input = document.getElementById(id);
if(!input) return;
input.addEventListener("input", function(){
if(this.id === "contact") this.value = this.value.replace(/\D/g, "").slice(0, 10);
if(this.id === "roll") this.value = this.value.toUpperCase();
setFieldState(this);
});
input.addEventListener("blur", function(){ setFieldState(this); });
});

const photoDropZone = document.getElementById("photoDropZone");
if(photoDropZone){
["dragenter", "dragover"].forEach(eventName => photoDropZone.addEventListener(eventName, function(event){
event.preventDefault();
photoDropZone.classList.add("drag-over");
}));
["dragleave", "drop"].forEach(eventName => photoDropZone.addEventListener(eventName, function(event){
event.preventDefault();
photoDropZone.classList.remove("drag-over");
}));
photoDropZone.addEventListener("drop", function(event){ processStudentPhoto(event.dataTransfer.files[0]); });
photoDropZone.addEventListener("click", function(event){ if(event.target !== photoInput) photoInput.click(); });
photoDropZone.addEventListener("keydown", function(event){ if(event.key === "Enter" || event.key === " "){ event.preventDefault(); photoInput.click(); } });
}



if(studentForm){


studentForm.addEventListener(
"submit",
function(e){


e.preventDefault();

let formIsValid = requiredFields.map(id => setFieldState(document.getElementById(id))).every(Boolean);
if(!formIsValid){
showAdminMessage("Please correct the highlighted fields.");
return;
}



// Get values


let id =
document.getElementById("studentId").value;


let name =
document.getElementById("name").value;


let address =
document.getElementById("address").value;


let contact =
document.getElementById("contact").value;


let email =
document.getElementById("studentEmail").value;


let roll =
document.getElementById("roll").value;


let faculty =
document.getElementById("faculty").value;




// UPDATE STUDENT


if(id){


students =
students.map(student=>{


if(student.id == id){


return{


id:student.id,

name:name,

address:address,

contact:contact,

email:email,

roll:roll,

faculty:faculty,

photo:selectedPhoto || student.photo || ""


};


}



return student;


});



showAdminMessage("Student record updated.");



}






// CREATE STUDENT


else{


let newStudent = {


id:Date.now(),


name:name,


address:address,


contact:contact,


email:email,


roll:roll,


faculty:faculty,

photo:selectedPhoto,


createdAt:new Date()

};



students.push(newStudent);



showAdminMessage("Student record saved.");


}





// Save data


localStorage.setItem(

"students",

JSON.stringify(students)

);



// Reset form


studentForm.reset();

selectedPhoto = "";
if(photoPreview){
photoPreview.src = "";
photoPreview.classList.remove("has-photo");
document.getElementById("photoDropZone").classList.remove("has-photo");
}
requiredFields.forEach(id => {
let field = document.getElementById(id).closest(".field");
field.classList.remove("valid", "invalid");
field.querySelector(".field-error")?.remove();
});


document.getElementById(
"studentId"
).value="";



// Refresh table


loadStudents();



});



}



// =======================================
// DISPLAY STUDENTS
// FIFO ORDER
// =======================================


function loadStudents(){

let table = document.getElementById("studentTable");
let pagination = document.getElementById("pagination");
if(!table) return;

students = JSON.parse(localStorage.getItem("students")) || [];
let searchValue = document.getElementById("search")?.value.toLowerCase() || "";
let filteredStudents = students.filter(student => Object.values(student).join(" ").toLowerCase().includes(searchValue));
let totalPages = Math.max(1, Math.ceil(filteredStudents.length / recordsPerPage));
currentPage = Math.min(currentPage, totalPages);
let start = (currentPage - 1) * recordsPerPage;
let pageStudents = filteredStudents.slice(start, start + recordsPerPage);

table.innerHTML = "";
if(!pageStudents.length){
let message = searchValue ? `No students found matching “${searchValue}”.` : "No student records yet.";
table.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-user-graduate"></i><strong>${message}</strong><span>Try a different search or add a new student record.</span></div></td></tr>`;
}else{
pageStudents.forEach((student, index) => {
table.innerHTML += `<tr><td>${start + index + 1}</td><td>${student.photo ? `<img class="student-photo" src="${student.photo}" alt="${student.name}">` : `<span class="photo-placeholder" aria-label="No photo"><i class="fa-solid fa-user"></i></span>`}</td><td>${student.name}</td><td>${student.address}</td><td>${student.contact}</td><td>${student.email}</td><td>${student.roll}</td><td>${student.faculty}</td><td><button class="edit-btn" type="button" title="Edit record" aria-label="Edit ${student.name}" onclick="editStudent(${student.id})"><i class="fa-solid fa-pen"></i></button><button class="delete-btn" type="button" title="Delete record" aria-label="Delete ${student.name}" onclick="deleteStudent(${student.id})"><i class="fa-solid fa-trash"></i></button></td></tr>`;
});
}

document.getElementById("totalStudents").innerHTML = students.length;
if(pagination){
if(!filteredStudents.length){ pagination.innerHTML = ""; return; }
pagination.innerHTML = `<span>Showing ${start + 1}-${Math.min(start + recordsPerPage, filteredStudents.length)} of ${filteredStudents.length}</span><div><button type="button" onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>Previous</button><span class="page-count">Page ${currentPage} of ${totalPages}</span><button type="button" onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>Next</button></div>`;
}




if(!table)
return;




students =
JSON.parse(
localStorage.getItem("students")
) || [];



table.innerHTML="";





students.forEach(
(student,index)=>{


table.innerHTML += `

<tr>


<td>${index+1}</td>


<td>${student.photo ? `<img class="student-photo" src="${student.photo}" alt="${student.name}">` : `<span class="photo-placeholder" aria-label="No photo"><i class="fa-solid fa-user"></i></span>`}</td>


<td>${student.name}</td>


<td>${student.address}</td>


<td>${student.contact}</td>


<td>${student.email}</td>


<td>${student.roll}</td>


<td>${student.faculty}</td>



<td>


<button 
class="edit-btn"
onclick="editStudent(${student.id})">

<i class="fa-solid fa-pen"></i>

</button>



<button
class="delete-btn"
onclick="deleteStudent(${student.id})">


<i class="fa-solid fa-trash"></i>


</button>


</td>

</tr>


`;



});





document.getElementById(
"totalStudents"
).innerHTML = students.length;



}







// =======================================
// DELETE STUDENT
// =======================================


function deleteStudent(id){

if(!confirm("Are you sure you want to delete this student record?")){
return;
}


students =
students.filter(
student=>student.id != id
);



localStorage.setItem(

"students",

JSON.stringify(students)

);



loadStudents();



}






// =======================================
// EDIT STUDENT
// =======================================


function editStudent(id){



let student =
students.find(
student=>student.id==id
);




document.getElementById(
"studentId"
).value =
student.id;



document.getElementById(
"name"
).value =
student.name;



document.getElementById(
"address"
).value =
student.address;



document.getElementById(
"contact"
).value =
student.contact;



document.getElementById(
"studentEmail"
).value =
student.email;



document.getElementById(
"roll"
).value =
student.roll;



document.getElementById(
"faculty"
).value =
student.faculty;

selectedPhoto = student.photo || "";
if(photoPreview){
photoPreview.src = selectedPhoto;
photoPreview.classList.toggle("has-photo", Boolean(selectedPhoto));
document.getElementById("photoDropZone").classList.toggle("has-photo", Boolean(selectedPhoto));
}



window.scrollTo({

top:0,

behavior:"smooth"

});



}







// =======================================
// SEARCH STUDENT
// =======================================

// Restored table renderer: displays every student record in FIFO order.



function searchStudent(){

currentPage = 1;
loadStudents();
return;



let value =
document.getElementById(
"search"
).value.toLowerCase();



let rows =
document.querySelectorAll(
"#studentTable tr"
);




rows.forEach(row=>{


let text =
row.innerText.toLowerCase();



if(text.includes(value)){


row.style.display="";


}

else{


row.style.display="none";


}



});



}
