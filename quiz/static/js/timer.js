document.addEventListener('DOMContentLoaded', () => {
    const timeList = document.getElementById("timeList");
    const liList = document.querySelectorAll(".list-time");
    const timerP = document.querySelector(".timer-p");
    const timeText = document.getElementById("time-text");
    const timerArrow = document.querySelector(".timer-arrow");

    timerP.addEventListener("click", (event) => {
        event.stopPropagation(); 

        const isListOpen = timeList.classList.contains("show-list");

        timeList.classList.toggle("show-list");
        timerP.classList.toggle("active"); 

        if (!isListOpen) {
            timeList.style.maxHeight = timeList.scrollHeight + "px";
        } else {
            timeList.style.maxHeight = "0";
        }
    });

    for (let li of liList) {
        li.addEventListener("click", (event) => {
            event.stopPropagation(); 

            timeText.textContent = li.textContent;
            
            timerP.dataset.time = li.dataset.time; 
            
            timeList.style.maxHeight = "0";
            timeList.classList.remove("show-list");
            timerP.classList.remove("active"); 
            
            localStorage.setItem("selectedTime", li.dataset.time); 
        });
    }

    document.addEventListener('click', (event) => {
        const timerContainer = document.querySelector('.timer'); 
        if (!timerContainer.contains(event.target) && timeList.classList.contains('show-list')) {
            timeList.style.maxHeight = '0';
            timeList.classList.remove('show-list');
            timerP.classList.remove('active');
        }
    });
});