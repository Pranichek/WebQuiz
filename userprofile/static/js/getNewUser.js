const socket = io();
const listElement = document.querySelector('.participants-list');
const usersAmountToChange = document.querySelectorAll("#amount_users");

socket.on('new_user', function(data) {
    for (let amountToChange of usersAmountToChange){
        amountToChange.textContent = +amountToChange.textContent + 1;
    }
    listElement.insertAdjacentHTML("afterbegin", 
        `<div class="card" id="${data.username}">
            <div class="avatar"><img class="copy" src=${staticBase} alt="avatar"></div>
            <span class="username">${data.username}</span>
            <div class="information">
                <p>Улюбленець</p>
                <div class="fires">
                    <img src="" alt="">
                </div>
        </div>`
    )
});

socket.on('user_leave', function(data) {
    console.log("data in disconnect:", data);
    for (let amountToChange of usersAmountToChange){
        amountToChange.textContent = +amountToChange.textContent - 1;
    }
    let userCard = document.getElementById(data.username)
    userCard.remove()
});