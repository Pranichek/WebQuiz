localStorage.setItem("flag_time", "true");
localStorage.setItem("time_flag", "false");

export async function mentorRoom() {
    function loadRoom() {
        const urlParams = new URLSearchParams(window.location.search);
        const id_test = urlParams.get('id_test');
        const username = document.querySelector(".mentor_name").textContent;
        let code = localStorage.getItem("room_code");
        let userToDeleteId = null;

        function updateUserCounter() {
            const count = document.querySelectorAll(".user-ourline").length;
            document.querySelector("#amount_users").textContent = count;
            document.querySelector(".count-users").textContent = `Учасники(${count})`;
        }

        function addStudentToDOM(user) {
            if (user.email == document.querySelector(".email").textContent) return;

            const existingUser = document.getElementById(`student-${user.id}`);
            if (existingUser) {
                existingUser.remove();
            }

            const blockUsers = document.querySelector(".students-card");
            const userDiv = document.createElement("div");
            userDiv.className = "user-ourline";
            userDiv.id = `student-${user.id}`;

            userDiv.innerHTML = `
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
            `;

            const deleteBtn = userDiv.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => {
                document.querySelector(".window-choice").classList.add("active");
                document.querySelector("#overlay").classList.add("active");
                userToDeleteId = user.id;
            });

            const blockBtn = userDiv.querySelector(".block-btn");
            blockBtn.addEventListener("click", () => {
                const currentRoomCode = localStorage.getItem("room_code");
                socket.emit("block_user", {
                    room: currentRoomCode,
                    id: user.id
                });
            });

            blockUsers.appendChild(userDiv);
            updateUserCounter();
        }

        socket.emit('join_room', {
            username: username,
            email: document.querySelector(".email").textContent,
            id_test: id_test,
            flag: "mentor",
            room: localStorage.getItem("room_code") || NaN
        });

        socket.on('user_joined', (data) => {
            socket.emit("mentor_email", {
                email: document.querySelector(".email").textContent,
                room: code,
                id_test: id_test
            });
        });

        socket.on("update_users", data => {
            const blockUsers = document.querySelector(".students-card");
            blockUsers.innerHTML = "";
            
            localStorage.setItem("room_code", data.code);
            document.querySelector(".code-room").textContent = data.code;
            document.querySelector("#code").textContent = data.code;

            data.user_list.forEach(user => {
                addStudentToDOM(user);
            });
        });

        socket.on("user_connected", data => {
            addStudentToDOM(data.new_user);
        });

        socket.on("leave_user", data => {
            const userElement = document.getElementById(`student-${data.id}`);
            if (userElement) {
                userElement.remove();
                updateUserCounter();
            }
        });

        socket.on("you_are_blocked", (data) => {
             const userElement = document.getElementById(`student-${data.user_id}`);
             if (userElement) {
                userElement.remove();
                updateUserCounter();
             }
        });

        const buttonRemove = document.querySelector(".remove_user");
        buttonRemove.replaceWith(buttonRemove.cloneNode(true));
        
        document.querySelector(".remove_user").addEventListener("click", () => {
            if (userToDeleteId) {
                let currentCode = localStorage.getItem("room_code");
                socket.emit("delete_user", {
                    room: currentCode,
                    id: userToDeleteId
                });
                
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

        socket.on("set_qrcode", (data) => {
            const imgs = document.querySelectorAll(".qr-code-img");
            for (const img of imgs) {
                img.src = data.url_qrcode;
            }
        });

        const startTest = document.querySelector(".start");
        startTest.addEventListener("click", () => {
            socket.emit("start_test", { room: localStorage.getItem("room_code") });
        });

        const copyCode = document.querySelector(".copy-code");
        copyCode.addEventListener('click', async () => {
            let currentCode = localStorage.getItem("room_code");
            if (currentCode) {
                try { await navigator.clipboard.writeText(currentCode); } 
                catch (err) { console.error('Error copy'); }
            }
        });

        const copyLink = document.querySelector(".copy-url");
        copyLink.addEventListener('click', async () => {
            let currentCode = localStorage.getItem("room_code");
            let link = window.location.origin + `/student?room_code=${currentCode}`;
            if (link) {
                try { await navigator.clipboard.writeText(link); } 
                catch (err) { console.error('Error copy'); }
            }
            const copyLinkInner = document.querySelector(".link-copy");
            copyLinkInner.classList.add('copied');
            setTimeout(() => { copyLinkInner.classList.remove('copied'); }, 400);
        });

        socket.on("load_chat", data => {
            const chat = document.querySelector(".messages");
            chat.innerHTML = "";
            let dataList = data["chat_data"];
            localStorage.setItem("email_mentor", data["mentor_email"]);
            
            for (let dictData of dataList){
                if (dictData["email"] == document.querySelector(".email").textContent){
                    chat.innerHTML += `<div class="message user"><p>${dictData["message"]}</p></div>`;
                } else {
                    chat.innerHTML += `
                        <div class="message another-user">
                            <div class="user-info">
                                <div class="avatar-another"><img src="${dictData["avatar_url"]}" alt="ava"></div>
                                <span class="username-another">${dictData["username"]}</span>
                            </div>
                            <div class="message-text"><p>${dictData["message"]}</p></div>
                        </div>`;
                }
            }
        });
    }

    window.showQR = function() {
        const modal = document.getElementById("qrModal");
        if (modal) modal.classList.add("show");
    };

    window.hideQR = function() {
        const modal = document.getElementById("qrModal");
        if (modal) modal.classList.remove("show");
    };

    loadRoom();

    document.querySelector(".end").addEventListener("click", () => {
        socket.emit('end_lesson', { room: localStorage.getItem("room_code") });
        document.location.replace("/");
    });
}