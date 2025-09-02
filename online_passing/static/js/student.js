const urlParamsStudent = new URLSearchParams(window.location.search);
const room_code = urlParamsStudent.get('room_code');

localStorage.setItem("room_code", room_code)
localStorage.setItem("index_question", "0")
localStorage.setItem("flag_time", "true")
localStorage.setItem("users_answers", "")
localStorage.setItem('time_question', "set")

const chat = document.querySelector(".messages");
chat.innerHTML = ""; 


const socket = io(); 

const username = document.querySelector(".save-nickname").textContent;  
let room_code_user = localStorage.getItem("room_code")

socket.on('connect', () => {
   socket.emit('join_room', { username: username, room: room_code_user, email: document.querySelector(".email").textContent, flag: "student"});
});

// Получение сообщений из комнаты
socket.on('receive_message', (data) => {
    const chat = document.querySelector(".messages");
    chat.innerHTML += `<div class="message another-user">
                            <p>${data["message"]}</p>
                        </div>`;
});

// список подключенных
socket.on("update_users", (users) => {
    const blockUsers = document.querySelector(".icons-users")

    blockUsers.innerHTML = "";

    users.forEach(user => {
        if (user.email != document.querySelector(".email").textContent){
            const blockDiv = document.createElement("div");
            blockDiv.classList.add("block");

            const infDiv = document.createElement("div");
            infDiv.classList.add("inf");

            const avatarImg = document.createElement("img");
            avatarImg.classList.add("ava");
            avatarImg.src = user.user_avatar

            const usernameP = document.createElement("p");
            usernameP.textContent = user.username;

            infDiv.appendChild(avatarImg);
            infDiv.appendChild(usernameP);

            const blockTextDiv = document.createElement("div");
            blockTextDiv.classList.add("block-text");

            const emailP = document.createElement("p");
            emailP.textContent = user.email;

            const blockPetDiv = document.createElement("div");
            blockPetDiv.classList.add("block-pet");

            const petImg = document.createElement("img");
            petImg.classList.add("pet");
            petImg.src = user.pet_img

            blockPetDiv.appendChild(petImg);

            blockTextDiv.appendChild(emailP);
            blockTextDiv.appendChild(blockPetDiv);

            blockDiv.appendChild(infDiv);
            blockDiv.appendChild(blockTextDiv);

            blockUsers.appendChild(blockDiv);
        }
    });

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
        localStorage.setItem("test_id", data["id_test"])

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


socket.on("leave_user",
    data => {
        if (data["email"] == document.querySelector(".email").textContent){
            window.location.replace("/")
        }
    }
)

socket.on("fake_room",
    data => {
        if (data["email"] == document.querySelector(".email").textContent){
            window.location.replace("/")
        }
    }
)