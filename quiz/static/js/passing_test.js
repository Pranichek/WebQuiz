// Створюємо як би об'єкт сокету 
const socket = io();  


socket.on('connect', () => {
    console.log('Підключено і можемо робити запит');
    socket.emit('get_question');  // Запит на перше питання
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

        document.querySelector(".num-que").textContent = `${data.index}/10`

        console.log(answers, "answers")
        console.log(amountAnswers, "amount")
    }else{
        document.querySelector("#end-test").submit();
        socket.close();
    }
});

let blockanswers = document.querySelectorAll(".variant")

for (let block of blockanswers){
    block.addEventListener(
        'click',
        () => {
            socket.emit('next_question')
        }
    )
}

