// pолучаем из URL параметр room_code
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const socket = io(); 

const room = getQueryParam('room_code');
const username = document.querySelector(".save-nickname").value; 

socket.on("kicked", (data) => {
    alert(data.reason || "You were kicked from the room");
    socket.disconnect();
    window.location.href = "/";
});

socket.on('connect', () => {
    socket.emit("join_room", {
        username: username,
        room: room
    });
    console.log("trying to join the room");
});

// Получение сообщений из комнаты
socket.on('receive_message', data => {
    const chat = document.getElementById('chat');
    const msg = document.createElement('p');
    msg.innerText = `${data.sender}: ${data.message}`;
    chat.appendChild(msg);
});

// Отправка сообщеницу
function sendMessage() {
    const msgInput = document.querySelector("#msg");
    const text = msgInput.value;
    msgInput.value = "";

    socket.emit('send_message', {
        sender: username,
        room: room,
        message: text
    });
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);

function leaveRoom() {
    // socket.leave(room);
    socket.emit(
        'leave_room',
        {
            username: username,
            room: room
        });
    socket.disconnect();
}

window.addEventListener('beforeunload', function(event) {
    leaveRoom();
})
