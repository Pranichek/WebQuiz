let createRooms = document.querySelectorAll(".loadroom")

for (let button of createRooms){
    button.addEventListener(
        'click',
        () => {
            location.replace(`/mentor?id_test=${button.value}&room_code=${button.dataset.test}`)
        }
    )
}

function loadRoom() {
    const socket = io();

    // тупая штука которая получает квери параметры из поискового пути
    const urlParams = new URLSearchParams(window.location.search);
    const id_test = urlParams.get('id_test');
    const room_code = urlParams.get('room_code');

    const username = "Mentor"; 

    socket.emit('join_room', {
        username: username,
        room: room_code,
        id_test: id_test
    });

    // Коли хтось приєднався
    socket.on('user_joined', (data) => {
        console.log(`${data.username} приєднався до кімнати`);
    });

    // когда пришло новое сообщение
    socket.on('receive_message', (data) => {
        const chat = document.querySelector(".chat-box");
        chat.innerHTML += `<div><b>${data.sender}:</b> ${data.message}</div>`;
    });

    const sendBtn = document.querySelector(".send-message");
    sendBtn.addEventListener("click", () => {
        const msgInput = document.querySelector(".message-input");
        const text = msgInput.value;
        // msgInput.value = "";

        socket.emit('send_message', {
            sender: username,
            room: room_code,
            message: text
        });
    });
}

window.addEventListener("DOMContentLoaded", loadRoom);