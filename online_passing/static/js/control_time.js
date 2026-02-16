let stopButton = document.querySelector(".stop-button") 


stopButton.addEventListener(
    'click',
    () => {
        socket.emit("stopTime", {"code":localStorage.getItem("room_code")});
    }
)

const pauseBtn = document.querySelector('.stop-button')

function updatePauseButton() {
    const isRunning = localStorage.getItem("flag_time") === "true"
    if (isRunning) {
        pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
    } else {
        pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
    }
}

updatePauseButton()

pauseBtn.addEventListener('click', () => {
    const isRunning = localStorage.getItem("flag_time") === "true"
    
    if(isRunning) {
        localStorage.setItem("flag_time", "false")
        socket.emit("update_student_time_MS", { room: localStorage.getItem("room_code"), time: "stop" })
    } else {
        localStorage.setItem("flag_time", "true")
        let currentTime = parseInt(localStorage.getItem("time_flag"))
        socket.emit("update_student_time_MS", { room: localStorage.getItem("room_code"), time: currentTime })
    }
    updatePauseButton()
})