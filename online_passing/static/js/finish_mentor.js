const socket = io()
const cardsContainer = document.querySelector(".user-list")

socket.emit("finish_mentor",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code"),
    question_index: localStorage.getItem("index_question")
})

setInterval(() => {
    socket.emit("check_users", {room_code: localStorage.getItem("room_code"), page: "finish_test", index_question: localStorage.getItem("index_question")})
}, 3000)


document.addEventListener("click", (e) => {
    const solo = e.target.closest(".all-users")
    if (!solo) return
    
    const textBtn = document.querySelector(".text-button")
    if (textBtn) textBtn.textContent = "Окремо"

    const dataCont = document.querySelector(".left-part")

    const personalData = dataCont.querySelector(".personal-data")
    const userQuestions = dataCont.querySelector(".user-questions")
    if (personalData) personalData.remove()
    if (userQuestions) userQuestions.remove()

    const accuracyContainer = document.querySelector(".data-accuracy")
    const userTips = accuracyContainer.querySelector(".user-tips")
    if (userTips) userTips.remove()

    if (!dataCont.querySelector(".users")) {
        dataCont.insertAdjacentHTML('beforeend', `
            <div class="users">
                <div class="head-titles">
                    <div class="left-category">
                        <p class="place">місце</p>
                        <p class="name">ім'я учня</p>
                    </div>
                    <div class="right-category">
                        <p class="points">бали</p>
                        <p>точність</p>
                    </div>
                </div>
                <div class="list-users"></div>
            </div>
            <div class="check-page">
                <p>Переглянути сторінку:</p>
                <div class="page"><p>1</p></div>
            </div>
        `)
    }

    const firstDiagramBlock = document.querySelector(".first-diagram")
    if (!document.querySelector("#choice-diagram") && firstDiagramBlock) {
        const accuracyText = firstDiagramBlock.querySelector("p")
        accuracyText.insertAdjacentHTML('afterend', `
            <select id="choice-diagram" name="diagram">
                <option value="general">Загальна успішність</option>
                <option value="column-diagram">Точність відповідей</option>
                <option value="dots-diagram">Аналіз питань</option>
                <option value="time-diagram">Аналіз часу</option>
            </select>
        `)
    } else if (document.querySelector("#choice-diagram")) {
        document.querySelector("#choice-diagram").value = "general"
        document.querySelector("#choice-diagram").innerHTML = `
            <option value="general">Загальна успішність</option>
            <option value="column-diagram">Точність відповідей</option>
            <option value="dots-diagram">Аналіз питань</option>
            <option value="time-diagram">Аналіз часу</option>
        `
    }

    if (!document.querySelector(".bar-chart-container")) {
        accuracyContainer.insertAdjacentHTML('beforeend', `
            <div class="bar-chart-container">
                <canvas id="accuracyChart"></canvas>
            </div>
        `)
    }

    socket.emit("finish_mentor",{
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
        question_index: localStorage.getItem("index_question")
    })

    socket.emit("general-diagram",{
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
        question_index: localStorage.getItem("index_question")
    })
})

socket.on("list_results", data => {
    let users = data.users
    document.querySelector(".count-users").textContent = users.length

    let count = 0
    let userCointainer = document.querySelector(".list-users")

    let htmlContent = ""

    users.forEach(user => {
        count++
        let checkDark = count % 2 == 0 ? 'dark' : ''
        let accuracy = parseInt(user.accuracy)

        htmlContent += `
            <div class="user ${checkDark}">
                <div class="left-category">
                    <p class="place">№${count}</p>
                    <p class="name">${user.username}</p>
                </div>
                <div class="right-category">
                    <p class="points">${user.count_points}</p>

                    <div class="outline-accuracy">
                        <p class="text-accuracy">${accuracy}%</p>
                        <div class="fill-accuracy" style="width: 0%" data-width="${accuracy}%"></div>
                    </div>
                </div>
            </div>
        `
    })

    userCointainer.innerHTML = htmlContent

    setTimeout(() => {
        const bars = userCointainer.querySelectorAll('.fill-accuracy')
        bars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width')
        })
    }, 100)

    const textAccuracy = document.querySelector(".accuracy-result")
    const averageAccuracy = data.average_accuracy
    textAccuracy.textContent = `${averageAccuracy}%`

    const dropdownList = document.querySelector(".dropdown-users")
    let dropdownContent = ""

    users.forEach(user => {
        dropdownContent += `<div class="dropdown-item" data-id="${user.id}">${user.username}</div>`
    })

    dropdownList.innerHTML = dropdownContent

    document.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item")
        if (!item) return
        const userId = item.dataset.id
        openUserModal(userId)
        const dropdown = document.querySelector(".dropdown-users")
        dropdown?.classList.remove("active")
        const arrow = document.querySelector(".solo-data img")
        arrow?.classList.remove("rotate")
    })

    const downloadBtn = document.querySelector(".load-excel")
    
    const newBtn = downloadBtn.cloneNode(true)
    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn)
    
    newBtn.addEventListener("click", () => {
        const excelData = users.map(user => {
            return {
                "Ім'я учня": user.username,
                "Email": user.email,
                "Бали": user.count_points,
                "Точність (%)": parseInt(user.accuracy) 
            }
        })

        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(excelData)

        const wscols = [
            {wch: 25}, 
            {wch: 30}, 
            {wch: 10}, 
            {wch: 15}  
        ]
        worksheet['!cols'] = wscols
        XLSX.utils.book_append_sheet(workbook, worksheet, "Результати")

        XLSX.writeFile(workbook, `Results_Room_${localStorage.getItem("room_code")}.xlsx`)
    })
})

