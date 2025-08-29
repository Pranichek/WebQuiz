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
        document.querySelector(".midle-time").textContent = midleTime + " сек";
    }

    localStorage.setItem("accuracy", data.accuracy);
    const fill = document.querySelector(".fill");
    const textPerc = document.querySelector(".text-perc p");
    const quard = document.querySelector(".quard");


    if (fill) {
        fill.style.transition = "none";
        fill.style.width = "0%";
        // Триггерим перерисовку
        void fill.offsetWidth;
        fill.style.transition = "width 1s ease-in-out";
        fill.style.width = Math.round(data.accuracy) + "%";
    }
    if (quard) {
        quard.style.left = `calc(${Math.round(data.accuracy)}% - 2.5vw)`;
    }
    if (textPerc) {
        textPerc.textContent = "0%!";
        let current = 0;
        const target = Math.round(data.accuracy);
        const interval = setInterval(() => {
            if (current < target) {
                current++;
                textPerc.textContent = `${current}%!`;
            } else {
                clearInterval(interval);
            }
        }, 15);
    }

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
            let min_points = correctForThisQuestion.length / 2
            if ((count_right > parseInt(min_points) && count_uncorrect == 0) || (correct_answers.includes(user_answer))) {
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
                            if (mainHead.className == "uncorrect-head"){
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

            setTimeout(() => {
                backWind.style.opacity = '1';
            }, 10);

            let windowQuestion = document.createElement('div');
            windowQuestion.className = "window-question";
            backWind.appendChild(windowQuestion);

            setTimeout(() => {
                windowQuestion.style.transform = 'translate(-50%, -50%)';
            }, 10);

            let headNew;

            if (cont.getElementsByClassName("correct-head").length > 0) {
                headNew = document.createElement("div");
                headNew.className = "correct-head";
            } else if (cont.getElementsByClassName("uncorrect-head").length > 0) {
                headNew = document.createElement("div");
                headNew.className = "uncorrect-head";
            } else if (cont.getElementsByClassName("yellow-head").length > 0) {
                headNew = document.createElement("div");
                headNew.className = "yellow-head";
            } else if (cont.getElementsByClassName("skip-head").length > 0) {
                headNew = document.createElement("div");
                headNew.className = "skip-head";
            }

            if (headNew) {
                windowQuestion.appendChild(headNew);
            }

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
                    // Анимация исчезновения для модального окна
                    windowQuestion.style.transform = 'translate(-50%, 150%)';
                    // Анимация исчезновения затемнения
                    backWind.style.opacity = '0';
                    setTimeout(() => backWind.remove(), 500);
                }
            });
        });
    }
});

playAgain.addEventListener("click", () => {
    window.location.replace(`/test_data?id_test=${playAgain.value}`);
});


