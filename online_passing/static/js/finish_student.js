// 1. Функция загрузки личной статистики (Обертка)
function loadPersonalStats() {
    const userIdElement = document.querySelector(".user_id");
    const userId = userIdElement ? userIdElement.dataset.id : null;

    console.log(userId, "log")
    if (!userId) return;

    localStorage.setItem("user_finish-id", userId);
    console.log(localStorage.getItem("user_finish-id"), "dfdf")

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
        if(data.error) return;

        // --- Логика заполнения данных (как в твоем коде) ---
        const answersCount = data.count_answers.split("/"); 

        let avarage_time = Number(data.avarage_time);
        let timeString = avarage_time > 60 
            ? `${Math.floor(avarage_time / 60)} хв ${Math.floor(avarage_time % 60)} сек`
            : `${Math.floor(avarage_time)} сек`;

        // Заполнение текстовых полей
        const setText = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };

        setText(".js-username", data.username);
        setText(".js-points", `${data.points}/${data.max_points}`);
        setText(".js-accuracy", `${data.accuracy}%`);
        setText(".js-accuracy-result", `${data.accuracy}%`);
        setText(".js-time", timeString);
        setText(".js-count-correct", answersCount[0]);
        setText(".js-count-incorrect", answersCount[1]);
        setText(".js-count-skipped", answersCount[2]);

        // Генерация списка вопросов
        const blockanswers = document.querySelector(".questions-cont");
        if (blockanswers) {
            let questionsHtml = ""; 
            for (let index = 0; index < data.questions.length; index++) {
                let dark = index % 2 == 0 ? "dark-example" : "";
                let checkBox = data.list_check[index] == "правильно" ? "green" : 
                               (data.list_check[index] == "неправильно" ? "red" : "gray");

                questionsHtml += `
                    <div class="question-example ${dark}">
                        <div class="nums"><p>${index + 1}</p></div>
                        <div class="question-block"><p>${data.questions[index]}</p></div>
                        <div class="answer-block"><p>${data.user_answers[index]}</p></div>
                        <div class="result-block"><div class="block-user ${checkBox}"></div></div>
                    </div>
                `;
            }
            blockanswers.innerHTML = questionsHtml;
        }

        // Запуск диаграмм (убедись, что student_chart.js обрабатывает это событие)
        socket.emit("student_diagram", {
            id: localStorage.getItem("user_finish-id"),
            test_id: localStorage.getItem("test_id"), 
            room: localStorage.getItem("room_code") 
        });
        
    });
}

// 2. Инициализация при первой загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadPersonalStats();
});

