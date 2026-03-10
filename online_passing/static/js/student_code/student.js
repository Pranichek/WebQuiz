function renderUser(user) {
    const existingUser = document.getElementById(`student-${user.id}`);
    if (existingUser) {
        existingUser.remove();
    }

    const blockUsers = document.querySelector(".outline-users");

    const userDiv = document.createElement("div");

    userDiv.className = "user-card user-ourline"; 
    userDiv.setAttribute("data-id", user.id);
    userDiv.id = `student-${user.id}`;

    userDiv.innerHTML = `
        <div class="user-info" style="justify-content: center;">
            <span class="user-name">${user.username}</span>
        </div>
    `;

    blockUsers.appendChild(userDiv);

    document.querySelector(".count").textContent = document.querySelectorAll(".user-card").length
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
        const mentorEmail = localStorage.getItem("email_mentor");
        const studentsList = data.user_list.filter(user => user.email !== mentorEmail);


        const blockUsers = document.querySelector(".outline-users");
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
    });

    socket.on("you_are_blocked", (data) => {
        if (parseInt(data["user_id"]) == parseInt(document.querySelector(".id").dataset.id)){
            window.location.href = "/";
        } else {
            const userBlock = document.getElementById(`student-${data.user_id}`);
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

    socket.on("save_id",
        data => {
            localStorage.setItem("test_id", data.id_test)
        }
    )

    window.checkStatusInterval = setInterval(() => {
        socket.emit("check_room_status", { 
            room: localStorage.getItem("room_code")
        });
    }, 3000);
}