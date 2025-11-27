

console.log('JS cargado correctamente — Dimensión Inversa Loca');

// Estado local
const crazyColors = ['#ff00ff','#00ffff','#ffff00','#ff0080','#80ff00','#0080ff','#ff8000','#8000ff','#00ff80','#ff0040'];
let bgColor = crazyColors[0];
let rotation = 0;
let scale = 1;
let runawayPositions = {}; // { id: {x,y} }
let isOpen = false;
let isDark = false;
let volume = 50; // valor visible (pero INVERSO)
let isMuted = false;
let counter = 0;

// Referencias DOM
const app = document.getElementById('app');
const floating = document.getElementById('floating');
const panelContent = document.getElementById('panelContent');
const panelState = document.getElementById('panelState');
const openPanel = document.getElementById('openPanel');
const closePanel = document.getElementById('closePanel');
const incBtn = document.getElementById('inc');
const decBtn = document.getElementById('dec');
const counterEl = document.getElementById('counter');
const volumeLabel = document.getElementById('volumeLabel');
const volumeRange = document.getElementById('volumeRange');
const muteBtn = document.getElementById('muteBtn');
const themeToggle = document.getElementById('themeToggle');
const themeState = document.getElementById('themeState');
const toastArea = document.getElementById('toast');

if (!app || !floating) {
  console.error('Elementos esenciales no encontrados en DOM. Asegúrate de que index.html está correcto.');
}

// TOAST simple
function showToast(text, ms = 2200) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  toastArea.appendChild(t);
  // animación de salida
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(12px)';
  }, ms);
  setTimeout(() => t.remove(), ms + 300);
}

// Background: colores psicodélicos rotando
setInterval(() => {
  bgColor = crazyColors[Math.floor(Math.random() * crazyColors.length)];
  rotation = (rotation + 6) % 360;
  scale = scale === 1 ? 1.03 : 1;
  document.body.style.background = `linear-gradient(${rotation}deg, ${bgColor}, ${crazyColors[(crazyColors.indexOf(bgColor) + 1) % crazyColors.length]})`;
  app.style.transform = `scale(${scale})`;
}, 300);

// Floating elements (estrellas, rayos, corazones, sparkles)
function createFloating(){
  floating.innerHTML = '';
  for(let i = 0; i < 20; i++){
    const el = document.createElement('div');
    el.className = 'float-obj';
    el.style.left = Math.random()*100 + '%';
    el.style.top = Math.random()*100 + '%';
    el.style.animation = `floaty ${2 + Math.random()*3}s ease-in-out infinite`;
    el.style.animationDelay = Math.random()*2 + 's';
    el.textContent = i%4===0? '★' : i%4===1? '⚡' : i%4===2? '❤' : '✨';
    el.style.pointerEvents = 'none';
    floating.appendChild(el);
  }
}
createFloating();

// Runaway logic (mueve el elemento lejos del cursor)
function handleRunawayFactory(id){
  const el = document.querySelector(`[data-id='${id}']`);
  if(!el) return;
  el.addEventListener('mouseenter', (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    let dx = centerX - mouseX;
    let dy = centerY - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    const move = 110 + Math.random()*60; // distancia variable
    dx = (dx/dist) * move;
    dy = (dy/dist) * move;
    runawayPositions[id] = runawayPositions[id] || {x:0,y:0};
    runawayPositions[id].x += dx;
    runawayPositions[id].y += dy;
    el.style.transform = `translate(${runawayPositions[id].x}px, ${runawayPositions[id].y}px) rotate(${(runawayPositions[id].x/20)}deg)`;
  });
}
['panel1','panel2','counter','volume','theme','buttons'].forEach(handleRunawayFactory);

// PANEL: los botones están INVERSOS intencionalmente
openPanel.addEventListener('click', () => {
  // 'ABRIR Panel' en realidad CERRARÁ
  isOpen = false;
  updatePanel();
  showToast('“Interesante elección: tu sombra acaba de solicitar aumento y un sindicato.”', 1800);
});
closePanel.addEventListener('click', () => {
  // 'CERRAR Panel' en realidad ABRIRÁ
  isOpen = true;
  updatePanel();
  showToast('“Perfecto, tu sombra te acaba de poner un 7/10 en estilo… dice que practiques el giro final.”', 1800);
});
function updatePanel(){
  if(isOpen){
    panelContent.classList.remove('closed');
    panelState.textContent = 'ABIERTO';
  } else {
    panelContent.classList.add('closed');
    panelState.textContent = 'CERRADO';
  }
}

// THEME: invertir comportamiento
themeToggle.addEventListener('click', () => {
  // Si se pide "Modo Oscuro" → activamos el modo CLARO (inverso)
  isDark = !isDark;
  // NOTA: invertimos el texto visible para confundir: el control dice lo contrario
  // Implementación: el efecto real será OPUESTO del label que el usuario ve al principio.
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? 'Modo Oscuro' : 'Modo Claro';
  themeState.textContent = isDark ? '☀️ Tema: OSCURO' : '🌙 Tema: CLARO';
  showToast(isDark ? '¡Se activó el tema (opuesto al botón)!' : '¡Se desactivó el tema (opuesto al botón)!', 1600);
});

