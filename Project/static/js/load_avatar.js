window.addEventListener(
    'DOMContentLoaded',
    () => {
        let AvatarImage = document.querySelector(".avatar")
        let finish = document.querySelector(".img-achiv")
        
        if (AvatarImage){
            // подгружаем размер картинки тот что установил пользователь
            AvatarImage.style.width = `${AvatarImage.dataset.size}%`;
            AvatarImage.style.height = `${AvatarImage.dataset.size}%`;
            console.log(AvatarImage.dataset.size, "abradakadav ")

            document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        if (finish){
            // подгружаем размер картинки тот что установил пользователь
            finish.style.width = `${finish.dataset.size}%`;
            finish.style.height = `${finish.dataset.size}%`;
            console.log(finish.dataset.size, "abradakadav ")

            document.cookie = "users_answers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }
)

const overlay = document.getElementById('circle-overlay');
const links = document.querySelectorAll(".svaedanim");

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // сторінка завантажена з bfcache (кеш назад/вперед)
    overlay.classList.remove('active');
  }
});
window.addEventListener('load', () => {
    overlay.classList.remove('active');
});

for (let link of links) {
link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript')) return;

    e.preventDefault();

    overlay.classList.add('active');

    setTimeout(() => {
    window.location.href = href;
    }, 711);
});
}