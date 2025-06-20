localStorage.setItem('time_question', 'set');


function CHnageName(){
    document.querySelector(".change-name-form").style.display = "flex";
    document.querySelector(".change-name").style.display = "none";
}

let DeleteButtons = document.querySelectorAll(".button-delete");

for (let delbutton of DeleteButtons) {
    delbutton.addEventListener("click", function (event) {
        // отримуємо навзу питання та його відповіді
        // отримуємо індекс кнопки на яку натиснули
        let index_question = parseInt(delbutton.value);
        console.log(index_question, "index")

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

        // видаляємо питання зі змінної questions за індексом index_question
        questions.splice(index_question, 1);

        
        // видаляємо відповіді зі змінної answersclear за індексом index_question
        answersclear.splice(index_question, 1);

        cleartime.splice(index_question, 1)

        if (questions[0] == '') {
            questions = [];
            answersclear = [];
            cleartime = [];
        }

        // повністю очищуємо cookie
        document.cookie = "questions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // записуємо нові cookie
        document.cookie = `questions=${questions.join("?%?")}; path=/;`;
        document.cookie = `answers=${answersclear.join("?@?")}; path=/;`;
        document.cookie = `time=${cleartime.join("?#?")}; path=/;`;

        // перезавантажуємо сторінку
        location.reload();
    });
}

// Функція, яка видаляє непотрібне питання із cookie при заванатажені сторінки
// window.addEventListener("load", function () {
//     // отримуэмо дані з cookie
//     // отримуємо дату з cookie
//     let cookies = document.cookie.match("questions")

//     if (cookies){
//         // Беремо дані із cookie, але із спецальними розділовими знаками
//         let date = document.cookie.split("questions=")[1].split(";")[0];
//         // Використовуємо функцію split, щоб отримати чисті дані із cookie
//         let questions = date.split("?%?");

//         // Беремо дані із cookie, але із спецальними розділовими знаками
//         let answersdate = document.cookie.split("answers=")[1].split(";")[0];
//         // Використовуємо функцію split, щоб отримати чисті дані із cookie
//         let answersclear = answersdate.split("?@?");

//         // Беремо дані із cookie, але із спецальними розділовими знаками
//         let questiontimes = document.cookie.split("time=")[1].split(";")[0];
//         // Використовуємо функцію split, щоб отримати чисті дані із cookie
//         let cleartime = questiontimes.split("?#?")

//         console.log(questions);
//         console.log(answersclear);

//         // Видаляємо старі cookie у яких зберігається непотрібне нам пусте питання
//         document.cookie = "questions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie = "answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         document.cookie = "time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//         for (let data of questions){
//             if (data == '') {
//                 // якщо питання пусте, то видаляємо його з масиву
//                 questions.splice(questions.indexOf(data), 1);
//             }
//         }

//         for (let data of answersclear){
//             if (data == '') {
//                 // якщо питання пусте, то видаляємо його з масиву
//                 answersclear.splice(answersclear.indexOf(data), 1);
//             }
//         }

//         for (let time of cleartime){
//             if (time == ''){
//                 cleartime.splice(cleartime.indexOf(time), 1);
//             }
//         }

//         document.cookie = `questions=${questions.join("?%?")}; path=/;`;
//         document.cookie = `answers=${answersclear.join("?@?")}; path=/;`;
//         document.cookie = `time=${cleartime.join("?#?")}; path=/;`;
//     }
//     }   
// )


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
            // Your code here
            event.preventDefault();
        });
    }
  });

window.addEventListener(
    'load',
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