const socket = io()
const urlParams = new URLSearchParams(window.location.search)
const myParam = urlParams.get('code')

socket.emit(
    "join_room",
    {"code":myParam}
)

socket.on("new_for_student",
    () => {
        console.log("hinisdfvdskfnvkjsvfjkn")
    }
)