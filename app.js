// Letter database with example words for each letter
const letterData = {
    a: { words: ['apple', 'ant', 'arrow', 'animal', 'astronaut', 'awesome'], sentence: 'An ant ate an apple' },
    b: { words: ['ball', 'bear', 'book', 'bird', 'butterfly', 'beautiful'], sentence: 'A bear bought a big book' },
    c: { words: ['cat', 'car', 'cookie', 'computer', 'castle', 'colorful'], sentence: 'A cat came to the castle' },
    d: { words: ['dog', 'door', 'dragon', 'dance', 'delightful', 'dolphin'], sentence: 'A dog danced in the door' },
    e: { words: ['egg', 'elephant', 'energy', 'exciting', 'envelope', 'eagle'], sentence: 'An eagle eats an egg' },
    f: { words: ['fish', 'flower', 'friend', 'fun', 'fantastic', 'firefly'], sentence: 'A fish found a flower' },
    g: { words: ['goat', 'garden', 'guitar', 'great', 'grateful', 'glow'], sentence: 'A goat grazed in the garden' },
    h: { words: ['hat', 'house', 'happy', 'help', 'heroic', 'hummingbird'], sentence: 'A happy hat hung on the house' },
    i: { words: ['ice', 'island', 'imagine', 'incredible', 'island', 'igloo'], sentence: 'An island has an igloo' },
    j: { words: ['jump', 'juice', 'jellyfish', 'joyful', 'jungle', 'jacket'], sentence: 'A jellyfish jumped in juice' },
    k: { words: ['kite', 'king', 'kind', 'keyboard', 'keen', 'koala'], sentence: 'A king kept a kite' },
    l: { words: ['lion', 'light', 'learn', 'lucky', 'lemon', 'lighthouse'], sentence: 'A lion looked at light' },
    m: { words: ['moon', 'mouse', 'music', 'magic', 'mountain', 'meadow'], sentence: 'A mouse met moon' },
    n: { words: ['nest', 'night', 'nature', 'north', 'noble', 'nose'], sentence: 'A nest sat in the night' },
    o: { words: ['owl', 'ocean', 'orange', 'open', 'over', 'octopus'], sentence: 'An owl opened an orange' },
    p: { words: ['pig', 'plant', 'planet', 'puzzle', 'peaceful', 'parrot'], sentence: 'A pig played with a plant' },
    q: { words: ['queen', 'question', 'quiet', 'quick', 'queen', 'quail'], sentence: 'A quiet quail questioned a queen' },
    r: { words: ['rabbit', 'rain', 'rainbow', 'run', 'review', 'rocket'], sentence: 'A rabbit ran in the rainbow' },
    s: { words: ['star', 'sun', 'school', 'smile', 'super', 'spider'], sentence: 'A star shone on the school' },
    t: { words: ['tree', 'tiger', 'train', 'type', 'test', 'treasure'], sentence: 'A tiger tried to type' },
    u: { words: ['umbrella', 'unicorn', 'up', 'under', 'unique', 'universe'], sentence: 'A unicorn went under an umbrella' },
    v: { words: ['violin', 'van', 'valley', 'victory', 'vivid', 'volcano'], sentence: 'A violin played in the valley' },
    w: { words: ['water', 'wolf', 'window', 'wonderful', 'whale', 'wheat'], sentence: 'A wolf watched water' },
    x: { words: ['xylophone', 'fox', 'box', 'mix', 'six', 'tax'], sentence: 'A fox sat in a box' },
    y: { words: ['yellow', 'yo-yo', 'yacht', 'yummy', 'young', 'yogurt'], sentence: 'A young yogi ate yogurt' },
    z: { words: ['zebra', 'zoo', 'zippy', 'zucchini', 'zero', 'zipper'], sentence: 'A zebra zipped to the zoo' }
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Game state
let currentMode = 'both';
let currentLesson = 'review'; // learn, review, test
let currentLetterIndex = 0;
let currentWord = '';
let isPlaying = false;
let startTime = null;
let totalChars = 0;
let correctChars = 0;
let totalWords = 0;
let score = 0;
let lessonProgress = {};
let mineGameActive = false;
let mineGameFinished = false;
let inventory = { stone: 0, coal: 0, iron: 0, gold: 0, diamond: 0 };
let blocksMined = 0;
let mineScore = 0;
let deerCaught = false;
let deerDistance = 100; // 0-100, lower means closer

// Initialize lesson progress
alphabet.forEach(letter => {
    lessonProgress[letter] = { learn: false, review: false, test: false };
});

// DOM elements
const wordDisplay = document.getElementById('wordDisplay');
const typingInput = document.getElementById('typingInput');
const feedback = document.getElementById('feedback');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const progress = document.getElementById('progress');
const modeButtons = document.querySelectorAll('.mode-btn');
const lessonButtons = document.querySelectorAll('.lesson-btn');

// Initialize
function init() {
    updateLetterDisplay();
    updateKeyboardHighlight();
    loadMode();
    updateDisplay();
}

// Update letter display
function updateLetterDisplay() {
    const currentLetter = alphabet[currentLetterIndex].toUpperCase();
    let letterInfo = `<span class="letter-highlight">${currentLetter}</span>`;
    
    if (currentLesson === 'learn') {
        letterInfo += ` - Learn mode: Practice with '${currentLetter}'`;
    } else if (currentLesson === 'review') {
        letterInfo += ` - Review mode: Mixed practice`;
    } else {
        letterInfo += ` - Test mode: Timed challenge`;
    }
    
    wordDisplay.innerHTML = `<span class="word">${letterInfo}</span>`;
}

// Update keyboard highlight
function updateKeyboardHighlight() {
    const keys = document.querySelectorAll('.key');
    const currentLetter = alphabet[currentLetterIndex].toLowerCase();
    
    keys.forEach(key => {
        key.classList.remove('active');
        if (key.dataset.key === currentLetter) {
            key.classList.add('active');
        }
        
        // Mark completed letters
        if (lessonProgress[key.dataset.key] && 
            lessonProgress[key.dataset.key].learn && 
            lessonProgress[key.dataset.key].review && 
            lessonProgress[key.dataset.key].test) {
            key.classList.add('completed');
        }
    });
    
    // Update letter buttons
    const letterButtons = document.querySelectorAll('.letter-btn');
    letterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.letter === currentLetter) {
            btn.classList.add('active');
        }
        
        // Mark completed letters
        if (lessonProgress[btn.dataset.letter] && 
            lessonProgress[btn.dataset.letter].learn && 
            lessonProgress[btn.dataset.letter].review && 
            lessonProgress[btn.dataset.letter].test) {
            btn.classList.add('completed');
        }
    });
}

