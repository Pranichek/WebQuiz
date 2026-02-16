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
    blockUsers.innerHTML = ""

    let count_answered = 0
    let count_users = data.user_list.length
    
    data.user_list.forEach(user => {
        let user_card;
        if (user.ready == "відповів"){
            count_answered++
            user_card = `
                <div class="user-card active" data-id="${user.id}"> <div class="user-info">
                        <span class="user-name">${user.username}</span>
                    </div>
                    <div class="user-status finished">✔</div>
                </div>
            `
        }else{
            user_card = `
                <div class="user-card" data-id="${user.id}">
                    <div class="user-info">
                        <span class="user-name">${user.username}</span>
                    </div>
                    <div class="user-status box"></div>
                </div>
            `
        }

        blockUsers.insertAdjacentHTML('beforeend', user_card)
    })
    
    document.querySelector(".text-people").textContent = `${count_answered}/${count_users}`

    if (count_answered == count_users && count_users > 0){
        socket.emit(
            "end_question",
            {code: localStorage.getItem("room_code")}
        )
    }
})

socket.on("data_question_mentor", data => {
    const check_answers = []
    
    document.querySelector(".num-que").textContent = `${parseInt(localStorage.getItem("index_question")) + 1}/${data.amount_question}`

    const answersBlock = document.querySelector(".answers-test");
    answersBlock.innerHTML = "" 
    
    const questionTestBlock = document.querySelector(".question-test");
    const oldImage = questionTestBlock.querySelector(".image-cont");
    if (oldImage) oldImage.remove();

    if (data.img_url != "not") {
        const imgHTML = `
            <div class="image-cont">
                <img src="${data.img_url}">
            </div>
        `;
        document.querySelector(".question-test").innerHTML += imgHTML
    }

    document.querySelector(".question-text").textContent = data.text_question

    if (data.type_question == "input-gap"){
        answersBlock.innerHTML = `
            <div class="input-type">
                <p>правильна відповідь:</p>
                <p class="correct-answer-text">поки схована</p>
            </div>
        `;
    } else {
        const answers = data.answer_options.split("%?)(?%")
        
        answers[0] = answers[0].replace("(?%", "")
        answers[answers.length - 1] = answers[answers.length - 1].replace("%?)", "")
        
        answers.forEach((option, index) => {
            if(option[0] == "+"){
                check_answers.push(true)
            }else{
                check_answers.push(false)
            }

            option = (option.slice(1, -1) == "image?#$?image") ? null : option.slice(1, -1)

            let innerHTML = `<div class="sign"></div>`;

            if (option !== null) {
                innerHTML += `
                    <div class="text-part">
                        <p>${option}</p>
                    </div>
                `;
            }

            if(data.image_urls[index] != "none") {
               innerHTML += `
               <div class = 'answer-img-wrapper'>
                    <img src="${data.image_urls[index]}">
               </div>`
            }

            let answerHTML = `
                <div class="block-answer answer">
                    ${innerHTML}
                </div>
            `;
            
            answersBlock.insertAdjacentHTML("beforeend", answerHTML)
        });
    }

    const timerDisplay = document.querySelector("#timer-display");
    
    let timeFlag = localStorage.getItem("time_flag")

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (timeFlag == "false"){
        timerDisplay.textContent = formatTime(data.time_question);
        localStorage.setItem("time_flag", data.time_question)
    } else {
        timerDisplay.textContent = formatTime(parseInt(timeFlag));
    }

    const showAnswersBtn = document.querySelector(".check-answers") 
    
    const newBtn = showAnswersBtn.cloneNode(true);
    showAnswersBtn.parentNode.replaceChild(newBtn, showAnswersBtn);
    
    const showAnswersBtnActive = document.querySelector(".check-answers");

    showAnswersBtnActive.dataset.state = "hide"; 
    showAnswersBtnActive.innerHTML = `
        Переглянути відповіді
    `;

    showAnswersBtnActive.addEventListener("click", () => {
        const checkstate = showAnswersBtnActive.dataset.state
        const answerBlocks = document.querySelectorAll(".block-answer");

        if(data.type_question != "input-gap"){
            if(checkstate == "hide"){
                showAnswersBtnActive.dataset.state = "show"
                showAnswersBtnActive.innerHTML = `
                    Сховати відповіді
                `;
                
                answerBlocks.forEach((block, i) => {
                    if (check_answers[i] == true){
                        block.style.backgroundColor = "#7dc683"; 
                        block.style.borderColor = "#7dc683"; 
                    } else{
                        block.style.backgroundColor = "#ea5c64"; 
                        block.style.opacity = "0.7";
                    }
                });
            } else {
                showAnswersBtnActive.dataset.state = "hide"
                showAnswersBtnActive.innerHTML = `
                    Переглянути відповіді
                `;
                answerBlocks.forEach((block) => {
                    block.style.backgroundColor = "#9abcf7"; 
                    block.style.opacity = "1";
                });
            }
        } else {
            const correctTextP = document.querySelector(".correct-answer-text");
            if(checkstate == "hide"){
                showAnswersBtnActive.dataset.state = "show"
                showAnswersBtnActive.innerHTML = `
                    Сховати відповіді
                `;
                correctTextP.textContent = data.answer_options.join(", "); 
                correctTextP.style.color = "#7dc683"; 
            } else {
                showAnswersBtnActive.dataset.state = "hide"
                showAnswersBtnActive.innerHTML = `
                    Переглянути відповіді
                `;
                correctTextP.textContent = "поки схована";
                correctTextP.style.color = "#ffffff";
            }
        }
    })

    if (window.questionTimer) clearInterval(window.questionTimer);

    window.questionTimer = setInterval(() => {
        if (localStorage.getItem("flag_time") === "true") {

            let time = Number(localStorage.getItem("time_flag"));

            if (time <= 0) {
                timerDisplay.textContent = "00:00";

                socket.emit(
                    'end_time',
                    { 
                        index: localStorage.getItem("index_question"),
                        test_id: localStorage.getItem("test_id"),
                        room: localStorage.getItem("room_code")
                    }
                );
                localStorage.setItem("flag_time", "false"); 
                return; 
            }

            time--;
            
            timerDisplay.textContent = formatTime(time);

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
        let currentTime = parseInt(localStorage.getItem("time_flag"));
        let newTime = currentTime + 15;
        localStorage.setItem("time_flag", newTime);
        
        const m = Math.floor(newTime / 60).toString().padStart(2, '0');
        const s = (newTime % 60).toString().padStart(2, '0');
        document.querySelector("#timer-display").textContent = `${m}:${s}`;
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