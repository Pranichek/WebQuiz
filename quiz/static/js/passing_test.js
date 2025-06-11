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


socket.on('question', (data) => {
    if (data.question != "Кінець"){
        const imgContainer = document.getElementById("image-container");
        imgContainer.innerHTML = "";

        let answers = data.answers
        let amountAnswers = data.answers.length
        
        let dataCookie = localStorage.getItem("time_question");

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
            console.log("2112")
        } 


        if (data.question_img != "not"){
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
                    <p class="num-que">1/10</p>
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
            if (data.type_question == "one_answer"){
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
                        <p class="num-que">1/10</p>
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
                            circle.style.background = `conic-gradient(#8ABBF7 0deg, #8ABBF7 360deg)`;

                            
                            socket.emit('next_question', {
                                index: index,
                                answer: block.dataset.value,
                                test_id: localStorage.getItem("test_id")
                            })
                            console.log("Питання відправлено на сервер, чекаємо відповіді");
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

            }else {
                const checkMarkUrl = "/static/images/check-mark.png";
                const blockAnswersTop = document.querySelector(".top-answers")

                blockAnswersTop.innerHTML = `
                    <div class="coint coint-top fade-in" data-value="2">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[2]}</p>
                    </div>
                    <div class="coint coint-top fade-in-right" data-value="3">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[3]}</p>
                    </div>
                `;

                const blockAnswersBottom = document.querySelector(".bottom-answers")

                blockAnswersBottom.innerHTML = `
                    <div class="coint coint-buttom fade-in" data-value="0">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[0]}</p>
                    </div>
                    <div class="bottom-image">

                    </div>
                    <div class="coint coint-buttom fade-in-right" data-value="1">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">${answers[1]}</p>
                    </div>
                `;

                setTimeout(() => {
                    let divs = document.querySelectorAll(".coint")

                    for (let div of divs){
                        div.classList.add("show")
                    }
                }, 100)

                let questionImage = document.querySelector(".question-image")

                questionImage.innerHTML = `
                    <div class="num-question">
                        <p class="num-que">1/10</p>
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
                            
                            socket.emit('next_question', {
                                index: index,
                                answer: dataString,
                                test_id: localStorage.getItem("test_id")
                            })
                            console.log("Питання відправлено на сервер, чекаємо відповіді");
                        }
                    }
                )
            }


            document.querySelector(".question").style.height = `20%`;
            document.querySelector(".answers-image").style.display = `flex`;
            const img = document.createElement("img");
            console.log(data.question_img)
            // img.src = `${data.question_img}`; 
            img.src = `${data.question_img}`;
            img.alt = data.question_img;
            img.width = 100;  
            img.height = 121;
            document.querySelector(".bottom-image").appendChild(img);

        }else{
            let justAnswerDiv = document.querySelector(".answers")
            let answerImg = document.querySelector(".answers-image")

            justAnswerDiv.style.display = "flex"
            answerImg.style.display = "none"

            const simpleQuestion = document.querySelector(".question");

            simpleQuestion.innerHTML = `
                <div class="num-question">
                    <p class="num-que">1/10</p>
                </div>
                <div class= "question-bg">
                    <p class="question-test"></p>
                </div>
            `;

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

            if (data.type_question == "one_answer"){
                cont.innerHTML = `
                    <div class="variant fade-in" data-value="0">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in" data-value="1">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in-right" data-value="2">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant fade-in-right" data-value="3">
                        <p class="variant-text"></p>
                    </div>
                `;

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
                            circle.style.background = `conic-gradient(#8ABBF7 0deg, #8ABBF7 360deg)`;

                            
                            socket.emit('next_question', {
                                index: index,
                                answer: block.dataset.value,
                                test_id: localStorage.getItem("test_id")
                            })
                            console.log("Питання відправлено на сервер, чекаємо відповіді");
                        }
                    )
                }


                for (let index = 0; index < amountAnswers; index++) {
                    blockanswers[index].style.display = 'flex';
                }
        
                for (let index = 0; index < amountAnswers; index++) {
                    if (blockanswers[index].style.display == "flex"){
                        blockanswers[index].textContent = answers[index]
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
            }else if (data.type_question == "many_answers"){
                const checkMarkUrl = "/static/images/check-mark.png";

                cont.innerHTML = `
                    <div class="many-variant fade-in" data-value="0">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in" data-value="1">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant fade-in-right" data-value="2">
                        <div class="check-input">
                            <img src="${checkMarkUrl}" class="check-mark" alt="">
                        </div>
                        <p class="variant-text">sdc</p>
                    </div>
                    <div class="many-variant fade-in-right" data-value="3">
                        <div class="check-input">
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
                        e.preventDefault(); // Prevent default button behavior
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
                            
                            // Clear selected variants for next question
                            manyVariants.length = 0;

                            socket.emit('next_question', {
                                index: index,
                                answer: dataString,
                                test_id: localStorage.getItem("test_id")
                            })
                            console.log("Питання відправлено на сервер, чекаємо відповіді");
                        }
                    }
                )

                let manyBlockAnswers = document.querySelectorAll(".many-variant")

                for (let index = 0; index < amountAnswers; index++) {
                    manyBlockAnswers[index].style.display = 'flex';
                }
                
                let variantText = document.querySelectorAll(".variant-text")
                for (let index = 0; index < amountAnswers; index++) {
                    if (manyBlockAnswers[index].style.display == "flex"){
                        variantText[index].textContent = answers[index]
                    }
                }
            }
            

            let countVisible = 0
            const blockList = document.querySelectorAll(".many-variant")

            for (let block of blockList){
                if (block.checkVisibility()){
                    countVisible += 1;
                }
            }

            let width = 100 / countVisible
            let colors = ["#ECEAA1", "#8AF7D4", "#94C4FF", "#C48AF7"]

            for (let index = 0; index < amountAnswers; index++) {
                blockList[index].style.width = `${width}%`;
                blockList[index].style.backgroundColor = colors[index]
            }

        }   
    }else{
        window.location.replace('/finish_test');
        // localStorage.removeItem('time_question')
        // document.querySelector("#end-test").submit();
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
        localStorage.setItem('time_question', timeQuestion)
        if (timeQuestion <= 0){
            localStorage.setItem('time_question', "set")
            let chekcookies = localStorage.getItem("users_answers")
            if (chekcookies){
                // отримуємо старі відповіді якщо вони були
                let oldCookie = localStorage.getItem("users_answers")
                let cookieList = oldCookie.split(",")   
                cookieList.push("skip")

                localStorage.setItem("users_answers", cookieList)
            }else{
                localStorage.setItem("users_answers", "skip")
            }

            let index = localStorage.getItem("index_question")
            index = parseInt(index) + 1;
            localStorage.setItem("index_question", index)

            console.log("Питання відправлено на сервер, чекаємо відповіді");
            circle.style.background = `conic-gradient(#8ABBF7 0deg, #8ABBF7 360deg)`;


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

        // щоб гарантувати завершення – передай індекс явно великий
        socket.emit('next_question', {
            index: 100,
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