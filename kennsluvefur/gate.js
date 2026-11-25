// Lykilorðsgátt og lesari fyrir kennsluvef Á ferðinni.

// Lykilorðið er geymt sem SHA-256 tætigildi, ekki sem hreinn texti.
// Núverandi lykilorð: aferdinni2026
// Til að breyta: keyrðu `printf '%s' 'NYJA_LYKILORDID' | shasum -a 256` í Terminal
// og settu tætigildið hér fyrir neðan.
const PASSWORD_HASH = '6e551d788388ba48dc549a97a4fa72cd29840d71a64928a962e15ae182f7cce7';
const SESSION_KEY = 'af-kennsluvefur-unlocked';
const LANG_KEY = 'af-lang';

const I18N = {
  is: {
    docTitle: 'Kennsluvefur – Á ferðinni',
    back: '← Á ferðinni',
    gateTitle: 'Kennsluvefur',
    gateLead: 'Þessi hluti vefsins er fyrir nemendur Á ferðinni. Sláðu inn lykilorðið sem þú fékkst hjá ökukennaranum.',
    passLabel: 'Lykilorð',
    passPlaceholder: 'Lykilorð',
    wrongPass: 'Rangt lykilorð. Reyndu aftur.',
    openBtn: 'Opna kennsluvef',
    helpText: 'Kannt þú ekki lykilorðið? Hafðu samband:',
    brandSuffix: 'kennsluvefur',
    logout: 'Loka',
    tocTitle: 'Efnisyfirlit',
    pageSelectLabel: 'Veldu síðu',
    loading: 'Hleð námsefni…',
    chapterKicker: 'Kafli {n} af {total}',
    noteDefault: 'Athugið',
    readPlay: 'Lesa upp',
    readStop: 'Stöðva',
    readAria: 'Lesa upphátt',
    cardQuestion: 'Spurning',
    cardAnswer: 'Svar',
    signAlt: 'Umferðarmerki',
    cardsHint: 'Ýttu á spjaldið til að sjá svarið.',
    cardsHintBack: 'Ýttu á spjaldið til að sjá spurninguna aftur.',
    cardsPrev: '← Fyrri',
    cardsNext: 'Næsta →',
    cardsShuffle: 'Stokka',
    cardsEmpty: 'Engin spjöld hér enn þegar.',
    cardsCounter: '{n} / {total}',
    videosEmpty: 'Engin myndbönd skráð enn þegar.',
    sourcesEmpty: 'Engar heimildir skráðar enn þegar.',
    notFound: '<h1>Námsefnið fannst ekki</h1><p>Vinsamlegast endurhlaða síðunni. Ef vandamálið heldur áfram skaltu hafa samband við ökukennarann.</p>',
    cryptoError: 'Vafrinn leyfir ekki innskráningu hér. Opnaðu vefinn á netinu eða á localhost.',
    toggleLabel: 'English'
  },
  en: {
    docTitle: 'Study site – Á ferðinni',
    back: '← Á ferðinni',
    gateTitle: 'Study site',
    gateLead: 'This part of the site is for Á ferðinni students. Enter the password you received from your instructor.',
    passLabel: 'Password',
    passPlaceholder: 'Password',
    wrongPass: 'Wrong password. Please try again.',
    openBtn: 'Open the study site',
    helpText: 'Don\u2019t know the password? Get in touch:',
    brandSuffix: 'study site',
    logout: 'Log out',
    tocTitle: 'Contents',
    pageSelectLabel: 'Choose a page',
    loading: 'Loading material…',
    chapterKicker: 'Chapter {n} of {total}',
    noteDefault: 'Note',
    readPlay: 'Listen',
    readStop: 'Stop',
    readAria: 'Read aloud',
    cardQuestion: 'Question',
    cardAnswer: 'Answer',
    signAlt: 'Road sign',
    cardsHint: 'Tap the card to see the answer.',
    cardsHintBack: 'Tap the card to see the question again.',
    cardsPrev: '← Previous',
    cardsNext: 'Next →',
    cardsShuffle: 'Shuffle',
    cardsEmpty: 'No cards here yet.',
    cardsCounter: '{n} / {total}',
    videosEmpty: 'No videos added yet.',
    sourcesEmpty: 'No sources added yet.',
    notFound: '<h1>The material could not be loaded</h1><p>Please reload the page. If the problem continues, contact your instructor.</p>',
    cryptoError: 'Your browser does not allow signing in here. Open the site online or on localhost.',
    toggleLabel: 'Íslenska'
  }
};