// Load word/sentence based on mode and lesson
function loadMode() {
    if (currentLesson === 'learn') {
        const letter = alphabet[currentLetterIndex].toLowerCase();
        const data = letterData[letter];
        
        if (Math.random() > 0.5) {
            currentWord = data.words[Math.floor(Math.random() * data.words.length)];
        } else {
            currentWord = data.sentence;
        }
    } else if (currentLesson === 'test') {
        // Test mode: random words from all letters
        if (Math.random() > 0.5) {
            const allWords = Object.values(letterData).flatMap(d => d.words);
            currentWord = allWords[Math.floor(Math.random() * allWords.length)];
        } else {
            currentWord = Object.values(letterData).flatMap(d => d.sentence)[Math.floor(Math.random() * Object.values(letterData).length)];
        }
    } else {
        // Review mode: mix of current letter and random
        if (Math.random() > 0.6) {
            const letter = alphabet[currentLetterIndex].toLowerCase();
            const data = letterData[letter];
            currentWord = data.words[Math.floor(Math.random() * data.words.length)];
        } else {
            const allWords = Object.values(letterData).flatMap(d => d.words);
            currentWord = allWords[Math.floor(Math.random() * allWords.length)];
        }
    }
    
    wordDisplay.innerHTML = `<span class="word">${currentWord}</span>`;
}

