import { answerScanning } from "./answers_scaning.js"

const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let answers = "";

document.addEventListener("input", answerScanning);
document.addEventListener("click", answerScanning);
document.addEventListener("change", answerScanning);
document.addEventListener("keyup", answerScanning);
document.addEventListener("keydown", answerScanning)
window.addEventListener("load", answerScanning);

button.addEventListener("click", ()=>{
    localStorage.removeItem("question");
    localStorage.setItem("timeData", 1)

    // Очистити всі відповіді из localstorage
    answerInputList.forEach((input, index) => {
        localStorage.removeItem(`answer-${index}`);
    });

    let ticks = document.querySelectorAll(".tick-circle")

    let type = localStorage.getItem("type");
    
    answers = "";

    if (type == "one-answer" || type=="many-answers"){
        answerInputList.forEach((input, index) => {
            let ParentTag = input.parentNode
            const checkImageCreate = ParentTag.querySelector(".for-image")
            if (input.checkVisibility()){
                // Очистка от переносов строк
                let cleanValue = input.value.replace(/(\r\n|\n|\r)/gm, " ");

                if (input.value != ''){
                    if (ticks[index].style.display == "flex"){
                    answers += `(?%+${cleanValue}+%?)`;
                    }else{
                        answers += `(?%-${cleanValue}-%?)`;
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
    }else if(type == "input-gap"){
        let data = localStorage.getItem("input-data")
        let arrayData = data.split(" ")
        arrayData.forEach(data => {
            answers += `(?%+${data}+%?)`;
        })
        localStorage.removeItem("input-data")
    }


    let questions = question.value;
    let timeC = document.getElementById("time-text").dataset.time;

    let newType = localStorage.getItem("type");
    if (document.cookie.match("questions") != null){
        let questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        if (questionCookie && questionCookie != ""){
            questions = questionCookie + "?%?" + questions;
        }

        let timeCookie = document.cookie.split("time=")[1].split(";")[0];
        if (timeCookie && timeCookie != ""){
            timeC = timeCookie + "?#?" + document.getElementById("time-text").dataset.time;
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
    answers = "";

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
        document.getElementById("time-text").textContent = liLists[parseInt(timedata)].textContent;
        document.getElementById("time-text").dataset.time = liLists[parseInt(timedata)].dataset.time;

        const imgUrl = document.getElementById("time-text").dataset.img;

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