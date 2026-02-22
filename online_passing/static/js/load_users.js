socket.emit("get_users",
    {
        room: localStorage.getItem("room_code"),
        index_question: localStorage.getItem("index_question"),
        users_answers: localStorage.getItem("users_answers"),
        room: localStorage.getItem("room_code"),
        id_test: localStorage.getItem("test_id")
    }
)

socket.on("side_users", data => {
    const blockUsers = document.querySelector(".outline-users");
    blockUsers.innerHTML = "";

    let count_answered = 0;
    let count_users = data.user_list.length;
    
    data.user_list.forEach(user => {
        let user_card;
        if (user.ready == "відповів") {
            count_answered++;
            user_card = `
                <div class="user-card active" data-id="${user.id}"> 
                    <div class="user-info">
                        <span class="user-name">${user.username}</span>
                    </div>
                    <div class="user-status finished">✔</div>
                </div>
            `;
        } else {
            user_card = `
                <div class="user-card" data-id="${user.id}">
                    <div class="user-info">
                        <span class="user-name">${user.username}</span>
                    </div>
                    <div class="user-status box"></div>
                </div>
            `;
        }

        blockUsers.insertAdjacentHTML('beforeend', user_card);
    });
    
    document.querySelector(".text-people").textContent = `${count_answered}/${count_users}`;

    document.querySelector(".username").textContent = data.username
    document.querySelector(".correct_answers").textContent = data.right_answers
    document.querySelector(".uncorrect_answers").textContent = data.uncorrect_answers
    document.querySelector(".skip_answers").textContent = data.skip_answers
    document.querySelector(".accuracy-text").textContent = `${data.accuracy}%`
    document.querySelector(".points-text").textContent = data.points
}); 


socket.on("update_users", data => {
    const blockUsers = document.querySelector(".outline-users");
    
    let count_answered = 0;
    let count_users = data.user_list.length;

    data.user_list.forEach(user => {
        let userCard = document.querySelector(`.user-card[data-id="${user.id}"]`);

        if (userCard) {
            let statusDiv = userCard.querySelector(".user-status");
            
            if (user.ready === "відповів") {
                count_answered++;
                userCard.classList.add("active");
                statusDiv.className = "user-status finished";
                statusDiv.textContent = "✔";
            } else {
                userCard.classList.remove("active");
                statusDiv.className = "user-status box";
                statusDiv.textContent = "";
            }
        } else {
            let new_card = `
                <div class="user-card ${user.ready === 'відповів' ? 'active' : ''}" data-id="${user.id}">
                    <div class="user-info">
                        <span class="user-name">${user.username}</span>
                    </div>
                    <div class="user-status ${user.ready === 'відповів' ? 'finished' : 'box'}">${user.ready === 'відповів' ? '✔' : ''}</div>
                </div>
            `;
            blockUsers.insertAdjacentHTML('beforeend', new_card);
            
            if (user.ready === "відповів") count_answered++;
        }
    });

    let textPeople = document.querySelector(".text-people");
    if (textPeople) {
        textPeople.textContent = `${count_answered}/${count_users}`;
    }
});