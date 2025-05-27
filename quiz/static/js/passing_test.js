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

        
        question.textContent = data.question

        let answers = data.answers
        let amountAnswers = data.answers.length
        
        let dataCookie = document.cookie.split("time_question=")[1].split(";")[0];
        if (dataCookie == "set"){
            timeQuestion = data.test_time;
            timer.textContent = `${timeQuestion} сек.`;
            document.cookie = `time_question=${timeQuestion}; path=/;`;
            timeQuestion = document.cookie.split("time_question=")[1].split(";")[0];
        } 


        for (let index = 0; index < amountAnswers; index++) {
            blockanswers[index].style.display = 'flex';
        }

        for (let index = 0; index < amountAnswers; index++) {
            if (blockanswers[index].style.display == "flex"){
                blockanswers[index].textContent = answers[index]
            }
        }

        document.querySelector(".num-que").textContent = `${data.index}/${data.amount_question}`

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


// Делаем отсчет 30 секунд по окончанию которых будет перекидывать на следщий вопрос
// let timer = document.querySelector(".timer");


// SetInterval - запускает функцию через определенный промежуток времени(в милисекундах)
setInterval(() => {
    timeQuestion = document.cookie.split("time_question=")[1].split(";")[0]; // 🟢 1. Отримуємо поточне значення
    timeQuestion -= 1; // 🟢 2. Зменшуємо
    timer.textContent = `Час: ${Math.trunc(timeQuestion)} сек.`; // 🟢 3. Виводимо
    document.cookie = `time_question=${timeQuestion}; path=/;`; // 🟢 4. Зберігаємо нове значення
    if (timeQuestion <= 0){
        document.cookie = `time_question=set; path=/;`; // 🟢 5. Скидаємо таймер
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
