const socket = io();

function limitCharacters(event) {
    if (document.getElementById('limitedInput').value.length >= 2) {
      event.preventDefault();
    }
  }


var pinContainer = document.querySelector(".input-code");

pinContainer.addEventListener('keyup', function (event) {
    var target = event.srcElement;
    
    var maxLength = parseInt(target.attributes["maxlength"].value, 10);
    var myLength = target.value.length;

    if (myLength >= maxLength) {
        var next = target;
        while (next = next.nextElementSibling) {
            if (next == null) break;
            if (next.tagName.toLowerCase() == "input") {
                next.focus();
                break;
            }
        }
    }

    if (myLength === 0) {
        var next = target;
        while (next = next.previousElementSibling) {
            if (next == null) break;
            if (next.tagName.toLowerCase() == "input") {
                next.focus();
                break;
            }
        }
    }
}, false);

pinContainer.addEventListener('keydown', function (event) {
    var target = event.srcElement;
    target.value = "";
}, false);

let timer = 60
let timerp = document.querySelector(".time")

let againButton = document.querySelector(".again")
let enterButton = document.querySelector(".submit")

againButton.addEventListener(
    'click',
    () => {
        againButton.style.display = "none"
        localStorage.setItem("time", 20)
        socket.emit("clear_code", {"flag": "clear"})
        location.reload()
    }
)

const buttonAgain = () => {
    againButton.style.display = "flex"
    enterButton.style.backgroundColor = "gray"
}


function decrement(){
    if (timer > 0){
        timer--
        localStorage.setItem("time", timer)
        timerp.innerText = `00 : ${localStorage.getItem("time")}`

        if (timer <= 0) {
            buttonAgain()
            againButton.style.display = "flex"
            // document.querySelector(".send").submit()
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

        console.log("Time from localStorage:", time);

        if (time <= 0) {
            buttonAgain()
        }
    }
)