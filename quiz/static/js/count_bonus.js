window.addEventListener(
    'load',
    () => {
        console.log("Bonus script loaded");
        let bonusInput = document.getElementById("bonus");
        console.log(bonusInput.dataset.value, "sdfds")
        bonusInput.style.width = `${bonusInput.dataset.value}%`;
    }
);
