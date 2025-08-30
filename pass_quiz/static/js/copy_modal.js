// const socket = io();
import { ShowMessage } from '/static/js/showMessage.js';


let buttonCopy = document.querySelector(".copy-result")

let testId2 = localStorage.getItem("test_id");

buttonCopy.addEventListener(
    'click',
    () => {
        console.log(12)
        socket.emit('copy_result', {
            uncorrect_answers: document.querySelector(".uncorrect-answers").textContent,
            correct_answers: document.querySelector(".correct-answers").textContent,
            midle_time: document.querySelector(".midle-time").textContent,
            wasted_time: localStorage.getItem("wasted_time"),
            accuracy: localStorage.getItem("accuracy"),
            test_id: testId2,
            mark: document.querySelector(".mark").textContent
        })

        ShowMessage("Ваші результати скопiйованi, ви можете їми поділитися")
    }
)


