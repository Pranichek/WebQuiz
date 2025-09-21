const socket = io()

if (localStorage.getItem("index_question")){
    console.log("emit load_question", room_code)
    socket.emit('load_question', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
}


socket.on("update_users", (users, questionText, questionType, questionTime, answerOptions, questionImgUrl, answersImgUrls) => {
    const check_answers = []
    
    document.querySelector(".question-test").insertAdjacentHTML(
        "afterbegin",
        `<img src="${questionImgUrl}" onerror="this.style.display = 'none';">`
    )
    document.querySelector(".question-text").textContent = questionText
    answerOptions = answerOptions.split("%?)(?%")

    if (questionType == "input-gap"){
        document.querySelector(".answers-test").insertAdjacentHTML(
            "beforeend",
            `<input class="answer-input" type="text">`
        )
    }else{
        for (let option of answerOptions){
            option = option.replace(/%|\?|\(|\)/g, "")
            
            
            if(option[0] == "+"){
                check_answers.push(true)
            }else{
                check_answers.push(false)
            }

            option = option.slice(1, -1) 

            document.querySelector(".answers-test").insertAdjacentHTML(
                "beforeend",
                `<div class='answer'><div class='checkMark'></div>
                    <img src="${answersImgUrls[answerOptions.indexOf(option)]}" onerror="this.style.display = 'none';">
                    <p>${option}</p>
                </div>`
            )
        }
    }


    // if (questionTime < 60){
    //     document.querySelector(".right-part").textContent = questionTime
    // } else{
    //     document.querySelector(".left-part").textContent = questionTime / 60
    // }

    const minutesP = document.querySelector(".left-part")
    const secondsP = document.querySelector(".right-part")
    
    let timeFlag = localStorage.getItem("time_flag")

    if (timeFlag == "false"){
        if (questionTime < 61){
            minutesP.textContent = questionTime
            secondsP.textContent = "00"
        }else{
            const minutes = Math.floor(questionTime / 60);
            let remainingSeconds = questionTime % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = '0' + remainingSeconds;
            }
            minutesP.textContent = minutes
            secondsP.textContent = remainingSeconds        
        }
        localStorage.setItem("time_flag", questionTime)
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
            console.log("time =", time)
            
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