const socket_wait = io() 

socket_wait.emit(
    "connect_again",
    {code: localStorage.getItem("room_code_user")}
)

socket_wait.emit(
    "get_data",
    {id_test: localStorage.getItem("test_id"), index_question: localStorage.getItem("index_question")}
)


socket_wait.on("page_result",
    data => {
        window.location.replace("/result_student")
    }
)

socket_wait.on("show_data",
    data => {
        const cont = document.querySelector(".question")

        if (data["image"] != "not"){
            const img = document.createElement("img")
            img.src = data["image"]
            img.style.width = "40vw"
            img.style.height = "40vw"
            cont.appendChild(img)
        }
        const question = document.createElement("p")
        question.textContent = data["question"]
        cont.appendChild(question)
    }
)



