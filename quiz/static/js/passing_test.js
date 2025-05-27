// Створюємо як би об'єкт сокету 
const socket = io();  
let timeQuestion;
let timer = document.querySelector(".timer");

socket.on('connect', () => {
    console.log('Підключено і можемо робити запит на перше питання');
    socket.emit('get_question',
        {
            index: parseInt(document.cookie.split("index_question=")[1].split(";")[0])
        }
    );  
});

socket.on('question', (data) => {
    if (data.question != "Кінець"){
        let question = document.querySelector(".question-test")
        let blockanswers = document.querySelectorAll(".variant")
        let manyBlockAnswers = document.querySelectorAll(".many-variant")

        
        question.textContent = data.question

        let answers = data.answers
        let amountAnswers = data.answers.length
        document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`
        
        let dataCookie = document.cookie.split("time_question=")[1].split(";")[0];
        if (dataCookie == "set"){
            timeQuestion = data.test_time;
            timer.textContent = `${timeQuestion} сек.`;
            document.cookie = `time_question=${timeQuestion}; path=/;`;
            timeQuestion = document.cookie.split("time_question=")[1].split(";")[0];
        } 


        if (data.type_question == "one_answer"){
            document.querySelector(".confirm-button").style.display = "none";

            let answersMany = document.querySelectorAll(".many-variant");
            for (let answer_block of answersMany){
                answer_block.style.display = 'none';
            }

            for (let index = 0; index < amountAnswers; index++) {
                blockanswers[index].style.display = 'flex';
            }
    
            for (let index = 0; index < amountAnswers; index++) {
                if (blockanswers[index].style.display == "flex"){
                    blockanswers[index].textContent = answers[index]
                }
            }
        }else if (data.type_question == "many_answers"){
            document.querySelector(".confirm-button").style.display = "flex";
            let answersBlock = document.querySelectorAll(".variant");
            for (let answer_block of answersBlock){
                answer_block.style.display = 'none';
            }


            for (let index = 0; index < amountAnswers; index++) {
                manyBlockAnswers[index].style.display = 'flex';
            }
    
            for (let index = 0; index < amountAnswers; index++) {
                if (manyBlockAnswers[index].style.display == "flex"){
                    manyBlockAnswers[index].textContent = answers[index]
                }
            }
        }
        
        console.log(answers, "answers")
        console.log(amountAnswers, "amount")
    }else{
        document.querySelector("#end-test").submit();
        socket.close();
    }
});

let blockanswers = document.querySelectorAll(".variant")

// Подавання наступного питання, та збереження індексу питання
for (let block of blockanswers){
    block.addEventListener(
        'click',
        () => {
            // сбрасываем время если пользователь нажал на какой то ответ
            document.cookie = `time_question=set; path=/;`;

            let chekcookies = document.cookie.match("users_answers")
            if (chekcookies){
                // отримуємо старі відповіді якщо вони були
                let oldCookie = document.cookie.split("users_answers=")[1].split(";")[0];
                let cookieList = oldCookie.split(",")   
                cookieList.push(block.dataset.value)

                // oldCookie.push(block.dataset.value)
                document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = `users_answers=${cookieList}; path=/;`;
            }else{

                document.cookie = `users_answers=${block.dataset.value}; path=/;`;
            }
            // прибавляем к cookie index_question + 1
            let indexQuestion = document.cookie.match("index_question")
            if (indexQuestion === null){
                document.cookie = "index_question=0; path=/;";
            }
            let index = document.cookie.split("index_question=")[1].split(";")[0];
            index = parseInt(index) + 1;
            document.cookie = `index_question=${index}; path=/;`;

            socket.emit('next_question', {
                index: index,
                answer: block.dataset.value
            })
            console.log("Питання відправлено на сервер, чекаємо відповіді");
        }
    )
}



// SetInterval - запускает функцию через определенный промежуток времени(в милисекундах)
setInterval(() => {
    timeQuestion = document.cookie.split("time_question=")[1].split(";")[0]; // Отримуємо поточне значення
    timeQuestion -= 1; // Зменшуємо yf 1
    timer.textContent = `Час: ${Math.trunc(timeQuestion)} сек.`; // задаем в параграф чтобы чувачек выдел сколько он просрал времени
    document.cookie = `time_question=${timeQuestion}; path=/;`; // Зберігаємо нове значення
    if (timeQuestion <= 0){
        document.cookie = `time_question=set; path=/;`; // Скидаємо таймер
        let chekcookies = document.cookie.match("users_answers")
        if (chekcookies){
            // отримуємо старі відповіді якщо вони були
            let oldCookie = document.cookie.split("users_answers=")[1].split(";")[0];
            let cookieList = oldCookie.split(",")   
            cookieList.push("skip")

            // oldCookie.push(block.dataset.value)
            document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = `users_answers=${cookieList}; path=/;`;
        }else{
            document.cookie = `users_answers=skip; path=/;`;
        }
        // прибавляем к cookie index_question + 1
        let indexQuestion = document.cookie.match("index_question")
        if (indexQuestion === null){
            document.cookie = "index_question=0; path=/;";
        }
        let index = document.cookie.split("index_question=")[1].split(";")[0];
        index = parseInt(index) + 1;
        document.cookie = `index_question=${index}; path=/;`;

        console.log("Питання відправлено на сервер, чекаємо відповіді");
        socket.emit('next_question', {
            index: index
        })
        // console.log("Питання відправлено на сервер, чекаємо відповіді");
    }
}, 1000);


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
            document.cookie = `time_question=set; path=/;`;
            let chekcookies = document.cookie.match("users_answers")

            let dataString = manyVariants.join("@");
            console.log(dataString)

            if (chekcookies){
                // отримуємо старі відповіді якщо вони були
                let oldCookie = document.cookie.split("users_answers=")[1].split(";")[0];
                let cookieList = oldCookie.split(",")   
                cookieList.push(dataString)

                // oldCookie.push(block.dataset.value)
                document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = `users_answers=${cookieList}; path=/;`;
            }else{
                document.cookie = `users_answers=${dataString}; path=/;`;
            }

            // прибавляем к cookie index_question + 1
            let indexQuestion = document.cookie.match("index_question")
            if (indexQuestion === null){
                document.cookie = "index_question=0; path=/;";
            }
            let index = document.cookie.split("index_question=")[1].split(";")[0];
            index = parseInt(index) + 1;
            document.cookie = `index_question=${index}; path=/;`;
            
            document.cookie = "many_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            socket.emit('next_question', {
                index: index,
                answer: dataString
            })
            console.log("Питання відправлено на сервер, чекаємо відповіді");
        }
    }
)


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
            console.log(manyVariants, "kurka")
        }
    }
)
