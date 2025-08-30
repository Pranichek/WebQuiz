let buttonPlus = document.querySelector(".add_task")
let divChoice = document.querySelector(".choice")
let divAnnouncement = document.querySelector(".announcement")
let buttonAnnouncement = document.querySelector(".announcement-btn")
let buttonCreateTask = document.querySelector(".create_task")
const socket = io()
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)



buttonPlus.addEventListener(
    "click",
    () => {
        divChoice.style.display = "flex"
        divAnnouncement.style.display = "none"
    }
)
buttonAnnouncement.addEventListener(
    "click",
    () => {
        divChoice.style.display = "none"
        divAnnouncement.style.display = "flex"
    }
)


buttonCreateTask.addEventListener(
    'click',
    () => {
        socket.emit(
            'create_task',
            {
                theme: document.querySelector(".topic").value,
                information: document.querySelector(".task_info").value,
                class_id: urlParams.get('class_id')
            }
        )
  
        location.reload()    
    }
)