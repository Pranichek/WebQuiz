localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set')
localStorage.setItem("need_rolad", "True")

const socket = io();

const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");

socket.emit("finish_test", {
    users_answers: usersAnswers,
    test_id: testId
});

socket.on("test_result", (data) => {
    document.querySelector(".user_pimpa").innerHTML = `
        ${data.right_answers}`;
    // document.querySelector(".user-pampa").innerHTML =`
    //     ${data.amount_questions}
    // `;

    // document.querySelector(".accuracy").innerHTML = `
    //     accuracy = ${data.accuracy}
    // // `;
    
    let mainQuestDiv = document.querySelector(".questions");
    
    // document.querySelector(".answer").innerHTML = `
    // ${data.questions.answers}`;
    data.questions.forEach(element => {
        let mainHead = document.createElement("div");
        mainHead.className = "head"
        let questionDiv = document.createElement("div");
        let questText = document.createElement('div')
        
        questionDiv.className = "question"
        
        questText.innerHTML = `
        ${element.question}
        `;
        questText.className = "quest-text"
        questionDiv.appendChild(questText)
        
        questionDiv.insertBefore(mainHead, questionDiv.firstChild)
        element.answers.forEach(answ => {
            let circle = document.createElement('div')
            circle.className = "circle"
            
            let answerDiv = document.createElement("div")
            answerDiv.innerHTML = `
            ${answ}
            `
            answerDiv.insertBefore(circle, answerDiv.firstChild)
            answerDiv.className = "answ"
            questionDiv.appendChild(answerDiv)
        })
        
        mainQuestDiv.appendChild(questionDiv)

    });
    
});

window.addEventListener('popstate', function(event) {
    this.window.alert(3223)
})