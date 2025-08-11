const urlParams = new URLSearchParams(window.location.search);
const room_code = urlParams.get('room_code');

localStorage.setItem("room_code", room_code)
localStorage.setItem("flag_time", "true")

const chat = document.querySelector(".messages");
chat.innerHTML = ""; 

function loadRoom() {
    const socket = io();

    // тупая штука которая получает квери параметры из поискового пути
    const urlParams = new URLSearchParams(window.location.search);
    const id_test = urlParams.get('id_test');

    
    const username = document.querySelector(".mentor_name").textContent; 
    let code = localStorage.getItem("room_code")

    socket.emit('join_room', {
        username: username,
        email: document.querySelector(".email").textContent,
        room: code,
        id_test: id_test,
        flag: "mentor"
    });

    socket.on('user_joined', (data) => {
        socket.emit(
            "mentor_email", 
            {
                email: document.querySelector(".email").textContent,
                room: code,
                id_test: id_test
            }
        )
    });

    // список подключенных
    socket.on("update_users", (users) => {
        console.log("Користувачі в кімнаті:", users);
        const blockUsers = document.querySelector(".users")

        blockUsers.innerHTML = "";

        users.forEach(user => {
            if (user.email != document.querySelector(".email").textContent){
                const blockDiv = document.createElement("div")
                blockDiv.classList.add("block")

                const infDiv = document.createElement("div")
                infDiv.classList.add("inf")

                const avatarImg = document.createElement("img")
                avatarImg.classList.add("ava")

                const usernameP = document.createElement("p")
                usernameP.textContent = user.username

                infDiv.appendChild(avatarImg)
                infDiv.appendChild(usernameP)

                const blockTextDiv = document.createElement("div")
                blockTextDiv.classList.add("block-text")

                const emailP = document.createElement("p")
                emailP.className = "email-paragraph"
                emailP.textContent = user.email

                const blockPetDiv = document.createElement("div")
                blockPetDiv.classList.add("block-pet")

                const petImg = document.createElement("img")
                petImg.classList.add("pet")


                blockPetDiv.appendChild(petImg)

                blockTextDiv.appendChild(emailP)
                blockTextDiv.appendChild(blockPetDiv)

                blockDiv.appendChild(infDiv)
                blockDiv.appendChild(blockTextDiv)

                blockUsers.appendChild(blockDiv)
            }
        });

        // видалення юзера із кімнати block

        allBlocks = document.getElementsByClassName("block");
        for (let block of allBlocks){
            
            block.addEventListener('click', ()=>{
                socket.emit(
                    "delete_user",
                    {
                        room: code,
                        email: block.querySelector(".email-paragraph").textContent
                    }
                )
            })
        }


    });

    socket.on(
        "start_passing",
        data => {
            localStorage.setItem("index_question", "0")
            localStorage.setItem("room_id", data.code)
            localStorage.setItem("test_id", id_test)
            window.location.replace("/passing_mentor")
        }
    )

    // когда пришло новое сообщение
    socket.on('receive_message', (data) => {
        const chat = document.querySelector(".messages");
        chat.innerHTML += `<div class="message another-user">
                                <p>${data["message"]}</p>
                                <p>${data["sender"]}</p>
                            </div>`;
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

        const chat = document.querySelector(".messages");
        chat.innerHTML += `<div class="message user">
                                <p>${text}</p>
                            </div>`;

        socket.emit('send_message', {
            sender: username,
            room: code,
            message: text,
            email: document.querySelector(".email").textContent,
            email_mentor: localStorage.getItem("email_mentor")
        });
        msgInput.value = ''
    });


    const copyCode = document.querySelector(".copy-code")

    copyCode.addEventListener(
        'click',
        () => {
            let code = localStorage.getItem("room_code")
            console.log("hii")

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

    socket.on(
        "load_chat",
        data => {
            const chat = document.querySelector(".messages")
            chat.innerHTML = ""

            let dataList = data["chat_data"]

            localStorage.setItem("email_mentor", data["mentor_email"])
            

            for (let dictData of dataList){
                if (dictData["email"] == document.querySelector(".email").textContent){
                    const chat = document.querySelector(".messages");
                    chat.innerHTML += `<div class="message user">
                                <p>${dictData["message"]}</p>
                            </div>`;
                }else{
                    const chat = document.querySelector(".messages");
                    chat.innerHTML += `<div class="message another-user">
                            <div class="user-info">
                                <div class="avatar-another">
                                    <img src="${dictData["avatar_url"]}" alt="ava">
                                </div>
                                <span class="username-another">${dictData["username"]}</span>
                            </div>
                            <div class="message-text">
                                <p>${dictData["message"]}</p>
                            </div>
                        </div>`;
                }
            }
        }
    )

    
}


function showQR() {
    // document.getElementById("qrModal").style.display = "flex";
    const modal = document.getElementById("qrModal");
    modal.classList.add("show");
}
function hideQR() {
    // document.getElementById("qrModal").style.display = "none";
    const modal = document.getElementById("qrModal");
    modal.classList.remove("show");
} 

window.addEventListener("DOMContentLoaded", loadRoom);