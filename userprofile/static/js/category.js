const timeList = document.getElementById("timeList");
const liList = document.getElementsByTagName("li");
const time = document.getElementById("time");
let answerInputList = document.querySelectorAll(".answer");

function decodeEscapedUtf8(str) {
    // Step 1: Convert escape sequences to a byte array
    const bytes = str.replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
  
    // Step 2: Decode the UTF-8 bytes into a Unicode string
    const decoder = new TextDecoder('utf-8');
    const uint8Array = new Uint8Array([...bytes].map(ch => ch.charCodeAt(0)));
    return decoder.decode(uint8Array);
  }

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

if (document.cookie.match("category") != ""){
    time.textContent = decodeEscapedUtf8(document.cookie.split("category=")[1].split(";")[0]).replace('"', "").replace('"', "");
}

function ChangePhoto(text_li){
    let testImage = document.querySelector(".test-cover");

    const da = testImage.src.split("/");

    if (!da.includes("cash_test")){
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
    // console.log("pred" , testImage.src)
}

function DeleteImage(){
    let cookies = document.cookie.match("test_url")
    document.querySelector("#del_form").submit();
    if (cookies){
        document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}