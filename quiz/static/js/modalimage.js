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

        let cookies = document.cookie.match("test_url")
        if (cookies){
            document.cookie = "test_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        document.cookie = `test_url=${ImageUrl}; path=/;`;
    }
}

window.addEventListener(
    'load',
    () => {
        let cookies = document.cookie.match("test_url")
        let testimage = document.querySelector(".test-cover")
        let testimageurl = document.cookie.split("test_url=")[1].split(";")[0];
        if (cookies){
            testimage.src = testimageurl
        }
    }
)

function sumbmitIMage(){
    document.querySelector("#image_form").submit();
}

