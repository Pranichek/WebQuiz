let buttonPlus = document.querySelector(".add_task")
let divChoice = document.querySelector(".choice")
let divAnnouncement = document.querySelector(".announcement")
let divTestTask = document.querySelector(".test_task")
let divNextTestTask = document.querySelector(".next_test_task")
let buttonAnnouncement = document.querySelector(".announcement-btn")
let buttonTestTask = document.querySelector(".test_task-btn")
let buttonChooseTest = document.querySelector(".choose-test")
let buttonCreateTask = document.querySelector(".create_task")
const weeksInput = document.querySelector(".week_data")
const daysInput = document.querySelector(".days_data")
const hoursInput = document.querySelector(".hours_data")
const minutesInput = document.querySelector(".minutes_data")
// let buttonCreateTestTask = document.querySelector(".create_test_task")
const socket = io()
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const inputFile = document.querySelector("#file-upload")
const id = urlParams.get('class_id')

socket.emit("join_mentor", {"id": id})


function showWithFade(el) {
  el.style.display = "flex";           
  el.classList.remove("is-open");      
  requestAnimationFrame(() => {        
    el.classList.add("is-open");
  });
}

function hideWithFade(el) {
  el.classList.remove("is-open");   
  setTimeout(() => {                   
    el.style.display = "none";
  }, 280);
}



buttonPlus.addEventListener(
    "click",
    () => {
        console.log(12)
        divChoice.style.display = "flex"
        divAnnouncement.style.display = "none"

        showWithFade(divChoice);
        hideWithFade(divAnnouncement);
    }
)
buttonAnnouncement.addEventListener(
    "click",
    () => {
        divChoice.style.display = "none"
        divAnnouncement.style.display = "flex"

        hideWithFade(divChoice);
        showWithFade(divAnnouncement);
    }
)
buttonTestTask.addEventListener(
    'click',
    () => {
        divChoice.style.display = "none"
        divTestTask.style.display = "flex"

        hideWithFade(divChoice);
        showWithFade(divTestTask);
    }
)

buttonChooseTest.addEventListener(
    'click',
    () => {
        divTestTask.style.display = "none"
        divNextTestTask.style.display = "flex"

        hideWithFade(divTestTask);
        showWithFade(divNextTestTask);
    }
)


$("#taskForm").on("submit", function(e) {
    e.preventDefault();

    let formData = new FormData(this);

    $.ajax({
        url: window.location.href,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {

            let newTask = `
                <div class="task">
                    <div class="info_div">
                        <img src="/static/mentor_class/images/book.svg" class="book">
                        <div>
                            <p class="name">${res.topic}, ${res.task_info}</p>
                            <p class="term">термін події..</p>
                        </div>
                    </div>
                    <div class="right-head"></div>
                </div>
            `;

            document.querySelector(".tasks").innerHTML += newTask;
            divAnnouncement.style.display = "none"
            hideWithFade(divAnnouncement);
        }
    });

    socket.emit("new_task", {"status":"ok", "id":id})
});


// buttonCreateTask.addEventListener(
//     'click',
//     () => {
//         socket.emit(
//             'create_task',
//             {
//                 theme: document.querySelector(".topic").value,
//                 information: document.querySelector(".task_info").value,
//                 class_id: urlParams.get('class_id'),
//                 weeks: weeksInput.value,
//                 days: daysInput.value,
//                 hours: hoursInput.value,
//                 minutes: minutesInput.value,
//                 file: inputFile.files[0]
//             }
//         )
  
//         location.reload()    
//     }
// )
// fileInput.files[0];