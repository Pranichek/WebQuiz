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

    // список подключенных
    socket.on("update_users", data => {
        const blockUsers = document.querySelector(".users")

        blockUsers.innerHTML = ""
        users = data.user_list
        document.querySelector("#amount_users").textContent = (users.length - 1 >= 0) ? (users.length - 1) : 0;
        document.querySelector(".count-users").textContent = (users.length - 1 >= 0) ? (users.length - 1) : 0;
        localStorage.setItem("room_code", data.code)
        document.querySelector(".code-room").textContent = data.code
        document.querySelector("#code").textContent = data.code
        mentor_email = data.mentor_email

        users.forEach(user => {
            if (user.email != document.querySelector(".email").textContent){
                const blockDiv = document.createElement("div")
                blockDiv.classList.add("block")

                const userCross = document.createElement("img")
                userCross.src = document.querySelector("#imageLink").dataset.link
                userCross.classList = "cross-user"
                userCross.dataset.email = user.email
                blockDiv.appendChild(userCross)
                
                const infDiv = document.createElement("div")
                infDiv.classList.add("inf")

                const avaObodok = document.createElement("div")
                avaObodok.className = "ava-obodok"

                const avatarImg = document.createElement("img")
                avatarImg.classList.add("ava")
                avatarImg.src = user.user_avatar
                avaObodok.appendChild(avatarImg)

                const usernameP = document.createElement("p")
                usernameP.textContent = user.username

                infDiv.appendChild(avaObodok)
                infDiv.appendChild(usernameP)

                const blockTextDiv = document.createElement("div")
                blockTextDiv.classList.add("block-text")

                const emailP = document.createElement("p")
                emailP.className = "email-paragraph"
                emailP.textContent = "улюбленець"

                const blockPetDiv = document.createElement("div")
                blockPetDiv.classList.add("block-pet")

                const petImg = document.createElement("img")
                petImg.classList.add("pet")
                petImg.src = user.pet_img


                blockPetDiv.appendChild(petImg)

                blockTextDiv.appendChild(emailP)
                blockTextDiv.appendChild(blockPetDiv)

                blockDiv.appendChild(infDiv)
                blockDiv.appendChild(blockTextDiv)

                blockUsers.appendChild(blockDiv)
            }
        });
        let lastemail;

        // видалення юзера із кімнати block
        crossUser = document.getElementsByClassName("cross-user")
        for (let cross of crossUser){
            cross.addEventListener("click", ()=>{
                document.querySelector(".window-choice").style.display = "flex"
                lastemail = cross.dataset.email
            })
        }

        let buttonRemove = document.querySelector(".remove_user")
        buttonRemove.addEventListener("click", ()=>{
            socket.emit(
                "delete_user",
                {
                    room: code,
                    email: lastemail
                }
            )
            document.querySelector(".window-choice").style.display = "none"
        })

        document.querySelector(".decline").addEventListener("click", () => {
            document.querySelector(".window-choice").style.display = "none"
        })
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
                    // Копіруєм посилання на фронте, щоб уменно н ак чела попало
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