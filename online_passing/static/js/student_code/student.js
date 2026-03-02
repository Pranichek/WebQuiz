function renderUser(user) {
    if (user.id == document.querySelector(".id").dataset.id) {
        return;
    }

    const mentorEmail = localStorage.getItem("email_mentor");
    if (user.email === mentorEmail) {
        return;
    }

    const existingBlock = document.getElementById(`user-${user.id}`);
    if (existingBlock) {
        existingBlock.remove();
    }

    const blockUsers = document.querySelector(".data-users");

    const blockDiv = document.createElement("div");
    blockDiv.classList.add("block");
    blockDiv.setAttribute("id", `user-${user.id}`);

    const infDiv = document.createElement("div");
    infDiv.classList.add("inf");

    const avaObodok = document.createElement("div");
    avaObodok.className = "ava-obodok";

    const avatarImg = document.createElement("img");
    avatarImg.classList.add("ava");
    avatarImg.src = user.user_avatar;
    avaObodok.appendChild(avatarImg);

    const usernameP = document.createElement("p");
    usernameP.textContent = user.username;

    infDiv.appendChild(avaObodok);
    infDiv.appendChild(usernameP);

    const blockTextDiv = document.createElement("div");
    blockTextDiv.classList.add("block-text");

    const emailP = document.createElement("p");
    emailP.className = "email-paragraph";

    const blockPetDiv = document.createElement("div");
    blockPetDiv.classList.add("block-pet");

    const petImg = document.createElement("img");
    petImg.classList.add("pet");
    petImg.src = user.pet_img;

    blockPetDiv.appendChild(petImg);
    blockTextDiv.appendChild(emailP);
    blockTextDiv.appendChild(blockPetDiv);

    blockDiv.appendChild(infDiv);
    blockDiv.appendChild(blockTextDiv);

    blockUsers.appendChild(blockDiv);
}

export async function lobbyStudent() {
    const urlParamsStudent = new URLSearchParams(window.location.search);
    const room_code = urlParamsStudent.get('room_code');

    if (room_code != localStorage.getItem("room_code")) {
        localStorage.setItem("room_code", room_code);
        localStorage.setItem("index_question", "0");
        localStorage.setItem("flag_time", "true");
        localStorage.setItem("users_answers", "");
        localStorage.setItem('time_question', "set");
    }

    socket.emit('join_room', {
        flag: "student",
        room: localStorage.getItem("room_code") || NaN
    });

    localStorage.setItem("next_page", "none");
    localStorage.setItem("checkCorrect", "none");

    let room_code_user = localStorage.getItem("room_code");

    socket.on('connect', () => {
        socket.emit('join_room', { 
            username: username, 
            room: room_code_user, 
            email: document.querySelector(".gmail-text").textContent, 
            flag: "student" 
        });
    });

    socket.on('end_lesson', () => {
        location.replace("/");
    });

    socket.on("update_users", data => {
        localStorage.setItem("test_id", data["id_test"]);
        document.querySelector(".code-room").textContent = data.code;
        
        const mentorEmail = localStorage.getItem("email_mentor");

        const studentsList = data.user_list.filter(user => user.email !== mentorEmail);

        document.querySelector(".count").textContent = studentsList.length;

        const blockUsers = document.querySelector(".data-users");
        blockUsers.innerHTML = "";

        studentsList.forEach(user => {
            renderUser(user);
        });
    });

    socket.on("user_connected", data => {        
        if (Number(data.new_user.id) == Number(data.mentor_id)) {
            return;
        }

        renderUser(data.new_user);
        
        let currentCount = parseInt(document.querySelector(".count").textContent) || 0;
        document.querySelector(".count").textContent = currentCount + 1;
    });

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

    const copyLink = document.querySelector(".copy-url");
    copyLink.addEventListener(
        'click',
        async () => { 
            let code = localStorage.getItem("room_code");
            let link = window.location.origin + `/student?room_code=${code}`;
            if (link) {
                try {
                    await navigator.clipboard.writeText(link); 
                } catch (err) {
                    console.error('Не вдалося скопіювати текст');
                }
            }
            const copyLinkInner = document.querySelector(".link-copy");
            copyLinkInner.classList.add('copied');
            setTimeout(() => {
                copyLinkInner.classList.remove('copied');
            }, 400);
        }
    );

    socket.on(
        "load_chat",
        data => {
            const chat = document.querySelector(".messages");
            chat.innerHTML = ""; 

            localStorage.setItem("email_mentor", data["mentor_email"]);

            let dataList = data["chat_data"];

            for (let dictData of dataList){
                if (dictData["email"] == document.querySelector(".email").textContent){
                    chat.innerHTML += `<div class="message user">
                                <p>${dictData["message"]}</p>
                            </div>`;
                } else {
                    chat.innerHTML += `<div class="message another-user">
                                <p>${dictData["message"]}</p>
                            </div>`;
                }
            }
        }
    );

    socket.on("leave_user", data => {
        if (parseInt(data["id"]) == parseInt(document.querySelector(".id").dataset.id)){
            window.location.replace("/");
        } else {
            const userBlock = document.getElementById(`user-${data.id}`);
            if (userBlock) {
                userBlock.remove();
                
                let currentCount = parseInt(document.querySelector(".count").textContent) || 0;
                if (currentCount > 0) {
                    document.querySelector(".count").textContent = currentCount - 1;
                }
            }
        }
    });

    socket.on("you_are_blocked", (data) => {
        if (parseInt(data["user_id"]) == parseInt(document.querySelector(".id").dataset.id)){
            window.location.href = "/";
        } else {
            const userBlock = document.getElementById(`user-${data.user_id}`);
            if (userBlock) {
                userBlock.remove();
                
                let currentCount = parseInt(document.querySelector(".count").textContent) || 0;
                if (currentCount > 0) {
                    document.querySelector(".count").textContent = currentCount - 1;
                }
            }
        }
    });

    socket.on("fake_room",
        data => {
            if (data["email"] == document.querySelector(".email").textContent){
                window.location.replace("/");
            }
        }
    );
}