export async function loadUsers(){
    socket.emit("get_users",
        {
            room: localStorage.getItem("room_code"),
            index_question: localStorage.getItem("index_question"),
            users_answers: localStorage.getItem("users_answers"),
            id_test: localStorage.getItem("test_id")
        }
    )

    socket.on("side_users", data => {
        const blockUsers = document.querySelector(".outline-users");
        blockUsers.innerHTML = "";

        let count_answered = 0;
        let count_users = data.user_list.length;
        
        data.user_list.forEach(user => {
            const isAnswered = user.ready === "відповів";
            if (isAnswered) count_answered++;

            let user_card = `
                <div class="user-card ${isAnswered ? 'active' : ''}" data-id="${user.id}"> 
                    <div class="user-info">
                        <span class="user-name" style="font-size: 2vh;">${user.username}</span>
                    </div>
                    <div class="user-status ${isAnswered ? 'finished' : 'box'}">
                        ${isAnswered ? '✔' : ''}
                    </div>
                </div>
            `;

            blockUsers.insertAdjacentHTML('beforeend', user_card);
        });
        
        const textPeople = document.querySelector(".text-people");
        if (textPeople) textPeople.textContent = `${count_answered}/${count_users}`;

        if (document.querySelector(".username")) document.querySelector(".username").textContent = data.username;
        if (document.querySelector(".correct_answers")) document.querySelector(".correct_answers").textContent = data.right_answers;
        if (document.querySelector(".uncorrect_answers")) document.querySelector(".uncorrect_answers").textContent = data.uncorrect_answers;
        if (document.querySelector(".skip_answers")) document.querySelector(".skip_answers").textContent = data.skip_answers;
        if (document.querySelector(".accuracy-text")) document.querySelector(".accuracy-text").textContent = `${data.accuracy}%`;
        if (document.querySelector(".points-text")) document.querySelector(".points-text").textContent = data.points;
    }); 

    socket.on("single_student_answered", (data) => {
        const blockUsers = document.querySelector(".outline-users");
        const userCard = blockUsers.querySelector(`.user-card[data-id="${data.user_id}"]`);

        if (userCard) {
            userCard.classList.add("active");

            const statusBox = userCard.querySelector(".user-status");
            if (statusBox) {
                statusBox.classList.remove("box");
                statusBox.classList.add("finished");
                statusBox.textContent = "✔";
            }
        }

        const counterText = document.querySelector(".text-people");
        if (counterText) {
            counterText.textContent = `${data.answered_count}/${data.total_count}`;
        }

        if (data.answered_count === data.total_count && data.total_count > 0) {
             if (window.questionTimer) clearInterval(window.questionTimer);
        }
    });

    socket.on("update_users", data => {
        const blockUsers = document.querySelector(".outline-users");
        
        let count_answered = 0;
        const count_users = data.user_list.length;

        data.user_list.forEach(user => {
            if (user.ready === "відповів") {
                count_answered++;
            }

            const existingCard = blockUsers.querySelector(`.user-card[data-id="${user.id}"]`);

            if (existingCard) {
                const statusDiv = existingCard.querySelector(".user-status");

                if (user.ready === "відповів") {
                    if (!existingCard.classList.contains("active")) {
                        existingCard.classList.add("active");
                        
                        // НОВАЯ ПРОВЕРКА: Если элемент statusDiv существует
                        if (statusDiv) {
                            statusDiv.classList.remove("box");
                            statusDiv.classList.add("finished");
                            statusDiv.textContent = "✔";
                        }
                    }
                } else {
                    if (existingCard.classList.contains("active")) {
                        existingCard.classList.remove("active");
                        
                        // НОВАЯ ПРОВЕРКА: Если элемент statusDiv существует
                        if (statusDiv) {
                            statusDiv.classList.remove("finished");
                            statusDiv.classList.add("box");
                            statusDiv.textContent = "";
                        }
                    }
                }

            } else {
                const isAnswered = user.ready === 'відповів';
                
                const new_card = `
                    <div class="user-card ${isAnswered ? 'active' : ''}" data-id="${user.id}">
                        <div class="user-info">
                            <span class="user-name" style="font-size: 2vh;">${user.username}</span>
                        </div>
                        <div class="user-status ${isAnswered ? 'finished' : 'box'}">
                            ${isAnswered ? '✔' : ''}
                        </div>
                    </div>
                `;
                blockUsers.insertAdjacentHTML('beforeend', new_card);
            }
        });

        const currentCards = blockUsers.querySelectorAll(".user-card");
        const newIds = new Set(data.user_list.map(u => String(u.id)));
        
        currentCards.forEach(card => {
            if (!newIds.has(card.dataset.id)) {
                card.remove();
            }
        });

        const textPeople = document.querySelector(".text-people");
        if (textPeople) {
            textPeople.textContent = `${count_answered}/${count_users}`;
        }
    });
}