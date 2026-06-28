/* ===================================================================
   PAGE NAVIGATION
   =================================================================== */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  if (id === 'page-envelope') {
    const envelope = document.getElementById('envelope');
    if (envelope) envelope.classList.remove('opening');
  }

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}


/* ===================================================================
   ENVELOPE — floating hearts + click-to-open
   =================================================================== */
function initHearts() {
  const heartSVG = `
    <svg viewBox="0 0 100 88" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 84 C18 60 0 40 0 23 C0 9 11 0 24 0 C35 0 45 7 50 17
               C55 7 65 0 76 0 C89 0 100 9 100 23 C100 40 82 60 50 84 Z"
            fill="#e22236" stroke="#ffffff" stroke-width="7" stroke-linejoin="round"/>
    </svg>`;

  const hearts = [
    { top: 8,  left: 6,  size: 62, delay: 0 },
    { top: 12, left: 88, size: 70, delay: 0.6 },
    { top: 34, left: 14, size: 50, delay: 1.2 },
    { top: 30, left: 93, size: 46, delay: 0.3 },
    { top: 58, left: 2,  size: 60, delay: 1.8 },
    { top: 70, left: 80, size: 54, delay: 0.9 },
    { top: 88, left: 62, size: 58, delay: 1.4 },
    { top: 90, left: 18, size: 48, delay: 0.4 },
    { top: 90, left: 94, size: 50, delay: 1.0 }
  ];

  const scene = document.getElementById('scene');
  if (!scene) return;

  hearts.forEach(h => {
    const el = document.createElement('div');
    el.className = 'heart';
    el.style.top = h.top + '%';
    el.style.left = h.left + '%';
    el.style.width = h.size + 'px';
    el.style.animationDelay = h.delay + 's';
    el.innerHTML = heartSVG;
    scene.appendChild(el);
  });
}

function initEnvelope() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  envelope.addEventListener('click', () => {
    envelope.classList.add('opening');
    setTimeout(() => {
      showPage('page-letter');
    }, 800);
  });
}


/* ===================================================================
   LETTER — falling petals
   =================================================================== */
function initPetals() {
  const field = document.getElementById('petals');
  if (!field) return;

  const petalSVG = `<svg viewBox="0 0 24 24" width="22" height="22">
    <path d="M12 2c2 3 6 4 6 8s-3 6-6 6-6-2-6-6 4-5 6-8z" fill="currentColor" opacity=".85"/>
    <circle cx="12" cy="13" r="1.4" fill="#f6d28a"/>
  </svg>`;

  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.className = 'petal-drift';
    s.style.left = ((i * 7.3) % 100) + '%';
    s.style.animationDelay = ((i * 1.7) % 12) + 's';
    s.style.animationDuration = (14 + ((i * 3) % 9)) + 's';
    s.style.transform = `scale(${0.6 + ((i * 13) % 7) / 10})`;
    s.innerHTML = petalSVG;
    field.appendChild(s);
  }
}


/* ===================================================================
   SONG FOR YOU — scattered background stars
   =================================================================== */
function initStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  for (let i = 0; i < 55; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.textContent = '✦';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.fontSize = (0.7 + Math.random() * 0.9) + 'rem';
    star.style.opacity = 0.4 + Math.random() * 0.5;
    star.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(star);
  }
}


/* ===================================================================
   SONG FOR YOU — YouTube player with graceful fallback
   =================================================================== */
const SONG_VIDEO_ID = 'FcwJzTYcf5g';

function initSongPlayer() {
  const playerWrap = document.getElementById('songPlayerWrap');
  const fallback = document.getElementById('songFallback');
  if (!playerWrap || !fallback) return;

  const showFallback = () => {
    playerWrap.style.display = 'none';
    fallback.style.backgroundImage =
      `url(https://img.youtube.com/vi/${SONG_VIDEO_ID}/hqdefault.jpg)`;
    const link = document.getElementById('songFallbackLink');
    if (link) link.href = `https://www.youtube.com/watch?v=${SONG_VIDEO_ID}`;
    fallback.hidden = false;
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  window.onYouTubeIframeAPIReady = function () {
    new YT.Player('songPlayer', {
      width: '100%',
      height: '100%',
      videoId: SONG_VIDEO_ID,
      playerVars: { rel: 0 },
      events: { onError: showFallback }
    });
  };

  setTimeout(() => {
    if (!window.YT || !window.YT.Player) showFallback();
  }, 4000);
}


/* ===================================================================
   SHARED BACKGROUND MUSIC
   =================================================================== */
function initMusic() {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (!music || !btn) return;

  music.volume = 0.4;
  let playing = false;

  const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
  const wasPaused = sessionStorage.getItem('musicPaused') === 'true';
  music.currentTime = savedTime;

  window.addEventListener('pagehide', () => {
    sessionStorage.setItem('musicTime', music.currentTime);
    sessionStorage.setItem('musicPaused', String(!playing));
  });

  if (!wasPaused) {
    music.play().then(() => {
      playing = true;
      btn.textContent = '♪';
    }).catch(() => {
      document.addEventListener('click', function startMusic() {
        music.play();
        playing = true;
        btn.textContent = '♪';
      }, { once: true });
    });
  } else {
    btn.textContent = '♩';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
      music.pause();
      playing = false;
      btn.textContent = '♩';
    } else {
      music.play();
      playing = true;
      btn.textContent = '♪';
    }
  });
}


/* ===================================================================
   INIT
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHearts();
  initEnvelope();
  initPetals();
  initStars();
  initSongPlayer();
  initMusic();
});