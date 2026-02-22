const urlParamsStudent = new URLSearchParams(window.location.search);
const room_code = urlParamsStudent.get('room_code');

if (room_code != localStorage.getItem("room_code")){
    localStorage.setItem("room_code", room_code)
    localStorage.setItem("index_question", "0")
    localStorage.setItem("flag_time", "true")
    localStorage.setItem("users_answers", "")
    localStorage.setItem('time_question', "set")
}

localStorage.setItem("next_page", "none")   
localStorage.setItem("checkCorrect", "none") 


const chat = document.querySelector(".messages");
chat.innerHTML = "";

const socket = io(); 

const username = document.querySelector(".username").textContent;  
let room_code_user = localStorage.getItem("room_code")

socket.on('connect', () => {
   socket.emit('join_room', { username: username, room: room_code_user, email: document.querySelector(".gmail-text").textContent, flag: "student"});
});

socket.on('end_lesson', () => {
    location.replace("/")
})

// список подключенных
socket.on("update_users", data => {
    localStorage.setItem("test_id", data["id_test"])
    users = data.user_list
    mentor_email = data.mentor_email

    document.querySelector(".count").textContent = users.length 
    document.querySelector(".code-room").textContent = data.code
    let userNick = document.querySelector(".username").textContent
    let userEmail = document.querySelector(".gmail-text").textContent
    const blockUsers = document.querySelector(".data-users")

    blockUsers.innerHTML = "";

    users.forEach(user => {
        if(user.id != document.querySelector(".id").dataset.id){
            const blockDiv = document.createElement("div")
            blockDiv.classList.add("block")
            
            const infDiv = document.createElement("div")
            infDiv.classList.add("inf")


            const avaObodok = document.createElement("div")
            avaObodok.className = "ava-obodok"

            const avatarImg = document.createElement("img")
            avatarImg.classList.add("ava")
            avatarImg.src = user.user_avatar
            avaObodok.appendChild(avatarImg)

            const usernameP = document.createElement("p")
            usernameP.textContent = user.username

            infDiv.appendChild(avaObodok)
            infDiv.appendChild(usernameP)

            const blockTextDiv = document.createElement("div")
            blockTextDiv.classList.add("block-text")

            const emailP = document.createElement("p")
            emailP.className = "email-paragraph"

            const blockPetDiv = document.createElement("div")
            blockPetDiv.classList.add("block-pet")

            const petImg = document.createElement("img")
            petImg.classList.add("pet")
            petImg.src = user.pet_img


            blockPetDiv.appendChild(petImg)

            blockTextDiv.appendChild(emailP)
            blockTextDiv.appendChild(blockPetDiv)

            blockDiv.appendChild(infDiv)
            blockDiv.appendChild(blockTextDiv)

            blockUsers.appendChild(blockDiv)
        }
    });

});


const copyCode = document.querySelector(".copy-code");
copyCode.addEventListener(
    'click',
    async () => { 
        console.log("67")
        let code = localStorage.getItem("room_code");
        
        if (code) {
            try {
                await navigator.clipboard.writeText(code); 

            } catch (err) {
                console.error('Не вдалося скопіювати текст');
            }
        }
    }
);

const copyLink = document.querySelector(".copy-url")
copyLink.addEventListener(
    'click',
    async () => { 
        console.log("69")
        let code = localStorage.getItem("room_code")
        let link = window.location.origin + `/student?room_code=${code}`
        
        if (link) {
            try {
                // Копіруєм посилання на фронте, щоб уменно н ак чела попало
                await navigator.clipboard.writeText(link); 

            } catch (err) {
                console.error('Не вдалося скопіювати текст');
            }
        }

        const copyLink = document.querySelector(".link-copy")
        copyLink.classList.add('copied');
        setTimeout(() => {
            copyLink.classList.remove('copied');
        }, 400);
    }
);



socket.on(
    'start_passing',
    data => {
        window.location.replace("/passing_student")
    }
)

socket.on(
    "load_chat",
    data => {
        const chat = document.querySelector(".messages");
        chat.innerHTML = ""; 

        localStorage.setItem("email_mentor", data["mentor_email"])

        let dataList = data["chat_data"]

        for (let dictData of dataList){
            if (dictData["email"] == document.querySelector(".email").textContent){
                const chat = document.querySelector(".messages");
                chat.innerHTML += `<div class="message user">
                            <p>${dictData["message"]}</p>
                        </div>`;
            }else{
                const chat = document.querySelector(".messages");
                chat.innerHTML += `<div class="message another-user">
                            <p>${dictData["message"]}</p>
                        </div>`;
            }
        }
    }
)


socket.on("leave_user",
    data => {
        if (parseInt(data["id"]) == parseInt(document.querySelector(".id").dataset.id)){
            window.location.replace("/")
        }
    }
)

socket.on("you_are_blocked", (data) => {
    if (parseInt(data["user_id"]) == parseInt(document.querySelector(".id").dataset.id)){
        window.location.href = "/"
    }
})

socket.on("fake_room",
    data => {
        if (data["email"] == document.querySelector(".email").textContent){
            window.location.replace("/")
        }
    }
)

