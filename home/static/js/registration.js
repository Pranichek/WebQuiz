const password1Input = document.querySelector('#password1');
const eyeIcons1List = document.querySelectorAll("#eye1");
let hidden1Icon;

for (let eye1Icon of eyeIcons1List){
    eye1Icon.addEventListener(
        'click',
        function () {
            if(password1Input.type === 'password') {
                password1Input.type = 'text';
            }else {
                password1Input.type = 'password';
            }
            hidden1Icon = document.querySelector(".hidden1");
            console.log("15 hidden1 =", hidden1Icon)
            eye1Icon.classList.add("hidden1");
            console.log("eye1Icon.classList =", eye1Icon.classList)
            console.log("querySelectorAll('.hidden1') =", document.querySelectorAll(".hidden1"))
            hidden1Icon.classList.remove("hidden1");
            console.log("eye1Icon =", eye1Icon, "hidden1 =", hidden1Icon);
        }
    )
}


const password2Input = document.querySelector('#password2');
const eyeIcons2List = document.querySelectorAll("#eye2");
let hidden2Icon;

for (let eye2Icon of eyeIcons2List){
    eye2Icon.addEventListener(
        'click',
        function () {
            if(password2Input.type === 'password') {
                password2Input.type = 'text';
            }else {
                password2Input.type = 'password';
            }
            hidden2Icon = document.querySelector(".hidden2");
            console.log("15 hidden2 =", hidden2Icon)
            eye2Icon.classList.add("hidden2");
            console.log("eye2Icon.classList =", eye2Icon.classList)
            console.log("querySelectorAll('.hidden2') =", document.querySelectorAll(".hidden2"))
            hidden2Icon.classList.remove("hidden2");
            console.log("eye2Icon =", eye2Icon, "hidden2 =", hidden2Icon);
        }
    )
}


window.addEventListener('load', () => {
    if(document.querySelector(".email").classList.length >= 3){

        setTimeout(() => {
            document.querySelector(".email").classList.remove("email_input");
            },  1000);
    }
    if(document.querySelector(".confirm_password").classList.length >= 3){
        setTimeout(() => {
            document.querySelector(".confirm_password").classList.remove("conf_password");
            },  1000);
    }
    if(document.querySelector(".phone").classList.length >= 3){
        setTimeout(() => {
            document.querySelector(".phone").classList.remove("phone_shake");
            },  1000);
    }
})
// function Shake() {
    
// }

let phone_number = document.querySelector("#input_phone")

phone_number.addEventListener(
    'keyup',
    function () {
        if(!phone_number.value.startsWith("+380")){
            phone_number.value = "+380"
            document.querySelector(".da").classList.add("email_input")
            console.log(document.querySelector(".da").classList) 

            setTimeout(() => {
                document.querySelector(".da").classList.remove("email_input");
              },  1000);
        }
    }
)

// function randomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min)) + min;
//   }