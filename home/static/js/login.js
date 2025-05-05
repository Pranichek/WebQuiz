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