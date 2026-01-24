const socket = io()

socket.emit(
    "connect_again",
    {code: localStorage.getItem("room_code")}
)

setInterval(() => {
    socket.emit("check_users", {room_code: localStorage.getItem("room_code"), page:"passing", index_question: localStorage.getItem("index_question")})
}, 3000)

if (localStorage.getItem("index_question")){
    socket.emit('load_question', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
}

socket.on("update_users", data => {
    const blockUsers = document.querySelector(".outline-users")
    document.querySelector(".outline-users")
    blockUsers.innerHTML = ""
    // <p class="count-answered">відповіли  5 / <span class="count-people">12</span></p>

    count_answered = 0
    count_users = data.user_list.length
    data.user_list.forEach(user => {
        const blockDiv = document.createElement("div")
        blockDiv.classList.add("block")

        const infDiv = document.createElement("div")
        infDiv.classList.add("inf")

        const avatarImg = document.createElement("img")
        avatarImg.classList.add("ava")
        avatarImg.src = user.user_avatar

        const obodokAva = document.createElement("div")
        obodokAva.className = "ava-obodok"
        obodokAva.appendChild(avatarImg)

        infDiv.appendChild(obodokAva)

        const blockTextDiv = document.createElement("div")
        blockTextDiv.classList.add("block-text")

        const emailP = document.createElement("p")
        emailP.className = "email-paragraph"
        emailP.textContent = user.username

        const blockPetDiv = document.createElement("div")
        blockPetDiv.classList.add("block-pet")

        const petImg = document.createElement("img")
        petImg.classList.add("pet")
        petImg.src = user.pet_img

        const cross = document.createElement("img")
        cross.className = "cross_student"
        cross.dataset.id = user.id
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
    document.querySelector(".num-people").textContent = data.user_list.length
    document.querySelector(".count-people").textContent = data.user_list.length
    if (count_answered == count_users){
        socket.emit(
            "end_question",
            {code: localStorage.getItem("room_code")}
        )
    }
    

    let lastid;

    crossUser = document.getElementsByClassName("cross_student")
        for (let cross of crossUser){
            cross.addEventListener("click", ()=>{
                document.querySelector(".window-choice").classList.add("active")
                document.querySelector("#overlay").classList.add("active")
                lastid = cross.dataset.id
        })
    }

    let buttonRemove = document.querySelector(".remove_user")
        buttonRemove.addEventListener("click", ()=>{
            socket.emit(
                "delete_user",
                {
                    room: localStorage.getItem("room_code"),
                    id: lastid
                }
            )
        document.querySelector(".window-choice").classList.remove("active")
        document.querySelector("#overlay").classList.remove("active")
    })

    document.querySelector(".decline").addEventListener("click", () => {
        document.querySelector(".window-choice").classList.remove("active")
        document.querySelector("#overlay").classList.remove("active")
    })
})


socket.on("data_question_mentor", data => {
    const check_answers = []
    document.querySelector(".num-que").textContent = `${parseInt(localStorage.getItem("index_question")) + 1}/${data.amount_question}`

    const answersBlock = document.querySelector(".answers-test");
    answersBlock.innerHTML = "";
    
    document.querySelector(".question-test").insertAdjacentHTML(
        "afterbegin",
        `<img src="${data.questionImgUrl}" onerror="this.style.display = 'none';">`
    )
    document.querySelector(".question-text").textContent = data.text_question

    if (data.type_question == "input-gap"){
        document.querySelector(".answers-test").style.padding = "0"
        document.querySelector(".answers-test").insertAdjacentHTML(
            "beforeend",
            `<div class="input-div">
                <p>Правильні відповіді:</p>
                <div class="correct-answers">
                    <p>Сховано</p>
                <div/>
            </div>`
        )
    }else{
        const answers = data.answer_options.split("%?)(?%")
        
        answers[0] = answers[0].replace("(?%", "")
        answers[answers.length - 1] = answers[answers.length - 1].replace("%?)", "")
        for (let option of answers){
            // option = option.replace(/[?()%/]/g, "");
            
            
            if(option[0] == "+"){
                check_answers.push(true)
            }else{
                check_answers.push(false)
            }

            option = option.slice(1, -1) 

            document.querySelector(".answers-test").insertAdjacentHTML(
                "beforeend",
                `<div class='answer'><div class='checkMark'></div>
                    <img src="${data.img_url[data.answer_options.indexOf(option)]}" onerror="this.style.display = 'none';">
                    <p>${option}</p>
                </div>`
            )
        }
    }



    const minutesP = document.querySelector(".left-part")
    const secondsP = document.querySelector(".right-part")
    
    let timeFlag = localStorage.getItem("time_flag")

    if (timeFlag == "false"){
        if (data.time_question < 61){
            minutesP.textContent = "00"
            secondsP.textContent = data.time_question
        }else{
            const minutes = Math.floor(data.time_question / 60);
            let remainingSeconds = data.time_question % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = '0' + remainingSeconds;
            }
            minutesP.textContent = minutes
            secondsP.textContent = remainingSeconds        
        }
        localStorage.setItem("time_flag", data.time_question)
    }else{
        if (timeFlag < 61){
            minutesP.textContent = "00"
            secondsP.textContent = timeFlag
        }else{
            const minutes = Math.floor(timeFlag / 60);
            let remainingSeconds = timeFlag % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = '0' + remainingSeconds;
            }
            minutesP.textContent = minutes
            secondsP.textContent = remainingSeconds        
        }
    }

    // const blockUsers = document.querySelector(".outline-users")
    // blockUsers.innerHTML = ""
    // // <p class="count-answered">відповіли  5 / <span class="count-people">12</span></p>

    // count_answered = 0
    // count_users = data.user_list.length
    // data.user_list.forEach(user => {
    //     const blockDiv = document.createElement("div")
    //     blockDiv.classList.add("block")

    //     const infDiv = document.createElement("div")
    //     infDiv.classList.add("inf")

    //     const avatarImg = document.createElement("img")
    //     avatarImg.classList.add("ava")
    //     avatarImg.src = user.avatar_url

    //     infDiv.appendChild(avatarImg)

    //     const blockTextDiv = document.createElement("div")
    //     blockTextDiv.classList.add("block-text")

    //     const emailP = document.createElement("p")
    //     emailP.className = "email-paragraph"
    //     emailP.textContent = user.email

    //     const blockPetDiv = document.createElement("div")
    //     blockPetDiv.classList.add("block-pet")

    //     const petImg = document.createElement("img")
    //     petImg.classList.add("pet")
    //     petImg.src = user.pet_img

    //     const cross = document.createElement("img")
    //     cross.className = "cross_student"
    //     cross.src = document.querySelector(".hide-ava").dataset.cross

    //     blockDiv.appendChild(cross)

    //     const dataAnswer = document.createElement("p")
    //     dataAnswer.textContent = user.ready
    //     if (user.ready == "відповів"){
    //         count_answered++
    //     }
    //     blockTextDiv.append(dataAnswer)


    //     blockPetDiv.appendChild(petImg)

    //     blockTextDiv.appendChild(emailP)
    //     blockTextDiv.appendChild(blockPetDiv)

    //     blockDiv.appendChild(infDiv)
    //     blockDiv.appendChild(blockTextDiv)

    //     blockUsers.appendChild(blockDiv)
    //     }
    // )
    // document.querySelector(".count-answered-people").textContent = `відповіли  ${count_answered} / `
    // document.querySelector(".count-people").textContent = data.user_list.length
    // if (count_answered == count_users){
    //     socket.emit(
    //         "end_question",
    //         {code: localStorage.getItem("room_code")}
    //     )
    // }

    // // видалення юзера із кімнати block
    // allBlocks = document.getElementsByClassName("block")
    // for (let block of allBlocks){
        
    //     block.addEventListener('click', ()=>{
    //         socket.emit(
    //             "delete_user",
    //             {
    //                 room: localStorage.getItem("room_code"),
    //                 email: block.querySelector(".email-paragraph").textContent
    //             }
    //         )
    //     })
    // }

    const showAnswersBtn = document.querySelector(".check-answers")
    const answers = document.querySelectorAll(".answer")
    
    
    showAnswersBtn.addEventListener("click", ()=>{
        const checkstate = showAnswersBtn.dataset.state
        if(data.type_question != "input-gap"){
            if(checkstate == "hide"){
                showAnswersBtn.dataset.state = "show"
                showAnswersBtn.textContent = "сховати відповіді"
                for (let i = 0; i < answers.length; i++){
                    if (check_answers[i] == true){
                        answers[i].style.backgroundColor = "#9bde8dff"
                    } else{
                        answers[i].style.backgroundColor = "#ea5c64ff"
                    }
                }
            }else{
                for (let i = 0; i < answers.length; i++){
                    answers[i].style.backgroundColor = "#94C4FF"
                    showAnswersBtn.dataset.state = "hide"
                    showAnswersBtn.textContent = "Показати відповіді"
                }
            }
        }else{
            let box = document.querySelector(".correct-answers")
            if(checkstate == "hide"){
                showAnswersBtn.dataset.state = "show"
                showAnswersBtn.textContent = "сховати відповіді"
                box.innerHTML = "";
                for(let answerText of data.answer_options){
                    let answer = document.createElement("p")
                    answer.textContent = answerText
                    box.appendChild(answer)
                }
            }else{
                box.innerHTML = "Сховано";
                showAnswersBtn.dataset.state = "hide"
                showAnswersBtn.textContent = "Показати відповіді"
            }
        }
    })

    setInterval(() => {
        if (localStorage.getItem("flag_time") === "true") {

            let time = Number(localStorage.getItem("time_flag"));

            if (time <= 0) {
                minutesP.textContent = "00";
                secondsP.textContent = "00";

                socket.emit(
                    'end_time',
                    { 
                        index: localStorage.getItem("index_question"),
                        test_id: localStorage.getItem("test_id"),
                        room: localStorage.getItem("room_code")
                    }
                );
                return; 
            }

            time--;

            if (time < 60) {
                minutesP.textContent = "00";
                secondsP.textContent = time.toString().padStart(2, "0");
            } else {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;

                minutesP.textContent = minutes;
                secondsP.textContent = seconds.toString().padStart(2, "0");
            }

            localStorage.setItem("time_flag", time);

            socket.emit(
                "update_student_time_MS",
                { room: localStorage.getItem("room_code"), time }
            );

        } else {
            socket.emit(
                "update_student_time_MS",
                { room: localStorage.getItem("room_code"), time: "stop" }
            );
        }
    }, 1000);

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
        localStorage.setItem("time_flag", parseInt(localStorage.getItem("time_flag")) + 15)
    }
)

document.querySelector('.end_question').addEventListener(
    'click',
    () => {
        socket.emit(
            'end_time',
            { 
                index: localStorage.getItem("index_question"),
                test_id: localStorage.getItem("test_id"),
                room: localStorage.getItem("room_code")
            }
        );
    }
)

