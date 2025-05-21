function CHnageName(){
    document.querySelector(".change-name-form").style.display = "flex";
    document.querySelector(".change-name").style.display = "none";
}

let DeleteButtons = document.querySelectorAll(".button-delete");

for (let delbutton of DeleteButtons) {
    delbutton.addEventListener("click", function (event) {
        // отримуємо навзу питання та його відповіді
        let name_question = delbutton.classList[1];
        let answers = `(?%${delbutton.dataset.answers}`

        let index_question = delbutton.dataset.number_question;
        console.log(index_question);
        // отримуємо дату з cookie
        let date = document.cookie.split("questions=")[1].split(";")[0];
        let questions = date.split("?%?");
        let answersdate = document.cookie.split("answers=")[1].split(";")[0];
        let answersclear = answersdate.split("?@?");
        let questiontimes = document.cookie.split("time=")[1].split(";")[0];
        let cleartime = questiontimes.split("?#?")

        // видаляємо питання зі змінної questions за індексом index_question
        questions.splice(index_question, 1);
        console.log(questions.length);
        
        // видаляємо відповіді зі змінної answersclear за індексом index_question
        answersclear.splice(index_question, 1);
        console.log(answersclear);

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


window.addEventListener("load", function () {
    // отримуэмо дані з cookie
    // отримуємо дату з cookie
    let date = document.cookie.split("questions=")[1].split(";")[0];
    let questions = date.split("?%?");
    let answersdate = document.cookie.split("answers=")[1].split(";")[0];
    let answersclear = answersdate.split("?@?");
    let questiontimes = document.cookie.split("time=")[1].split(";")[0];
    let cleartime = questiontimes.split("?#?")

    console.log(questions);
    console.log(answersclear);

    document.cookie = "questions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    for (let data of questions){
        if (data == '') {
            // якщо питання пусте, то видаляємо його з масиву
            questions.splice(questions.indexOf(data), 1);
        }
    }

    for (let data of answersclear){
        if (data == '') {
            // якщо питання пусте, то видаляємо його з масиву
            answersclear.splice(answersclear.indexOf(data), 1);
        }
    }

    for (let time of cleartime){
        if (time == ''){
            cleartime.splice(cleartime.indexOf(time), 1);
        }
    }

    document.cookie = `questions=${questions.join("?%?")}; path=/;`;
    document.cookie = `answers=${answersclear.join("?@?")}; path=/;`;
    document.cookie = `time=${cleartime.join("?#?")}; path=/;`;
})