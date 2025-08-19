// Перевірка на те що користувач потрапив на сторінку проходження тесту не через пошукову стрічку
let chcklocal = document.referrer

if (!chcklocal.includes("test_data")){
    window.location.replace('/');
}


// Створюємо об'єкт сокету 
const socket = io();  

let timeQuestion;
let timer = document.querySelector(".timer");
let amountAnswers;
let circle = document.querySelector('.circle');
let manyVariants = []
let manyBlock;
let valueBonus;

let checkOportunity;

// фунція підрахунку бонусів
function addBonus(count_points) {
    // Get the current bonus value from the input field
    let bonusInput = document.getElementById("bonus");
    let bonusValue = parseInt(bonusInput.dataset.value);

    // Add the bonus value to the total bonus value
    let totalBonusValue = bonusValue + count_points;

    return totalBonusValue;
};


if (localStorage.getItem("index_question") == "0"){
    localStorage.setItem('index_question', '0');
    localStorage.setItem('users_answers', '')
}



socket.emit('get_question',
    {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id")
    }
);  

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
socket.on('question', (data) => {
    const bigImg = document.querySelector(".bigimg");
    if (bigImg) {
        bigImg.remove();
    }
    
    if (data.question != "Кінець"){
        const divQuestion = document.querySelector(".question")
        divQuestion.style.marginBottom = "0vh";

        let bonusInput = document.getElementById("bonus");
        bonusInput.style.width = `${data.value_bonus}%`;

        document.querySelector(".modal").style.display = "none";
        document.querySelector(".right-answer").classList.remove("fade-in-anim");
        document.querySelector(".uncorrect-answer").classList.remove("fade-in-anim");
        document.querySelector(".sad_robot").classList.remove("fade-in-anim-robot");
        document.querySelector(".happy_robot").classList.remove("fade-in-anim-robot");
        document.querySelector(".coin-anim").classList.remove("fade-in-coin")


        const ansCont = document.querySelector(".answers")

        ansCont.innerHTML = ""

        ansCont.removeAttribute("style");
        
        if (data.check_reload){
            console.log((data.check_reload.split("/")))
            if (data.check_reload.startsWith("da/")) {
                const bonus = parseInt(data.check_reload.split("/")[1]);
                countMoney(bonus);
            }
        }

        const imgContainer = document.getElementById("image-container");
        imgContainer.innerHTML = "";

        let typeQuestion = data.type
        let answers = data.answers
        let amountAnswers = data.answers.length
        
        let dataCookie = localStorage.getItem("time_question");

        let correctIndexes = data.correct_answers

        const cont = document.querySelector(".answers");
        if (dataCookie == "set"){
            timeQuestion = data.test_time;
            if (timeQuestion != "not"){
                if (timeQuestion < 61){
                    timer.textContent = `${Math.trunc(timeQuestion)}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
                }else{
                    const minutes = Math.floor(timeQuestion / 60);
                    let remainingSeconds = timeQuestion % 60;

                    if (remainingSeconds < 10) {
                        remainingSeconds = '0' + remainingSeconds;
                    }

                    timer.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
                }
            }else{
                timer.textContent = "-"
            }
            localStorage.setItem('time_question', timeQuestion);
            const maxTime = parseInt(data.test_time);
            localStorage.setItem('max_time', maxTime);
        } 

        // checkOportunity - чтобы пользоватль не смог несколько раз ответь на один и тот же вопрос, если будет быстро кликать
        if (data.question_img != "not" && checkOportunity != "not"  && amountAnswers > 4){
            let justAnswerDiv = document.querySelector(".answers")
            let answerImg = document.querySelector(".answers-image")

            justAnswerDiv.style.display = "none"
            answerImg.style.display = "flex"

            const simpleQuestion = document.querySelector(".question");

            simpleQuestion.innerHTML = `
            `;
            const imgQuestion = document.querySelector(".question-image");

            imgQuestion.innerHTML = `
                <div class="num-question">
                    <p class="num-que">${data.index}/${data.amount_question}</p>
                </div>
                <div class= "question-bg">
                    <p class="question-test"></p>
                </div>
            `;

            let question = document.querySelector(".question-test")
        
            question.textContent = data.question
            document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`

            document.querySelector(".answers-image").style.display = `flex`;
            document.querySelector(".question").style.height = `30vh`;
            if (typeQuestion == "one-answer"){
                const blockAnswersTop = document.querySelector(".top-answers")

                blockAnswersTop.innerHTML = `
                    <div class="coint coint-top fade-in" data-value="2">
                        <p class="variant-text"></p>
                    </div>
                    <div class="coint coint-top fade-in-right" data-value="3">
                        <p class="variant-text"></p>
                    </div>
                `;

                const blockAnswersBottom = document.querySelector(".bottom-answers")

                blockAnswersBottom.innerHTML = `
                    <div class="coint coint-buttom fade-in" data-value="0">

                    </div>
                    <div class="bottom-image">

                    </div>
                    <div class="coint coint-buttom fade-in-right" data-value="1">
                        
                    </div>
                `;
                let imgBig = document.querySelector(".bottom-image")
                let bigImg = document.createElement("div")
                imgBig.addEventListener(
                    'click',
                    () => {
                        bigImg.style.opacity = "0";
                        bigImg.style.transition = "opacity 0.3s ease";
                        setTimeout(() => {
                            bigImg.style.opacity = "1";
                        }, 10);

                        bigImg.className = "bigimg"
                        bigImg.innerHTML = `
                            <img src="${data.question_img}"></img>
                        `
                        document.body.appendChild(bigImg);
                        bigImg.addEventListener("click", () => {
                            bigImg.remove();
                        });
                    }
                )

                setTimeout(() => {
                    let divs = document.querySelectorAll(".coint")

                    for (let div of divs){
                        div.classList.add("show")
                    }
                }, 100)

                let questionImage = document.querySelector(".question-image")
                questionImage.classList.add("fade-up")

                questionImage.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">${data.index}/${data.amount_question}</p>
                    </div>
                    <div class= "question-bg">
                        <p class="question-test">${data.question}</p>
                    </div>
                `;

                setTimeout(() => {
                    questionImage.classList.add("show-question")
                }, 100)

                let question = document.querySelector(".question-test")
        
                let buttomBlocks = document.querySelectorAll(".coint-buttom")
                let topBlocks = document.querySelectorAll(".coint-top")
                
                if (amountAnswers < 3){
                    for (let index = 0; index < 2; index++) {
                        buttomBlocks[index].style.display = 'flex';
                    }
                    for (let index = 0; index < 2; index++) {
                        if (buttomBlocks[index].style.display == "flex"){
                            buttomBlocks[index].textContent = answers[index]
                        }
                    }
                }else{
                    for (let index = 0; index < 2; index++) {
                        buttomBlocks[index].style.display = 'flex';
                    }
                    let countTop = parseInt(amountAnswers) - 2
                    for (let index = 0; index < countTop; index++) {
                        topBlocks[index].style.display = 'flex';
                    }

                    // показать сам вопрос
                    for (let index = 0; index < 2; index++) {
                        if (buttomBlocks[index].style.display == "flex"){
                            buttomBlocks[index].textContent = answers[index]
                        }
                    }

                    for (let index = 2; index < countTop + 2; index++) {
                        if (topBlocks[index - 2].style.display == "flex"){
                            topBlocks[index - 2].textContent = answers[index]
                        }
                    }
                }


                const blockanswers = document.querySelectorAll(".coint")

                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                `;

                // Подавання наступного питання, та збереження індексу питання
                for (let block of blockanswers){
                    block.addEventListener(
                        'click',
                        () => {
                            if (checkOportunity == "not"){
                                return;
                            }
                            checkOportunity = "not";
                            // сбрасываем время если пользователь нажал на какой то ответ
                            localStorage.setItem('time_question', 'set');

                            let chekcookies = localStorage.getItem("users_answers")

                            if (chekcookies != ''){
                                // отримуємо старі відповіді якщо вони були
                                let oldCookie = localStorage.getItem("users_answers")
                                let cookieList = oldCookie.split(",")   
                                cookieList.push(block.dataset.value)
                                localStorage.setItem("users_answers", cookieList)
                            }else{
                                localStorage.setItem("users_answers", block.dataset.value)
                            }
                            let index = localStorage.getItem("index_question")
                            index = parseInt(index) + 1;
                            localStorage.setItem("index_question", index)
                            // circle.style.background = `conic-gradient(#8ABBF7 0deg, #8ABBF7 360deg)`;

                            block.style.border = "4px solid white"; // біла обводка
                            block.style.transition = "all 0.3s ease"; // плавний перехід
                            
                            setTimeout(() => {
                                document.querySelector(".modal").style.display = "block";
                                if (correctIndexes.includes(parseInt(block.dataset.value))) {
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "10";

                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();
                                    let checkprocent = addBonus(10);

                                    let bonus = bonusInput.style.width 
                                    let clearValue = parseInt(bonus.replace("%"))
                                    bonusInput.style.width = `${clearValue + 10}%`;

                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                    }
                                    
                                }else {
                                    valueBonus = "0";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim");
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")

                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();
                                };
                            }, timeout = 699);

                            setTimeout(() => {
                                let midletime = localStorage.getItem("wasted_time")
                                midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                localStorage.setItem("wasted_time", midletime);
                                
                                localStorage.setItem("timeData", "0")
                                

                                socket.emit('next_question', {
                                    index: index,
                                    answer: block.dataset.value,
                                    test_id: localStorage.getItem("test_id"),
                                    value_bonus: valueBonus
                                });
                                checkOportunity = "able";
                                circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                            }, timeout = 2000);
                        }
                    )
                }

                let countVisible = 0
                const blockList = document.querySelectorAll(".coint")

                for (let block of blockList){
                    if (block.checkVisibility()){
                        countVisible += 1;
                    }
                }

                let width = 100 / countVisible
                let colors = ["#ECEAA1", "#8AF7D4", "#94C4FF", "#C48AF7"]

                blockanswers[0].style.backgroundColor = colors[0]
                blockanswers[1].style.backgroundColor = colors[1]
                blockanswers[2].style.backgroundColor = colors[2]
                blockanswers[3].style.backgroundColor = colors[3]

            }else if(typeQuestion == "many-answers"){
                const checkMarkUrl = "/static/images/check-mark.png";
                const blockAnswersTop = document.querySelector(".top-answers")

                blockAnswersTop.innerHTML = `
                    <div class="coint coint-top fade-in" data-value="2">
                        <div class="check-input" data-value="2">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[2]}</p>
                    </div>
                    <div class="coint coint-top fade-in-right" data-value="3">
                        <div class="check-input" data-value="3">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[3]}</p>
                    </div>
                `;

                const blockAnswersBottom = document.querySelector(".bottom-answers")

                blockAnswersBottom.innerHTML = `
                    <div class="coint coint-buttom fade-in" data-value="0">
                        <div class="check-input" data-value="0">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[0]}</p>
                    </div>
                    <div class="bottom-image">

                    </div>
                    <div class="coint coint-buttom fade-in-right" data-value="1">
                        <div class="check-input" data-value="1">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[1]}</p>
                    </div>
                `;
                let imgBig = document.querySelector(".bottom-image")
                let bigImg = document.createElement("div")
                imgBig.addEventListener(
                    'click',
                    () => {
                        bigImg.style.opacity = "0";
                        bigImg.style.transition = "opacity 0.3s ease";
                        setTimeout(() => {
                            bigImg.style.opacity = "1";
                        }, 10);

                        bigImg.className = "bigimg"
                        bigImg.innerHTML = `
                            <img src="${data.question_img}"></img>
                        `
                        document.body.appendChild(bigImg);
                        bigImg.addEventListener("click", () => {
                            bigImg.remove();
                        });
                    }
                )

                setTimeout(() => {
                    let divs = document.querySelectorAll(".coint")

                    for (let div of divs){
                        div.classList.add("show")
                    }
                }, 100)

                let questionImage = document.querySelector(".question-image")

                questionImage.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">${data.index}/${data.amount_question}</p>
                    </div>
                    <div class= "question-bg">
                        <p class="question-test">${data.question}</p>
                    </div>
                `;

                let question = document.querySelector(".question-test")
        
                console.log(question.textContent, "kj")

                let buttomBlocks = document.querySelectorAll(".coint-buttom")
                let textblock = document.querySelectorAll(".variant-text")
                let topBlocks = document.querySelectorAll(".coint-top")
                
                if (amountAnswers < 3){
                    for (let index = 0; index < 2; index++) {
                        buttomBlocks[index].style.display = 'flex';
                    }
                }else{
                    for (let index = 0; index < 2; index++) {
                        buttomBlocks[index].style.display = 'flex';
                    }
                    let countTop = parseInt(amountAnswers) - 2
                    for (let index = 0; index < countTop; index++) {
                        topBlocks[index].style.display = 'flex';
                    }
                }


                manyBlock = document.querySelectorAll(".many-variant")

                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                    <button type="button" class="confirm-button">надіслати відповідь</button>
                `;

                let manyVariantsBlock = document.querySelectorAll(".coint");

                for (let manyblock of manyVariantsBlock){
                    manyblock.addEventListener('click', () => {
                        if (checkOportunity == "not"){
                            return;
                        }
                        const value = manyblock.dataset.value;
                        const checkMark = manyblock.querySelector('.check-mark');

                        let index = manyVariants.indexOf(value);
                        if (index === -1) {
                            manyVariants.push(value);
                            manyblock.style.borderWidth = '3px';
                            checkMark.style.display = 'flex';
                        } else {
                            manyVariants.splice(index, 1);
                            manyblock.style.borderWidth = '0px';
                            checkMark.style.display = 'none';
                        }

                        console.log(manyVariants, "manyVariants");
                        const listString = JSON.stringify(manyVariants);
                        localStorage.setItem("manyvariants", listString);

                        const confirmButton = document.querySelector(".confirm-button");
                        if (manyVariants.length > 0){
                            confirmButton.style.background = `#C39FE4`;
                        } else {
                            confirmButton.style.background = `#9688a3`;
                        }


                    });
                }

                let countVisible = 0
                const blockList = document.querySelectorAll(".coint")

                for (let block of blockList){
                    if (block.checkVisibility()){
                        countVisible += 1;
                    }
                }

                let width = 100 / countVisible
                let colors = ["#ECEAA1", "#8AF7D4", "#94C4FF", "#C48AF7"]

                for (let index = 0; index < amountAnswers + 1; index++) {
                    if (blockList[index]){
                        blockList[index].style.backgroundColor = colors[index]
                    }
                }

                let confirm_button = document.querySelector(".confirm-button")

                confirm_button.addEventListener(
                    'click',
                    () => {
                        if (manyVariants.length > 0){
                            checkOportunity = "not";
                            
                            localStorage.setItem('time_question', "set")
                            let chekcookies = localStorage.getItem("users_answers")

                            let dataString = manyVariants.join("@");
                            console.log(dataString)

                            if (chekcookies != ''){
                                // отримуємо старі відповіді якщо вони були
                                let oldCookie = localStorage.getItem("users_answers")
                                let cookieList = oldCookie.split(",")   
                                cookieList.push(dataString)

                                localStorage.setItem("users_answers", cookieList)
                            }else{
                                localStorage.setItem("users_answers", dataString)
                            }

                            let index = localStorage.getItem("index_question")
                            index = parseInt(index) + 1;
                            localStorage.setItem("index_question", index)

                            let currentCorrect = 0;
                            let currentUncorrect = 0;

                            let checkMarks = document.querySelectorAll(".check-input");

                            for (let checkMark of checkMarks){
                                if (manyVariants.includes(checkMark.dataset.value)){
                                    if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                        checkMark.style.backgroundColor = '#8AF7D4';
                                        currentCorrect += 1;
                                    }else{
                                        checkMark.style.backgroundColor = '#E05359';
                                        currentUncorrect += 1;
                                    }
                                }
                            }


                            // Clear selected variants for next question
                            manyVariants.length = 0;
                            const totalCorrect = correctIndexes.length;

                            if (currentCorrect > totalCorrect / 2 && currentUncorrect === 0){
                                setTimeout(() => {
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "10";
                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();
                                    let checkprocent = addBonus(10);

                                    let bonus = bonusInput.style.width 
                                    let clearValue = parseInt(bonus.replace("%"))
                                    bonusInput.style.width = `${clearValue + 10}%`;

                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                    }

                                    console.log(checkprocent, "checkprocent")

                                    for (let checkMark of checkMarks){
                                        if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                            checkMark.style.backgroundColor = '#8AF7D4';
                                        }
                                    }
                                }, timeout = 699);
                            }else{
                                setTimeout(() => {
                                    valueBonus = "0";
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim")
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")

                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();


                                    for (let checkMark of checkMarks){
                                        if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                            checkMark.style.backgroundColor = '#8AF7D4';
                                        }
                                    }
                                }, timeout = 699);
                            }

                            setTimeout(() => {
                                let midletime = localStorage.getItem("wasted_time")
                                midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                localStorage.setItem("wasted_time", midletime);
                                
                                localStorage.setItem("timeData", "0")

                                socket.emit('next_question', {
                                    index: index,
                                    answer: dataString,
                                    test_id: localStorage.getItem("test_id"),
                                    value_bonus: valueBonus
                                });
                                checkOportunity = "able";
                                circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                            }, timeout = 2000);
                        }
                    }
                )
            }


            document.querySelector(".question").style.height = `20%`;
            document.querySelector(".answers-image").style.display = `flex`;
            const img = document.createElement("img");

            img.src = `${data.question_img}`;
            img.alt = data.question_img;

            document.querySelector(".bottom-image").appendChild(img);

        }else if (checkOportunity != "not"){
            let justAnswerDiv = document.querySelector(".answers")
            let answerImg = document.querySelector(".answers-image")

            justAnswerDiv.style.display = "flex"
            answerImg.style.display = "none"

            const simpleQuestion = document.querySelector(".question");

            if (data.question_img == "not"){
                simpleQuestion.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">${data.index}/${data.amount_question}</p>
                    </div>
                    <div class= "question-bg">
                        <p class="question-test"></p>
                    </div>
                `;
            }else{
                simpleQuestion.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">${data.index}/${data.amount_question}</p>
                    </div>
                    <div class= "question-bg">
                        <p class="question-test"></p>
                    </div>
                    <div class="simple-image">
                        <img src="${data.question_img}"></img>
                    </div>
                `;

                let imgBig = document.querySelector(".simple-image")
                let bigImg = document.createElement("div")
                imgBig.addEventListener(
                    'click',
                    () => {
                        bigImg.style.opacity = "0";
                        bigImg.style.transition = "opacity 0.3s ease";
                        setTimeout(() => {
                            bigImg.style.opacity = "1";
                        }, 10);
                        
                        bigImg.className = "bigimg"
                        bigImg.innerHTML = `
                            <img src="${data.question_img}"></img>
                        `
                        document.body.appendChild(bigImg);
                        bigImg.addEventListener("click", () => {
                            bigImg.remove();
                        });
                    }
                )
            }
            
            

            if (simpleQuestion.classList.contains("fade-up")){
                simpleQuestion.classList.remove("fade-up")
                simpleQuestion.classList.remove("show-question")
            }
            
            simpleQuestion.classList.add("fade-up")

            setTimeout(() => {
                simpleQuestion.classList.add("show-question")
            }, 100)

            const imgQuestion = document.querySelector(".question-image");

            let question = document.querySelector(".question-test")
        
            question.textContent = data.question

            document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`

            imgQuestion.innerHTML = ``;

            document.querySelector(".answers-image").style.display = `none`;
            document.querySelector(".question").style.height = `30vh`;

            if (typeQuestion == "one-answer"){
                let list_images = data.answers_image


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

                

                if (data.question_img != "not"){
                
                }

                setTimeout(() => {
                    let divs = document.querySelectorAll(".variant")

                    for (let div of divs){
                        div.classList.add("show")
                    }
                }, 100)

                let blockanswers = document.querySelectorAll(".variant")

                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                `;

                // Подавання наступного питання, та збереження індексу питання
                for (let block of blockanswers){
                    block.addEventListener(
                        'click',
                        () => {
                            if (checkOportunity == "not"){
                                return;
                            }
                            checkOportunity = "not";
                            // сбрасываем время если пользователь нажал на какой то ответ
                            localStorage.setItem('time_question', 'set');

                            let chekcookies = localStorage.getItem("users_answers")

                            if (chekcookies != ''){
                                // отримуємо старі відповіді якщо вони були
                                let oldCookie = localStorage.getItem("users_answers")
                                let cookieList = oldCookie.split(",")   
                                cookieList.push(block.dataset.value)
                                localStorage.setItem("users_answers", cookieList)
                            }else{
                                localStorage.setItem("users_answers", block.dataset.value)
                            }
                            let index = localStorage.getItem("index_question")
                            
                            localStorage.setItem("index_question", index)
                            // circle.style.background = `conic-gradient(#8ABBF7 0deg, #8ABBF7 360deg)`;


                            block.style.border = "4px solid white"; // біла обводка
                            block.style.transition = "all 0.3s ease"; // плавний перехід
                            
                            setTimeout(() => {
                                document.querySelector(".modal").style.display = "block";
                                if (correctIndexes.includes(parseInt(block.dataset.value))) {
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "10";
                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();
                                    let checkprocent = addBonus(10);

                                    let bonus = bonusInput.style.width 
                                    let clearValue = parseInt(bonus.replace("%"))
                                    bonusInput.style.width = `${clearValue + 10}%`;

                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                    }

                                }else {
                                    valueBonus = "0";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim")
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")

                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();

                                }
                            }, timeout = 699);

                            index = parseInt(index) + 1;
                            localStorage.setItem("index_question", index)

                            setTimeout(() => {
                                let midletime = localStorage.getItem("wasted_time")

                                midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                localStorage.setItem("wasted_time", midletime);
                                
                                localStorage.setItem("timeData", "0")

                                socket.emit('next_question', {
                                    index: index,
                                    answer: block.dataset.value,
                                    test_id: localStorage.getItem("test_id"),
                                    value_bonus: valueBonus
                                });
                                checkOportunity = "able";
                                circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                            }, timeout = 2000);
                        }
                    )
                }


                for (let index = 0; index < amountAnswers; index++) {
                    blockanswers[index].style.display = 'flex'
                    if (list_images[index] != "none"){
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "variant-image-container";

                        const imgElem = document.createElement("img")
                        imgContainer.appendChild(imgElem);
                        imgElem.src = list_images[index]

                        blockanswers[index].appendChild(imgContainer);
                        blockanswers[index].querySelector(".variant-text").style.fontSize = "2.5vh"
                        
                    }
                }

                for (let index = 0; index < amountAnswers; index++) {
                    if (blockanswers[index].style.display == "flex"){
                        blockanswers[index].querySelector(".variant-text").textContent = answers[index]
                    }
                }

                let countVisible = 0
                const blockList = document.querySelectorAll(".variant")

                for (let block of blockList){
                    if (block.checkVisibility()){
                        countVisible += 1;
                    }
                }

                let width = 100 / countVisible
                let colors = ["#ECEAA1", "#8AF7D4", "#94C4FF", "#C48AF7"]

                for (let index = 0; index < amountAnswers; index++) {
                    blockanswers[index].style.width = `${width}%`;
                    blockanswers[index].style.backgroundColor = colors[index]
                }
            }else if (typeQuestion == "many-answers"){
                const checkMarkUrl = "/static/images/check-mark.png";
                let list_images = data.answers_image

                cont.innerHTML = `
                    <div class="many-variant fade-in" data-value="0" value="0">
                        <div class="check-input" data-value="0">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in" data-value="1" value="1">
                        <div class="check-input" data-value="1">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in" data-value="2" value="2">
                        <div class="check-input" data-value="2">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">sdc</p>
                    </div>
                    <div class="many-variant fade-in" data-value="3" value="3">
                        <div class="check-input" data-value="3">
                            <img src="${checkMarkUrl}" class="check-mark" alt="j">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                `;

                

                setTimeout(() => {
                    let divs = document.querySelectorAll(".many-variant")

                    for (let div of divs){
                        div.classList.add("show")
                    }
                }, 100)
                
                manyBlock = document.querySelectorAll(".many-variant")

                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                    <button type="button" class="confirm-button">надіслати відповідь</button>
                `;

                let manyVariantsBlock = document.querySelectorAll(".many-variant");
                let checkMarks = document.querySelectorAll(".check-mark")

                for (let manyblock of manyVariantsBlock){
                    manyblock.addEventListener('click', () => {
                        if (checkOportunity == "not"){
                            return;
                        }
                        const value = manyblock.dataset.value;
                        const checkMark = manyblock.querySelector('.check-mark');

                        let index = manyVariants.indexOf(value);
                        if (index === -1) {
                            manyVariants.push(value);
                            manyblock.style.borderWidth = '3px';
                            checkMark.style.display = 'flex';
                        } else {
                            manyVariants.splice(index, 1);
                            manyblock.style.borderWidth = '0px';
                            checkMark.style.display = 'none';
                        }

                        console.log(manyVariants, "manyVariants");
                        const listString = JSON.stringify(manyVariants);
                        localStorage.setItem("manyvariants", listString);

                        const confirmButton = document.querySelector(".confirm-button");
                        if (manyVariants.length > 0){
                            confirmButton.style.background = `#C39FE4`;
                        } else {
                            confirmButton.style.background = `#9688a3`;
                        }
                    });
                }


                let confirm_button = document.querySelector(".confirm-button")

                confirm_button.addEventListener(
                    'click',
                    (e) => {
                        checkOportunity = "not";

                        e.preventDefault(); 
                        if (manyVariants.length > 0){
                            localStorage.setItem('time_question', "set")
                            let chekcookies = localStorage.getItem("users_answers")

                            let dataString = manyVariants.join("@");
                            console.log(dataString)

                            if (chekcookies != ''){
                                // отримуємо старі відповіді якщо вони були
                                let oldCookie = localStorage.getItem("users_answers")
                                let cookieList = oldCookie.split(",")   
                                cookieList.push(dataString)

                                localStorage.setItem("users_answers", cookieList)
                            }else{
                                localStorage.setItem("users_answers", dataString)
                            }

                            let index = localStorage.getItem("index_question")
                            index = parseInt(index) + 1;
                            localStorage.setItem("index_question", index)

                            let currentCorrect = 0;
                            let currentUncorrect = 0;

                            let checkMarks = document.querySelectorAll(".check-input");

                            for (let checkMark of checkMarks){
                                if (manyVariants.includes(checkMark.dataset.value)){
                                    if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                        checkMark.style.backgroundColor = '#8AF7D4';
                                        currentCorrect += 1;
                                    }else{
                                        checkMark.style.backgroundColor = '#E05359';
                                        currentUncorrect += 1;
                                    }
                                }
                            }

                            manyVariants.length = 0;
                            const totalCorrect = correctIndexes.length; 

                            if (currentCorrect > totalCorrect / 2 && currentUncorrect === 0){
                                setTimeout(() => {
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".right-answer").classList.add("fade-in-anim");
                                    document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                    valueBonus = "10";
                                    const audio = document.querySelector("#correct-sound");
                                    if (audio) audio.play();

                                    let bonus = bonusInput.style.width 
                                    let clearValue = parseInt(bonus.replace("%"))
                                    bonusInput.style.width = `${clearValue + 10}%`;

                                    if (clearValue + 10 >= 100){
                                        document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                    }
                                    
                                    let checkprocent = addBonus(10);
                                    console.log(checkprocent, "checkprocent")


                                    for (let checkMark of checkMarks){
                                        if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                            checkMark.style.backgroundColor = '#8AF7D4';
                                        }
                                    }
                                }, timeout = 699);
                            }else{
                                setTimeout(() => {
                                    document.querySelector(".modal").style.display = "block";
                                    document.querySelector(".uncorrect-answer").classList.add("fade-in-anim")
                                    document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")
                                    valueBonus = "0";

                                    const audioNegative = document.querySelector("#incorrect-sound");
                                    if (audioNegative) audioNegative.play();
                                    for (let checkMark of checkMarks){
                                        if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                            checkMark.style.backgroundColor = '#8AF7D4';
                                        }
                                    }
                                }, timeout = 699);
                            }

                            setTimeout(() => {
                                let midletime = localStorage.getItem("wasted_time")
                                midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                localStorage.setItem("wasted_time", midletime);
                                
                                localStorage.setItem("timeData", "0")
                                socket.emit('next_question', {
                                    index: index,
                                    answer: dataString,
                                    test_id: localStorage.getItem("test_id"),
                                    value_bonus:valueBonus
                                });
                                checkOportunity = "able";
                                circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                            }, timeout = 2000);
                        }
                    }
                )

                let manyBlockAnswers = document.querySelectorAll(".many-variant")
                let variantText = document.querySelectorAll(".variant-text")

                for (let index = 0; index < amountAnswers; index++) {
                    manyBlockAnswers[index].style.display = 'flex';
                    if (list_images[index] != "none"){
                        const imgContainer = document.createElement("div");
                        imgContainer.className = "variant-image-container";

                        const imgElem = document.createElement("img")
                        imgContainer.appendChild(imgElem);
                        imgElem.src = list_images[index]
                        variantText[index].style.fontSize  = "2.5vh"

                        manyBlockAnswers[index].appendChild(imgContainer);
                         
                    }
                }

                
                
                for (let index = 0; index < amountAnswers; index++) {
                    if (manyBlockAnswers[index].style.display == "flex"){
                        variantText[index].textContent = answers[index]
                        // blockanswers[index].querySelector(".variant-text").textContent = answers[index]

                    }
                }
            }
            else if (typeQuestion == "input-gap"){
                const divQuestion = document.querySelector(".question")
                divQuestion.style.marginBottom = "5vh";

                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                    <button type="button" class="confirm-button">надіслати відповідь</button>
                `;

                if (amountAnswers == 1){
                    const divparent = document.querySelector(".answers")

                    const text = document.createElement("p")
                    text.textContent = "введіть свою відповідь у поле"
                    text.className = "input-text"
                    text.style.color = "#ffffff"
                    
                    divparent.appendChild(text)

                    const inputDiv = document.createElement("div")
                    inputDiv.className = "confirm-answer"

                    let answer = data.answers[0]
                    for (let i = 0; i < answer.length; i++) {
                        const input = document.createElement("input");
                        input.className = "small-input-answer";
                        input.style.color = "#ffffff"
                        input.maxLength = 1;
                        input.style.width = "4.4vw";
                        input.style.margin = "0 0.4vw";
                        input.autocomplete = "off";
                        input.type = "text";
                        input.inputMode = "text";
                        input.setAttribute("data-index", i);

                        // Автоматический переход к следующему инпуту
                        input.addEventListener("input", function () {
                            if (this.value.length === 1 && i < answer.length - 1) {
                                const nextInput = inputDiv.querySelector(`input[data-index="${i + 1}"]`);
                                if (nextInput) nextInput.focus();
                            }
                        });

                        input.addEventListener("keydown", function (e) {
                            if (e.key === "Backspace" && this.value === "" && i > 0) {
                                const prevInput = inputDiv.querySelector(`input[data-index="${i - 1}"]`);
                                if (prevInput) prevInput.focus();
                            }
                        });

                        inputDiv.appendChild(input);
                    }
                    divparent.appendChild(inputDiv);

                    

                    divparent.style.height = "35vh"
                    divparent.style.flexDirection = "column"
                    divparent.style.gap = "10vh"
                    divparent.style.backgroundColor = "#353535"
                    divparent.style.display = "flex";

                    let inputs = document.querySelectorAll(".small-input-answer")
                    
                    let avaible = false
                    let confirmButton = document.querySelector(".confirm-button");

                    for (let input of inputs){
                        input.addEventListener(
                            "input",
                            () => {
                                let count = 0
                                for (let input of inputs){
                                    if (input.value.trim() != ""){
                                        count++
                                    }
                                }

                                if (count == inputs.length){
                                    confirmButton.style.background = `#C39FE4`;
                                    avaible = true
                                }else{
                                    confirmButton.style.background = `#9688a3`;
                                    avaible = false
                                }
                            }
                        )
                    }

                    let confirm_button = confirmButton;

                    confirm_button.addEventListener(
                        'click',
                        (e) => {

                            e.preventDefault(); 

                            if (avaible){

                                checkOportunity = "not";

                                localStorage.setItem('time_question', "set")
                                let chekcookies = localStorage.getItem("users_answers")
                                
                                let inputs = document.querySelectorAll(".small-input-answer");
                                let dataString = "";
                                inputs.forEach(input => {
                                    dataString += input.value.trim();
                                });


                                if (chekcookies != ''){
                                    // отримуємо старі відповіді якщо вони були
                                    let oldCookie = localStorage.getItem("users_answers")
                                    let cookieList = oldCookie.split(",")   
                                    cookieList.push(dataString)

                                    localStorage.setItem("users_answers", cookieList)
                                }else{
                                    localStorage.setItem("users_answers", dataString)
                                }

                                let index = localStorage.getItem("index_question")
                                index = parseInt(index) + 1;
                                localStorage.setItem("index_question", index)

    
                                let answers = data.answers

                                if (answers.includes(dataString)){
                                    setTimeout(() => {
                                        document.querySelector(".modal").style.display = "block";
                                        document.querySelector(".right-answer").classList.add("fade-in-anim");
                                        document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                        valueBonus = "10";
                                        const audio = document.querySelector("#correct-sound");
                                        if (audio) audio.play();

                                        let bonus = bonusInput.style.width 
                                        let clearValue = parseInt(bonus.replace("%"))
                                        bonusInput.style.width = `${clearValue + 10}%`;

                                        if (clearValue + 10 >= 100){
                                            document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                        }
                                        
                                        let checkprocent = addBonus(10);
                                        console.log(checkprocent, "checkprocent")


                                        for (let checkMark of checkMarks){
                                            if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                                checkMark.style.backgroundColor = '#8AF7D4';
                                            }
                                        }
                                    }, timeout = 699);
                                }else{
                                    setTimeout(() => {
                                        document.querySelector(".modal").style.display = "block";
                                        document.querySelector(".uncorrect-answer").classList.add("fade-in-anim")
                                        document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")
                                        valueBonus = "0";

                                        let answer = data.answers[0];
                                        let inputs = document.querySelectorAll(".small-input-answer")
                                        for (let i = 0; i < inputs.length; i++) {
                                            if (inputs[i].value.trim() === answer[i]) {
                                                inputs[i].style.backgroundColor = "#8AF7D4"
                                            } else {
                                                inputs[i].style.backgroundColor = "#E05359"
                                            }
                                        }
                                        const audioNegative = document.querySelector("#incorrect-sound");
                                        if (audioNegative) audioNegative.play();
                                    }, timeout = 699);
                                }

                                setTimeout(() => {
                                    let midletime = localStorage.getItem("wasted_time")
                                    midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                    localStorage.setItem("wasted_time", midletime);
                                    
                                    localStorage.setItem("timeData", "0")
                                    socket.emit('next_question', {
                                        index: index,
                                        answer: dataString,
                                        test_id: localStorage.getItem("test_id"),
                                        value_bonus:valueBonus
                                    });
                                    checkOportunity = "able";
                                    circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                                }, timeout = 2000);
                            }
                        }
                    )

                }else{
                    // одно поле для ввода
                    const divparent = document.querySelector(".answers")

                    const text = document.createElement("p")
                    text.textContent = "введіть свою відповідь у поле"
                    text.className = "input-text"
                    text.style.color = "#ffffff"

                    const inputDiv = document.createElement("div")
                    const input = document.createElement("input")
                    input.className = "input-answer"
                    inputDiv.className = "confirm-answer"

                    inputDiv.appendChild(input)
                    
                    divparent.style.height = "35vh"
                    divparent.style.flexDirection = "column"
                    divparent.style.gap = "10vh"
                    divparent.style.backgroundColor = "#353535"

                    divparent.appendChild(text)
                    divparent.appendChild(inputDiv)

                    let avaible = false

                    document.querySelector(".input-answer").addEventListener(
                        'input',
                        () => {
                            const confirmButton = document.querySelector(".confirm-button")
                            const inputValue = document.querySelector(".input-answer").value.trim()

                            if (inputValue != ''){
                                confirmButton.style.background = `#C39FE4`;
                                avaible = true
                            } else {
                                confirmButton.style.background = `#9688a3`;
                                avaible = false
                            }
                        }
                    )

                    let confirm_button = document.querySelector(".confirm-button")

                    confirm_button.addEventListener(
                        'click',
                        (e) => {

                            e.preventDefault(); 

                            if (avaible){

                                checkOportunity = "not";

                                localStorage.setItem('time_question', "set")
                                let chekcookies = localStorage.getItem("users_answers")

                                let dataString = document.querySelector(".input-answer").value.trim();

                                if (chekcookies != ''){
                                    // отримуємо старі відповіді якщо вони були
                                    let oldCookie = localStorage.getItem("users_answers")
                                    let cookieList = oldCookie.split(",")   
                                    cookieList.push(dataString)

                                    localStorage.setItem("users_answers", cookieList)
                                }else{
                                    localStorage.setItem("users_answers", dataString)
                                }

                                let index = localStorage.getItem("index_question")
                                index = parseInt(index) + 1;
                                localStorage.setItem("index_question", index)

    
                                let answers = data.answers

                                if (answers.includes(dataString)){
                                    setTimeout(() => {
                                        document.querySelector(".modal").style.display = "block";
                                        document.querySelector(".right-answer").classList.add("fade-in-anim");
                                        document.querySelector(".happy_robot").classList.add("fade-in-anim-robot");
                                        valueBonus = "10";
                                        const audio = document.querySelector("#correct-sound");
                                        if (audio) audio.play();

                                        let bonus = bonusInput.style.width 
                                        let clearValue = parseInt(bonus.replace("%"))
                                        bonusInput.style.width = `${clearValue + 10}%`;

                                        if (clearValue + 10 >= 100){
                                            document.querySelector(".coin-anim ").classList.add("fade-in-coin")
                                        }
                                        
                                        let checkprocent = addBonus(10);
                                        console.log(checkprocent, "checkprocent")


                                        for (let checkMark of checkMarks){
                                            if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                                checkMark.style.backgroundColor = '#8AF7D4';
                                            }
                                        }
                                    }, timeout = 699);
                                }else{
                                    setTimeout(() => {
                                        document.querySelector(".modal").style.display = "block";
                                        document.querySelector(".uncorrect-answer").classList.add("fade-in-anim")
                                        document.querySelector(".sad_robot").classList.add("fade-in-anim-robot")
                                        valueBonus = "0";

                                        const audioNegative = document.querySelector("#incorrect-sound");
                                        if (audioNegative) audioNegative.play();
                                        for (let checkMark of checkMarks){
                                            if (correctIndexes.includes(parseInt(checkMark.dataset.value))) {
                                                checkMark.style.backgroundColor = '#8AF7D4';
                                            }
                                        }
                                    }, timeout = 699);
                                }

                                setTimeout(() => {
                                    let midletime = localStorage.getItem("wasted_time")
                                    midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
                                    localStorage.setItem("wasted_time", midletime);
                                    
                                    localStorage.setItem("timeData", "0")
                                    socket.emit('next_question', {
                                        index: index,
                                        answer: dataString,
                                        test_id: localStorage.getItem("test_id"),
                                        value_bonus:valueBonus
                                    });
                                    checkOportunity = "able";
                                    circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;
                                }, timeout = 2000);
                            }
                        }
                    )
                }
            }
            

            let countVisible = 0
            const blockList = document.querySelectorAll(".many-variant")
            if (blockList) {
                const visibleBlocks = Array.from(blockList).filter(block => block.checkVisibility());
                countVisible = visibleBlocks.length;

                let width = 100 / countVisible;
                let colors = ["#ECEAA1", "#8AF7D4", "#94C4FF", "#C48AF7"];

                visibleBlocks.forEach((block, index) => {
                    block.style.width = `${width}%`;
                    block.style.backgroundColor = colors[index % colors.length];
                });
            }
        }   
    }else{
        setTimeout(() => {
            window.location.replace('/finish_test');
        }, 1000);
    }
});

