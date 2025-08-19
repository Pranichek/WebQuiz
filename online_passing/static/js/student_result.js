const socket = io()

localStorage.setItem("flag_time", "true")


socket.on("next_question",
    data => {
        window.location.replace("/passing_student")
    }
)
socket.on("end_test",
    data => {
        window.location.replace("/finish_student")
    }
)

