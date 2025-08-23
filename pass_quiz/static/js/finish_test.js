const socket = io();

let chcklocal = document.referrer;

if (!chcklocal.includes("passig_test")) {
    window.location.replace('/');
}

localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set');
localStorage.setItem("need_rolad", "True");

const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");


const playAgain = document.querySelector(".play_again");

socket.emit("finish_test", {
    users_answers: usersAnswers, 
    test_id: testId,
    wasted_time: localStorage.getItem("wasted_time")
});


socket.on("test_result", (data) => {
    console.log(data.questions)
    // масив где и 

    playAgain.value = data.test_id;

    document.querySelector(".uncorrect-answers").textContent = data.uncorrect_answers;
    document.querySelector(".correct-answers").textContent = data.right_answers;
    document.querySelector(".mark").textContent = data.mark;

    if (parseInt(data.mark) == 1){
        document.querySelector(".text-mark").textContent = "бал"
    }else if(parseInt(data.mark) > 1 && parseInt(data.mark) < 5){
        document.querySelector(".text-mark").textContent = "бали"
    }else if(parseInt(data.mark) > 4 || parseInt(data.mark) == 0){
        document.querySelector(".text-mark").textContent = "балів"
    }

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

    fill.style.width = target + "%";
    let qardwidth = document.querySelector(".quard").style.width;
    quard.style.left = `calc(${target}% - 38px)`;

    const interval = setInterval(() => {
        if (current < target) {
            current++;
            textPerc.textContent = current + "%";
        } else {
            clearInterval(interval);
        }
    }, 15);

    let mainQuestDiv = document.querySelector(".questions");

    data.questions.forEach((element, index) => {
        let mainHead = document.createElement("div");
        mainHead.className = "head";

        let indexel = index;

        let questionDiv = document.createElement("div");
        let questText = document.createElement('div');

        questionDiv.className = "question";

        questText.innerHTML = `${index + 1}. ${element.question}`;
        questText.className = "quest-text";
        questionDiv.appendChild(questText);

        questionDiv.insertBefore(mainHead, questionDiv.firstChild);

        element.answers.forEach((answ, index) => {
            
            let circle = document.createElement('div');
            let divRight = document.createElement('div')

            const correctForThisQuestion = data.correct_answers[indexel];
            const userAnswersForThisQuestion = data.users_answers[indexel];

            let count_right = 0;
            let count_uncorrect = 0
            for (let userAnswer of userAnswersForThisQuestion) {
                if (correctForThisQuestion.includes(userAnswer)) {
                    count_right++;
                }else{
                    count_uncorrect++
                }
            }

            let correct_answers = data.questions[indexel].answers
            let user_answer = data.users_answers[indexel][0]
            let min_points = correctForThisQuestion.length % 2 == 0 ? correctForThisQuestion.length / 2:(correctForThisQuestion.length + 1) / 2
            if ((count_right >= parseInt(min_points) && count_uncorrect == 0) || (correct_answers.includes(user_answer))) {
                mainHead.className = "correct-head";
            }else if (userAnswersForThisQuestion.includes("∅")){
                mainHead.className = "skip-head"
            }else {
                mainHead.className = "uncorrect-head";
            }

            const type_quest = data.type_question[indexel];
            for (let i = 0; i < type_quest.length + 1; i++){
                if (type_quest === 'many-answers'){
                        if (correctForThisQuestion.includes(index)){
                            divRight.className = "right-answs"
                        }
                        // Для множественных правильных ответов
                        if (correctForThisQuestion.includes(index) && userAnswersForThisQuestion.includes(index)) {
                            circle.className = "correct-quard"; // Правильный ответ
                            if (count_right <= 1){
                                circle.className = "orange-quard"
                            }
                        } else if (correctForThisQuestion.includes(index) && !userAnswersForThisQuestion.includes(index)) {
                            circle.className = "corrected-quard"; // Правильный вариант, но не выбран
                        } else if (userAnswersForThisQuestion.includes(index)) {
                            circle.className = "uncorrect-quard"; // Неправильный ответ
                        } else {
                            circle.className = "simple-quard"; // Ответ не выбран
                        }
                }else if (type_quest == "one-answer"){
                    if (correctForThisQuestion.includes(index)){
                        divRight.className = "right-answs"
                    }
                    // Для одиночных правильных ответов
                    if (correctForThisQuestion.includes(index) && userAnswersForThisQuestion.includes(index)) {
                        circle.className = "correct-circle";

                    } else if (correctForThisQuestion.includes(index) && !userAnswersForThisQuestion.includes(index)) {
                        circle.className = "right-circle"; // Правильный вариант, но не выбран
                    }else if (userAnswersForThisQuestion.includes(index) && !correctForThisQuestion.includes(index)) {
                        circle.className = "uncorrect-circle"; // Неправильный ответ
                    } else {
                        circle.className = "simple-circle"; // Ответ не выбран
                    }
                    // }
                }else if (type_quest == "input-gap"){

                }
            }
            
            let answerDiv = document.createElement("div");
        
            if (answ!= "image?#$?image"){
                if (type_quest == "many-answers" || type_quest == "one-answer"){
                    answerDiv.innerHTML = `${answ}`;
                }else{
                    // берем ответ что ввел пользователь
                    if (!questionDiv.querySelector(".input-block")){

                        let correct_answers = data.questions[indexel].answers
                        let user_answer = data.users_answers[indexel][0]

                        const blocksDiv = document.createElement("div")
                        blocksDiv.classList = "blocks-div"
                        if (user_answer == "∅"){
                            // когда ответ пропущен
                            user_answer = "пропущено"
                                for (let symbol of user_answer){
                                const block = document.createElement("div")
                                block.className = "input-block"
                                block.textContent = symbol
                                blocksDiv.appendChild(block)
                            }
                        }else{
                            for (let symbol of user_answer){
                                const block = document.createElement("div")
                                block.className = "input-block"
                                block.textContent = symbol
                                blocksDiv.appendChild(block)
                                
                                if (correct_answers.includes(user_answer)){
                                    block.classList.add("correct-block")
                                }else{
                                    block.classList.add("uncorrect-block")
                                }
                            }

                            answerDiv.append(blocksDiv)

                            const paragraph = document.createElement("p")
                            paragraph.classList = "right-answers-gaps"
                            let text = "Вірні варіанти: "
                            
                            for (let correctAnswers of correct_answers){
                                text += correctAnswers + " "
                            }
                            paragraph.textContent = text
                            answerDiv.appendChild(paragraph)
                        }  

                        
                    }
                }
            }else{
                answerDiv.innerHTML = `Зображення`;
            }

            

            answerDiv.appendChild(divRight)
            answerDiv.insertBefore(circle, answerDiv.firstChild);
            answerDiv.className = "answ";
            if (type_quest == "input-gap"){
                answerDiv.classList.add("center-blocks")
                questionDiv.classList.add("center-blocks")
            }

            questionDiv.appendChild(answerDiv);
        });

        mainQuestDiv.appendChild(questionDiv);
    });

    let divAnsw = document.querySelectorAll(".question");
    for (let cont of divAnsw) {
        
        cont.addEventListener("click", () => {
            let backWind = document.createElement("div");
            backWind.className = "back-wind";
            document.body.appendChild(backWind);

            let windowQuestion = document.createElement('div');
            windowQuestion.className = "window-question";
            backWind.appendChild(windowQuestion);

            // заголовок цвет
            let headMini = cont.getElementsByClassName("correct-head");
            for (let i = 0; i < headMini.length; i++) {
                const headNew = document.createElement("div");
                headNew.className = "correct-head";
                windowQuestion.appendChild(headNew);
            }
            let headMini2 = cont.getElementsByClassName("uncorrect-head");
            for (let i = 0; i < headMini2.length; i++) {
                const headNew = document.createElement("div");
                headNew.className = "uncorrect-head";
                windowQuestion.appendChild(headNew);
            }
            let headMini3 = cont.getElementsByClassName("yellow-head");
            for (let i = 0; i < headMini3.length; i++) {
                const headNew = document.createElement("div");
                headNew.className = "yellow-head";
                windowQuestion.appendChild(headNew);
            }

            let headMini4 = cont.getElementsByClassName("skip-head");
            for (let i = 0; i < headMini4.length; i++) {
                const headNew = document.createElement("div");
                headNew.className = "skip-head";
                windowQuestion.appendChild(headNew);
            }

            // текст вопроса
            let qustion_text = cont.getElementsByClassName('quest-text');
            for (let i = 0; i < qustion_text.length; i++) {
                const textBlock = document.createElement('div');
                textBlock.className = "question-text";
                textBlock.innerHTML = qustion_text[i].innerHTML;
                windowQuestion.appendChild(textBlock);
            }

            const unswerSpace = document.createElement("div");
            unswerSpace.className = "space-div";
            windowQuestion.appendChild(unswerSpace);
            
            // ответы для модальных
            let answersNew = cont.getElementsByClassName("answ");
            for (let i = 0; i < answersNew.length; i++) {
                const answDiv = document.createElement('div');
                answDiv.className = "answ2";

                if (cont.classList.contains("center-blocks")){
                    answDiv.classList.add("center-blocks")
                }
                answDiv.innerHTML = answersNew[i].innerHTML;
                unswerSpace.appendChild(answDiv);
            }

            backWind.addEventListener("click", (event) => {
                if (event.target === backWind) {
                    backWind.remove();
                }
            });
        });
    }
});

playAgain.addEventListener("click", () => {
    window.location.replace(`/test_data?id_test=${playAgain.value}`);
});


