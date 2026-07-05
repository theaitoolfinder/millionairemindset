/* ── Millionaire Mindset Share Utility ── */
(function(){

  var CSS = `
  .mm-share-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin: 20px 0;
  }
  .mm-share-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: var(--text-dim, #888);
    margin-right: 2px;
    white-space: nowrap;
    align-self: center;
  }
  .mm-share-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.74rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
    line-height: 1;
    transition: background .17s, color .17s, border-color .17s, box-shadow .17s, transform .15s;
    white-space: nowrap;
  }
  .mm-share-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,.10); }
  .mm-share-btn svg { flex-shrink: 0; }
  .mm-share-fb   { background: #ebf2ff; color: #1877f2; border: 1px solid rgba(24,119,242,.22); }
  .mm-share-fb:hover   { background: #1877f2; color: #fff; border-color: #1877f2; }
  .mm-share-x    { background: #f2f2f2; color: #111;    border: 1px solid rgba(0,0,0,.15); }
  .mm-share-x:hover    { background: #111;    color: #fff; border-color: #111; }
  .mm-share-wa   { background: #eafaf2; color: #128c4a; border: 1px solid rgba(37,211,102,.22); }
  .mm-share-wa:hover   { background: #25d366; color: #fff; border-color: #25d366; }
  .mm-share-viber{ background: #f1effe; color: #5f4ee0; border: 1px solid rgba(115,96,242,.22); }
  .mm-share-viber:hover{ background: #7360f2; color: #fff; border-color: #7360f2; }
  .mm-share-tg   { background: #e7f5fc; color: #0088cc; border: 1px solid rgba(34,158,217,.22); }
  .mm-share-tg:hover   { background: #229ed9; color: #fff; border-color: #229ed9; }
  .mm-share-native{ background: var(--primary-light, #fdecea); color: var(--primary, #CC1010); border: 1px solid rgba(204,16,16,.22); }
  .mm-share-native:hover{ background: var(--primary, #CC1010); color: #fff; border-color: var(--primary, #CC1010); }
  .mm-share-copy { background: var(--surface, #fff); color: var(--text-dim, #666); border: 1px solid var(--border, #e5e7eb); }
  .mm-share-copy:hover { background: #f4f4f5; }
  .mm-share-copy.copied { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  function encodedUrl(url) { return encodeURIComponent(url); }
  function encodedText(t)  { return encodeURIComponent(t); }

  window.mmShareBar = function(containerId, opts) {
    var el = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;
    if (!el) return;

    var url   = opts && opts.url   ? opts.url   : window.location.href;
    var title = opts && opts.title ? opts.title : document.title;
    var msg   = opts && opts.msg   ? opts.msg   : title + ' — ' + url;

    var nativeBtn = '';
    if (navigator.share) {
      var safeUrl   = url.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      var safeTitle = title.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      var safeMsg   = msg.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      nativeBtn = '<button class="mm-share-btn mm-share-native" '
        + 'onclick="navigator.share({url:\'' + safeUrl + '\',title:\'' + safeTitle + '\',text:\'' + safeMsg + '\'})">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
        + 'Share Now</button>';
    }

    var bar = document.createElement('div');
    bar.className = 'mm-share-bar';
    bar.innerHTML =
      '<span class="mm-share-label">Share</span>'
      + nativeBtn
      + '<a class="mm-share-btn mm-share-fb" href="https://www.facebook.com/sharer.php?u=' + encodedUrl(url) + '" target="_blank" rel="noopener">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>Facebook</a>'
      + '<a class="mm-share-btn mm-share-x" href="https://twitter.com/intent/tweet?url=' + encodedUrl(url) + '&text=' + encodedText(title) + '" target="_blank" rel="noopener">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X</a>'
      + '<a class="mm-share-btn mm-share-wa" href="https://wa.me/?text=' + encodedText(msg) + '" target="_blank" rel="noopener">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>WhatsApp</a>'
      + '<a class="mm-share-btn mm-share-viber" href="viber://forward?text=' + encodedText(msg) + '" target="_blank" rel="noopener">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 2C6.12 2 2 6.12 2 11.4c0 2.6 1.06 4.96 2.77 6.68L3.5 22l4.13-1.08A9.3 9.3 0 0011.4 21.8c5.28 0 9.4-4.12 9.4-9.4S16.68 2 11.4 2zm4.36 13.06c-.23.65-1.34 1.24-1.84 1.3-.46.06-.9.08-2.93-.61-2.46-.84-4.04-3.36-4.16-3.52-.12-.16-.98-1.3-.98-2.48s.62-1.76.84-2c.22-.24.48-.3.64-.3l.46.01c.14 0 .34-.05.53.4l.76 1.86c.07.17.04.37-.07.53l-.42.52-.16.17c.09.17.44.72 1.02 1.24.72.65 1.33.86 1.52.95.19.1.3.08.41-.05l.56-.67c.12-.15.3-.19.48-.12l1.83.86c.2.1.32.15.34.25.03.1.03.54-.23 1.16z"/></svg>Viber</a>'
      + '<a class="mm-share-btn mm-share-tg" href="https://t.me/share/url?url=' + encodedUrl(url) + '&text=' + encodedText(title) + '" target="_blank" rel="noopener">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>Telegram</a>'
      + '<button class="mm-share-btn mm-share-copy" id="mmCopyBtn_' + Math.random().toString(36).slice(2) + '" onclick="mmCopyLink(this,\'' + url.replace(/'/g,"\\'") + '\')">'
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Link</button>';

    el.appendChild(bar);
  };

  window.mmCopyLink = function(btn, url) {
    var target = url || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(target).then(function(){
        btn.classList.add('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!';
        setTimeout(function(){ btn.classList.remove('copied'); btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Link'; }, 2500);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = target; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      setTimeout(function(){ btn.classList.remove('copied'); btn.textContent = 'Copy Link'; }, 2500);
    }
  };

})();
