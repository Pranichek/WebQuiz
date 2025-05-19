
document.getElementById('foo').addEventListener(
    'input',
    () => {
        document.querySelector(".new_name").value = document.getElementById('foo').value
    }
)

document.getElementById('email-form').addEventListener(
    'input',
    () => {
        document.querySelector(".new_email").value = document.getElementById('email-form').value
    }
)

document.getElementById('phone_form').addEventListener(
    'input',
    () => {
        document.querySelector(".new_phone").value = document.getElementById('phone_form').value
    }
)

const buttonList = document.querySelectorAll(".change")

for (let button of buttonList){
    button.addEventListener(
        'click',
        () => {
            if (button.value == "name"){
                document.getElementById('foo').style.border = "flex";
                document.getElementById('foo').style.borderBottom = '1px #7291B8 solid';
                document.querySelector(".change_name").style.display = "flex"
                button.style.display = "none"
                document.getElementById('foo').style.transition = '0s';

                document.getElementById('foo').value = ''
                document.getElementById('foo').disabled = false;
                // if (window.getComputedStyle(foo).width == '0%'){
                document.getElementById('foo').style.width = '0%';
                // }
                
                setTimeout(() => {
                    document.getElementById('foo').style.transition = '1s';
                    document.getElementById('foo').style.width = "100%";
                }, 50);
            }
            if (button.value == "phone_number"){
                document.querySelector(".change_phone").style.display = "flex";
                button.style.display = "none"
                document.getElementById('phone_form').value = '+380'
                document.getElementById('phone_form').disabled = false;
                document.getElementById('phone_form').style.width = '0%';
                document.getElementById('phone_form').style.borderBottom = '1px #7291B8 solid';
                document.getElementById('phone_form').style.transition = '0s';
                setTimeout(() => {
                    document.getElementById('phone_form').classList.add('active');
                  }, 300);

                setTimeout(() => {
                    document.getElementById('phone_form').style.transition = '1s';
                    document.getElementById('phone_form').style.width = "100%";
                }
                , 50);
                document.getElementById('phone_form').style.borderBottom = '1px #7291B8 solid';
            }
            if (button.value == "password_button"){
                document.querySelector(".change_password").style.display = "flex"
            }
            if (button.value == "email") {
                document.querySelector(".change_email").style.display = "flex"
                button.style.display = "none"
                document.getElementById('email-form').value = ''
                document.getElementById('email-form').disabled = false;
                const emailForm = document.getElementById('email-form');
                emailForm.style.transition = '0s';
                emailForm.style.width = '0px';
                // emailForm.style.transition = 'width 0.3s ease';
                emailForm.style.borderBottom = '1px #7291B8 solid';

                setTimeout(() => {
                    emailForm.style.transition = 'width 1s ease';
                    emailForm.style.width = '140%'; // або конкретна ширина в px, наприклад '250px'
                }, 50);

                // setTimeout(() => {
                //     document.getElementById('email-form').style.width = "160%";
                // }, 50);
            }
        }
    )
}





let phone_number = document.getElementById("phone_form")

phone_number.addEventListener(
    'keyup',
    function () {
        // проверяем чтобі чувак мог вводить только числа , g - єто проверка всей строки чтобі например он не смог встаивть текст, если не будет g то будет проверяться лишь один символ
        phone_number.value = phone_number.value.replace(/[^0-9+]/g, '');

        if(!phone_number.value.startsWith("+380")){
            phone_number.value = "+380"
        }
    }
)



