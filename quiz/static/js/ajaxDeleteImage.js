
$(document).ready(function(){
    $('.button-delete').each(function(){
        console.log("this =", $(this))
        $(this).on("click", function(){
            $.ajax({
                url: `/test/delete_image/${$(this).attr('pk')}`,
                type: "post",
            })
        })
    })
})