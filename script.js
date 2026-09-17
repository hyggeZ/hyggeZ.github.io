const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');
const styleSelect = document.querySelector('#style-select');
const musicToggle = document.querySelector('#music-toggle');
const savedTheme = localStorage.getItem('theme');
const savedStyle = ['a', 'b'].includes(localStorage.getItem('ui-style')) ? localStorage.getItem('ui-style') : 'a';
if (savedTheme) root.dataset.theme = savedTheme;
root.dataset.style = savedStyle;
if (toggle) toggle.textContent = root.dataset.theme === 'dark' ? '☀' : '☾';
if (styleSelect) styleSelect.value = savedStyle;

styleSelect?.addEventListener('change', () => {
  root.dataset.style = styleSelect.value;
  localStorage.setItem('ui-style', styleSelect.value);
  updateMusicLabel();
});

let audioContext;
let ambientNodes = [];
function stopAmbient() {
  ambientNodes.forEach((node) => { try { node.stop?.(); } catch {} try { node.disconnect?.(); } catch {} });
  ambientNodes = [];
  if (musicToggle) {
    musicToggle.setAttribute('aria-pressed', 'false');
    updateMusicLabel();
  }
}

function updateMusicLabel() {
  if (!musicToggle) return;
  const playing = musicToggle.getAttribute('aria-pressed') === 'true';
  musicToggle.querySelector('small').textContent = playing ? '正在播放' : root.dataset.style === 'b' ? '树下无声' : '静默播放';
  musicToggle.querySelector('.music-control').textContent = playing ? 'Ⅱ' : '▶';
}
updateMusicLabel();

async function startAmbient() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  await audioContext.resume();
  const master = audioContext.createGain();
  master.gain.setValueAtTime(.0001, audioContext.currentTime);
  master.gain.exponentialRampToValueAtTime(.055, audioContext.currentTime + 2.4);
  master.connect(audioContext.destination);
  ambientNodes.push(master);

  [110, 164.81, 220].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 1 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 4 - 3;
    gain.gain.value = index === 0 ? .32 : .13;
    oscillator.connect(gain).connect(master);
    oscillator.start();
    ambientNodes.push(oscillator, gain);
  });

  const noise = audioContext.createBufferSource();
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * .12;
  noise.buffer = buffer;
  noise.loop = true;
  const filter = audioContext.createBiquadFilter();
  const breeze = audioContext.createGain();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  breeze.gain.value = .12;
  noise.connect(filter).connect(breeze).connect(master);
  noise.start();
  ambientNodes.push(noise, filter, breeze);

  musicToggle.setAttribute('aria-pressed', 'true');
  updateMusicLabel();
}

musicToggle?.addEventListener('click', () => {
  if (musicToggle.getAttribute('aria-pressed') === 'true') stopAmbient();
  else startAmbient();
});

const lyricLine = document.querySelector('#lyric-line');
const lyricLines = [
  '晨光落在窗前，风正经过山野',
  '云从很远的地方来，又向远方去',
  '愿每一次出发，都通向更辽阔的自己',
  '树影缓慢移动，时间安静地生长'
];
let lyricIndex = 0;
if (lyricLine) setInterval(() => {
  lyricLine.style.opacity = '0';
  setTimeout(() => {
    lyricIndex = (lyricIndex + 1) % lyricLines.length;
    lyricLine.textContent = lyricLines[lyricIndex];
    lyricLine.style.opacity = '1';
  }, 350);
}, 5600);

document.querySelectorAll('.empty-book').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

toggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀' : '☾';
});

document.querySelectorAll('.copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = button.closest('.code-card').querySelector('code').textContent;
    await navigator.clipboard.writeText(code);
    button.textContent = '已复制';
    setTimeout(() => { button.textContent = '复制'; }, 1200);
  });
});

const escapeHTML = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
document.querySelectorAll('code.language-go, code.language-js, code.language-html, code.language-css').forEach((code) => {
  const source = code.textContent;
  const language = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9);
  const patterns = {
    go: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|`[^`]*`)|\b(package|import|func|var|const|type|struct|interface|return|if|else|for|range|switch|case|default|defer|go|select|chan|map)\b|\b(string|int|bool|byte|rune|uintptr|uint8|uint16|uint32|any|error)\b|\b(\d+(?:\.\d+)?)\b/g,
    js: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|var|function|return|if|else|for|while|class|new|this|async|await|import|from|export|default)\b|\b(string|number|boolean|null|undefined|true|false)\b|\b(\d+(?:\.\d+)?)\b/g,
    html: /(<!--[\s\S]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(<\/?[\w-]+|\/?>)|\b([\w-]+)(?==)/g,
    css: /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([.#]?[\w-]+(?=\s*\{))|([\w-]+)(?=\s*:)|\b(\d+(?:\.\d+)?(?:px|rem|em|%|s)?)\b/g
  };
  const pattern = patterns[language];
  if (!pattern) return;
  let output = '', cursor = 0;
  for (const match of source.matchAll(pattern)) {
    output += escapeHTML(source.slice(cursor, match.index));
    let cls = match[1] ? 'tok-comment' : match[2] ? 'tok-string' : match[3] ? 'tok-key' : match[4] ? 'tok-type' : 'tok-number';
    if (language === 'html') cls = match[1] ? 'tok-comment' : match[2] ? 'tok-string' : match[3] ? 'tok-tag' : 'tok-attr';
    if (language === 'css') cls = match[1] ? 'tok-comment' : match[2] ? 'tok-string' : match[3] ? 'tok-tag' : match[4] ? 'tok-prop' : 'tok-number';
    output += `<span class="${cls}">${escapeHTML(match[0])}</span>`;
    cursor = match.index + match[0].length;
  }
  code.innerHTML = output + escapeHTML(source.slice(cursor));
});

const progress = document.querySelector('#progress');
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${max ? scrollY / max * 100 : 0}%`;
}, { passive: true });
