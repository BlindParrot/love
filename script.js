const gameWrapper = document.getElementById('gameWrapper');
const mainCard = document.getElementById('mainCard');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const title = document.getElementById('title');
const heartsContainer = document.getElementById('heartsContainer');

// Настройки размеров игрового поля
canvas.width = 360;
canvas.height = 450;

let score = 0;
let gameOver = false;

// Объект игрока (корзинка/сердце-приёмник)
const player = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 40,
    width: 70,
    height: 25,
    emoji: '🧺'
};

// Массив падающих предметов
let items = [];
const itemTypes = [
    { text: '❤️', type: 'good', score: 1 },
    { text: '💖', type: 'good', score: 1 },
    { text: '💝', type: 'good', score: 1 },
    { text: '💔', type: 'bad', score: -1 }
];

// Управление игроком через движение мыши или тач на мобилке
const handleMove = (clientX) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const rootX = clientX - rect.left;
    player.x = rootX - player.width / 2;
    
    // Границы поля
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
};

window.addEventListener('mousemove', (e) => handleMove(e.clientX));
window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) handleMove(e.touches[0].clientX);
});

// Спавн предметов
function spawnItem() {
    if (gameOver) return;
    const randType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -30,
        speed: Math.random() * 2 + 2.5,
        text: randType.text,
        type: randType.type,
        score: randType.score,
        size: 26
    });
    // Частота спавна зависит от текущего счёта
    setTimeout(spawnItem, Math.max(400, 900 - score * 40));
}

// Главный игровой цикл
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка игрока
    ctx.font = "32px Arial";
    ctx.fillText(player.emoji, player.x, player.y + 15);

    // Движение предметов
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item.y += item.speed;

        // Рисуем предмет
        ctx.font = `${item.size}px Arial`;
        ctx.fillText(item.text, item.x - item.size/2, item.y);

        // Проверка столкновения с игроком
        if (item.y >= player.y - 10 && item.y <= player.y + player.height &&
            item.x >= player.x && item.x <= player.x + player.width) {
            
            score += item.score;
            if (score < 0) score = 0;
            scoreEl.innerText = score;
            
            items.splice(i, 1);

            // Условие победы (набрано 10 очков)
            if (score >= 10) {
                triggerVictory();
            }
            continue;
        }

        // Удаление вылетевших за экран предметов
        if (item.y > canvas.height + 20) {
            items.splice(i, 1);
        }
    }

    requestAnimationFrame(updateGame);
}

// Переход к признанию после победы
function triggerVictory() {
    gameOver = true;
    
    // Эффект взрыва конфетти в честь победы
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Плавно скрываем игру и показываем финал
    gameWrapper.style.opacity = '0';
    gameWrapper.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        gameWrapper.style.display = 'none';
        mainCard.classList.remove('hidden');
        mainCard.style.position = 'relative';
        mainCard.style.opacity = '1';
        mainCard.style.transform = 'scale(1) translateY(0)';
    }, 500);
}

// Побег кнопки "Нет"
const moveNoButton = () => {
    const padding = 30;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
};

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Медленный дождь из сердец на заднем фоне
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    const heartTypes = ['❤️', '💖', '💝', '💕', '🥰'];
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    const duration = Math.random() * 2 + 4;
    heart.style.animationDuration = duration + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

// Финал при нажатии на "ДА!"
yesBtn.addEventListener('click', () => {
    noBtn.remove();
    title.innerHTML = 'Ура-а-а! Ты прошла игру и сделала меня самым счастливым! 🥰 Напиши мне скорее! 💖';
    yesBtn.style.display = 'none';
    mainCard.style.transform = 'scale(1.05)';
    mainCard.style.borderColor = '#ff4d6d';
    
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#ff85a1', '#2ecc71']
    });
    
    setInterval(createHeart, 150);
});

// Запуск игры
spawnItem();
updateGame();
