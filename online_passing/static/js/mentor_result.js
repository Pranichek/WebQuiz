const socket = io()

localStorage.setItem("flag_time", "true")

document.querySelector(".code-room").textContent = localStorage.getItem("room_code")

socket.emit(
    'users_results',
    {
        room: localStorage.getItem("room_code"), 
        test_id: localStorage.getItem("test_id"),
        index_question: localStorage.getItem("index_question")
    }
)



socket.on("list_results",
    user_list => {  
        // подготовка зон для дл отображения информации взависимости от типа вопроса
        const topData = document.querySelector(".top-data")
        topData.innerHTML = ""
        const usersRatings = document.querySelector(".users-ratings")
        usersRatings.innerHTML = ""

        if (user_list.type_question == "one-answer" || user_list.type_question == "many-answers"){
            topData.style.height = "40%"
            usersRatings.style.height = "58%"
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

            const textDiagram = document.createElement("p")
            textDiagram.textContent = "Прогресс учнів:"
            textDiagram.className = "text-diagram"

            const diagramInfo = document.createElement("div")
            diagramInfo.className = "diagram-informations"

            const line = document.createElement("div")
            line.className = "line"
            diagramInfo.appendChild(line)

            const divBlocks = document.createElement("div")
            divBlocks.className = "blocks"

            divDiagram.appendChild(textDiagram)
            diagramInfo.appendChild(divBlocks)
            divDiagram.appendChild(diagramInfo)
            

            const divVariants = document.createElement("div")
            divVariants.className = "variants"

            topData.appendChild(divDiagram)
            topData.appendChild(divVariants)

            // блок с карточками людей
            // <div class="ratings-header">
            //     <img src="{{ url_for('mentor.static', filename='images/people.svg') }}" class="people-icon">
            //     <p class="num-people"></p>
            //     <p class="count-people"></p>
            // </div>

            // <div class="body-ratings">
                
            // </div>

            const ratingsHeader = document.createElement("div")
            ratingsHeader.className = "ratings-header"

            const image = document.createElement("img")
            image.className = "people-icon"
            image.src = document.querySelector(".hide").dataset.src

            const numPeople = document.createElement("p")
            numPeople.className = "num-people"

            const countPeople = document.createElement("p")
            countPeople.className = "count-people"


            ratingsHeader.appendChild(image)
            ratingsHeader.appendChild(numPeople)
            ratingsHeader.appendChild(countPeople)

            const bodyRatings = document.createElement("div")
            bodyRatings.className = "body-ratings"

            usersRatings.appendChild(ratingsHeader)
            usersRatings.appendChild(bodyRatings)
        }


        // ------------- создание диаграм
        let answers = user_list.answers
        const cont = document.querySelector(".variants")
        cont.innerHTML = ""
        if (user_list.type_question != "input-gap"){
            let count = 0
            for (let answer of answers){
                const variantDiv = document.createElement("div")
                variantDiv.className = "variant"

                const variantOutline = document.createElement("div")
                variantOutline.className = "variant-outline"

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
            for (let i = 0; i <= user_list.users.length; i++){
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
            for (let i = 1; i <= user_list.answers.length; i++) {
                const outlineBlock = document.createElement("div");
                outlineBlock.className = "block";

                const greenBlock = document.createElement("div");
                greenBlock.className = "block-diagram";
                greenBlock.style.height = "0%"; // старт с 0

                outlineBlock.appendChild(greenBlock);
                blockCont.appendChild(outlineBlock);

                // даём браузеру время вставить элемент, и только потом меняем высоту
                setTimeout(() => {
                    greenBlock.style.height = `${(height + 0.1) * parseInt(user_list.count_answers[i - 1])}%`;
                }, 50); 
            }
        }
        

    

        // --------------
        let usersConts

        if (user_list.type_question != "input-gap"){
            usersConts = document.querySelector(".body-ratings")
            usersConts.innerHTML = ""  
        }else{
            usersConts = document.querySelector(".users-ratings")
            usersConts.innerHTML = ""  
        }
        // <div class="user-card">

        //     <div class="left-part">
        //         <p class="place-students">$1</p>

        //         <div class="avatar-circle">
        //             <img data-size="{{ user.size_avatar }}" class="avatar" src="{{ url_for('profile.static', filename='images/edit_avatar/' + user.email +'/'+ user.name_avatar ) }}" alt="avatar">
        //         </div>
        //     </div>

        //     <div class="right-part">
        //         <p class="nickname">Грінченко Володимир</p>
                
        //         <div class="choicen">
        //             <p class="text-achiv">Обрана відповідь:</p>
        //         </div>
        //     </div>
        // </div>

        let countAccuracy = 0
        let countRight = 0
        let countUncorrect = 0
        user_list.users.forEach((element, index) => {
            const usercont = document.createElement("div")
            usercont.className = "user-card"

            const leftpart = document.createElement("div")
            leftpart.className = "left-part"
            const rightpart = document.createElement("div")
            rightpart.className = "right-part"

            usercont.appendChild(leftpart)
            usercont.appendChild(rightpart)

            const textplace = document.createElement("p")
            textplace.className = "place-students"
            textplace.textContent = `№${index + 1}`  

            const avatarCircle = document.createElement("div")
            avatarCircle.className = 'avatar-circle'

            const avatar = document.createElement("img")
            avatar.className = "avatar"
            avatar.setAttribute("data-size", element.avatar_size)
            avatar.src = element.user_avatar
            
            avatarCircle.appendChild(avatar)

            leftpart.appendChild(textplace)
            leftpart.appendChild(avatarCircle)

            const nickname = document.createElement("p")
            nickname.className = "nickname"
            nickname.textContent = element.username
            
            const choicen = document.createElement("div")
            choicen.className = "choicen"
            
            const textAchiv = document.createElement("p")
            textAchiv.classList = "text-achiv"
            textAchiv.textContent = "Обрана відповідь:"
            choicen.appendChild(textAchiv)

            const lastAnswering = document.createElement("p")
            lastAnswering.textContent = `${element.last_answer.join(" ")}`
            lastAnswering.className = "choicen-text"
            choicen.appendChild(lastAnswering)

            rightpart.appendChild(nickname)
            rightpart.appendChild(choicen)

            usersConts.appendChild(usercont)

            countAccuracy += parseInt(element.accuracy)

            if (parseInt(element.right_wrong) == 1){
                choicen.style.backgroundColor = `rgba(169, 255, 182, 0.25)`;
                countRight++
            }else if (parseInt(element.right_wrong) == 0){
                choicen.style.backgroundColor = `rgba(255, 118, 124, 0.25)`;
                countUncorrect++
            }else{
                choicen.style.backgroundColor = `rgba(163, 159, 159, 0.25)`;
            }
        })

        // Прогресс-бар точности
        let accuracy = countAccuracy / user_list.users.length
        try {
            document.querySelector(".num-people").textContent = user_list.users.length

            if (user_list.users.length % 10 === 1 && user_list.users.length % 100 !== 11) {
                document.querySelector(".count-people").textContent = "учасник";
            } else if ([2,3,4].includes(user_list.users.length % 10) && ![12,13,14].includes(user_list.users.length % 100)) {
                document.querySelector(".count-people").textContent = "учасники";
            } else {
                document.querySelector(".count-people").textContent = "учасників";
            }
        } catch (error) {
            document.querySelector(".num-people").textContent = 0
        }

        const fill = document.querySelector(".fill")
        const textPerc = document.querySelector(".text-perc p")
        const quard = document.querySelector(".quard")

        // Сброс анимации
        if (fill) {
            fill.style.transition = "none"
            fill.style.height = "0%"
            void fill.offsetHeight
            fill.style.transition = "height 1s ease-in-out"
            fill.style.height = Math.round(accuracy) + "%" 
        }

        if (quard) {
            quard.style.bottom = `calc(${Math.round(accuracy)}% - 0.5vh)` 
        }

        if (textPerc) {
            textPerc.textContent = "0% точностi !"
            let current = 0
            const target = Math.round(accuracy)
            const interval = setInterval(() => {
                if (current < target) {
                    current++
                    textPerc.textContent = `${current}% точностi !`
                } else {
                    clearInterval(interval)
                }
            }, 15)
        }

        // количество правильніх ответов
        document.querySelector(".right").textContent = `${countRight} вірно!`
        document.querySelector(".wrong").textContent = `${countUncorrect} невірно`

    }
)

// socket.on("student_answers", data => {
//     // находим все блоки пользователей
//     const userBlocks = document.querySelectorAll(".cont-users .userCont")

//     userBlocks.forEach(block => {
//         // ищем блок по data-email
//         if (block.classList.contains(data.email)) {
//             const newblock = document.createElement("div")

//             const text = document.createElement("p")
//             text.textContent = "обрана відповідь"

//             const answers = document.createElement("p")
//             answers.textContent = data.answers

//             newblock.appendChild(text)
//             newblock.appendChild(answers)

//             block.appendChild(newblock)
//         }
//     })
// })

socket.on("next_question", data => {
    window.location.replace("/passing_mentor")
})

socket.on("end_test",
    data => {
        window.location.replace("/finish_mentor")
    }
)


document.querySelector(".next-question").addEventListener(
    'click',
    () => {
        const oldData = parseInt(localStorage.getItem("index_question"))
        localStorage.setItem("index_question", oldData + 1)
        socket.emit('next_one', {
            index: localStorage.getItem("index_question"),
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
        })
    }
)

