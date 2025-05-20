// беремо за класом save кнопку, яка зберігає питання та відповіді в cookie
const button = document.getElementById("save");
// Беремо інпут поле де написано питання
const question = document.querySelector("#question");
// Беремо всі інпут поля з відповідями
let answerInputList = document.querySelectorAll(".answer");
// СТворюэмо змінні для зберігання cookie
let answers;
let questions;

// Перевіряємо чи натиснули на кнопку додати питання 
button.addEventListener("click", ()=>{
    // Якщо існує такий cookie 
    console.log(document.cookie.match("questions"))

    // Робимо перебір по списку з відповідями
    for (let input of answerInputList){
        // Якщо інпут поле видиме(за допомогою css)
        if (input.checkVisibility()){
            console.log(input.value);
            // Якщо інпут поле має клас correct, то добавляємо до answers правильну відповідь
            // Якщо інпут поле не має клас correct, то добавляємо до answers неправильну відповідь
            if (input.classList.contains("correct")){
                console.log("right:", input.value);
                answers += `(?%+${input.value}+%?)`;
            }else{
                console.log("wrong:", input.value);
                answers += `(?%-${input.value}-%?)`;
            }
        }
    }
    // Створюємо змінну де зберігається питання
    questions = question.value;
    // Якщо питання не пусте
    if (document.cookie.match("questions") != null){
        // Ми отримуємо значення cookie за ключем questions
        questionCookie = document.cookie.split("questions=")[1].split(";")[0];

        console.log("questionCookie =", questionCookie);
        
        // З'єднуємо старе значення cookie (старі питання) з новим
        questions = questionCookie + "?%?" + questions;
        // Ми отримуємо значення cookie за ключем answers
        answerCookie = document.cookie.split("answers=")[1].split(";")[0];
        // З'єднуємо старе значення cookie (старі відповіді) з новим
        answers = answerCookie + "?@?" + answers;
    }
    // Якщо до cookies потрапили не потрібні дані то замінюємо їх на пусті
    questions = questions.replace("undefined", "");
    questions = questions.replace("questions", "");
    questions = questions.replace("null", "");
    // / - 

    document.cookie = `questions=${questions}; path=/;`;
    answers = answers.replace("undefined", "");
    answers = answers.replace("answers", "");
    answers = answers.replace("null", "");
    console.log("answers =", answers);
    document.cookie = `answers=${answers}; path=/;`;
    answers = null;
})