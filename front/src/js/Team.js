// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 80);
});

// MATRIX RAIN
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const chars = 'アイウエオ01LEXABYTE01'.split('');
const fontSize = 14;
let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
setInterval(() => {
  ctx.fillStyle = 'rgba(2,10,2,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff41';
  ctx.font = fontSize + 'px Share Tech Mono';
  drops.forEach((d, i) => {
    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, d * fontSize);
    if (d * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}, 50);