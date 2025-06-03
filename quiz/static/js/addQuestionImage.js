const imageInput = document.getElementById("imgInput");
const deleteImgButton = document.getElementById("deleteImgButton");

function imageLoaded(){
    deleteImgButton.style.display = "flex";
}

function deleteImage(){
    imageInput.value = null;
    deleteImgButton.style.display = "none";
}