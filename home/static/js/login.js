const passwordInput = document.querySelector('#password');
const eyeIconsList = document.querySelectorAll("#eye");
let hiddenIcon;

for (let eyeIcon of eyeIconsList){
    eyeIcon.addEventListener(
        'click',
        function () {
            if(passwordInput.type === 'password') {
                passwordInput.type = 'text';
            }else {
                passwordInput.type = 'password';
            }
            hiddenIcon = document.querySelector(".hidden");
            eyeIcon.classList.add("hidden");
            hiddenIcon.classList.remove("hidden");
            console.log("eyeIcon =", eyeIcon, "hidden =", hiddenIcon);
        }
    )
}


window.addEventListener('load', () => {
    if(document.querySelector(".input_email").classList.length >= 3){
        setTimeout(() => {
            document.querySelector(".input_email").classList.remove("email_input");
            },  1000);
    }
    if(document.querySelector(".input_password").classList.length >= 3){
        setTimeout(() => {
            document.querySelector(".input_password").classList.remove("password");
            },  1000);
    }
})

// function Reset() {
//     document.querySelector("#form").reset();
// }

// код который сделает так чтобы если человек что то не так ввел, то после обновления оно опять не тряслось
if (performance.navigation.type === 1) {
    console.log("Страница обновлена (F5 или кнопка)");
    document.querySelector("#clear-form").submit();
}
