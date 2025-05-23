const button = document.getElementById("save");
const question = document.querySelector("#question");
let answerInputList = document.querySelectorAll(".answer");
let timeP = document.querySelector(".timer-p");
const inputImg = document.getElementById("imgInput");
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

    if (document.cookie.match("questions") != null){
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];
        console.log("questionCookie =", questionCookie);
        questions = questionCookie + "?%?" + question.value;

        timeCookie = document.cookie.split("time=")[1].split(";")[0];
        timeC = timeCookie + "?#?" + timeP.textContent;
        console.log("time =", timeC);

        imgCookie = document.cookie.split("images=")[1].split(";")[0];
        imageC = imgCookie + "?&?" + inputImg.files[0].name;

        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        answers = answerCookie + "?@?" + answers;
    } else{
        timeC = timeP.textContent;
        questions = question.value;
        try{
            imageC = inputImg.files[0].name;
        }
        catch{
            imageC = "";
        }

    }
    console.log("imageC =", imageC)
    questions = questions.replace("undefined", "");
    questions = questions.replace("questions", "");
    questions = questions.replace("null", "");
    document.cookie = `questions=${questions}; path=/;`;

    timeC = timeC.replace("⏱ ", "");
    timeC = timeC.replace(" ˅", "");
    document.cookie = `time=${timeC}; path=/;`;

    document.cookie = `images=${imageC}; path=/;`;

    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;

})