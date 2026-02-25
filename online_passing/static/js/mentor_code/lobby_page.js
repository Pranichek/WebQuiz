function loadLobby(user){
    const mainBlock = document.querySelector(".main")

    mainBlock.innerHTML = `
        <h1>Привіт, ${user.username}</p>
    `
}