// COUNTER invertido: el botón "+ Aumentar" resta, "- Disminuir" aumenta
incBtn.addEventListener('click', () => {
  // Aumentar en pantalla -> en realidad restamos
  counter -= 1;
  updateCounter();
  showToast('Se restó 1 (botón era + Aumentar)', 1200);
});
decBtn.addEventListener('click', () => {
  // Disminuir en pantalla -> en realidad sumamos
  counter += 1;
  updateCounter();
  showToast('Se sumó 1 (botón era - Disminuir)', 1200);
});
function updateCounter(){
  counterEl.textContent = counter;
}
updateCounter();

// VOLUMEN invertido
// Slider: su valor real es 100 - slider.value (inverso)
// Botón "Silenciar" hace lo contrario: si clickeas 'Silenciar' -> sube al 100
volumeRange.addEventListener('input', (e) => {
  const raw = Number(e.target.value);          // 0..100
  volume = 100 - raw;                          // inversión
  volumeLabel.textContent = `Volumen: ${volume}%`;
});
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  if(isMuted){
    // si el usuario "silencia", en realidad lo SUBIMOS
    volume = 100;
    volumeRange.value = 0; // mostrar slider al revés (0 => 100 real)
    volumeLabel.textContent = `Volumen: ${volume}%`;
    muteBtn.textContent = 'Activar Sonido'; // texto invertido
    showToast('¡Se subió al máximo en vez de silenciar!', 1400);
  } else {
    // si el usuario reactiva, en realidad bajamos a 0
    volume = 0;
    volumeRange.value = 100;
    volumeLabel.textContent = `Volumen: ${volume}%`;
    muteBtn.textContent = 'Silenciar';
    showToast('¡Se bajó a 0 en vez de activar!', 1400);
  }
});

// BOTONES caóticos (responden al revés)
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const byeBtn = document.getElementById('byeBtn');
const hiBtn = document.getElementById('hiBtn');

if (yesBtn && noBtn && byeBtn && hiBtn) {
  yesBtn.addEventListener('click', () => {
    // El usuario hace clic en "SÍ" -> respondemos "NO"
    showToast('Lenta pero despierta', 1200);
    yesBtn.style.background = crazyColors[Math.floor(Math.random()*crazyColors.length)];
  });
  noBtn.addEventListener('click', () => {
    // Clic en "NO" -> respondemos "SÍ"
    showToast('✅ SÍ (reBrillante pero confundida', 1200);
    noBtn.style.background = crazyColors[Math.floor(Math.random()*crazyColors.length)];
  });
  byeBtn.addEventListener('click', () => {
    // ADIÓS -> saludamos (inverso)
    showToast('Silenciosa pero escandalosa', 1200);
    byeBtn.style.background = crazyColors[Math.floor(Math.random()*crazyColors.length)];
  });
  hiBtn.addEventListener('click', () => {
    // HOLA -> nos vamos (inverso)
    showToast('Seria pero chistosa', 1200);
    hiBtn.style.background = crazyColors[Math.floor(Math.random()*crazyColors.length)];
  });
}

// Hover: botones caóticos cambian color
document.querySelectorAll('.chaotic').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.background = crazyColors[Math.floor(Math.random()*crazyColors.length)];
    btn.style.color = '#fff';
  });
});

// Reset runaway con 'r' para volver al centro (útil si se pierden elementos)
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    runawayPositions = {};
    document.querySelectorAll('.runaway').forEach(el => el.style.transform = 'translate(0,0) rotate(0deg)');
    showToast('Posiciones reseteadas (r)', 1100);
  }
});

// Mensaje de bienvenida
showToast('Bienvenido a la Dimensión Inversa Loca — todo hace lo contrario', 2200);

const canvas = document.getElementById("scratchCanvas");
const percentText = document.getElementById("scratchPercent");
const resetBtn = document.getElementById("scratchReset");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let scratching = false;

  // Fondo gris simulado
  function drawOverlay() {
    ctx.fillStyle = "#6095ffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#5c9dffff";
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
  }

  drawOverlay();

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Calcular porcentaje
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    const percent = Math.round(
      (transparent / (pixels.length / 4)) * 100
    );

    percentText.textContent = percent + "%";
  }

  function handleMove(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    scratch(x, y);
  }

  canvas.addEventListener("mousedown", () => (scratching = true));
  canvas.addEventListener("mouseup", () => (scratching = false));
  canvas.addEventListener("mouseleave", () => (scratching = false));
  canvas.addEventListener("mousemove", e => scratching && handleMove(e));

  canvas.addEventListener("touchstart", e => {
    scratching = true;
    handleMove(e);
  });

  canvas.addEventListener("touchmove", e => scratching && handleMove(e));
  canvas.addEventListener("touchend", () => (scratching = false));

  resetBtn.addEventListener("click", () => {
    drawOverlay();
    percentText.textContent = "0%";
  });
}

