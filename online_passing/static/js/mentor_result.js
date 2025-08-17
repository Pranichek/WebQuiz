const socket = io()

localStorage.setItem("flag_time", "true")

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

            const lastAnswering = document.createElement("p")
            lastAnswering.textContent = `Відповідь: ${element.last_answer}`

            const accuracy = document.createElement("p")
            accuracy.textContent = `Точність: ${parseInt(element.accuracy)}`

            cont.appendChild(number)
            cont.appendChild(username)
            cont.appendChild(div)
            cont.appendChild(lastAnswering)
            cont.appendChild(accuracy)
            usersCOnts.append(cont)
        });
    }
)

socket.on("student_answers", data => {
    // находим все блоки пользователей
    const userBlocks = document.querySelectorAll(".cont-users .userCont");

    userBlocks.forEach(block => {
        // ищем блок по data-email
        if (block.classList.contains(data.email)) {
            const newblock = document.createElement("div");

            const text = document.createElement("p");
            text.textContent = "обрана відповідь";

            const answers = document.createElement("p");
            answers.textContent = data.answers;

            newblock.appendChild(text);
            newblock.appendChild(answers);

            block.appendChild(newblock);
        }
    });
});

socket.on("next_question", data => {
    window.location.replace("/passing_mentor");
});

socket.on("end_test",
    data => {
        window.location.replace("/finish_mentor")
    }
)


document.querySelector(".next-question").addEventListener(
    'click',
    () => {
        const oldData = parseInt(localStorage.getItem("index_question"))
        localStorage.setItem("index_question", oldData + 1)
        
        socket.emit('next_one', {
            index: localStorage.getItem("index_question"),
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
        })
    }
)

