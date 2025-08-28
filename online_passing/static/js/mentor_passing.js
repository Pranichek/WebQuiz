const socket = io()

if (localStorage.getItem("index_question")){
    socket.emit('load_question', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
}


socket.on("update_users", (users) => {
    const blockUsers = document.querySelector(".outline-users")

    blockUsers.innerHTML = ""
    // <p class="count-answered">відповіли  5 / <span class="count-people">12</span></p>
    

    count_answered = 0
    count_users = users.length
    users.forEach(user => {
        const blockDiv = document.createElement("div")
        blockDiv.classList.add("block")

        const infDiv = document.createElement("div")
        infDiv.classList.add("inf")

        const avatarImg = document.createElement("img")
        avatarImg.classList.add("ava")
        avatarImg.src = user.avatar_url



        infDiv.appendChild(avatarImg)

        const blockTextDiv = document.createElement("div")
        blockTextDiv.classList.add("block-text")

        const emailP = document.createElement("p")
        emailP.className = "email-paragraph"
        emailP.textContent = user.email

        const blockPetDiv = document.createElement("div")
        blockPetDiv.classList.add("block-pet")

        const petImg = document.createElement("img")
        petImg.classList.add("pet")
        petImg.src = user.pet_img

        const cross = document.createElement("img")
        cross.className = "cross_student"
        cross.src = document.querySelector(".hide-ava").dataset.cross

        blockDiv.appendChild(cross)

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
    document.querySelector(".count-answered-people").textContent = `відповіли  ${count_answered} / `
    document.querySelector(".count-people").textContent = users.length
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
        socket.emit(
            'end_question',
            {code: localStorage.getItem("room_code")}
        )
    }
)