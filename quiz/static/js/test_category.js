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
        ChangePhoto(text_li = li.textContent);
    })
}

function ChangePhoto(text_li){
    let testImage = document.querySelector(".test-cover");

    let mathPhoto = document.querySelector(".math-photo").getAttribute("data-math")
    let englishPhoto = document.querySelector(".english-photo").getAttribute("data-english")
    let programingPhoto = document.querySelector(".programin-photo").getAttribute("data-programing")
    let historyPhoto = document.querySelector(".history-photo").getAttribute("data-history")
    let physicsPhoto = document.querySelector(".physics-photo").getAttribute("data-physics")
    let chemistryPhoto = document.querySelector(".chemistry-photo").getAttribute("data-chemistry")
    let another = document.querySelector(".another-photo").getAttribute("data-another")

    let massive = [
        mathPhoto,
        englishPhoto,
        programingPhoto,
        historyPhoto,
        physicsPhoto,
        chemistryPhoto,
        another
    ]

    let index_li = Array.from(liList).findIndex(li => li.textContent === text_li);

    console.log(index_li)

    let imageName = null; 

    if (document.cookie.match("test_url")){
        imageName = document.cookie.split("test_url=")[1].split(";")[0];
    }

    if (imageName){
        if (massive.includes(imageName)){
            document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = `test_url=${massive[index_li]}; path=/;`;
            testImage.src = massive[index_li];
        }
    } else {
        document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `test_url=${massive[index_li]}; path=/;`;
        testImage.src = massive[index_li];
    }
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


function DeleteImage(){
    document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
}