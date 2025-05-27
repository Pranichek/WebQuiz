// Створюємо як би об'єкт сокету 
const socket = io();  


socket.on('connect', () => {
    console.log('Підключено і можемо робити запит на перше питання');
    socket.emit('get_question');  
});

socket.on('question', (data) => {
    if (data.question != "Кінець"){
        let question = document.querySelector(".question-test")
        let blockanswers = document.querySelectorAll(".variant")

        
        question.textContent = data.question

        let answers = data.answers
        let amountAnswers = data.answers.length

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
            socket.emit('next_question')
        }
    )
}