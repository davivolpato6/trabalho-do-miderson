// Variáveis do Jogo
let secretNumber;
let stars = 0;
let gameOver = false;

// Elementos do DOM
const mysteryBox = document.getElementById('mystery-box');
const boxText = document.getElementById('box-text');
const hintText = document.getElementById('hint-text');
const keypad = document.getElementById('keypad');
const resetBtn = document.getElementById('reset-btn');
const starCount = document.getElementById('star-count');

// Áudios Fofos usando Web Audio API (sem precisar baixar sons)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'click') {
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'win') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.setValueAtTime(400, now + 0.1);
    osc.frequency.setValueAtTime(500, now + 0.2);
    osc.frequency.setValueAtTime(700, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// Iniciar/Reiniciar o Jogo
function initGame() {
  // Sorteia número aleatório de 1 a 10 usando Math.random()
  secretNumber = Math.floor(Math.random() * 10) + 1;
  gameOver = false;

  // Reseta visual da Caixinha
  boxText.textContent = '?';
  mysteryBox.classList.remove('won');
  hintText.textContent = 'Aperte os botões coloridos para adivinhar o número!';
  resetBtn.style.display = 'none';

  // Gera os Botões de 1 a 10
  keypad.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.classList.add('num-btn');
    btn.textContent = i;
    btn.addEventListener('click', () => handleGuess(i, btn));
    keypad.appendChild(btn);
  }
}

// Processar a Jogada
function handleGuess(number, btn) {
  if (gameOver) return;

  // Desativa o botão clicado
  btn.disabled = true;

  if (number === secretNumber) {
    // ACERTOU!
    gameOver = true;
    playSound('win');
    
    boxText.textContent = secretNumber;
    mysteryBox.classList.add('won');
    hintText.textContent = '🎉 EBAA! VOCÊ ACERTOU! 🎉';
    
    // Atualiza Estrelas
    stars++;
    starCount.textContent = `${stars} ⭐`;

    // Mostra botão de jogar de novo
    resetBtn.style.display = 'block';

    // Solta Confete Colorido
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

  } else if (number < secretNumber) {
    // É MAIOR
    playSound('error');
    hintText.textContent = `O número mágico é MAIOR que ${number}! ⬆️`;
    triggerShake();
  } else {
    // É MENOR
    playSound('error');
    hintText.textContent = `O número mágico é MENOR que ${number}! ⬇️️`;
    triggerShake();
  }
}

// Animação de tremor no erro
function triggerShake() {
  mysteryBox.classList.add('shake');
  setTimeout(() => {
    mysteryBox.classList.remove('shake');
  }, 400);
}

// Evento do Botão de Reiniciar
resetBtn.addEventListener('click', () => {
  playSound('click');
  initGame();
});

// Inicializar quando carregar a página
window.onload = () => {
  initGame();
};