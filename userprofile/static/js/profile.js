function Blur() {
    document.querySelector(".background").style.filter = "blur(20px)";
}


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
                document.querySelector(".change_name").style.display = "flex"
                button.style.display = "none"
                document.getElementById('foo').disabled = false;
                document.getElementById('foo').style.borderBottom = '1px #7291B8 solid';
            }
            if (button.value == "phone_number"){
                document.querySelector(".change_phone").style.display = "flex";
                button.style.display = "none"
                document.getElementById('phone_form').value = '+380'
                document.getElementById('phone_form').disabled = false;
                document.getElementById('phone_form').style.borderBottom = '1.5px #7291B8 solid';
                setTimeout(() => {
                    document.getElementById('phone_form').classList.add('active');
                  }, 300);
            }
            if (button.value == "password_button"){
                document.querySelector(".change_password").style.display = "flex"
            }
            if (button.value == "email") {
                document.querySelector(".change_email").style.display = "flex"
                button.style.display = "none"
                document.getElementById('email-form').value = ''
                document.getElementById('email-form').disabled = false;
                document.getElementById('email-form').style.borderBottom = '1px #7291B8 solid';
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
    }
)

function Logout(){
    document.querySelector(".confirm-logout").style.display = "flex";
    document.querySelector(".confirm-delete").style.display = "none";
    document.querySelector(".change_password").style.display = "none";
}

function DeletAccount(){
    document.querySelector(".confirm-delete").style.display = "flex";
    document.querySelector(".confirm-logout").style.display = "none";
    document.querySelector(".change_password").style.display = "none";
}


function ChangePassword(){
    document.querySelector(".change_password").style.display = "flex";
    document.querySelector(".confirm-logout").style.display = "none";
    document.querySelector(".confirm-delete").style.display = "none";
}

function CloseLogout(){
    document.querySelector(".confirm-logout").style.display = "none";
    document.querySelector(".confirm-delete").style.display = "none";
    document.querySelector(".change_password").style.display = "none";
}

