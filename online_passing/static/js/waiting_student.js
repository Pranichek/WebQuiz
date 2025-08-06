const socket_wait = io() 

socket_wait.emit(
    "reconnect",
    {code: localStorage.getItem("room_code_user")}
)

socket_wait.on("page_result",
    data => {
        window.location.replace("/result_student")
    }
)