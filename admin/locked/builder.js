// ====== КОНФИГ ======
const BASE_URL = 'https://drang3.github.io/';
const IMG_DIR = 'img/';

// ====== УТИЛИТЫ ======
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyToClipboard(id) {
  const el = document.getElementById(id);
  el.select();
  el.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(el.value).then(() => {
    alert('Скопировано!');
  }).catch(() => {
    document.execCommand('copy');
    alert('Скопировано!');
  });
}

function clearAll() {
  if (!confirm('Очистить все поля?')) return;
  document.querySelectorAll('input, textarea').forEach(el => {
    if (!el.readOnly) el.value = '';
  });
  document.getElementById('date').valueAsDate = new Date();
}

// ====== ГЕНЕРАЦИЯ ======
function generate() {
  const title = document.getElementById('title').value.trim();
  const slugInput = document.getElementById('slug').value.trim();
  const tags = document.getElementById('tags').value.trim().split(/\s+/).filter(Boolean);
  const flagsRaw = document.getElementById('flags').value.trim();
  const imagesRaw = document.getElementById('images').value.trim();
  const content = document.getElementById('content').value.trim();
  const dateInput = document.getElementById('date').value;

  // Валидация
  if (!title) return alert('Введи название!');
  if (!content) return alert('Введи HTML-контент!');

  const slug = slugInput || slugify(title);
  const date = dateInput || new Date().toISOString().split('T')[0];
  const dateRu = new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Таблица флагов
  let flagsTable = '';
  if (flagsRaw) {
    const rows = flagsRaw.split('\n').filter(l => l.trim()).map(line => {
      const [flag, where] = line.split('|').map(s => s.trim());
      return `<tr><td><code>${flag || ''}</code></td><td>${where || ''}</td></tr>`;
    }).join('');
    flagsTable = `
<h2>🏆 Найденные флаги</h2>
<table>
<tr><th>Флаг</th><th>Где найден</th></tr>
${rows}
</table>`;
  }

  // Картинки
  let imgHtml = '';
  if (imagesRaw) {
    const imgs = imagesRaw.split(',').map(s => s.trim()).filter(Boolean);
    imgHtml = imgs.map(name => 
      `<img alt="${escapeHtml(title)}" decoding="async" loading="lazy" src="${IMG_DIR}${name}"/>`
    ).join('\n');
  }

  // HTML тегов
  const tagsHtml = tags.map(t => `<li class="t-${t}">#${t}</li>`).join('');

  // ====== ИТОГОВЫЙ HTML ======
  const postHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} | Dr@ng3</title>
<meta name="description" content="${escapeHtml(title)} — райтап от Dr@ng3.">
<meta name="theme-color" content="#04050c">
<meta property="og:title" content="${escapeHtml(title)} | Dr@ng3">
<meta property="og:description" content="${escapeHtml(title)} — райтап от Dr@ng3.">
<meta name="twitter:card" content="summary">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Play:wght@400;700&display=swap">
<link rel="stylesheet" href="style.css">
<script>try{var t=localStorage.getItem('drang3-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">К содержимому</a>
<header class="site"><div class="wrap bar">
  <a class="logo" href="index.html" aria-label="Dr@ng3, главная"><span class="pr">&gt;_</span> Dr@ng3</a>
  <nav class="main" aria-label="Основная">
    <a href="index.html">Home</a>
    <a href="writeups.html" aria-current="page">Writeups</a>
    <a href="about.html">About</a>
  </nav>
  <button class="theme-btn" id="themeBtn" type="button" aria-label="Сменить цвет"><span></span></button>
</div></header>
<div id="progress" aria-hidden="true"></div>
<main id="main" class="wrap">
  <div class="post-grid">
    <article class="post">
      <a class="back" href="writeups.html">&lt; Все райтапы</a>
      <h1 class="post-title neon-text">${escapeHtml(title)}</h1>
      <div class="post-meta">
        <span class="badge">CTF</span>
        <time datetime="${date}">${dateRu}</time>
        <span id="rt"></span>
        <ul class="tags">${tagsHtml}</ul>
      </div>
      <div class="post-content">
${flagsTable}
${content}
${imgHtml}
      </div>
      <nav class="pager" aria-label="Другие райтапы"></nav>
    </article>
    <aside class="toc" aria-label="Содержание"><details open><summary>Содержание</summary><ol id="toc"></ol></details></aside>
  </div>
</main>
<footer class="site"><div class="wrap">
  <span>Dr@ng3 // Cyber Range &copy; 2026</span>
  <ul><li><a href="https://github.com/Drang3" target="_blank" rel="noopener">GitHub</a></li><li><a href="https://tryhackme.com/p/Drang3" target="_blank" rel="noopener">TryHackMe</a></li><li><a href="https://profile.hackthebox.com/profile/01a1a224-58e1-7096-b485-9b931cf62163" target="_blank" rel="noopener">HackTheBox</a></li><li><a href="mailto:drangexrr@gmail.com">Email</a></li></ul>
</div></footer>
<script src="script.js"></script>
</body>
</html>`;

  // ====== КАРТОЧКА ======
  const cardHtml = `<article class="frame card" data-slug="${slug}" data-href="${slug}.html" data-title="${escapeHtml(title)}" data-tags="${tags.join(' ')}" data-date="${date}">
  <div class="in">
    <div class="top"><span class="badge">CTF</span><time datetime="${date}">${dateRu}</time></div>
    <h3><a href="${slug}.html">${escapeHtml(title)}</a></h3>
    <p>Райтап от Dr@ng3. Подробности внутри.</p>
    <ul class="tags">${tagsHtml}</ul>
    <span class="go" aria-hidden="true">Читать &gt;</span>
  </div>
</article>`;

  // ====== НАВИГАЦИЯ ДЛЯ ПРЕДЫДУЩЕГО ======
  const navHtml = `<nav class="pager" aria-label="Другие райтапы">
  <div class="frame"><div><a class="prev" href="ПРЕДЫДУЩИЙ.html"><small>&lt; Раньше</small>ПРЕДЫДУЩИЙ</a></div></div>
  <div class="frame next"><div><a class="next" href="${slug}.html"><small>Позже &gt;</small>${escapeHtml(title)}</a></div></div>
</nav>`;

  // Вывод
  document.getElementById('output').value = postHtml;
  document.getElementById('cardOutput').value = cardHtml;
  document.getElementById('navOutput').value = navHtml;
  document.getElementById('filename').textContent = slug + '.html';

  alert('Готово! Теперь:\n1. Скопируй HTML → создай файл ' + slug + '.html\n2. Скопируй карточку → вставь в writeups.html и index.html\n3. Скопируй навигацию → замени в предыдущем посте\n4. Закинь картинки в img/\n5. git push');
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('date').valueAsDate = new Date();
  document.getElementById('title').addEventListener('input', (e) => {
    document.getElementById('slug').value = slugify(e.target.value);
  });
});
