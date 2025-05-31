const timeList = document.getElementById("timeList");
const liList = document.getElementsByTagName("li");
const time = document.getElementById("time");

time.addEventListener("click", ()=>{
    if (timeList.classList.contains("hidden-list")){
        timeList.classList.remove("hidden-list");
    } else{
        timeList.classList.add("hidden-list");
    }
    
})

for (let li of liList){
    li.addEventListener("click", ()=>{
        time.textContent = li.textContent;
        time.dataset.time = li.dataset.time;
        timeList.classList.add("hidden-list");
    })
}