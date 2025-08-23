const input = document.getElementById('testInput');
const mirror = document.getElementById('mirror');
const underline = document.querySelector('.under-line');

function updateUnderline() {
    mirror.textContent = input.value || input.placeholder || '';

    const inputParentWidth = input.parentElement.offsetWidth;
    const mirrorWidth = mirror.offsetWidth;

    const maxWidth = inputParentWidth * 1; // максимум 200% от родителя

    // Вычисляем новую ширину, но не больше maxWidth
    const finalWidth = Math.min(mirrorWidth, maxWidth);

    // Проверка перед установкой ширины
    if (finalWidth <= maxWidth) {
        input.style.width = finalWidth + 'px';
        underline.style.width = finalWidth + 'px';
    }
}


input.addEventListener('input', updateUnderline);
window.addEventListener('load', updateUnderline);