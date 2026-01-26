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
        count++;
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
        `;
    });

    userCointainer.innerHTML = htmlContent

    setTimeout(() => {
        const bars = userCointainer.querySelectorAll('.fill-accuracy')
        bars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-width')
        })
    }, 100)

    let accuracyResult = data.accuracy_result
    let dataDiagram = []
    let dataLabels = []

    const colorArray = [
        'rgba(107, 58, 126, 1)', 
        'rgba(143, 97, 158, 1)', 
        'rgba(156, 127, 181, 1)',
        'rgba(179, 134, 197, 1)',
        'rgba(212, 168, 229, 1)'
    ];

    colorArray.sort(() => Math.random() - 0.5);
    let colorsDiagram = []
    
    for (let index = 0; index < accuracyResult.length; index++) {
        
        dataDiagram.push(accuracyResult[index][0]) 

        countPeople = accuracyResult[index][1]
        dataLabels.push(`Кількість людей: ${countPeople}`)

        // рандомінй цвет
        colorsDiagram.push(colorArray[index])
    }


    const ctx = document.querySelector('.myChart').getContext('2d');


    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataDiagram,
                backgroundColor: colorsDiagram,
                borderWidth: 0,
                borderColor: 'transparent'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true,
                    labels: {
                        color: "#ffffff",
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });

    let barLabels = []
    let barValues = []

    for (let i = 0; i < accuracyResult.length; i++) {
        barValues.push(accuracyResult[i][0])
        
        let labelFromServer = accuracyResult[i][2] || `< ${100 - (i * 20)}%`;
        barLabels.push(labelFromServer);
    }

    barLabels = data.bar_labels 
    barValues = data.bar_values

    // ... распоковівают маисв и предоставляют єлементі в нем как отдельніе аргументі(чтобі даже нету в поле значений то график біл) 
    const maxVal = Math.max(...barValues)

    const ctxBar = document.getElementById('accuracyChart').getContext('2d');

    const gradientBar = ctxBar.createLinearGradient(0, 0, 400, 0);
    gradientBar.addColorStop(0, 'rgba(107, 58, 126, 1)')
    gradientBar.addColorStop(1, 'rgba(179, 134, 197, 1)');

    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: barLabels,
            datasets: [
                {
                    data: barValues,
                    backgroundColor: gradientBar,
                    borderRadius: 4, 
                    barPercentage: 0.5, 
                    categoryPercentage: 1.0,
                    grouped: false, 
                    order: 1 
                },
                {
                    data: barValues.map(() => maxVal), 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 4,
                    barPercentage: 0.5,
                    categoryPercentage: 1.0,
                    grouped: false,
                    order: 2, 
                    hoverBackgroundColor: 'rgba(255, 255, 255, 0.05)' 
                }
            ]
        },
        
        options: {
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            
            interaction: {
                mode: 'y', 
                intersect: false
            },

            plugins: {
                legend: { display: false }, 
                tooltip: { 
                    enabled: true,
                    filter: function(tooltipItem) {
                        return tooltipItem.datasetIndex === 0
                    },
                    displayColors: true, 
                }
            },
            scales: {
                x: {
                    display: false, 
                    max: maxVal 
                },
                y: {
                    grid: { display: false, drawBorder: false },
                    ticks: {
                        color: '#ffffff', 
                    }
                },
                y2: {
                    position: 'right',
                    grid: { display: false, drawBorder: false },
                    ticks: {
                        color: '#ffffff',
                        callback: function(value, index) {
                            return barValues[index];
                        }
                    }
                }
            }
        }
    })

    const textAccuracy = document.querySelector(".accuracy-result")
    const averageAccuracy = data.average_accuracy
    textAccuracy.textContent = `${averageAccuracy}%`

    const dropdownList = document.querySelector(".dropdown-users");
    let dropdownContent = "";

    // Додаємо data-id, щоб потім знати кого вантажити
    users.forEach(user => {
        dropdownContent += `<div class="dropdown-item" data-id="${user.id}">${user.username}</div>`;
    });

    dropdownList.innerHTML = dropdownContent;

    // --- НОВА ЛОГІКА ДЛЯ КЛІКІВ ---
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            openUserModal(userId);
        });
    });
})

const arrow = document.querySelector(".solo-data img")
document.addEventListener("DOMContentLoaded", () => {
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
})


// Функція відкриття та завантаження
function openUserModal(userId) {
    // AJAX запит до Python
    fetch('/get_user_detail_stats', { // <-- Куда стучимся (адрес маршрута в Python)
        method: 'POST', // <-- Тип запроса (мы "постим", то есть передаем данные)
        headers: {
            'Content-Type': 'application/json' // <-- Говорим серверу: "Мы шлем тебе JSON"
        },
        body: JSON.stringify({
            user_id: userId, // Отправляем ID пользователя (аргумент функции)
            room: localStorage.getItem("room_code") // Отправляем код комнаты из памяти браузера
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            return
        }

        document.querySelector(".text-button").textContent = data.username
        
        document.getElementById('modal-username').textContent = data.username
        document.getElementById('modal-points').textContent = data.points
        document.getElementById('modal-accuracy').textContent = data.accuracy 
        document.getElementById('modal-avatar').src = data.avatar

    })
}