const arrow = document.querySelector(".solo-data img")
const soloBtn = document.querySelector(".solo-data")
const getDropdown = () => document.querySelector(".dropdown-users")

document.addEventListener("click", (e) => {
    const solo = e.target.closest(".solo-data")
    if (!solo) return
    const list = document.querySelector(".dropdown-users")
    list?.classList.toggle("active")
    const arrow = solo.querySelector("img")
    arrow?.classList.toggle("rotate")
})

document.addEventListener("click", (e) => {
    if (!e.target.closest(".solo-wrapper")) {
        const list = getDropdown()
        if (list && list.classList.contains("active")) {
            list.classList.remove("active")
            if (arrow) arrow.classList.remove("rotate")
        }
    }
})

function openUserModal(userId) {
    fetch('/get_user_detail_stats', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            user_id: userId, 
            room: localStorage.getItem("room_code"),
            id_test: localStorage.getItem("test_id")
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) return

        const dataCont = document.querySelector(".left-part")
        const usersBlock = dataCont.querySelector(".users")
        const pageUsers = dataCont.querySelector(".check-page")
        const answers = data.count_answers.split("/")
        
        if (usersBlock) usersBlock.remove()
        if (pageUsers) pageUsers.remove()
        
        const oldPersonalData = dataCont.querySelector(".personal-data")
        const oldUserQuestions = dataCont.querySelector(".user-questions")
        if (oldPersonalData) oldPersonalData.remove()
        if (oldUserQuestions) oldUserQuestions.remove()

        dataCont.insertAdjacentHTML('beforeend', `
            <div class="personal-data">
                <div class="points-user">
                    <p class="points-text">200/200</p>
                    <div class="block-accuracy">
                        <p>Бали</p>
                        <p>Точність</p>
                    </div>
                </div>

                <div class="personal-accuracy">
                    <p class='student-accuracy'>100%</p>
                    <p>Точність</p>
                </div>

                <div class="avarage-time">
                    Середній час:
                    <div class="time-text">
                        <p class='student-time'>12хв</p>
                    </div>
                </div>
            </div> 

            <div class="user-questions">
                <p class="info-text">Детальний аналіз відповідей</p>
                <div class="all-questions">
                    <div class="question-header">
                        <div class="nums">#</div>
                        <div class="question-part">Питання</div>
                        <div class="answer-part">Ваша відповідь</div>
                        <div class="part-result">Результат</div>
                    </div>
                    <div class="questions-cont"></div>
                </div>
            </div> 
        `)

        const dataDiagram = document.querySelector(".right-part")
        const bottomDiagram = dataDiagram.querySelector(".bar-chart-container")

        if (bottomDiagram) {
            bottomDiagram.remove()
        }

        document.querySelector("#choice-diagram").innerHTML = `
            <option value="general-student">Загальна успішність</option>
            <option value="time-diagram-student">Аналіз часу</option>
        `


        const accuracyContainer = document.querySelector(".data-accuracy")
        const oldTips = accuracyContainer.querySelector(".user-tips")
        if (oldTips) oldTips.remove()

        accuracyContainer.insertAdjacentHTML('beforeend', `
            <div class="user-tips">
                <div class="correct-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-correct"></div>
                        <p>Правильні відповіді</p>
                    </div>
                    <div class="text-num"><p>${answers[0]}</p></div>
                </div>
                <div class="uncorrect-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-uncorrect"></div>
                        <p>Не правильні відповіді</p>
                    </div>
                    <div class="text-num"><p>${answers[1]}</p></div>
                </div>
                <div class="unanswered-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-skip"></div>
                        <p>Пропущені відповіді</p>
                    </div>
                    <div class="text-num"><p>${answers[2]}</p></div>
                </div>
            </div>
        `)

        document.querySelector(".text-button").textContent = data.username
        document.querySelector(".student-accuracy").textContent = `${data.accuracy}%`
        document.querySelector(".accuracy-result").textContent = `${data.accuracy}%`
        document.querySelector(".points-text").textContent = `${data.points}/${data.max_points}`
        
        const blockanswers = document.querySelector(".questions-cont")
        for (let index = 0; index < data.questions.length; index++) {
            let dark = index % 2 == 0 ? "dark-example" : ""
            blockanswers.innerHTML += `
                <div class="question-example ${dark}">
                    <div class="nums"><p>${index + 1}</p></div>
                    <div class="question-block"><p>${data.questions[index]}</p></div>
                    <div class="answer-block"><p>${data.user_answers[index]}</p></div>
                    <div class="result-block"><p>${data.list_check[index]}</p></div>
                </div>
            `
        }

        let avarage_time = Number(data.avarage_time)
        let timeString = ""

        if (avarage_time > 60) {
            let minutes = Math.floor(avarage_time / 60)
            let seconds = Math.floor(avarage_time % 60)
            timeString = `${minutes} хв ${seconds} сек`
        } else {
            timeString = `${Math.floor(avarage_time)} сек`
        }

        document.querySelector(".student-time").textContent = timeString
        localStorage.setItem("user_id", data.id)
        socket.emit("student_diagram", {
            id: data.id,
            test_id: localStorage.getItem("test_id")
        })
    })
}
