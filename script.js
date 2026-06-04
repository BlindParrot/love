const questCard = document.getElementById('questCard');
const mainCard = document.getElementById('mainCard');
const answerInput = document.getElementById('answerInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const title = document.getElementById('title');
const heartsContainer = document.getElementById('heartsContainer');

// Начальное положение кнопки "Нет"
noBtn.style.left = '160px';
noBtn.style.top = '0px';

// Логика проверки загадки
unlockBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    
    if (userAnswer.includes('сердце') || userAnswer.includes('сердечко')) {
        errorMsg.style.display = 'none';
        
        // Эффектное исчезновение квеста
        questCard.style.opacity = '0';
        questCard.style.transform = 'scale(0.8) translateY(-30px)';
        
        // ЧЕТКОЕ ИСПРАВЛЕНИЕ: полностью убираем первую карточку из документа, чтобы она не маячила слева
        setTimeout(() => {
            questCard.style.display = 'none'; 
            
            // Плавно показываем основное признание
            mainCard.classList.remove('hidden');
            mainCard.style.position = 'relative'; // Выстраиваем по центру экрана
            mainCard.style.opacity = '1';
            mainCard.style.transform = 'scale(1) translateY(0)';
        }, 400);
        
    } else {
        errorMsg.style.display = 'block';
        // Легкая анимация тряски при ошибке
        questCard.style.animation = 'none';
        setTimeout(() => { questCard.style.animation = 'pulse 0.3s ease 2'; }, 10);
    }
}

// Кнопка "Нет" убегает
noBtn.addEventListener('mouseover', () => {
    const padding = 30;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
});

// Генерация падающих сердечек
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    const heartTypes = ['❤️', '💖', '💝', '💕', '🥰'];
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    
    const duration = Math.random() * 2 + 3;
    heart.style.animationDuration = duration + 's';
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => { heart.remove(); }, duration * 1000);
}

// Кнопка "ДА"
yesBtn.addEventListener('click', () => {
    noBtn.remove();
    title.innerHTML = 'Ура-а-а! Ты делаешь меня самым счастливым! 🥰 Посмотри в окно или напиши мне скорее! 💖';
    yesBtn.style.display = 'none';
    mainCard.style.transform = 'scale(1.05)';
    mainCard.style.borderColor = '#ff4d6d';
    
    setInterval(createHeart, 60);
});
