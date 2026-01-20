const foggy = document.querySelector("#overlay")
const windowChoice = document.querySelector(".window-end")

function closeWindow() {
    windowChoice.classList.remove("active")
    foggy.classList.remove("active")
    document.querySelector(".window-choice").classList.remove("active")
}

document.querySelector(".end-test").addEventListener('click', () => {
    windowChoice.classList.add("active")
    foggy.classList.add("active")
})

document.querySelector(".decline-ending").addEventListener('click', closeWindow)

foggy.addEventListener('click', closeWindow)


document.querySelector(".end_test").addEventListener(
    'click',
    () => {
        socket.emit(
            'alarm-end',
            {
                code: localStorage.getItem("room_code"),
                index: localStorage.getItem("index_question")
            }
        )

        window.location.replace("/finish_mentor")
    }
)