localStorage.setItem('time_question', 'set');


function CHnageName(){
    document.querySelector(".change-name-form").style.display = "flex";
    document.querySelector(".change-name").style.display = "none";
}

let DeleteButtons = document.querySelectorAll(".button-delete");
let index_question;


for (let delbutton of DeleteButtons) {
    delbutton.addEventListener("click", function (event) {
        document.querySelector(".window-choice").style.display = "flex";
        // отримуємо навзу питання та його відповіді
        // отримуємо індекс кнопки на яку натиснули
        index_question = parseInt(delbutton.value);
    });
}

document.querySelector(".decline").addEventListener("click", () => {
    document.querySelector(".window-choice").style.display = "none";
});

document.querySelector(".remove_question").addEventListener("click", () => {
    if (index_question !== undefined) {

        // console.log(index_question);
        // отримуємо дату з cookie
        let date = document.cookie.split("questions=")[1].split(";")[0];
        // Використовуємо функцію split, щоб отримати чисті дані із cookie
        let questions = date.split("?%?");

        let answersdate = document.cookie.split("answers=")[1].split(";")[0];
        // Використовуємо функцію split, щоб отримати чисті дані із cookie
        let answersclear = answersdate.split("?@?");

        let questiontimes = document.cookie.split("time=")[1].split(";")[0];
        // Використовуємо функцію split, щоб отримати чисті дані із cookie
        let cleartime = questiontimes.split("?#?")

        let typesQuestions = document.cookie.split("typeQuestions=")[1].split(";")[0];
        let cleartypesQuestions = typesQuestions.split("?$?")

        // видаляємо питання зі змінної questions за індексом index_question
        questions.splice(index_question, 1);
        
        // видаляємо відповіді зі змінної answersclear за індексом index_question
        answersclear.splice(index_question, 1);

        cleartime.splice(index_question, 1)

        cleartypesQuestions.splice(index_question, 1)

        if (questions[0] == '') {
            questions = [];
            answersclear = [];
            cleartime = [];
            cleartypesQuestions = [];
        }

        // повністю очищуємо cookie
        document.cookie = "questions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "typeQuestions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // записуємо нові cookie
        document.cookie = `questions=${questions.join("?%?")}; path=/;`;
        document.cookie = `answers=${answersclear.join("?@?")}; path=/;`;
        document.cookie = `time=${cleartime.join("?#?")}; path=/;`;
        document.cookie = `typeQuestions=${cleartypesQuestions.join("?$?")}; path=/;`;

        // перезавантажуємо сторінку
        location.reload();
    }
});



let InputName = document.querySelector(".test-title-input")
let ButtonName = document.querySelector(".set-name")


InputName.addEventListener(
    'input',
    () => {
        saveName();
    }
)

ButtonName.addEventListener(
    'click',
    () => {
        InputName.disabled = false;
        InputName.focus();
    }
)

function saveName(){
    let valueinput = InputName.value;
    let cookies = document.cookie.match("inputname")
    if (cookies){
        document.cookie = "inputname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    document.cookie = `inputname=${valueinput}; path=/;`;
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let cookies = document.cookie.match("inputname")
        // answers=djshfuidh;inputname=dkklfl;session=njdn;
        if (cookies){
            let cookiename = document.cookie.split("inputname=")[1].split(";")[0];
            if (cookies){
                InputName.value = cookiename
            }
        }
    }
)

// Фнкція, яка перевіряє чи натиснули мишку
document.body.onmouseup = function() { 
    if (InputName != document.activeElement){
        InputName.disabled = true;
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      // КОд який при натискані кнопки enter буде працювати
      InputName.disabled = true;
      document.getElementById('main-form').addEventListener('submit', function(event) {
            event.preventDefault();
        });
    }
  });

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let AvatarImage = document.querySelector(".avatar")
        
        console.log("AvatarImage.dataset.size =", AvatarImage.dataset.size)
        // подгружаем размер картинки тот что установил пользователь
        AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
        AvatarImage.style.height = `${AvatarImage.dataset.size}%`;
    }
)



// КОд який під час відправки даних input title_test робить не disabled, щоб модна було відправити дані
document.getElementById("main-form").addEventListener("submit", function () {
    const input = document.querySelector(".test-title-input");
    input.disabled = false;
});

setInterval(myFunction, 1000);

function myFunction() {
    // если чел удалил куки ответов то отчищаем вопросы в куки
    check_answers_cookie = document.cookie.match("answers")
    if (!check_answers_cookie){
        document.cookie = "questions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // this.location.reload();
    }
}