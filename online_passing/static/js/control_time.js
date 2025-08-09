let stopButton = document.querySelector(".stop-button") 


window.addEventListener(
    'DOMContentLoaded',
    () => {
        if (localStorage.getItem("flag_time") == "false"){
            stopButton.textContent = "Зупинити час"
        }else{
            stopButton.textContent = "Запустити час"
        }
    }
)

socket.on("stop_time",
    data => {
        let checkdata = localStorage.getItem("flag_time")
        if (checkdata == "false"){
            localStorage.setItem("flag_time", "true")
            stopButton.textContent = "Запустити час"
        }else{
            localStorage.setItem("flag_time", "false")
            stopButton.textContent = "Зупинити час"
        }
    }
)

stopButton.addEventListener(
    'click',
    () => {
        socket.emit("stopTime", {"code":localStorage.getItem("room_code")});
    }
)