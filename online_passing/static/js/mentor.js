localStorage.setItem("flag_time", "true")
localStorage.setItem("time_flag", "false")

const chat = document.querySelector(".messages");
const socket = io();


function loadRoom() {
    // тупая штука которая получает квери параметры из поискового пути
    const urlParams = new URLSearchParams(window.location.search);
    const id_test = urlParams.get('id_test');

    
    const username = document.querySelector(".mentor_name").textContent; 
    let code = localStorage.getItem("room_code")

    socket.emit('join_room', {
        username: username,
        email: document.querySelector(".email").textContent,
        id_test: id_test,
        flag: "mentor",
        room: localStorage.getItem("room_code") || NaN
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

    socket.on("set_qrcode", (data) => {
        const imgs = document.querySelectorAll(".qr-code-img")
        console.log(data.url_qrcode)
        for (const img of imgs){
            img.src = data.url_qrcode
        }
    })

    // список подключенных
    socket.on("update_users", data => {
        const blockUsers = document.querySelector(".students-card")

        blockUsers.innerHTML = ""
        users = data.user_list
        document.querySelector("#amount_users").textContent = users.length 
        document.querySelector(".count-users").textContent = `Учасники(${users.length})`
        localStorage.setItem("room_code", data.code)
        document.querySelector(".code-room").textContent = data.code
        document.querySelector("#code").textContent = data.code
        mentor_email = data.mentor_email

        users.forEach(user => {
            if (user.email != document.querySelector(".email").textContent){
                const newUser = `
                    <div class="user-ourline">
                        <div class="text-data">
                            <p>${user.username}</p>
                            <p>${user.email}</p>
                        </div>
                        <div class="buttons">
                            <div class="delete-btn" data-id="${user.id}">
                                Видалити
                            </div>
                            <div class="block-btn" data-id="${user.id}">
                                Заблокувати
                            </div>
                        </div>
                    </div>
                `
                blockUsers.innerHTML += newUser

                const deleteButtons = document.querySelectorAll(".delete-btn")

                deleteButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        document.querySelector(".window-choice").classList.add("active")
                        document.querySelector("#overlay").classList.add("active")
                        
                        userToDeleteId = btn.getAttribute("data-id")
                    });
                });

                const blockButtons = document.querySelectorAll(".block-btn")
        
                blockButtons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        const userIdToBlock = btn.getAttribute("data-id");
                        const currentRoomCode = localStorage.getItem("room_code");

                        socket.emit("block_user", {
                            room: currentRoomCode,
                            id: userIdToBlock
                        });
                    });
                });
            }
        });
        let lastid;

        const buttonRemove = document.querySelector(".remove_user");
    
        buttonRemove.replaceWith(buttonRemove.cloneNode(true));
        document.querySelector(".remove_user").addEventListener("click", () => {
            if (userToDeleteId) {
                let code = localStorage.getItem("room_code"); 
                socket.emit(
                    "delete_user",
                    {
                        room: code,
                        id: userToDeleteId 
                    }
                );
                document.querySelector(".window-choice").classList.remove("active");
                document.querySelector("#overlay").classList.remove("active");
                userToDeleteId = null;
            }
        });

        const declineBtn = document.querySelector(".decline");
        declineBtn.replaceWith(declineBtn.cloneNode(true));
        document.querySelector(".decline").addEventListener("click", () => {
            document.querySelector(".window-choice").classList.remove("active");
            document.querySelector("#overlay").classList.remove("active");
            userToDeleteId = null;
        });
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

    const startTest = document.querySelector(".start")
    startTest.addEventListener(
        "click",
        () => {
            socket.emit("start_passing", {
                room: code
            })
        }
    )

    const copyCode = document.querySelector(".copy-code");
    copyCode.addEventListener(
        'click',
        async () => { 
            let code = localStorage.getItem("room_code");
            
            if (code) {
                try {
                    await navigator.clipboard.writeText(code); 
                } catch (err) {
                    console.error('Не вдалося скопіювати текст');
                }
            }
        }
    );

    const copyLink = document.querySelector(".copy-url")
    copyLink.addEventListener(
        'click',
        async () => { 
            let code = localStorage.getItem("room_code")
            let link = window.location.origin + `/student?room_code=${code}`
            
            if (link) {
                try {
                    await navigator.clipboard.writeText(link); 

                } catch (err) {
                    console.error('Не вдалося скопіювати текст');
                }
            }

            const copyLink = document.querySelector(".link-copy")
            copyLink.classList.add('copied');
            setTimeout(() => {
                copyLink.classList.remove('copied');
            }, 400);
        }
    );



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

document.querySelector(".end").addEventListener("click", () => {
    socket.emit('end_lesson', {room: code})
    document.location.replace("/")
})