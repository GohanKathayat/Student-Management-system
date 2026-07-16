// =====================================
// STUDENT MANAGEMENT SYSTEM AUTH
// =====================================


// =====================================
// CREATE DEFAULT ADMIN ACCOUNT
// =====================================

let users = JSON.parse(localStorage.getItem("users")) || [];

function showAuthMessage(form, message){
    let status = form.querySelector(".form-message");
    if(!status){
        status = document.createElement("p");
        status.className = "form-message";
        status.setAttribute("role", "alert");
        form.prepend(status);
    }
    status.textContent = message;
}


const adminExist = users.some(
    user => user.role === "admin"
);


if(!adminExist){

    users.push({

        username:"Administrator",
        email:"admin@gmail.com",
        password:"admin123",
        role:"admin"

    });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}



// =====================================
// SIGN UP SYSTEM
// =====================================

const signupForm = document.getElementById("signupForm");


if(signupForm){


signupForm.addEventListener("submit",function(e){

    e.preventDefault();


    let username =
    document.getElementById("username").value.trim();


    let email =
    document.getElementById("email").value.trim();


    let password =
    document.getElementById("password").value;


    let confirmPassword =
    document.getElementById("confirmPassword").value;



    // Password check

    if(password !== confirmPassword){

        showAuthMessage(signupForm, "Passwords do not match.");
        return;

    }



    // Get users

    let users =
    JSON.parse(localStorage.getItem("users")) || [];



    // Email duplicate check

    let existingUser =
    users.find(
        user => user.email === email
    );


    if(existingUser){

        showAuthMessage(signupForm, "This email is already registered.");
        return;

    }



    // Create new user

    let newUser = {


        id:Date.now(),

        username:username,

        email:email,

        password:password,


        // Every signup is normal user

        role:document.getElementById("role").value


    };



    users.push(newUser);



    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );



    // Go to login page

    window.location.href="index.html";


});

}



// =====================================
// LOGIN SYSTEM
// =====================================


const loginForm =
document.getElementById("loginForm");



if(loginForm){


loginForm.addEventListener(
"submit",
function(e){


e.preventDefault();



let email =
document.getElementById("email").value.trim();



let password =
document.getElementById("password").value;



let users =
JSON.parse(
localStorage.getItem("users")
) || [];




// Find matching user


let currentUser =
users.find(

user =>

user.email === email &&

user.password === password

);




// Wrong login

if(!currentUser){

    showAuthMessage(loginForm, "Invalid email or password.");

    return;

}




// Save login user


localStorage.setItem(

"currentUser",

JSON.stringify(currentUser)

);





// Role based redirect


if(currentUser.role==="admin"){


window.location.href="admin.html";


}

else{


window.location.href="user.html";


}



});

}




// =====================================
// LOGOUT
// =====================================


function logout(){


localStorage.removeItem(
"currentUser"
);


window.location.href="index.html";


}




// =====================================
// CHECK USER LOGIN
// =====================================


function checkLogin(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!user){


window.location.href="index.html";


}


}




// =====================================
// CHECK ADMIN
// =====================================


function checkAdmin(){


let user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!user || user.role!=="admin"){


window.location.href="index.html";


}


}
