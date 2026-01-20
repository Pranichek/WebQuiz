document.querySelector(".leave_test").addEventListener(
    'click',
    () => {
        socket.emit(
            'leave_test',
            {
                room: localStorage.getItem("room_code"),
                id_user: localStorage.getItem("")
            }
        )

        location.replace("/")
    }
)



// когда ментор досрочно завершает тест
socket.on("last-end", 
    (data) => {
        localStorage.setItem('time_question', "set")
        console.log(data.index)
        console.log(data.max_questions)
        for (let index = data.index; index < data.max_questions; index++){
            let chekcookies = localStorage.getItem("users_answers")
            if (chekcookies){
                // отримуємо старі відповіді якщо вони були
                let oldCookie = localStorage.getItem("users_answers")
                let cookieList = oldCookie.split(",")   
                cookieList.push("∅")

                localStorage.setItem("users_answers", cookieList)
            }else{
                localStorage.setItem("users_answers", "∅")
            }

        }
        
        console.log(localStorage.getItem("users_answers"), "klmdklsfvlkdfvlkdsfklmlkm")

        let midletime = localStorage.getItem("wasted_time")
        
        let stored = localStorage.getItem("users_answers");

        
        let answers = stored.split(",");
        let lastAnswers = answers[answers.length - 1];
        socket.emit(
            'answered',
            {
                code: localStorage.getItem("room_code"), 
                total_time: localStorage.getItem("default_time"), 
                wasted_time: midletime,
                right_answered: "not",
                id_test: localStorage.getItem("test_id"),
                index:localStorage.getItem("index_question"),
                lastanswers: lastAnswers,
                users_answers: localStorage.getItem("users_answers"),
                finish: true
            }
        )

        let index = localStorage.getItem("index_question")
        index = parseInt(index) + 1;
        localStorage.setItem("index_question", index)

        midletime = parseInt(midletime) + parseInt(localStorage.getItem("timeData"))
        localStorage.setItem("wasted_time", midletime);

        localStorage.setItem("timeData", "0")
    }
)

socket.on("finish_student",
    () => {
        location.replace("/questions")
    }
)