// let listSpan = document.querySelector('.password')

// listSpan.addEventListener(
//     'click',
//     function () {
//         let passwordinput = listSpan.previousElementSibling

//         if(passwordinput.type === 'password') {
//             passwordinput.type = 'text'
//             listSpan.textContent = "👀"
//         }
//         else {
//             passwordinput.type = 'password'
//             listSpan.textContent = "🫣"
//         }
//     }
// )
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