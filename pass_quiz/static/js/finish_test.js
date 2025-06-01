localStorage.setItem('index_question', '0');
localStorage.setItem('time_question', 'set')
localStorage.setItem("need_rolad", "True")

const socket = io();

const usersAnswers = localStorage.getItem("users_answers");
const testId = localStorage.getItem("test_id");

socket.emit("finish_test", {
    users_answers: usersAnswers,
    test_id: testId
});

socket.on("test_result", (data) => {
    document.querySelector(".user_pimpa").innerHTML = `
        ${data.right_answers}`;
    document.querySelector(".user-pampa").innerHTML =`
        ${data.amount_questions}
    `;

    document.querySelector(".accuracy").innerHTML = `
        accuracy = ${data.accuracy}
    `;
});

window.addEventListener('popstate', function(event) {
    this.window.alert(3223)
})