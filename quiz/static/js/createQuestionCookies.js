const button = document.getElementById("save");
const question = document.querySelector("#question");
const inputImg = document.getElementById("imgInput");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p")
let answers;
let questions;
let timeC;
let validAnswersFlag = false;

function buttonColorChanging(){
    if (button.type == "button"){
        button.classList.add("grey");
    }
}

export function answerScanning(){
    validAnswersFlag = true;
    for (let input of answerInputList){
        if (input.checkVisibility()){
            button.type = "submit";
            button.classList.remove("grey");
            button.classList.add("purple");
            let parentNode = input.parentNode
            const checkImage = parentNode.querySelector(".for-image")
            
            if (input.value == "" && !checkImage){
                validAnswersFlag = false;
            }
        }
    }

    if (validAnswersFlag == false | document.querySelector(".question").value == ""){
        button.type = "button";
        button.classList.add("grey");
        button.classList.remove("purple");
    } else{
        button.type = "submit";
        button.classList.remove("grey");
        button.classList.add("purple");
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    buttonColorChanging();
    answerScanning();
})

document.addEventListener("click", ()=>{
    buttonColorChanging();
    answerScanning();
})
document.addEventListener("keydown", ()=>{
    buttonColorChanging();
})
document.addEventListener("keyup", ()=>{
    answerScanning();
})

button.addEventListener("click", ()=>{
    localStorage.removeItem("question");
    localStorage.setItem("timeData", 1)

    // Очистити всі відповіді из localstorage
    answerInputList.forEach((input, index) => {
        localStorage.removeItem(`answer-${index}`);
    });

    let ticks = document.querySelectorAll(".tick-circle")
    answerInputList.forEach((input, index) => {
        let ParentTag = input.parentNode
        const checkImageCreate = ParentTag.querySelector(".for-image")
        if (input.checkVisibility()){
            if (input.value != ''){
                if (ticks[index].style.display == "flex"){
                answers += `(?%+${input.value}+%?)`;
                }else{
                    answers += `(?%-${input.value}-%?)`;
                }
            }else{
                if (ticks[index].style.display == "flex"){
                    answers += `(?%+image?#$?image+%?)`;
                }else{
                    answers += `(?%-image?#$?image-%?)`;
                }
            }
            
        }
    });

    let questions = question.value;
    let timeC = timeP.dataset.time;

    let newType = localStorage.getItem("type");
    if (document.cookie.match("questions") != null){
        let questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        if (questionCookie && questionCookie != ""){
            questions = questionCookie + "?%?" + questions;
        }

        let timeCookie = document.cookie.split("time=")[1].split(";")[0];
        if (timeCookie && timeCookie != ""){
            timeC = timeCookie + "?#?" + timeP.dataset.time;
        }

        let answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        if (answerCookie && answerCookie != ""){
            answers = answerCookie + "?@?" + answers;
        }

        let typeQuestions = document.cookie.split("typeQuestions=")[1].split(";")[0];
        if (typeQuestions && typeQuestions != ""){
            newType = typeQuestions + "?$?" + newType;
        }
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

    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;

    newType = newType.replace("undefined", "");
    newType = newType.replace("null", "");
    document.cookie = `typeQuestions=${newType}; path=/`;

    localStorage.removeItem("rightIndexes");
    localStorage.setItem("type", "one-answer");
})

// Загрузка из localStorage при запуске
window.addEventListener("DOMContentLoaded", () => {
    let timedata = localStorage.getItem("timeData");
    const time = document.getElementById("time");
    let liLists = document.querySelectorAll(".list-time");
    if (timedata){
        time.textContent = liLists[parseInt(timedata)].textContent;
        time.dataset.time = liLists[parseInt(timedata)].dataset.time;

        const timeEl = document.querySelector("#time");
        const imgUrl = timeEl.dataset.img;

        timeEl.innerHTML += `<img src="${imgUrl}">`;
    }

    const questionSaved = localStorage.getItem("question");
    if (questionSaved) {
        question.value = questionSaved;
    }

    let filledAnswersCount = 0;

    answerInputList.forEach((input, index) => {
        const saved = localStorage.getItem(`answer-${index}`);
        if (saved && saved.trim() !== "") {
            if (document.querySelector(".question").value != ""){
                button.type = "submit";
                button.classList.remove("grey");
            }
            input.value = saved;
            
            const answerBlock = input.closest(".answer-block");
            if (answerBlock.classList.contains("hidden")) {
                answerBlock.classList.remove("hidden");
            }
            filledAnswersCount++;
        }
    });

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
