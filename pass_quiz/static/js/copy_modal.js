// const socket = io();

let buttonCopy = document.querySelector(".copy-result")
let modalResult = document.querySelector(".copy-coint")

let testId2 = localStorage.getItem("test_id");
buttonCopy.addEventListener(
    'click',
    () => {
        modalResult.classList.remove("fade-out")
        modalResult.classList.add("fade-in")

        socket.emit('copy_result', {
            uncorrect_answers: document.querySelector(".uncorrect-answers").textContent,
            correct_answers: document.querySelector(".correct-answers").textContent,
            midle_time: document.querySelector(".midle-time").textContent,
            wasted_time: localStorage.getItem("wasted_time"),
            accuracy: document.querySelector(".text-perc p").textContent,
            test_id: testId2
        })

        setTimeout(() => {
            modalResult.classList.remove("fade-in")
            modalResult.classList.add("fade-out")
        }, 2000);
    }
)