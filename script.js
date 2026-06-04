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

// Плавное управление пальцем/мышкой
gameArea.addEventListener('pointermove', (e) => {
    if (gameOver) return;
    const rect = gameArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    
    if (x < 30) x = 30;
    if (x > rect.width - 30) x = rect.width - 30;
    
    playerBasket.style.left = `${x}px`;
});

// Кнопка ИГРАТЬ запускается МГНОВЕННО
startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    startOverlay.style.display = 'none';
    startGame();
});

function startGame() {
    gameOver = false;
    score = 0;
    scoreEl.innerText = score;
    
    // Очищаем старые предметы, если были
    document.querySelectorAll('.falling-item').forEach(el => el.remove());
    
    spawnInterval = setInterval(createFallingItem, 700);
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
        currentTop += 4; // Чуть ускорили падение для фана
        item.style.top = `${currentTop}px`;
        
        const itemRect = item.getBoundingClientRect();
        
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
        
        if (currentTop > gameArea.clientHeight) {
            item.remove();
        }
    });
}

// Собственный кастомный взрыв салюта на чистом JS
function nativeConfetti() {
    const colors = ['🎉', '✨', '💖', '❤️', '💝', '🌸'];
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = colors[Math.floor(Math.random() * colors.length)];
        particle.style.position = 'fixed';
        particle.style.left = '50vw';
        particle.style.top = '60vh';
        particle.style.fontSize = Math.random() * 20 + 15 + 'px';
        particle.style.zIndex = '999';
        particle.style.pointerEvents = 'none';
        particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        
        document.body.appendChild(particle);
        
        // Сила и направление взрыва во все стороны
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 50;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px) scale(0.5)`;
            particle.style.opacity = '0';
        }, 50);
        
        setTimeout(() => particle.remove(), 1050);
    }
}

function triggerVictory() {
    gameOver = true;
    clearInterval(spawnInterval);
    clearInterval(gameLoopInterval);
    
    document.querySelectorAll('.falling-item').forEach(el => el.remove());
    
    // Взрываем наш собственный салют
    nativeConfetti();

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
    }, 400);
}

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

yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    noBtn.remove();
    title.innerHTML = 'Ура-а-а! Ты прошла игру и сделала меня самым счастливым! 🥰 Напиши мне скорее! 💖';
    yesBtn.style.display = 'none';
    mainCard.style.transform = 'scale(1.05)';
    mainCard.style.borderColor = '#ff4d6d';
    
    nativeConfetti();
    setInterval(createHeart, 150);
});
