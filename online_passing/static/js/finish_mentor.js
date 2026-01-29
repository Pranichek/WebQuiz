const socket = io()
const cardsContainer = document.querySelector(".user-list")

socket.emit("finish_mentor",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code"),
    question_index: localStorage.getItem("index_question")
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

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const userId = this.getAttribute('data-id')
            openUserModal(userId)
        })
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
            {wch: 25}, // ширина 
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
const dropdownList = document.querySelector(".dropdown-users")

if (soloBtn) {
    
    soloBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        dropdownList.classList.toggle("active")
        arrow.classList.toggle("rotate")
    })
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".solo-wrapper")) {
        if (dropdownList) {
            dropdownList.classList.remove("active")
            arrow.classList.toggle("rotate")
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
            room: localStorage.getItem("room_code") 
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            return
        }

        const dataCont = document.querySelector(".left-part")
        const usersBlock = dataCont.querySelector(".users")
        const pageUsers = dataCont.querySelector(".check-page")
        if (usersBlock) {
            usersBlock.remove()
            pageUsers.remove()
        }

        dataCont.innerHTML += `
            <div class="personal-data">

                <div class="points-user">
                    <p class="points-text">200/200</p>
                    <div class="block-accuracy">
                        <p>Бали</p>
                        <p>Точність</p>
                    </div>
                </div>

                <div class="personal-accuracy">
                    <p>100%</p>
                    <p>Точність</p>
                </div>

                <div class="avarage-time">
                    Середній час:
                    <div class="time-text">
                        <p>12хв</p>
                    </div>
                </div>
            </div> 

             <div class="user-questions">
                <p class="info-text">Детальний аналіз відповідей</p>
                <div class="all-questions">
                    <div class="question-header">
                        <div class="nums">
                            #
                        </div>
                        <div class="question-part">
                            Питання
                        </div>
                        <div class="answer-part">
                            Ваша відповідь
                        </div>
                        <div class="part-result">
                            Результат
                        </div>
                    </div>
                    <div class="questions-cont">
                        <div class="question-example">
                            <div class="nums">
                                <p>1</p>
                            </div>
                            <div class="question-block">
                                <p>Для чого я существую взагалі?</p>
                            </div>
                            <div class="answer-block">
                                <p>Я сам хз бро</p>
                            </div>
                            <div class="result-block">
                                <p>правильно</p>
                            </div>
                        </div>
                        <div class="question-example dark-example">
                            <div class="nums">
                                <p>1</p>
                            </div>
                            <div class="question-block">
                                <p>Для чого я существую взагалі?</p>
                            </div>
                            <div class="answer-block">
                                <p>Я сам хз бро</p>
                            </div>
                            <div class="result-block">
                                <p>правильно</p>
                            </div>
                        </div>
            
                    </div>
                </div>
            </div> 
        `

        const dataDiagram = document.querySelector(".right-part")
        const bottomDiagram = dataDiagram.querySelector(".bar-chart-container")

        if (bottomDiagram){
            bottomDiagram.remove()
        }

        document.querySelector(".data-accuracy").innerHTML +=  `
            <div class="user-tips">
                <div class="correct-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-correct"></div>
                        <p>Правильні відповіді</p>
                    </div>
                    <div class="text-num">
                        <p>6</p>
                    </div>
                </div>
                <div class="uncorrect-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-uncorrect"></div>
                        <p>Не правильні відповіді</p>
                    </div>
                    <div class="text-num">
                        <p>6</p>
                    </div>
                </div>
                <div class="unanswered-answers div-answer">
                    <div class="left-block">
                        <div class="sighn-skip"></div>
                        <p>Пропущені відповіді</p>
                    </div>
                    <div class="text-num">
                        <p>6</p>
                    </div>
                </div>
            </div>
        `

        document.querySelector(".text-button").textContent = data.username
        
        // document.getElementById('modal-username').textContent = data.username
        // document.getElementById('modal-points').textContent = data.points
        // document.getElementById('modal-accuracy').textContent = data.accuracy 
        // document.getElementById('modal-avatar').src = data.avatar



    })
}

