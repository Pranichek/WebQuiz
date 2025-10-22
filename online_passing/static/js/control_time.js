let stopButton = document.querySelector(".stop-button") 


window.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log("1", localStorage.getItem("flag_time"))
        if (localStorage.getItem("flag_time") == "false"){
            stopButton.textContent = "Запустити час"
        }else{
            stopButton.textContent = "Зупинити час"
        }
    }
)

socket.on("stop_time",
    data => {
        let checkdata = localStorage.getItem("flag_time")
        if (checkdata == "false"){
            localStorage.setItem("flag_time", "true")
            stopButton.textContent = "Зупинити час"
        }else{
            localStorage.setItem("flag_time", "false")
            stopButton.textContent = "Запустити час"
        }
        console.log("2", localStorage.getItem("flag_time"))
    }
)

stopButton.addEventListener(
    'click',
    () => {
        socket.emit("stopTime", {"code":localStorage.getItem("room_code")});
    }
)