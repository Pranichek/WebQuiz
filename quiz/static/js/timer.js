const timeList = document.getElementById("timeList");
const liList = document.querySelectorAll(".list-time")
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
        const timeEl = document.querySelector("#time");
        const imgUrl = timeEl.dataset.img;

        timeEl.innerHTML += `<img src="${imgUrl}">`; 
        timeList.classList.add("hidden-list");
        localStorage.setItem("timeData", li.value)
    })
}