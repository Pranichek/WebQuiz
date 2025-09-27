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




// ДОБАВИТЬ: простое закрытие любых окон по клику мимо и по Esc
const modals = document.querySelectorAll('.choice, .announcement, .test_task, .next_test_task');

document.addEventListener('click', (e) => {
  // если кликнули внутри любого окна — ничего не делаем
  for (const m of modals) { if (m.contains(e.target)) return; }

  // если клик по кнопкам-открывателям — тоже выходим
  if (e.target.closest('.add_task, .announcement-btn, .test_task-btn')) return;

  // иначе — закрываем все
  modals.forEach(m => {
    m.classList?.remove('is-open'); // если используешь анимацию
    m.style.display = 'none';
  });
});