const socket = io()
const cardsContainer = document.getElementById("cards")

socket.emit("finish_mentor",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code")
})

socket.on("list_results", data => {
    let users = data.users
    
    users.forEach(user => {
        cardsContainer.insertAdjacentHTML(
            'beforeend',
            `<div class='user-card'>${user.email} <div class='outline'><div class='fill'></div></div></div>`
        )

        const fillOutline = document.querySelector(".fill")
        fillOutline.style.width = `${user.accuracy}%`
        
    });
})