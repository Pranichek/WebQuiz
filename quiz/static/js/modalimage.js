const modal = document.querySelector('.modal-image');

function openModal() {
    modal.classList.add('active');
    document.querySelector(".modal-backdrop").classList.add("active");
}

function closeModal() {
    console.log("1")
    document.querySelector(".modal-backdrop").classList.remove("active");
    modal.classList.remove('active');
}
const previewImage = (event) => {
    const files = event.target.files
    if(files.length > 0){
        const ImageUrl = URL.createObjectURL(files[0]);
        let imageelement = document.querySelector("#show_image_test");
        imageelement.src = ImageUrl;
    }
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        let cookies = document.cookie.match("test_url")
        let testimage = document.querySelector(".test-cover")
        
        let testImage = document.querySelector(".test-cover");
        const da = testImage.src.split("/");

        if (!da.includes("cash_test")){
            if (cookies){
                const testimageurl = document.cookie.split("test_url=")[1].split(";")[0];
                testimage.src = testimageurl
            }else{
                const testimageurl = document.querySelector(".another-photo").dataset.another
                testimage.src = testimageurl
            }
        }
    }
)

function sumbmitIMage(){
    document.querySelector("#image_form").submit();
}
