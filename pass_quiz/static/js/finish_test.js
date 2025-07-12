const socket = io();

let chcklocal = document.referrer

if (!chcklocal.includes("passig_test")){
    window.location.replace('/');
}

localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set')
localStorage.setItem("need_rolad", "True")




const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");

const playAgain = document.querySelector(".play_again");

socket.emit("finish_test", {
    users_answers: usersAnswers,
    test_id: testId,
    wasted_time: localStorage.getItem("wasted_time")
});

socket.on("test_result", (data) => {
    playAgain.value = data.test_id;


    document.querySelector(".uncorrect-answers").textContent = data.uncorrect_answers;
    document.querySelector(".correct-answers").textContent = data.right_answers;
    document.querySelector(".mark").textContent = data.mark;

    if (data.count_answered == 0) {
        document.querySelector(".midle-time").textContent = "0";
    } else {
        let midleTime = localStorage.getItem("wasted_time") / data.count_answered;
        midleTime = midleTime.toFixed(0);
        document.querySelector(".midle-time").textContent = midleTime;
    }

    const fill = document.querySelector(".fill");
    const textPerc = document.querySelector(".text-perc p");
    const quard = document.querySelector(".quard");

    const target = data.accuracy;
    let current = 0;

    // Установка ширины и позиции
    fill.style.width = target + "%";
    qardwidth = document.querySelector(".quard").style.width
    // quard.style.left = `calc(${target}% - 76px)`; // сдвиг на половину ширины .quard для выравнивания
    quard.style.left = `calc(${target}% - 38px)`; // сдвиг на половину ширины .quard для выравнивания

    const interval = setInterval(() => {
        if (current < target) {
            current++;
            textPerc.textContent = current + "%";
        } else {
            clearInterval(interval);
        }
    }, 15);

    let mainQuestDiv = document.querySelector(".questions");
    

    data.questions.forEach(element => {
        let mainHead = document.createElement("div");
        mainHead.className = "head"

        let indexel = data.questions.indexOf(element);
        // if (data.correct_index.includes(indexel)){
        //     mainHead.className = "correct-head"
        // }else{
        //     mainHead.className = "uncorrect-head"
        // }

        let questionDiv = document.createElement("div");
        let questText = document.createElement('div')
        
        questionDiv.className = "question"
        
        questText.innerHTML = `
        ${element.question}
        `;
        questText.className = "quest-text"
        questionDiv.appendChild(questText)
        
        questionDiv.insertBefore(mainHead, questionDiv.firstChild)


        element.answers.forEach((answ, index) => {
            let circle = document.createElement('div')

            //  берем текущий список приавльных ответов для текущего вопроса
            // Наприклвд: якщо правильні 1 і 2, то буде [1, 2] 
            const correctForThisQuestion = data.correct_answers[indexel];
            const userAnswersForThisQuestion = data.users_answers[indexel];

            let count_right = 0
            for (let userAnswer of userAnswersForThisQuestion){
                if (correctForThisQuestion.includes(userAnswer)){
                    count_right++;
                }
            }

            // let indexel = data.questions.indexOf(element);
            if (correctForThisQuestion.length == count_right){
                mainHead.className = "correct-head"
            }else if(count_right >= 1){
                mainHead.className = "yellow-head"
            }else{
                mainHead.className = "uncorrect-head"
            }

            if (correctForThisQuestion.length == 1 || correctForThisQuestion.length == count_right){
                if (correctForThisQuestion.includes(index) && userAnswersForThisQuestion.includes(index)) {
                    circle.className = "correct-circle";
                }

                else if (userAnswersForThisQuestion.includes(index) && !correctForThisQuestion.includes(index)) {
                    circle.className = "uncorrect-circle";
                }

                else{
                    circle.className = "simple-circle"
                }
            }else{
                if (correctForThisQuestion.includes(index) && userAnswersForThisQuestion.includes(index)) {
                    circle.className = "orange-circle";
                }else if(userAnswersForThisQuestion.includes(index)){
                    circle.className = "uncorrect-circle";
                }
                else{
                    circle.className = "simple-circle"
                }
            }
            
            
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


playAgain.addEventListener(
    'click',
    () => {
        window.location.replace(`/test_data?id_test=${playAgain.value}`);
    }
);




