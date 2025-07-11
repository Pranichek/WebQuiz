const urlParamsStudent = new URLSearchParams(window.location.search);
const room_code = urlParamsStudent.get('room_code');
localStorage.setItem("room_code_user", room_code)

const chat = document.querySelector(".messages");
chat.innerHTML = ""; 



const socket = io(); 

const username = document.querySelector(".save-nickname").textContent;  
let room_code_user = localStorage.getItem("room_code_user")

socket.on('connect', () => {
   socket.emit('join_room', { username: username, room: room_code_user });
});

// Получение сообщений из комнаты
socket.on('receive_message', (data) => {
    const chat = document.querySelector(".messages");
    chat.innerHTML += `<div class="message another-user">
                            <p>${data["message"]}</p>
                        </div>`;
});



// Отправка сообщеницу
const sendBtn = document.querySelector(".send-message");

sendBtn.addEventListener("click", () => {
    const msgInput = document.querySelector(".message-input");
    const text = msgInput.value;

    const chat = document.querySelector(".messages");
    chat.innerHTML += `<div class="message user">
                            <p>${text}</p>
                        </div>`;

    socket.emit('send_message', {
        sender: username,
        room: room_code_user,
        message: text,
        email: document.querySelector(".email").textContent,
        email_mentor: localStorage.getItem("email_mentor")
    });

    msgInput.value = '';
});

socket.on(
    'start_passing',
    data => {
        window.location.replace("/passing_student")
    }
)


socket.on(
    "load_chat",
    data => {
        const chat = document.querySelector(".messages");
        chat.innerHTML = ""; 

        localStorage.setItem("email_mentor", data["mentor_email"])

        let dataList = data["chat_data"]

        for (let dictData of dataList){
            if (dictData["email"] == document.querySelector(".email").textContent){
                const chat = document.querySelector(".messages");
                chat.innerHTML += `<div class="message user">
                            <p>${dictData["message"]}</p>
                        </div>`;
            }else{
                const chat = document.querySelector(".messages");
                chat.innerHTML += `<div class="message another-user">
                            <p>${dictData["message"]}</p>
                        </div>`;
            }
        }
    }
)
