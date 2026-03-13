const bgMusic = new Audio('/static/audio/online_test.mp3');

bgMusic.loop = true; 
bgMusic.volume = 0.3; 

const attemptPlay = () => {
    if (bgMusic.paused) {
        bgMusic.play()
    }
};

export function playBackgroundMusic() {
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            const unlock = () => {
                bgMusic.play();
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
            };
            document.addEventListener('click', unlock);
            document.addEventListener('keydown', unlock);
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

socket.on("page_waiting", () => {
    stopBackgroundMusic();
});

socket.on('student_question', () => {
    playBackgroundMusic()
})