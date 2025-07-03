window.addEventListener(
    'DOMContentLoaded',
    () => {
        let startvalue = parseInt(document.querySelector(".count-money").dataset.value)
        document.querySelector(".count-money").textContent = startvalue;
    }
)