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

socket.on("upload_data",
    () => {
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
    }
)

// когда кикают с комнаті
socket.on("leave_user",
    data => {
        if (parseInt(data["id"]) == parseInt(document.querySelector(".id").dataset.id)){
            window.location.replace("/")
        }
    }
)

socket.on("show_data",
    data => {

        // диаграмы
        // подготовка зон для дл отображения информации взависимости от типа вопроса
        const topData = document.querySelector(".top-data")
        topData.innerHTML = ""


        if (data.type_question == "one-answer" || data.type_question == "many-answers"){
            // <div class="diagram">
            //     <div class="text-diagram">Прогресс учнів: </div>
            //     <div class="diagram-informations">
            //         <!-- <div class="line"></div> -->

            //         <div class="blocks">

            //         </div>
            //     </div>
            // </div>
            // <div class="variants">

            // </div>

            const divDiagram = document.createElement("div")
            divDiagram.className = "diagram"

            const diagramInfo = document.createElement("div")
            diagramInfo.className = "diagram-informations"

            const line = document.createElement("div")
            line.className = "line"
            diagramInfo.appendChild(line)

            const divBlocks = document.createElement("div")
            divBlocks.className = "blocks"

            diagramInfo.appendChild(divBlocks)
            divDiagram.appendChild(diagramInfo)
            

            const divVariants = document.createElement("div")
            divVariants.className = "variants"

            topData.appendChild(divDiagram)
            topData.appendChild(divVariants)

        }else if(data.type_question == "input-gap"){
            // <div class="outline-input-gap">
            //     <p class="question">How many oenis do you have?</p>
            //     <div class="right-answers">
            //         <p class="right-text">Правильні відповіді:</p>
            //     </div>
            // </div>

            const outlineInput = document.createElement("div")
            outlineInput.className = "outline-input-gap"

            const questionDiv = document.createElement("div")
            questionDiv.className = "question"

            const paragraph = document.createElement("p")
            paragraph.className = "question-text"
            paragraph.textContent = data.text_question

            questionDiv.appendChild(paragraph)
            
            if (data.image_url != "not"){
                const img = document.createElement("img")
                img.src = document.getElementById("arrow-img-path").dataset.src
                img.className = "arrow"
                paragraph.appendChild(img)

                const imageDiv = document.createElement("div");
                imageDiv.className = "imageCont"; 
                const imgq = document.createElement("img")
                imgq.src = data.image_url
                imgq.className = "questionImage"
                imageDiv.appendChild(imgq)

                questionDiv.style.flexDirection = "column"
                questionDiv.appendChild(imageDiv)

                let rotated = false
                img.addEventListener(
                    'click',
                    () => {
                        rotated = !rotated
                        img.style.transform = rotated ? "rotate(180deg)" : "rotate(0deg)"

                        if (rotated){
                            document.querySelector(".imageCont").classList.add("show")

                            paragraph.style.height = "40%"

                    

                            document.querySelector(".question").style.height = "55%"
                            document.querySelector(".right-answers").style.height = "35%"


                        }else{
                            document.querySelector(".imageCont").classList.remove("show")
                            paragraph.style.height = "100%"

                            document.querySelector(".question").style.height = "40%"
                            document.querySelector(".right-answers").style.height = "50%"
                        }
                    }
                )
            }

            const answers = document.createElement("div")
            answers.className = "right-answers"
            

            const rightText = document.createElement("p")
            rightText.textContent = "Правильні відповіді:"
            rightText.className = "right-text"

            const rightAnswers = document.createElement("p")
            rightAnswers.textContent = data.normal_answers.join("\n")
            rightAnswers.style.whiteSpace = "pre-line"

            answers.appendChild(rightText)
            answers.appendChild(rightAnswers)

            outlineInput.appendChild(questionDiv)
            outlineInput.appendChild(answers)

            topData.appendChild(outlineInput)

            // <p class="accuracy-students">Прогресс учнів: </p

        }


        // ------------- создание диаграм
        let answers = data.normal_answers
        console.log(answers)
        const cont = document.querySelector(".variants")

        let usersindexes = data.user_indexes.split("@")

        usersindexes.forEach((element, index) => {
            usersindexes[index] = parseInt(usersindexes[index])
        })
        
        usersindexes.sort((a, b) => a - b)
        
        let correctIndexes = data.correct_indexes
        if (data.type_question != "input-gap"){
            cont.innerHTML = ""
            let count = 0
            for (let answer of answers){
                const variantDiv = document.createElement("div")
                variantDiv.className = "variant"

                const variantOutline = document.createElement("div")
                variantOutline.className = "variant-outline"

                if (usersindexes.includes(count)){
                    if (correctIndexes.includes(count)){
                        variantOutline.classList.add("correct")
                    }else{
                        variantOutline.classList.add("uncorrect")
                    }
                }

                const paragraph = document.createElement("p")
                paragraph.className = "variant-text"
                paragraph.textContent = answer

                variantOutline.appendChild(paragraph)
                variantDiv.appendChild(variantOutline)
                cont.appendChild(variantDiv)

                count++
            }

            let variants = document.querySelectorAll("variant")
            let width = 100 / count
            for (let variant of variants){
                variant.style.width = `${width}%`
            }    

            // создание линий
            const linesCont = document.querySelector(".diagram-informations")
            let countLines = 0
            for (let i = 0; i <= data.users.length; i++){
                const line = document.createElement("div")
                line.className = "line"
                linesCont.appendChild(line)
                countLines++
            }

            const lines = document.querySelectorAll(".line")
            let height = 100 / countLines
            for (let line of lines){
                line.style.height = `${height}%`
            }

            document.querySelector(".diagram-informations").style.gap = `${height}%`

            // создание бащень ответов
            const blockCont = document.querySelector(".blocks")
            for (let i = 1; i <= data.normal_answers.length; i++) {
                const outlineBlock = document.createElement("div");
                outlineBlock.className = "block";

                const greenBlock = document.createElement("div");
                greenBlock.className = "block-diagram";
                greenBlock.style.height = "0%"; // старт с 0

                outlineBlock.appendChild(greenBlock);
                blockCont.appendChild(outlineBlock);

                // даём браузеру время вставить элемент, и только потом меняем высоту
                setTimeout(() => {
                    greenBlock.style.height = `${(height + 0.1) * parseInt(data.count_answers[i - 1])}%`;
                }, 50); 
            }
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



localStorage.setItem("flag_time", "true")


socket.on("next_question",
    data => {
        localStorage.setItem("index_question", data.index_question)
        window.location.replace("/passing_student")
    }
)
socket.on("end_test",
    data => {
        window.location.replace("/questions")
    }
)

