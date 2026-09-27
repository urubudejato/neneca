// ==========================================================================
// CARTINHA PARA A LULU - INTERATIVIDADE, ANIMAÇÕES E ÁUDIO ROMÂNTICO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');
  const openCue = document.getElementById('openCue');
  const letterModal = document.getElementById('letterModal');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const foldBackBtn = document.getElementById('foldBackBtn');
  const sendHeartBtn = document.getElementById('sendHeartBtn');
  const photoInput = document.getElementById('photoInput');
  const polaroidImg = document.getElementById('polaroidImg');
  const musicToggle = document.getElementById('musicToggle');

  // Carregar foto salva no localStorage se existir
  const savedPhoto = localStorage.getItem('lulu_carta_photo');
  if (savedPhoto) {
    polaroidImg.src = savedPhoto;
  }

  // Upload e troca da foto
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        polaroidImg.src = event.target.result;
        try {
          localStorage.setItem('lulu_carta_photo', event.target.result);
        } catch (err) {
          console.warn('Não foi possível salvar a imagem no localStorage por tamanho:', err);
        }
        createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
      };
      reader.readAsDataURL(file);
    }
  });

  // Abertura da Carta
  let isOpen = false;

  function openLetter(e) {
    if (isOpen) return;
    isOpen = true;

    // Dispara animação na aba e no selo
    envelopeWrapper.classList.add('opening');
    
    // Explosão de corações a partir do selo
    const sealRect = waxSeal.getBoundingClientRect();
    createHeartBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2);

    // Tentar tocar a melodia suave
    startRomanticMusic();

    // Abre a carta após a animação da aba
    setTimeout(() => {
      letterModal.classList.add('active');
    }, 550);
  }

  // Fechamento da Carta
  function closeLetter() {
    letterModal.classList.remove('active');
    setTimeout(() => {
      envelopeWrapper.classList.remove('opening');
      isOpen = false;
    }, 400);
  }

  // Eventos de clique para abrir
  waxSeal.addEventListener('click', openLetter);
  envelope.addEventListener('click', openLetter);
  openCue.addEventListener('click', openLetter);

  // Eventos para fechar
  closeLetterBtn.addEventListener('click', closeLetter);
  foldBackBtn.addEventListener('click', closeLetter);

  // Botão "Te mandar um abraço"
  sendHeartBtn.addEventListener('click', (e) => {
    const rect = sendHeartBtn.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
    
    // Feedback fofo no botão
    const originalText = sendHeartBtn.innerHTML;
    sendHeartBtn.innerHTML = '<span>Abraço enviado! 🥰</span>';
    setTimeout(() => {
      sendHeartBtn.innerHTML = originalText;
    }, 2200);
  });

  // Clique em qualquer lugar gera corações flutuantes
  document.addEventListener('click', (e) => {
    // Ignorar cliques nos botões para não duplicar
    if (e.target.closest('button') || e.target.closest('.change-photo-btn') || e.target.closest('#waxSeal')) return;
    spawnClickHeart(e.clientX, e.clientY);
  });

  function spawnClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    const emojis = ['❤️', '💖', '✨', '💕', '🌸', '🥰'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1400);
  }

  // Explosão de corações concentrada
  function createHeartBurst(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        const emojis = ['❤️', '💖', '✨', '💕'];
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const offsetX = (Math.random() - 0.5) * 140;
        const offsetY = (Math.random() - 0.5) * 80;
        
        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 1400);
      }, i * 35);
    }
  }

  // ==========================================================================
  // CANVASS DE CORAÇÕES SUAVES NO FUNDO
  // ==========================================================================
  const canvas = document.getElementById('hearts-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const backgroundHearts = [];
  const heartColors = [
    'rgba(240, 142, 164, 0.35)',
    'rgba(255, 175, 195, 0.45)',
    'rgba(224, 83, 116, 0.3)',
    'rgba(255, 215, 225, 0.3)'
  ];

  class FloatingHeart {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 14 + 10;
      this.speed = Math.random() * 0.7 + 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      this.swing = Math.random() * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speed;
      this.angle += this.swingSpeed;
      this.x += Math.sin(this.angle) * this.swing;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 20, this.size / 20);
      ctx.fillStyle = this.color;
      
      // Desenha o formato do coração
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
      ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
      ctx.fill();
      
      ctx.restore();
    }
  }

  for (let i = 0; i < 35; i++) {
    backgroundHearts.push(new FloatingHeart());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let heart of backgroundHearts) {
      heart.update();
      heart.draw();
    }
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  // ==========================================================================
  // SINTETIZADOR DE MÚSICA ROMÂNTICA (WEB AUDIO API - ZERO DEPENDÊNCIAS)
  // Toca uma caixinha de música suave estilo lofi / piano
  // ==========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, time, duration = 1.2, volume = 0.04) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Sequência melódica romântica suave (notas em Hz)
  const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  const melody = [
    notes.C5, notes.E5, notes.G5, notes.A5,
    notes.G5, notes.E5, notes.D5, notes.C5,
    notes.E5, notes.G5, notes.A5, notes.C5,
    notes.D5, notes.F5, notes.E5, notes.D5
  ];

  let noteIdx = 0;

  function startRomanticMusic() {
    if (isPlayingMusic) return;
    initAudioContext();
    isPlayingMusic = true;
    musicToggle.classList.add('playing');

    const stepTime = 0.45;
    musicInterval = setInterval(() => {
      const now = audioCtx.currentTime;
      playTone(melody[noteIdx % melody.length], now, 1.4, 0.035);
      
      // harmonia suave a cada 2 notas
      if (noteIdx % 2 === 0) {
        playTone(melody[noteIdx % melody.length] / 2, now, 2.0, 0.02);
      }
      
      noteIdx++;
    }, stepTime * 1000);
  }

  function stopRomanticMusic() {
    if (!isPlayingMusic) return;
    isPlayingMusic = false;
    clearInterval(musicInterval);
    musicToggle.classList.remove('playing');
  }

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlayingMusic) {
      stopRomanticMusic();
    } else {
      startRomanticMusic();
    }
  });

});
