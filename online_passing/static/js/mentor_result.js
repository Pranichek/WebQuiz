const socket = io()

localStorage.setItem("flag_time", "true")

// чтобі не терять связ с комнатой
socket.emit(
    "connect_again",
    {code: localStorage.getItem("room_code")}
)

socket.on("next_question",
    data => {
        let index = localStorage.getItem("index_question");
        index = index + 1;
        localStorage.setItem("index_question", index);
        window.location.replace("/passing_mentor")
    }
)

socket.on("end_test",
    data => {
        window.location.replace("/finish_mentor")
    }
)


document.querySelector(".next-question").addEventListener(
    'click',
    () => {
        socket.emit('next_one', {
            index: localStorage.getItem("index_question"),
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
        })
    }
)

