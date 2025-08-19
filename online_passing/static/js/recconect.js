socket.emit(
    "connect_again",
    {code: localStorage.getItem("room_code")}
)

