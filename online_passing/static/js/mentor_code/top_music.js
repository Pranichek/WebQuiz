const bgMusic = new Audio('/static/audio/online_test.mp3');

bgMusic.loop = true; 
bgMusic.volume = 0.3; 

export function playBackgroundMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(error => {
            console.warn("Автовоспроизведение заблокировано браузером. Нужна интеракция пользователя.", error);
        });
    }
}

export function stopBackgroundMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0; 
}

export function toggleMute() {
    bgMusic.muted = !bgMusic.muted;
    return bgMusic.muted;
}