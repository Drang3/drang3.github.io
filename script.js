/* Dr@ng3 // Cyber Range: общий скрипт для всех страниц.
   Каждый блок сам проверяет, есть ли на странице нужные элементы. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* ---------- 1. Тема (оранжевый, циан, магента, лайм) ---------- */
  const THEMES = ['orange', 'cyan', 'magenta', 'lime'];
  const KEY = 'drang3-theme';
  const getTheme = () => document.documentElement.dataset.theme || 'orange';
  function setTheme(name) {
    document.documentElement.dataset.theme = name;
    try { localStorage.setItem(KEY, name); } catch (e) { /* приватный режим */ }
  }
  const themeBtn = $('#themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    setTheme(THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length]);
  });

  /* ---------- 2. Фоновый «живой терминал» ---------- */
  if (!reduce) {
    const box = el('div');
    box.id = 'bg-log';
    box.setAttribute('aria-hidden', 'true');
    document.body.prepend(box);
    const cmds = [
      'nmap -sV -p- 10.10.10.1', 'sudo su -', 'hydra -l admin -P rockyou.txt ssh://192.168.1.1',
      'msfconsole -q', 'gobuster dir -u http://target.com -w common.txt', 'cat /etc/shadow',
      'python3 exploit.py --target 10.10.10.5', "sqlmap -u 'http://site.com/?id=1' --dbs",
      'chmod +x reverse_shell.sh', './reverse_shell.sh', "echo 'Access Granted'",
      'rm -rf /var/log/syslog', 'strings -n 8 dump.dd | grep -i flag', 'ghidra --headless ./crackme'
    ];
    const outs = [
      ['g', '[+] Port 22/tcp open ssh'], ['g', '[+] Port 80/tcp open http'],
      ['o', '[-] Access denied. Retrying...'], ['w', '[!] WARNING: Intrusion detected'],
      ['o', 'root@target:~#'], ['c', '[*] Bypassing firewall...'], ['g', '[+] Hash cracked: password123'],
      ['o', '[-] Connection timed out'], ['g', '[+] Shell obtained! uid=0(root)'],
      ['w', 'Segmentation fault (core dumped)']
    ];
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const addLine = () => {
      const d = el('div');
      if (Math.random() > .4) {
        d.append(el('span', 'p', 'root@drang3:~# '), el('span', 'c', pick(cmds)));
      } else {
        const [c, t] = pick(outs);
        d.append(el('span', c, t));
      }
      box.append(d);
      while (box.children.length > 40) box.firstChild.remove();
    };
    for (let i = 0; i < 18; i++) addLine();
    (function tick() {
      if (!document.hidden) addLine();
      setTimeout(tick, rand(220, 1100));
    })();
  }

  /* ---------- 3. Аватар: RGB-расщепление + глитч ---------- */
  $$('.aberr').forEach(box => {
    box.classList.add('ready');
    const heading = $('.glitch-h');

    if (!reduce) {
      let raf = 0;
      addEventListener('pointermove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = box.getBoundingClientRect();
          const nx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
          const ny = (e.clientY - (r.top + r.height / 2)) / innerHeight;
          box.style.setProperty('--dx', (nx * 22).toFixed(1) + 'px');
          box.style.setProperty('--dy', (ny * 22).toFixed(1) + 'px');
        });
      }, { passive: true });

      const burst = async (frames = 4) => {
        box.classList.add('burst');
        if (heading) heading.classList.add('is-glitch');
        for (let i = 0; i < frames; i++) {
          const h1 = rand(6, 16), t1 = rand(4, 80 - h1);
          const h2 = rand(5, 14), t2 = rand(4, 85 - h2);
          box.style.setProperty('--t1', t1.toFixed(1) + '%');
          box.style.setProperty('--b1', (100 - t1 - h1).toFixed(1) + '%');
          box.style.setProperty('--t2', t2.toFixed(1) + '%');
          box.style.setProperty('--b2', (100 - t2 - h2).toFixed(1) + '%');
          await sleep(rand(55, 95));
        }
        box.classList.remove('burst');
        if (heading) heading.classList.remove('is-glitch');
      };
      // сборка при загрузке, дальше редкие сбои
      setTimeout(() => burst(7), 350);
      (function next() {
        setTimeout(() => { if (!document.hidden) burst(); next(); }, rand(3500, 7500));
      })();
    }
  });

  /* ---------- 4. Терминал на главной ---------- */
  const out = $('#out'), input = $('#in');
  if (out && input) {
    const POSTS = $$('.card[data-slug]').map(c => ({
      slug: c.dataset.slug, href: c.dataset.href, title: c.dataset.title
    }));
    const hist = []; let hIdx = 0;
    let skipTyping = false;

    const scroll = () => { out.scrollTop = out.scrollHeight; };
    function print(text, cls = '') {
      const p = el('p', 'line ' + cls, text);
      out.append(p); scroll(); return p;
    }
    function printParts(parts) {
      const p = el('p', 'line');
      parts.forEach(x => {
        if (typeof x === 'string') p.append(document.createTextNode(x));
        else if (x.href) { const a = el('a', '', x.t); a.href = x.href; p.append(a); }
        else p.append(el('span', x.c || '', x.t));
      });
      out.append(p); scroll(); return p;
    }
    function echo(cmd) { printParts([{ c: 'ps', t: 'root@drang3:~# ' }, cmd]); }
    const go = (url, label) => {
      print('открываю ' + label + '...', 'ok');
      setTimeout(() => { location.href = url; }, reduce ? 0 : 450);
    };
    const bySlug = s => POSTS.find(p => p.slug === s || p.slug === s.replace(/\/$/, ''));

    const BIO = 'CyberSecurity Specialist & CTF Player. Документирую путь в кибербезопасности: уязвимости, лаборатории, CTF.';
    const FOCUS = 'Сети, Веб, Эксплойты, OSINT, Инфраструктура, Форензика';
    const LINKS = [
      ['GitHub', 'https://github.com/Drang3'],
      ['TryHackMe', 'https://tryhackme.com/p/Drang3'],
      ['HackTheBox', 'https://profile.hackthebox.com/profile/01a1a224-58e1-7096-b485-9b931cf62163'],
      ['Email', 'mailto:drangexrr@gmail.com']
    ];

    const CMD = {
      help() {
        [['help', 'список команд'], ['whoami', 'кто здесь'], ['neofetch', 'сводка о системе'],
         ['ls [writeups]', 'файлы и райтапы'], ['cat <файл>', 'about.txt, contacts.txt, имя райтапа'],
         ['open <райтап>', 'открыть райтап'], ['cd writeups | about | ~', 'перейти на страницу'],
         ['theme [цвет]', 'orange, cyan, magenta, lime'], ['matrix', 'сам попробуй'], ['clear', 'очистить экран']]
          .forEach(([c, d]) => printParts([{ c: 'k', t: c.padEnd(26) }, d]));
      },
      whoami() { print('Dr@ng3 (a.k.a. Drange)', 'w'); print('CyberSecurity Specialist & CTF Player'); },
      neofetch() {
        const rows = [
          ['user', 'Dr@ng3@drange'], ['role', 'CyberSecurity Specialist & CTF Player'], ['focus', FOCUS],
          ['writeups', String(POSTS.length)], ['platforms', 'TryHackMe, HackTheBox, HKCERT CTF'],
          ['team', 'R0t3n_Dr@ng3'], ['theme', getTheme()]
        ];
        rows.forEach(([k, v]) => printParts([{ c: 'k', t: k.padEnd(11) }, v]));
      },
      ls(args) {
        const t = (args[0] || '').replace(/\/$/, '');
        if (!t) print('about.txt   contacts.txt   writeups/');
        else if (t === 'writeups') print(POSTS.map(p => p.slug + '/').join('   '));
        else print('ls: нет доступа к ' + args[0] + ': нет такого каталога', 'err');
      },
      cat(args) {
        const f = args[0] || '';
        if (f === 'about.txt') { print(BIO); print('Специализация: ' + FOCUS, 'dim'); }
        else if (f === 'contacts.txt') LINKS.forEach(([n, u]) => printParts([{ c: 'k', t: n.padEnd(12) }, { t: u.replace('mailto:', ''), href: u }]));
        else if (bySlug(f)) go(bySlug(f).href, bySlug(f).title);
        else print('cat: ' + (f || 'нужен файл') + ': нет такого файла', 'err');
      },
      open(args) {
        const p = bySlug(args[0] || '');
        if (p) go(p.href, p.title);
        else print('open: нет райтапа «' + (args[0] || '') + '». Смотри ls writeups', 'err');
      },
      cd(args) {
        const t = (args[0] || '~').replace(/\/$/, '');
        if (t === 'writeups') go('writeups.html', 'writeups');
        else if (t === 'about') go('about.html', 'about');
        else if (t === '~' || t === '..' || t === '/') print('ты уже дома', 'dim');
        else print('cd: ' + t + ': нет такого каталога', 'err');
      },
      theme(args) {
        const t = args[0];
        if (t && !THEMES.includes(t)) return print('theme: доступно ' + THEMES.join(', '), 'err');
        const next = t || THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
        setTheme(next); print('тема: ' + next, 'ok');
      },
      matrix() { rain(9000); print('wake up, Neo...', 'ok'); },
      clear() { out.textContent = ''; },
      sudo() { print('Dr@ng3 нет в файле sudoers. Об этом инциденте будет сообщено.', 'err'); },
      exit() { print('отсюда не выйти. Но можно заглянуть в writeups.', 'dim'); }
    };

    function run(raw) {
      const line = raw.trim();
      if (!line) return;
      echo(line);
      hist.push(line); hIdx = hist.length;
      const [name, ...args] = line.split(/\s+/);
      if (Object.prototype.hasOwnProperty.call(CMD, name)) CMD[name](args);
      else print('команда не найдена: ' + name + '. Введи help.', 'err');
    }
    $('#cmd').addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = hist[hIdx]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hIdx = Math.min(hist.length, hIdx + 1); input.value = hist[hIdx] || ''; }
      else if (e.key === 'Tab') {
        const v = input.value.trim();
        const hit = Object.keys(CMD).filter(c => c.startsWith(v));
        if (v && hit.length === 1) { e.preventDefault(); input.value = hit[0] + ' '; }
      }
    });
    out.addEventListener('click', e => { skipTyping = true; if (!e.target.closest('a')) input.focus(); });
    addEventListener('keydown', () => { skipTyping = true; }, { once: true });

    // вступление печатается один раз при загрузке
    async function intro() {
      const type = async (cmd) => {
        const p = el('p', 'line');
        const t = document.createTextNode('');
        p.append(el('span', 'ps', 'root@drang3:~# '), t);
        const caret = el('span', 'caret');
        p.append(caret); out.append(p);
        for (const ch of cmd) { t.data += ch; if (!skipTyping && !reduce) await sleep(rand(32, 62)); }
        caret.remove();
      };
      await sleep(skipTyping || reduce ? 0 : 500);
      await type('whoami');
      print('Dr@ng3 (a.k.a. Drange)', 'w');
      await type('cat role.txt');
      print('CyberSecurity Specialist & CTF Player');
      await type('ls writeups/');
      printParts(POSTS.flatMap((p, i) => [i ? '   ' : '', { t: p.slug + '/', href: p.href }]));
      print('Введи help или просто нажми на команду.', 'dim');
      out.setAttribute('aria-live', 'polite');
    }
    const noscript = $('#intro-static');
    if (noscript) noscript.remove();
    intro();
  }

  /* ---------- 5. Фильтры на странице райтапов ---------- */
  const list = $('#cards');
  if (list) {
    const cards = $$('.card', list);
    const tagBox = $('#tagchips'), search = $('#search'), count = $('#count'), empty = $('#empty');
    const tags = {};
    cards.forEach(c => c.dataset.tags.split(' ').filter(Boolean).forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
    const state = { tag: new URLSearchParams(location.search).get('tag') || 'all', q: '' };
    if (state.tag !== 'all' && !tags[state.tag]) state.tag = 'all';

    function drawChips() {
      tagBox.textContent = '';
      [['all', cards.length], ...Object.entries(tags).sort((a, b) => b[1] - a[1])].forEach(([t, n]) => {
        const b = el('button', 'chip', t === 'all' ? 'все' : '#' + t);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(state.tag === t));
        b.append(el('small', '', String(n)));
        b.addEventListener('click', () => {
          state.tag = t; drawChips(); apply();
          const u = new URL(location.href);
          t === 'all' ? u.searchParams.delete('tag') : u.searchParams.set('tag', t);
          history.replaceState(null, '', u);
        });
        tagBox.append(b);
      });
    }
    function apply() {
      const q = state.q.trim().toLowerCase();
      let shown = 0;
      cards.forEach(c => {
        const ok = (state.tag === 'all' || c.dataset.tags.split(' ').includes(state.tag)) &&
                   (!q || c.textContent.toLowerCase().includes(q));
        c.hidden = !ok; if (ok) shown++;
      });
      count.textContent = 'найдено: ' + shown + ' из ' + cards.length;
      empty.hidden = shown > 0;
    }
    search.addEventListener('input', e => { state.q = e.target.value; apply(); });
    drawChips(); apply();
  }

  /* ---------- 6. Инструменты для статей ---------- */
  const post = $('.post-content');
  if (post) {
    const slug = t => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');

    // время чтения
    const rt = $('#rt');
    if (rt) rt.textContent = '≈ ' + Math.max(1, Math.round(post.textContent.split(/\s+/).length / 190)) + ' мин чтения';

    // якоря и оглавление
    const used = new Set(), toc = $('#toc'), heads = $$('h2, h3', post);
    heads.forEach((h, i) => {
      let id = slug(h.textContent) || 'sec-' + i;
      while (used.has(id)) id += '-' + i;
      used.add(id); h.id = id;
      const a = el('a', 'anchor', '#'); a.href = '#' + id; a.setAttribute('aria-label', 'Ссылка на раздел');
      h.prepend(a);
    });
    const h2s = heads.filter(h => h.tagName === 'H2');
    if (toc) h2s.forEach(h => {
      const li = el('li'), a = el('a', '', h.textContent.replace(/^#/, ''));
      a.href = '#' + h.id; li.append(a); toc.append(li);
    });
    const tocBox = $('.toc details');
    if (tocBox) {
      const mq = matchMedia('(min-width: 1101px)');
      const sync = () => { tocBox.open = mq.matches; };
      sync(); mq.addEventListener('change', sync);
    }
    if (toc && 'IntersectionObserver' in window) {
      const links = new Map($$('a', toc).map(a => [a.getAttribute('href').slice(1), a]));
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { links.forEach(l => l.classList.remove('on')); const l = links.get(e.target.id); if (l) l.classList.add('on'); }
      }), { rootMargin: '-80px 0px -70% 0px' });
      h2s.forEach(h => io.observe(h));
    }

    // кнопка «copy» у блоков кода
    $$('pre', post).forEach(pre => {
      const b = el('button', 'copy', 'copy'); b.type = 'button'; b.setAttribute('aria-label', 'Скопировать код');
      b.addEventListener('click', async () => {
        const txt = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
        try { await navigator.clipboard.writeText(txt); b.textContent = 'готово'; }
        catch (e) {
          const r = document.createRange(); r.selectNodeContents(pre.querySelector('code') || pre);
          const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'выделено';
        }
        setTimeout(() => { b.textContent = 'copy'; }, 1600);
      });
      pre.append(b);
    });

    // просмотр скриншотов
    const imgs = $$('img', post);
    if (imgs.length && typeof HTMLDialogElement === 'function') {
      const dlg = el('dialog', 'lightbox'); dlg.setAttribute('aria-label', 'Просмотр изображения');
      const big = el('img'); dlg.append(big); document.body.append(dlg);
      dlg.addEventListener('click', () => dlg.close());
      imgs.forEach(im => {
        im.tabIndex = 0;
        const open = () => { big.src = im.currentSrc || im.src; big.alt = im.alt; dlg.showModal(); };
        im.addEventListener('click', open);
        im.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      });
    }

    // полоса прогресса чтения
    const bar = $('#progress');
    if (bar) {
      const art = $('.post');
      let raf = 0;
      const upd = () => {
        raf = 0;
        const r = art.getBoundingClientRect();
        const total = r.height - innerHeight * .6;
        bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, -r.top / Math.max(1, total))).toFixed(4) + ')';
      };
      addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
      upd();
    }
  }

  /* ---------- 7. Пасхалка: Konami code и matrix ---------- */
  let rainOn = false;
  function rain(ms) {
    if (rainOn || reduce) return;
    rainOn = true;
    const c = el('canvas'); c.id = 'rain'; c.setAttribute('aria-hidden', 'true');
    document.body.append(c);
    const ctx = c.getContext('2d');
    const size = 16;
    const fit = () => { c.width = innerWidth; c.height = innerHeight; };
    fit();
    const cols = Math.ceil(c.width / size);
    const drops = Array.from({ length: cols }, () => rand(-40, 0));
    const chars = '01アイウエオカキクケコサシスセソ@#$%&{}[]<>/\\'.split('');
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#27e6ff';
    const t0 = performance.now();
    (function frame(now) {
      if (now - t0 > ms) {
        c.style.opacity = '0';
        setTimeout(() => { c.remove(); rainOn = false; }, 1000);
        return;
      }
      ctx.fillStyle = 'rgba(4,5,12,.12)'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = color; ctx.font = size + 'px monospace';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > .975 ? 0 : y + 1;
      });
      requestAnimationFrame(frame);
    })(t0);
  }
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = k === KONAMI[ki] ? ki + 1 : (k === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) { ki = 0; rain(9000); }
  });

  /* ---------- 8. Привет тем, кто открыл DevTools ---------- */
  try {
    console.log('%c>_ Dr@ng3', 'font:700 22px monospace;color:#ff8a1f;text-shadow:0 0 8px #ff8a1f');
    console.log('%cЗаглянул в консоль? Значит, мы друг друга поймём.\nGitHub: https://github.com/Drang3', 'color:#27e6ff;font:13px monospace');
  } catch (e) { /* консоль недоступна */ }
})();
