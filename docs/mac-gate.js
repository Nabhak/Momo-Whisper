/* mac-gate.js — Momo Whisper is Mac-only. Blocks download clicks from non-Mac
 * visitors (iPhone/iPad, Android, Windows, Linux, ChromeOS) and shows a
 * friendly in-page modal instead of starting/failing a download.
 * Mac desktop visitors are completely unaffected — this never touches their
 * click. iPadOS reports itself as "Macintosh" in the UA, so it's detected via
 * navigator.maxTouchPoints > 1 (real Macs report 0 touch points). */
(function () {
  'use strict';

  function isMacDesktop() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPod|Android/i.test(ua)) return false;
    if (/Windows|CrOS/i.test(ua)) return false;
    if (/Linux/i.test(ua) && !/Macintosh|Mac OS X/i.test(ua)) return false;
    if (!/Macintosh|Mac OS X/i.test(ua)) return false;
    /* iPad (incl. iPadOS 13+, which reports UA as "Macintosh") has touch;
       a real Mac's trackpad/mouse reports 0-1 touch points. */
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) return false;
    return true;
  }

  var IS_MAC = isMacDesktop();
  if (IS_MAC) return; /* nothing to do for Mac desktop visitors */

  var DOWNLOAD_SELECTOR = 'a[href*="releases/latest/download"], a[href*=".mcpb"]';
  var modal = null;
  var lastFocused = null;

  function buildModal() {
    var style = document.createElement('style');
    style.textContent = [
      '.mg-backdrop{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;',
      'background:rgba(18,18,18,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
      'padding:20px;opacity:0;transition:opacity 180ms ease;}',
      '.mg-backdrop.mg-open{opacity:1;}',
      '.mg-card{width:100%;max-width:380px;background:#fff;border-radius:24px;padding:28px 24px 24px;',
      'box-shadow:0 24px 60px -12px rgba(18,18,18,.35);font-family:var(--sans,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif);',
      'transform:translateY(8px) scale(.98);opacity:0;transition:transform 220ms cubic-bezier(.16,1,.3,1),opacity 220ms ease;}',
      '.mg-backdrop.mg-open .mg-card{transform:translateY(0) scale(1);opacity:1;}',
      '.mg-title{font-family:var(--display,-apple-system,sans-serif);font-size:19px;font-weight:600;',
      'letter-spacing:-.3px;color:var(--ink,#121212);margin:0 0 8px;line-height:1.3;}',
      '.mg-body{font-size:15px;line-height:1.5;color:var(--body,#474645);margin:0 0 20px;}',
      '.mg-actions{display:flex;gap:10px;flex-wrap:wrap;}',
      '.mg-btn{flex:1 1 auto;min-width:0;display:inline-flex;align-items:center;justify-content:center;',
      'height:44px;padding:0 16px;border-radius:22px;font-family:var(--sans,inherit);font-size:15px;',
      'font-weight:500;letter-spacing:-.1px;border:0;cursor:pointer;white-space:nowrap;',
      'transition:background-color 100ms ease,transform 160ms cubic-bezier(.16,1,.3,1);}',
      '.mg-btn:active{transform:scale(.97);}',
      '.mg-btn-primary{background:var(--accent,#0072e8);color:#fff;}',
      '.mg-btn-primary:hover{background:var(--accent-dark,#005fc2);}',
      '.mg-btn-secondary{background:var(--pill,#f2f4f7);color:var(--ink,#121212);}',
      '.mg-btn-secondary:hover{background:var(--pill-hover,#e8ebf0);}',
      '.mg-link-fallback{margin-top:12px;font-size:12px;color:var(--muted,#848281);word-break:break-all;',
      'user-select:all;-webkit-user-select:all;display:none;}',
      '.mg-link-fallback.mg-show{display:block;}',
      '@media (prefers-color-scheme:dark){',
      '.mg-card{background:#242322;box-shadow:0 24px 60px -12px rgba(0,0,0,.6);}',
      '.mg-title{color:#f3f2f0;}',
      '.mg-body{color:#c9c7c4;}',
      '.mg-btn-secondary{background:#38362f;color:#f3f2f0;}',
      '.mg-btn-secondary:hover{background:#413f37;}',
      '.mg-link-fallback{color:#9c9a97;}',
      '}'
    ].join('');
    document.head.appendChild(style);

    var backdrop = document.createElement('div');
    backdrop.className = 'mg-backdrop';
    backdrop.setAttribute('role', 'presentation');

    var card = document.createElement('div');
    card.className = 'mg-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-labelledby', 'mgTitle');
    card.setAttribute('aria-describedby', 'mgBody');

    card.innerHTML =
      '<h2 class="mg-title" id="mgTitle">Sorry — Momo Whisper is Mac&#8209;only</h2>' +
      '<p class="mg-body" id="mgBody">It runs on macOS 13 or later. Open this page on your Mac to download.</p>' +
      '<div class="mg-actions">' +
      '<button type="button" class="mg-btn mg-btn-secondary" id="mgCopy">Copy link</button>' +
      '<button type="button" class="mg-btn mg-btn-primary" id="mgOk">Got it</button>' +
      '</div>' +
      '<p class="mg-link-fallback" id="mgFallback"></p>';

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    var copyBtn = card.querySelector('#mgCopy');
    var okBtn = card.querySelector('#mgOk');
    var fallback = card.querySelector('#mgFallback');

    function close() {
      backdrop.classList.remove('mg-open');
      setTimeout(function () {
        backdrop.style.display = 'none';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }, 180);
      document.removeEventListener('keydown', onKeydown, true);
    }

    function onKeydown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        var focusables = card.querySelectorAll('button');
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    copyBtn.addEventListener('click', function () {
      var url = location.href;
      function copiedState() {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy link'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(copiedState, function () {
          fallback.textContent = url;
          fallback.classList.add('mg-show');
        });
      } else {
        fallback.textContent = url;
        fallback.classList.add('mg-show');
      }
    });

    okBtn.addEventListener('click', close);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });

    return {
      open: function () {
        lastFocused = document.activeElement;
        backdrop.style.display = 'flex';
        /* force reflow so the opacity/transform transition runs */
        void backdrop.offsetWidth;
        backdrop.classList.add('mg-open');
        document.addEventListener('keydown', onKeydown, true);
        okBtn.focus();
      },
      close: close
    };
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest(DOWNLOAD_SELECTOR) : null;
    if (!a) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!modal) modal = buildModal();
    modal.open();
  }, true);
})();
