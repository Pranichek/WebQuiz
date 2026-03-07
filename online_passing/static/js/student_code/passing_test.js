export async function renderStudentPassing(params) {
    socket.off("end_test");
    socket.off("page_waiting");
    socket.off("student_question");
    socket.off("add_some_time");
    socket.off("end_this_question");
    socket.off("stop_time");
    socket.off("no_time");

    if (!localStorage.getItem("flag_time")) {
        localStorage.setItem("flag_time", "true"); 
    }
    
    if (window.studentTimerInterval) {
        clearInterval(window.studentTimerInterval);
    }

    socket.emit("connect_room", {
        code: localStorage.getItem("room_code"),
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id")
    });

    socket.on("end_test", data => {
        document.cookie = "test_status=finished; path=/; max-age=3600";
        window.location.replace("/online_finish");
    });


    function give_answer(checkFlag){
        let midletime = localStorage.getItem("wasted_time") || 0;
        midletime = parseInt(localStorage.getItem("timeData"));
        localStorage.setItem("wasted_time", midletime);
        let stored = localStorage.getItem("users_answers");
        
        let answers = stored.split(",");
        let lastAnswers = answers[answers.length - 1];

        let currentBonus = checkFlag == true ? "10" : "0";
        let checkRight = checkFlag == true ? "yes" : "not";

        socket.emit('answered', {
            code: localStorage.getItem("room_code"), 
            total_time: localStorage.getItem("default_time"), 
            wasted_time: parseInt(localStorage.getItem("timeData")),
            right_answered: checkRight,
            id_test: localStorage.getItem("test_id"),
            index: localStorage.getItem("index_question"),
            lastanswers: lastAnswers,
            users_answers: localStorage.getItem("users_answers"),
            value_bonus: currentBonus
        });
    }

    let timeQuestion;
    let timer = document.querySelector("#timer-display");
    let amountAnswers;
    let circle = document.querySelector('.circle');
    let manyVariants = [];
    let manyBlock;
    let valueBonus;
    let checkQuestion = false;

    function addBonus(count_points) {
        let bonusInput = document.getElementById("bonus");
        let bonusValue = parseInt(bonusInput.dataset.value);
        return bonusValue + count_points;
    };

    function countMoney(value) {
        let startValue = parseInt(document.querySelector(".count-money").textContent);
        let delay = 20; 
        let step = 2;   
        let totalDelay = 0;

        for (let i = startValue; i < value; i++) {
            totalDelay += delay;
            setTimeout(() => {
                document.querySelector(".count-money").textContent = i + 1;
            }, totalDelay);
            delay += step;
        }
    }

    socket.on("page_waiting", data => {
        localStorage.setItem("next_page", "waiting_student");
    });

    socket.on('student_question', (data) => {
        console.log(localStorage.getItem("index_question"))
        console.log(data.index)

        const bigImg = document.querySelector(".bigimg");
        if (bigImg) {
            bigImg.remove();
        }
        
        if (data.question != "Кінець"){
            localStorage.setItem("default_time", data.test_time);
            localStorage.setItem("check_message", "false");

            const divQuestion = document.querySelector(".question");
            divQuestion.style.marginBottom = "0vh";

            let bonusInput = document.getElementById("bonus");
            if(bonusInput) bonusInput.style.width = `${data.value_bonus}%`;

            document.querySelector(".modal").style.display = "none";
            document.querySelector(".right-answer").classList.remove("fade-in-anim");
            document.querySelector(".uncorrect-answer").classList.remove("fade-in-anim");
            document.querySelector(".sad_robot").classList.remove("fade-in-anim-robot");
            document.querySelector(".happy_robot").classList.remove("fade-in-anim-robot");
            document.querySelector(".coin-anim").classList.remove("fade-in-coin");

            const ansCont = document.querySelector(".answers");
            ansCont.innerHTML = "";
            ansCont.removeAttribute("style");
            
            if (localStorage.getItem("checkOportunity") == "not") {
                ansCont.style.pointerEvents = "none";
            } else {
                ansCont.style.pointerEvents = "auto";
            }
            
            if (data.check_reload){
                if (data.check_reload.startsWith("da/")) {
                    const bonus = parseInt(data.check_reload.split("/")[1]);
                    countMoney(bonus);
                }
            }

            const oldConfirmBtn = document.querySelector(".confirm-button");
            if (oldConfirmBtn) {
                oldConfirmBtn.remove();
            }

            const oldSend = document.querySelector(".view-answers-btn")

            if (oldSend){
                oldSend.remove();
            }

            if (localStorage.getItem("next_page") && localStorage.getItem("next_page") != "none"){
                if (localStorage.getItem("next_page") == "result_student"){
                    localStorage.setItem("next_page", "none");
                    // let index = localStorage.getItem("index_question");
                    // index = parseInt(index) + 1;
                    // localStorage.setItem("index_question", index);
                    // window.location.replace("/result_student");
                } else if(localStorage.getItem("next_page") == "waiting_student"){
                    if (localStorage.getItem("checkCorrect") == "false"){
                        document.querySelector(".modal").style.display = "block";
                        document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                        document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");

                        const audioNegative = document.querySelector("#incorrect-sound");
                        if (audioNegative) audioNegative.play();
                    } else if(localStorage.getItem("checkCorrect") == "true"){
                        document.querySelector(".modal").style.display = "block";
                        document.querySelector(".right-answer").classList.add("fade-in-anim");
                        document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");

                        const audio = document.querySelector("#correct-sound");
                        if (audio) audio.play();
                    } else {
                        document.querySelector(".modal").style.display = "block";
                        document.querySelector(".skip-answer").classList.add("fade-in-anim");
                        document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");

                        const audioNegative = document.querySelector("#incorrect-sound");
                        if (audioNegative) audioNegative.play();
                    }
                }
            }

            const imgContainer = document.getElementById("image-container");
            if(imgContainer) imgContainer.innerHTML = "";

            let typeQuestion = data.type;
            let answers = data.answers;
            let amountAnswers = data.answers.length;
            let dataCookie = localStorage.getItem("time_question");
            let correctIndexes = data.correct_answers;

            const cont = document.querySelector(".answers");
            if (dataCookie == "set"){
                timeQuestion = data.test_time;
                if (timeQuestion != "not"){
                    if (timeQuestion < 61){
                        document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(timeQuestion)}`);
                    } else {
                        const minutes = Math.floor(timeQuestion / 60);
                        let remainingSeconds = timeQuestion % 60;
                        if (remainingSeconds < 10) {
                            remainingSeconds = '0' + remainingSeconds;
                        }
                        document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`);
                    }
                }
                localStorage.setItem('time_question', timeQuestion);
                const maxTime = parseInt(data.test_time);
                localStorage.setItem('max_time', maxTime);
                localStorage.setItem("timeData", "0");
            } 

            let justAnswerDiv = document.querySelector(".answers");
            justAnswerDiv.style.display = "flex";

            const simpleQuestion = document.querySelector(".question");

            if (data.question_img == "not"){
                simpleQuestion.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">${data.index}/${data.amount_question}</p>
                    </div>
                    <div class= "question-bg">
                        <p class="question-test">${data.question}</p>
                    </div>
                `;
            } else {
                simpleQuestion.className = ("question-img");
                simpleQuestion.innerHTML = `
                    <div class = "container-question">
                        <div class="num-question">
                            <p class="num-que">${data.index}/${data.amount_question}</p>
                        </div>
                        <div class= "question-bg">
                            <p class="question-test">${data.question}</p>
                        </div>
                    </div>
                    <div class="simple-image">
                        <img src="${data.question_img}"></img>
                    </div>
                `;

                let imgBig = document.querySelector(".simple-image");
                let bigImg = document.createElement("div");
                imgBig.addEventListener('click', () => {
                    bigImg.style.opacity = "0";
                    bigImg.style.transition = "opacity 0.3s ease";
                    setTimeout(() => {
                        bigImg.style.opacity = "1";
                    }, 10);
                    
                    bigImg.className = "bigimg";
                    bigImg.innerHTML = `<img src="${data.question_img}"></img>`;
                    document.body.appendChild(bigImg);
                    bigImg.addEventListener("click", () => {
                        bigImg.remove();
                    });
                });
            }
            
            if (simpleQuestion.classList.contains("fade-up")){
                simpleQuestion.classList.remove("fade-up");
                simpleQuestion.classList.remove("show-question");
            }
            
            simpleQuestion.classList.add("fade-up");

            setTimeout(() => {
                simpleQuestion.classList.add("show-question");
            }, 100);

            const imgQuestion = document.querySelector(".question-image");
            document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`;

            if (typeQuestion == "one-answer"){
                let list_images = data.answers_image;

                cont.innerHTML = `
                    <div class="variant fade-in" data-value="0" id="v0">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in" data-value="1" id="v1">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in" data-value="2" id="v2">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in" data-value="3" id="v3">
                        <p class="variant-text"></p>
                    </div>
                `;

                setTimeout(() => {
                    let divs = document.querySelectorAll(".variant");
                    for (let div of divs){
                        div.classList.add("show");
                    }
                }, 100);

                let blockanswers = document.querySelectorAll(".variant");

                for (let block of blockanswers){
                    block.addEventListener('click', () => {
                        if (localStorage.getItem("checkOportunity") == "not"){
                            return;
                        }
                        localStorage.setItem("checkOportunity", "not");
                        localStorage.setItem("answered_index", data.index);
                        
                        document.querySelector(".answers").style.pointerEvents = "none";

                        let chekcookies = localStorage.getItem("users_answers");

                        if (chekcookies && chekcookies !== '') {
                            let cookieList = chekcookies.split(",");
                            cookieList.push(block.dataset.value);
                            localStorage.setItem("users_answers", cookieList.join(","));
                        } else {
                            localStorage.setItem("users_answers", block.dataset.value);
                        }

                        block.style.border = "4px solid white"; 
                        block.style.transition = "all 0.3s ease"; 
                        let checkCorrect = false;

                        if (correctIndexes.includes(parseInt(block.dataset.value))){
                            checkCorrect = true;
                        }

                        give_answer(checkCorrect);

                        setTimeout(() => {
                            document.querySelector(".modal").style.display = "block";
                            if (checkCorrect) {
                                localStorage.setItem("checkCorrect", "true");
                                document.querySelector(".right-answer").classList.add("fade-in-anim");
                                document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                valueBonus = "10";
                                const audio = document.querySelector("#correct-sound");
                                if (audio) audio.play();

                                if(bonusInput) {
                                    let bonus = bonusInput.style.width;
                                    let clearValue = parseInt(bonus.replace("%"));
                                    bonusInput.style.width = `${clearValue + 10}%`;
                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin");
                                    }
                                }
                            } else {
                                localStorage.setItem("checkCorrect", "false");
                                valueBonus = "0";
                                document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                                document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");

                                const audioNegative = document.querySelector("#incorrect-sound");
                                if (audioNegative) audioNegative.play();
                            }
                        }, 699);
                    });
                }

                for (let index = 0; index < amountAnswers; index++) {
                    blockanswers[index].style.display = 'flex';
                    if (list_images[index] != "none"){
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "variant-image-container";

                        const imgElem = document.createElement("img");
                        imgContainer.appendChild(imgElem);
                        imgElem.src = list_images[index];

                        blockanswers[index].appendChild(imgContainer);
                        blockanswers[index].querySelector(".variant-text").style.fontSize = "2.5vh";
                    }
                }


                for (let index = 0; index < amountAnswers; index++) {
                    if (blockanswers[index].style.display == "flex"){
                        if (answers[index] != "image?#$?image"){
                            blockanswers[index].querySelector(".variant-text").textContent = answers[index][1];
                            blockanswers[index].dataset.value = answers[index][0];                             
                            blockanswers[index].querySelector(".variant-text").id = `v${answers[index][0]}`;
                        }
                    }
                }

                let countVisible = 0;
                const blockList = document.querySelectorAll(".variant");

                for (let block of blockList){
                    if (block.checkVisibility()){
                        countVisible += 1;
                    }
                }

                let width = 100 / countVisible;
                let colors = ["#e9e561", "#51f4c0", "#71adf7", "#bb77f6"];

                for (let index = 0; index < amountAnswers; index++) {
                    blockanswers[index].style.width = `${width}%`;
                    blockanswers[index].style.backgroundColor = colors[index];
                }
            } else if (typeQuestion == "many-answers"){
                const checkMarkUrl = "/static/images/check-mark.png";
                let list_images = data.answers_image;

                cont.innerHTML = `
                    <div class="many-variant fade-in" data-value="0" value="{${data.answers[0][0]}">
                        <div class="check-input" data-value="0">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in" data-value="1" value="${data.answers[1][0]}">
                        <div class="check-input" data-value="1">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in" data-value="2" value="${data.answers[2][0]}">
                        <div class="check-input" data-value="2">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">sdc</p>
                    </div>
                    <div class="many-variant fade-in" data-value="3" value="${data.answers[3][0]}">
                        <div class="check-input" data-value="3">
                            <img src="${checkMarkUrl}" class="check-mark" alt="j">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                `;

                const mainCont = document.querySelector(".answers");

                if (mainCont) {
                    mainCont.insertAdjacentHTML('beforeend', `
                        <div class="circle-send">
                            <p>надіслати відповідь</p>
                        </div>
                    `);

                    document.querySelector(".circle-send").addEventListener("click", () => {
                        const confirmBtn = document.querySelector(".confirm-button");
                        if (confirmBtn && !confirmBtn.disabled) {
                            confirmBtn.click(); 
                        }
                    });
                }
                                
                setTimeout(() => {
                    let divs = document.querySelectorAll(".many-variant");
                    for (let div of divs){
                        div.classList.add("show");
                    }
                }, 100);
                
                manyBlock = document.querySelectorAll(".many-variant");

                const sideMenu = document.querySelector(".controls-section");
                let confirm_button = document.createElement("button");
                confirm_button.className = "check-answers confirm-button";
                confirm_button.textContent = "Надіслати відповідь";

                if (localStorage.getItem("checkOportunity") == "not") {
                    confirm_button.disabled = true;
                    confirm_button.style.pointerEvents = "none";
                }

                sideMenu.appendChild(confirm_button);

                if (localStorage.getItem("checkOportunity") == "not") {
                    confirm_button.disabled = true;
                    confirm_button.style.pointerEvents = "none";
                }

                let manyVariantsBlock = document.querySelectorAll(".many-variant");

                for (let manyblock of manyVariantsBlock){
                    manyblock.addEventListener('click', () => {
                        if (localStorage.getItem("checkOportunity") == "not"){
                            return;
                        }
                        const value = manyblock.dataset.value;
                        const checkMark = manyblock.querySelector('.check-mark');

                        let index = manyVariants.indexOf(value);
                        if (index == -1) {
                            manyVariants.push(value);
                            manyblock.style.borderWidth = '3px';
                            checkMark.style.display = 'flex';
                        } else {
                            manyVariants.splice(index, 1);
                            manyblock.style.borderWidth = '0px';
                            checkMark.style.display = 'none';
                        }

                        const listString = JSON.stringify(manyVariants);
                        localStorage.setItem("manyvariants", listString);

                        const confirmButton = document.querySelector(".confirm-button");
                        const circleSendBtn = document.querySelector(".circle-send"); 

                        if (manyVariants.length > 0){
                            confirmButton.style.background = `#C39FE4`;
                            if (circleSendBtn) circleSendBtn.classList.add("show-btn"); 
                        } else {
                            confirmButton.style.background = `rgba(255, 255, 255, 0.1)`;
                            if (circleSendBtn) circleSendBtn.classList.remove("show-btn"); 
                        }
                    });
                }

                confirm_button.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    if (manyVariants.length > 0 && localStorage.getItem("checkOportunity") !== "not"){
                        localStorage.setItem("checkOportunity", "not");
                        localStorage.setItem("answered_index", data.index);
                        
                        document.querySelector(".answers").style.pointerEvents = "none";
                        confirm_button.disabled = true;
                        confirm_button.style.pointerEvents = "none";

                        let chekcookies = localStorage.getItem("users_answers");
                        let dataString = manyVariants.join("@");

                        if (chekcookies != ''){
                            let oldCookie = localStorage.getItem("users_answers");
                            let cookieList = oldCookie.split(",");
                            cookieList.push(dataString);
                            localStorage.setItem("users_answers", cookieList);
                        } else {
                            localStorage.setItem("users_answers", dataString);
                        }

                        let currentCorrect = 0;
                        let currentUncorrect = 0;

                        let checkMarks = document.querySelectorAll(".check-input");

                        for (let checkMark of checkMarks){
                            if (manyVariants.includes(checkMark.dataset.value)){
                                if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                    checkMark.style.backgroundColor = '#8AF7D4';
                                    currentCorrect += 1;
                                } else {
                                    checkMark.style.backgroundColor = '#E05359';
                                    currentUncorrect += 1;
                                }
                            }
                        }

                        manyVariants.length = 0;
                        const totalCorrect = correctIndexes.length; 
                        let checkCorrect = false;

                        if (currentCorrect > totalCorrect / 2 && currentUncorrect == 0){
                            checkCorrect = true;
                        }

                        give_answer(checkCorrect);

                        if (checkCorrect){
                            setTimeout(() => {
                                localStorage.setItem("checkCorrect", "true");
                                document.querySelector(".modal").style.display = "block";
                                document.querySelector(".right-answer").classList.add("fade-in-anim");
                                document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                valueBonus = "10";
                                const audio = document.querySelector("#correct-sound");
                                if (audio) audio.play();

                                if(bonusInput) {
                                    let bonus = bonusInput.style.width;
                                    let clearValue = parseInt(bonus.replace("%"));
                                    bonusInput.style.width = `${clearValue + 10}%`;
                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin");
                                    }
                                }

                                for (let checkMark of checkMarks){
                                    if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                        checkMark.style.backgroundColor = '#8AF7D4';
                                    }
                                }
                            }, 699);
                        } else {
                            setTimeout(() => {
                                localStorage.setItem("checkCorrect", "false");
                                document.querySelector(".modal").style.display = "block";
                                document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                                document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");
                                valueBonus = "0";

                                const audioNegative = document.querySelector("#incorrect-sound");
                                if (audioNegative) audioNegative.play();
                                for (let checkMark of checkMarks){
                                    if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                        checkMark.style.backgroundColor = '#8AF7D4';
                                    }
                                }
                            }, 699);
                        }
                    }
                });

                let manyBlockAnswers = document.querySelectorAll(".many-variant");
                let variantText = document.querySelectorAll(".variant-text");

                for (let index = 0; index < amountAnswers; index++) {
                    manyBlockAnswers[index].style.display = 'flex';
                    if (list_images[index] != "none"){
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "variant-image-container";

                        const imgElem = document.createElement("img");
                        imgContainer.appendChild(imgElem);
                        imgElem.src = list_images[index];
                        variantText[index].style.fontSize  = "2.5vh";

                        manyBlockAnswers[index].appendChild(imgContainer);
                    }
                }

                for (let index = 0; index < amountAnswers; index++) {
                    if (manyBlockAnswers[index].style.display == "flex"){
                        if (answers[index] != "image?#$?image"){
                            variantText[index].textContent = answers[index][1];
                            manyBlockAnswers[index].dataset.value = answers[index][0];                            
                            let checkInput = manyBlockAnswers[index].querySelector(".check-input");
                            if (checkInput) {
                                checkInput.dataset.value = answers[index][0];
                            }
                        }
                    }
                }
            } else if (typeQuestion == "input-gap"){
                const sideMenu = document.querySelector(".controls-section");
                let confirm_button = document.createElement("button");
                confirm_button.className = "check-answers confirm-button";
                confirm_button.textContent = "Надіслати відповідь";

                if (localStorage.getItem("checkOportunity") == "not") {
                    confirm_button.disabled = true;
                    confirm_button.style.pointerEvents = "none";
                }
                sideMenu.appendChild(confirm_button);

                if (amountAnswers == 0){
                    const divparent = document.querySelector(".answers");

                    const text = document.createElement("p");
                    text.textContent = "введіть свою відповідь у поле";
                    text.className = "input-text";
                    text.style.color = "#ffffff";
                    
                    divparent.appendChild(text);

                    const inputDiv = document.createElement("div");
                    inputDiv.className = "confirm-answer";

                    let answer = data.answers[0];
                    for (let i = 0; i < answer.length; i++) {
                        const input = document.createElement("input");
                        input.className = "small-input-answer";
                        input.style.color = "#ffffff";
                        input.maxLength = 1;
                        input.style.width = "4.4vw";
                        input.style.margin = "0 0.4vw";
                        input.autocomplete = "off";
                        input.type = "text";
                        input.inputMode = "text";
                        input.setAttribute("data-index", i);

                        if (localStorage.getItem("checkOportunity") == "not") {
                            input.disabled = true;
                        }

                        input.addEventListener("input", function () {
                            if (this.value.length == 1 && i < answer.length - 1) {
                                const nextInput = inputDiv.querySelector(`input[data-index="${i + 1}"]`);
                                if (nextInput) nextInput.focus();
                            }
                        });

                        input.addEventListener("keydown", function (e) {
                            if (e.key == "Backspace" && this.value == "" && i > 0) {
                                const prevInput = inputDiv.querySelector(`input[data-index="${i - 1}"]`);
                                if (prevInput) prevInput.focus();
                            }
                        });

                        inputDiv.appendChild(input);
                    }
                    divparent.appendChild(inputDiv);

                    divparent.style.height = "35vh";
                    divparent.style.flexDirection = "column";
                    divparent.style.gap = "10vh";
                    divparent.style.backgroundColor = "#5c5c5c";
                    divparent.style.display = "flex";

                    let inputs = document.querySelectorAll(".small-input-answer");
                    let avaible = false;

                    for (let input of inputs){
                        input.addEventListener("input", () => {
                            let count = 0;
                            for (let input of inputs){
                                if (input.value.trim() != ""){
                                    count++;
                                }
                            }

                            if (count == inputs.length){
                                confirm_button.style.background = `#C39FE4`;
                                avaible = true;
                            } else {
                                confirm_button.style.background = `rgba(255, 255, 255, 0.1)`;
                                avaible = false;
                            }
                        });
                    }

                    confirm_button.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        if (avaible && localStorage.getItem("checkOportunity") !== "not"){
                            localStorage.setItem("checkOportunity", "not");
                            localStorage.setItem("answered_index", data.index);

                            let allInputs = document.querySelectorAll(".small-input-answer");
                            allInputs.forEach(inp => inp.disabled = true);
                            confirm_button.disabled = true;
                            confirm_button.style.pointerEvents = "none";

                            let chekcookies = localStorage.getItem("users_answers");
                            
                            let dataString = "";
                            inputs.forEach(input => {
                                dataString += input.value.trim();
                            });

                            if (chekcookies != ''){
                                let oldCookie = localStorage.getItem("users_answers");
                                let cookieList = oldCookie.split(",");
                                cookieList.push(dataString);
                                localStorage.setItem("users_answers", cookieList);
                            } else {
                                localStorage.setItem("users_answers", dataString);
                            }

                            let answers = data.answers;
                            let checkCorrect = false;

                            if (answers.includes(dataString)){
                                checkCorrect = true;
                            }

                            give_answer(checkCorrect);

                            if (checkCorrect){
                                setTimeout(() => {
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    localStorage.setItem("checkCorrect", "true");
                                    valueBonus = "10";
                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();

                                    if(bonusInput) {
                                        let bonus = bonusInput.style.width;
                                        let clearValue = parseInt(bonus.replace("%"));
                                        bonusInput.style.width = `${clearValue + 10}%`;
                                        if (clearValue + 10 >= 100){
                                            document.querySelector(".coin-anim ").classList.add("fade-in-coin");
                                        }
                                    }
                                }, 699);
                            } else {
                                setTimeout(() => {
                                    localStorage.setItem("checkCorrect", "false");
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "0";

                                    let answer = data.answers[0];
                                    for (let i = 0; i < inputs.length; i++) {
                                        if (inputs[i].value.trim() == answer[i]) {
                                            inputs[i].style.backgroundColor = "#8AF7D4";
                                        } else {
                                            inputs[i].style.backgroundColor = "#E05359";
                                        }
                                    }
                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();
                                }, 699);
                            }
                        }
                    });
                } else {
                    const divparent = document.querySelector(".answers");

                    const text = document.createElement("p");
                    text.textContent = "введіть свою відповідь у поле";
                    text.className = "input-text";
                    text.style.color = "#ffffff";

                    const inputDiv = document.createElement("div");
                    inputDiv.className = "confirm-answer";

                    const input = document.createElement("input");
                    input.className = "input-answer";
                    if (localStorage.getItem("checkOportunity") == "not") {
                        input.disabled = true;
                    }

                    inputDiv.appendChild(input);

                    const sendBtnDiv = document.createElement("div");
                    
                    

                    sendBtnDiv.textContent = "Надіслати";
                    sendBtnDiv.className = "view-answers-btn check-answers";
                    sendBtnDiv.style.cursor = "pointer";
                    sendBtnDiv.style.background = "rgba(255, 255, 255, 0.1)";

                    if (localStorage.getItem("checkOportunity") == "not") {
                        sendBtnDiv.style.pointerEvents = "none";
                    }

                    divparent.classList.add("input-gap-layout");
                    divparent.appendChild(text);
                    divparent.appendChild(inputDiv);
                    divparent.appendChild(sendBtnDiv);

                    sendBtnDiv.addEventListener('click', () => {
                        if (!confirm_button.disabled) {
                            document.querySelector(".confirm-button").click();
                        }
                    });
                    
                    divparent.style.height = "35vh";
                    divparent.style.flexDirection = "column";
                    divparent.style.gap = "10vh";
                    divparent.style.backgroundColor = "#414040";
                    divparent.style.display = "flex";

                    let avaible = false;

                    document.querySelector(".input-answer").addEventListener('input', () => {
                        const inputValue = document.querySelector(".input-answer").value.trim();

                        if (inputValue.trim() != ''){
                            document.querySelector(".check-answers").style.background = `#C39FE4`;
                            confirm_button.style.background = `#C39FE4`;
                            avaible = true;
                        } else {
                            document.querySelector(".check-answers").style.background = `rgba(255, 255, 255, 0.1)`;
                            confirm_button.style.background = `rgba(255, 255, 255, 0.1)`;
                            avaible = false;
                        }
                    });

                    confirm_button.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        if (avaible && localStorage.getItem("checkOportunity") !== "not"){
                            localStorage.setItem("checkOportunity", "not");
                            localStorage.setItem("answered_index", data.index);
                            
                            document.querySelector(".input-answer").disabled = true;
                            confirm_button.disabled = true;
                            confirm_button.style.pointerEvents = "none";
                            sendBtnDiv.style.pointerEvents = "none";

                            let chekcookies = localStorage.getItem("users_answers");
                            let dataString = document.querySelector(".input-answer").value.trim();

                            if (chekcookies != ''){
                                let oldCookie = localStorage.getItem("users_answers");
                                let cookieList = oldCookie.split(",");
                                cookieList.push(dataString);
                                localStorage.setItem("users_answers", cookieList);
                            } else {
                                localStorage.setItem("users_answers", dataString);
                            }
                            
                            let answers = data.answers;
                            let checkCorrect = false;

                            if (answers.includes(dataString)){
                                checkCorrect = true;
                            }

                            give_answer(checkCorrect);

                            if (checkCorrect){
                                setTimeout(() => {
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    localStorage.setItem("checkCorrect", "true");
                                    valueBonus = "10";
                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();

                                    if(bonusInput) {
                                        let bonus = bonusInput.style.width;
                                        let clearValue = parseInt(bonus.replace("%"));
                                        bonusInput.style.width = `${clearValue + 10}%`;
                                        if (clearValue + 10 >= 100){
                                            document.querySelector(".coin-anim ").classList.add("fade-in-coin");
                                        }
                                    }
                                }, 699);
                            } else {
                                setTimeout(() => {
                                    localStorage.setItem("checkCorrect", "false");
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "0";

                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();
                                }, 699);
                            }
                        }
                    });
                }
            }
            
            let countVisible = 0;
            const blockList = document.querySelectorAll(".many-variant");
            if (blockList) {
                const visibleBlocks = Array.from(blockList).filter(block => block.checkVisibility());
                countVisible = visibleBlocks.length;

                let width = 100 / countVisible;
                let colors = ["#e9e561", "#51f4c0", "#71adf7", "#bb77f6"];

                visibleBlocks.forEach((block, index) => {
                    block.style.width = `${width}%`;
                    block.style.backgroundColor = colors[index % colors.length];
                });
            }
        } else {
            setTimeout(() => {
                document.cookie = "test_status=finished; path=/; max-age=3600";
                window.location.replace('/online_finish');
            }, 1000);
        }
    });

    window.addEventListener('load', () => {
        let checkTime = localStorage.getItem('time_question');
        let checkOportunity = localStorage.getItem("checkOportunity");

        if (checkTime != "not"){
            timeQuestion = parseInt(localStorage.getItem('time_question'));

            if (isNaN(timeQuestion)) {
                document.querySelectorAll(".timer-display").forEach(t => t.textContent = "-");
                return; 
            }
            
            if (checkOportunity !== "not") {
                timeQuestion -= 1; 
                localStorage.setItem('time_question', timeQuestion);
            }
            
            if (timeQuestion < 61){
                document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(timeQuestion)}`);
            } else {
                const minutes = Math.floor(timeQuestion / 60);
                let remainingSeconds = timeQuestion % 60;
                if (remainingSeconds < 10) {
                    remainingSeconds = '0' + remainingSeconds;
                }
                document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`);
            }

            setTimeout(() => {
                checkOportunity = localStorage.getItem("checkOportunity");
                timeQuestion = parseInt(localStorage.getItem('time_question'));

                if (isNaN(timeQuestion)) {
                    document.querySelectorAll(".timer-display").forEach(t => t.textContent = "-");
                    return;
                }
                
                if (checkOportunity !== "not") {
                    timeQuestion -= 1;
                    localStorage.setItem('time_question', timeQuestion);
                }

                if (timeQuestion < 61){
                    document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(timeQuestion)}`);
                } else {
                    const minutes = Math.floor(timeQuestion / 60);
                    let remainingSeconds = timeQuestion % 60;
                    if (remainingSeconds < 10) {
                        remainingSeconds = '0' + remainingSeconds;
                    }
                    document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`);
                }
            }, 1000);
        }
    });
    
    socket.on("add_some_time", data => {
        timeQuestion = parseInt(localStorage.getItem('time_question'));
        let wasted_time = parseInt(timeQuestion);
        localStorage.setItem('time_question', wasted_time+15);
    });

    socket.on("end_this_question", data => {
        localStorage.setItem("checkOportunity", "not");
        document.querySelector(".answers").style.pointerEvents = "none";
        localStorage.setItem('time_question', "set");

        let chekcookies = localStorage.getItem("users_answers");
        if (chekcookies){
            let oldCookie = localStorage.getItem("users_answers");
            let cookieList = oldCookie.split(",");
            cookieList.push("∅");
            localStorage.setItem("users_answers", cookieList);
        } else {
            localStorage.setItem("users_answers", "∅");
        }

        let midletime = localStorage.getItem("wasted_time");
        
        let stored = localStorage.getItem("users_answers");
        let answers = stored.split(",");
        let lastAnswers = answers[answers.length - 1];
        
        socket.emit('answered', {
            code: localStorage.getItem("room_code"), 
            total_time: localStorage.getItem("default_time"), 
            wasted_time: parseInt(localStorage.getItem("timeData")),
            right_answered: "not",
            id_test: localStorage.getItem("test_id"),
            index: localStorage.getItem("index_question"),
            lastanswers: lastAnswers,
            users_answers: localStorage.getItem("users_answers")
        });

        let index = localStorage.getItem("index_question");
        index = parseInt(index) + 1;
        localStorage.setItem("index_question", index);

        midletime = (parseInt(localStorage.getItem("timeData")));
        localStorage.setItem("wasted_time", midletime);
        localStorage.setItem("timeData", "0");
    });

    socket.on("stop_time", data => {
        let checkdata = localStorage.getItem("flag_time");
        if (checkdata == "false"){
            localStorage.setItem("flag_time", "true");
        } else {
            localStorage.setItem("flag_time", "false");
        }
    });

    socket.on("no_time", data => {
        if (localStorage.getItem("next_page") == "none"){
            localStorage.setItem("checkCorrect", "skip");
            localStorage.setItem("next_page", "waiting_student");
            localStorage.setItem("checkOportunity", "not");
            document.querySelector(".modal").style.display = "block";
            document.querySelector(".skip-answer").classList.add("fade-in-anim");
            document.querySelector(".sad_robot").classList.add("fade-in-anim-robot");

            const audioNegative = document.querySelector("#incorrect-sound");
            if (audioNegative) audioNegative.play();
            document.querySelector(".answers").style.pointerEvents = "none";
            localStorage.setItem('time_question', "set");

            if (localStorage.getItem("check_message") == "false"){
                localStorage.setItem("check_message", "true");
                let chekcookies = localStorage.getItem("users_answers");
                if (chekcookies){
                    let oldCookie = localStorage.getItem("users_answers");
                    let cookieList = oldCookie.split(",");
                    cookieList.push("∅");
                    localStorage.setItem("users_answers", cookieList);
                } else {
                    localStorage.setItem("users_answers", "∅");
                }

                let midletime = localStorage.getItem("wasted_time");
                midletime = (parseInt(localStorage.getItem("timeData")));
                localStorage.setItem("wasted_time", midletime);
                localStorage.setItem("timeData", "0");

                let stored = localStorage.getItem("users_answers");
                let answers = stored.split(",");
                let lastAnswers = answers[answers.length - 1];
                
                socket.emit('answered', {
                    code: localStorage.getItem("room_code"), 
                    total_time: localStorage.getItem("default_time"), 
                    wasted_time: parseInt(localStorage.getItem("timeData")),
                    right_answered: "not",
                    id_test: localStorage.getItem("test_id"),
                    index: localStorage.getItem("index_question"),
                    lastanswers: lastAnswers,
                    users_answers: localStorage.getItem("users_answers"),
                    check_end: "true"
                });

                let index = localStorage.getItem("index_question");
                index = parseInt(index) + 1;
                localStorage.setItem("index_question", index);
            }
        }
    });

    window.studentTimerInterval = setInterval(() => {
        if (localStorage.getItem("checkOportunity") == "not") return;

        let checkTime = localStorage.getItem('time_question');
        let flag_time = localStorage.getItem("flag_time"); 

        if (checkTime && checkTime != "not" && flag_time != "false"){
            
            timeQuestion = parseInt(checkTime); 

            if (isNaN(timeQuestion)) {
                return; 
            }

            if (timeQuestion >= 1){
                let wasted_time = parseInt(localStorage.getItem("timeData")) || 0;
                wasted_time += 1;
                localStorage.setItem("timeData", wasted_time);
                
                timeQuestion -= 1; 
                localStorage.setItem('time_question', timeQuestion); 
            }

            if (timeQuestion < 61){
                document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(timeQuestion)}`);
            } else {
                const minutes = Math.floor(timeQuestion / 60);
                let remainingSeconds = timeQuestion % 60;
                if (remainingSeconds < 10) {
                    remainingSeconds = '0' + remainingSeconds;
                }
                document.querySelectorAll(".timer-display").forEach(t => t.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`);
            }
        }
    }, 1000);

    if (localStorage.getItem("reload") == "yes"){
        localStorage.setItem("reload", "no");
    }
}