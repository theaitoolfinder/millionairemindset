/**
 * HIRA & AYA — Floating Chat Widget
 * Injects a floating chatbot button + panel into every page.
 * No dependencies. Pure JS + inline CSS.
 */
(function () {
  'use strict';

  /* ── Prevent double-init ── */
  if (document.getElementById('mm-chat-widget')) return;

  /* ══════════════════════════════════════════════
     1. INJECT STYLES
  ══════════════════════════════════════════════ */
  var style = document.createElement('style');
  style.textContent = `
  /* ── Widget root ── */
  #mm-chat-widget {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    font-family: "Poppins", system-ui, sans-serif;
    font-size: 14px;
  }

  /* ── Fab button ── */
  #mm-chat-fab {
    width: 62px; height: 62px;
    border-radius: 50%;
    background: linear-gradient(135deg, #CC1010, #A80D0D);
    box-shadow: 0 6px 28px rgba(204,16,16,.38), 0 2px 8px rgba(0,0,0,.18);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
    position: relative;
    overflow: visible;
  }
  #mm-chat-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 36px rgba(204,16,16,.46), 0 3px 12px rgba(0,0,0,.22);
  }
  #mm-chat-fab.open { transform: scale(1.05) rotate(10deg); }

  /* mini character on fab */
  #mm-chat-fab svg.fab-char { width: 38px; height: 38px; }

  /* notification dot */
  #mm-chat-notif {
    position: absolute; top: 4px; right: 4px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #C8900A;
    border: 2px solid #fff;
    display: none;
    animation: mm-pulse 1.6s infinite;
  }
  #mm-chat-notif.show { display: block; }
  @keyframes mm-pulse {
    0%,100% { transform: scale(1); opacity:1; }
    50%      { transform: scale(1.3); opacity:.7; }
  }

  /* tooltip */
  #mm-chat-tooltip {
    position: absolute; bottom: 72px; right: 0;
    background: rgba(30,12,12,.88);
    backdrop-filter: blur(12px);
    color: #fff; font-size: .76rem; font-weight: 600;
    padding: 7px 14px; border-radius: 12px;
    white-space: nowrap;
    opacity: 0; pointer-events: none;
    transform: translateY(6px);
    transition: opacity .2s, transform .2s;
  }
  #mm-chat-widget:hover #mm-chat-tooltip { opacity:1; transform: translateY(0); }

  /* ── Panel ── */
  #mm-chat-panel {
    position: absolute;
    bottom: 74px; right: 0;
    width: 370px;
    max-height: 580px;
    background: rgba(255,255,255,.96);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,.98);
    border-radius: 28px;
    box-shadow: 0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(204,16,16,.08),
                inset 0 1px 0 rgba(255,255,255,1);
    display: flex; flex-direction: column;
    overflow: hidden;
    opacity: 0; pointer-events: none;
    transform: translateY(18px) scale(.96);
    transform-origin: bottom right;
    transition: opacity .25s cubic-bezier(.4,0,.2,1),
                transform .25s cubic-bezier(.34,1.56,.64,1);
  }
  #mm-chat-panel.open {
    opacity: 1; pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  /* ── Panel header ── */
  .mm-panel-head {
    background: linear-gradient(135deg, #CC1010 0%, #A80D0D 100%);
    padding: 16px 18px 14px;
    display: flex; align-items: center; gap: 12px;
    position: relative;
  }
  .mm-panel-char-mini {
    width: 52px; height: 52px; flex-shrink: 0;
    background: rgba(255,255,255,.15);
    border-radius: 50%; overflow: hidden;
    border: 2px solid rgba(255,255,255,.4);
  }
  .mm-panel-char-mini svg { width: 100%; height: 100%; }
  .mm-panel-info { flex: 1; }
  .mm-panel-name {
    color: #fff; font-weight: 800; font-size: .95rem;
    letter-spacing: -.01em; line-height: 1.2;
  }
  .mm-panel-status {
    color: rgba(255,255,255,.75); font-size: .72rem; margin-top: 2px;
  }
  .mm-panel-switcher {
    display: flex; gap: 5px;
  }
  .mm-sw-btn {
    padding: 4px 13px; border-radius: 999px; border: 1.5px solid rgba(255,255,255,.4);
    background: rgba(255,255,255,.12); color: rgba(255,255,255,.7);
    font: 600 .72rem "Poppins",sans-serif; cursor: pointer; transition: .18s;
  }
  .mm-sw-btn.active {
    background: rgba(255,255,255,.92); color: #CC1010; border-color: transparent;
  }
  .mm-close-btn {
    background: rgba(255,255,255,.18); border: none;
    color: #fff; border-radius: 50%; width: 28px; height: 28px;
    cursor: pointer; font-size: 1rem; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
    flex-shrink: 0;
  }
  .mm-close-btn:hover { background: rgba(255,255,255,.32); }

  /* character stage inside header */
  .mm-stage-wrap {
    display: flex; justify-content: center;
    padding: 14px 18px 8px;
    background: rgba(255,245,245,.5);
    border-bottom: 1px solid rgba(204,16,16,.08);
    gap: 0;
  }
  .mm-stage-wrap svg {
    width: 90px; height: auto;
    filter: drop-shadow(0 6px 14px rgba(204,16,16,.12));
  }

  /* speech bubble */
  .mm-bubble-wrap {
    padding: 0 18px 12px;
    background: rgba(255,245,245,.5);
    border-bottom: 1px solid rgba(204,16,16,.08);
  }
  .mm-bubble {
    background: rgba(255,255,255,.85);
    border: 1px solid rgba(204,16,16,.1);
    border-radius: 14px 14px 14px 4px;
    padding: 10px 14px;
    font-size: .8rem; line-height: 1.55;
    color: #3d1010;
    min-height: 42px;
    transition: opacity .25s;
  }

  /* ── Chat messages ── */
  .mm-messages {
    flex: 1; overflow-y: auto; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 10px;
    background: rgba(255,252,252,.7);
  }
  .mm-messages::-webkit-scrollbar { width: 4px; }
  .mm-messages::-webkit-scrollbar-thumb { background: rgba(204,16,16,.15); border-radius: 4px; }

  .mm-msg { display: flex; align-items: flex-end; gap: 8px; }
  .mm-msg.user { flex-direction: row-reverse; }

  .mm-msg-av {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#CC1010,#A80D0D);
    color: #fff; font-weight: 800; font-size: .7rem;
    display: flex; align-items: center; justify-content: center;
  }
  .mm-msg.user .mm-msg-av { background: linear-gradient(135deg,#C8900A,#A07208); }

  .mm-msg-body { max-width: 72%; }
  .mm-msg-bub {
    padding: 9px 13px; border-radius: 16px 16px 16px 4px;
    font-size: .8rem; line-height: 1.55;
    background: rgba(255,255,255,.9);
    border: 1px solid rgba(204,16,16,.1);
    color: #1a0505;
    box-shadow: 0 1px 4px rgba(0,0,0,.05);
  }
  .mm-msg.user .mm-msg-bub {
    background: linear-gradient(135deg,#CC1010,#A80D0D);
    color: #fff; border: none;
    border-radius: 16px 16px 4px 16px;
    box-shadow: 0 2px 8px rgba(204,16,16,.22);
  }
  .mm-msg-time {
    font-size: .68rem; color: rgba(122,74,74,.6);
    margin-top: 4px; padding: 0 4px;
  }
  .mm-msg.user .mm-msg-time { text-align: right; }

  /* typing */
  .mm-typing { display: flex; align-items: center; gap: 8px; }
  .mm-typing-dots { display: flex; gap: 4px; padding: 10px 14px; }
  .mm-typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #CC1010; opacity: .4;
    animation: mm-dot-bounce .9s infinite;
  }
  .mm-typing-dot:nth-child(2) { animation-delay: .15s; }
  .mm-typing-dot:nth-child(3) { animation-delay: .3s; }
  @keyframes mm-dot-bounce {
    0%,80%,100% { transform: translateY(0); opacity:.4; }
    40%          { transform: translateY(-6px); opacity:1; }
  }

  /* biz rec card */
  .mm-biz-card {
    margin-top: 8px;
    background: rgba(255,248,225,.9);
    border: 1px solid rgba(200,144,10,.2);
    border-radius: 12px; padding: 12px 14px;
  }
  .mm-biz-title {
    font-size: .72rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .1em; color: #C8900A; margin-bottom: 8px;
  }
  .mm-biz-item { display: flex; gap: 8px; margin-bottom: 7px; font-size: .78rem; line-height: 1.45; }
  .mm-biz-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #C8900A; flex-shrink: 0; margin-top: 5px;
  }
  .mm-biz-link {
    display: inline-block; margin-top: 6px;
    font-size: .76rem; font-weight: 700; color: #CC1010;
    text-decoration: none;
  }
  .mm-biz-link:hover { text-decoration: underline; }

  /* ── Suggestions ── */
  .mm-suggests {
    padding: 8px 14px 6px;
    display: flex; gap: 6px; flex-wrap: wrap;
    background: rgba(255,252,252,.7);
    border-top: 1px solid rgba(204,16,16,.06);
  }
  .mm-sug-btn {
    padding: 5px 12px; border-radius: 999px;
    border: 1.5px solid rgba(204,16,16,.18);
    background: rgba(255,255,255,.85);
    color: #CC1010; font: 600 .72rem "Poppins",sans-serif;
    cursor: pointer; transition: .18s; white-space: nowrap;
  }
  .mm-sug-btn:hover { background: #CC1010; color: #fff; border-color: #CC1010; }

  /* ── Input row ── */
  .mm-input-row {
    padding: 10px 14px 14px;
    display: flex; gap: 8px; align-items: center;
    background: rgba(255,255,255,.95);
    border-top: 1px solid rgba(204,16,16,.08);
  }
  .mm-lang-row {
    display: flex; gap: 4px; margin-right: 4px;
  }
  .mm-lang-pill {
    padding: 3px 9px; border-radius: 999px;
    border: 1.5px solid rgba(204,16,16,.2);
    background: transparent; color: rgba(204,16,16,.6);
    font: 700 .67rem "Poppins",sans-serif;
    cursor: pointer; transition: .18s;
  }
  .mm-lang-pill.active { background: #CC1010; color: #fff; border-color: #CC1010; }
  .mm-input {
    flex: 1; background: rgba(255,245,245,.7);
    border: 1.5px solid rgba(204,16,16,.15); border-radius: 20px;
    padding: 9px 14px; font: 14px "Poppins",sans-serif;
    color: #1a0505; outline: none;
    transition: border-color .2s;
  }
  .mm-input:focus { border-color: rgba(204,16,16,.4); background: #fff; }
  .mm-send-btn {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#CC1010,#A80D0D);
    border: none; cursor: pointer; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px rgba(204,16,16,.3);
    transition: transform .2s, box-shadow .2s;
  }
  .mm-send-btn:hover { transform: scale(1.1); box-shadow: 0 5px 16px rgba(204,16,16,.4); }

  /* ── Character animations ── */
  .mm-char-body { animation: mm-breathe 3.5s ease-in-out infinite; }
  @keyframes mm-breathe {
    0%,100% { transform: scaleY(1); }
    50%      { transform: scaleY(1.015); }
  }
  .mm-eye { animation: mm-blink 4s ease-in-out infinite; }
  .mm-eye.right { animation-delay: .08s; }
  @keyframes mm-blink {
    0%,88%,100% { transform: scaleY(1); }
    93%         { transform: scaleY(0.06); }
  }
  .mm-arm-wave { animation: mm-wave 2.2s ease-in-out; }
  @keyframes mm-wave {
    0%   { rotate: 0deg; }
    15%  { rotate: -36deg; }
    30%  { rotate: 8deg; }
    45%  { rotate: -28deg; }
    60%  { rotate: 5deg; }
    75%  { rotate: -18deg; }
    90%  { rotate: 3deg; }
    100% { rotate: 0deg; }
  }
  .mm-arm-clap-r { animation: mm-clap-r 1.8s ease-in-out; }
  .mm-arm-clap-l { animation: mm-clap-l 1.8s ease-in-out; }
  @keyframes mm-clap-r { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-18px)} 50%{transform:translateX(-24px)} }
  @keyframes mm-clap-l { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(18px)} 50%{transform:translateX(24px)} }
  .mm-arm-salute { animation: mm-salute 1.8s ease-in-out; }
  @keyframes mm-salute { 0%,100%{rotate:0} 30%,70%{rotate:-80deg} }
  .mm-body-dance { animation: mm-dance 3s ease-in-out; }
  @keyframes mm-dance {
    0%,100%{transform:rotate(0) translateY(0)}
    15%{transform:rotate(-5deg) translateY(-3px)}
    30%{transform:rotate(5deg) translateY(-5px)}
    45%{transform:rotate(-4deg) translateY(-3px)}
    60%{transform:rotate(4deg) translateY(-5px)}
    75%{transform:rotate(-3deg) translateY(-2px)}
    90%{transform:rotate(2deg) translateY(-3px)}
  }
  .mm-body-happy { animation: mm-happy-bounce .5s ease-in-out 3; }
  @keyframes mm-happy-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .mm-mouth-talk { animation: mm-talk .25s linear infinite alternate; }
  @keyframes mm-talk { from{d:path("M68,118 Q80,128 92,118")} to{d:path("M70,116 Q80,122 90,116")} }
  .mm-mouth-talk-aya { animation: mm-talk-aya .25s linear infinite alternate; }
  @keyframes mm-talk-aya { from{d:path("M68,116 Q80,126 92,116")} to{d:path("M70,114 Q80,120 90,114")} }

  /* mobile */
  @media (max-width: 480px) {
    #mm-chat-widget { bottom: 16px; right: 16px; }
    #mm-chat-panel { width: calc(100vw - 32px); right: 0; bottom: 70px; }
  }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════════
     2. SVG CHARACTERS
  ══════════════════════════════════════════════ */
  function buildHira(size) {
    var s = size || 90;
    return '<svg viewBox="0 0 160 300" xmlns="http://www.w3.org/2000/svg" width="' + s + '">'
      + '<g class="mm-char-body" id="mmhiraBody">'
      + '<ellipse cx="56" cy="290" rx="18" ry="7" fill="#2C1F14"/>'
      + '<ellipse cx="104" cy="290" rx="18" ry="7" fill="#2C1F14"/>'
      + '<rect x="44" y="220" width="24" height="72" rx="10" fill="#4A3728"/>'
      + '<rect x="92" y="220" width="24" height="72" rx="10" fill="#4A3728"/>'
      + '<rect x="38" y="140" width="84" height="88" rx="18" fill="#F5EFE0"/>'
      + '<path d="M74 140 L80 160 L86 140" fill="none" stroke="#D4C5A0" stroke-width="1.5"/>'
      + '<circle cx="80" cy="168" r="2.5" fill="#C4B490"/>'
      + '<circle cx="80" cy="180" r="2.5" fill="#C4B490"/>'
      + '<circle cx="80" cy="192" r="2.5" fill="#C4B490"/>'
      + '<g id="mmhiraArmL" style="transform-origin:48px 148px"><rect x="28" y="148" width="22" height="60" rx="11" fill="#F5EFE0"/><ellipse cx="39" cy="214" rx="11" ry="10" fill="#F5CBA7"/></g>'
      + '<g id="mmhiraArmR" style="transform-origin:112px 148px"><rect x="110" y="148" width="22" height="60" rx="11" fill="#F5EFE0"/><ellipse cx="121" cy="214" rx="11" ry="10" fill="#F5CBA7"/></g>'
      + '<rect x="70" y="124" width="20" height="22" rx="8" fill="#F5CBA7"/>'
      + '<ellipse cx="80" cy="100" rx="42" ry="44" fill="#F5CBA7"/>'
      + '<ellipse cx="38" cy="102" rx="7" ry="9" fill="#F0BE96"/>'
      + '<ellipse cx="122" cy="102" rx="7" ry="9" fill="#F0BE96"/>'
      + '<path d="M38 82 Q42 50 80 48 Q118 50 122 82 Q110 60 80 60 Q50 60 38 82 Z" fill="#2D1F14"/>'
      + '<path d="M58 84 Q66 80 74 84" stroke="#2D1F14" stroke-width="3" stroke-linecap="round" fill="none"/>'
      + '<path d="M86 84 Q94 80 102 84" stroke="#2D1F14" stroke-width="3" stroke-linecap="round" fill="none"/>'
      + '<g class="mm-eye" style="transform-origin:66px 96px"><ellipse cx="66" cy="96" rx="9" ry="10" fill="white"/><ellipse cx="66" cy="98" rx="5" ry="6" fill="#2D1F14"/><ellipse cx="64" cy="96" rx="2" ry="2.5" fill="white" opacity=".7"/></g>'
      + '<g class="mm-eye right" style="transform-origin:94px 96px"><ellipse cx="94" cy="96" rx="9" ry="10" fill="white"/><ellipse cx="94" cy="98" rx="5" ry="6" fill="#2D1F14"/><ellipse cx="92" cy="96" rx="2" ry="2.5" fill="white" opacity=".7"/></g>'
      + '<ellipse cx="52" cy="110" rx="9" ry="6" fill="#F8A4A4" opacity=".4"/>'
      + '<ellipse cx="108" cy="110" rx="9" ry="6" fill="#F8A4A4" opacity=".4"/>'
      + '<ellipse cx="80" cy="108" rx="4" ry="3" fill="#E8AA80" opacity=".6"/>'
      + '<path id="mmhiraMouth" d="M68,118 Q80,128 92,118" fill="none" stroke="#C06040" stroke-width="2.5" stroke-linecap="round"/>'
      + '</g></svg>';
  }

  function buildAya(size) {
    var s = size || 90;
    return '<svg viewBox="0 0 160 300" xmlns="http://www.w3.org/2000/svg" width="' + s + '">'
      + '<g class="mm-char-body" id="mmayaBody">'
      + '<ellipse cx="60" cy="291" rx="16" ry="6" fill="#1A1A1A"/>'
      + '<ellipse cx="100" cy="291" rx="16" ry="6" fill="#1A1A1A"/>'
      + '<path d="M34 210 Q40 295 60 295 Q80 300 100 295 Q120 295 126 210 Z" fill="#EDE0C8"/>'
      + '<rect x="36" y="138" width="88" height="78" rx="18" fill="#F2E8D4"/>'
      + '<path d="M58 138 Q80 154 102 138 Q80 148 58 138 Z" fill="#FAF5EE" stroke="#DDD0B4" stroke-width="1"/>'
      + '<rect x="36" y="200" width="88" height="12" rx="4" fill="#DDD0B4"/>'
      + '<path d="M62 148 Q80 164 98 148" fill="none" stroke="#C8900A" stroke-width="2"/>'
      + '<circle cx="80" cy="162" r="4" fill="#C8900A"/>'
      + '<g id="mmayaArmL" style="transform-origin:46px 148px"><rect x="26" y="148" width="22" height="56" rx="11" fill="#F2E8D4"/><ellipse cx="37" cy="208" rx="10" ry="9" fill="#F5CBA7"/></g>'
      + '<g id="mmayaArmR" style="transform-origin:114px 148px"><rect x="112" y="148" width="22" height="56" rx="11" fill="#F2E8D4"/><ellipse cx="123" cy="208" rx="10" ry="9" fill="#F5CBA7"/></g>'
      + '<rect x="70" y="124" width="20" height="20" rx="8" fill="#F5CBA7"/>'
      + '<ellipse cx="80" cy="98" rx="40" ry="43" fill="#F5CBA7"/>'
      + '<ellipse cx="40" cy="100" rx="6" ry="8" fill="#F0BE96"/>'
      + '<ellipse cx="120" cy="100" rx="6" ry="8" fill="#F0BE96"/>'
      + '<circle cx="40" cy="110" r="3" fill="#C8900A"/>'
      + '<circle cx="120" cy="110" r="3" fill="#C8900A"/>'
      + '<path d="M40 80 Q44 48 80 46 Q116 48 120 80 Q108 58 80 58 Q52 58 40 80 Z" fill="#2D1F14"/>'
      + '<ellipse cx="80" cy="46" rx="20" ry="14" fill="#3D2B1F"/>'
      + '<ellipse cx="80" cy="46" rx="15" ry="10" fill="#2D1F14"/>'
      + '<line x1="68" y1="38" x2="92" y2="38" stroke="#C8900A" stroke-width="2" stroke-linecap="round"/>'
      + '<circle cx="92" cy="38" r="3" fill="#C8900A"/>'
      + '<path d="M58 82 Q66 78 74 82" stroke="#2D1F14" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
      + '<path d="M86 82 Q94 78 102 82" stroke="#2D1F14" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
      + '<g class="mm-eye" style="transform-origin:65px 94px"><ellipse cx="65" cy="94" rx="9" ry="10" fill="white"/><ellipse cx="65" cy="96" rx="5" ry="6" fill="#2D1F14"/><ellipse cx="63" cy="93" rx="2" ry="2.5" fill="white" opacity=".7"/><path d="M56 88 Q65 82 74 88" fill="none" stroke="#1A1010" stroke-width="1.5" stroke-linecap="round"/></g>'
      + '<g class="mm-eye right" style="transform-origin:95px 94px"><ellipse cx="95" cy="94" rx="9" ry="10" fill="white"/><ellipse cx="95" cy="96" rx="5" ry="6" fill="#2D1F14"/><ellipse cx="93" cy="93" rx="2" ry="2.5" fill="white" opacity=".7"/><path d="M86 88 Q95 82 104 88" fill="none" stroke="#1A1010" stroke-width="1.5" stroke-linecap="round"/></g>'
      + '<ellipse cx="50" cy="108" rx="9" ry="6" fill="#F8A4A4" opacity=".45"/>'
      + '<ellipse cx="110" cy="108" rx="9" ry="6" fill="#F8A4A4" opacity=".45"/>'
      + '<ellipse cx="80" cy="106" rx="3.5" ry="3" fill="#E8AA80" opacity=".55"/>'
      + '<path id="mmayaMouth" d="M68,116 Q80,126 92,116" fill="none" stroke="#C06070" stroke-width="2.5" stroke-linecap="round"/>'
      + '</g></svg>';
  }

  /* ══════════════════════════════════════════════
     3. STATE
  ══════════════════════════════════════════════ */
  var currentChar = 'hira';
  var currentLang = 'tl';
  var isTalking   = false;
  var talkTimer   = null;
  var isOpen      = false;

  /* ══════════════════════════════════════════════
     4. BUILD DOM
  ══════════════════════════════════════════════ */
  var widget = document.createElement('div');
  widget.id = 'mm-chat-widget';
  widget.innerHTML = `
    <div id="mm-chat-panel">
      <!-- Header -->
      <div class="mm-panel-head">
        <div class="mm-panel-char-mini" id="mmPanelCharMini"></div>
        <div class="mm-panel-info">
          <div class="mm-panel-name" id="mmPanelName">Hira</div>
          <div class="mm-panel-status">Your OFW financial buddy</div>
        </div>
        <div class="mm-panel-switcher">
          <button class="mm-sw-btn active" onclick="mmSwitchChar('hira')">Hira</button>
          <button class="mm-sw-btn" onclick="mmSwitchChar('aya')">Aya</button>
        </div>
        <button class="mm-close-btn" onclick="mmToggleChat()" aria-label="Close chat">✕</button>
      </div>

      <!-- Character stage -->
      <div class="mm-stage-wrap" id="mmStage"></div>

      <!-- Speech bubble -->
      <div class="mm-bubble-wrap">
        <div class="mm-bubble" id="mmBubble">Hi! Ako si Hira — kasama mo sa bawat araw na malayo sa pamilya!</div>
      </div>

      <!-- Messages -->
      <div class="mm-messages" id="mmMessages"></div>

      <!-- Suggestions -->
      <div class="mm-suggests" id="mmSuggests"></div>

      <!-- Input -->
      <div class="mm-input-row">
        <div class="mm-lang-row">
          <button class="mm-lang-pill active" onclick="mmSetLang('tl')">TL</button>
          <button class="mm-lang-pill" onclick="mmSetLang('en')">EN</button>
        </div>
        <input class="mm-input" id="mmChatInput" placeholder="I-type ang mensahe mo..." />
        <button class="mm-send-btn" onclick="mmSend()" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>

    <!-- FAB -->
    <button id="mm-chat-fab" onclick="mmToggleChat()" aria-label="Chat with Hira and Aya">
      <svg class="fab-char" viewBox="0 0 160 300" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="56" cy="287" rx="16" ry="6" fill="rgba(255,255,255,.3)"/>
        <ellipse cx="104" cy="287" rx="16" ry="6" fill="rgba(255,255,255,.3)"/>
        <rect x="44" y="222" width="22" height="65" rx="10" fill="rgba(255,255,255,.35)"/>
        <rect x="94" y="222" width="22" height="65" rx="10" fill="rgba(255,255,255,.35)"/>
        <rect x="40" y="142" width="80" height="84" rx="17" fill="rgba(255,255,255,.9)"/>
        <rect x="28" y="150" width="20" height="56" rx="10" fill="rgba(255,255,255,.9)"/>
        <rect x="112" y="150" width="20" height="56" rx="10" fill="rgba(255,255,255,.9)"/>
        <rect x="70" y="126" width="20" height="20" rx="8" fill="#F5CBA7"/>
        <ellipse cx="80" cy="100" rx="40" ry="42" fill="#F5CBA7"/>
        <path d="M40 82 Q44 52 80 50 Q116 52 120 82 Q108 62 80 62 Q52 62 40 82 Z" fill="#2D1F14"/>
        <ellipse cx="67" cy="97" rx="7" ry="8" fill="white"/>
        <ellipse cx="67" cy="99" rx="4" ry="5" fill="#2D1F14"/>
        <ellipse cx="93" cy="97" rx="7" ry="8" fill="white"/>
        <ellipse cx="93" cy="99" rx="4" ry="5" fill="#2D1F14"/>
        <ellipse cx="53" cy="109" rx="8" ry="5" fill="#F8A4A4" opacity=".5"/>
        <ellipse cx="107" cy="109" rx="8" ry="5" fill="#F8A4A4" opacity=".5"/>
        <path d="M68,118 Q80,127 92,118" fill="none" stroke="#C06040" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <span id="mm-chat-notif"></span>
    </button>

    <div id="mm-chat-tooltip">Kausapin si Hira o Aya!</div>
  `;
  document.body.appendChild(widget);

  /* ══════════════════════════════════════════════
     5. RENDER CHARACTER
  ══════════════════════════════════════════════ */
  function renderChar() {
    var stage = document.getElementById('mmStage');
    var mini  = document.getElementById('mmPanelCharMini');
    if (!stage) return;
    var svg = currentChar === 'hira' ? buildHira(84) : buildAya(84);
    stage.innerHTML = svg;
    if (mini) mini.innerHTML = currentChar === 'hira' ? buildHira(52) : buildAya(52);
  }

  /* ══════════════════════════════════════════════
     6. ANIMATIONS
  ══════════════════════════════════════════════ */
  function triggerAnim(type) {
    var prefix = currentChar === 'hira' ? 'mmhira' : 'mmaya';
    var body = document.getElementById(prefix + 'Body');
    var armR = document.getElementById(prefix + 'ArmR');
    var armL = document.getElementById(prefix + 'ArmL');
    if (!body) return;

    var els = [body, armR, armL].filter(Boolean);
    els.forEach(function(el){
      el.classList.remove('mm-arm-wave','mm-arm-clap-r','mm-arm-clap-l','mm-arm-salute','mm-body-dance','mm-body-happy');
      void el.offsetWidth;
    });

    if (type === 'wave' && armR) {
      armR.classList.add('mm-arm-wave');
      setTimeout(function(){ armR.classList.remove('mm-arm-wave'); }, 2200);
    } else if (type === 'clap') {
      if (armR) armR.classList.add('mm-arm-clap-r');
      if (armL) armL.classList.add('mm-arm-clap-l');
      setTimeout(function(){
        if (armR) armR.classList.remove('mm-arm-clap-r');
        if (armL) armL.classList.remove('mm-arm-clap-l');
      }, 1800);
    } else if (type === 'salute' && armR) {
      armR.classList.add('mm-arm-salute');
      setTimeout(function(){ armR.classList.remove('mm-arm-salute'); }, 1800);
    } else if (type === 'dance') {
      body.classList.add('mm-body-dance');
      setTimeout(function(){ body.classList.remove('mm-body-dance'); }, 3000);
    } else if (type === 'happy') {
      body.classList.add('mm-body-happy');
      setTimeout(function(){ body.classList.remove('mm-body-happy'); }, 1600);
    }
  }

  function startTalking(duration) {
    var mouthId = currentChar === 'hira' ? 'mmhiraMouth' : 'mmayaMouth';
    var mouth = document.getElementById(mouthId);
    if (!mouth) return;
    isTalking = true;
    mouth.classList.add(currentChar === 'hira' ? 'mm-mouth-talk' : 'mm-mouth-talk-aya');
    clearTimeout(talkTimer);
    talkTimer = setTimeout(function(){
      isTalking = false;
      mouth.classList.remove('mm-mouth-talk','mm-mouth-talk-aya');
    }, duration || 2000);
  }

  function setBubble(text) {
    var bubble = document.getElementById('mmBubble');
    if (bubble) bubble.textContent = text;
    startTalking(Math.min(text.length * 50, 3800));
    triggerAnim('wave');
  }

  /* ══════════════════════════════════════════════
     7. CHATBOT BRAIN
  ══════════════════════════════════════════════ */
  var BIZ_TL = '<div class="mm-biz-card"><div class="mm-biz-title">Mga Oportunidad Para Sa Iyo</div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>JC Premiere</strong> — Health products na pwede mong ibenta kahit nasa abroad ka.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>IMG International</strong> — Financial literacy at kita sa insurance at investments.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Vista Land</strong> — Maging property agent para sa kapwa OFW.</div></div>'
    + '<a href="business.html" class="mm-biz-link">Alamin ang Higit Pa →</a></div>';

  var BIZ_EN = '<div class="mm-biz-card"><div class="mm-biz-title">Business Opportunities For You</div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>JC Premiere</strong> — Sell health products while working abroad.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>IMG International</strong> — Learn financial literacy and earn through insurance and investments.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Vista Land</strong> — Become a property agent for fellow OFWs.</div></div>'
    + '<a href="business.html" class="mm-biz-link">Learn More →</a></div>';

  var RESPONSES = {
    tl: {
      greet:         ["Hoy! Kamusta ka ngayon? Sana okay ka lang diyan!","Kumusta na? Nandito lang ako, anytime na gusto mong mag-kwento!","Ay, magandang araw! Kumain ka na ba? Huwag kalimutang mag-ingat sa sarili mo!"],
      lonely:        ["Naiintindihan ko ang nararamdaman mo. Mahirap talaga ang maging malayo sa mahal mo sa buhay. Pero tandaan — ang pagtitiis mo ngayon ay para sa mas magandang bukas ng inyong pamilya.","Huwag mawalan ng pag-asa! Maraming OFW ang dumaan sa ganoong pakiramdam. Anong pinaka-miss mo sa kanila?","Normal lang ang ma-miss ang mga mahal mo. Nandito lang ako para sa iyo. Anong gusto mong pag-usapan?"],
      miss_family:   ["Nakaka-miss talaga ang pamilya, lalo na pag malayo ka. Regular ba kayong nag-video call?","Ang pagmamahal sa pamilya ang pinakamagandang motivasyon ng isang OFW. Ipagpatuloy mo ang lahat para sa kanila!"],
      money_save:    ["Mahalagang magtabi ng pera! I-save ang 20% ng bawat sweldo mo bago ka gumasta ng kahit ano.","Ang pinakamagandang regalo para sa pamilya mo ay hindi lang pera ngayon — kundi financial security para sa bukas. Kumpleto ka na ba sa emergency fund?"],
      money_earn:    ["Gusto mo bang kumita pa bukod sa trabaho mo? May mga paraan — at hindi kailangang malaki ang puhunan!","Maraming OFW ang nagsisimula ng side income habang nasa abroad pa. Gusto mo bang malaman ang mga oportunidad?"],
      money_earn_biz:["Napag-isipan mo na ba ang pagkakaroon ng sariling negosyo habang nasa abroad ka? May mga oportunidad na akma para sa OFW tulad mo!"],
      health:        ["Mahalagang alagaan ang kalusugan mo, lalo na pag malayo ka sa pamilya. Kumakain ka ba nang tama at natutulog ng sapat?"],
      homesick:      ["Homesick? Normal lang iyan. Subukan mong mag-video call sa pamilya mo ngayon!","Kapag may sama ng loob, kumain muna ng masustansya, matulog nang maaga. Bukas ay bagong simula!"],
      invest:        ["Maganda ang iyong naiisip! Para sa mga OFW, ang mga maaasahang investment ay: VUL insurance, stocks (PSEi), UITF, at real estate.","Ang pamumuhunan ay isa sa mga pinakamatalinong bagay na pwede mong gawin para sa kinabukasan ng iyong pamilya."],
      insurance:     ["Napakahalaga ng insurance, lalo na para sa mga OFW! Iniisip mo na ba ang life insurance at health coverage para sa pamilya mo sa Pilipinas?","Ang insurance ay hindi gastos — ito ay investment sa proteksyon ng iyong pamilya."],
      realestate:    ["Ang real estate ay isa sa pinaka-solid na investment! Maraming OFW ang nagtatayo ng bahay habang nasa abroad.","Gusto mong magkaroon ng sariling bahay sa Pilipinas? Pwede kang magsimula kahit nasa abroad ka!"],
      work:          ["Kamusta ang trabaho mo? Sana maayos lang at wala kang masyadong stress sa araw-araw.","Kahirap man ang trabaho sa abroad, tandaan na ito ay may layunin — para sa mas maliwanag na kinabukasan ng iyong pamilya!"],
      food:          ["Ano ba ang mga kinakain mo diyan? Miss ko na rin ang pagkain natin sa Pinas — adobo, sinigang, kare-kare!","Naalala mo na ba ang paborito mong pagkain ng Nanay mo?"],
      happy:         ["Ayos! Natutuwa ako para sa iyo!","Buti naman! Ang positibong mindset ay malaking tulong sa tagumpay. Ipagpatuloy mo iyan!"],
      gratitude:     ["Walang anuman! Para ito sa mga katulad mo — ang tapang at dedikasyon ng isang OFW ay kahanga-hanga.","Ikaw ang nagpapasaya sa araw ko! Anytime na kailangan mo ng kausap, nandito lang ako!"],
      default:       ["Interesting! Kwentuhan mo pa ako nang higit pa.","Naiintindihan kita. Anong gusto mong pag-usapan ngayon?","Nandito lang ako lagi para sa iyo. Ano pa ang gusto mong malaman?","Hm, magandang punto iyan. Paano mo nararamdaman ang mga bagay ngayon?"]
    },
    en: {
      greet:         ["Hey! How are you doing today? Hope you're holding up well!","Hi there! I'm always here whenever you need to talk. What's on your mind?"],
      lonely:        ["I understand how you feel. Being far from the ones you love is really hard. But remember — your sacrifices are building a better tomorrow for your family.","It's okay to feel lonely. That's why I'm here — to keep you company. What would you like to talk about?"],
      miss_family:   ["Missing family is something every OFW feels deeply. Do you video call them regularly?","Your love for your family is what drives you forward. Keep going — it will all be worth it!"],
      money_save:    ["Here's a simple rule: save 20% of every salary before spending anything else.","Building an emergency fund first is the smartest move — at least 3–6 months of living expenses."],
      money_earn:    ["Want to earn more on top of your job? There are real opportunities — and you don't need big capital!","Many OFWs are building side income streams while still working abroad. Want to know what options are right for you?"],
      money_earn_biz:["Have you considered a business you can run while still abroad? There are great opportunities suited for OFWs like you!"],
      health:        ["Your health is your greatest asset, especially when you're far from home. Are you eating well and sleeping enough?"],
      homesick:      ["Feeling homesick? Try calling your family right now — it makes a world of difference!"],
      invest:        ["Great thinking! For OFWs, reliable investments include VUL insurance, Philippine stocks, UITFs, and real estate."],
      insurance:     ["Insurance is a must for OFWs! Have you thought about life insurance and health coverage for your family back home?"],
      realestate:    ["Real estate is one of the most solid investments. Many OFWs build their dream home while still abroad!"],
      work:          ["How's work going? I hope you're not too stressed. Remember to take breaks!"],
      food:          ["What have you been eating lately? I bet you miss home cooking!"],
      happy:         ["That's amazing! I love hearing that! Keep that positive energy!"],
      gratitude:     ["Anytime! That's what I'm here for — to be your companion on this journey."],
      default:       ["Interesting! Tell me more about that.","I hear you. What else is on your mind?","I'm always here for you. What else would you like to know?"]
    }
  };

  var KEYWORDS = [
    { words:['kamusta','kumusta','hello','hi','hey','magandang','maayos','okay ka'], key:'greet' },
    { words:['malungkot','lungkot','nag-iisa','nahihirapan','hirap','naiiyak','iyak','nalulungkot','sad','lonely','alone','naalala'], key:'lonely' },
    { words:['miss ko','miss na','nami-miss','mahal ko','pamilya','nanay','tatay','mama','papa','anak','asawa','lola','lolo'], key:'miss_family' },
    { words:['ipon','magtipid','budget','gastos','impok','sav','tipid'], key:'money_save' },
    { words:['kumita','kita pa','income','extra income','sideline','dagdag na pera','gusto kumita','earn more'], key:'money_earn' },
    { words:['negosyo','business','oportunidad','passive income'], key:'money_earn_biz' },
    { words:['health','kalusugan','supplement','vitamins','sakit','wellness'], key:'health' },
    { words:['homesick','miss ang pinas','miss pilipinas','gusto nang umuwi'], key:'homesick' },
    { words:['invest','puhunan','stock','uitf','mutual fund'], key:'invest' },
    { words:['insurance','proteksyon','life insurance','vul','coverage'], key:'insurance' },
    { words:['bahay','real estate','lupa','property','condo','house and lot'], key:'realestate' },
    { words:['trabaho','work','boss','employer','stress sa work','overtime','shift'], key:'work' },
    { words:['pagkain','kain','lutuin','adobo','sinigang','kare-kare','food','gutom'], key:'food' },
    { words:['masaya','saya','maligaya','excited','happy','good news'], key:'happy' },
    { words:['salamat','maraming salamat','thank you','thanks','nagpapasalamat'], key:'gratitude' },
  ];

  var BIZ_KEYS = ['money_earn','money_earn_biz','invest','insurance','realestate'];

  var SUGGESTIONS = {
    tl: {
      lonely:      ['Paano ka nagre-relax?','Kwento pa!','Miss ko pamilya ko'],
      miss_family: ['Kalian kayo mag-video call?','Kwento mo ang pamilya mo'],
      money_save:  ['Paano mag-budget?','Paano magsimula ng ipon?'],
      money_earn:  ['Ano ang mga oportunidad?','Paano magsimula ng negosyo?'],
      invest:      ['Ano ang VUL?','Paano mag-stock market?'],
      insurance:   ['Magkano ang insurance?','Paano mag-apply?'],
      realestate:  ['Paano maging agent?','Magkano ang properties?'],
      default:     ['Kamusta ka?','Miss ko pamilya ko','Paano mag-ipon?','Gusto kong kumita pa','Malungkot ako ngayon']
    },
    en: {
      money_earn:  ['What opportunities exist?','Do I need big capital?'],
      invest:      ['What is VUL?','How to invest in stocks?'],
      default:     ['How are you?','I miss my family','How to save more?','I want extra income','I feel lonely today']
    }
  };

  function detectIntent(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < KEYWORDS.length; i++) {
      var k = KEYWORDS[i];
      for (var j = 0; j < k.words.length; j++) {
        if (lower.indexOf(k.words[j]) !== -1) return k.key;
      }
    }
    return 'default';
  }

  function getRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function getResponse(key, lang) {
    var bank = RESPONSES[lang] || RESPONSES.tl;
    return getRand(bank[key] || bank.default);
  }

  /* ══════════════════════════════════════════════
     8. MESSAGE HELPERS
  ══════════════════════════════════════════════ */
  function addMsg(role, text, extraHtml) {
    var msgs = document.getElementById('mmMessages');
    if (!msgs) return;
    var name = currentChar === 'hira' ? 'Hira' : 'Aya';
    var now  = new Date();
    var t    = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    var div  = document.createElement('div');
    div.className = 'mm-msg ' + role;
    if (role === 'bot') {
      div.innerHTML = '<div class="mm-msg-av">' + name[0] + '</div>'
        + '<div class="mm-msg-body">'
          + '<div class="mm-msg-bub">' + text + (extraHtml || '') + '</div>'
          + '<div class="mm-msg-time">' + name + ' · ' + t + '</div>'
        + '</div>';
    } else {
      div.innerHTML = '<div class="mm-msg-body">'
          + '<div class="mm-msg-bub">' + text + '</div>'
          + '<div class="mm-msg-time">' + t + '</div>'
        + '</div>'
        + '<div class="mm-msg-av" style="background:linear-gradient(135deg,#C8900A,#a07208)">U</div>';
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function botReply(userText) {
    var msgs = document.getElementById('mmMessages');
    if (!msgs) return;
    var lang    = currentLang;
    var intent  = detectIntent(userText);
    var name    = currentChar === 'hira' ? 'Hira' : 'Aya';
    var showBiz = BIZ_KEYS.indexOf(intent) !== -1;

    /* typing indicator */
    var tid = document.createElement('div');
    tid.className = 'mm-typing';
    tid.innerHTML = '<div class="mm-msg-av">' + name[0] + '</div>'
      + '<div class="mm-typing-dots"><div class="mm-typing-dot"></div><div class="mm-typing-dot"></div><div class="mm-typing-dot"></div></div>';
    msgs.appendChild(tid);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(function(){
      tid.remove();
      var text = getResponse(intent, lang);
      addMsg('bot', text, showBiz ? (lang === 'tl' ? BIZ_TL : BIZ_EN) : null);
      setBubble(text.length > 80 ? text.substring(0,78) + '…' : text);

      if (intent === 'happy' || intent === 'gratitude') triggerAnim('clap');
      else if (intent === 'greet') triggerAnim('wave');
      else if (showBiz) triggerAnim('happy');

      updateSuggests(intent, lang);
    }, 850 + Math.random() * 550);
  }

  function updateSuggests(intent, lang) {
    var wrap = document.getElementById('mmSuggests');
    if (!wrap) return;
    var bank = SUGGESTIONS[lang] || SUGGESTIONS.tl;
    var arr  = bank[intent] || bank.default;
    wrap.innerHTML = arr.map(function(s){
      return '<button class="mm-sug-btn" onclick="mmSuggest(this)">' + s + '</button>';
    }).join('');
  }

  /* ══════════════════════════════════════════════
     9. PUBLIC API (window-level so onclick works)
  ══════════════════════════════════════════════ */
  window.mmToggleChat = function() {
    isOpen = !isOpen;
    var panel = document.getElementById('mm-chat-panel');
    var fab   = document.getElementById('mm-chat-fab');
    var notif = document.getElementById('mm-chat-notif');
    if (panel) panel.classList.toggle('open', isOpen);
    if (fab)   fab.classList.toggle('open', isOpen);
    if (notif) notif.classList.remove('show');
    if (isOpen && !document.getElementById('mmMessages').childElementCount) {
      renderChar();
      setTimeout(function(){
        addMsg('bot', currentChar === 'hira'
          ? 'Hoy! Kumusta ka? Ako si Hira — kasama mo sa bawat araw na malayo sa pamilya. Pwede kang kumausap sa akin anumang oras!'
          : 'Kumusta! Ako si Aya — nandito ako para sa iyo, lagi!'
        );
        updateSuggests('default', currentLang);
        triggerAnim('wave');
      }, 300);
    }
  };

  window.mmSwitchChar = function(name) {
    currentChar = name;
    document.getElementById('mmPanelName').textContent = name === 'hira' ? 'Hira' : 'Aya';
    document.querySelectorAll('.mm-sw-btn').forEach(function(b){
      b.classList.toggle('active', b.textContent.toLowerCase() === name);
    });
    renderChar();
    setBubble(name === 'hira'
      ? 'Hi! Ako si Hira — kasama mo sa bawat araw na malayo sa pamilya!'
      : 'Kumusta! Ako si Aya — nandito ako para sa iyo, lagi!'
    );
  };

  window.mmSetLang = function(lang) {
    currentLang = lang;
    document.querySelectorAll('.mm-lang-pill').forEach(function(b){
      b.classList.toggle('active', b.textContent.toLowerCase() === lang);
    });
    var inp = document.getElementById('mmChatInput');
    if (inp) inp.placeholder = lang === 'tl' ? 'I-type ang mensahe mo...' : 'Type your message...';
    updateSuggests('default', lang);
  };

  window.mmSend = function() {
    var inp  = document.getElementById('mmChatInput');
    var text = inp ? inp.value.trim() : '';
    if (!text) return;
    inp.value = '';
    addMsg('user', text);
    botReply(text);
  };

  window.mmSuggest = function(btn) {
    var text = btn.textContent;
    addMsg('user', text);
    botReply(text);
  };

  /* Enter key */
  document.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'mmChatInput') {
      window.mmSend();
    }
  });

  /* ── Show notification dot after 6s if not opened ── */
  setTimeout(function(){
    if (!isOpen) {
      var notif = document.getElementById('mm-chat-notif');
      if (notif) notif.classList.add('show');
    }
  }, 6000);

})();