window.addEventListener(
    'load',
    () => {
        let checkTime = localStorage.getItem('time_question')
        if (checkTime != "not"){
            timeQuestion = parseInt(localStorage.getItem('time_question'));

            if (isNaN(timeQuestion)) {
                // Якщо немає часу або він некоректний 
                timer.textContent = "-";
                return; // або можна встановити якийсь дефолт, наприклад, 0
            }
            timeQuestion -= 1; // Зменшуємо yf 1
            updateCircle(parseInt(timeQuestion))
            if (timeQuestion < 61){
                    timer.textContent = `${Math.trunc(timeQuestion)}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
            }else{
                const minutes = Math.floor(timeQuestion / 60);
                let remainingSeconds = timeQuestion % 60;

                if (remainingSeconds < 10) {
                    remainingSeconds = '0' + remainingSeconds;
                }

                timer.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
            }


            setTimeout(() => {
                timeQuestion = parseInt(localStorage.getItem('time_question'));

                if (isNaN(timeQuestion)) {
                    // Якщо немає часу або він некоректний 
                    timer.textContent = "-";
                    return; // або можна встановити якийсь дефолт, наприклад, 0
                }
                timeQuestion -= 1; // Зменшуємо yf 1
                updateCircle(parseInt(timeQuestion))

                if (timeQuestion < 61){
                    timer.textContent = `${Math.trunc(timeQuestion)}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
                }else{
                    const minutes = Math.floor(timeQuestion / 60);
                    let remainingSeconds = timeQuestion % 60;

                    if (remainingSeconds < 10) {
                        remainingSeconds = '0' + remainingSeconds;
                    }

                    timer.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
                }
                // timer.textContent = `${Math.trunc(timeQuestion)}`;
            }, 1000);
        }else{
            timer.textContent = "-"
        }
    }
)

