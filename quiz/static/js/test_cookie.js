localStorage.setItem('time_question', 'set');
localStorage.setItem('index_question', '0');
localStorage.setItem('users_answers', '')
// локал стордже где сохраняем время которое потратили на тест
localStorage.setItem("wasted_time", '0');
// локал стордже где сохраняем время которое человек потратил на один вопрос
localStorage.setItem("timeData", '0');

let buttonplay = document.querySelector(".play_test")
let formPLay = document.querySelector("#play-form")

buttonplay.addEventListener(
    'click',
    () => {
        // document.cookie = `test_id=${buttonplay.value}; path=/;`;
        localStorage.setItem("test_id", buttonplay.value)

        history.pushState(null, "", location.href);
        window.onpopstate = function () {
        history.pushState(null, "", location.href);
        };
        // const newTab = window.open("/passig_test", "_blank");
        window.location.replace('/passig_test');
    }
)

window.addEventListener(
    'load',
    () => {
        document.cookie = `time_question=set; path=/;`;
    }
)