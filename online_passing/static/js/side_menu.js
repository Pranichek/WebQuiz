document.addEventListener('click', () => {
    const sideMenu = document.querySelector('.side-menu');
    
    const openBtn = event.target.closest('#openMenuBtn');
    if (openBtn) {
        if (sideMenu) {
            sideMenu.classList.add('active-menu');
        }
        return;
    }

    const closeBtn = event.target.closest('#closeMenuBtn');
    if (closeBtn) {
        if (sideMenu) {
            sideMenu.classList.remove('active-menu');
        }
        return;
    }
});