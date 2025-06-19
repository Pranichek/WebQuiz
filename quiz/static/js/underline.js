const input = document.getElementById('testInput');
const mirror = document.getElementById('mirror');
const underline = document.querySelector('.under-line');



function updateUnderline() {
    mirror.textContent = input.value || input.placeholder || '';
    underline.style.width = mirror.offsetWidth + 'px';
}

input.addEventListener('input', updateUnderline);
window.addEventListener('load', updateUnderline);