window.addEventListener(
    'load',
    () => {
        // чтобы ширина инпута почты всегда была нормальной
        document.querySelector(".input_email").style.width = ((document.querySelector(".input_email").value.length + 1) * 11) + 'px';

        document.getElementById('foo').style.transition = '1.2s';
        document.getElementById('foo').style.width = '0%';

        const emailForm = document.getElementById('email-form');
        emailForm.style.transition = '0s';
        emailForm.style.width = '0px';

        document.getElementById('phone_form').style.width = '0%';
        document.getElementById('phone_form').style.transition = '0s';

        let AvatarImage = document.querySelector(".avatar")
        
        console.log("AvatarImage.dataset.size =", AvatarImage.dataset.size)
        // подгружаем размер картинки тот что установил пользователь
        AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
        AvatarImage.style.height = `${AvatarImage.dataset.size}%`;
        
        setTimeout(() => {
            document.getElementById('foo').value = document.getElementById('foo').dataset.name;
            document.getElementById('foo').style.border = "none";
            document.getElementById('foo').style.width = '100%';
        }, 100);

        setTimeout(() => {
            emailForm.style.transition = 'width 1.2s ease';
            emailForm.style.width = '140%'; // або конкретна ширина в px, наприклад '250px'
        }, 100);

        setTimeout(() => {
            document.getElementById('phone_form').style.transition = '1.2s';
            document.getElementById('phone_form').style.width = "100%";
        }
        , 100);
    }
)

function Logout(){
    document.querySelector(".modal").style.opacity = "1";
    let modal = document.querySelector(".modal");
    let changePassword = document.querySelector(".confirm-logout");

    modal.style.display = "flex";
    changePassword.style.display = "flex";
    changePassword.style.transition = "0.5s";
    changePassword.style.transform = "translateY(100%)";
    changePassword.style.opacity = "0";
    modal.style.opacity = "0";

    setTimeout(() => {
        changePassword.style.transform = "translateY(-50%)";
        modal.style.transition = "0.5s";
        modal.style.opacity = "1";
        changePassword.style.opacity = "1";
    }, 50);

    document.querySelector(".confirm-delete").style.display = "none";
    document.querySelector(".change_password").style.display = "none";
}

function DeletAccount(){
    document.querySelector(".modal").style.opacity = "1";
    let modal = document.querySelector(".modal");
    let confirmDelete = document.querySelector(".confirm-delete");

    modal.style.display = "flex";
    confirmDelete.style.display = "flex";
    confirmDelete.style.transition = "0.5s";
    confirmDelete.style.transform = "translateY(100%)";
    confirmDelete.style.opacity = "0";
    modal.style.opacity = "0";

    setTimeout(() => {
        confirmDelete.style.transform = "translateY(-50%)";
        modal.style.transition = "0.5s";
        modal.style.opacity = "1";
        confirmDelete.style.opacity = "1";
    }, 50);

    document.querySelector(".confirm-logout").style.display = "none";
    document.querySelector(".change_password").style.display = "none";
}


function ChangePassword(){
    document.querySelector(".modal").style.opacity = "1";
    let modal = document.querySelector(".modal");
    let changePassword = document.querySelector(".change_password");

    modal.style.display = "flex";
    changePassword.style.display = "flex";
    changePassword.style.transition = "0.5s";
    changePassword.style.transform = "translateY(100%)";
    changePassword.style.opacity = "0";
    modal.style.opacity = "0";

    setTimeout(() => {
        changePassword.style.transform = "translateY(-50%)";
        modal.style.transition = "0.5s";
        modal.style.opacity = "1";
        changePassword.style.opacity = "1";
    }, 50);

    document.querySelector(".confirm-logout").style.display = "none";
    document.querySelector(".confirm-delete").style.display = "none";
}

function CloseLogout(){
    setTimeout(() => {
        // modal.style.transition = "0.5s";
        document.querySelector(".confirm-delete").style.transform = "translateY(100%)";
        document.querySelector(".confirm-delete").style.opacity = "0";
        document.querySelector(".confirm-logout").style.transform = "translateY(100%)";
        document.querySelector(".confirm-logout").style.opacity = "0";
        document.querySelector(".change_password").style.transform = "translateY(100%)";
        document.querySelector(".change_password").style.opacity = "0";
        document.querySelector(".modal").style.opacity = "0";
    }, 50);

    setTimeout(() => {
        document.querySelector(".modal").style.display = "none";
        document.querySelector(".confirm-logout").style.display = "none";
        document.querySelector(".confirm-delete").style.display = "none";
        document.querySelector(".change_password").style.display = "none";
    }, 500);
}


