console.log("ajax is working 1 ...")

$(document).ready(function(){
    console.log("buttons =", $('.button-delete'))
    $('.button-delete').each(function(){
        console.log("this =", $(this))
        $(this).on("click", function(){
            console.log("ajax is working 2 ...")
            $.ajax({
                url: `/test/delete_image/${$(this).attr('pk')}`,
                type: "post",
            })
        })
    })
})