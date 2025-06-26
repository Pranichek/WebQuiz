localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set')
localStorage.setItem("need_rolad", "True")


const socket = io();

const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");

const playAgain = document.querySelector(".play_again");

socket.emit("finish_test", {
    users_answers: usersAnswers,
    test_id: testId
});

socket.on("test_result", (data) => {
    playAgain.value = data.test_id;


    document.querySelector(".uncorrect-answers").textContent = data.uncorrect_answers;
    document.querySelector(".correct-answers").textContent = data.right_answers;
    document.querySelector(".mark").textContent = data.mark;
    // console.log(data.questions)
    console.log(localStorage.getItem("wasted_time"))
    if (data.count_answered == 0) {
        document.querySelector(".midle-time").textContent = "0";
    } else {
         let midleTime = localStorage.getItem("wasted_time") / data.count_answered;
        // округляем до целого ро числа
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
    quard.style.left = `calc(${target}% - 78px)`; // сдвиг на половину ширины .quard для выравнивания

    const interval = setInterval(() => {
        if (current < target) {
            current++;
            textPerc.textContent = current + "%";
        } else {
            clearInterval(interval);
        }
    }, 15);

    let mainQuestDiv = document.querySelector(".questions");
    
    // document.querySelector(".answer").innerHTML = `
    // ${data.questions.answers}`;
    data.questions.forEach(element => {
        let mainHead = document.createElement("div");
        mainHead.className = "head"

        let indexel = data.questions.indexOf(element);
        if (data.correct_index.includes(indexel)){
            mainHead.className = "correct-head"
        }else{
            mainHead.className = "uncorrect-head"
        }
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

            
            if (correctForThisQuestion.includes(index)) {
                circle.className = "correct-circle";
            }

            else if (userAnswersForThisQuestion.includes(index) && !correctForThisQuestion.includes(index)) {
                circle.className = "uncorrect-circle";
            }

            else{
                circle.className = "simple-circle"
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

// document.addEventListener("DOMContentLoaded", () => {
//     const fill = document.querySelector(".fill");
//     const textPerc = document.querySelector(".text-perc p");
//     const quard = document.querySelector(".quard");

//     const target = 78;
//     let current = 0;

//     // Установка ширины и позиции
//     fill.style.width = target + "%";
//     quard.style.left = `calc(${target}% - 48px)`; // сдвиг на половину ширины .quard для выравнивания

//     const interval = setInterval(() => {
//         if (current < target) {
//             current++;
//             textPerc.textContent = current + "%";
//         } else {
//             clearInterval(interval);
//         }
//     }, 15);
// });



