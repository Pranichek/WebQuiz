window.addEventListener(
    'load',
    () => {
        let bonusInput = document.getElementById("bonus");
        bonusInput.style.width = `${bonusInput.dataset.value}%`;
    }
);
