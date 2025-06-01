const button = document.getElementById("save");
const question = document.querySelector("#question");
const inputImg = document.getElementById("imgInput");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p")
let answers;
let questions;
let timeC;

button.addEventListener("click", ()=>{
    console.log(document.cookie.match("questions"))
    // Очистити question
    localStorage.removeItem("question");

    // Очистити всі відповіді
    answerInputList.forEach((_, index) => {
        localStorage.removeItem(`answer-${index}`);
    });
    for (let input of answerInputList){
        if (input.checkVisibility()){
            console.log(input.value);
            if (input.classList.contains("correct")){
                console.log("right:", input.value);
                answers += `(?%+${input.value}+%?)`;
            }else{
                console.log("wrong:", input.value);
                answers += `(?%-${input.value}-%?)`;
            }
        }
    }


    questions = question.value;
    if (document.cookie.match("questions") != null && document.cookie.match("questions") != ""){
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        console.log("questionCookie =", questionCookie);
        questions = questionCookie + "?%?" + questions;

        timeCookie = document.cookie.split("time=")[1].split(";")[0];
        timeC = timeCookie + "?#?" + timeP.dataset.time;
        console.log("time =", timeC);
        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        answers = answerCookie + "?@?" + answers;
    } else{
        // timeC = timeP.textContent;
        timeC = timeP.dataset.time;
        questions = question.value;
    }
    questions = questions.replace("undefined", "");
    questions = questions.replace("questions", "");
    questions = questions.replace("null", "");
    document.cookie = `questions=${questions}; path=/;`;

    timeC = timeC.replace("undefined", "");
    timeC = timeC.replace("questions", "");
    timeC = timeC.replace("null", "");
    timeC = timeC.replace("⏱ ", "");
    timeC = timeC.replace(" ˅", "");
    document.cookie = `time=${timeC}; path=/;`;

    // document.cookie = `images=${imageC}; path=/;`;

    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;
})




// Загрузка из localStorage при запуске
window.addEventListener("DOMContentLoaded", () => {
    const questionSaved = localStorage.getItem("question");
    if (questionSaved) {
        question.value = questionSaved;
    }

    let filledAnswersCount = 0;

    answerInputList.forEach((input, index) => {
        const saved = localStorage.getItem(`answer-${index}`);
        if (saved && saved.trim() !== "") {
            input.value = saved;
            const answerBlock = input.closest(".answer-block");
            if (answerBlock.classList.contains("hidden")) {
                answerBlock.classList.remove("hidden");
            }
            filledAnswersCount++;
        }
    });

    // Якщо вже є 2 або більше заповнених відповідей, приховати кнопку додавання
    if (filledAnswersCount >= 4) {
        const buttonPlus = document.getElementById("addQuestion");
        buttonPlus.classList.add("hidden-button");
    }

    if (filledAnswersCount >= 2){
        if (document.querySelector(".first_input").value === ""){
            document.querySelector(".first-block").classList.add("hidden");
        }
        if (document.querySelector(".second-input").value === ""){
            document.querySelector(".second-block").classList.add("hidden");
        }
    }
});


// Сохранять вопрос при изменении
question.addEventListener("input", () => {
    localStorage.setItem("question", question.value);
});

// Сохранять ответы при изменении
answerInputList.forEach((input, index) => {
    input.addEventListener("input", () => {
        localStorage.setItem(`answer-${index}`, input.value);
    });
});
