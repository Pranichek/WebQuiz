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
        console.log("change button color");
        button.classList.add("grey");
        console.log(button.classList);
    }
}

function answerScanning(){
    console.log("validAnswersFlag 1 =", validAnswersFlag);
    validAnswersFlag = true;
    for (let input of answerInputList){
        if (input.checkVisibility()){
            button.type = "submit";
            button.classList.remove("grey");
            button.classList.add("purple");
            if (input.value == ""){
                validAnswersFlag = false;
            }
        }
    }

    console.log("validAnswersFlag 2 =", validAnswersFlag);
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
    console.log(document.cookie.match("questions"))
    // Очистити question
    localStorage.removeItem("question");
    localStorage.setItem("timeData", 1)

    // Очистити всі відповіді из localstorage
    answerInputList.forEach((input, index) => {
        localStorage.removeItem(`answer-${index}`);
    });

    for (let input of answerInputList){
        // проверяем блок ли видимій(то есть в нем есть ответ) чтобы понять надо его добавлять как оответ или нет
        if (input.checkVisibility()){
            console.log(input.value);
            if (input.value != ''){
                if (input.classList.contains("correct")){
                    console.log("right:", input.value);
                    answers += `(?%+${input.value}+%?)`;
                }else{
                    console.log("wrong:", input.value);
                    answers += `(?%-${input.value}-%?)`;
                }
            }
        }
    }

    questions = question.value;
    timeC = timeP.dataset.time;
    if (document.cookie.match("questions") != null){
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        console.log("questionCookie =", questionCookie);
        if (questionCookie != ""){
            questions = questionCookie + "?%?" + questions;
        }

        timeCookie = document.cookie.split("time=")[1].split(";")[0];
        if (timeCookie != ""){
            timeC = timeCookie + "?#?" + timeP.dataset.time;
            console.log("time =", timeC);
        }

        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        if (answerCookie != ""){
            answers = answerCookie + "?@?" + answers;
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
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;

    localStorage.removeItem("rightIndexes")
})




// Загрузка из лоаклстораджа при запуске
window.addEventListener("DOMContentLoaded", () => {
    let timedata = localStorage.getItem("timeData")
    const time = document.getElementById("time");
    let liLists = document.querySelectorAll(".list-time")
    if(timedata){
        time.textContent = liLists[parseInt(timedata)].textContent;
        time.dataset.time = liLists[parseInt(timedata)].dataset.time;
    }

    const questionSaved = localStorage.getItem("question");
    if (questionSaved) {
        question.value = questionSaved;
    }

    let filledAnswersCount = 0;

    answerInputList.forEach((input, index) => {
        const saved = localStorage.getItem(`answer-${index}`);
        if (saved && saved.trim() !== "") {
            console.log(button.type, "da")
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
