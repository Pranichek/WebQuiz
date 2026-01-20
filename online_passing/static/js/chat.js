let openChat = document.querySelector(".check-click")
let chatBox = document.querySelector(".chat-osnova")

openChat.addEventListener("click", () => {
    // чтобы чат открывался с первой попытки
    const display = window.getComputedStyle(chatBox).display;

    if (display === "none") {
        chatBox.style.display = "flex";
    } else {
        chatBox.style.display = "none";
    }
});

document.addEventListener("click", (event) => {
    if (
        chatBox.style.display === "flex" && 
        !chatBox.contains(event.target) && 
        !openChat.contains(event.target)
    ) {
        chatBox.style.display = "none"
    }
});

document.addEventListener("keydown", (event) => {
    if ((event.key === 'Enter' || event.keyCode === 13) &&  chatBox.style.display == "flex") {
        event.preventDefault();
        sendMessage()
    }
})



function sendMessage(){
    const msgInput = document.querySelector(".message-input");
    const text = msgInput.value;

    if (text.trim() != ""){
        const chat = document.querySelector(".messages");
        chat.innerHTML += `<div class="my-message">
                            <p>${text}</p>
                        </div>`

        socket.emit('send_message', {
            sender: document.querySelector(".user-nickname").dataset.value,
            room: localStorage.getItem("room_code"),
            message: text,
            email: document.querySelector(".email").dataset.value,
            email_mentor: localStorage.getItem("email_mentor"),
            id: localStorage.getItem("user_id")
        });
        msgInput.value = ''
        chat.scrollTop = chat.scrollHeight
    }
}

const sendBtn = document.querySelector(".send-message");
    
sendBtn.addEventListener("click", () => {
    sendMessage()
})



// когда пришло новое сообщение
socket.on('receive_message', (data) => {
    const chat = document.querySelector(".messages");

    chat.innerHTML += `<div class="main-unknown">
                        <div class="data-message">
                            <div class="ava-cont-mes">
                                <img data-size="${data["size_email"]}" class="avatar" src="${data["avatar_img"]}" alt="avatar">
                            </div>
                            <span class="unknown-username">${data["sender"]}</span>
                        </div>
                        <div class="unknown-message">
                            <p>${data["message"]}</p>
                        </div>
                    </div>`
});