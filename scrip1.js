const words = [
    "abandon", "beacon", "candy", "dove", "eagle", "flame", "grape", "happy", "ice", "jungle",
    "kingdom", "lunar", "mango", "noble", "ocean", "petal", "quest", "river", "shadow", "train",
    "umbrella", "vivid", "whale", "basket", "yellow", "zebra", "angel", "brave", "crane", "dusk",
    "enigma", "frost", "glow", "honey", "index", "juice", "knight", "magic", "night", "oasis",
    "pearl", "quill", "rose", "scent", "tiger", "unity", "vortex", "wind", "xray", "yogurt",
    "zoned", "atlas", "bliss", "cider", "dawn", "epoch", "gauge", "heaven", "irony", "jolly",
    "koala", "lamb", "mint", "neon", "opal", "plum", "quartz", "ruby", "sunset", "tango",
    "urban", "vogue", "wave", "xerox", "yearn", "zephyr", "aqua", "bold", "crisp", "edge",
    "forge", "grace", "hush", "ink", "jade", "kite", "leaf", "mist", "navy", "oak",
    "pale", "quilted", "rare", "stone", "tone", "vibes", "wisp", "yacht", "zeal", "arc"
];

const textContainer = document.getElementById('text-container');
const timerElement = document.getElementById('timer');
const tryAgainButton = document.getElementById('try-again');
const finalScoreElement = document.getElementById('final-score');

let totalTyped = '';
let currentCharField = 0;
let errors = 0;
let longText = '';
let timeLeft = 60;
let timerInterval;
let typingStarted = false;

// Shuffle the words array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Combine shuffled words into one long string
function generateLongText() {
    const shuffledWords = shuffleArray([...words]);
    return shuffledWords.join(' '); // Yahan space (' ') hona chahiye taake words alag dikhen
}

function startTimer() {
    if (typingStarted) return;
    typingStarted = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

function endTest() {
    timerElement.textContent = 'Time up!';
    finalScoreElement.textContent = `Final WPM: ${calculateWPM()}`;
    textContainer.style.display = 'none';
    tryAgainButton.style.display = 'block';
}

function calculateWPM() {
    const wordsTyped = totalTyped.trim().split(/\s+/).length;
    const baseWPM = Math.round((wordsTyped / 60) * 60); 
    const adjustedWPM = Math.max(baseWPM - errors, 0);
    return adjustedWPM;
}

// Handling typing
document.addEventListener('keydown', (e) => {
    // Ignore special keys like Shift, Alt, etc.
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;

    startTimer();

    if (e.key === 'Backspace') {
        if (totalTyped.length > 0) {
            totalTyped = totalTyped.slice(0, -1);
        }
    } else if (e.key.length === 1) {
        totalTyped += e.key;
    }

    renderText();
});

function renderText() {
    const textArray = longText.split('');
    textContainer.innerHTML = '';
    errors = 0;

    textArray.forEach((char, index) => {
        const span = document.createElement('span');
        if (index < totalTyped.length) {
            if (totalTyped[index] === char) {
                span.classList.add('correct');
            } else {
                span.classList.add('error');
                errors++;
            }
        }
        span.textContent = char;
        textContainer.appendChild(span);
    });

    // Scrolling logic
    if (totalTyped.length >= 20) {
        const scrollAmount = (totalTyped.length - 20) * 14;
        textContainer.scrollLeft = scrollAmount;
    }
}

function resetTest() {
    clearInterval(timerInterval);
    timeLeft = 60;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    finalScoreElement.textContent = '';
    tryAgainButton.style.display = 'none';
    textContainer.style.display = 'block';
    totalTyped = '';
    typingStarted = false;
    errors = 0;
    textContainer.scrollLeft = 0;
    longText = generateLongText();
    renderText();
}

function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 800;
}

function init() {
    if (isMobileDevice()) {
        textContainer.textContent = 'This typing test is designed for desktop use only.';
    } else {
        longText = generateLongText();
        renderText();
        timerElement.textContent = `Time left: ${timeLeft}s`;
    }
}

tryAgainButton.addEventListener('click', resetTest);

init();