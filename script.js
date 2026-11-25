// Áferðinni – valmynd og upplestur

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Loka valmyndinni þegar smellt er utan hennar
  document.addEventListener('click', function (e) {
    if (!nav || !toggle) return;
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  setupReadAloud();
});

// Texti hlutans eins og hann birtist, án upplestrarhnappanna sjálfra.
function sectionText(el) {
  var buttons = el.querySelectorAll('.read-btn');
  var previous = [];

  Array.prototype.forEach.call(buttons, function (btn, i) {
    previous[i] = btn.style.display;
    btn.style.display = 'none';
  });

  var text = el.innerText || el.textContent || '';

  Array.prototype.forEach.call(buttons, function (btn, i) {
    btn.style.display = previous[i];
  });

  return text.replace(/\s+/g, ' ').trim();
}

function setupReadAloud() {
  var RA = window.ReadAloud;
  if (!RA) return;

  var lang = String(document.documentElement.lang || 'is').toLowerCase().indexOf('en') === 0 ? 'en' : 'is';
  var labels = lang === 'en'
    ? { play: 'Listen', stop: 'Stop', aria: 'Read this section aloud' }
    : { play: 'Lesa upp', stop: 'Stöðva', aria: 'Lesa þennan hluta upphátt' };

  function make(section) {
    var btn = RA.makeButton({
      lang: lang,
      playLabel: labels.play,
      stopLabel: labels.stop,
      ariaLabel: labels.aria
    });
    RA.attach(btn, function () { return sectionText(section); }, lang);
    return btn;
  }

  var hero = document.querySelector('.hero');
  var heroActions = hero ? hero.querySelector('.hero-actions') : null;
  if (heroActions) heroActions.appendChild(make(hero));

  Array.prototype.forEach.call(document.querySelectorAll('main section.section'), function (section) {
    var head = section.querySelector('.section-head');
    if (head) head.appendChild(make(section));
  });
}
