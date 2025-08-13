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

socket.on(
    "last_answers",
    data => {
        let answers = localStorage.getItem("users_answers").split(",")
        let lastAnswers = answers[parseInt(localStorage.getItem("index_question")) + 1]
        socket.emit(
            "student_answers",
            {lastanswers: lastAnswers, 
            code: localStorage.getItem("room_code_user"),
            id_test: localStorage.getItem("test_id"),
            index: localStorage.getItem("index_question"),
            }
        )
    }
)