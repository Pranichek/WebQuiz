window.addEventListener(
    'DOMContentLoaded',
    () => {
        let startvalue = parseInt(document.querySelector(".count-money").dataset.value)
        document.querySelector(".count-money").textContent = startvalue;
        // let startNum = Math.round(startvalue / 2)

        // let delay = 20; 
        // let step = 1;   
        // let totalDelay = 0;
        // // document.querySelector(".count-money").textContent = startNum;
        // for (let i = startNum; i < startvalue; i++) {
        //     // console.log(i);
        //     totalDelay += delay;
        //     if (delay >= 40){
        //         delay = 40;
        //     }
        //     setTimeout(() => {
        //         document.querySelector(".count-money").textContent = i + 1;
        //     }, totalDelay);
        //     delay += step;
        // }
    }
)