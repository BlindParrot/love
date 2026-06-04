const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const card = document.getElementById('card');
const sushiContainer = document.getElementById('sushiContainer');
const title = document.getElementById('title');

// Массив со вкусняшками, которые будут падать
const sushiMenu = ['🍣', '🍱', '🍤', '🥢', '🍙'];

noBtn.style.left = '160px';
noBtn.style.top = '0px';

// 1. Кнопка "Не хочу" убегает
noBtn.addEventListener('mouseover', () => {
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
});

// 2. Функция генерации случайного ролла
function createSushi() {
    const sushi = document.createElement('div');
    sushi.classList.add('sushi-item');
    
    // Выбираем случайный смайлик из массива
    const randomIcon = sushiMenu[Math.floor(Math.random() * sushiMenu.length)];
    sushi.innerHTML = randomIcon;
    
    sushi.style.left = Math.random() * 100 + 'vw';
    sushi.style.fontSize = Math.random() * 20 + 20 + 'px';
    
    const duration = Math.random() * 3 + 3;
    sushi.style.animationDuration = duration + 's';
    
    sushiContainer.appendChild(sushi);
    
    setTimeout(() => {
        sushi.remove();
    }, duration * 1000);
}

// 3. Обработка согласия
yesBtn.addEventListener('click', () => {
    noBtn.remove();
    
    // Меняем текст на победный
    title.innerHTML = 'Ура! Заказываем Филадельфию! Напиши мне, во сколько собираемся! 🥢🎉';
    yesBtn.style.display = 'none';
    card.style.transform = 'scale(1.1)';
    
    // Включаем суши-дождь
    setInterval(createSushi, 80);
});
