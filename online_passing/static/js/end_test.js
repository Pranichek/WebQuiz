const windowChoice = document.querySelector(".window-end")

function closeWindow() {
    windowChoice.classList.remove("active")
    foggy.classList.remove("active")
    const choiceWindow = document.querySelector(".window-choice")
    if(choiceWindow) choiceWindow.classList.remove("active")
}

document.querySelector(".open-modal-btn").addEventListener('click', () => {
    windowChoice.classList.add("active")
})

document.querySelector(".decline-ending").addEventListener('click', closeWindow)


document.querySelector(".window-end .end_test").addEventListener('click', () => {
    socket.emit('alarm-end', {
        code: localStorage.getItem("room_code"),
        index: localStorage.getItem("index_question")
    })

    window.location.replace("/finish_mentor")
})