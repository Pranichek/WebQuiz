const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let answers;
let questions;

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
    questions = question.value;
    if (document.cookie.match("questions") != null){
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];

        console.log("questionCookie =", questionCookie);
        questions = questionCookie + "?%?" + questions;
        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        answers = answerCookie + "?@?" + answers;
    }
    questions = questions.replace("undefined", "");
    questions = questions.replace("questions", "");
    questions = questions.replace("null", "");
    document.cookie = `questions=${questions}; path=/;`;
    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;
})