// Start game
function startGame() {
    isPlaying = true;
    startTime = Date.now();
    totalChars = 0;
    correctChars = 0;
    totalWords = 0;
    score = 0;
    typingInput.value = '';
    typingInput.focus();
    feedback.textContent = '';
    startBtn.textContent = '⏸ Playing...';
    startBtn.disabled = true;
    updateStats();
}

// Reset game
function resetGame() {
    isPlaying = false;
    startTime = null;
    typingInput.value = '';
    typingInput.disabled = false;
    feedback.textContent = 'Click Start to begin!';
    startBtn.textContent = '▶ Start';
    startBtn.disabled = false;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    scoreDisplay.textContent = '0';
    progress.style.width = '0%';
    updateLetterDisplay();
    updateKeyboardHighlight();
}

// Check typing
function checkTyping() {
    if (!isPlaying) return;

    const inputValue = typingInput.value;
    const targetWord = currentWord;

    // Check if typing is correct so far
    if (inputValue === targetWord) {
        // Word/sentence completed!
        const currentTime = Date.now();
        const timeInMinutes = (currentTime - startTime) / 60000;
        const wordsTyped = inputValue.split(' ').length;
        const wpm = Math.round(wordsTyped / timeInMinutes);

        // Update stats
        totalChars += inputValue.length;
        correctChars += inputValue.length;
        totalWords++;
        score += wpm * 2;

        // Move deer away on correct typing
        deerDistance = Math.min(deerDistance + 10, 100);
        updateDeerPosition();

        // Show feedback
        feedback.textContent = getEncouragement();
        feedback.style.color = '#4caf50';

        // Update progress
        const progressPercent = Math.min((totalWords / 10) * 100, 100);
        progress.style.width = `${progressPercent}%`;

        // Update display
        updateStats();

        // Load next word
        if (totalWords < 10) {
            loadMode();
            typingInput.value = '';
        } else {
            endLesson();
        }
    } else if (targetWord.startsWith(inputValue)) {
        // Still typing correctly
        typingInput.classList.remove('incorrect');
        typingInput.classList.add('correct');
        feedback.textContent = '';
    } else {
        // Typing incorrectly - deer gets closer!
        typingInput.classList.remove('correct');
        typingInput.classList.add('incorrect');
        feedback.textContent = 'The deer is coming! 🦌';
        feedback.style.color = '#f44336';
        
        // Move deer closer
        deerDistance = Math.max(deerDistance - 15, 0);
        updateDeerPosition();
        
        // Check if deer caught you
        if (deerDistance <= 0) {
            deerCaught = true;
            showCaughtOverlay();
        }
    }
}

// End lesson
function endLesson() {
    isPlaying = false;
    typingInput.disabled = true;
    const letter = alphabet[currentLetterIndex].toUpperCase();
    
    feedback.innerHTML = `🎉 Great job practicing '${letter}'!<br>Score: ${score}`;
    feedback.style.color = '#667eea';
    startBtn.textContent = '▶ Mine!';
    startBtn.disabled = false;
    
    // Mark lesson as complete
    lessonProgress[alphabet[currentLetterIndex].toLowerCase()][currentLesson] = true;
    
    // Show mining game
    startMineGame();
}

// Start car game
function startCarGame() {
    carGameActive = true;
    raceFinished = false;
    playerProgress = 0;
    botProgress = [0, 0, 0];
    
    document.getElementById('carGame').style.display = 'block';
    document.getElementById('raceMessage').textContent = 'Type fast to win!';
    document.getElementById('racePosition').textContent = '4th';
    document.getElementById('raceSpeed').textContent = '0';
    document.getElementById('raceDistance').textContent = '0%';
    
    // Reset racer positions
    updateRacerPositions();
    
    // Start bot movement
    startBotMovement();
    
    // Enable typing input
    typingInput.disabled = false;
    typingInput.focus();
    feedback.textContent = '';
    startBtn.textContent = '⏸ Racing...';
    startBtn.disabled = true;
    
    startTime = Date.now();
    totalChars = 0;
    correctChars = 0;
    totalWords = 0;
    score = 0;
}

