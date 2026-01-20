const socket = io();

function limitCharacters(event) {
    if (document.getElementById('limitedInput').value.length >= 2) {
      event.preventDefault();
    }
  }

const inputs = document.querySelectorAll(".input-tag");

inputs.forEach((input, index) => {
    input.addEventListener("focus", () => {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === "" || i == 5) {
                inputs[i].focus();
                break;
            }
        }
    });
    
    input.addEventListener("input", (e) => {
        const target = e.target;
        if (target.value.length > 1) {
            target.value = target.value.charAt(0);
        }
        if (target.value !== "" && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        const target = e.target;
        if (e.key === "Backspace") {
            if (target.value === "" && index > 0) {
                inputs[index - 1].value = "";
                inputs[index - 1].focus();
                e.preventDefault(); 
            }
        }
    });
});

let timer = 60
let timerp = document.querySelector(".time")

let againButton = document.querySelector(".again")
let enterButton = document.querySelector(".submit")

againButton.addEventListener(
    'click',
    () => {
        againButton.style.display = "flex"
        enterButton.classList.remove("disabled-btn");
        localStorage.setItem("time", 60)
    }
)

const buttonAgain = () => {
    againButton.style.display = "flex"
    enterButton.style.backgroundColor = "gray"
    enterButton.disabled = true
}


function decrement(){
    if (timer > 0){
        timer--
        localStorage.setItem("time", timer)
        timerp.innerText = `00 : ${localStorage.getItem("time")}`

        if (timer <= 0) {
            buttonAgain()
            againButton.style.display = "flex"
        }
    }
}

setInterval(decrement, 1000)




window.addEventListener(
    'DOMContentLoaded',
    () => {
        let time = localStorage.getItem("time")

        if (time) {
            timer = parseInt(time, 10);
            timerp.innerText = `00 : ${timer}`;
        } else {
            timerp.innerText = "00 : 60";
        }

        

        if (time <= 0) {
            buttonAgain()
        }else{
            enterButton.classList.remove("disabled-btn");
        }
    }
)

if (document.querySelector(".again").style.display === "flex") {
    enterButton.style.backgroundColor = "gray"
    enterButton.disabled = true
    enterButton.classList.remove("disabled-btn");
    document.querySelector(".check_text").textContent = "час триває"
}else{
    enterButton.disabled = false
    enterButton.classList.add("disabled-btn");
    document.querySelector(".check_text").textContent = "надіслати знову"
}