function getInitialLang() {
  const param = new URLSearchParams(location.search).get('lang');
  if (param === 'is' || param === 'en') return param;
  try {
    if (localStorage.getItem(LANG_KEY) === 'en') return 'en';
  } catch (e) { /* localStorage kann að vera lokað */ }
  return 'is';
}

let lang = getInitialLang();

function t(key) {
  const dict = I18N[lang] || I18N.is;
  return dict[key] !== undefined ? dict[key] : I18N.is[key];
}

function applyLang() {
  document.documentElement.lang = lang;
  document.title = t('docTitle');

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.textContent = t('toggleLabel');
    btn.setAttribute('lang', lang === 'en' ? 'is' : 'en');
  });
}

function switchLang() {
  const next = lang === 'en' ? 'is' : 'en';
  try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* hunsa */ }
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  location.href = url.toString();
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(function (b) { return b.toString(16).padStart(2, '0'); })
    .join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', function () {
  const gate = document.getElementById('gate');
  const reader = document.getElementById('reader');
  const form = document.getElementById('gateForm');
  const input = document.getElementById('password');
  const error = document.getElementById('gateError');
  const article = document.getElementById('article');
  const pageBody = document.getElementById('pageBody');
  const tocNav = document.getElementById('tocNav');
  const pageSelect = document.getElementById('pageSelect');
  const logout = document.getElementById('logout');

  let site = null;
  let chapters = [];
  let currentPage = null;
  let cards = null;
  let cardIndex = 0;
  let cardFlipped = false;

  applyLang();

  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', switchLang);
  });

  pageSelect.addEventListener('change', function () {
    navigate(pageSelect.value);
  });

  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    openReader();
  } else {
    input.focus();
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    let hash = '';
    try {
      hash = await sha256Hex(value);
    } catch (err) {
      error.textContent = t('cryptoError');
      error.hidden = false;
      return;
    }

    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      input.value = '';
      error.hidden = true;
      applyLang();
      openReader();
    } else {
      error.hidden = false;
      input.select();
    }
  });

  logout.addEventListener('click', function () {
    if (window.ReadAloud) window.ReadAloud.stop();
    sessionStorage.removeItem(SESSION_KEY);
    reader.hidden = true;
    gate.hidden = false;
    input.value = '';
    input.focus();
  });

  async function openReader() {
    gate.hidden = true;
    reader.hidden = false;

    if (!site) {
      try {
        await loadSite();
      } catch (err) {
        pageBody.innerHTML = t('notFound');
        return;
      }
      renderNav();
    }

    const param = new URLSearchParams(location.search).get('page');
    navigate(param || firstPageId());
  }

  async function loadSite() {
    const file = lang === 'en' ? 'pages.en.json' : 'pages.json';
    const res = await fetch(file, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    site = await res.json();

    const needsChapters = (site.sections || []).some(function (s) { return s.source === 'chapters'; });

    if (needsChapters && !chapters.length) {
      const chFile = lang === 'en' ? 'content.en.json' : 'content.json';
      try {
        const chRes = await fetch(chFile, { cache: 'no-store' });
        if (chRes.ok) {
          const data = await chRes.json();
          chapters = data.chapters || [];
        }
      } catch (e) { chapters = []; }
    }

    (site.sections || []).forEach(function (section) {
      if (section.source === 'chapters') {
        section.pages = chapters.map(function (ch, i) {
          return {
            id: 'ch-' + i,
            title: ch.title,
            type: 'chapter',
            index: i,
            sectionTitle: section.title
          };
        });
      } else {
        (section.pages || []).forEach(function (p) {
          p.sectionTitle = section.title;
        });
      }
    });
  }

  function allPages() {
    const out = [];
    (site.sections || []).forEach(function (section) {
      (section.pages || []).forEach(function (p) { out.push(p); });
    });
    return out;
  }

  function firstPageId() {
    const pages = allPages();
    return pages.length ? pages[0].id : null;
  }

  function findPage(id) {
    return allPages().filter(function (p) { return p.id === id; })[0] || null;
  }

  function renderNav() {
    tocNav.innerHTML = '';
    pageSelect.innerHTML = '';

    (site.sections || []).forEach(function (section) {
      if (!section.pages || !section.pages.length) return;

      const group = document.createElement('div');
      group.className = 'toc-group';

      const heading = document.createElement('p');
      heading.className = 'toc-section';
      heading.textContent = section.title;
      group.appendChild(heading);

      section.pages.forEach(function (p) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toc-page';
        btn.textContent = p.title;
        btn.dataset.id = p.id;
        btn.addEventListener('click', function () { navigate(p.id); });
        group.appendChild(btn);
      });

      tocNav.appendChild(group);

      const optgroup = document.createElement('optgroup');
      optgroup.label = section.title;

      section.pages.forEach(function (p) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.title;
        optgroup.appendChild(opt);
      });

      pageSelect.appendChild(optgroup);
    });
  }

  function setActive(id) {
    Array.prototype.forEach.call(tocNav.querySelectorAll('.toc-page'), function (btn) {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
    if (pageSelect.value !== id) pageSelect.value = id;
  }

  function clearPager() {
    const old = article.querySelector('.chapter-nav');
    if (old) old.remove();
  }

  function renderPager(page) {
    const order = allPages();
    const i = order.findIndex(function (p) { return p.id === page.id; });
    if (i < 0) return;

    const prev = i > 0 ? order[i - 1] : null;
    const next = i < order.length - 1 ? order[i + 1] : null;
    if (!prev && !next) return;

    const nav = document.createElement('nav');
    nav.className = 'chapter-nav';

    if (prev) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pager prev';
      b.innerHTML = '← ' + escapeHtml(prev.title);
      b.addEventListener('click', function () { navigate(prev.id); });
      nav.appendChild(b);
    }

    if (next) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pager next';
      b.innerHTML = escapeHtml(next.title) + ' →';
      b.addEventListener('click', function () { navigate(next.id); });
      nav.appendChild(b);
    }

    article.appendChild(nav);
  }

  async function navigate(id, opts) {
    if (!site) return;
    const page = findPage(id) || findPage(firstPageId());
    if (!page) return;

    currentPage = page;
    setActive(page.id);

    if (window.ReadAloud) window.ReadAloud.stop();
    cards = null;
    cardIndex = 0;
    cardFlipped = false;
    clearPager();

    await renderPage(page);
    renderPager(page);

    if (!opts || !opts.silent) {
      const url = new URL(location.href);
      url.searchParams.set('page', page.id);
      history.replaceState(null, '', url.toString());

      const target = document.querySelector('.reader-body');
      if (target) target.scrollIntoView({ block: 'start' });
      article.focus({ preventScroll: true });
    }
  }

  async function renderPage(page) {
    if (page.type === 'chapter') return renderChapter(page);
    if (page.type === 'cards') return renderCards(page);
    if (page.type === 'videos') return renderVideos(page);
    if (page.type === 'sources') return renderSources(page);
    pageBody.innerHTML = t('notFound');
  }

  function pageHeader(page) {
    return '<p class="chapter-kicker">' + escapeHtml(page.sectionTitle || '') + '</p>' +
           '<h1>' + escapeHtml(page.title) + '</h1>';
  }

  function addReadButton(target, text) {
    if (!window.ReadAloud || !target) return;
    const tools = target.querySelector('.article-tools');
    if (!tools) return;

    const btn = window.ReadAloud.makeButton({
      lang: lang,
      playLabel: t('readPlay'),
      stopLabel: t('readStop'),
      ariaLabel: t('readAria')
    });
    window.ReadAloud.attach(btn, function () { return text; }, lang);
    tools.appendChild(btn);
  }

  function renderChapter(page) {
    const ch = chapters[page.index];
    if (!ch) {
      pageBody.innerHTML = '<h1>' + escapeHtml(page.title) + '</h1>';
      return;
    }

    const kicker = t('chapterKicker')
      .replace('{n}', String(page.index + 1))
      .replace('{total}', String(chapters.length));

    const parts = ['<p class="chapter-kicker">' + escapeHtml(kicker) + '</p>',
                   '<h1>' + escapeHtml(ch.title) + '</h1>',
                   '<div class="article-tools"></div>'];

    (ch.blocks || []).forEach(function (block) {
      parts.push(renderBlock(block));
    });

    pageBody.innerHTML = parts.join('');
    addReadButton(pageBody, chapterSpeech(ch));
  }

  function chapterSpeech(ch) {
    const parts = [ch.title];
    (ch.blocks || []).forEach(function (block) {
      if (block.type === 'h') {
        parts.push(block.text);
      } else if (block.type === 'note') {
        parts.push((block.title ? block.title + '. ' : '') + block.text);
      } else if (block.type === 'ul') {
        (block.items || []).forEach(function (item) { parts.push(item); });
      } else {
        parts.push(block.text);
      }
    });
    return parts.join('. ');
  }

  function renderBlock(block) {
    if (block.type === 'h') return '<h2>' + escapeHtml(block.text) + '</h2>';
    if (block.type === 'note') {
      return '<div class="note"><h3>' + escapeHtml(block.title || t('noteDefault')) + '</h3><p>' + escapeHtml(block.text) + '</p></div>';
    }
    if (block.type === 'ul') {
      return '<ul>' + (block.items || []).map(function (item) {
        return '<li>' + escapeHtml(item) + '</li>';
      }).join('') + '</ul>';
    }
    return '<p>' + escapeHtml(block.text) + '</p>';
  }

  async function renderCards(page) {
    pageBody.innerHTML = pageHeader(page) + '<p class="loading">' + escapeHtml(t('loading')) + '</p>';

    // Enska útgáfan notar íslensku spjaldasöfnin þar til ensk þýðing liggur fyrir.
    const candidates = lang === 'en' ? ['en', 'is'] : ['is'];
    let loaded = [];

    for (const l of candidates) {
      const file = l === 'en'
        ? 'cards/en/' + page.id + '.json'
        : 'cards/' + page.id + '.json';

      try {
        const res = await fetch(file, { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        loaded = data.cards || [];
      } catch (err) {
        loaded = [];
      }

      if (loaded.length) {
        if (l === 'is' && lang === 'en') {
          loaded = loaded.map(function (c) {
            // Aðeins merkjaspjöldin eiga að fá enska spurningu; verkefni halda sinni eigin.
            if (String(c.q || '').indexOf('Hvaða umferðarmerki') === 0) {
              return Object.assign({}, c, { q: 'Which road sign is this?' });
            }
            return c;
          });
        }
        break;
      }
    }

    cards = loaded;
    cardIndex = 0;
    cardFlipped = false;
    renderCard(page);
  }

  function renderCard(page) {
    if (!cards || !cards.length) {
      pageBody.innerHTML = pageHeader(page) + '<p>' + escapeHtml(t('cardsEmpty')) + '</p>';
      return;
    }

    const card = cards[cardIndex];
    const counter = t('cardsCounter')
      .replace('{n}', String(cardIndex + 1))
      .replace('{total}', String(cards.length));

    const signName = (card.a || '').split('.')[0] || t('signAlt');
    const image = card.image
      ? '<figure class="flash-card-image"><img src="' + escapeHtml(card.image) + '" alt="' + escapeHtml(signName) + '" loading="lazy"></figure>'
      : '';

    pageBody.innerHTML =
      pageHeader(page) +
      '<p class="cards-progress">' + escapeHtml(counter) + '</p>' +
      '<div class="article-tools"></div>' +
      '<div class="flash-card" id="flashCard" tabindex="0" role="button" aria-pressed="' + (cardFlipped ? 'true' : 'false') + '" data-flipped="' + (cardFlipped ? 'true' : 'false') + '">' +
        image +
        '<span class="flash-card-tag">' + escapeHtml(cardFlipped ? t('cardAnswer') : t('cardQuestion')) + '</span>' +
        '<p class="flash-card-text">' + escapeHtml(cardFlipped ? card.a : card.q) + '</p>' +
        '<span class="flash-card-hint">' + escapeHtml(cardFlipped ? t('cardsHintBack') : t('cardsHint')) + '</span>' +
      '</div>' +
      '<div class="flash-card-controls">' +
        '<button type="button" class="cards-btn" data-card="prev">' + escapeHtml(t('cardsPrev')) + '</button>' +
        '<button type="button" class="cards-btn" data-card="shuffle">' + escapeHtml(t('cardsShuffle')) + '</button>' +
        '<button type="button" class="cards-btn" data-card="next">' + escapeHtml(t('cardsNext')) + '</button>' +
      '</div>';

    const readText = cardFlipped
      ? (card.q || '') + ' ' + (card.a || '')
      : (card.q || '');
    addReadButton(pageBody, readText);

    const cardEl = document.getElementById('flashCard');
    if (cardEl) {
      cardEl.addEventListener('click', flipCard);
      cardEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flipCard();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goCard(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goCard(1);
        }
      });
    }

    const prevBtn = pageBody.querySelector('[data-card="prev"]');
    const nextBtn = pageBody.querySelector('[data-card="next"]');
    const shuffleBtn = pageBody.querySelector('[data-card="shuffle"]');
    if (prevBtn) prevBtn.addEventListener('click', function () { goCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goCard(1); });
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleCards);
  }

  function flipCard() {
    cardFlipped = !cardFlipped;
    renderCard(currentPage);
    const el = document.getElementById('flashCard');
    if (el) el.focus({ preventScroll: true });
  }

  function goCard(delta) {
    if (!cards || !cards.length) return;
    cardIndex = (cardIndex + delta + cards.length) % cards.length;
    cardFlipped = false;
    renderCard(currentPage);
    const el = document.getElementById('flashCard');
    if (el) el.focus({ preventScroll: true });
  }

  function shuffleCards() {
    if (!cards || cards.length < 2) return;
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = cards[i];
      cards[i] = cards[j];
      cards[j] = tmp;
    }
    cardIndex = 0;
    cardFlipped = false;
    renderCard(currentPage);
  }

  async function renderVideos(page) {
    pageBody.innerHTML = pageHeader(page) + '<p class="loading">' + escapeHtml(t('loading')) + '</p>';

    const file = lang === 'en' ? 'videos.en.json' : 'videos.json';
    let videos = [];

    try {
      const res = await fetch(file, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        videos = data.videos || [];
      }
    } catch (e) { videos = []; }

    if (!videos.length) {
      pageBody.innerHTML = pageHeader(page) + '<p>' + escapeHtml(t('videosEmpty')) + '</p>';
      return;
    }

    pageBody.innerHTML = pageHeader(page) + '<div class="video-list">' +
      videos.map(function (v) {
        const embed = videoEmbed(v.url);
        return '<article class="video-item">' +
          '<h2>' + escapeHtml(v.title || '') + '</h2>' +
          '<div class="video-frame">' + embed + '</div>' +
          (v.description ? '<p>' + escapeHtml(v.description) + '</p>' : '') +
        '</article>';
      }).join('') + '</div>';
  }

  function videoEmbed(url) {
    if (!url) return '';

    const yt = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) {
      return '<iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '" title="" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }

    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
      return '<video controls preload="metadata" src="' + escapeHtml(url) + '"></video>';
    }

    return '<p class="video-link"><a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(url) + '</a></p>';
  }

  async function renderSources(page) {
    pageBody.innerHTML = pageHeader(page) + '<p class="loading">' + escapeHtml(t('loading')) + '</p>';

    const file = lang === 'en' ? 'sources.en.json' : 'sources.json';
    let sources = [];

    try {
      const res = await fetch(file, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        sources = data.sources || [];
      }
    } catch (e) { sources = []; }

    if (!sources.length) {
      pageBody.innerHTML = pageHeader(page) + '<p>' + escapeHtml(t('sourcesEmpty')) + '</p>';
      return;
    }

    pageBody.innerHTML = pageHeader(page) + '<ul class="source-list">' +
      sources.map(function (s) {
        const title = s.url
          ? '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener">' + escapeHtml(s.title || s.url) + '</a>'
          : escapeHtml(s.title || '');
        return '<li>' +
          '<strong>' + title + '</strong>' +
          (s.publisher ? '<span class="source-publisher">' + escapeHtml(s.publisher) + '</span>' : '') +
          (s.note ? '<p>' + escapeHtml(s.note) + '</p>' : '') +
        '</li>';
      }).join('') + '</ul>';
  }
});
