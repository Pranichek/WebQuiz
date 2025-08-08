const socket = io()

localStorage.setItem("flag_time", "true")

// чтобі не терять связ с комнатой
socket.emit(
    "connect_again",
    {code: localStorage.getItem("room_code_user")}
)


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
