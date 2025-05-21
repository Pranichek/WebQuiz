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
        timeList.classList.add("hidden-list");
        document.cookie = `category=${li.textContent}; path=/;`;
    })
}

window.addEventListener(
    'load',
    () => {
        let cookies = document.cookie.match("category")
        if (cookies){
            let cookiename = document.cookie.split("category=")[1].split(";")[0];
            time.textContent = cookiename
        }else{
            time.textContent = "оберіть категорію тесту "
        }
    }
)