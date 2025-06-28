const urlParams = new URLSearchParams(window.location.search);
const room_code = urlParams.get('room_code');
localStorage.setItem("room_code", room_code)

function loadRoom() {
    const socket = io();

    // тупая штука которая получает квери параметры из поискового пути
    const urlParams = new URLSearchParams(window.location.search);
    const id_test = urlParams.get('id_test');

    const username = document.querySelector(".mentor_name").textContent; 
    let code = localStorage.getItem("room_code")

    socket.emit('join_room', {
        username: username,
        room: code,
        id_test: id_test
    });

    socket.on('user_joined', (data) => {
        console.log(`${data.username} приєднався до кімнати`);
    });

    socket.on(
        "start_passing",
        () => {
            window.location.replace("/passing_mentor")
        }
    )

    // когда пришло новое сообщение
    socket.on('receive_message', (data) => {
        const chat = document.querySelector(".chat-box");
        chat.innerHTML += `<div><b>${data.sender}:</b> ${data.message}</div>`;
    });

    const startTest = document.querySelector(".start")
    startTest.addEventListener(
        "click",
        () => {
            socket.emit("start_passing", {
                room: code
            })
        }
    )

    const sendBtn = document.querySelector(".send-message");
    
    sendBtn.addEventListener("click", () => {
        const msgInput = document.querySelector(".message-input");
        const text = msgInput.value;

        socket.emit('send_message', {
            sender: username,
            room: code,
            message: text
        });
    });


    const copyCode = document.querySelector(".copy-code")

    copyCode.addEventListener(
        'click',
        () => {
            let code = localStorage.getItem("room_code")

            socket.emit('copy_code', {
                code_room: code
            });
        }
    )

    const copyLink = document.querySelector(".copy-url")

    copyLink.addEventListener(
        'click',
        () => {
            let code = localStorage.getItem("room_code")
            let link = window.location.origin + `/student?room_code=${code}`

            socket.emit('copy_link', {
                link_room: link
            });
        }
    )
}

window.addEventListener("DOMContentLoaded", loadRoom);