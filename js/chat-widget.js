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

  /* ── Fab button — transparent, shows character ── */
  #mm-chat-fab {
    width: 72px; height: 88px;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    border: none; cursor: pointer;
    display: flex; align-items: flex-end; justify-content: center;
    transition: transform .22s cubic-bezier(.34,1.56,.64,1);
    position: relative;
    overflow: visible;
    padding: 0;
  }
  #mm-chat-fab:hover { transform: translateY(-6px); }
  #mm-chat-fab.open { transform: translateY(-4px) scale(1.05); }

  /* Character SVG in FAB */
  #mm-fab-char-wrap {
    position: relative; display: flex; align-items: flex-end; justify-content: center;
  }
  #mm-fab-char-wrap svg { width: 68px; height: 88px; display: block; filter: drop-shadow(0 6px 16px rgba(0,0,0,.28)); }
  /* Red chat badge bottom-right */
  #mm-fab-badge {
    position: absolute; bottom: 2px; right: -4px;
    width: 24px; height: 24px; border-radius: 50%;
    background: linear-gradient(135deg,#CC1010,#A80D0D);
    border: 2.5px solid #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(204,16,16,.45);
    font-size: .65rem; color: #fff;
  }
  /* shadow under feet */
  #mm-fab-shadow {
    width: 44px; height: 8px; border-radius: 50%;
    background: rgba(0,0,0,.18);
    filter: blur(4px);
    margin: 0 auto; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  }

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

    <!-- FAB — shows actual Hira/Aya character -->
    <button id="mm-chat-fab" onclick="mmToggleChat()" aria-label="Chat with Hira and Aya">
      <div id="mm-fab-char-wrap">
        <div id="mm-fab-shadow"></div>
        <div id="mm-fab-char-inner"></div>
        <div id="mm-fab-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
      </div>
      <span id="mm-chat-notif"></span>
    </button>

    <div id="mm-chat-tooltip">Kausapin si Hira o Aya!</div>
  `;
  document.body.appendChild(widget);

  /* ══════════════════════════════════════════════
     5. RENDER CHARACTER
  ══════════════════════════════════════════════ */
  function renderChar() {
    var mini = document.getElementById('mmPanelCharMini');
    if (mini) mini.innerHTML = currentChar === 'hira' ? buildHira(52) : buildAya(52);
    /* also update FAB character */
    var fabInner = document.getElementById('mm-fab-char-inner');
    if (fabInner) fabInner.innerHTML = currentChar === 'hira' ? buildHira(68) : buildAya(68);
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
    /* character stage removed — only animate mini avatar in header */
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

  /* ══════════════════════════════════════════════════════════
     BRAIN — Responses, Keywords, Intent Detection
     Each intent has 5–8 varied responses to avoid repetition.
     detectIntent uses a SCORING system (sum all keyword hits)
     so complex sentences find the most relevant topic.
  ══════════════════════════════════════════════════════════ */

  var RESPONSES = {
    tl: {
      greet: [
        "Hoy! Kamusta ka ngayon? Sana okay ka lang diyan — nandito lang ako lagi para sa iyo! 😊",
        "Kumusta na? Magandang araw! Kumain ka na ba? Huwag kalimutang alagaan ang sarili mo, ha!",
        "Ay, natutuwa akong marinig mo! Kamusta ang buhay diyan sa abroad? May bagong balita ba?",
        "Hello! Ano na ang nangyayari sa buhay mo? Kwentuhan mo ako — tainga ako nang tainga! 👂",
        "Buti naman nagpakita ka! Matagal ka na bang OFW? Sana komportable ka na diyan.",
        "Kumusta ang lahat? Alam mo, kahit malayo ka, palagi kang nasa isip ng mga mahal mo sa buhay — at nandito rin ako para sayo!",
      ],
      lonely: [
        "Naiintindihan ko ang nararamdaman mo. Mahirap talaga ang maging malayo sa mahal mo sa buhay. Pero tandaan — ang pagtitiis mo ngayon ay para sa mas magandang bukas ng pamilya mo. 💙",
        "Huwag mawalan ng pag-asa! Maraming OFW ang dumaan sa eksaktong ganoong pakiramdam. Ikaw ay hindi nag-iisa — may komunidad tayo dito. Anong pinaka-miss mo sa kanila?",
        "Normal lang ang ma-miss ang mga mahal mo. Magtawag ka ngayon — kahit limang minuto lang. Ang mga boses nila ay nagbibigay ng lakas para bukas.",
        "Ang loneliness ay parte ng OFW life, pero hindi ito permanente. Palagi mong tandaan: ang bawat araw na magtatapos ay isa pang araw na mas malapit ka na sa iyong pamilya.",
        "Alam ko, malungkot minsan. Pero ikaw ay isa sa mga pinaka-matapang tao — pumunta ka sa ibang bansa para sa pamilya mo. Iyon ay malaking pagmamahal. 🤍",
        "Pag malungkot ka, subukan mo itong gawin: isulat sa papel ang tatlong bagay na magandang nangyari ngayong araw. Kahit maliit lang — tumutulong ito sa mindset. Anong tatlong bagay ang iyong isusulat?",
      ],
      miss_family: [
        "Nakaka-miss talaga ang pamilya, lalo na pag malayo ka. Regular ba kayong nag-video call? Kahit schedule lang ng isang oras sa linggo — malaking bagay iyon sa mga bata.",
        "Ang pagmamahal sa pamilya ang pinakamagandang motivasyon ng isang OFW. Isipin mo — bawat pisong niipon mo ay kokonkreto ang kanilang kinabukasan. Ipagpatuloy mo!",
        "Kamiss mo ba sila ngayon? Bilisan mo na ang trabaho — para mabilis na ring lumipas ang kontrata mo! Paano mo sila inaalagaan mula dito?",
        "Minsan ang pinaka-mahal na regalo sa pamilya ay hindi pera — kundi iyong oras at pansin. Mag-video call ka ngayon at sabihin mo sa kanila kung gaano mo sila kamahal. 💛",
        "Anong pinaka-miss mo? Ang pagkain ni Nanay? Ang tawa ng mga bata? Iyan ang iyong dahilan — hawakan mo iyon tuwing mahirap ang araw.",
      ],
      money_save: [
        "Ito ang pinakamagandang financial rule para sa OFW: i-save ang 20% ng sweldo mo BAGO ka gumasta ng kahit ano. Bayaran mo muna ang sarili mo bago ang lahat ng iba.",
        "Ang emergency fund muna bago ang investment! Magtabi ng 3–6 buwan ng buwanang gastos sa isang hiwalay na account. Ito ang iyong kaligtasan pag may nangyaring hindi inaasahan.",
        "Gusto mo bang malaman ang simpleng budget system? 50-30-20: 50% sa pangunahing gastos at remittance, 30% sa savings at investments, 20% sa sarili mo at personal goals.",
        "Ang malaking kahulugan ng 'magtipid' ay hindi 'huwag gumasto' — kundi 'gumasta nang may layunin'. Nagsusulat ka ba ng budget bawat buwan?",
        "Alam mo ba ang pinaka-common na mistake ng OFW? 'Mataas na sweldo pero walang natitira.' Nangyayari ito kapag walang plan. Gusto mo bang gumawa ng budget plan ngayon?",
        "Simpleng trick: buksan ng dalawang account. Isa para sa remittance, isa para sa savings. Huwag hayaang mahalong pera — iyon ang simula ng financial chaos.",
      ],
      remittance: [
        "Ang pinakamatalinong paraan ng pagpapadala ng pera ay ang paggamit ng app na may mababang bayad at magandang exchange rate. TapTap Send, Wise, at GCash padala ay mga magandang opsyon.",
        "Alam mo ba na ang 1% na pagkakaiba sa exchange rate ay nagiging libu-libong piso sa isang taon? Palaging ihambing ang mga rate bago mag-padala.",
        "Para sa UAE to Philippines: TapTap Send ay isa sa pinaka-competitive pagdating sa rates at bilis. Libreng download at madaling gamitin.",
        "Mag-ipadala ka nang mas matalino: huwag padala ng maliliit na halaga nang madalas — dagdag ang fee bawat transaction. Mas mabuting magsave muna at magpadala ng mas malaki isang beses.",
        "Ang iyong pamilya ba ay may GCash? Kung oo, puwede kang mag-padala ng mas mabilis at may mas mababang bayad kaysa sa traditional na remittance.",
      ],
      money_earn: [
        "Gusto mo bang kumita pa bukod sa trabaho mo? Maraming OFW ang may side income — health products, insurance, real estate, freelancing. Hindi kailangang malaki ang puhunan para magsimula!",
        "Ang side income ay hindi luxury — ito ay necessity para sa OFW. Ang trabaho sa abroad ay kontrata lang, pero ang sariling negosyo ay maaaring tumagal. Anong nag-iinteresa sa iyo?",
        "Alam mo ba ang pinaka-popular na side income ng mga OFW? 1) Health product selling (JC Premiere) 2) Insurance agency (IMG) 3) Property referrals (Vista Land) 4) Online selling. Alin ang akma sa iyo?",
        "Ang magandang side income para sa OFW ay yung kaya mong i-manage kahit malayo ka — online selling, referral-based income, o negosyong pinapatakbo ng pamilya mo sa Pinas.",
        "Narito ang isang katotohanan: ang mga OFW na may dalawang income stream ay mas mabilis na nakakatayo sa sariling paa. Gusto mo bang talakayin ang mga opsyon?",
        "Simpleng tanong: kung mawalan ka ng trabaho bukas, may ibang kikitain ka ba? Ang side income ay iyong safety net. Magsimula tayo — kahit maliit lang.",
      ],
      money_earn_biz: [
        "Ang JC Premiere ay isa sa pinakamagandang negosyo para sa OFW — ibenta ang premium health products online, walang physical store na kailangan! Kahit nasa abroad ka, kaya mo itong gawin sa iyong phone.",
        "Napag-isipan mo na bang maging financial advisor sa IMG International? OFW-friendly ang setup — part-time, flexible, at malaking potential na kumita habang tumutulong ka sa ibang tao.",
        "Ang HOF Siomai King franchise ay isang magandang negosyo na maaaring pinamamahalaan ng iyong pamilya sa Pilipinas habang ikaw ay nagtatrabaho sa abroad. Mababang puhunan, proven na brand.",
        "Vista Land ay nagbibigay ng komisyon sa mga accredited property agents. Puwede kang maging agent kahit OFW ka — at kumita mula sa mga referral ng ibang OFW!",
        "Ang pinaka-successful na OFW ay yung may business na nag-aabang sa kanila pagbalik nila sa Pilipinas. Simulan nating talakayin ang mga opsyon na akma sa iyong sitwasyon.",
      ],
      health: [
        "Mahalagang alagaan ang kalusugan mo lalo na pag malayo ka sa pamilya! Kumakain ka ba nang tama — hindi lang instant noodles at convenience store food? 😄",
        "Ang iyong kalusugan ay iyong pinakamahalagang asset bilang OFW. Walang insurance ang kayang palitan ang magandang kalusugan. Nag-eehersisyo ka ba kahit gaano kaliit?",
        "Alam mo ba na ang stress ng OFW life ay nakakaapekto sa immune system? Regular na tulog, hydration, at kahit 20 minutos na lakad araw-araw — malaking pagbabago ito.",
        "Ang JC Premiere ay may mga premium health supplements na espesyal para sa mga OFW na kailangan ng immune support, energy, at stress relief. Gusto mo bang malaman pa?",
        "Alagaan mo ang katawan mo — ang pamilya mo ay nangangailangan sa iyo na malusog at malakas. Kumain ka ng gulay, uminom ng tubig, at mag-pahinga nang maayos!",
      ],
      homesick: [
        "Homesick? Normal iyan — ibig sabihin lang ay malalim ang iyong pagmamahal sa pamilya mo. Tawagan mo sila ngayon — kahit 'Kumusta kayo?' lang sa message ay malaking bagay.",
        "Kapag may sama ng loob, subukan mo itong trick: i-recall ang isang magandang alaala sa pamilya. Iyon ang iyong 'why' — ang dahilan kung bakit ka narito sa abroad.",
        "Ang homesickness ay nagpapakita ng pagmamahal. Pero huwag mo itong hayaang maging sagabal sa iyong mga goals. Gamitin mo ito bilang fuel para mas magsumikap.",
        "Minsan ang pinaka-epektibong lunas sa homesickness ay ang pagtuon sa iyong mga goals — kung ano ang gusto mong maiuwi sa pamilya: bahay, negosyo, kalayaan.",
        "Ikwento mo sa akin — ano ang pinaka-miss mo? Ang pagkain, ang ingay ng mga bata, ang yakap ng asawa? Magandang usapan ito. 💙",
      ],
      invest: [
        "Maganda ang naiisip mo! Para sa mga OFW, ang pinakamagandang investments ay: (1) Emergency fund muna, (2) VUL Insurance para sa proteksyon + investment, (3) Philippine stocks o UITF, (4) Real estate. Ito ang tamang pagkakasunod.",
        "Ang pamumuhunan ay isa sa pinakamatalinong bagay para sa kinabukasan ng pamilya mo. Pero tandaan: huwag mag-invest ng pera na hindi mo maaaring mawala. Kumpleto ka na ba sa emergency fund?",
        "Para sa baguhan: simulan mo sa UITF o mutual fund sa pamamagitan ng iyong GCash (GInvest). Kahit ₱50 lang ang simula — ang mahalaga ay ang ugali ng pag-invest bawat buwan.",
        "Ang Philippine Stock Exchange (PSEi) ay nagbibigay ng average na 8-10% annual return sa mahabang panahon. Pero kailangan ng 5-10 taon na horizon — ito ay para sa pangmatagalang ipon.",
        "Ang VUL insurance sa IMG ay interesting para sa OFW dahil pinagsama ang life insurance (proteksyon) at investment (paglago ng pera). Gusto mo bang malaman kung tama ito para sa iyo?",
        "Ang real estate ay ang investment na pinaka-naiintindihan ng mga Pilipino — tangible, may appreciation, at puwedeng pinagkakakitaan. Pero kailangan ng malaking puhunan. May kasalukuyan ka bang ipon para dito?",
      ],
      insurance: [
        "Ang insurance ay hindi gastos — ito ay investment sa proteksyon ng iyong pamilya. Tanong ko: kung sakaling may mangyari sa iyo bukas, may pera ba ang iyong pamilya para sa susunod na 1-2 taon?",
        "Para sa mga OFW, ang life insurance ay hindi optional — ito ay responsibilidad. Ikaw ang iisa o pangunahing source of income ng iyong pamilya. Kung mawala ka, anong mangyayari sa kanila?",
        "Ang IMG International ay espesyalista sa insurance at investments para sa mga OFW. Ang kanilang VUL products ay nagbibigay ng life coverage habang lumalago ang iyong investment. Worth checking out!",
        "May tatlong insurance na kailangan ng bawat OFW: (1) Life insurance, (2) Health insurance, (3) Accidental death & disability. Kumpleto ka na ba sa tatlo?",
        "Ang SSS, PhilHealth, at Pag-IBIG — aktibo pa ba ang mga ito? Maraming OFW ang humihinto ng contribution pagkaalis sa Pilipinas, at namamalaman nila mamaya na nawala na ang mga benepisyo nila.",
        "Mahalaga rin ang insurance para sa pamilya mo sa Pilipinas — hindi lang para sa iyo. Isang emergency sa bahay ang kayang guibahin ang lahat ng iyong ipon kung walang coverage.",
      ],
      realestate: [
        "Ang real estate ay isa sa pinaka-solid na investment para sa OFW! Ang lupa at bahay sa Pilipinas ay patuloy na tumataas ang halaga — at puwede itong pinagkakakitaan bilang rental property.",
        "Gusto mong magkaroon ng sariling bahay sa Pilipinas? Puwede kang magsimula kahit nasa abroad ka! Vista Land ay may mga OFW-friendly payment terms at maaaring ayusin ang lahat nang naka-SPA ang isang kamag-anak mo.",
        "Ang pinaka-popular na pamamaraan ng OFW sa real estate: (1) Bilhin ang property sa pre-selling price (mas mura), (2) Pagkatapos, i-rent out o ibenta sa mas mataas na presyo pagkumpleto.",
        "Pag-isipan mo ito: ang isang bahay na nagkakahalaga ng ₱3M ngayon ay maaaring maging ₱5M o ₱6M sa loob ng 10 taon. Iyon ay ₱2-3M na kita nang walang ginagawa bukod sa pag-aari nito.",
        "Vista Land ang aming partner sa real estate. Maaari kang maging accredited agent at kumita ng komisyon sa bawat property na ma-refer mo — kahit OFW ka at nasa abroad!",
        "Bago bumili ng property: (1) Siguruhin na developer ay registered sa HLURB, (2) Alamin ang track record ng delivery, (3) Kalkulahin ang total cost kasama ang taxes at association dues.",
      ],
      work: [
        "Kamusta ang trabaho mo? Sana maayos lang at wala kang masyadong stress. Tandaan — kahit mahirap ang araw, mayroon kang layunin: ang pamilya mo at ang iyong kinabukasan.",
        "Ang trabaho sa abroad ay temporary — ang financial foundation na iyong itatatayo mula dito ay permanente. Gamitin mo ang bawat sahod nang may estratehiya.",
        "Mahirap ba ang kasalukuyang trabaho mo? Minsan ang pagbabago ng trabaho o employer ay mas magandang desisyon kaysa magtiis sa masamang kalagayan. Alamin mo ang iyong mga karapatan.",
        "Para sa mga OFW: ang iyong kontrata ay iyong proteksyon. Basahin mo ito nang maigi — alam mo ba ang lahat ng iyong benepisyo at karapatan sa ilalim ng iyong kontrata?",
        "Kahirap man ang trabaho, alalahanin mo ito: ikaw ay nagtatrabaho para sa isang mas malaking layunin. Ang bawat araw na magtatapos ay isa pang hakbang patungo sa iyong pangarap.",
      ],
      food: [
        "Ano ba ang mga kinakain mo diyan? Miss ko na rin ang pagkain natin sa Pinas — adobo, sinigang, kare-kare, tinola! Napakasarap! 😋",
        "Naalala mo ba ang paboritong pagkain ng Nanay mo? Iyon ang tumatamis sa puso ng bawat OFW — ang amoy ng lutuin sa bahay.",
        "Kumakain ka nang tama? Importante iyon — ang masamang pagkain ay nagpapababa ng energy at immune system. Subukan mong magluto pag may free time!",
        "May Filipino community ka ba diyan? Madalas may Filipino restaurant o potluck na nagbibigay ng panlasa ng tahanan. Maghanap ka — mabuti iyon para sa mental health mo.",
        "Ito ang magandang balita: ang pagluluto ng sariling pagkain ay makakatipid ka ng malaking pera sa abroad. Mas mura at mas masustansya pa! Nagluluto ka ba?",
      ],
      happy: [
        "Ayos! Natutuwa akong marinig iyan! 🎉 Ang positibong enerhiya mo ay nakaka-inspire! Ipagpatuloy mo iyang saya!",
        "Buti naman! Ang isang masayang OFW ay isang produktibong OFW. Anong magandang balita ang gusto mong ibahagi?",
        "Ganda! Iyan ang attitude ng isang taong papunta sa tagumpay! Ano ang nagpasaya sa iyo ngayon?",
        "Natutuwa akong makita kang masaya! Laging tandaan ang feeling na ito sa mga araw na mahirap. 😊",
      ],
      gratitude: [
        "Walang anuman! Para ito sa mga katulad mo — ang tapang at dedikasyon ng isang OFW ay kahanga-hanga. Huwag mong kalimutang ikaw ay bayani!",
        "Ikaw ang nagpapasaya sa araw ko! Anytime na kailangan mo ng kausap o tulong, nandito lang kami ni Aya (o Hira) para sa iyo.",
        "Ang pasasalamat ay magandang ugali — nagpapakita ito ng magandang puso. Sana palagi kang masaya at maligtas diyan!",
        "Bale wala! Para ito sa bawat OFW na nag-iisa sa abroad — gusto naming maging kasama niyo sa bawat hakbang ng inyong financial journey.",
      ],
      retirement: [
        "Mahalaga ang mag-isip ng retirement kahit bata ka pa! Ang OFW ay may limitadong taon ng pagtatrabaho sa abroad — kaya dapat may solid na retirement plan bago umuwi.",
        "Para sa OFW retirement: kailangan mo ng passive income na kayang suportahan ang iyong buwanang gastos sa Pilipinas. Rental income, dividends, o pension — alin ang iyong plano?",
        "Ang simpleng retirement calculation: kung ang monthly expenses mo sa Pilipinas ay ₱30,000, kailangan mo ng ₱7.2 million sa savings (gamit ang 4% withdrawal rule). May target number ka na ba?",
        "Ang SSS pension ay maliit lang para sa karaniwang OFW — kaya mahalaga ang sariling retirement fund. VUL insurance, stocks, at real estate ay mga magandang vehicle para dito.",
      ],
      debt: [
        "Ang utang na may mataas na interest (credit card, personal loan, 5-6) ay kailangang bayaran agad bago ka mag-invest. Ang 30% interest ay mas mabilis na kumakain ng pera kaysa tumubo ang investment.",
        "Kung marami kang utang: gamitin ang Debt Snowball — bayaran muna ang pinakamaliit na utang para makakuha ng momentum, tapos isa-isa ang mga mas malalaki.",
        "Ito ang katotohanan: hindi mo maaaring itayo ang financial security habang may butas ang balde. Una muna ang pagbabayad ng utang — tapos na mag-invest.",
        "Para sa OFW na may utang: huwag manghiram ng bago para bayaran ang luma. Makipag-usap sa creditor para sa restructuring. At i-commit ang isang fixed na halaga bawat buwan para sa debt payoff.",
      ],
      budget: [
        "Ito ang pinaka-epektibong budget system para sa OFW — ang 50-30-20 rule: 50% sa pamilya at buhay, 30% sa ipon at investments, 20% sa sarili at goals. Subukan mo ito sa susunod na sahod!",
        "Ang unang hakbang sa budgeting: alamin mo kung magkano ang iyong total na gastos bawat buwan. Ilabas mo ang lahat — remittance, rent, pagkain, load, insurance. Mabibigla ka sa totals.",
        "Gusto mo bang gamitin ang aming Disposable Income Calculator sa Check-up page? Tutulong ito sa iyong makita kung magkano ang natitira o kulang bawat buwan.",
        "Ang budget ay hindi para sa poor — ito para sa matalinong tao. Kahit mayaman ka na, kailangan pa rin ng budget para malaman kung saan napupunta ang pera.",
      ],
      contract: [
        "Ang employment contract ay iyong pinakamahalagang dokumento bilang OFW! Basahin mo ito nang buong-buo bago pumirma — partikular ang sahod, overtime, leave, at repatriation clause.",
        "May concern ka ba sa iyong kontrata? Maaari kang makipag-ugnayan sa OWWA o sa embassy para sa legal na tulong. Huwag matakot na humingi ng tulong — may karapatan ka.",
        "Payo: i-photo ang bawat pahina ng kontrata mo at i-email sa sarili mo bilang backup. Kung may mangyaring legal na isyu, ito ang iyong proteksyon.",
      ],
      owwa: [
        "Ang OWWA (Overseas Workers Welfare Administration) ay may maraming benepisyo para sa mga OFW — life insurance, accident insurance, hospital benefit, at reintegration programs. Nakapag-avail ka na ba?",
        "Para sa OWWA membership: kailangan mong i-renew ito tuwing mag-renew ng kontrata. ₱25 lang ang membership fee — malaking benepisyo para sa maliit na halaga.",
        "Ang OWWA ay may Death and Disability benefit na umaabot sa ₱100,000 para sa mga saklaw na miyembro. Siguraduhing updated ang iyong membership.",
      ],
      gcash: [
        "Ang GCash ay isa sa pinaka-useful na apps para sa OFW! Puwede kang magpadala ng pera directly sa GCash ng pamilya mo — mas mabilis at minsan mas mura kaysa remittance apps.",
        "GInvest sa GCash ay nagbibigay ng access sa mutual funds kahit sa ₱50 lang! Magandang simula para sa hindi pa nakakaenroll sa stocks.",
        "May GCash ang pamilya mo? Kung wala pa, payagan mo silang mag-create ng account — para mas madali at mura ang iyong padala sa susunod.",
      ],
      stress: [
        "Stress? Naiintindihan kita. Ang OFW life ay isa sa mga pinaka-challenging na situasyon — ikaw ay nag-iisa sa ibang bansa, malayo sa pamilya, at may dalahin. Anong pinaka-nag-aabala sa iyo ngayon?",
        "Para sa stress management: huwag panatiliin ang lahat sa loob. Makipag-usap sa isang kaibigan, kapwa OFW, o kahit sa amin dito. Narito lang kami.",
        "Ang pisikal na ehersisyo ay isa sa pinaka-epektibong lunas sa stress — kahit 20 minutos na lakad araw-araw. Subukan mo bukas ng umaga.",
        "Maging maawain sa sarili mo. Ikaw ay ginagawa ang iyong pinakamahusay sa mahirap na sitwasyon. Iyon ay sapat. Hindi kailangan na perpekto ang lahat.",
      ],
      prayer: [
        "Maganda iyan — ang pananampalataya ay nagbibigay ng lakas sa maraming OFW sa mahirap na mga araw. Ikaw ay hindi nag-iisa sa iyong paglalakbay. 🙏",
        "Ang pag-aalala at panalangin ay magkasama — mag-alala sa Diyos at kumilos para sa kinabukasan. Palagi kang nasa puso ng mga nagmamahal sa iyo.",
        "Oo, magtiwala ka at magsumikap. Ang Diyos ay gumagawa — at ikaw rin ay kailangan mong gumawa ng tamang desisyon para sa kinabukasan ng pamilya mo.",
      ],
      default: [
        "Interesting! Kwentuhan mo pa ako nang higit pa — gusto kong malaman ang iyong kwento.",
        "Naiintindihan kita. Anong gusto mong pag-usapan ngayon? Financial goals, pamilya, o buhay sa abroad?",
        "Nandito lang ako lagi para sa iyo. Maaari kang magtanong tungkol sa finances, investments, negosyo, o kahit anong nag-aalala sa iyo.",
        "Hm, magandang punto iyan. Paano mo nararamdaman ang mga bagay ngayon? Gusto ko talagang malaman.",
        "Para sa akin, bawat kwento ng OFW ay isang kwento ng tapang. Ano pa ang nais mong talakayin — financial o personal?",
        "Nais mo bang subukan ang aming Financial Check-up? Tutulungan ka nitong malaman kung saan ka ngayon financially — at kung saan ka dapat pumunta.",
      ]
    },
    en: {
      greet: [
        "Hey! How are you doing today? Hope you're holding up well out there! 😊",
        "Hi! Great to see you! How's life abroad treating you? Anything you'd like to talk about?",
        "Hello! I'm Hira — your OFW financial companion. Whether it's money talk, homesickness, or just needing someone to chat with, I'm here!",
        "Hi there! How long have you been working abroad? I'd love to hear your story.",
      ],
      lonely: [
        "I understand how you feel. Being far from the ones you love is genuinely hard. But remember — every day you endure is one step closer to the future you're building for your family. 💙",
        "It's okay to feel lonely — it's proof of how much you love your family. You're not alone in this. Many OFWs feel exactly this way. What do you miss most?",
        "When loneliness hits, try this: write three good things that happened today, no matter how small. It shifts your focus and reminds you that life has beautiful moments even away from home.",
        "You are braver than you realize. Leaving home to build a better life for your family is one of the most loving things a person can do. 🤍",
      ],
      miss_family: [
        "Missing your family is natural — and it means you love them deeply. Do you video call them regularly? A scheduled weekly call can make a huge difference.",
        "Your love for your family is your greatest motivator. Every peso you save, every sacrifice you make — it's all for them. Keep going!",
        "What do you miss most? The food? The sound of your kids laughing? Hold onto that — it's your 'why' on the tough days.",
      ],
      money_save: [
        "Here's the golden OFW rule: pay yourself first — save 20% of every salary before spending anything else. Automate it so you can't be tempted.",
        "Build your emergency fund before anything else. Aim for 3–6 months of living expenses in a separate account. That's your financial safety net.",
        "Try the 50-30-20 budget: 50% to family and living, 30% to savings and investments, 20% to personal goals. Have you tried this?",
        "The biggest OFW financial mistake: high income but nothing to show for it. The cure is a simple, consistent budget. Want help building one?",
      ],
      remittance: [
        "Send money smarter: compare rates before every transfer. A 1% difference in exchange rate can mean thousands of pesos difference over a year.",
        "TapTap Send is great for UAE to Philippines transfers — competitive rates, low fees, and fast. It's what I personally recommend for OFWs in the Gulf.",
        "Does your family have GCash? Direct GCash transfers are often faster and cheaper than bank-to-bank remittances. Worth setting up if they haven't yet.",
        "Pro tip: batch your transfers. Instead of sending small amounts frequently, save up and send a larger amount once or twice a month to minimize transaction fees.",
      ],
      money_earn: [
        "Want to earn more on top of your salary? Many OFWs are building side income streams without leaving their full-time job. What are you interested in?",
        "The truth: your job contract abroad will end someday. A side income is your insurance that the money keeps flowing after. Let's talk about your options.",
        "Here are the most popular OFW side incomes: 1) Health products (JC Premiere) 2) Insurance agency (IMG) 3) Property referrals (Vista Land) 4) Online freelancing. Any of these speak to you?",
        "Small steps work: even ₱5,000/month from a side hustle means ₱60,000/year — enough for an emergency fund or school tuition. It doesn't have to be big to matter.",
      ],
      money_earn_biz: [
        "JC Premiere is a great OFW-friendly business — sell premium health products online from wherever you are. No physical store needed, just your phone and network.",
        "IMG International lets OFWs become financial advisors part-time. Flexible hours, good income potential, and you'd be helping fellow OFWs protect their families. Win-win.",
        "Vista Land property agents earn referral commissions — meaning you can earn from introducing other OFWs to their dream property, without needing your own capital.",
        "HOF Siomai King is a food franchise your family can run in the Philippines while you fund it from abroad. Proven brand, manageable investment.",
      ],
      health: [
        "Your health is your most important asset — especially when you're far from home. Are you eating well, staying hydrated, and getting enough sleep?",
        "OFW stress is real and affects your immune system. Even a 20-minute walk daily can significantly improve your mood and energy levels.",
        "JC Premiere has premium health supplements designed for people with demanding jobs and lifestyles. Want to know more about what might help you specifically?",
      ],
      homesick: [
        "Feeling homesick? Call your family right now — even a 5-minute voice note goes a long way.",
        "Homesickness is love with nowhere to go in that moment. Use it as fuel: remind yourself why you're there and what you're building for them.",
        "Try joining a Filipino community in your area — nothing cures homesickness faster than a shared meal and Tagalog conversation with fellow OFWs.",
      ],
      invest: [
        "Great thinking! For OFWs, the recommended investment order is: 1) Emergency fund first, 2) VUL insurance for protection + growth, 3) Philippine stocks or UITFs, 4) Real estate.",
        "You don't need a lot to start investing. GInvest on GCash lets you start with as little as ₱50 in mutual funds. The habit matters more than the amount.",
        "Philippine stocks have historically returned 8–10% annually over the long term. But it requires patience — think 5–10 year horizon, not quick profits.",
        "VUL insurance from IMG combines life coverage with an investment component. For OFWs who want protection AND growth in one product, it's worth exploring.",
      ],
      insurance: [
        "Insurance is non-negotiable for OFWs. You are often the sole breadwinner — if something happens to you, your family needs financial protection.",
        "Three insurance types every OFW needs: 1) Life insurance, 2) Health insurance, 3) Accident and disability coverage. Do you have all three?",
        "Keep your SSS, PhilHealth, and Pag-IBIG contributions active as a voluntary member — many OFWs stop paying and lose their benefits without realizing it.",
        "IMG International specializes in OFW insurance and financial planning. Their advisors can assess your specific situation and recommend the right coverage.",
      ],
      realestate: [
        "Real estate is one of the most tangible investments — land and property in the Philippines generally appreciate over time.",
        "You can buy property in the Philippines while abroad! Vista Land has OFW-friendly payment terms and a Special Power of Attorney setup so a trusted person can sign for you.",
        "Consider this: a ₱3M property today could be worth ₱5M in 10 years. That's ₱2M earned just by owning it — without doing anything else.",
        "You can also become a Vista Land agent and earn commissions from referring other OFWs to properties. No capital needed — just referrals.",
      ],
      work: [
        "How's work going? Remember: your overseas job is temporary. The financial foundation you're building right now is permanent.",
        "Know your rights as an OFW worker — your contract is your protection. Have you read it fully?",
        "If work is tough, remember why you're there. Every shift, every overtime hour — it's an investment in your family's future.",
      ],
      food: [
        "What have you been eating lately? I bet you miss home cooking — nothing beats Nanay's adobo! 😄",
        "Pro tip: cooking your own food abroad saves significant money and is usually healthier. Even simple meals add up to big savings over a month.",
      ],
      happy: [
        "That's amazing! 🎉 I love hearing good news! What happened?",
        "Keep that positive energy! A happy OFW is a productive OFW. Share your good news — I want to hear!",
      ],
      gratitude: [
        "Anytime! That's exactly what I'm here for — to be your companion on this journey.",
        "You're welcome! Remember, you're never alone on this OFW journey. Hira and Aya are always here for you.",
      ],
      retirement: [
        "It's never too early to plan retirement! As an OFW, you have a limited window of overseas employment — so building your retirement fund needs to start now.",
        "Simple retirement math: if your monthly expenses in the Philippines are ₱30,000, you need about ₱7.2M (using the 4% rule). Do you know your target number?",
        "SSS pension alone won't be enough to sustain a comfortable lifestyle. Stocks, real estate, and a small business are the pillars of a real OFW retirement plan.",
      ],
      debt: [
        "High-interest debt (credit cards, personal loans) must be paid off before investing. 30% interest eats faster than any investment grows.",
        "If you have multiple debts: pay the smallest one first for momentum (Debt Snowball), then roll that payment into the next. It works psychologically and mathematically.",
      ],
      budget: [
        "Try the 50-30-20 rule: 50% to essentials and remittance, 30% to savings and investments, 20% to personal spending. Simple, sustainable, effective.",
        "Want to see exactly where you stand financially? Try our Disposable Income Calculator on the Check-up page — it shows your surplus or deficit in real time.",
      ],
      stress: [
        "OFW life is genuinely hard — you're working far from home, often under pressure, missing your family. It's okay to acknowledge that. What's stressing you out most right now?",
        "For stress: even 20 minutes of exercise daily dramatically improves mood and resilience. Your mental health is as important as your financial health.",
        "Be kind to yourself. You're doing your best in a difficult situation. That is enough.",
      ],
      default: [
        "Interesting! Tell me more — I'd love to hear about your situation.",
        "I hear you. What else is on your mind? Financial goals, family, or just life abroad?",
        "I'm always here for you. Feel free to ask about finances, investments, business ideas, or just life as an OFW.",
        "Every OFW has a story of courage. What's yours? I'm listening.",
        "Want to try our Financial Check-up? It'll show you exactly where you stand financially — and what to do next.",
      ]
    }
  };

  /* ── Keyword map with WEIGHTS — higher weight = stronger signal ── */
  var KEYWORDS = [
    { words:['hello','hi','hey','kamusta','kumusta','magandang umaga','magandang gabi','magandang hapon','good morning','good evening','good afternoon','kumain','okay ka ba'], key:'greet', w:1 },
    { words:['malungkot','lungkot','nag-iisa','nahihirapan','naiiyak','nalulungkot','sad','lonely','alone','depressed','cry','crying','iyak','feel down','down ngayon'], key:'lonely', w:2 },
    { words:['miss ko','miss na','nami-miss','naalala ko','mahal ko sila','nanay','tatay','anak ko','asawa ko','lolo','lola','bunso','panganay','pamilya ko'], key:'miss_family', w:2 },
    { words:['ipon','magtipid','gastos','impok','tipid','save','saving','emergency fund','paano mag-save','paano mag-ipon','pera ko','paano pera','pera namin','pera natin','wala pera','wala akong pera'], key:'money_save', w:2 },
    { words:['pera'], key:'money_save', w:1 },
    { words:['padala','send money','remittance','taptap','gcash padala','wise','remitly','western union','magpadala','bayad','transfer pera','exchange rate','conversion rate'], key:'remittance', w:3 },
    { words:['kumita','sideline','extra income','side hustle','part-time','dagdag na kita','earn more','freelance','online job','work from home'], key:'money_earn', w:2 },
    { words:['negosyo','business','oportunidad','passive income','jc premiere','img','vista land','hof','siomai','franchise','agent','commission'], key:'money_earn_biz', w:3 },
    { words:['health','kalusugan','supplement','vitamins','sakit','wellness','immune','vitamin c','collagen','sick','may sakit'], key:'health', w:2 },
    { words:['homesick','miss ang pinas','miss pilipinas','gusto nang umuwi','balik na','uwi na','pauwi na'], key:'homesick', w:3 },
    { words:['invest','puhunan','stock market','uitf','mutual fund','psei','col financial','bonds','dividend','ginyest','pamumuhunan'], key:'invest', w:2 },
    { words:['insurance','life insurance','vul','coverage','proteksyon','philhealth','ssa','death benefit','health card','hmo'], key:'insurance', w:2 },
    { words:['bahay','real estate','lupa','property','condo','house and lot','vista land','pre-selling','rfo','pagibig loan','housing loan'], key:'realestate', w:2 },
    { words:['trabaho','work stress','boss ko','employer','overtime','shift','kontrata','contract','sweldo','sahod','ayaw ko sa work','resign'], key:'work', w:1 },
    { words:['kain','pagkain','gutom','adobo','sinigang','kare-kare','tinola','food','miss ang pagkain','luto','lutuin'], key:'food', w:1 },
    { words:['masaya','saya','excited','happy','good news','maligaya','natutuwa','nakakatuwa','ok lang','okay lang','mabuti naman','ayos naman','okay naman','okay na','ok na','ayos na','well','doing well','doing good','i\'m fine','im fine'], key:'happy', w:1 },
    { words:['salamat','maraming salamat','thank you','thanks','nagpapasalamat'], key:'gratitude', w:2 },
    { words:['retire','retirement','paano mag-retire','retirement fund','pension','sss pension','luma na','matanda na'], key:'retirement', w:3 },
    { words:['utang','debt','credit card','loan','bayad utang','personal loan','nag-ipon para bayad','5-6','sangla','pautang'], key:'debt', w:3 },
    { words:['budget','paano mag-budget','gastusin','plano sa pera','spending plan','cash flow','surplus','deficit'], key:'budget', w:2 },
    { words:['kontrata','contract','poea','owwa','legal','karapatan ko','rights','employer violation','abuse'], key:'contract', w:3 },
    { words:['owwa','sss abroad','philhealth abroad','pagibig abroad','ofw benefits','government benefits'], key:'owwa', w:3 },
    { words:['gcash','maya','paymaya','digital wallet','e-wallet','tonik','seabank','online banking','digital bank'], key:'gcash', w:3 },
    { words:['stress','anxiety','pagod','burnout','overwhelmed','pressure','hindi na kaya','mental health','walang tulog'], key:'stress', w:2 },
    { words:['panalangin','dasal','diyos','lord','god','simbahan','church','faith','pray','prayer','pananalig'], key:'prayer', w:2 },
  ];

  var BIZ_KEYS = ['money_earn','money_earn_biz','invest','insurance','realestate','remittance'];

  var SUGGESTIONS = {
    tl: {
      greet:       ['Paano mag-ipon?','Gusto kong kumita pa','Kwento ng OFW life'],
      lonely:      ['Paano ako maghintay nang mas madali?','Kwento pa!','Miss ko pamilya ko'],
      miss_family: ['Paano mag-video call nang regular?','Ano ang magagawa ko para sa kanila?'],
      money_save:  ['Ano ang 50-30-20 rule?','Paano magsimula ng emergency fund?','Pakita ang budget template'],
      remittance:  ['Paano gumagamit ng TapTap Send?','Alin ang mas mura?','Paano mag-ipadala sa GCash?'],
      money_earn:  ['Anong negosyo ang akma sa OFW?','Paano mag-sell ng health products?','Maging agent?'],
      money_earn_biz:['JC Premiere — paano?','IMG International — paano?','Vista Land agent'],
      invest:      ['Paano mag-stock market?','Ano ang VUL?','Saan mag-simula sa ₱1000?'],
      insurance:   ['Gaano karami ang coverage ko?','Ano ang VUL vs Term?','SSS at PhilHealth ko'],
      realestate:  ['Paano maging Vista Land agent?','Pag-IBIG housing loan','Pre-selling vs RFO'],
      retirement:  ['Magkano kailangan ko?','Paano mag-compute ng retirement fund?'],
      debt:        ['Debt snowball method','Paano mabayaran ang utang nang mabilis?'],
      budget:      ['Subukan ang calculator!','50-30-20 rule','Paano gumawa ng budget?'],
      stress:      ['Paano mag-relax?','Saan humingi ng tulong?','Mental health tips'],
      default:     ['Kamusta ka?','Miss ko pamilya ko','Paano mag-ipon?','Gusto kong kumita pa','Check-up ng finances ko']
    },
    en: {
      greet:       ['How to save more?','I want extra income','Life as an OFW'],
      money_save:  ['50-30-20 rule?','How to start emergency fund?'],
      remittance:  ['TapTap Send tips?','Best rates for UAE-PH?'],
      money_earn:  ['Best OFW side hustles?','Start with JC Premiere?','Become an agent?'],
      invest:      ['How to start in stocks?','What is VUL?','GInvest for beginners'],
      insurance:   ['How much coverage?','VUL vs Term Insurance?'],
      realestate:  ['Become a Vista Land agent?','Housing loan guide'],
      retirement:  ['How much do I need?','Retirement calculation'],
      default:     ['How are you?','I miss my family','How to save more?','I want extra income','Check my finances']
    }
  };

  /* ── Score-based intent detection ── */
  function detectIntent(text) {
    var lower = text.toLowerCase();
    var scores = {};
    for (var i = 0; i < KEYWORDS.length; i++) {
      var k = KEYWORDS[i];
      var score = 0;
      for (var j = 0; j < k.words.length; j++) {
        if (lower.indexOf(k.words[j]) !== -1) score += (k.w || 1);
      }
      if (score > 0) scores[k.key] = (scores[k.key] || 0) + score;
    }
    var best = null, bestScore = 0;
    for (var key in scores) {
      if (scores[key] > bestScore) { bestScore = scores[key]; best = key; }
    }
    return best || 'default';
  }

  function getRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* Anti-repetition: track last used response per intent+lang */
  var _lastUsed = {};
  function getResponse(key, lang) {
    var bank = RESPONSES[lang] || RESPONSES.tl;
    var arr  = bank[key] || bank.default;
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    var cacheKey = lang + '-' + key;
    var last = _lastUsed[cacheKey];
    var pool = last ? arr.filter(function(r){ return r !== last; }) : arr;
    if (!pool.length) pool = arr;
    var picked = pool[Math.floor(Math.random() * pool.length)];
    _lastUsed[cacheKey] = picked;
    return picked;
  }

  /* ── Puter.js AI integration ── */
  var _puterLoaded = false;
  var _puterFailed = false;

  var SYSTEM_PROMPT = 'You are {{CHAR}}, a warm and caring OFW financial companion on MillionaireMindset.ae. '
    + 'You help Overseas Filipino Workers (OFWs) with financial literacy, emotional support, and practical advice. '
    + 'Speak in Taglish (mix of Tagalog and English) matching the user\'s language. '
    + 'Keep responses short (2-4 sentences). Be empathetic, practical, and encouraging. '
    + 'WEBSITE TOOLS: Financial Check-up calculator (checkup.html), Blog series (blog.html), Business opportunities (business.html). '
    + 'PARTNERS: TapTap Send (best remittance app, referral BENJIE83), JC Premiere (health supplements), '
    + 'IMG International (insurance & investments), Vista Land (real estate), HOF Siomai King (food franchise). '
    + 'RULES: Never give illegal advice. Keep responses under 150 words. Use emojis sparingly. '
    + 'If asked about the website, refer to the specific pages. Always end with a helpful follow-up question or suggestion.';

  function loadPuterJs(cb) {
    if (_puterFailed) { cb(true); return; }
    if (typeof puter !== 'undefined' && puter.ai) { cb(); return; }
    if (_puterLoaded) { setTimeout(function(){ cb(typeof puter !== 'undefined' && puter.ai ? null : true); }, 200); return; }
    _puterLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    s.onload = function() { cb(); };
    s.onerror = function() { _puterFailed = true; cb(true); };
    document.head.appendChild(s);
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
    var lang   = currentLang;
    var intent = detectIntent(userText);
    var name   = currentChar === 'hira' ? 'Hira' : 'Aya';

    /* typing indicator */
    var tid = document.createElement('div');
    tid.className = 'mm-typing';
    tid.innerHTML = '<div class="mm-msg-av">' + name[0] + '</div>'
      + '<div class="mm-typing-dots"><div class="mm-typing-dot"></div><div class="mm-typing-dot"></div><div class="mm-typing-dot"></div></div>';
    msgs.appendChild(tid);
    msgs.scrollTop = msgs.scrollHeight;

    function doFallback() {
      tid.remove();
      var showBiz = BIZ_KEYS.indexOf(intent) !== -1;
      var text = getResponse(intent, lang);
      addMsg('bot', text, showBiz ? (lang === 'tl' ? BIZ_TL : BIZ_EN) : null);
      setBubble(text.length > 80 ? text.substring(0, 78) + '…' : text);
      if (intent === 'happy' || intent === 'gratitude') triggerAnim('clap');
      else if (intent === 'greet') triggerAnim('wave');
      else if (showBiz) triggerAnim('happy');
      updateSuggests(intent, lang);
    }

    loadPuterJs(function(err) {
      if (err || typeof puter === 'undefined' || !puter.ai) {
        setTimeout(doFallback, 850 + Math.random() * 550);
        return;
      }
      var sysPrompt = SYSTEM_PROMPT.replace('{{CHAR}}', name);
      puter.ai.chat(userText, { model: 'claude-3-5-sonnet', system: sysPrompt })
        .then(function(resp) {
          tid.remove();
          var text = typeof resp === 'string' ? resp
            : (resp && resp.message && resp.message.content && resp.message.content[0]
                ? resp.message.content[0].text
                : (resp && resp.text ? resp.text : String(resp)));
          var showBiz = BIZ_KEYS.indexOf(intent) !== -1;
          addMsg('bot', text, showBiz ? (lang === 'tl' ? BIZ_TL : BIZ_EN) : null);
          setBubble(text.length > 80 ? text.substring(0, 78) + '…' : text);
          if (intent === 'happy' || intent === 'gratitude') triggerAnim('clap');
          else if (intent === 'greet') triggerAnim('wave');
          else if (showBiz) triggerAnim('happy');
          updateSuggests(intent, lang);
        })
        .catch(function() {
          doFallback();
        });
    });
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
