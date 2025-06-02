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


if (localStorage.getItem("index_question") == "0"){
    // localStorage.setItem('time_question', 'set');
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

        let question = document.querySelector(".question-test")
        
        question.textContent = data.question

        let answers = data.answers
        let amountAnswers = data.answers.length
        document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`
        
        let dataCookie = localStorage.getItem("time_question");

        const cont = document.querySelector(".answers");
        if (dataCookie == "set"){
            timeQuestion = data.test_time;
            timer.textContent = `${timeQuestion}`;
            localStorage.setItem('time_question', timeQuestion);
            const maxTime = parseInt(data.test_time);
            localStorage.setItem('max_time', maxTime);
            console.log("2112")
        } 


        if (data.question_img != "not"){
            document.querySelector(".answers-image").style.display = `flex`;
            document.querySelector(".question").style.height = `30vh`;
            if (data.type_question == "one_answer"){
                console.log("zahodit suchka")
                const blockAnswersTop = document.querySelector(".top-answers")

                blockAnswersTop.innerHTML = `
                    <div class="coint coint-top" data-value="2">
                        <p class="variant-text"></p>
                    </div>
                    <div class="coint coint-top" data-value="3">
                        <p class="variant-text"></p>
                    </div>
                `;

                const blockAnswersBottom = document.querySelector(".bottom-answers")

                blockAnswersBottom.innerHTML = `
                    <div class="coint coint-buttom" data-value="0">

                    </div>
                    <div class="bottom-image">

                    </div>
                    <div class="coint coint-buttom" data-value="1">

                    </div>
                `;

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


                let blockanswers = document.querySelectorAll(".coint")

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

                            // let chekcookies = document.cookie.match("users_answers")
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
            document.querySelector(".answers-image").style.display = `none`;
            document.querySelector(".question").style.height = `30vh`;

            if (data.type_question == "one_answer"){
                cont.innerHTML = `
                    <div class="variant" data-value="0">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant" data-value="1">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant" data-value="2">
                        <p class="variant-text"></p>
                    </div>
                    <div class="variant" data-value="3">
                        <p class="variant-text"></p>
                    </div>
                `;
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

                            // let chekcookies = document.cookie.match("users_answers")
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
                cont.innerHTML = `
                    <div class="many-variant" data-value="0">
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant" data-value="1">
                        <p class="variant-text"></p>
                    </div>
                    <div class="many-variant" data-value="2">
                        <p class="variant-text">sdc</p>
                    </div>
                    <div class="many-variant" data-value="3">
                        <p class="variant-text"></p>
                    </div>
                `;


                const footer = document.querySelector(".submit")

                footer.innerHTML = `
                    <button type="button" class="confirm-button">Підтвержити відповідь</button>
                `;

                let manyVariants = []
                let manyVariantsBlock = document.querySelectorAll(".many-variant");

                for (let manyblock of manyVariantsBlock){
                    manyblock.addEventListener(
                        'click',
                        () => {
                            const value = manyblock.dataset.value;
                            let index = manyVariants.indexOf(value);
                            if (!manyVariants.includes(manyblock.dataset.value)){
                                manyVariants.push(manyblock.dataset.value);
                                manyblock.style.backgroundColor = `#343434`;
                            }else{
                                // удаление значение блока из списка
                                manyVariants.splice(index, 1)
                                manyblock.style.backgroundColor = `#94C4FF`;
                            }
                            console.log(manyVariants, "manyVariants")
                            document.cookie = `many_answers=${manyVariants}; path=/;`;
                        }
                    )
                }

                let confirm_button = document.querySelector(".confirm-button")

                confirm_button.addEventListener(
                    'click',
                    () => {
                        if (manyVariants.length > 0){
                            localStorage.setItem('time_question', "set")
                            // let chekcookies = document.cookie.match("users_answers")
                            let chekcookies = localStorage.getItem("users_answers")

                            let dataString = manyVariants.join("@");
                            console.log(dataString)

                            if (chekcookies != ''){
                                // отримуємо старі відповіді якщо вони були
                                let oldCookie = localStorage.getItem("users_answers")
                                let cookieList = oldCookie.split(",")   
                                cookieList.push(dataString)

                                // oldCookie.push(block.dataset.value)
                                // document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                // document.cookie = `users_answers=${cookieList}; path=/;`;
                                localStorage.setItem("users_answers", cookieList)
                            }else{
                                // document.cookie = `users_answers=${dataString}; path=/;`;
                                localStorage.setItem("users_answers", dataString)
                            }

                            // прибавляем к cookie index_question + 1
                            // let indexQuestion = document.cookie.match("index_question")
                            // if (indexQuestion === null){
                            //     document.cookie = "index_question=0; path=/;";
                            // }
                            let index = localStorage.getItem("index_question")
                            index = parseInt(index) + 1;
                            localStorage.setItem("index_question", index)
                            
                            document.cookie = "many_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
        
                for (let index = 0; index < amountAnswers; index++) {
                    if (manyBlockAnswers[index].style.display == "flex"){
                        manyBlockAnswers[index].textContent = answers[index]
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
        timeQuestion = parseInt(localStorage.getItem('time_question'));

        if (isNaN(timeQuestion)) {
            // Якщо немає часу або він некоректний 
            timer.textContent = "-";
            return; // або можна встановити якийсь дефолт, наприклад, 0
        }
        timeQuestion -= 1; // Зменшуємо yf 1
        updateCircle(parseInt(timeQuestion))
        timer.textContent = `${Math.trunc(timeQuestion)}`;
        setTimeout(() => {
            timeQuestion = parseInt(localStorage.getItem('time_question'));

            if (isNaN(timeQuestion)) {
                // Якщо немає часу або він некоректний 
                timer.textContent = "-";
                return; // або можна встановити якийсь дефолт, наприклад, 0
            }
            timeQuestion -= 1; // Зменшуємо yf 1
            updateCircle(parseInt(timeQuestion))
            timer.textContent = `${Math.trunc(timeQuestion)}`;
        }, 1000);
    }
)

// SetInterval - запускает функцию через определенный промежуток времени(в милисекундах)
setInterval(() => {
    timeQuestion = parseInt(localStorage.getItem('time_question'));

    if (isNaN(timeQuestion)) {
        // Якщо немає часу або він некоректний 
        timer.textContent = "-";
        return; // або можна встановити якийсь дефолт, наприклад, 0
    }
    timeQuestion -= 1; // Зменшуємо yf 1
    updateCircle(parseInt(timeQuestion))
    timer.textContent = `${Math.trunc(timeQuestion)}`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
    localStorage.setItem('time_question', timeQuestion)
    if (timeQuestion <= 0){
        localStorage.setItem('time_question', "set")
        let chekcookies = localStorage.getItem("users_answers")
        if (chekcookies){
            // отримуємо старі відповіді якщо вони були
            let oldCookie = localStorage.getItem("users_answers")
            let cookieList = oldCookie.split(",")   
            cookieList.push("skip")

            // oldCookie.push(block.dataset.value)
            // document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // document.cookie = `users_answers=${cookieList}; path=/;`;
            localStorage.setItem("users_answers", cookieList)
        }else{
            // document.cookie = `users_answers=skip; path=/;`;
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
}, 1000);


window.addEventListener(
    'load',
    () => {
        if (document.cookie.match("many_answers")){
            let cookieData = document.cookie.split("many_answers=")[1].split(";")[0];
            let listcookie = cookieData.split(",")

            for (let idx of listcookie){
                manyVariantsBlock[idx].style.backgroundColor = `#343434`;
                manyVariants.push(idx)
            }
        }
    }
)


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