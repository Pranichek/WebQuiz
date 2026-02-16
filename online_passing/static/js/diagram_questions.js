document.addEventListener('click', (e) => {
    const btn = e.target.closest('.button-question, .button-results')
    if (!btn) return

    if (btn.classList.contains('button-question')) {
        btn.textContent = "результати учнів"
        btn.classList.remove("button-question")
        btn.classList.add("button-results")

        const dataCont = document.querySelector(".left-part")
        const diagrmCont = document.querySelector(".right-part")
        if (dataCont) dataCont.remove()
        if (diagrmCont) diagrmCont.remove()

        document.querySelector(".main-data").innerHTML += `
            <div class="questions-test">
                <div class="results-grid"></div>
            </div>
        `

        socket.emit("questions-result", {
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code")
        })
    }

    else if (btn.classList.contains('button-results')) {
        btn.textContent = "перелік питань"
        btn.classList.remove("button-results")
        btn.classList.add("button-question")

        const questionsTest = document.querySelector(".questions-test")
        if (questionsTest) questionsTest.remove()

        document.querySelector(".main-data").innerHTML += `
             <div class="left-part">
                <div class="head-buttons">
                    <div class="left-buttons">
                        <div class="all-users">
                            <p>Усі учасники (<span class="count-users"></span>)</p>
                        </div>
                        <div class="solo-wrapper">
                            <div class="solo-data">
                                <p class="text-button">Окремо</p>
                                <img src="${document.querySelector(".arrow-src").dataset.src}" alt="show_more">
                            </div>
                            <div class="dropdown-users"></div>
                        </div>
                    </div>

                    <div class="save-result">
                        <p>Зберегти результат</p>
                    </div>
                </div>

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
            </div>

            <div class="right-part">
                <div class="first-diagram">
                    <div class="top-part">
                        <p>Загальна точність: <span class="accuracy-result">0%</span></p>
                        <select id="choice-diagram" name="diagram" value="general">
                            <option value="general">Загальна успішність</option>
                            <option value="column-diagram">Точність відповідей</option>
                            <option value="dots-diagram">Аналіз питань</option>
                        </select>
                    </div>

                    <div class="diagram-pie">
                        <canvas id="myChart" class="myChart"></canvas>
                    </div>
                </div>


                <div class="line"></div>
                    
                <div class="data-accuracy">
                    <div class="bar-chart-container">
                        <canvas id="accuracyChart"></canvas>
                    </div>
                </div>
            </div>
        `

        socket.emit("finish_mentor", {
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        })

        socket.emit("general-diagram", {
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        })
    }
})

socket.on("ready_data", (data) => {
    const questionsList = data.list_data
    const gridContainer = document.querySelector(".results-grid")
    
    gridContainer.innerHTML = ""

    questionsList.forEach(question => {
        const stats = question.stats
        const total = stats.total_answers > 0 ? stats.total_answers : 1
        const correctPercent = Math.round((stats.correct_count / total) * 100)

        const pieChartHTML = `
            <div class="chart-wrapper pie-wrapper">
                <div class="visual-pie" style="background: conic-gradient(#BBE3B3 0% ${correctPercent}%, #FF767C ${correctPercent}% 100%)">
                    <div class="pie-center-text">
                        <span class="big-num">${correctPercent}%</span>
                        <span class="small-text">Вірно</span>
                    </div>
                </div>
                <div class="legend">
                    <div class="legend-item">
                        <span class="dot" style="background: #BBE3B3"></span>
                        Правильно (${stats.correct_count})
                    </div>
                    <div class="legend-item">
                        <span class="dot" style="background: #FF767C"></span>
                        Неправильно (${stats.incorrect_count})
                    </div>
                </div>
            </div>
        `

        let contentRightHTML = ''

        if (question.type_question !== "input-gap") {
            let barsHTML = ''
            if (question.variants && question.variants.length > 0) {
                question.variants.forEach((variant) => {
                    let heightPercent = 0
                    if (stats.total_answers > 0) {
                        heightPercent = Math.round((variant.count_choosen / stats.total_answers) * 100)
                    }
                    let visualHeight = heightPercent === 0 ? 1 : heightPercent

                    let barColor = '#9a9a9a'
                    if (variant.is_correct) barColor = '#BBE3B3'
                    else if (variant.count_choosen > 0) barColor = '#FF767C'

                    barsHTML += `
                        <div class="bar-group" title="${variant.text} (Обрано: ${variant.count_choosen})">
                            <div class="bar-count">${variant.count_choosen}</div>
                            <div class="bar" style="height: ${visualHeight}%; background-color: ${barColor}"></div>
                            <span class="bar-label">${variant.text}</span>
                        </div>
                    `
                })
            } else {
                barsHTML = '<div class="axis-label" style="width:100%; text-align:center; color:#b0b0b0">Немає даних</div>'
            }

            contentRightHTML = `
                <div class="chart-wrapper bar-wrapper">
                    <div class="visual-bars">
                        ${barsHTML}
                    </div>
                </div>
            `
        } else {
            const correctAnswersSet = new Set(
                question.variants.map(v => v.text.trim().toLowerCase())
            )

            const answersMap = {}
            if (question.users_variants && question.users_variants.length > 0) {
                question.users_variants.forEach(ans => {
                    const cleanAns = ans ? ans.toString() : "Порожньо"
                    answersMap[cleanAns] = (answersMap[cleanAns] || 0) + 1
                })
            }

            const sortedAnswers = Object.entries(answersMap).sort((a, b) => b[1] - a[1])

            let tagsHTML = ''
            if (sortedAnswers.length > 0) {
                sortedAnswers.forEach(([text, count]) => {
                    const isCorrect = correctAnswersSet.has(text.trim().toLowerCase())
                    const tagClass = isCorrect ? 'ans-tag correct' : 'ans-tag wrong'
                    
                    tagsHTML += `
                        <div class="${tagClass}">
                            <span class="ans-text">${text}</span>
                            <span class="ans-count">${count}</span>
                        </div>
                    `
                })
            } else {
                tagsHTML = '<div class="no-data-text">Відповідей ще немає</div>'
            }

            contentRightHTML = `
                <div class="chart-wrapper answers-cloud-wrapper">
                    <div class="answers-header">Відповіді студентів:</div>
                    <div class="answers-cloud">
                        ${tagsHTML}
                    </div>
                </div>
            `
        }

        const cardHTML = `
            <div class="result-card">
                <div class="card-header">
                    <div class="q-number">${question.question_id.toString().padStart(2, '0')}</div>
                    <h3 class="q-title">${question.question_text}</h3>
                </div>
                
                <div class="charts-container">
                    ${pieChartHTML}
                    ${contentRightHTML}
                </div>
            </div>
        `

        gridContainer.insertAdjacentHTML('beforeend', cardHTML)
    })
})
