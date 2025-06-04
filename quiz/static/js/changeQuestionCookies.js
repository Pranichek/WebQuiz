// const button = document.getElementById("save");
// const question = document.querySelector("#question");
// let answerInputList = document.querySelectorAll(".answer");
// let timeP = document.querySelector(".timer-p");
// const inputImg = document.getElementById("imgInput");
// const pk = document.getElementById("pk").textContent
// let answers;
// let questions;
// let timeC;
// let imageC;

// button.addEventListener("click", ()=>{
//     console.log(document.cookie.match("questions"))
//     for (let input of answerInputList){
//         if (input.checkVisibility()){
//             console.log(input.value);
//             if (input.classList.contains("correct")){
//                 console.log("right:", input.value);
//                 answers += `(?%+${input.value}+%?)`;
//             }else{
//                 console.log("wrong:", input.value);
//                 answers += `(?%-${input.value}-%?)`;
//             }
//         }
//     }
//     answers = answers.replace("undefined", "");
//     answers = answers.replace("answers", "");
//     answers = answers.replace("null", "");

//     questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
//     questionCookie[pk] = question.value;
//     questionCookie = questionCookie.join("?%?")

//     timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
//     // timeC = timeP.textContent
//     timeC = timeP.dataset.time;
//     timeC = timeC.replace("⏱ ", "");
//     timeC = timeC.replace(" ˅", "");
//     timeCookie[pk] = timeC;
//     timeCookie = timeCookie.join("?#?")


//     answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
//     answerCookie[pk] = answers;
//     answerCookie = answerCookie.join("?@?")

//     document.cookie = `questions=${questionCookie}; path=/;`;

//     document.cookie = `time=${timeCookie}; path=/;`;

//     // document.cookie = `images=${imgCookie}; path=/;`;

//     document.cookie = `answers=${answerCookie}; path=/;`;
//     answers = null;
// })


// window.addEventListener(
//     'DOMContentLoaded',
//     () => {
//         console.log(document.querySelector("#time").dataset.time, "sd")
//         document.querySelector("#time").textContent = `⏱ ${document.querySelector("#time").dataset.time} секунд ˅`;
//     }
// )

const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const inputImg = document.getElementById("imgInput");
const pk = document.getElementById("pk").textContent;
let answers;
let questions;
let timeC;
let imageC;
let validAnswersFlag = false;

function buttonColorChanging(){
    if (button.type == "button"){
        button.classList.add("grey");
    }
}

function answerScanning(){
    validAnswersFlag = true;
    let filledCount = 0;

    for (let input of answerInputList){
        if (input.checkVisibility()){
            if (input.value.trim() === ""){
                validAnswersFlag = false;
            } else {
                filledCount++;
            }
        }
    }

    if (!validAnswersFlag || filledCount < 2 || question.value.trim() === ""){
        button.type = "button";
        button.classList.add("grey");
        button.classList.remove("purple");
    } else {
        button.type = "submit";
        button.classList.remove("grey");
        button.classList.add("purple");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buttonColorChanging();
    answerScanning();
});
document.addEventListener("click", () => {
    buttonColorChanging();
    answerScanning();
});
document.addEventListener("keydown", () => {
    buttonColorChanging();
});
document.addEventListener("keyup", () => {
    answerScanning();
});

button.addEventListener("click", () => {
    if (button.type !== "submit") return;  

    for (let input of answerInputList){
        if (input.checkVisibility()){
            if (input.value != ""){
                if (input.classList.contains("correct")){
                    answers += `(?%+${input.value}+%?)`;
                } else {
                    answers += `(?%-${input.value}-%?)`;
                }
            }
        }
    }

    answers = answers?.replace("undefined", "").replace("answers", "").replace("null", "");

    questionCookie = document.cookie.split("questions=")[1].split(";")[0].split("?%?");
    questionCookie[pk] = question.value;
    questionCookie = questionCookie.join("?%?");

    timeCookie = document.cookie.split("time=")[1].split(";")[0].split("?#?");
    timeC = timeP.dataset.time.replace("⏱ ", "").replace(" ˅", "");
    timeCookie[pk] = timeC;
    timeCookie = timeCookie.join("?#?");

    answerCookie = document.cookie.split("answers=")[1].split(";")[0].split("?@?");
    answerCookie[pk] = answers;
    answerCookie = answerCookie.join("?@?");

    document.cookie = `questions=${questionCookie}; path=/;`;
    document.cookie = `time=${timeCookie}; path=/;`;
    document.cookie = `answers=${answerCookie}; path=/;`;
    answers = null;
});

// ⏱ Встановлення тексту таймера
window.addEventListener("DOMContentLoaded", () => {
    let tickCircleList = document.querySelectorAll(".tick-circle");

    for (let tickCirle of tickCircleList){
        if (tickCirle.style.display !== "none"){
            tickCirle.click();
            console.log("22")
        }
    }
    document.querySelector("#time").textContent = `⏱ ${document.querySelector("#time").dataset.time} секунд ˅`;
});
