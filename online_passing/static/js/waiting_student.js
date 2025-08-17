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
        console.log(data);

        // Очищаем контейнеры перед добавлением новых данных
        const cont = document.querySelector(".answer1");
        cont.innerHTML = "";

        // Картинка вопроса
        if (data["image"] !== "not") {
            const img = document.createElement("img");
            img.src = data["image"];
            img.style.width = "50%";
            img.style.height = "100%";
            cont.appendChild(img);
        }

        // Вопрос
        const question = document.createElement("p");
        question.textContent = data.question;
        cont.appendChild(question);

        // Ответы
        const typeQuestion = data.type_question;
        // Исправляем split
        const answers = typeof data.answers === "string"
            ? data.answers.trim().split(" ").filter(a => a)
            : Array.isArray(data.answers) ? data.answers : [];
        const container = document.querySelector(".answers");
        container.innerHTML = "";

        if (typeQuestion !== "input-gap") {
            let count = 0;
            let maxheight = 100;
            for (let answer of answers) {
                count++;
                const checkmark = document.createElement("div");
                checkmark.className = "checkmark-answer";

                const outline = document.createElement("div");
                outline.className = "answer2";

                const chosenAnswer = document.createElement("span");
                chosenAnswer.textContent = answer;

                outline.appendChild(checkmark);
                outline.appendChild(chosenAnswer);

                container.appendChild(outline);
            }

            if (count > 2) {
                maxheight = 40;
            }

            const blocks = document.querySelectorAll(".answer2");
            blocks.forEach((block) => {
                block.style.height = `${maxheight}%`;
            });
        } else {
            const answerOutline = document.createElement("div");
            answerOutline.className = "outline";

            const chosenAnswer = document.createElement("p");
            chosenAnswer.textContent = answers[0] || "";

            answerOutline.appendChild(chosenAnswer);
            container.appendChild(answerOutline);
        }

        // Точность
        const accuracyRateText = document.querySelector(".text-perc p");
        if (accuracyRateText) {
            accuracyRateText.textContent = `Точність: ${Math.round(data.accuracy)}%`;
        }

        // Правильные/неправильные ответы
        const rightBlock = document.querySelector(".right");
        const wrongBlock = document.querySelector(".wrong");
        if (rightBlock) rightBlock.textContent = `${data.right_answers} вірно!`;
        if (wrongBlock) wrongBlock.textContent = `${data.uncorrect_answers} невірно`;

        // Прогресс-бар точности
        const fill = document.querySelector(".fill");
        const textPerc = document.querySelector(".text-perc p");
        const quard = document.querySelector(".quard");

        // Сброс анимации
        if (fill) {
            fill.style.transition = "none";
            fill.style.width = "0%";
            // Триггерим перерисовку
            void fill.offsetWidth;
            fill.style.transition = "width 1s ease-in-out";
            fill.style.width = Math.round(data.accuracy) + "%";
        }
        if (quard) {
            quard.style.left = `calc(${Math.round(data.accuracy)}% - 2.5vw)`;
        }
        if (textPerc) {
            textPerc.textContent = "0% точностi !";
            let current = 0;
            const target = Math.round(data.accuracy);
            const interval = setInterval(() => {
                if (current < target) {
                    current++;
                    textPerc.textContent = `${current}% точностi !`;
                } else {
                    clearInterval(interval);
                }
            }, 15);
        }
    }
)