// Start bot movement
function startBotMovement() {
    const botInterval = setInterval(() => {
        if (!carGameActive || raceFinished) {
            clearInterval(botInterval);
            return;
        }
        
        // Each bot moves at different speeds
        for (let i = 0; i < 3; i++) {
            const speed = 0.5 + Math.random() * 1.5;
            botProgress[i] += speed;
        }
        
        updateRacerPositions();
        checkRaceFinish();
    }, 500);
}

// Update racer positions
function updateRacerPositions() {
    const trackWidth = document.querySelector('.race-track').offsetWidth - 100;
    
    // Player car
    const playerCar = document.getElementById('playerCar');
    playerCar.style.transform = `translateX(${playerProgress * trackWidth / 100}px)`;
    
    // Bot cars
    for (let i = 0; i < 3; i++) {
        const racer = document.getElementById(`racer${i + 1}`);
        racer.style.transform = `translateX(${botProgress[i] * trackWidth / 100}px)`;
    }
    
    // Update distance display
    document.getElementById('raceDistance').textContent = `${Math.min(Math.round(playerProgress), 100)}%`;
    
    // Calculate position
    const allProgress = [
        { name: 'You', progress: playerProgress },
        { name: 'Bot 1', progress: botProgress[0] },
        { name: 'Bot 2', progress: botProgress[1] },
        { name: 'Bot 3', progress: botProgress[2] }
    ];
    
    allProgress.sort((a, b) => b.progress - a.progress);
    const position = allProgress.findIndex(p => p.name === 'You') + 1;
    const positionText = position === 1 ? '1st' : position === 2 ? '2nd' : position === 3 ? '3rd' : '4th';
    document.getElementById('racePosition').textContent = positionText;
}

// Check race finish
function checkRaceFinish() {
    if (playerProgress >= 100 || botProgress.some(p => p >= 100)) {
        raceFinished = true;
        carGameActive = false;
        
        // Calculate final position
        const allProgress = [
            { name: 'You', progress: playerProgress },
            { name: 'Bot 1', progress: botProgress[0] },
            { name: 'Bot 2', progress: botProgress[1] },
            { name: 'Bot 3', progress: botProgress[2] }
        ];
        
        allProgress.sort((a, b) => b.progress - a.progress);
        const position = allProgress.findIndex(p => p.name === 'You') + 1;
        const positionText = position === 1 ? '🏆 WINNER!' : `Finished ${position}${getOrdinalSuffix(position)}`;
        
        document.getElementById('raceMessage').textContent = positionText;
        document.getElementById('raceMessage').style.color = position === 1 ? '#4caf50' : '#667eea';
        
        // Add bonus score
        score += position * 100;
        scoreDisplay.textContent = score;
        
        // Show next button
        startBtn.textContent = '▶ Next Letter';
        startBtn.disabled = false;
        
        // Move to next letter after race
        currentLetterIndex = (currentLetterIndex + 1) % alphabet.length;
        updateLetterDisplay();
        updateKeyboardHighlight();
    }
}

// Get ordinal suffix
function getOrdinalSuffix(num) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return s[(v - 20) % 100] || s[v] || s[0];
}

// Update deer position
function updateDeerPosition() {
    const deer = document.getElementById('deer');
    const deerDistanceEl = document.getElementById('deerDistance');
    
    if (deerDistance > 70) {
        deer.classList.remove('warning', 'caught');
        deerDistanceEl.textContent = 'Far away';
        deerDistanceEl.className = 'deer-distance';
    } else if (deerDistance > 40) {
        deer.classList.remove('caught');
        deer.classList.add('warning');
        deerDistanceEl.textContent = 'Getting closer...';
        deerDistanceEl.className = 'deer-distance close';
    } else if (deerDistance > 10) {
        deer.classList.remove('warning');
        deer.classList.add('caught');
        deerDistanceEl.textContent = 'RUN!';
        deerDistanceEl.className = 'deer-distance danger';
    } else {
        deer.classList.remove('warning');
        deer.classList.add('caught');
        deerDistanceEl.textContent = 'CAUGHT!';
        deerDistanceEl.className = 'deer-distance danger';
    }
}

