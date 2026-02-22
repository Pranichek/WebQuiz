let currentChart = null

let diagramChoice = document.querySelector("#choice-diagram")

socket.emit("general-diagram",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code"),
    question_index: localStorage.getItem("index_question")
})

// чтобы можно было вибирать диграмы после того как заново нажал на кнопку все участники
document.addEventListener('change', (event) => {
    if (event.target && event.target.id === 'choice-diagram') {
        const diagramValue = event.target.value
        const params = {
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        }

        if (diagramValue == "general"){
            socket.emit("general-diagram", params)
        } else if(diagramValue == "dots-diagram"){
            socket.emit("dots-diagram", params)
        }else if(diagramValue == "time-diagram"){
            socket.emit("time-diagram", params)
        }else if(diagramValue == "general-student"){
            socket.emit("student_diagram", {
                id: localStorage.getItem("user_id"),
                test_id: localStorage.getItem("test_id"),
                room: localStorage.getItem("room_code")
            })
        }else if(diagramValue == "time-diagram-student"){
            socket.emit("time-student", {
                id: localStorage.getItem("user_id"),
                room: localStorage.getItem("room_code")
            })
        }
        else if(diagramValue == "column-diagram"){
            socket.emit("column-diagram", params)
        }
    }
})

diagramChoice.onchange = (event) => {
    const diagramValue = diagramChoice.value

    if (diagramValue == "general"){
        socket.emit("general-diagram",{
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        })
    }else if(diagramValue == "dots-diagram"){
        socket.emit("dots-diagram",{
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        })
    }else{
        socket.emit("column-diagram",{
            test_id: localStorage.getItem("test_id"),
            room: localStorage.getItem("room_code"),
            question_index: localStorage.getItem("index_question")
        })
    }
}

socket.on("general_diagram",
    data => {
        let accuracyResult = data.accuracy_result
        let dataDiagram = []
        let dataLabels = []

        const colorArray = [
    'rgba(138, 247, 212, 1)',  // Ваш мятно-салатовый (#8AF7D4)
    'rgba(196, 138, 247, 1)',  // Ваш фирменный фиолетовый (#C48AF7)
    'rgba(148, 196, 255, 1)',  // Ваш приятный голубой (#94C4FF)
    'rgba(241, 226, 114, 1)',  // Ваш мягкий желтый (#f1e272)
    'rgba(255, 118, 124, 1)'   // Ваш кораллово-красный (#FF767C)
];

        colorArray.sort(() => Math.random() - 0.5)
        let colorsDiagram = []
        
        for (let index = 0; index < accuracyResult.length; index++) {
            
            dataDiagram.push(accuracyResult[index][0]) 

            countPeople = accuracyResult[index][1]
            dataLabels.push(`Кількість людей: ${countPeople}`)

            colorsDiagram.push(colorArray[index])
        }


        const ctx = document.querySelector('.myChart').getContext('2d')

        if (currentChart) {
            currentChart.destroy()
        }

        currentChart = new Chart(ctx, {
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return  context.raw + '%';
                            }
                        }
                    }
                }
            }
        })

        let barLabels = []
        let barValues = []

        for (let i = 0; i < accuracyResult.length; i++) {
            barValues.push(accuracyResult[i][0])
            
            let labelFromServer = accuracyResult[i][2] || `< ${100 - (i * 20)}%`
            barLabels.push(labelFromServer)
        }

        barLabels = data.bar_labels 
        barValues = data.bar_values

        const maxVal = Math.max(...barValues)

        const ctxBar = document.getElementById('accuracyChart').getContext('2d')

        let existingBarChart = Chart.getChart(ctxBar)
        if (existingBarChart) {
            existingBarChart.destroy()
        }

        const gradientBar = ctxBar.createLinearGradient(0, 0, 400, 0)
        gradientBar.addColorStop(0, 'rgba(107, 58, 126, 1)')
        gradientBar.addColorStop(1, 'rgba(179, 134, 197, 1)')

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
                                return barValues[index]
                            }
                        }
                    }
                }
            }
        })
    }
)

socket.on("dots-diagram", data => {
    let rawProcents = data.list_procents || "" 
    let dataValues = rawProcents.split(" ").map(Number)
    let labels = data.list_question

    const ctx = document.querySelector('.myChart').getContext('2d')

    if (currentChart) {
        currentChart.destroy()
    }

    currentChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels, 
            datasets: [{
                label: 'Середній бал за питання (%)',
                data: dataValues, 
                backgroundColor: 'rgba(179, 134, 197, 1)', 
                borderColor: 'rgba(179, 134, 197, 0.5)',   
                borderWidth: 2,
                pointRadius: 6,       
                pointHoverRadius: 8,  
                pointBackgroundColor: '#ffffff', 
                pointBorderColor: 'rgba(179, 134, 197, 1)', 
                pointBorderWidth: 2,
                tension: 0.3, 
                fill: true, 
                clip: false,  
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
                    gradient.addColorStop(0, 'rgba(179, 134, 197, 0.5)')
                    gradient.addColorStop(1, 'rgba(179, 134, 197, 0)')
                    return gradient
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Точність: ${context.raw}%`
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100, 
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#ffffff' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#ffffff' },
                    title: {
                        display: true,
                        text: 'Номер питання',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    })
})

socket.on("column-diagram", data => {
    const correctData = data.correct_answers;
    const incorrectData = data.uncorrect_answers;
    
    const labels = correctData.map((_, i) => i + 1);

    const incorrectDataNegative = incorrectData.map(val => -val);

    const ctx = document.querySelector('.myChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Правильні',
                    data: correctData,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderRadius: {
                        topLeft: 4,
                        topRight: 4,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false,
                },
                {
                    label: 'Неправильні',
                    data: incorrectDataNegative,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderRadius: {
                        topLeft: 0,
                        topRight: 0,
                        bottomLeft: 4,
                        bottomRight: 4
                    },
                    borderSkipped: false, 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: "#ffffff" }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            if (label) {
                                label += ': ';
                            }
                            label += Math.abs(value);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { color: '#ffffff' },
                    grid: { display: false },
                    title: {
                        display: true,
                        text: 'Питання',
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: { size: 14 },
                        padding: { top: 10 }
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#ffffff',
                        stepSize: 1, 
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return Math.abs(value); 
                            }
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        zeroLineColor: '#ffffff',
                        zeroLineWidth: 2
                    }
                }
            }
        }
    });
});

socket.on("time_diagrams", data => {
    const labels = data.uesetions_list; 
    const timeData = data.avarage_time;

    const ctx = document.querySelector('.myChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(107, 58, 126, 1)');   
    gradient.addColorStop(1, 'rgba(179, 134, 197, 1)'); 

    currentChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Середній час',
                data: timeData,
                backgroundColor: gradient,
                borderRadius: 6, 
                borderWidth: 0,
                barPercentage: 0.6, 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Середній час: ${context.raw} с`;
                        },
                        title: function(context) {
                            return `Питання №${context[0].label}`;
                        }
                    }
                },
                title: {
                    display: false,
                    text: 'Середній час на кожне питання (секунди)',
                    color: '#ffffff',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 10
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return value + ' с'; 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Час (сек)',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff'
                    },
                    title: {
                        display: true,
                        text: 'Номер питання',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });
});