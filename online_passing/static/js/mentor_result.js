const socket = io()

localStorage.setItem("flag_time", "true")

// чтобі не терять связ с комнатой
socket.emit(
    "connect_again",
    {code: localStorage.getItem("room_code")}
)

socket.emit(
    'users_results',
    {room: localStorage.getItem("room_code")}
)

socket.on("list_results",
    user_list => {  
        const usersCOnts = document.querySelector(".cont-users")
        usersCOnts.innerHTML = ""  
        user_list.forEach((element, index) => {
            const cont = document.createElement("div")
            cont.className = `userCont ${element.email}`

            const number = document.createElement("p")
            number.textContent = `№ ${index + 1}`  

            const username = document.createElement("p")
            username.textContent = element.username

            const div = document.createElement("div");
            div.className = "avatar-circle";

            const img = document.createElement("img");
            img.className = "avatar";
            img.setAttribute("data-size", element.avatar_size);
            img.src = element.user_avatar
            div.appendChild(img)

            cont.appendChild(number)
            cont.appendChild(username)
            cont.appendChild(div)
            usersCOnts.append(cont)
        });
    }
)

socket.on("student_answers", data => {
    const userBlocks = document.querySelector(".cont-users").childNodes

    userBlocks.forEach(block => {
        const inner =  document.getElementsByClassName(`${data.email}`)
        if (inner) {

            const newblock = document.createElement("div")

            const text = document.createElement("p")
            text.textContent = "обрана відповідь"

            const answers = document.createElement("p")
            answers.textContent = data.answers

            newblock.appendChild(text)
            newblock.appendChild(answers)

            block.appendChild(newblock)
        }
    });
});


socket.on("next_question",
    data => {
        let index = localStorage.getItem("index_question");
        index = index + 1;
        localStorage.setItem("index_question", index);
        window.location.replace("/passing_mentor")
    }
)

socket.on("end_test",
    data => {
        window.location.replace("/finish_mentor")
    }
)


document.querySelector(".next-question").addEventListener(
    'click',
    () => {
        socket.emit('next_one', {
            index: localStorage.getItem("index_question"),
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
        })
    }
)

