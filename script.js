/* ========================================
   Floating Hearts — Canvas Particle System
   ======================================== */
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');

let W, H;
const hearts = [];
const HEART_COUNT = 45;
const HEART_SYMBOLS = ['♥', '♡', '❤', '💕', '💗', '💖'];
const HEART_COLORS = [
  'rgba(255,107,157,0.5)',
  'rgba(255,45,117,0.35)',
  'rgba(232,67,147,0.4)',
  'rgba(253,121,168,0.45)',
  'rgba(162,155,254,0.3)',
  'rgba(255,234,167,0.25)',
];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Heart {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * W;
    this.y = H + 20 + Math.random() * 100;
    this.size = 10 + Math.random() * 18;
    this.speed = 0.3 + Math.random() * 0.8;
    this.drift = (Math.random() - 0.5) * 0.4;
    this.wobbleAmp = 20 + Math.random() * 30;
    this.wobbleSpeed = 0.005 + Math.random() * 0.01;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.opacity = 0.15 + Math.random() * 0.4;
    this.rotation = (Math.random() - 0.5) * 0.5;
    this.rotSpeed = (Math.random() - 0.5) * 0.01;
    this.symbol = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
    this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    this.tick = 0;
  }

  update() {
    this.tick++;
    this.y -= this.speed;
    this.x += this.drift + Math.sin(this.tick * this.wobbleSpeed + this.wobbleOffset) * 0.3;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px serif`;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

for (let i = 0; i < HEART_COUNT; i++) {
  const h = new Heart();
  h.y = Math.random() * H; // initial scatter
  hearts.push(h);
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  for (const h of hearts) {
    h.update();
    h.draw(ctx);
  }
  requestAnimationFrame(animate);
}
animate();

/* ========================================
   Interactive: Mouse glow follow
   ======================================== */
const cardEl = document.querySelector('.card-inner');
const glowEl = document.querySelector('.card-glow');

document.addEventListener('mousemove', (e) => {
  const rect = cardEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x >= -60 && x <= rect.width + 60 && y >= -60 && y <= rect.height + 60) {
    glowEl.style.left = `${x - 100}px`;
    glowEl.style.top = `${y - 100}px`;
    glowEl.style.opacity = '0.6';
  }
});

/* ========================================
   Envelope click → reveal message
   ======================================== */
const envelope = document.getElementById('envelope');
const messageContainer = document.getElementById('message-container');

envelope.addEventListener('click', () => {
  envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  envelope.style.opacity = '0';
  envelope.style.transform = 'scale(0.5) translateY(-30px)';

  setTimeout(() => {
    envelope.style.display = 'none';
    messageContainer.classList.remove('hidden');
    messageContainer.classList.add('revealing');
    startCountdown();
  }, 400);
});

/* ========================================
   Countdown to midnight
   ======================================== */
const countdownText = document.getElementById('countdown-text');

function startCountdown() {
  function update() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;

    if (diff <= 0) {
      countdownText.textContent = "Valentine's Day has ended… but love never does 💕";
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (h > 0) {
      countdownText.textContent = `${h}h ${m}m ${s}s left of Valentine's Day`;
    } else if (m > 0) {
      countdownText.textContent = `${m}m ${s}s left of Valentine's Day`;
    } else {
      countdownText.textContent = `${s}s left of Valentine's Day!`;
    }

    requestAnimationFrame(update);
  }
  update();
}

/* ========================================
   "Send Love" button → confetti burst
   ======================================== */
const loveBtn = document.getElementById('love-btn');
const heartsBurst = document.getElementById('hearts-burst');

loveBtn.addEventListener('click', () => {
  spawnBurstHearts();
  spawnConfetti();
  
  // Pulse the background
  document.body.style.transition = 'background 0.4s ease';
  document.body.style.background = '#12001f';
  setTimeout(() => {
    document.body.style.background = '#0a0011';
  }, 400);
});

function spawnBurstHearts() {
  const emojis = ['❤️', '💖', '💗', '💕', '💝', '🥰', '😍', '✨', '💘', '💞'];
  const rect = loveBtn.getBoundingClientRect();
  const containerRect = heartsBurst.getBoundingClientRect();
  const originX = rect.left - containerRect.left + rect.width / 2;
  const originY = rect.top - containerRect.top + rect.height / 2;

  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'burst-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const angle = (Math.PI * 2 / 14) * i + (Math.random() - 0.5) * 0.5;
    const dist = 80 + Math.random() * 120;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    const rot = (Math.random() - 0.5) * 360;

    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.fontSize = `${1 + Math.random() * 1.2}rem`;
    el.style.animationDelay = `${Math.random() * 0.15}s`;

    heartsBurst.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

function spawnConfetti() {
  const colors = ['#ff6b9d', '#ff2d75', '#a29bfe', '#ffeaa7', '#fd79a8', '#e84393', '#ff9ff3'];

  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    
    const x = Math.random() * window.innerWidth;
    const size = 4 + Math.random() * 8;
    const duration = 1.5 + Math.random() * 2;
    const shape = Math.random() > 0.5 ? '50%' : `${Math.random() * 4}px`;

    el.style.left = `${x}px`;
    el.style.top = `${-10 - Math.random() * 50}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = shape;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${Math.random() * 0.5}s`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration + 0.5) * 1000);
  }
}

/* ========================================
   Ambient: slow pulsating background
   ======================================== */
let bgHue = 280;
function animateBg() {
  bgHue = (bgHue + 0.02) % 360;
  const bgColor = `hsl(${bgHue}, 80%, 3%)`;
  document.body.style.background = bgColor;
  requestAnimationFrame(animateBg);
}
// Very subtle — uncomment to enable:
// animateBg();
