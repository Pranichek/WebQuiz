const socket = io();


localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set');
localStorage.setItem("need_rolad", "True");

const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");


const playAgain = document.querySelector(".play_again");

socket.emit("finish_test", {
    users_answers: usersAnswers, 
    test_id: testId,
    wasted_time: localStorage.getItem("wasted_time")
});


socket.on("test_result", (data) => {
    playAgain.value = data.test_id;

    document.querySelector(".uncorrect-answers").textContent = data.uncorrect_answers;
    document.querySelector(".correct-answers").textContent = data.right_answers;
    document.querySelector(".mark").textContent = data.mark;

    if (parseInt(data.mark) == 1){
        document.querySelector(".text-mark").textContent = "бал"
    }else if(parseInt(data.mark) > 1 && parseInt(data.mark) < 5){
        document.querySelector(".text-mark").textContent = "бали"
    }else if(parseInt(data.mark) > 4 || parseInt(data.mark) == 0){
        document.querySelector(".text-mark").textContent = "балів"
    }

    if (data.count_answered == 0) {
        document.querySelector(".wasted_time").textContent = "0";
    } else {
        let midleTime = localStorage.getItem("wasted_time") / data.count_answered;
        midleTime = midleTime.toFixed(0);
        document.querySelector(".midle-time").textContent = midleTime
    }

    localStorage.setItem("accuracy", data.accuracy);
    const fill = document.querySelector(".fill");
    const textPerc = document.querySelector(".text-perc p");
    const quard = document.querySelector(".quard");


    if (fill) {
        fill.style.transition = "none";
        fill.style.width = "0%";
        // Триггерим перерисовку
        void fill.offsetWidth;
        fill.style.transition = "width 1s ease-in-out";
        fill.style.width = Math.round(data.accuracy) + "%";
    }
    if (quard) {
        if (data.accuracy != 0){
            quard.style.left = `calc(${Math.round(data.accuracy)}% - 2.5vw)`;

        }
    }
    if (textPerc) {
        textPerc.textContent = "0%!";
        let current = 0;
        const target = Math.round(data.accuracy);
        const interval = setInterval(() => {
            if (current < target) {
                current++;
                textPerc.textContent = `${current}%!`;
            } else {
                clearInterval(interval);
            }
        }, 15);
    }


});

playAgain.addEventListener("click", () => {
    window.location.replace(`/test_data?id_test=${playAgain.value}`);
});

