let modal = document.querySelector(".modal-image")

function ShowModal(){
    modal.style.display = "flex";
}


function CloseModal(){
    modal.style.display = "none";
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
    'load',
    () => {
        let cookies = document.cookie.match("test_url")
        let testimage = document.querySelector(".test-cover")
        
        let testImage = document.querySelector(".test-cover");
        const da = testImage.src.split("/");

        if (!da.includes("cash_test")){
            if (cookies){
                const testimageurl = document.cookie.split("test_url=")[1].split(";")[0];
                testimage.src = testimageurl
            }
        }
    }
)

function sumbmitIMage(){
    document.querySelector("#image_form").submit();
}