// Show caught overlay
function showCaughtOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'caught-overlay active';
    overlay.innerHTML = `
        <div class="caught-content">
            <h2>🦌 Deer Caught You!</h2>
            <p>Your accuracy was too low!<br>
            Score: ${score} | Words: ${totalWords}</p>
            <button onclick="resetGame()">Try Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Disable input
    typingInput.disabled = true;
    isPlaying = false;
}

// Reset game
function resetGame() {
    isPlaying = false;
    startTime = null;
    typingInput.value = '';
    typingInput.disabled = false;
    feedback.textContent = 'Click Start to begin!';
    startBtn.textContent = '▶ Start';
    startBtn.disabled = false;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    scoreDisplay.textContent = '0';
    progress.style.width = '0%';
    updateLetterDisplay();
    updateKeyboardHighlight();
    
    // Reset deer
    deerDistance = 100;
    deerCaught = false;
    updateDeerPosition();
    
    // Remove overlay if exists
    const overlay = document.querySelector('.caught-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Update car stats during typing
function updateCarStats() {
    if (!carGameActive || raceFinished) return;
    
    const currentTime = Date.now();
    const timeInMinutes = (currentTime - startTime) / 60000;
    const wpm = timeInMinutes > 0 ? Math.round((totalChars / 5) / timeInMinutes) : 0;
    const speed = Math.min(wpm * 2, 200);
    
    document.getElementById('raceSpeed').textContent = speed;
}

// Update stats display
function updateStats() {
    if (startTime) {
        const currentTime = Date.now();
        const timeInMinutes = (currentTime - startTime) / 60000;
        const wpm = timeInMinutes > 0 ? Math.round((totalChars / 5) / timeInMinutes) : 0;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

        wpmDisplay.textContent = wpm;
        accuracyDisplay.textContent = `${accuracy}%`;
        scoreDisplay.textContent = score;
    }
}

// Update display
function updateDisplay() {
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    scoreDisplay.textContent = '0';
}

// Get random encouragement
function getEncouragement() {
    const phrases = [
        '🌟 Awesome! Keep going!',
        '🚀 You\'re on fire!',
        '💪 Great typing!',
        '🎯 Perfect!',
        '⭐ Super star!',
        '🏆 Champion!',
        '🎨 Wonderful!',
        '🌈 Fantastic!',
        '💎 Excellent!',
        '🎪 Amazing work!'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// Event listeners
startBtn.addEventListener('click', () => {
    if (!isPlaying) {
        startGame();
    }
});

resetBtn.addEventListener('click', resetGame);

typingInput.addEventListener('input', checkTyping);

// Mode buttons
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        resetGame();
    });
});

// Lesson buttons
lessonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        lessonButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLesson = btn.dataset.lesson;
        currentLetterIndex = 0;
        resetGame();
    });
});

// Letter buttons
const letterButtons = document.querySelectorAll('.letter-btn');
letterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        letterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const letter = btn.dataset.letter;
        const index = alphabet.indexOf(letter);
        if (index !== -1) {
            currentLetterIndex = index;
            resetGame();
        }
    });
});

// Reset all progress
const resetProgressBtn = document.getElementById('resetProgressBtn');
if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress?')) {
            alphabet.forEach(letter => {
                lessonProgress[letter] = { learn: false, review: false, test: false };
            });
            resetGame();
            updateKeyboardHighlight();
            feedback.textContent = 'Progress reset! Start over.';
            feedback.style.color = '#667eea';
        }
    });
}

// Prevent typing in input when game is not started
typingInput.addEventListener('keydown', (e) => {
    if (!isPlaying && e.key !== 'Enter') {
        e.preventDefault();
        typingInput.placeholder = 'Click Start first!';
    } else {
        typingInput.placeholder = 'Type here...';
    }
});

// Start on Enter key
typingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isPlaying) {
        startGame();
    }
});

// Initialize on load
init();