function DenyName(){
    document.querySelector(".change_name").style.display = "none";
    document.getElementById('foo').disabled = true;
    document.getElementById("change1").style.display = "flex";
    document.getElementById('foo').style.width = '100%';
    document.getElementById('foo').style.borderBottom = '1px #7291B8 solid';

    setTimeout(() => {
        document.getElementById('foo').style.width = "0%";
    }, 50);
    
    setTimeout(() => {
        document.getElementById('foo').value = document.getElementById('foo').dataset.name;
        document.getElementById('foo').style.border = "none";
        document.getElementById('foo').style.width = '100%';
    }, 1000);
}

function DenyPhone(){
    document.querySelector(".change_phone").style.display = "none";
    document.getElementById('phone_form').disabled = true;
    document.getElementById("change3").style.display = "flex";
    document.getElementById('phone_form').style.width = '100%';
    document.getElementById('phone_form').style.borderBottom = '1px #7291B8 solid';
    setTimeout(() => {
        document.getElementById('phone_form').style.width = "0%";
    }, 50);
    
    setTimeout(() => {
        document.getElementById('phone_form').value = document.getElementById('phone_form').dataset.phone;
        document.getElementById('phone_form').style.border = "none";
        document.getElementById('phone_form').style.width = '100%';
    }, 1000);
}

function DenyEmail(){
    document.querySelector(".change_email").style.display = "none";
    // button.style.display = "flex";
    document.getElementById('email-form').disabled = true;
    document.getElementById("change2").style.display = "flex";
    document.getElementById('email-form').style.width = '100%';
    document.getElementById('email-form').style.borderBottom = '1px #7291B8 solid';
    setTimeout(() => {
        document.getElementById('email-form').style.width = "0%";
    }, 50);
    setTimeout(() => {
        document.getElementById('email-form').value = document.getElementById('email-form').dataset.email;
        document.getElementById('email-form').style.border = "none";
        document.getElementById('email-form').style.width = '140%';
    }, 1000);
}



// Отрыть/закрыть пароль
const password1Input = document.querySelector(".password-input")
const eyeIcons1List = document.querySelectorAll("#eye1");

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
            eye1Icon.classList.add("hidden1");
            hidden1Icon.classList.remove("hidden1");
        }
    )
}


const password2Input = document.querySelector(".new_password")
const eyeIcons2List = document.querySelectorAll("#eye2");

let hidden2Icon;
// тут ми пишмео код який перивіряє чи треба відчиняти/закривати пароль
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
            eye2Icon.classList.add("hidden2");
            hidden2Icon.classList.remove("hidden2");
        }
    )
}


const password3Input = document.querySelector(".confirm-password")
const eyeIcons3List = document.querySelectorAll("#eye3");

let hidden3Icon;
// тут ми пишмео код який перивіряє чи треба відчиняти/закривати пароль
for (let eye3Icon of eyeIcons3List){
    eye3Icon.addEventListener(
        'click',
        function () {
            if(password3Input.type === 'password') {
                password3Input.type = 'text';
            }else {
                password3Input.type = 'password';
            }
            hidden3Icon = document.querySelector(".hidden3");
            eye3Icon.classList.add("hidden3");
            hidden3Icon.classList.remove("hidden3");
        }
    )
}


// код для того чтобы пользователю показывало что надо изменять в пароле чтобы он был праивльнм

let validatorpassword = [
    { regex: /.{8}/ },     
    { regex: /[0-9]/ },    
    { regex: /[a-zA-Z]/ }
]

// получаем все переменніе 
let allrules = document.querySelectorAll(".list-item")
let passwordInput = document.querySelector(".new_password")

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
