const socket = io() 

const textCode = document.querySelector(".code-text")
textCode.textContent = localStorage.getItem("room_code")

let stored = localStorage.getItem("users_answers"); 
let answers = stored.split(",")
let lastAnswers = answers[answers.length - 1]

socket.emit(
    "get_data",
    {   
        lastanswers: lastAnswers,
        id_test: localStorage.getItem("test_id"), 
        index_question: localStorage.getItem("index_question"),
        users_answers: localStorage.getItem("users_answers"),
        room_code: localStorage.getItem("room_code")
    }
)


socket.on("page_result",
    data => {
        window.location.replace("/result_student")
    }
)

socket.on("show_data",
    data => {
        // Очищаем контейнеры перед добавлением новых данных
        const cont = document.querySelector(".answer1");
        cont.innerHTML = "";
        document.querySelector(".answer1").style.justifyContent = "center"

        if (data["image"] !== "not") {
            const img = document.createElement("img");
            img.src = data["image"];
            img.style.width = "50%";
            img.style.height = "100%";
            document.querySelector(".answer1").style.justifyContent = "space-between"
            cont.appendChild(img);
        }

        const question = document.createElement("p");
        question.textContent = data.question;
        cont.appendChild(question);

        const typeQuestion = data.type_question;

        const answers = typeof data.answers === "string"
            ? data.answers.trim().split(" ").filter(a => a)
            : Array.isArray(data.answers) ? data.answers : [];

        const container = document.querySelector(".answers");
        container.innerHTML = "";
        container.style.justifyContent = "center";

        if (typeQuestion !== "input-gap") {
            let count = 0;
            let imgcount = 0;
            let maxheight = 100;
            let maxwidth = 45;
            let userIndexes = data.user_indexes.split("@")
            let correctIndexes = data.correct_indexes
            let imagesUrls = data.answers_images


            for (let answer of answers){
                

                const checkmark = document.createElement("div");
                checkmark.className = "checkmark-answer";

                const outline = document.createElement("div");
                outline.className = "answer2";

                let currentIndex = userIndexes[count];
                if (correctIndexes.includes(parseInt(currentIndex))){
                    outline.style.backgroundColor = "#BBE3B3";
                } else {
                    outline.style.backgroundColor = "rgba(246, 101, 103, 0.71)";
                }

                const chosenAnswer = document.createElement("span");
                chosenAnswer.textContent = answer;

                outline.appendChild(checkmark);
                outline.appendChild(chosenAnswer);

                
                if (imagesUrls[count] != "NOT") {
                    
                    const arrowBtn = document.createElement("div");
                    arrowBtn.className = "arrow-btn";

                    const arrowImg = document.createElement("img");
                    const arrowImgPath = document.getElementById("arrow-img-path").dataset.src;
                    arrowImg.src = arrowImgPath;
                    arrowImg.alt = "show";
                    arrowImg.style.transition = "transform 0.2s";
                    arrowImg.style.width = "2vh";
                    arrowImg.style.height = "2vh";
                    arrowBtn.appendChild(arrowImg);

                    outline.onclick = () => {
                        let imgBlock = outline.querySelector(".answer2with-image");
                        if (!imgBlock) {
                            imgBlock = document.createElement("div");
                            imgBlock.className = "answer2with-image";
                            imgBlock.style.backgroundColor = outline.style.backgroundColor;
                            const image = document.createElement("img");
                            image.src = imagesUrls[imgcount];
                            imgcount++;
                           
                            imgBlock.appendChild(image);
                            outline.appendChild(imgBlock);
                        }
                        const isOpen = imgBlock.classList.toggle("open");
                        arrowImg.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";

                    };


                    outline.appendChild(arrowBtn);
                }

                container.appendChild(outline);
                count++; 
            }

            if (count > 2) {
                maxheight = 40;
                container.style.justifyContent = "space-between";
            }  
            else if (count = 2) {
                maxheight = 100;

            }
        

            const blocks = document.querySelectorAll(".answer2");
            blocks.forEach((block) => {
                block.style.height = `${maxheight}%`;
                block.style.width = `${maxwidth}%`;
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

        // потраченное время на вопрос
        try {
            document.querySelector(".nickname-time").textContent = localStorage.getItem("question_time")
        } catch (error) {
            console.log(error)
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