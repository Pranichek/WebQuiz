const socket = io();

let currentChart = null;

const getUserId = () => localStorage.getItem("user_id") || document.querySelector(".user_id")?.dataset.id;
const getTestId = () => localStorage.getItem("test_id");
const getRoomCode = () => localStorage.getItem("room_code");

document.addEventListener('change', (event) => {
    if (event.target && event.target.id === 'choice-diagram') {
        const diagramValue = event.target.value;

        if (diagramValue == "general-student") {
            socket.emit("student_diagram", {
                id: localStorage.getItem("user_finish-id"),
                test_id: getTestId(),
                room: getRoomCode()
            });
        } 
        else if (diagramValue == "time-diagram-student") {
            socket.emit("time-student", {
                id: localStorage.getItem("user_finish-id"),
                room: getRoomCode()
            });
        }
    }
});

socket.on("dots-diagram", data => { 
    let rawProcents = data.list_procents;
    let dataValues = rawProcents.split(" ").map(Number);
    let labels = data.list_question;

    console.log(rawProcents, "sndjhdsnjk")
    console.log(labels)

    const canvas = document.querySelector('.myChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels, 
            datasets: [{
                label: 'Середній бал за питання (%)',
                data: dataValues, 
                backgroundColor: 'rgba(126, 162, 206, 1)',
                borderColor: 'rgba(126, 162, 206, 0.5)',
                borderWidth: 2,
                pointRadius: 6,       
                pointHoverRadius: 8,  
                pointBackgroundColor: '#ffffff', 
                pointBorderColor: 'rgba(126, 162, 206, 1)',
                pointBorderWidth: 2,
                tension: 0.3, 
                fill: true, 
                clip: false,  
                backgroundColor: (context) => {
                    const chartCtx = context.chart.ctx;
                    const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(126, 162, 206, 0.5)');
                    gradient.addColorStop(1, 'rgba(126, 162, 206, 0)');
                    return gradient;
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
                            return `Точність: ${context.raw}%`;
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
    });
});

socket.on("time_diagrams", data => {
    const labels = data.uesetions_list; 
    const timeData = data.avarage_time;

    const canvas = document.querySelector('.myChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 59, 79, 1)');
    gradient.addColorStop(1, 'rgba(126, 162, 206, 1)');

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

socket.on("students_graphics", () => {
    socket.emit("student_diagram", {
        id: localStorage.getItem("user_finish-id"),
        test_id: localStorage.getItem("test_id"), 
        room: localStorage.getItem("room_code") 
    });
})
