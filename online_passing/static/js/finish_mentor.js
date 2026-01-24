const socket = io()
const cardsContainer = document.querySelector(".user-list")

socket.emit("finish_mentor",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code"),
    question_index: localStorage.getItem("index_question")
})

socket.on("list_results", data => {
    let users = data.users
    document.querySelector(".best_question").textContent = `${data.best_question}%`
    document.querySelector(".text-question").textContent = data.text_best
    let count = 0
    // користувачі, що проходили тест(їхні блоки)
    document.querySelector(".count-people").textContent = `${users.length} учасників`

    document.querySelector(".worst_question").textContent = `${data.worst_question}%`
    document.querySelector(".worst_text").textContent = data.text_worst


    users.forEach(user => {
        count++
        const userCardDiv = document.createElement("div")

        userCardDiv.classList.add("user-card")
        // userCardDiv.textContent = user.email

        // місце користувача
        const divPlace = document.createElement("div")
        divPlace.className = "div-place"
        const textPlace = document.createElement("p")
        textPlace.textContent = `№ ${count}`
        divPlace.appendChild(textPlace)
        userCardDiv.appendChild(divPlace)


        // ім'я
        const nameDiv = document.createElement("div")

        const avatarImg = document.createElement("img")
        avatarImg.classList.add("ava")
        avatarImg.src = user.user_avatar

        const obodokAva = document.createElement("div")
        obodokAva.className = "ava-obodok"
        obodokAva.appendChild(avatarImg)

        nameDiv.appendChild(obodokAva)

        nameDiv.className = "div-name"
        const textName = document.createElement("p")
        textName.textContent = user.username
        nameDiv.appendChild(textName)

        userCardDiv.appendChild(nameDiv)

        // Бали
        const pointsDiv = document.createElement("div")
        pointsDiv.className = "div-points"
        const textPoints = document.createElement("p")
        textPoints.textContent = user.count_points
        pointsDiv.appendChild(textPoints)
        userCardDiv.appendChild(pointsDiv)

        cardsContainer.appendChild(userCardDiv)


        const outlineDiv = document.createElement("div")
        outlineDiv.classList.add("outline")
        userCardDiv.appendChild(outlineDiv)
        const fillDiv = document.createElement("div")
        fillDiv.classList.add("fill")
        outlineDiv.appendChild(fillDiv)

        for (let i = 1; i <= parseInt(user.accuracy); i++) {
            fillDiv.style.width = "0%"; // старт с 0

            // даём браузеру время вставить элемент, и только потом меняем высоту
            setTimeout(() => {
                fillDiv.style.width = `${(parseInt(user.accuracy))}%`;
            }, 50); 
        }
    });

    let accuracyResult = data.accuracy_result
    let dataDiagram = []
    let dataLabels = []

    const colorArray = [
        'rgba(107, 58, 126, 0.7)', 
        'rgba(143, 97, 158, 0.7)', 
        'rgba(156, 127, 181, 0.7)',
        'rgba(179, 134, 197, 0.7)',
        'rgba(212, 168, 229, 0.7)'
    ];

    colorArray.sort(() => Math.random() - 0.5);
    let colorsDiagram = []
    
    for (let index = 0; index < accuracyResult.length; index++) {
        
        dataDiagram.push(accuracyResult[index][0]) 

        countPeople = accuracyResult[index][1]
        dataLabels.push(`Кількість людей: ${countPeople}`)

        // Generate a random index
        // const randomIndex = Math.floor(Math.random() * colorArray.length)
        // Get the element at the random index
        colorsDiagram.push(colorArray[index])
    }


    const ctx = document.querySelector('.myChart').getContext('2d');// полотно которое нужно именно в 2d


    new Chart(ctx, {
        type: 'pie',// тип диграмvы пирог
        data: {
            labels: dataLabels,// надписи при наведении на диаграму
            datasets: [{
                data: dataDiagram, // сами значения люлдей
                backgroundColor: colorsDiagram,
                borderWidth: 0,
                borderColor: 'transparent'
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                position: 'bottom',//надписи, котороые можно отключить
                display:false
                },
                title: {
                display: false
                }
            }
        }
    });

    const textAccuracy = document.querySelector(".average_accuracy")
    const averageAccuracy = data.average_accuracy
    textAccuracy.textContent = `${averageAccuracy}%`
})

