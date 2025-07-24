const password1Input = document.querySelector('#password1');
const eyeIcons1List = document.querySelectorAll("#eye1");
localStorage.setItem("time", 60)

let hidden1Icon;
// тут ми пишмео код який перивіряє чи треба відчиняти/закривати пароль
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
        }
    }
)


// код который сделает так чтобы если человек что то не так ввел, то после обновления оно опять не тряслось
if (performance.navigation.type === 1) {
    console.log("Страница обновлена (F5 или кнопка)");
    document.querySelector("#clear-form").submit();
}


// проверка пароля по всем правилам

// проверка пароля по всем правилам
let validatorpassword = [
    { regex: /.{8}/ },     
    { regex: /[0-9]/ },    
    { regex: /[a-zA-Z]/ }
]

// получаем все переменніе 
let allrules = document.querySelectorAll(".list-item")
let passwordInput = document.querySelector(".password-input")

passwordInput.addEventListener(
    'keyup',
    () => {
        validatorpassword.forEach((item, index) => {
            console.log("rabotaem")
            // если все таки как то удалось ввести что то кроме латиницы и букв
            passwordInput.value = passwordInput.value.replace(/[^a-zA-Z0-9-]/g, '');
            // проверяем валидность пароля по всем правилам
            let isValid = item.regex.test(passwordInput.value);
            // если валидный то добавляем класс checked
            // если не валидный то убираем класс checked
            if (isValid){
                console.log(index)
                allrules[index].classList.add("checked");
                if (index == 0){
                    const line = document.querySelector(".first-line");
                    line.style.opacity = "1";
                    line.style.width = "88%";
                    document.querySelector(".like1").style.display = "flex";
                    document.querySelector(".dislike1").style.display = "none";
                }
                if (index == 1){
                    const line = document.querySelector(".second-line");
                    line.style.opacity = "1";
                    line.style.width = "92%";
                    document.querySelector(".like2").style.display = "flex";
                    document.querySelector(".dislike2").style.display = "none";
                }
                if (index == 2){
                    const line = document.querySelector(".third-line");
                    line.style.opacity = "1";
                    line.style.width = "90%";
                    document.querySelector(".like3").style.display = "flex";
                    document.querySelector(".dislike3").style.display = "none";
                }
                // document.querySelector(".first-line").style.display = "flex";
            }else{
                allrules[index].classList.remove("checked");
                if (index == 0){
                    const line = document.querySelector(".first-line");
                    line.style.opacity = "1";
                    line.style.width = "0%";
                    document.querySelector(".like1").style.display = "none";
                    document.querySelector(".dislike1").style.display = "flex";
                }
                if (index == 1){
                    const line = document.querySelector(".second-line");
                    line.style.opacity = "1";
                    line.style.width = "0%";
                    document.querySelector(".like2").style.display = "none";
                    document.querySelector(".dislike2").style.display = "flex";
                }
                if (index == 2){
                    const line = document.querySelector(".third-line");
                    line.style.opacity = "1";
                    line.style.width = "0%";
                    document.querySelector(".like3").style.display = "none";
                    document.querySelector(".dislike3").style.display = "flex";
                }
            }
        })
    }
)
