const urlParams = new URLSearchParams(window.location.search);
const room_code = urlParams.get('room_code');
localStorage.setItem("room_code_user", room_code)



const socket = io(); 

const username = document.querySelector(".save-nickname").value;  
let room_code_user = localStorage.getItem("room_code_user")

socket.on('connect', () => {
   socket.emit('join_room', { username: "sd", room: room_code_user });
});

// Получение сообщений из комнаты
socket.on('receive_message', data => {
    const chat = document.getElementById('chat');
    const msg = document.createElement('p');
    msg.innerText = `${data.sender}: ${data.message}`;
    console.log(127162)
    chat.appendChild(msg);
});


// Отправка сообщеницу
function sendMessage() {
    const msgInput = document.querySelector("#msg");
    const text = msgInput.value;
    msgInput.value = "";

    socket.emit('send_message', {
        sender: username,
        room: room_code_user,
        message: text
    });
}

socket.on(
    'start_passing',
    data => {
        console.log(12)
        window.location.replace("/")
    }
)

// document.getElementById("sendBtn").addEventListener("click", sendMessage);
