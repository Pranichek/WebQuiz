const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const inputImg = document.getElementById("imdInput");
let answers;
let questions;
let timeC;
let imageC;

button.addEventListener("click", ()=>{
    console.log(document.cookie.match("questions"))
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
    imageC = inputImg.value
    questions = question.value;
    if (document.cookie.match("questions") != null){
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        console.log("questionCookie =", questionCookie);
        questions = questionCookie + "?%?" + questions;

        timeCookie = document.cookie.split("time=")[1].split(";")[0];
        timeC = timeCookie + "?#?" + timeP.textContent;
        console.log("time =", timeC);

        imgCookie = document.cookie.split("images=")[1].split(";")[0];
        imageC = imgCookie + "?&?" + inputImg.value;

        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        answers = answerCookie + "?@?" + answers;
    } else{
        timeC = timeP.textContent;
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

    imageC = imageC.replace("undefined", "");
    imageC = imageC.replace("questions", "");
    imageC = imageC.replace("null", "");
    document.cookie = `images=${imageC}; path=/;`;

    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;
})