const gameWrapper = document.getElementById('gameWrapper');
const mainCard = document.getElementById('mainCard');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const title = document.getElementById('title');
const heartsContainer = document.getElementById('heartsContainer');

canvas.width = 320;
canvas.height = 400;

let score = 0;
let gameOver = true; // Изначально игра стоит на паузе
let items = [];
const itemTypes = [
    { text: '❤️', type: 'good', score: 1 },
    { text: '💖', type: 'good', score: 1 },
    { text: '💝', type: 'good', score: 1 },
    { text: '💔', type: 'bad', score: -1 }
];

const player = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 50,
    width: 70,
    height: 30,
    emoji: '🧺'
};

// УНИВЕРСАЛЬНОЕ УПРАВЛЕНИЕ ДЛЯ ПК И ТЕЛЕФОНОВ
const handleMove = (clientX) => {
    if (gameOver) return;
    const rect = canvas.getBoundingClientRect();
    // Вычисляем позицию относительно холста с учетом его реального масштаба на экране
    const rootX = (clientX - rect.left) * (canvas.width / rect.width);
    player.x = rootX - player.width / 2;
    
    // Ограничиваем движение рамками экрана
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
};

// Отслеживаем любые типы указателей (мышь, палец, стилус)
window.addEventListener('pointermove', (e) => {
    handleMove(e.clientX);
});

function spawnItem() {
    if (gameOver) return;
    const randType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -30,
        speed: Math.random() * 2 + 2.5, // Немного ускорили падение для динамики
        text: randType.text,
        type: randType.type,
        score: randType.score,
        size: 26
    });
    setTimeout(spawnItem, Math.max(350, 850 - score * 40));
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем корзинку
    ctx.font = "32px Arial";
    ctx.fillText(player.emoji, player.x, player.y + 25);

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item.y += item.speed;

        ctx.font = `${item.size}px Arial`;
        ctx.fillText(item.text, item.x - item.size/2, item.y);

        // Проверка ловли предмета корзинкой
        if (item.y >= player.y && item.y <= player.y + player.height &&
            item.x >= player.x - 10 && item.x <= player.x + player.width + 10) {
            
            score += item.score;
            if (score < 0) score = 0;
            scoreEl.innerText = score;
            
            items.splice(i, 1);

            // ПРОВЕРКА ПОБЕДЫ: Строго при 10 очках или больше
            if (score >= 10) {
                triggerVictory();
                return; // Останавливаем цикл отрисовки
            }
            continue;
        }

        if (item.y > canvas.height + 20) {
            items.splice(i, 1);
        }
    }

    if (!gameOver) {
        requestAnimationFrame(updateGame);
    }
}

// Кнопка СТАРТ
startBtn.addEventListener('click', () => {
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.style.display = 'none';
        gameOver = false;
        score = 0;
        items = [];
        scoreEl.innerText = score;
        spawnItem();
        updateGame();
    }, 300);
});

function triggerVictory() {
    gameOver = true;
    
    // Взрыв конфетти
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    // Плавное переключение экранов
    gameWrapper.style.opacity = '0';
    gameWrapper.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        gameWrapper.style.display = 'none';
        mainCard.classList.remove('hidden');
        mainCard.style.position = 'relative';
        mainCard.style.opacity = '1';
        mainCard.style.transform = 'scale(1) translateY(0)';
        
        // Сбрасываем позицию у убегающей кнопки
        noBtn.style.position = 'absolute';
        noBtn.style.left = '160px';
        noBtn.style.top = '0px';
    }, 500);
}

// Поведение кнопки "Нет"
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
