const socket = io();
const listElement = document.querySelector('.participants-list');

socket.on('new_user', function(data) {
    console.log("data:", data);
    listElement.insertAdjacentHTML("afterbegin", 
        `<div class="card">
            <div class="avatar"><img class="copy" src=${staticBase} alt="avatar"></div>
            <div class="information">
                <span class="username">${data.username}</span>
                <div class="fires">
                    <img src="" alt="1">
                    <img src="" alt="2">
                    <img src="" alt="3">
                </div>
            </div>
        </div>`
    )
});