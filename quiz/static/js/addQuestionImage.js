const imageInput = document.getElementById("imgInput");
const deleteImgButton = document.getElementById("deleteImgButton");

function imageLoaded(){
    deleteImgButton.style.display = "flex";
}

function deleteImage(){
    imageInput.value = null;
    deleteImgButton.style.display = "none";
    $(this).on("click", function(){
        let questionPk = document.getElementById("pk").textContent;
        let testPk = document.querySelector(".backButton").id;
        if (testPk){
            $.ajax({
                url: `/test/delete_only_image/${questionPk}?test_pk=${testPk}`,
                type: "post",
            })
        } else{
            $.ajax({
                url: `/test/delete_only_image/${questionPk}`,
                type: "post",
            })
        }
    })
}