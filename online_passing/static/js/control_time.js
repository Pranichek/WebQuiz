let stopButton = document.querySelector(".stop-button") 


stopButton.textContent = "Зупинити час"


socket.on("stop_time",
    data => {
        let checkdata = localStorage.getItem("flag_time")
        if (checkdata == "false"){
            localStorage.setItem("flag_time", "true")
        }else{
            localStorage.setItem("flag_time", "false")
        }

        if (localStorage.getItem("flag_time") == "false"){
            stopButton.textContent = "Запустити час"
        }else{
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