// 3. Обработчик переключения кнопок (ВЕСЬ HTML ВЗЯТ ИЗ ТВОЕГО ШАБЛОНА)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.button-question, .button-results');
    if (!btn) return;

    // СЦЕНАРИЙ 1: Нажали "Перелік питань" -> Показать общую сетку вопросов
    if (btn.classList.contains('button-question')) {
        btn.textContent = "Ваші результати"; // Меняем текст кнопки
        btn.classList.remove("button-question");
        btn.classList.add("button-results");

        // Удаляем личную статистику
        const leftPart = document.querySelector(".left-part");
        const rightPart = document.querySelector(".right-part");
        if (leftPart) leftPart.remove();
        if (rightPart) rightPart.remove();

        // Добавляем контейнер для сетки
        document.querySelector(".main-data").innerHTML += `
            <div class="questions-test">
                <div class="results-grid"></div>
            </div>
        `;

        // Запрашиваем данные для сетки
        socket.emit("questions-result", {
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code")
        });
    }

    // СЦЕНАРИЙ 2: Нажали "Ваші результати" -> Вернуть личную статистику
    else if (btn.classList.contains('button-results')) {
        btn.textContent = "Перелік питань"; // Возвращаем текст
        btn.classList.remove("button-results");
        btn.classList.add("button-question");

        // Удаляем сетку
        const questionsTest = document.querySelector(".questions-test");
        if (questionsTest) questionsTest.remove();

        // Вставляем HTML структуру СТУДЕНТА (из твоего шаблона)
        document.querySelector(".main-data").innerHTML += `
        <div class="left-part">
            <div class="head-buttons">
                <div class="left-buttons">
                    <div class="solo-wrapper">
                        <div class="solo-data">
                            <p class="text-button js-username">Завантаження...</p>
                        </div>
                        <div class="dropdown-users"></div>
                    </div>
                </div>
            </div>

            <div class="personal-data">
                <div class="points-user">
                    <p class="points-text js-points">--/--</p>
                    <div class="block-accuracy">
                        <p>Бали</p>
                    </div>
                </div>

                <div class="personal-accuracy">
                    <p class='student-accuracy js-accuracy'>--%</p>
                    <p>Точність</p>
                </div>

                <div class="avarage-time">
                    Середній час:
                    <div class="time-text">
                        <p class='student-time js-time'>-- сек</p>
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
                        <div class="part-result">Успіх</div>
                    </div>
                    <div class="questions-cont"></div>
                </div>
            </div> 
        </div>

        <div class="right-part">
            <div class="first-diagram">
                <div class="top-part">
                    <p>Загальна точність: <span class="accuracy-result js-accuracy-result">--%</span></p>
                    <select id="choice-diagram" name="diagram" value="general">
                        <option value="general-student">Загальна успішність</option>
                        <option value="time-diagram-student">Аналіз часу</option>
                    </select>
                </div>

                <div class="diagram-pie">
                    <canvas id="myChart" class="myChart"></canvas>
                </div>
            </div>

            <div class="line"></div>
                
            <div class="data-accuracy">
                <div class="user-tips">
                    <div class="correct-answers div-answer">
                        <div class="left-block">
                            <div class="sighn-correct"></div>
                            <p>Правильні</p>
                        </div>
                        <div class="text-num"><p class="js-count-correct">-</p></div>
                    </div>
                    <div class="uncorrect-answers div-answer">
                        <div class="left-block">
                            <div class="sighn-uncorrect"></div>
                            <p>Не правильні</p>
                        </div>
                        <div class="text-num"><p class="js-count-incorrect">-</p></div>
                    </div>
                    <div class="unanswered-answers div-answer">
                        <div class="left-block">
                            <div class="sighn-skip"></div>
                            <p>Пропущені</p>
                        </div>
                        <div class="text-num"><p class="js-count-skipped">-</p></div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // ПОВТОРНО вызываем функцию загрузки данных
        loadPersonalStats();
    }
});


// 4. Отрисовка сетки (Взято из твоего примера)
socket.on("ready_data", (data) => {
    const questionsList = data.list_data;
    const gridContainer = document.querySelector(".results-grid");
    
    if(!gridContainer) return; // Проверка, существует ли контейнер

    gridContainer.innerHTML = "";

    questionsList.forEach(question => {
        const stats = question.stats;
        const total = stats.total_answers > 0 ? stats.total_answers : 1;
        const correctPercent = Math.round((stats.correct_count / total) * 100);

        // Генерация круговой диаграммы
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
        `;

        let contentRightHTML = '';

        // Логика для разных типов вопросов (Bar chart или облако тегов)
        if (question.type_question !== "input-gap") {
            let barsHTML = '';
            if (question.variants && question.variants.length > 0) {
                question.variants.forEach((variant) => {
                    let heightPercent = 0;
                    if (stats.total_answers > 0) {
                        heightPercent = Math.round((variant.count_choosen / stats.total_answers) * 100);
                    }
                    let visualHeight = heightPercent === 0 ? 1 : heightPercent;

                    let barColor = '#9a9a9a';
                    if (variant.is_correct) barColor = '#BBE3B3';
                    else if (variant.count_choosen > 0) barColor = '#FF767C';

                    barsHTML += `
                        <div class="bar-group" title="${variant.text} (Обрано: ${variant.count_choosen})">
                            <div class="bar-count">${variant.count_choosen}</div>
                            <div class="bar" style="height: ${visualHeight}%; background-color: ${barColor}"></div>
                            <span class="bar-label">${variant.text}</span>
                        </div>
                    `;
                });
            } else {
                barsHTML = '<div class="axis-label" style="width:100%; text-align:center; color:#b0b0b0">Немає даних</div>';
            }

            contentRightHTML = `
                <div class="chart-wrapper bar-wrapper">
                    <div class="visual-bars">
                        ${barsHTML}
                    </div>
                </div>
            `;
        } else {
            // ... (логика облака тегов, как в примере) ...
            const correctAnswersSet = new Set(
                question.variants.map(v => v.text.trim().toLowerCase())
            );

            const answersMap = {};
            if (question.users_variants && question.users_variants.length > 0) {
                question.users_variants.forEach(ans => {
                    const cleanAns = ans ? ans.toString() : "Порожньо";
                    answersMap[cleanAns] = (answersMap[cleanAns] || 0) + 1;
                });
            }

            const sortedAnswers = Object.entries(answersMap).sort((a, b) => b[1] - a[1]);

            let tagsHTML = '';
            if (sortedAnswers.length > 0) {
                sortedAnswers.forEach(([text, count]) => {
                    const isCorrect = correctAnswersSet.has(text.trim().toLowerCase());
                    const tagClass = isCorrect ? 'ans-tag correct' : 'ans-tag wrong';
                    
                    tagsHTML += `
                        <div class="${tagClass}">
                            <span class="ans-text">${text}</span>
                            <span class="ans-count">${count}</span>
                        </div>
                    `;
                });
            } else {
                tagsHTML = '<div class="no-data-text">Відповідей ще немає</div>';
            }

            contentRightHTML = `
                <div class="chart-wrapper answers-cloud-wrapper">
                    <div class="answers-header">Відповіді студентів:</div>
                    <div class="answers-cloud">
                        ${tagsHTML}
                    </div>
                </div>
            `;
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
        `;

        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
});