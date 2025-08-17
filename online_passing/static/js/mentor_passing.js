const socket = io()

if (localStorage.getItem("index_question")){
    socket.emit('load_question', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
}


socket.on("update_users", (users) => {
    const blockUsers = document.querySelector(".users")

    blockUsers.innerHTML = ""
    count_answered = 0
    count_users = users.length
    users.forEach(user => {
        const blockDiv = document.createElement("div")
        blockDiv.classList.add("block")

        const infDiv = document.createElement("div")
        infDiv.classList.add("inf")

        const avatarImg = document.createElement("img")
        avatarImg.classList.add("ava")

        const usernameP = document.createElement("p")
        usernameP.textContent = user.username

        infDiv.appendChild(avatarImg)
        infDiv.appendChild(usernameP)

        const blockTextDiv = document.createElement("div")
        blockTextDiv.classList.add("block-text")

        const emailP = document.createElement("p")
        emailP.className = "email-paragraph"
        emailP.textContent = user.email

        const blockPetDiv = document.createElement("div")
        blockPetDiv.classList.add("block-pet")

        const petImg = document.createElement("img")
        petImg.classList.add("pet")

        const dataAnswer = document.createElement("p")
        dataAnswer.textContent = user.ready
        if (user.ready == "відповів"){
            count_answered++
        }
        blockTextDiv.append(dataAnswer)


        blockPetDiv.appendChild(petImg)

        blockTextDiv.appendChild(emailP)
        blockTextDiv.appendChild(blockPetDiv)

        blockDiv.appendChild(infDiv)
        blockDiv.appendChild(blockTextDiv)

        blockUsers.appendChild(blockDiv)
        }
    )

    if (count_answered == count_users){
        socket.emit(
            "end_question",
            {code: localStorage.getItem("room_code")}
        )
    }

    // видалення юзера із кімнати block
    allBlocks = document.getElementsByClassName("block")
    for (let block of allBlocks){
        
        block.addEventListener('click', ()=>{
            socket.emit(
                "delete_user",
                {
                    room: localStorage.getItem("room_code"),
                    email: block.querySelector(".email-paragraph").textContent
                }
            )
        })
    }

})

socket.on("page_result",
    data => {
        const oldData = parseInt(localStorage.getItem("index_question"))
        localStorage.setItem("index_question", oldData + 1)
        window.location.replace("/result_mentor")
    }
)

document.querySelector('.add-time').addEventListener(
    'click',
    () => {
        socket.emit(
            'add_time',
            {code: localStorage.getItem("room_code")}
        )
    }
)

document.querySelector('.end_question').addEventListener(
    'click',
    () => {
        const oldData = parseInt(localStorage.getItem("index_question"))
        localStorage.setItem("index_question", oldData + 1)
        socket.emit(
            'end_question',
            {code: localStorage.getItem("room_code")}
        )
    }
)