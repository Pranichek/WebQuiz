const socket = io() 

const textCode = document.querySelector(".code-text")
textCode.textContent = localStorage.getItem("room_code")

let stored = localStorage.getItem("users_answers"); [0, "kjndfkjn"]
let answers = stored.split(",")
let lastAnswers = answers[answers.length - 1]

socket.emit(
    "get_data",
    {   
        lastanswers: lastAnswers,
        id_test: localStorage.getItem("test_id"), 
        index_question: localStorage.getItem("index_question"),
        users_answers: localStorage.getItem("users_answers")

    }
)


socket.on("page_result",
    data => {
        window.location.replace("/result_student")
    }
)

socket.on("show_data",
    data => {
        const cont = document.querySelector(".answer1")

        if (data["image"] != "not"){
            const img = document.createElement("img")
            img.src = data["image"]
            img.style.width = "50%"
            img.style.height = "100%"
            
            cont.appendChild(img)
        }
        
        const question = document.createElement("p")
        question.textContent = data.question

        document.querySelector(".answer1").appendChild(question)
        
        // отображение выбранных вариантов ответов
        const typeQuestion = data.type_question
        const answers = data.answers.split()
        let container = document.querySelector(".answers")
        
        container.innerHTML = ""
        if (typeQuestion != "input-gap"){
            let count = 0
            let maxheight = 100

            
            for (let answer of answers){
                count++
                const outline = document.createElement("div")
                outline.className = "answer2"

                const checkmark = document.createElement("div")
                checkmark.className = "checkmark-answer"

                const chosenAnswer = document.createElement("span")
                chosenAnswer.textContent = answer

                outline.appendChild(checkmark)
                outline.appendChild(chosenAnswer)

                container.appendChild(outline)
            }

            if (count > 2){
                maxheight = 40
            }

        
        }
        
        else{
            const answerOutline = document.createElement("div")
            answerOutline.className = "outline"

            const chosenAnswer = document.createElement("p")
            chosenAnswer.textContent = answers[0]

            answerOutline.appendChild(chosenAnswer)
            container.appendChild(answerOutline)
        }

    }
)



