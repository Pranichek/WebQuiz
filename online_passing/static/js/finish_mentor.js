const socket = io()
const cardsContainer = document.querySelector(".user-list")

socket.emit("finish_mentor",{
    test_id: localStorage.getItem("test_id"),
    room: localStorage.getItem("room_code")
})

socket.on("list_results", data => {
    let users = data.users
    
    users.forEach(user => {



        const userCardDiv = document.createElement("div")
        userCardDiv.classList.add("user-card")
        userCardDiv.textContent = user.email
        cardsContainer.appendChild(userCardDiv)

        const outlineDiv = document.createElement("div")
        outlineDiv.classList.add("outline")
        userCardDiv.appendChild(outlineDiv)
        const fillDiv = document.createElement("div")
        fillDiv.classList.add("fill")
        outlineDiv.appendChild(fillDiv)

        const fillOutline = document.querySelector(".fill")



        console.log(user.email, user.accuracy)

        for (let i = 1; i <= parseInt(user.accuracy); i++) {
            fillDiv.style.width = "0%"; // старт с 0

            // даём браузеру время вставить элемент, и только потом меняем высоту
            setTimeout(() => {
                fillDiv.style.width = `${(parseInt(user.accuracy))}%`;
            }, 50); 
        }

        // for (let i = 0; i < 51; i++){
        //     setTimeout(() => {
        //         fillOutline.style.width = `${(currentAccuracy + 0.1) * parseInt(50)}%`;
        //     }, 200); 
        // }
        
        // while(currentAccuracy <= targerAccuracy) {
            
        //     setTimeout(() => {
        //         console.log("1")
        //         currentAccuracy += 1 
        //         fillOutline.style.width = `${currentAccuracy}%`
        //     }, 200);
            
        // }
    });
})


