const timer = document.querySelector(".timer");
const timeList = document.getElementById("timeList");
const liList = document.getElementsByTagName("li");
const time = document.getElementById("time");

timer.addEventListener("click", ()=>{
    if (timeList.classList.contains("hidden-list")){
        timeList.classList.remove("hidden-list");
    } else{
        timeList.classList.add("hidden-list");
    }
    
})

for (let li of liList){
    li.addEventListener("click", ()=>{
        time.textContent = li.textContent;
        timeList.classList.remove("hidden-list");
    })
}