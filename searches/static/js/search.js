
window.addEventListener(
    'load',
    () => {
        document.querySelector(".search-data").value = localStorage.getItem("filter_data")
        document.querySelector("#search-data").submit();
    }
)