const socket = io()

if (localStorage.getItem("index_question")){
    socket.emit('load_question', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
}

socket.on("users_data", data => {
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
    document.querySelector(".count-people").textContent = data.user_list.length
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


socket.on("data_question_mentor", data => {
    const check_answers = []
    
    const answersBlock = document.querySelector(".answers-test");
    answersBlock.innerHTML = "";
    
    document.querySelector(".question-test").insertAdjacentHTML(
        "afterbegin",
        `<img src="${data.questionImgUrl}" onerror="this.style.display = 'none';">`
    )
    document.querySelector(".question-text").textContent = data.text_question

    if (data.questionType == "input-gap"){
        document.querySelector(".answers-test").insertAdjacentHTML(
            "beforeend",
            `<input class="answer-input" type="text">`
        )
    }else{
        console.log(data.answer_options, "lolik")
        const answers = data.answer_options.split("%?)(?%")
        answers[0] = answers[0].replace("(?%", "")
        answers[-1] = answers[answers.length-1].replace("%?)", "")
        for (let option of answers){
            option = option.replace(/\?|\(|\)/g, "")
            
            
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
            minutesP.textContent = data.time_question
            secondsP.textContent = "00"
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
            minutesP.textContent = timeFlag
            secondsP.textContent = "00"
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
        if(checkstate == "hide"){
            showAnswersBtn.dataset.state = "show"
            showAnswersBtn.textContent = "сховати відповіді"
            for (let i = 0; i < answers.length; i++){
                if (check_answers[i] == true){
                    answers[i].style.backgroundColor = "green"
                } else{
                    answers[i].style.backgroundColor = "red"
                }
            }
        }else{
            for (let i = 0; i < answers.length; i++){
                answers[i].style.backgroundColor = "#94C4FF"
                showAnswersBtn.dataset.state = "hide"
                showAnswersBtn.textContent = "подивитися відповіді"
            }
        }
    })

    setInterval(() => {
        if (localStorage.getItem("flag_time") == "true"){
            let time = +localStorage.getItem("time_flag") - 1
            
            if (time < 61 && time > 0){
                minutesP.textContent = "00"
                secondsP.textContent = time
            } else if(time <= 0){
                console.log("time <= 0")
                socket.emit(
                    'end_question',
                    {code: localStorage.getItem("room_code")}
                )
            }else{
                const minutes = Math.floor(time / 60);
                let remainingSeconds = time % 60;
                
                if (remainingSeconds < 10) {
                    remainingSeconds = '0' + remainingSeconds;
                }
                minutesP.textContent = minutes
                secondsP.textContent = remainingSeconds        
            }
            localStorage.setItem("time_flag", time)
            socket.emit(
                "update_student_time_MS",
                {room: localStorage.getItem("room_code"), time: time}
            )
        } else{
            socket.emit(
                "update_student_time_MS",
                {room: localStorage.getItem("room_code"), time: "stop"}
            )
        }
    }, 1000)
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
            'end_question',
            {code: localStorage.getItem("room_code")}
        )
    }
)

