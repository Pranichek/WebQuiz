function Blur() {
    document.querySelector(".background").style.filter = "blur(20px)";
}


const buttonList = document.querySelectorAll(".change")

for (let button of buttonList){
    button.addEventListener(
        'click',
        () => {
            if (button.value == "name"){
                document.querySelector(".change_name").style.display = "flex"
                document.querySelector(".change_phone").style.display = "none"
                document.querySelector(".change_password").style.display = "none"
                document.querySelector(".change_email").style.display = "none"
            }
            if (button.value == "phone_number"){
                document.querySelector(".change_phone").style.display = "flex"
                document.querySelector(".change_name").style.display = "none"
                document.querySelector(".change_password").style.display = "none"
                document.querySelector(".change_email").style.display = "none"
            }
            if (button.value == "password_button"){
                document.querySelector(".change_password").style.display = "flex"
                document.querySelector(".change_phone").style.display = "none"
                document.querySelector(".change_name").style.display = "none"
                document.querySelector(".change_email").style.display = "none"
            }
            if (button.value == "email") {
                document.querySelector(".change_email").style.display = "flex"
                document.querySelector(".change_password").style.display = "none"
                document.querySelector(".change_phone").style.display = "none"
                document.querySelector(".change_name").style.display = "none"
            }
        }
    )
}


let button_back = document.querySelector(".back_button")
button_back.addEventListener(
    "click",
    () => {
        document.querySelector(".change_password").style.display = "none"
    }
)

let phone_number = document.querySelector("#input_phone")

phone_number.addEventListener(
    'keyup',
    function () {
        if(!phone_number.value.startsWith("+380")){
            phone_number.value = "+380"
        }
    }
)
