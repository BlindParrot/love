const gameWrapper = document.getElementById('gameWrapper');
const gameArea = document.getElementById('gameArea');
const playerBasket = document.getElementById('playerBasket');
const mainCard = document.getElementById('mainCard');
const scoreEl = document.getElementById('score');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const title = document.getElementById('title');
const heartsContainer = document.getElementById('heartsContainer');

let score = 0;
let gameOver = true;
let gameLoopInterval;
let spawnInterval;

const itemTypes = [
    { text: '❤️', type: 'good', score: 1 },
    { text: '💖', type: 'good', score: 1 },
    { text: '💝', type: 'good', score: 1 },
    { text: '💔', type: 'bad', score: -1 }
];

// Управление для мобилок и ПК без лагов через Pointer Events
gameArea.addEventListener('pointermove', (e) => {
    if (gameOver) return;
    const rect = gameArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    
    // Держим корзинку внутри игрового поля
    if (x < 30) x = 30;
    if (x > rect.width - 30) x = rect.width - 30;
    
    playerBasket.style.left = `${x}px`;
});

// Кнопка ИГРАТЬ (работает по первому касанию)
startBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.style.display = 'none';
        startGame();
    }, 300);
});

function startGame() {
    gameOver = false;
    score = 0;
    scoreEl.innerText = score;
    
    // Запускаем спавн предметов
    spawnInterval = setInterval(createFallingItem, 750);
    // Запускаем обсчет физики (60 кадров в секунду)
    gameLoopInterval = setInterval(updateItems, 1000 / 60);
}

function createFallingItem() {
    if (gameOver) return;
    
    const item = document.createElement('div');
    item.classList.add('falling-item');
    
    const randType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    item.innerHTML = randType.text;
    item.dataset.type = randType.type;
    item.dataset.score = randType.score;
    
    const areaWidth = gameArea.clientWidth;
    item.style.left = `${Math.random() * (areaWidth - 40) + 10}px`;
    item.style.top = '-40px';
    
    gameArea.appendChild(item);
}

function updateItems() {
    if (gameOver) return;
    
    const items = document.querySelectorAll('.falling-item');
    const basketRect = playerBasket.getBoundingClientRect();
    
    items.forEach(item => {
        let currentTop = parseFloat(item.style.top);
        // Скорость падения
        currentTop += 3.5; 
        item.style.top = `${currentTop}px`;
        
        const itemRect = item.getBoundingClientRect();
        
        // Проверка коллизии (пересечения с корзинкой)
        if (itemRect.bottom >= basketRect.top && 
            itemRect.top <= basketRect.bottom && 
            itemRect.right >= basketRect.left && 
            itemRect.left <= basketRect.right) {
            
            score += parseInt(item.dataset.score);
            if (score < 0) score = 0;
            scoreEl.innerText = score;
            
            item.remove();
            
            if (score >= 10) {
                triggerVictory();
            }
        }
        
        // Если улетел ниже экрана
        if (currentTop > gameArea.clientHeight) {
            item.remove();
        }
    });
}

function triggerVictory() {
    gameOver = true;
    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);
    
    // Удаляем все оставшиеся предметы на поле
    document.querySelectorAll('.falling-item').forEach(el => el.remove());
    
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });

    gameWrapper.style.opacity = '0';
    gameWrapper.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        gameWrapper.style.display = 'none';
        mainCard.classList.remove('hidden');
        mainCard.style.position = 'relative';
        mainCard.style.opacity = '1';
        mainCard.style.transform = 'scale(1) translateY(0)';
        
        noBtn.style.position = 'absolute';
        noBtn.style.left = '140px';
        noBtn.style.top = '0px';
    }, 500);
}

// Убегающая кнопка "Нет" (с поддержкой тачей для телефонов)
const moveNoButton = (e) => {
    if(e) e.preventDefault();
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
noBtn.addEventListener('touchstart', moveNoButton, { passive: false });

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    const heartTypes = ['❤️', '💖', '💝', '💕', '🥰'];
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 15 + 15 + 'px';
    const duration = Math.random() * 2 + 4;
    heart.style.animationDuration = duration + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

yesBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
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
