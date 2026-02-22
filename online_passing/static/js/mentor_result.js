const socket = io()

localStorage.setItem("flag_time", "true")
localStorage.setItem("time_flag", "false")

setInterval(() => {
    socket.emit("check_users", {room_code: localStorage.getItem("room_code"), page: "result", index_question: localStorage.getItem("index_question")})
}, 3000)

socket.emit(
    'users_results',
    {
        room: localStorage.getItem("room_code"), 
        test_id: localStorage.getItem("test_id"),
        index_question: localStorage.getItem("index_question")
    }
)

socket.on("update_users", () => {
    socket.emit(
        'users_results',
        {
            room: localStorage.getItem("room_code"), 
            test_id: localStorage.getItem("test_id"),
            index_question: localStorage.getItem("index_question")
        }
    )

    const diagram = document.querySelector(".diagram")
    if (diagram) diagram.remove()
    
    const variants = document.querySelector(".variants")
    if (variants) variants.remove()
})

socket.on("list_results", user_list => {  
    const topData = document.querySelector(".top-data")
    const usersRatings = document.querySelector(".users-list-container")
    
    usersRatings.innerHTML = ""
    
    const oldDiagram = document.querySelector(".diagram")
    if (oldDiagram) oldDiagram.remove()
    
    const oldInputGap = document.querySelector(".outline-input-gap")
    if (oldInputGap) oldInputGap.remove()

    const topDiagram = document.querySelector(".top-data")
    const circleDiagram = document.querySelector(".circle-diagram")

    let countAccuracy = 0
    let countRight = 0
    let countUncorrect = 0
    let countMissed = 0

    user_list.users.forEach((element) => {
        countAccuracy += parseInt(element.accuracy)
        if (parseInt(element.right_wrong) == 1) {
            countRight++
        } else if (parseInt(element.right_wrong) == 0) {
            countUncorrect++
        } else {
            countMissed++
        }
    })

    if (user_list.type_question == "one-answer" || user_list.type_question == "many-answers" || user_list.type_question == "input-gap") {
        if (topDiagram) topDiagram.style.display = "flex"

        if (circleDiagram) {
            circleDiagram.innerHTML = "" 
            
            const pieOptions = {
                series: [countRight, countUncorrect, countMissed],
                labels: ['Правильно', 'Неправильно', 'Пропущено'],
                chart: {
                    type: 'donut',
                    height: '100%',
                    background: 'transparent',
                    fontFamily: 'inherit'
                },
                colors: ['#8AF7D4', '#FF767C', '#848282'],
                stroke: { show: false },
                dataLabels: { enabled: false },
                legend: {
                    position: 'bottom',
                    labels: { colors: '#ffffff' }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                name: { color: '#ffffff', fontSize: '1.5vh' },
                                value: { color: '#ffffff', fontSize: '2.5vh', fontWeight: 'bold' },
                                total: {
                                    show: true,
                                    label: 'Всього',
                                    color: '#D9D9D9',
                                    formatter: function (w) {
                                        return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            new ApexCharts(circleDiagram, pieOptions).render()
        }


        if (user_list.type_question == "one-answer" || user_list.type_question == "many-answers"){
            const divDiagram = document.createElement("div")
            divDiagram.className = "diagram"
            divDiagram.style.flexGrow = "1" 
            divDiagram.style.height = "100%"
            divDiagram.style.display = "flex"
            divDiagram.style.flexDirection = "column"
            divDiagram.style.backgroundColor = "transparent"

            const textDiagram = document.createElement("p")
            textDiagram.textContent = "Прогресс учнів:"
            textDiagram.className = "text-diagram"
            textDiagram.style.height = "10%"

            const diagramInfo = document.createElement("div")
            diagramInfo.className = "diagram-informations"
            diagramInfo.style.height = "75%"
            diagramInfo.style.position = "relative"
            diagramInfo.style.display = "flex"
            diagramInfo.style.flexDirection = "column"
            diagramInfo.style.justifyContent = "space-between"
            diagramInfo.style.borderBottom = "2px solid #ffffff" 

            const divBlocks = document.createElement("div")
            divBlocks.className = "blocks"
            divBlocks.style.position = "absolute"
            divBlocks.style.width = "100%"
            divBlocks.style.height = "100%"
            divBlocks.style.display = "flex"
            divBlocks.style.alignItems = "flex-end" 
            divBlocks.style.bottom = "0"
            divBlocks.style.left = "0"
            divBlocks.style.zIndex = "2"

            divDiagram.appendChild(textDiagram)
            diagramInfo.appendChild(divBlocks)
            divDiagram.appendChild(diagramInfo)

            const divVariants = document.createElement("div")
            divVariants.className = "variants"
            divVariants.style.height = "auto"
            divVariants.style.minHeight = "15%"
            divVariants.style.display = "flex"
            divVariants.style.width = "100%"
            divVariants.style.alignItems = "stretch" 
            divVariants.style.marginTop = "10px"

            divDiagram.appendChild(divVariants)

            if (topDiagram) {
                topDiagram.appendChild(divDiagram)
            } else {
                topData.appendChild(divDiagram)
            }

            let answers = user_list.answers
            let count = answers.length
            let width = 100 / count

            let countLines = user_list.users.length > 0 ? user_list.users.length : 1
            for (let i = 0; i <= countLines; i++){
                const line = document.createElement("div")
                line.className = "line"
                line.style.width = "100%"
                line.style.borderTop = "1px solid rgba(255, 255, 255, 0.2)"
                line.style.backgroundColor = "transparent"
                diagramInfo.appendChild(line)
            }

            let heightStep = 100 / countLines

            for (let i = 0; i < count; i++) {
                const variantDiv = document.createElement("div")
                variantDiv.className = "variant"
                variantDiv.style.width = `${width}%`
                variantDiv.style.display = "flex"
                variantDiv.style.justifyContent = "center"
                variantDiv.style.padding = "0 5px"

                const variantOutline = document.createElement("div")
                variantOutline.className = "variant-outline"
                variantOutline.style.width = "100%"
                variantOutline.style.height = "100%"
                variantOutline.style.boxSizing = "border-box"
                variantOutline.style.borderRadius = "12px"
                variantOutline.style.backgroundColor = "rgba(195, 159, 228, 0.58)"
                variantOutline.style.display = "flex"
                variantOutline.style.alignItems = "center"
                variantOutline.style.justifyContent = "center"
                variantOutline.style.padding = "10px"

                const paragraph = document.createElement("p")
                paragraph.className = "variant-text"
                paragraph.textContent = answers[i]
                paragraph.style.margin = "0"
                paragraph.style.wordBreak = "break-word"
                paragraph.style.textAlign = "center"

                variantOutline.appendChild(paragraph)
                variantDiv.appendChild(variantOutline)
                divVariants.appendChild(variantDiv)

                const outlineBlock = document.createElement("div")
                outlineBlock.className = "block"
                outlineBlock.style.width = `${width}%`
                outlineBlock.style.height = "100%"
                outlineBlock.style.display = "flex"
                outlineBlock.style.alignItems = "flex-end"
                outlineBlock.style.justifyContent = "center"

                const greenBlock = document.createElement("div")
                greenBlock.className = "block-diagram"
                greenBlock.style.width = "60%"
                const right_indexes = user_list.right_indexes || []
                if (right_indexes.includes(i)) {
                    greenBlock.style.backgroundColor = "#8AF7D4" 
                } else {
                    greenBlock.style.backgroundColor = "#FF767C" 
                }
                // greenBlock.style.borderRadius = "6px 6px 0 0" 
                greenBlock.style.height = "0%"
                greenBlock.style.transition = "0.8s ease-out"

                outlineBlock.appendChild(greenBlock)
                divBlocks.appendChild(outlineBlock)

                setTimeout(() => {
                    greenBlock.style.height = `${heightStep * parseInt(user_list.count_answers[i])}%`
                }, 50)
            }
        }else{
            // создай тут диаграмму которая подойдет для типа вопроса input-gap через chart.js
            const divDiagram = document.createElement("div")
            divDiagram.className = "diagram"
            divDiagram.style.flexGrow = "1" 
            divDiagram.style.height = "100%"
            divDiagram.style.display = "flex"
            divDiagram.style.flexDirection = "column"
            divDiagram.style.backgroundColor = "transparent"

            const textDiagram = document.createElement("p")
            textDiagram.textContent = "Відповіді учнів:"
            textDiagram.className = "text-diagram"
            textDiagram.style.height = "10%"

            const chartWrapper = document.createElement("div")
            chartWrapper.style.position = "relative"
            chartWrapper.style.height = "90%"
            chartWrapper.style.width = "100%"

            const canvas = document.createElement("canvas")
            chartWrapper.appendChild(canvas)

            divDiagram.appendChild(textDiagram)
            divDiagram.appendChild(chartWrapper)

            if (topDiagram) {
                topDiagram.appendChild(divDiagram)
            } else {
                topData.appendChild(divDiagram)
            }

            let answerCounts = {}
            user_list.users.forEach(u => {
                let ans = u.last_answer && u.last_answer.length > 0 ? u.last_answer.join(" ") : "Пропущено"
                if (!ans.trim() || ans === "......" || ans === "∅") ans = "Пропущено"
                
                if (!answerCounts[ans]) {
                    answerCounts[ans] = { count: 0, isCorrect: (parseInt(u.right_wrong) === 1) }
                }
                answerCounts[ans].count++
            })

            let uniqueAnswers = Object.keys(answerCounts).sort((a,b) => answerCounts[b].count - answerCounts[a].count)
            let labels = []
            let data = []
            let bgColors = []

            uniqueAnswers.forEach(ans => {
                let wrappedText = []
                const words = String(ans).split(' ')
                let currentLine = ''
                words.forEach(word => {
                    if ((currentLine + word).length > 15) {
                        wrappedText.push(currentLine.trim())
                        currentLine = word + ' '
                    } else {
                        currentLine += word + ' '
                    }
                })
                wrappedText.push(currentLine.trim())
                labels.push(wrappedText)

                data.push(answerCounts[ans].count)
                
                if (ans === "Пропущено") {
                    bgColors.push("#848282")
                } else if (answerCounts[ans].isCorrect) {
                    bgColors.push("#8AF7D4")
                } else {
                    bgColors.push("#FF767C")
                }
            })

            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: bgColors,
                        borderRadius: 6,
                        maxBarThickness: 80
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            titleFont: { size: 14 },
                            bodyFont: { size: 14 }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: "#ffffff", font: { size: 14 } },
                            border: { color: "#ffffff" }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: "#ffffff", font: { size: 14 } },
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                            border: { display: false }
                        }
                    }
                }
            })

        }

    } 

    // let usersConts = document.querySelector(".body-ratings")
    // if (!usersConts) {
    //     const ratingsHeader = document.createElement("div")
    //     ratingsHeader.className = "ratings-header"
    //     usersConts = document.createElement("div")
    //     usersConts.className = "body-ratings"
    // }

    usersConts = document.querySelector(".users-list-container");

    user_list.users.forEach((element, index) => {
        let statusIcon = "";
        let statusClass = "";

        // Проверяем правильность ответа для иконки и цвета
        if (parseInt(element.right_wrong) === 1) {
            statusIcon = "✔";
            statusClass = "correct-status";
        } else if (parseInt(element.right_wrong) === 0) {
            statusIcon = "✖";
            statusClass = "wrong-status";
        } else {
            statusIcon = "➖";
            statusClass = "missed-status";
        }

        // Если с сервера приходят очки, используем их. Иначе 0.
        let points = element.points !== undefined ? element.points : 0;

        // Формируем HTML карточки по вашему дизайну
        const cardHTML = `
            <div class="user-card active" data-id="${element.id}">
                <div class="user-info">
                    <span class="place-students">№${index + 1}</span>
                    
                    <div class="user-text-data">
                        <span class="user-name">${element.username}</span>
                        <span class="user-stats">Точність: ${parseInt(element.accuracy)}%</span>
                    </div>
                </div>

                <div class="user-status  ${statusClass}">${statusIcon}</div>
            </div>
        `;

        usersConts.insertAdjacentHTML('beforeend', cardHTML);
    });


    let accuracy = Math.round(Number(user_list.avarage_accuracy))
    // try {
    //     document.querySelector(".num-people").textContent = user_list.users.length

    //     if (user_list.users.length % 10 === 1 && user_list.users.length % 100 !== 11) {
    //         document.querySelector(".count-people").textContent = "учасник"
    //     } else if ([2,3,4].includes(user_list.users.length % 10) && ![12,13,14].includes(user_list.users.length % 100)) {
    //         document.querySelector(".count-people").textContent = "учасники"
    //     } else {
    //         document.querySelector(".count-people").textContent = "учасників"
    //     }
    // } catch (error) {
    //     try {
    //         document.querySelector(".num-people").textContent = 0
    //     } catch (error) {}
    // }

    const fill = document.querySelector(".fill")
    const textPerc = document.querySelector(".text-perc p")
    const quard = document.querySelector(".quard")

    if (fill) {
        fill.style.transition = "none"
        fill.style.width = "0%"  /
        void fill.offsetWidth    
        fill.style.transition = "width 1s ease-in-out" 
        fill.style.width = Math.round(accuracy) + "%" 
    }

    const maxAccuracy = 95 
    const clampedAccuracy = Math.min(Math.round(accuracy), maxAccuracy)

    if (quard) {
        quard.style.left = `${clampedAccuracy}%` 
    }

    if (textPerc) {
        textPerc.textContent = "0% точностi !"
        let current = 0
        const target = Math.round(Number(user_list.avarage_accuracy))
        const interval = setInterval(() => {
            if (current < target) {
                current++
                textPerc.textContent = `${current}% точностi !`
            } else {
                clearInterval(interval)
            }
        }, 15)
    }

    try {
        document.querySelector(".right-text").textContent = `${countRight}`
        document.querySelector(".wrong-text").textContent = `${countUncorrect}`
        document.querySelector(".simple-text").textContent = `${countMissed}`
    } catch (error) {}

    let lastid

    let crossUser = document.getElementsByClassName("user-card")
    for (let cross of crossUser) {
        cross.addEventListener("click", (event) => {
            const isEyeClick = event.target.closest('.choicen') || event.target.closest('.choicen .open-eye')
            if (isEyeClick) {
                return
            }
            document.querySelector(".window-choice").classList.add("active")
            document.querySelector("#overlay").classList.add("active")
            lastid = cross.dataset.id
        })
    }

    let buttonRemove = document.querySelector(".remove_user")
    if (buttonRemove) {
        buttonRemove.addEventListener("click", () => {
            socket.emit("delete_user", {
                room: localStorage.getItem("room_code"),
                id: lastid
            })
            document.querySelector(".window-choice").classList.remove("active")
            document.querySelector("#overlay").classList.remove("active")
            location.reload()
        })
    }

    let declineBtn = document.querySelector(".decline")
    if (declineBtn) {
        declineBtn.addEventListener("click", () => {
            document.querySelector(".window-choice").classList.remove("active")
            document.querySelector("#overlay").classList.remove("active")
        })
    }
})

socket.on("next_question", data => {
    window.location.replace("/passing_mentor")
})

socket.on("end_test", data => {
    window.location.replace("/finish_mentor")
})

document.querySelector(".next-question").addEventListener('click', () => {
    const oldData = parseInt(localStorage.getItem("index_question"))
    localStorage.setItem("index_question", oldData + 1)
    socket.emit('next_one', {
        index: localStorage.getItem("index_question"),
        test_id: localStorage.getItem("test_id"),
        room: localStorage.getItem("room_code"),
    })
})