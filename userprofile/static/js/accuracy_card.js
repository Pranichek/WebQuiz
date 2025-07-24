let fillBars = document.querySelectorAll(".fill-bar")


window.addEventListener(
    "load",
    () => {
        for (let fillBar of fillBars){
            let accuracy = fillBar.dataset.accuracy
            if (accuracy != 0){
                fillBar.style.width = accuracy + "%"
                let procentText = fillBar.nextElementSibling
                
                let currentprocent = 0
                let interval = setInterval(() => {
                    if (currentprocent < accuracy){
                        currentprocent += 1
                        fillBar.style.width = currentprocent + "%"
                        procentText.textContent = currentprocent + "%"
                        procentText.style.width = currentprocent + "%"

                    }else{
                        clearInterval(interval)
                    }
                }, 10)
                
            }else{
                fillBar.style.width = "0%";
                let procentText = fillBar.nextElementSibling
                procentText.textContent = "0%"
            }
        }
    }
)
