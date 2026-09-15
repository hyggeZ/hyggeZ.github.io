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
