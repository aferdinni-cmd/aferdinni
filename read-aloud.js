// Upplestur texta í vafranum (Web Speech API).
// Notað á forsíðum og í kennsluvefnum. Engin ytri þjónusta og ekkert net.

(function () {
  'use strict';

  var supported = typeof window !== 'undefined' &&
    !!window.speechSynthesis &&
    !!window.SpeechSynthesisUtterance;

  var activeBtn = null;

  function pickVoice(lang) {
    try {
      var voices = window.speechSynthesis.getVoices() || [];
      var prefix = lang === 'en' ? 'en' : 'is';
      for (var i = 0; i < voices.length; i++) {
        if (String(voices[i].lang || '').toLowerCase().indexOf(prefix) === 0) {
          return voices[i];
        }
      }
    } catch (e) { /* hunsa */ }
    return null;
  }

  // Skiptir löngum texta í styttri búta svo lesturinn slitni ekki.
  function chunk(text, max) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    var sentences = clean.match(/[^.!?…]+[.!?…]*/g) || [clean];
    var out = [];
    var cur = '';
    sentences.forEach(function (s) {
      if (cur && (cur + s).length > max) {
        out.push(cur.trim());
        cur = s;
      } else {
        cur += s;
      }
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  function reset(btn) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', 'false');
    var label = btn.querySelector('.read-label');
    if (label) label.textContent = btn.getAttribute('data-play-label') || label.textContent;
  }

  function stop() {
    if (!supported) return;
    var btn = activeBtn;
    activeBtn = null;
    reset(btn);
    try {
      window.speechSynthesis.cancel();
    } catch (e) { /* hunsa */ }
  }

  function toggle(btn, text) {
    if (!supported || !btn) return;

    if (activeBtn === btn) {
      stop();
      return;
    }

    stop();

    var parts = chunk(text, 200);
    if (!parts.length) return;

    var lang = btn.getAttribute('data-lang') || 'is';
    var voice = pickVoice(lang);

    activeBtn = btn;
    btn.setAttribute('aria-pressed', 'true');
    var label = btn.querySelector('.read-label');
    if (label) label.textContent = btn.getAttribute('data-stop-label') || label.textContent;

    parts.forEach(function (part, i) {
      var u = new SpeechSynthesisUtterance(part);
      u.lang = lang === 'en' ? 'en-US' : 'is-IS';
      u.rate = 0.95;
      if (voice) u.voice = voice;

      if (i === parts.length - 1) {
        u.onend = function () {
          if (activeBtn === btn) {
            activeBtn = null;
            reset(btn);
          }
        };
      }
      u.onerror = function () {
        if (activeBtn === btn) {
          activeBtn = null;
          reset(btn);
        }
      };

      window.speechSynthesis.speak(u);
    });
  }

  function showHint(lang) {
    var old = document.querySelector('.read-toast');
    if (old) old.remove();

    var toast = document.createElement('p');
    toast.className = 'read-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = lang === 'en'
      ? 'Read aloud is not supported in this browser. Open the page in Safari or Chrome.'
      : 'Upplestur virkar ekki í þessum vafra. Opnaðu síðuna í Safari eða Chrome.';

    toast.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:24px',
      'transform:translateX(-50%)',
      'z-index:9999',
      'max-width:min(92vw,440px)',
      'margin:0',
      'padding:12px 18px',
      'border-radius:12px',
      'background:#16181c',
      'color:#fff',
      'font-size:14px',
      'line-height:1.45',
      'text-align:center',
      'box-shadow:0 10px 30px rgba(0,0,0,.32)'
    ].join(';');

    document.body.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 8000);
  }

  // Setur upplestur á hnapp: les textann eða sýnir skilaboð ef vafrinn styður það ekki.
  function attach(btn, getText, lang) {
    btn.addEventListener('click', function () {
      if (!supported) {
        showHint(lang || btn.getAttribute('data-lang') || 'is');
        return;
      }
      toggle(btn, getText());
    });
    return btn;
  }

  function makeButton(opts) {
    var o = opts || {};
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'read-btn' + (o.className ? ' ' + o.className : '');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', o.ariaLabel || o.playLabel || '');
    btn.setAttribute('data-lang', o.lang || 'is');
    btn.setAttribute('data-play-label', o.playLabel || 'Lesa upp');
    btn.setAttribute('data-stop-label', o.stopLabel || 'Stöðva');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
        '<path d="M4 9v6h3.6L12 19V5L7.6 9H4Z" fill="currentColor"/>' +
        '<path d="M15.5 8.2a5.2 5.2 0 0 1 0 7.6M18 5.6a8.6 8.6 0 0 1 0 12.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
      '</svg>' +
      '<span class="read-label">' + (o.playLabel || 'Lesa upp') + '</span>';
    return btn;
  }

  window.ReadAloud = {
    supported: supported,
    makeButton: makeButton,
    attach: attach,
    toggle: toggle,
    stop: stop
  };
})();
