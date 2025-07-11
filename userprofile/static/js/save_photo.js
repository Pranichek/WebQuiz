const takePhotoDiv = document.getElementById('take-photo');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

takePhotoDiv.addEventListener('click', async () => {
    try {
        // Получаем доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        video.srcObject = stream;
        video.style.display = 'block';

        // Ждём, когда поток подгрузится
        await new Promise(resolve => {
            video.onloadedmetadata = () => resolve();
        });

        // Устанавливаем размеры и делаем фото
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');

        // Останавливаем камеру
        stream.getTracks().forEach(track => track.stop());
        video.style.display = 'none';

        // Отправляем фото на сервер
        const response = await fetch('/save_photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl })
        });

        const result = await response.json();
        alert(result.message || 'Фото збережено');

        // При желании — обнови картинку в интерфейсе
        document.querySelector('#added_photo').src = dataUrl;

    } catch (err) {
        alert('Не вдалося зробити фото');
        console.error(err);
    }
});