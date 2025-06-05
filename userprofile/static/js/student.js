// pолучаем из URL параметр room_code
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
const socket = io(); 

const room = getQueryParam('room_code');
const username = "Shopa Slona";  


socket.on('connect', () => {
    socket.emit('join_room', { username, room });
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
