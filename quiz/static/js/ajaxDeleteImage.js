$(document).ready(function(){
    console.log("buttons =", $('.button-delete'))
    $('.button-delete').each(function(){
        console.log("this =", $(this))
        $(this).on("click", function(){
            try{
                let pk = $(this).attr("id");
                $.ajax({
                    url: `/test/delete_image/${$(this).attr('pk')}?test_pk=${pk}`,
                    type: "post",
                })
            } catch{
                $.ajax({
                    url: `/test/delete_image/${$(this).attr('pk')}`,
                    type: "post",
                })
            }
        })
    })
})