// SetInterval - запускает функцию через определенный промежуток времени(в милисекундах)
setInterval(() => {
    let checkTime = localStorage.getItem('time_question')
    if (checkTime != "not"){
        timeQuestion = parseInt(localStorage.getItem('time_question'));

        if (isNaN(timeQuestion)) {
            // Якщо немає часу або він некоректний 
            // timer.textContent = "-";
            return; 
        }
        let wasted_time = parseInt(localStorage.getItem("timeData"))
        wasted_time += 1;
        localStorage.setItem("timeData", wasted_time)
        timeQuestion -= 1; // Зменшуємо yf 1
        updateCircle(parseInt(timeQuestion))
        if (timeQuestion < 61){
            timer.textContent = `${Math.trunc(timeQuestion)}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
        }else{
            const minutes = Math.floor(timeQuestion / 60);
            let remainingSeconds = timeQuestion % 60;

            if (remainingSeconds < 10) {
                remainingSeconds = '0' + remainingSeconds;
            }

            timer.textContent = `${Math.trunc(minutes)}:${remainingSeconds}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
        }
        localStorage.setItem('time_question', timeQuestion)
        if (timeQuestion <= 0){
            localStorage.setItem('time_question', "set")
            let chekcookies = localStorage.getItem("users_answers")
            if (chekcookies){
                // отримуємо старі відповіді якщо вони були
                let oldCookie = localStorage.getItem("users_answers")
                let cookieList = oldCookie.split(",")   
                cookieList.push("∅")

                localStorage.setItem("users_answers", cookieList)
            }else{
                localStorage.setItem("users_answers", "∅")
            }

            let index = localStorage.getItem("index_question")
            index = parseInt(index) + 1;
            localStorage.setItem("index_question", index)

            console.log("Питання відправлено на сервер, чекаємо відповіді");
            circle.style.background = `conic-gradient(#677689 ${0}deg, #8ABBF7 ${0}deg)`;

            let midletime = localStorage.getItem("wasted_time")
            midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
            localStorage.setItem("wasted_time", midletime);

            localStorage.setItem("timeData", "0")
            socket.emit('next_question', {
                index: index,
                test_id: localStorage.getItem("test_id")
            })
            // console.log("Питання відправлено на сервер, чекаємо відповіді");
        }
    }else{
        timer.textContent = "-"
    }
}, 1000);



let leaveButton = document.querySelector(".leave_test")

leaveButton.addEventListener(
    'click',
    () => {
        localStorage.setItem('time_question', "0")

        localStorage.setItem("timeData", "0")
        

        // щоб гарантувати завершення – передай індекс явно великий
        socket.emit('next_question', {
            index: 9999,
            test_id: localStorage.getItem("test_id")
        })
    }
)

if (localStorage.getItem("reload") == "yes"){
    localStorage.setItem("reload", "no")
    console.log(18)
    // location.reload()
}

let progress = 0; 
 // максимальний час в секундах

function updateCircle(timeLeft) {
    let maxTime = parseInt(localStorage.getItem('max_time'))
    console.log(maxTime)
    let progress = 360 * (maxTime - timeLeft) / maxTime;
    if (progress > 360) progress = 360;
    if (progress < 0) progress = 0;

    circle.style.background = `conic-gradient(#677689 ${progress}deg, #8ABBF7 ${progress}deg)`;
}