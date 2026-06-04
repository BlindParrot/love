const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const card = document.getElementById('card');
const heartsContainer = document.getElementById('heartsContainer');
const title = document.getElementById('title');

// Инициализируем начальное положение кнопки "Нет" внутри контейнера кнопок
noBtn.style.left = '160px';
noBtn.style.top = '0px';

// 1. Кнопка "Нет" убегает при наведении
noBtn.addEventListener('mouseover', () => {
    // Вычисляем случайные координаты по всему экрану
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    // Переводим кнопку в absolute относительно всего экрана
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
});

// 2. Эффект падающих сердечек
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    
    // Случайная позиция по горизонтали и размер
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    
    // Случайная скорость падения (от 3 до 6 секунд)
    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    // Удаляем сердечко после окончания анимации
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// 3. Обработка согласия (нажатие на "ДА")
yesBtn.addEventListener('click', () => {
    // Убираем кнопку "Нет" совсем
    noBtn.remove();
    
    // Меняем текст и стили карточки
    title.innerHTML = 'Ура-а-а! Я знал(а)! Люблю тебя! 💖<br><br><span style="font-size: 50px;">🥰</span>';
    yesBtn.style.display = 'none';
    card.style.transform = 'scale(1.1)';
    
    // Запускаем мощный фонтан из сердечек
    setInterval(createHeart, 100);
});
