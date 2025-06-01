localStorage.setItem('time_question', 'set');
localStorage.setItem('index_question', '0');
localStorage.setItem('users_answers', '')

let buttonplay = document.querySelector(".play_test")
let formPLay = document.querySelector("#play-form")

buttonplay.addEventListener(
    'click',
    () => {
        // document.cookie = `test_id=${buttonplay.value}; path=/;`;
        localStorage.setItem("test_id", buttonplay.value)
        formPLay.submit();
    }
)

window.addEventListener(
    'focus',
    () => {
        // let userAnswers = document.cookie.match("users_answers")

        // if (userAnswers){
            // очищаем cookie users_answers
        // document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        // document.cookie = "time_question=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        // // document.cookie = "time_question=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        // document.cookie = `time_question=set; path=/;`;
        // }
    }
)

window.addEventListener(
    'load',
    () => {
        document.cookie = `time_question=set; path=/;`;
    }
)