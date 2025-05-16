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