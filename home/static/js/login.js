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