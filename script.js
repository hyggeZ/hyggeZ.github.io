const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.dataset.theme = savedTheme;
if (toggle) toggle.textContent = root.dataset.theme === 'dark' ? '☀' : '☾';

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
document.querySelectorAll('code.language-go').forEach((code) => {
  const source = code.textContent;
  const pattern = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*"|`[^`]*`)|\b(package|import|func|var|const|type|struct|interface|return|if|else|for|range|switch|case|default|defer|go|select|chan|map)\b|\b(string|int|bool|byte|rune|uintptr|uint8|uint16|uint32|any|error)\b/g;
  let output = '', cursor = 0;
  for (const match of source.matchAll(pattern)) {
    output += escapeHTML(source.slice(cursor, match.index));
    const cls = match[1] ? 'tok-comment' : match[2] ? 'tok-string' : match[3] ? 'tok-key' : 'tok-type';
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
