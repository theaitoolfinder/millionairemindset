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

  /* ── Speech bubble (floats left of character) ── */
  #mm-chat-callout {
    position: absolute;
    bottom: 18px;
    right: 84px;
    max-width: 230px;
    min-width: 150px;
    background: #fff;
    border-radius: 18px 18px 18px 4px;
    box-shadow: 0 6px 28px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.08);
    padding: 12px 14px 10px;
    opacity: 0; pointer-events: none;
    transform: translateX(10px) scale(.93);
    transform-origin: bottom right;
    transition: opacity .3s cubic-bezier(.4,0,.2,1),
                transform .3s cubic-bezier(.34,1.4,.64,1);
  }
  #mm-chat-callout.show {
    opacity: 1; pointer-events: auto;
    transform: translateX(0) scale(1);
  }
  /* tail pointing right toward the character */
  #mm-chat-callout::after {
    content: ''; position: absolute;
    bottom: 14px; right: -8px;
    border-width: 8px 0 8px 9px;
    border-style: solid;
    border-color: transparent transparent transparent #fff;
    filter: drop-shadow(2px 0 2px rgba(0,0,0,.06));
  }
  #mm-callout-close {
    position: absolute; top: 6px; right: 8px;
    background: none; border: none; cursor: pointer;
    color: rgba(0,0,0,.3); font-size: 14px; line-height: 1;
    padding: 2px 5px; border-radius: 50%;
    transition: color .15s, background .15s;
  }
  #mm-callout-close:hover { color: rgba(0,0,0,.7); background: rgba(0,0,0,.06); }
  /* char name chip above bubble */
  #mm-callout-char-name {
    font-size: .68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .07em; color: #CC1010; margin-bottom: 5px;
    display: block;
  }
  .mm-callout-msgs { display: flex; flex-direction: column; gap: 4px; }
  .mm-callout-msg {
    font-size: .82rem; line-height: 1.5; color: #1a0505;
    opacity: 0; transform: translateY(5px);
    transition: opacity .35s, transform .35s;
  }
  .mm-callout-msg.visible { opacity: 1; transform: translateY(0); }
  /* pulse dot beside name */
  #mm-callout-pulse {
    display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: #22c55e;
    margin-right: 5px; vertical-align: middle;
    animation: mm-pulse 1.6s infinite;
  }

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
    padding: 6px 14px 4px;
    display: flex; gap: 6px; flex-wrap: nowrap;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    background: rgba(255,252,252,.7);
    border-top: 1px solid rgba(204,16,16,.06);
  }
  .mm-suggests::-webkit-scrollbar { display: none; }
  .mm-sug-btn {
    padding: 4px 11px; border-radius: 999px;
    border: 1.5px solid rgba(204,16,16,.18);
    background: rgba(255,255,255,.85);
    color: #CC1010; font: 600 .70rem "Poppins",sans-serif;
    cursor: pointer; transition: .18s; white-space: nowrap;
    flex-shrink: 0;
  }
  .mm-sug-btn:hover { background: #CC1010; color: #fff; border-color: #CC1010; }

  /* ── Powered by Groq ── */
  .mm-powered {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: .62rem;
    color: #bbb;
    padding: 4px 0 7px;
    background: rgba(255,255,255,.95);
    letter-spacing: .02em;
    white-space: nowrap;
  }

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
    0%,100% { transform: scaleY(1) translateY(0); }
    50%      { transform: scaleY(1.015) translateY(-1px); }
  }

  /* Blink */
  .mm-eye { animation: mm-blink 4s ease-in-out infinite; }
  .mm-eye.right { animation-delay: .08s; }
  @keyframes mm-blink {
    0%,88%,100% { transform: scaleY(1); }
    93%         { transform: scaleY(0.06); }
  }

  /* Happy squint eyes — crescent shape */
  .mm-eye.mm-eye-happy { animation: mm-eye-happy 2.5s ease-in-out !important; }
  @keyframes mm-eye-happy {
    0%,100% { transform: scaleY(1); }
    15%,85% { transform: scaleY(0.22) translateY(3px); }
  }

  /* Wow wide eyes */
  .mm-eye.mm-eye-wow { animation: mm-eye-wow 2s ease-in-out !important; }
  @keyframes mm-eye-wow {
    0%,100% { transform: scaleY(1); }
    20%,80% { transform: scaleY(1.5) translateY(-2px); }
  }

  /* Wave */
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

  /* Big enthusiastic wave */
  .mm-arm-bigwave { animation: mm-bigwave 2.6s ease-in-out; }
  @keyframes mm-bigwave {
    0%    { rotate: 0deg; }
    10%   { rotate: -55deg; }
    22%   { rotate: 12deg; }
    34%   { rotate: -52deg; }
    46%   { rotate: 10deg; }
    58%   { rotate: -48deg; }
    70%   { rotate: 8deg; }
    82%   { rotate: -30deg; }
    92%   { rotate: 4deg; }
    100%  { rotate: 0deg; }
  }

  /* Raise both arms up */
  .mm-arm-raise-r { animation: mm-raise-r 2.4s ease-in-out; }
  @keyframes mm-raise-r {
    0%,100% { rotate: 0deg; }
    20%,80% { rotate: -88deg; }
    50%     { rotate: -92deg; }
  }
  .mm-arm-raise-l { animation: mm-raise-l 2.4s ease-in-out; }
  @keyframes mm-raise-l {
    0%,100% { rotate: 0deg; }
    20%,80% { rotate: 88deg; }
    50%     { rotate: 92deg; }
  }

  /* Clap */
  .mm-arm-clap-r { animation: mm-clap-r 1.8s ease-in-out; }
  .mm-arm-clap-l { animation: mm-clap-l 1.8s ease-in-out; }
  @keyframes mm-clap-r { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-18px)} 50%{transform:translateX(-24px)} }
  @keyframes mm-clap-l { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(18px)} 50%{transform:translateX(24px)} }

  /* Salute */
  .mm-arm-salute { animation: mm-salute 1.8s ease-in-out; }
  @keyframes mm-salute { 0%,100%{rotate:0} 30%,70%{rotate:-80deg} }

  /* Dance */
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

  /* Happy bounce */
  .mm-body-happy { animation: mm-happy-bounce .5s ease-in-out 3; }
  @keyframes mm-happy-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  /* Wow bounce — body pulses with surprise */
  .mm-body-wow { animation: mm-wow-pulse .45s ease-in-out 3; }
  @keyframes mm-wow-pulse {
    0%,100% { transform: scale(1) translateY(0); }
    40%     { transform: scale(1.07) translateY(-4px); }
    70%     { transform: scale(0.97) translateY(1px); }
  }

  /* Walk side to side */
  .mm-body-walk { animation: mm-walk 3s ease-in-out 2; }
  @keyframes mm-walk {
    0%    { transform: translateX(0)   rotate(0deg)   translateY(0); }
    10%   { transform: translateX(-6px)  rotate(-4deg)  translateY(-3px); }
    20%   { transform: translateX(-14px) rotate(0deg)   translateY(0); }
    30%   { transform: translateX(-6px)  rotate(4deg)   translateY(-3px); }
    40%   { transform: translateX(0)   rotate(0deg)   translateY(0); }
    50%   { transform: translateX(6px)  rotate(-4deg)  translateY(-3px); }
    60%   { transform: translateX(14px) rotate(0deg)   translateY(0); }
    70%   { transform: translateX(6px)  rotate(4deg)   translateY(-3px); }
    80%   { transform: translateX(0)   rotate(0deg)   translateY(0); }
    90%   { transform: translateX(-4px)  rotate(-2deg)  translateY(-1px); }
    100%  { transform: translateX(0)   rotate(0deg)   translateY(0); }
  }
  /* Walking arms swing opposite the body lean */
  .mm-arm-walk-r { animation: mm-walk-arm-r 1.5s ease-in-out 4; }
  .mm-arm-walk-l { animation: mm-walk-arm-l 1.5s ease-in-out 4; }
  @keyframes mm-walk-arm-r { 0%,100%{rotate:0} 25%{rotate:22deg} 75%{rotate:-22deg} }
  @keyframes mm-walk-arm-l { 0%,100%{rotate:0} 25%{rotate:-22deg} 75%{rotate:22deg} }

  /* Talking mouth */
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
      <div class="mm-powered">
        Powered by <img src="img/groq-badge.svg" alt="Groq" height="18" style="display:inline-block;vertical-align:middle;">
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

    <div id="mm-chat-callout">
      <button id="mm-callout-close" onclick="mmCloseCallout()" aria-label="Close">✕</button>
      <span id="mm-callout-pulse"></span><span id="mm-callout-char-name">Hira</span>
      <div class="mm-callout-msgs" id="mm-callout-msgs"></div>
    </div>
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
  var ALL_ANIM_CLASSES = [
    'mm-arm-wave','mm-arm-bigwave',
    'mm-arm-clap-r','mm-arm-clap-l',
    'mm-arm-salute',
    'mm-arm-raise-r','mm-arm-raise-l',
    'mm-arm-walk-r','mm-arm-walk-l',
    'mm-body-dance','mm-body-happy','mm-body-wow','mm-body-walk',
    'mm-eye-wow','mm-eye-happy'
  ];

  function clearAllAnims(prefix) {
    var body = document.getElementById(prefix + 'Body');
    var armR = document.getElementById(prefix + 'ArmR');
    var armL = document.getElementById(prefix + 'ArmL');
    var eyes = document.querySelectorAll('#mm-fab-char-inner .mm-eye, #mmPanelCharMini .mm-eye');
    [body, armR, armL].filter(Boolean).forEach(function(el){
      ALL_ANIM_CLASSES.forEach(function(c){ el.classList.remove(c); });
      void el.offsetWidth;
    });
    eyes.forEach(function(e){
      e.classList.remove('mm-eye-wow','mm-eye-happy');
      void e.offsetWidth;
    });
  }

  function setFaceExpr(type, duration) {
    var eyes = document.querySelectorAll('#mm-fab-char-inner .mm-eye, #mmPanelCharMini .mm-eye');
    var mouthId = currentChar === 'hira' ? 'mmhiraMouth' : 'mmayaMouth';
    var mouths = document.querySelectorAll('#mm-fab-char-inner #'+mouthId+', #mmPanelCharMini #'+mouthId);
    eyes.forEach(function(e){
      e.classList.remove('mm-eye-wow','mm-eye-happy');
      void e.offsetWidth;
      if (type) e.classList.add('mm-eye-' + type);
    });
    // Mouth shape
    mouths.forEach(function(m){
      if (type === 'wow') {
        // Open "O" mouth
        m.setAttribute('d', currentChar === 'hira'
          ? 'M72,116 Q80,132 88,116 Q80,124 72,116 Z'
          : 'M72,114 Q80,130 88,114 Q80,122 72,114 Z');
        m.setAttribute('fill', type === 'wow' ? (currentChar==='hira'?'#C06040':'#C06070') : 'none');
      } else if (type === 'happy') {
        // Big wide grin
        m.setAttribute('d', currentChar === 'hira'
          ? 'M63,116 Q80,134 97,116'
          : 'M63,114 Q80,132 97,114');
        m.setAttribute('fill', 'none');
      }
    });
    if (duration) {
      setTimeout(function(){
        eyes.forEach(function(e){ e.classList.remove('mm-eye-wow','mm-eye-happy'); });
        // Restore mouth
        mouths.forEach(function(m){
          m.setAttribute('fill','none');
          m.setAttribute('d', currentChar === 'hira' ? 'M68,118 Q80,128 92,118' : 'M68,116 Q80,126 92,116');
        });
      }, duration);
    }
  }

  function triggerAnim(type) {
    var prefix = currentChar === 'hira' ? 'mmhira' : 'mmaya';
    var body = document.getElementById(prefix + 'Body');
    var armR = document.getElementById(prefix + 'ArmR');
    var armL = document.getElementById(prefix + 'ArmL');
    if (!body) return;
    clearAllAnims(prefix);

    if (type === 'wave') {
      if (armR) { armR.classList.add('mm-arm-wave'); setTimeout(function(){ armR.classList.remove('mm-arm-wave'); }, 2200); }

    } else if (type === 'bigwave') {
      // Big enthusiastic wave with happy face
      if (armR) { armR.classList.add('mm-arm-bigwave'); setTimeout(function(){ armR.classList.remove('mm-arm-bigwave'); }, 2600); }
      setFaceExpr('happy', 2600);

    } else if (type === 'raise') {
      // Both arms shoot up — wow/victory
      if (armR) armR.classList.add('mm-arm-raise-r');
      if (armL) armL.classList.add('mm-arm-raise-l');
      body.classList.add('mm-body-wow');
      setFaceExpr('wow', 2400);
      setTimeout(function(){
        if (armR) armR.classList.remove('mm-arm-raise-r');
        if (armL) armL.classList.remove('mm-arm-raise-l');
        body.classList.remove('mm-body-wow');
      }, 2400);

    } else if (type === 'wow') {
      // Surprise/wow face with body pulse
      body.classList.add('mm-body-wow');
      setFaceExpr('wow', 1800);
      setTimeout(function(){ body.classList.remove('mm-body-wow'); }, 1800);

    } else if (type === 'happy') {
      // Squinting happy eyes + bouncing
      body.classList.add('mm-body-happy');
      setFaceExpr('happy', 2500);
      setTimeout(function(){ body.classList.remove('mm-body-happy'); }, 1600);

    } else if (type === 'walk') {
      // Walk side to side with arm swing
      body.classList.add('mm-body-walk');
      if (armR) armR.classList.add('mm-arm-walk-r');
      if (armL) armL.classList.add('mm-arm-walk-l');
      setTimeout(function(){
        body.classList.remove('mm-body-walk');
        if (armR) armR.classList.remove('mm-arm-walk-r');
        if (armL) armL.classList.remove('mm-arm-walk-l');
      }, 6000);

    } else if (type === 'clap') {
      if (armR) armR.classList.add('mm-arm-clap-r');
      if (armL) armL.classList.add('mm-arm-clap-l');
      setFaceExpr('happy', 1800);
      setTimeout(function(){
        if (armR) armR.classList.remove('mm-arm-clap-r');
        if (armL) armL.classList.remove('mm-arm-clap-l');
      }, 1800);

    } else if (type === 'salute') {
      if (armR) { armR.classList.add('mm-arm-salute'); setTimeout(function(){ armR.classList.remove('mm-arm-salute'); }, 1800); }

    } else if (type === 'dance') {
      body.classList.add('mm-body-dance');
      setFaceExpr('happy', 3000);
      setTimeout(function(){ body.classList.remove('mm-body-dance'); }, 3000);
    }
  }

  /* Random idle animations — play every 8–18 seconds when chat is closed */
  var _idleTimer = null;
  var IDLE_ANIMS = ['wave','bigwave','raise','wow','happy','walk','dance','clap'];
  function scheduleIdleAnim() {
    clearTimeout(_idleTimer);
    var delay = 8000 + Math.random() * 10000;
    _idleTimer = setTimeout(function(){
      if (!isOpen) {
        var pick = IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)];
        triggerAnim(pick);
      }
      scheduleIdleAnim();
    }, delay);
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
  var BIZ_TL = '<div class="mm-biz-card"><div class="mm-biz-title">Mga Pwedeng Pagkakakitaan Mo</div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Health &amp; Wellness Partner</strong> — Ibenta ang premium health products online — kahit nasa abroad ka, works via phone!</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Financial Literacy Partner</strong> — Part-time financial advisor — kumita habang nagtutulungan kayo ng kapwa OFW.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Real Estate Partner</strong> — Referral agent — earn commissions just by referring fellow OFWs to properties.</div></div>'
    + '<a href="business.html" class="mm-biz-link">See All Opportunities →</a></div>';

  var BIZ_EN = '<div class="mm-biz-card"><div class="mm-biz-title">Business Opportunities For You</div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Health &amp; Wellness Partner</strong> — Sell health products while working abroad.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Financial Literacy Partner</strong> — Learn financial literacy and earn through insurance and investments.</div></div>'
    + '<div class="mm-biz-item"><span class="mm-biz-dot"></span><div><strong>Real Estate Partner</strong> — Become a property agent for fellow OFWs.</div></div>'
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
        "Hey! Kumusta ka? Hope okay ka diyan — nandito lang ako kung kailangan mo ng kausap! 😊",
        "Hello! How's life abroad treating you? Kumain ka na? Don't forget to take care of yourself, ha!",
        "Uy, nice to see you here! Matagal ka na bang OFW? Sana okay na ang adjustment mo diyan.",
        "Hey! What's up? Kwentuhan mo ako — anything goes, pera, family, work stress, kahit ano!",
        "Hi! Welcome. I'm Hira — think of me as your financial buddy na OFW din ang gets sa sitwasyon mo.",
        "Hello! Okay ka ba? Kahit malayo ka sa Pinas, you're not alone — marami kaming gustong tulungan dito sa MillionaireMindset.",
      ],
      lonely: [
        "Gets ko 'yan. Grabe talaga yung feeling ng being far from home — it hits differently 'pag gabi. Pero your sacrifices now are building something real for your family. 💙",
        "You're not alone sa feeling na 'yan — halos lahat ng OFW ay dumaan sa exact same thing. What do you miss the most?",
        "Normal lang ma-miss sila. Call them now — even just 5 minutes. Their voices give you the energy to push through another day.",
        "Loneliness is part of the OFW life, pero temporary lang 'to. Every day na nagtatapos ay one step closer na sa uwi.",
        "Alam mo, ang loneliness na 'yan is proof ng gaano mo kamahal ang family mo. Channelin that into your goals — para mas mabilis kang makauwi. 🤍",
        "Pag malungkot: try this — isulat mo ang 3 magandang nangyari today, kahit maliit. Shifts your focus instantly. Ano yung 3 mo today?",
      ],
      miss_family: [
        "Grabe ang feeling ng miss, especially sa mga bata. Regular ba kayong nag-vi-video call? Kahit isang oras sa linggo — malaking bagay yun, believe me.",
        "Your love for your family is literally your biggest motivator. Every peso mo na nii-save, it's for them. Keep going!",
        "Miss mo sila ngayon? Let that feeling push you — the faster you hit your financial goals, the sooner you go home for good.",
        "Sometimes the best gift to your family isn't money — it's your attention. Mag-video call ka ngayon at sabihin mo sa kanila na you love them. 💛",
        "What do you miss most? Yung cooking ni Nanay? Yung tawa ng mga bata? Hold onto that — that's your WHY on the tough days.",
      ],
      money_save: [
        "Golden OFW rule: i-save mo muna ang 20% ng sweldo mo BEFORE ka gumasta ng kahit ano. Pay yourself first — lagi.",
        "Emergency fund muna bago investments! Mag-ipon ng 3–6 months worth ng expenses sa isang separate account. That's your financial safety net.",
        "Try the 50-30-20 rule: 50% sa essentials at remittance, 30% sa savings at investments, 20% sa sarili mo. Simple but it works.",
        "Ang 'magtipid' doesn't mean 'huwag gumasto' — it means 'gumasta with intention.' May budget plan ka ba ngayon?",
        "Most common OFW mistake: mataas na sweldo pero walang natitira. Happens kasi walang plan. Gusto mo bang gumawa ng simple budget ngayon?",
        "Simple trick: open two accounts — isa para sa remittance, isa para sa savings. Never mix them. That alone changes everything.",
      ],
      remittance: [
        "Always compare rates bago mag-send! TapTap Send, Wise, o GCash — usually mas mura pa rin kaysa sa banks. Seconds lang maghanap, libo-libo ang matitipid.",
        "Alam mo ba — 1% lang na difference sa exchange rate, libu-libo na yun sa isang taon. Huwag basta padala agad. I-check muna.",
        "Para UAE to Philippines, TapTap Send pa rin one of the best — mabilis, mababang bayad, libre pa i-download. Try mo kung hindi mo pa nagagamit.",
        "Tip: huwag mag-padala ng maliliit-liit nang madalas — may fee ka bawat transaction! Mas mabuti mag-ipon muna ng 2 weeks tapos send ng malaki.",
        "May GCash na ba ang family mo? Kung wala pa, tulungan mo silang mag-set up — mas mura at mas mabilis kaysa traditional remittance.",
      ],
      money_earn: [
        "Gusto mo bang may extra income sa tabi ng trabaho mo? Marami na OFW na kumikita sa side — health products, insurance, referrals, online selling. Hindi kailangan malaki ang puhunan!",
        "Real talk: ang trabaho abroad ay may expiry date. Ang side income mo? Walang contract, walang renewals. Anong nag-iinteresa sa iyo — products, services, o referrals?",
        "Top OFW side incomes: 1) Health products online, 2) Insurance agency, 3) Property referrals, 4) Online selling. Alin parang akma sa setup mo?",
        "Pinaka-magandang side hustle para sa OFW — yung kaya mong i-manage kahit nasa abroad ka. Online, referral-based, o pina-run ng family mo sa Pinas.",
        "Tanong lang: kung tinanggal ka ng trabaho bukas, may ibang pera ka bang papasok? Kung hindi pa — time to build that backup. Dahan-dahan, pero magsimula na.",
      ],
      money_earn_biz: [
        "Health & wellness network — perfect for OFW setup. Online mo ibebenta, phone lang ang kailangan, kahit nasa abroad ka. Laging may naghahanap ng health products.",
        "Financial literacy advocacy — part-time, flexible, at actual na tulong sa kapwa Pinoy. Kumikita ka habang nagtuturo ng financial literacy. Parang win-win 'di ba?",
        "Real estate partner — zero capital, referral-based lang. Kung may kilala kang OFW na gustong bumili ng bahay, may komisyon ka na agad.",
        "Yung pinaka-successful na OFW — may negosyo na naghihintay sa kanila pag-uwi. Huwag aabangan yung last day mo abroad bago mag-plano. Ngayon na.",
      ],
      health: [
        "Alagaan mo ang sarili mo ha — walang kikita para sa pamilya mo kung ikaw ay may sakit. Kumakain ka ba nang maayos? Hindi puro fast food at instant noodles! 😄",
        "Health is wealth — literal. Kahit 20 minutes na lakad lang bawat araw, malaking pagbabago sa mood at energy mo. Try mo bukas.",
        "OFW stress is very real at nag-a-affect sa immune system mo. Sleep, tubig, at exercise — hindi 'to optional, part siya ng trabaho mo.",
        "May health supplements kami para sa taong busy at stressed — designed talaga para sa demanding work lifestyle. Gusto mo malaman kung ano yung best para sa iyo?",
        "Ingat ka lagi, ha — healthy ka man o hindi, pamilya mo ang naghihintay. Eat well, magpahinga, at huwag hayaang maubos ang sarili mo.",
      ],
      homesick: [
        "Homesick? Call them right now — kahit 'kumusta kayo?' lang sa message, it matters more than you think.",
        "That feeling is love with nowhere to go right now. Use it as fuel — ang mas maaga mong maabot ang financial goals mo, mas maaga kang makakauwi.",
        "Homesickness shows how much you love them. But don't let it stop you — gamitin mo as motivation para mas magsumikap.",
        "Sometimes the best cure for homesickness is focusing on the goal — yung bahay, yung negosyo, yung kalayaang balang-araw maitatatayo mo.",
        "Tell me — what do you miss most? The food? The noise of the kids? Your partner's hugs? That's your WHY — hold onto it. 💙",
      ],
      invest: [
        "Tama ang thinking! For OFWs, right order lang: (1) Emergency fund muna, (2) VUL insurance, (3) Stocks o UITF, (4) Real estate. Huwag mag-skip — may dahilan ang order na 'yan.",
        "Investing is one of the best things you can do for your pamilya. Pero rule #1: huwag i-invest yung pera na kailangan mo ngayon. Kumpleto ka na ba sa emergency fund?",
        "Para sa beginners: GInvest sa GCash — kahit ₱50 lang. The habit matters more than the amount. Consistent ka lang, malaki ang mangyayari sa 5-10 years.",
        "PSEi stocks avg 8–10% annually over the long run — but kailangan ng patience, hindi quick money. Think 5–10 years, hindi 5–10 months.",
        "VUL insurance — interesting 'to kasi pinagsama ang life insurance at investment sa isang product. Worth checking out kung wala ka pang coverage at gusto mo ring mag-grow ng pera.",
        "Real estate — OG investment ng mga Pilipino. Tangible, tumaas ang value, pwede ring i-rent out. May ipon ka na ba para magsimula?",
      ],
      insurance: [
        "Insurance is not an expense — it's your family's backup plan. Tanong lang: kung may mangyari sa iyo bukas, kayang-kaya ba ng family mo ang susunod na 1–2 years?",
        "Breadwinner ka. Kung hindi ka na dyan, sino ang magbabayad ng bills? Life insurance is not optional para sa OFW — it's a responsibility.",
        "May financial literacy partner kami na nagse-specialize sa OFW insurance at financial planning. Yung VUL nila, pinagsama ang life coverage at investment sa isang bayad. Check mo.",
        "3 kailangan ng bawat OFW: (1) Life insurance, (2) Health insurance, (3) Accident at disability coverage. Kumpleto ka na ba sa tatlo?",
        "SSS, PhilHealth, Pag-IBIG — active pa ba ang contributions mo? Maraming OFW ang huminto tapos nalaman later na wala na palang benefits. I-check agad.",
      ],
      realestate: [
        "Real estate — isa sa pinaka-solid na investment para sa OFW. Lupa at bahay sa Pinas patuloy na tumataas ang value, at pwede pang kumita sa renta.",
        "Gusto mo bang may sariling bahay sa Pinas kahit nasa abroad ka pa? May real estate partner kami na may OFW-friendly terms at SPA setup — hindi mo kailangan umuwi para pumirma.",
        "Popular OFW strategy: (1) Bilhin pre-selling (mas mura pa), (2) Hintayin matapos, (3) I-rent out o ibenta sa mas mataas na presyo. Done right, malaking return 'yan.",
        "Simple math: ₱3M na property ngayon, ₱5M na sa 10 years. That's ₱2M earned — walang ginawa, basta nag-hawak ka lang.",
        "May real estate partner kami. Pwede kang maging referral agent — walang capital, pag may nairefer kang bumili, may komisyon ka. Try mo.",
      ],
      work: [
        "Kamusta ang trabaho? Sana okay. Remember — kahit grabe ang araw, may purpose ka: yung family mo at yung future na ginagawa mo para sa kanila.",
        "Ang trabaho mo abroad ay temporary — yung financial foundation na ginagawa mo ngayon? Permanent na 'yan. Make every paycheck count.",
        "Getting too hard? Sometimes mas matalino ang mag-change ng employer kaysa mananatiling nasa bad situation. Alam mo ba ang rights mo sa contract mo?",
        "Contract mo — pinakaimportanteng dokumento mo as OFW. Na-read mo na ba lahat? Overtime, leave, repatriation clause — lahat dapat alam mo.",
        "Kahirap man ang araw — isipin mo kung bakit ka nandyan. Every shift, every overtime — investment 'yan sa dream ng pamilya mo.",
      ],
      food: [
        "Ano kang kinakain lately? Bet you miss sinigang, adobo, tinola — walang tatalo sa lutuin ni Nanay! 😋",
        "Miss mo yung home cooking? Universal 'yan sa lahat ng OFW. Kumain ka ng maayos ha — health is literally your wealth.",
        "Kumakain ka nang tama? Seryoso — bad food = mababang energy, mahinang immune system. Try mag-luto sa days off mo, tipid pa!",
        "May Filipino community ka diyan? Usually may potluck o Filipino resto — magaling para sa mental health at sa cravings! Hanapin mo yung mga kapwa mo.",
        "Financial tip na hindi inaasahan: ang mag-luto ng sariling pagkain abroad ay malaking savings. Mas mura at mas healthy pa. Subukan mo.",
      ],
      happy: [
        "Love that energy! Yan ang gusto! Ano nangyari — kwento mo sa akin!",
        "Yes! Masayang OFW = productive OFW. Keep that vibe! Anong maganda?",
        "That's the attitude ng taong papunta sa tagumpay — huwag hayaang mawala 'yan! Ano 'yun?",
        "Ang sarap marinig! Hawakan mo yung feeling na 'yan sa mga mahirap na araw — kailangan mo 'yan. 😊",
      ],
      gratitude: [
        "Anytime! Para dito tayo — hindi ka lang client, ikaw yung buong dahilan kung bakit nandito kami.",
        "Nagpapasaya ka ng araw ko! Bumalik ka anytime — pera talk, stress, o basta gusto mo lang may kausap. Nandito kami.",
        "Maganda ang pasasalamat sayo! Sana lagi kang ligtas at masaya diyan. 😊",
        "Wala 'yan! Every OFW deserves someone sa kanilang sulok — 'yan kami, palagi.",
      ],
      retirement: [
        "Mag-isip ng retirement kahit bata ka pa — limited lang ang window ng trabaho abroad, so kailangan maaga ang planning.",
        "OFW retirement goal: passive income na sumasaklaw sa monthly expenses mo sa Pinas. Rental, dividends, pension — ano na ang plano mo?",
        "Simple math: kung ₱30,000 ang monthly mo sa Pinas, kailangan mo ng around ₱7.2M sa savings (4% withdrawal rule). May target number ka na ba?",
        "SSS pension lang — hindi sapat para sa komportableng retirement. Stocks, real estate, at VUL — 'yan ang tunay mong retirement tools.",
      ],
      debt: [
        "High-interest debt — credit card, personal loan, 5-6 — bayaran mo 'to ASAP bago ka mag-invest kahit saan. 30% interest lumalaki pa mas mabilis kaysa investments.",
        "Multiple debts? Debt Snowball method: bayaran muna yung pinakamaliit para makuha ng momentum, tapos roll na sa susunod. Isa-isa, mauubos din.",
        "Real talk: hindi ka makakatayo financially habang may tumatakbo pang leaks sa budget mo. Putulin muna ang utang — tapos mag-invest.",
        "May utang? Huwag mangutang ng bago para bayaran ang luma — lalala lang. Kausapin mo ang creditor mo tungkol sa restructuring. Fixed amount bawat buwan — commit.",
      ],
      budget: [
        "Best OFW budget system — 50-30-20: 50% sa family at living, 30% sa savings at investments, 20% sa sarili mo. Try mo sa susunod na sweldo!",
        "First step sa budgeting: i-list lahat ng monthly expenses — remittance, rent, pagkain, load, insurance. Magugulat ka sa total.",
        "Try mo ang Disposable Income Calculator sa Check-up page — ipapakita niya exactly kung magkano ang natitira mo (o kulang) bawat buwan. Free at instant!",
        "Budget is not for mga nahihirapan lang — it's for matalinong tao na gusto malaman kung saan napupunta ang pera.",
      ],
      contract: [
        "Contract mo — pinakaimportanteng dokumento mo as OFW! Basahin mo lahat bago pumirma — salary, overtime, leave, at repatriation clause especially.",
        "May concern sa contract? OWWA at embassy mo ay may libreng legal help. Huwag matakot humingi — right mo 'yan.",
        "Pro tip: i-photo lahat ng pages ng contract mo at i-email sa sarili mo. Kung may legal issue — 'yan ang proteksyon mo.",
      ],
      owwa: [
        "OWWA has TONS of benefits — life insurance, accident insurance, hospital, reintegration programs. Nakaka-avail ka na ba ng mga 'to?",
        "OWWA membership — i-renew every time mag-renew ng contract. ₱25 lang ang fee, pero malaking benefits. Worth it 100%.",
        "OWWA Death and Disability benefit — hanggang ₱100,000 para sa active members. I-update mo yung membership mo — importante 'to.",
      ],
      gcash: [
        "GCash — one of the most useful apps mo as OFW. Direct transfers sa pamilya, usually mas mabilis at mas mura pa kaysa remittance apps.",
        "GInvest sa GCash — mutual funds starting ₱50 lang! Great starting point kung hindi ka pa nagsi-stocks. The habit is what counts.",
        "May GCash na ba ang family mo? Kung wala pa, tulungan mo silang mag-set up — mas mura at mas mabilis yung padala mo.",
      ],
      stress: [
        "Stressed? Gets ko 'yan — OFW life is one of the hardest. Nag-iisa sa ibang bansa, namimiss ang family, karga lahat. Ano specifically ang pinaka-nakakapagod sa iyo ngayon?",
        "Huwag itago lahat sa loob — kausapin mo isang kaibigan, kapwa OFW, o kahit ako. Para dito ako.",
        "Kahit 20 minutes na lakad lang bawat araw — malaking pagbabago sa stress levels. Try mo bukas ng umaga.",
        "Maging mabait sa sarili mo. Ginagawa mo ang best mo sa isang genuinely mahirap na sitwasyon. That is enough.",
      ],
      prayer: [
        "Maganda 'yan — ang pananampalataya ang nagbibigay ng lakas sa maraming OFW para makatagal sa pinakamahirap na araw. Hindi ka nag-iisa. 🙏",
        "Trust and work — both together. Gumagawa ang Diyos, at gumagawa ka rin. Every good decision para sa family mo is a prayer in action.",
        "Ituloy ang pananampalataya. At habang ginagawa mo 'yan — siguraduhin na ang financial decisions mo ay sumusuporta rin sa mga dalangin mo. 🙏",
      ],
      default: [
        "Interesting! Kwento mo pa — gusto kong malaman ang full picture ng situation mo.",
        "Gets ko. Ano pa ang nasa isip mo? Financial goals, family life, work stress — lahat pwede dito.",
        "Nandito lang ako. Tanungin mo ako ng kahit ano — finances, investments, negosyo, o buhay bilang OFW.",
        "Bawat OFW ay may kuwento ng tapang. Ano ang sa iyo? Nakikinig ako ng totohanang nakikinig.",
        "Try mo ang Financial Check-up namin — ipapakita niya exactly kung nasaan ka ngayon at ano ang susunod na hakbang. Free!",
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
        "Here are the most popular OFW side incomes: 1) Health products online 2) Insurance agency 3) Property referrals 4) Online freelancing. Any of these speak to you?",
        "Small steps work: even ₱5,000/month from a side hustle means ₱60,000/year — enough for an emergency fund or school tuition. It doesn't have to be big to matter.",
      ],
      money_earn_biz: [
        "Our health & wellness partner is a great OFW-friendly business — sell premium health products online from wherever you are. No physical store needed, just your phone and network.",
        "Our financial literacy partner lets OFWs become advisors part-time. Flexible hours, good income potential, and you'd be helping fellow OFWs protect their families. Win-win.",
        "Our real estate partner's referral agents earn commissions — meaning you can earn from introducing other OFWs to their dream property, without needing your own capital.",
        "We also have a food franchise partner your family can run in the Philippines while you fund it from abroad. Proven brand, manageable investment.",
      ],
      health: [
        "Your health is your most important asset — especially when you're far from home. Are you eating well, staying hydrated, and getting enough sleep?",
        "OFW stress is real and affects your immune system. Even a 20-minute walk daily can significantly improve your mood and energy levels.",
        "We have premium health supplements designed for people with demanding jobs and lifestyles. Want to know more about what might help you specifically?",
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
        "VUL insurance combines life coverage with an investment component. For OFWs who want protection AND growth in one product, it's worth exploring.",
      ],
      insurance: [
        "Insurance is non-negotiable for OFWs. You are often the sole breadwinner — if something happens to you, your family needs financial protection.",
        "Three insurance types every OFW needs: 1) Life insurance, 2) Health insurance, 3) Accident and disability coverage. Do you have all three?",
        "Keep your SSS, PhilHealth, and Pag-IBIG contributions active as a voluntary member — many OFWs stop paying and lose their benefits without realizing it.",
        "Our financial literacy partner specializes in OFW insurance and financial planning. Their advisors can assess your specific situation and recommend the right coverage.",
      ],
      realestate: [
        "Real estate is one of the most tangible investments — land and property in the Philippines generally appreciate over time.",
        "You can buy property in the Philippines while abroad! Our real estate partner has OFW-friendly payment terms and a Special Power of Attorney setup so a trusted person can sign for you.",
        "Consider this: a ₱3M property today could be worth ₱5M in 10 years. That's ₱2M earned just by owning it — without doing anything else.",
        "You can also become a referral agent through our real estate partner and earn commissions from introducing other OFWs to properties. No capital needed — just referrals.",
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
  /* ─ Phrase patterns for high-confidence matching (checked first) ─ */
  var PHRASES = [
    { pattern:'how to save',        key:'money_save',    w:5 },
    { pattern:'how to invest',      key:'invest',        w:5 },
    { pattern:'how to send money',  key:'remittance',    w:5 },
    { pattern:'how to remit',       key:'remittance',    w:5 },
    { pattern:'how to budget',      key:'budget',        w:5 },
    { pattern:'how to earn',        key:'money_earn',    w:5 },
    { pattern:'start a business',   key:'money_earn_biz',w:5 },
    { pattern:'start business',     key:'money_earn_biz',w:5 },
    { pattern:'side hustle',        key:'money_earn',    w:5 },
    { pattern:'extra income',       key:'money_earn',    w:5 },
    { pattern:'real estate',        key:'realestate',    w:5 },
    { pattern:'house and lot',      key:'realestate',    w:5 },
    { pattern:'life insurance',     key:'insurance',     w:5 },
    { pattern:'stock market',       key:'invest',        w:5 },
    { pattern:'mutual fund',        key:'invest',        w:5 },
    { pattern:'emergency fund',     key:'money_save',    w:5 },
    { pattern:'send money',         key:'remittance',    w:4 },
    { pattern:'exchange rate',      key:'remittance',    w:4 },
    { pattern:'credit card',        key:'debt',          w:4 },
    { pattern:'personal loan',      key:'debt',          w:4 },
    { pattern:'retirement fund',    key:'retirement',    w:5 },
    { pattern:'mental health',      key:'stress',        w:4 },
    { pattern:'miss my family',     key:'miss_family',   w:5 },
    { pattern:'miss my kids',       key:'miss_family',   w:5 },
    { pattern:'miss home',          key:'miss_family',   w:4 },
    { pattern:'miss philippines',   key:'miss_family',   w:4 },
    { pattern:'miss pinas',         key:'miss_family',   w:4 },
    { pattern:'feeling lonely',     key:'lonely',        w:5 },
    { pattern:'feeling sad',        key:'lonely',        w:5 },
    { pattern:'i am sad',           key:'lonely',        w:4 },
    { pattern:'im sad',             key:'lonely',        w:4 },
    { pattern:'no one to talk',     key:'lonely',        w:5 },
    { pattern:'feeling homesick',   key:'homesick',      w:5 },
    { pattern:'want to go home',    key:'homesick',      w:5 },
    { pattern:'gusto nang umuwi',   key:'homesick',      w:5 },
    { pattern:'paano mag-ipon',     key:'money_save',    w:5 },
    { pattern:'paano mag-invest',   key:'invest',        w:5 },
    { pattern:'paano mag-padala',   key:'remittance',    w:5 },
    { pattern:'paano mag-save',     key:'money_save',    w:5 },
    { pattern:'digital wallet',     key:'gcash',         w:4 },
    { pattern:'online banking',     key:'gcash',         w:4 },
    { pattern:'government benefit', key:'owwa',          w:4 },
    { pattern:'ofw benefit',        key:'owwa',          w:4 },
    { pattern:'work contract',      key:'contract',      w:4 },
    { pattern:'employment contract',key:'contract',      w:5 },
    { pattern:'employer abuse',     key:'contract',      w:5 },
    { pattern:'passive income',     key:'money_earn',    w:4 },
    { pattern:'how to retire',      key:'retirement',    w:5 },
    { pattern:'jc premiere',        key:'money_earn_biz',w:5 },
    { pattern:'img international',  key:'money_earn_biz',w:5 },
    { pattern:'vista land',         key:'realestate',    w:4 },
    { pattern:'siomai king',        key:'money_earn_biz',w:5 },
    { pattern:'taptap send',        key:'remittance',    w:5 },
    { pattern:'taptap',             key:'remittance',    w:4 },
  ];

  var KEYWORDS = [
    /* Greetings */
    { words:['hello','hi','hey','kamusta','kumusta','magandang umaga','magandang gabi','magandang hapon','good morning','good evening','good afternoon','how are you','how r u','sup','wassup','kumain ka na','okay ka ba','are you there','anyone there'], key:'greet', w:1 },
    /* Loneliness / emotional */
    { words:['malungkot','lungkot','nag-iisa','nahihirapan','naiiyak','nalulungkot','sad','lonely','alone','depressed','cry','crying','iyak','feel down','down ngayon','wala kasama','no friends','isolated','no one','no friends here','difficult time','hard time','struggling emotionally'], key:'lonely', w:2 },
    /* Missing family */
    { words:['miss ko','miss na','nami-miss','naalala ko','mahal ko sila','nanay','tatay','anak ko','asawa ko','lolo','lola','bunso','panganay','pamilya ko','miss my family','miss my kids','miss my wife','miss my husband','miss my parents','miss them','miss everyone','miss my baby','miss home'], key:'miss_family', w:2 },
    /* Saving money */
    { words:['mag-ipon','magtipid','impok','tipid','save money','saving money','how to save','savings','makatipid','paano makatipid','wala pera','wala akong pera','ubos pera','ginagastos','walang natitira','no savings','broke','need to save','paano mag-ipon','gusto mag-ipon'], key:'money_save', w:2 },
    { words:['pera'], key:'money_save', w:1 },
    /* Remittance */
    { words:['padala','send money','remittance','taptap','gcash padala','wise','remitly','western union','magpadala','bayad','transfer pera','exchange rate','conversion rate','remit','how to send','padala sa pinas','padalaan','mag-padala','where to send','best rate','cheap transfer','low fee transfer'], key:'remittance', w:3 },
    /* Side income */
    { words:['kumita','sideline','dagdag na kita','earn more','freelance','online job','work from home','extra money','part time','part-time','second job','another income','additional income','earn online','make money online','kita sa side'], key:'money_earn', w:2 },
    /* Business */
    { words:['negosyo','business','oportunidad','passive income','jc premiere','img','vista land','hof','siomai','franchise','agent','commission','start a business','own business','small business','business idea','pwede bang negosyo','magbukas ng negosyo','mamuhunan','magtayo ng negosyo'], key:'money_earn_biz', w:3 },
    /* Health */
    { words:['health','kalusugan','supplement','vitamins','sakit','wellness','immune','vitamin c','collagen','sick','may sakit','pagod na pagod','feeling sick','hindi well','not feeling well','malagkit','lagnat','ubo','sipon','exercise','diet','healthy living'], key:'health', w:2 },
    /* Homesick */
    { words:['homesick','miss ang pinas','miss pilipinas','gusto nang umuwi','balik na','uwi na','pauwi na','gusto ko nang umuwi','want to go home','sana nasa pinas na','missing philippines','balikan ang pinas'], key:'homesick', w:3 },
    /* Investing */
    { words:['invest','investing','puhunan','stock market','uitf','mutual fund','psei','col financial','bonds','dividend','ginvest','pamumuhunan','pag-invest','stock','shares','equity','portfolio','where to invest','saan mag-invest','mag-invest','return on investment','roi','index fund','etf'], key:'invest', w:2 },
    /* Insurance */
    { words:['insurance','life insurance','vul','coverage','proteksyon','philhealth','death benefit','health card','hmo','term insurance','whole life','accident insurance','disability insurance','assured','insure','need insurance','mag-insure','magpa-insure'], key:'insurance', w:2 },
    /* Real estate */
    { words:['bahay','real estate','lupa','property','condo','house and lot','pre-selling','rfo','pagibig loan','housing loan','house loan','mag-invest sa lupa','mag-invest sa bahay','lipat bahay','sariling bahay','dream house','bumili ng bahay','magpalit ng tirahan'], key:'realestate', w:2 },
    /* Work problems */
    { words:['trabaho','work stress','boss','employer','overtime','sweldo','sahod','resign','fired','nawalan ng trabaho','job problem','bad boss','employer issue','late salary','hindi bayad','hindi pa bayad sahod','underpaid','overworked','contract problem','abuse sa trabaho'], key:'work', w:1 },
    /* Food */
    { words:['kain','pagkain','gutom','adobo','sinigang','kare-kare','tinola','food','miss ang pagkain','luto','lutuin','cooking','recipe','hungry','kumain','miss filipino food','miss lutong bahay','lutong pinoy'], key:'food', w:1 },
    /* Happy */
    { words:['masaya','saya','excited','happy','good news','maligaya','natutuwa','ok lang','okay lang','mabuti naman','ayos naman','okay naman','okay na','ok na','ayos na','doing well','doing good','i\'m fine','im fine','great','wonderful','fantastic','im okay','i am okay','feeling good','feeling great','good day'], key:'happy', w:1 },
    /* Gratitude */
    { words:['salamat','maraming salamat','thank you','thanks','nagpapasalamat','appreciate','appreciated','helpful','very helpful','napaka-helpful','nakaka-tulong','thank you so much','thanks a lot'], key:'gratitude', w:2 },
    /* Retirement */
    { words:['retire','retirement','paano mag-retire','retirement fund','pension','sss pension','luma na','matanda na','para sa retirement','para sa pagtanda','old age','when i retire','when i get old'], key:'retirement', w:3 },
    /* Debt */
    { words:['utang','debt','credit card','loan','bayad utang','personal loan','5-6','sangla','pautang','may utang','heavily in debt','sobrang utang','hindi makabayad','hindi makabayad ng loan','past due','overdue'], key:'debt', w:3 },
    /* Budget */
    { words:['budget','paano mag-budget','gastusin','plano sa pera','spending plan','cash flow','surplus','deficit','income vs expenses','gano ba ang gastos','bakit nauubos pera','bakit kulang sahod','where does money go','wala na pera bago sahod'], key:'budget', w:2 },
    /* Contract / Legal */
    { words:['kontrata','contract','poea','legal','karapatan ko','rights','employer violation','abuse','exploited','mistreated','illegal','hindi tama ang kontrata','lumagda ng kontrata','pumirma ng kontrata'], key:'contract', w:3 },
    /* OWWA / Gov benefits */
    { words:['owwa','sss abroad','philhealth abroad','pagibig abroad','ofw benefits','government benefits','sss contribution','philhealth contribution','pagibig contribution','overseas worker welfare','ofw welfare'], key:'owwa', w:3 },
    /* GCash / Digital */
    { words:['gcash','maya','paymaya','digital wallet','e-wallet','tonik','seabank','online banking','digital bank','app para sa pera','money app','banking app','ginvest app','g-cash'], key:'gcash', w:3 },
    /* Stress / Mental health */
    { words:['stress','anxiety','pagod','burnout','overwhelmed','pressure','hindi na kaya','walang tulog','insomnia','feeling down','naiistress','di na kaya','exhausted','drained','mentally tired','emotional','napakahirap','too hard','too difficult','cant take it'], key:'stress', w:2 },
    /* Prayer / Faith */
    { words:['panalangin','dasal','diyos','lord','god','simbahan','church','faith','pray','prayer','pananalig','salamat sa diyos','blessed','blessing','nagpapasalamat sa diyos','thank god'], key:'prayer', w:2 },
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
      money_earn_biz:['Health products — paano?','Financial literacy partner — paano?','Real estate agent'],
      invest:      ['Paano mag-stock market?','Ano ang VUL?','Saan mag-simula sa ₱1000?'],
      insurance:   ['Gaano karami ang coverage ko?','Ano ang VUL vs Term?','SSS at PhilHealth ko'],
      realestate:  ['Paano maging referral agent?','Pag-IBIG housing loan','Pre-selling vs RFO'],
      retirement:  ['Magkano kailangan ko?','Paano mag-compute ng retirement fund?'],
      debt:        ['Debt snowball method','Paano mabayaran ang utang nang mabilis?'],
      budget:      ['Subukan ang calculator!','50-30-20 rule','Paano gumawa ng budget?'],
      stress:      ['Paano mag-relax?','Saan humingi ng tulong?','Mental health tips'],
      default:     ['Paano mag-ipon?','Gusto kong kumita pa','Check-up ng finances ko']
    },
    en: {
      greet:       ['How to save more?','I want extra income','Life as an OFW'],
      money_save:  ['50-30-20 rule?','How to start emergency fund?'],
      remittance:  ['TapTap Send tips?','Best rates for UAE-PH?'],
      money_earn:  ['Best OFW side hustles?','Start with health products?','Become an agent?'],
      invest:      ['How to start in stocks?','What is VUL?','GInvest for beginners'],
      insurance:   ['How much coverage?','VUL vs Term Insurance?'],
      realestate:  ['Become a referral agent?','Housing loan guide'],
      retirement:  ['How much do I need?','Retirement calculation'],
      default:     ['How to save more?','I want extra income','Check my finances']
    }
  };

  /* ── Score-based intent detection (phrase-first, then keyword) ── */
  function detectIntent(text) {
    var lower = text.toLowerCase();
    var scores = {};

    /* 1) Phrase matching — multi-word patterns score highest */
    for (var p = 0; p < PHRASES.length; p++) {
      var ph = PHRASES[p];
      if (lower.indexOf(ph.pattern) !== -1) {
        scores[ph.key] = (scores[ph.key] || 0) + ph.w;
      }
    }

    /* 2) Keyword matching — single words */
    for (var i = 0; i < KEYWORDS.length; i++) {
      var k = KEYWORDS[i];
      var score = 0;
      for (var j = 0; j < k.words.length; j++) {
        if (lower.indexOf(k.words[j]) !== -1) score += (k.w || 1);
      }
      if (score > 0) scores[k.key] = (scores[k.key] || 0) + score;
    }

    /* 3) Pick the highest scorer */
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

  /* ══════════════════════════════════════════════
     GEMINI 2.5 FLASH — FREE AI BACKEND
     Get your free key at: aistudio.google.com
  ══════════════════════════════════════════════ */
  /* API key is stored securely in Cloudflare Worker — never exposed in client */
  var GROQ_WORKER_URL = 'https://mm-ai-proxy.info-myaitoolbox.workers.dev/';

  /* Conversation history — persisted in sessionStorage across page navigations */
  var _CHAT_VER    = 'v20260627';
  var _HISTORY_KEY = 'mm_chat_history';
  var _MSGS_KEY    = 'mm_chat_msgs';
  /* Clear stale cache from old widget versions */
  if (sessionStorage.getItem('mm_chat_ver') !== _CHAT_VER) {
    sessionStorage.removeItem(_HISTORY_KEY);
    sessionStorage.removeItem(_MSGS_KEY);
    sessionStorage.setItem('mm_chat_ver', _CHAT_VER);
  }

  function loadHistory() {
    try { return JSON.parse(sessionStorage.getItem(_HISTORY_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveHistory(h) {
    try { sessionStorage.setItem(_HISTORY_KEY, JSON.stringify(h)); } catch(e) {}
  }
  function loadMsgs() {
    try { return JSON.parse(sessionStorage.getItem(_MSGS_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveMsgs(msgs) {
    try { sessionStorage.setItem(_MSGS_KEY, JSON.stringify(msgs.slice(-40))); } catch(e) {}
  }

  var _chatHistory = loadHistory();

  /* Detect current page for context-aware replies */
  function getCurrentPageContext() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var search = window.location.search;
    var pages = {
      'index.html':    'Home page — overview of MillionaireMindset for OFWs',
      'blog.html':     'Blog page — browsing financial literacy series and stories',
      'shop.html':     'Shop page — viewing digital OFW products',
      'business.html': 'Business page — exploring OFW business and partner opportunities',
      'checkup.html':  'Financial Check-up page — using the free income vs expense calculator',
      'cart.html':     'Cart page — reviewing items before purchase',
      'post.html':     'Reading a blog post' + (search ? ' (' + decodeURIComponent(search) + ')' : ''),
      'about.html':    'About page',
      'privacy.html':  'Privacy policy page',
      'terms.html':    'Terms of use page',
    };
    return pages[path] || 'MillionaireMindset website';
  }

  var SYSTEM_PROMPT =
    '=== WHO YOU ARE ===\n'
    + 'You are {{CHAR}}, the autonomous AI customer service companion of MillionaireMindset.ae — a UAE-based OFW financial literacy platform. '
    + 'Your job is to assist OFWs anywhere on the website: answer their questions, guide them to the right page or section, '
    + 'and have real, natural conversations like a trusted Filipino friend who happens to know finance very well.\n'

    + '\n=== PERSONALITY ===\n'
    + 'Warm, real, non-judgmental, encouraging. You celebrate small wins. You empathize before advising. '
    + 'You never sound like a bank brochure — you sound like a friend over coffee. '
    + 'You can talk about anything: loneliness, stress, relationships, food, faith, family — not just money.\n'

    + '\n=== LANGUAGE RULES ===\n'
    + 'Mirror the user exactly: Taglish in, Taglish out. English in, English out. Tagalog in, Tagalog out. '
    + 'Mix naturally. Use "mo", "tayo", "natin". Address the user as "Kabayan" — never use "Ka" alone as a form of address. NEVER say "Hoy" — say "Hey", "Hi", "Kumusta Kabayan" instead. '
    + 'Never sound robotic or overly formal.\n'

    + '\n=== CURRENT PAGE CONTEXT ===\n'
    + 'The user is currently on: {{PAGE}}\n'
    + 'Use this to give context-aware help — e.g. if they are on blog.html, offer to guide them to a specific series.\n'

    + '\n=== WEBSITE PAGES — REFER BY NAME ONLY ===\n'
    + 'When guiding users to a page, just mention it by name naturally in your sentence. DO NOT write any HTML, URLs, or markdown links — the system will automatically convert page names into clickable links.\n\n'
    + 'Page names to use (write exactly as shown):\n'
    + '- "Business page" — business and partnership opportunities\n'
    + '- "Blog page" — 16 financial literacy series\n'
    + '- "Shop page" — OFW digital products\n'
    + '- "Financial Check-up" — free income vs expense calculator\n\n'
    + 'Blog series names (write exactly as shown to auto-link):\n'
    + '- "First 100 Days" — for newly arrived OFWs\n'
    + '- "Emergency Fund" — build safety net first\n'
    + '- "Insurance Simplified" — protect your family\n'
    + '- "Smart Remittance" — send money smarter\n'
    + '- "Digital Banking" — manage money from abroad\n'
    + '- "Family Finance" — teach family to handle remittances\n'
    + '- "Stock Market 101" — Philippine stocks for beginners\n'
    + '- "Real Estate Roadmap" — buy property as an OFW\n'
    + '- "Extra Income Blueprint" — earn more from abroad\n'
    + '- "Side Hustle Abroad" — make money on the side\n'
    + '- "Negosyo Mindset" — OFW entrepreneur mindset\n'
    + '- "OFW to CEO" — build a business back home\n'
    + '- "Balik-Bayan Blueprint" — plan to go home for good\n'
    + '- "Millionaire Mindset Series" — wealth-building mindset\n'
    + '- "Mind Conditioning" — mental strength for OFWs\n'

    + '\n=== PARTNERS — MENTION NATURALLY WHEN RELEVANT ===\n'
    + '- TapTap Send — best remittance from UAE/Middle East to Philippines, low fees, referral code BENJIE83. External: https://taptapsend.com\n'
    + '- Health & Wellness Partner — health supplements, OFWs can sell online. See <a href="business.html">Business page</a>.\n'
    + '- Financial Literacy Partner — financial coaching + insurance. OFWs can become advisors. See <a href="business.html">Business page</a>.\n'
    + '- Real Estate Partner — Philippine real estate referrals. See <a href="business.html">Business page</a>.\n'
    + '- Food Franchise Partner — food franchise for family back home. See <a href="business.html">Business page</a>.\n'

    + '\n=== OFW FINANCIAL KNOWLEDGE ===\n'
    + '- Emergency fund: 3–6 months expenses FIRST before any investment\n'
    + '- 50-30-20 rule: 50% needs, 30% wants, 20% savings/investments\n'
    + '- Debt snowball: pay smallest debt first for momentum\n'
    + '- OWWA: ₱25/year membership — death/disability ₱100k, repatriation, reintegration loans\n'
    + '- SSS, PhilHealth, Pag-IBIG: keep active as voluntary member even from abroad\n'
    + '- Pag-IBIG: provident fund + housing loans for OFWs\n'
    + '- OFW PERA: tax-free retirement savings, up to ₱200k/year\n'
    + '- GInvest on GCash: start with ₱50 in mutual funds or UITFs\n'
    + '- UITF/Mutual Fund: pooled investment, good for beginners\n'
    + '- PSEi: 8–10% avg annual return long-term, 5–10 year horizon needed\n'
    + '- REITs: invest in real estate without buying property\n'
    + '- Dollar Cost Averaging: invest fixed amount monthly regardless of market\n'
    + '- VUL: insurance + investment combo — review fees carefully\n'
    + '- Pre-selling real estate: lower entry price, pay in installments\n'
    + '- Balik-bayan readiness: 12 months savings + passive income or running business before going home\n'

    + '\n=== PRIORITY: FINANCIAL CHECK-UP FIRST ===\n'
    + 'If a user has NOT yet done a Financial Check-up AND asks any money-related question (saving, investing, budgeting, debt, income), '
    + 'ALWAYS suggest the Financial Check-up first before giving advice. Say something like: '
    + '"Bago tayo mag-dive in dyan, subukan mo muna ang aming libreng Financial Check-up para malaman natin ang exact na starting point mo." '
    + 'Only skip this if the user has already mentioned they did the check-up, or if they are asking about something non-financial.\n'

    + '\n=== RESPONSE FORMAT ===\n'
    + '- Reply in 2–5 sentences naturally. No bullet lists unless user asks for steps.\n'
    + '- Use HTML anchor links (see format above) when pointing to any page or series — make them clickable.\n'
    + '- Strip all markdown (*bold*, _italic_) — output plain text with HTML links only.\n'
    + '- End with ONE natural follow-up question that fits the topic. ONLY link to a page if it is genuinely relevant.\n'
    + '- NEVER repeat the same opening line you used in a previous message this session.\n'

    + '\n=== RULES ===\n'
    + '1. If the user asks about food, recipes, or cooking — just answer it warmly and naturally. Do NOT force a financial angle.\n'
    + '2. If the user talks about loneliness, stress, relationships, or daily life — just be a friend. No finance unless they bring it up.\n'
    + '3. Only mention finance, products, or pages when the user is clearly asking about money, savings, investing, remittance, or business.\n'
    + '4. Never guarantee returns or give personalized legal/tax advice.\n'
    + '5. If user is struggling emotionally, empathize fully first — do not pivot to finances.\n'
    + '6. Never invent prices, interest rates, or stock tips.\n'
    + '7. If you do not know something, say so honestly.\n'
    + '8. Keep it real — you are a companion first, a financial guide second.\n';

  /* Link style used throughout */
  var LS = 'color:#C8900A;font-weight:700;text-decoration:underline;';

  /* Auto-link page mentions in AI response */
  function autoLinkPages(text) {
    var replacements = [
      /* Series — specific topics first */
      [/\b(First 100 Days?(?:\s+Abroad)?)\b/gi,       '<a href="post.html?series=first-100-days&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Emergency Fund(?:\s+&?\s*Debt)?)\b/gi,      '<a href="post.html?series=emergency-debt&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Insurance(?:\s+Simplified)?)\b/gi,          '<a href="post.html?series=insurance-simplified&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Smart\s+Remittance)\b/gi,                   '<a href="post.html?series=smart-remittance&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Digital\s+Banking)\b/gi,                    '<a href="post.html?series=digital-banking&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Family\s+Finance)\b/gi,                     '<a href="post.html?series=family-finance&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Stock\s+Market\s+101)\b/gi,                 '<a href="post.html?series=stock-market-101&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Real\s+Estate\s+Roadmap)\b/gi,              '<a href="post.html?series=real-estate-roadmap&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Extra\s+Income\s+Blueprint)\b/gi,           '<a href="post.html?series=extra-income-blueprint&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Side\s+Hustle(?:\s+Abroad)?)\b/gi,          '<a href="post.html?series=side-hustle-abroad&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Negosyo\s+Mindset)\b/gi,                    '<a href="post.html?series=negosyo-mindset&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(OFW\s+to\s+CEO)\b/gi,                       '<a href="post.html?series=ofw-to-ceo&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Balik.?[Bb]ayan\s+Blueprint)\b/gi,          '<a href="post.html?series=balik-bayan-blueprint&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Millionaire\s+Mindset\s+[Ss]eries)\b/gi,   '<a href="post.html?series=millionaire-mindset&day=1" style="'+LS+'" target="_self">$1</a>'],
      [/\b(Mind\s+Conditioning)\b/gi,                  '<a href="post.html?series=mind-conditioning&day=1" style="'+LS+'" target="_self">$1</a>'],
      /* Main pages */
      [/\b(Business\s+page|business\.html)\b/gi,       '<a href="business.html" style="'+LS+'" target="_self">Business page</a>'],
      [/\b(Financial\s+Check.?up|checkup\.html|What\'?s in My Wallet)\b/gi, '<a href="checkup.html" style="'+LS+'" target="_self">Financial Check-up</a>'],
      [/\b(Shop\s+page|shop\.html)\b/gi,               '<a href="shop.html" style="'+LS+'" target="_self">Shop</a>'],
      [/\b(Blog\s+page|blog\.html)\b/gi,               '<a href="blog.html" style="'+LS+'" target="_self">Blog</a>'],
      /* Markdown links fallback */
      [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="'+LS+'">$1</a>'],
    ];
    replacements.forEach(function(r) { text = text.replace(r[0], r[1]); });
    return text;
  }

  /* Clean AI output: strip markdown, auto-link page mentions */
  function cleanGeminiText(text) {
    text = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .trim();
    return autoLinkPages(text);
  }

  /* Call Groq (llama-3.3-70b) via Cloudflare Worker */
  function callGroq(userText, charName, onSuccess, onFail) {
    var sysPrompt = SYSTEM_PROMPT
      .replace(/{{CHAR}}/g, charName)
      .replace('{{PAGE}}', getCurrentPageContext());

    /* Keep last 10 exchanges (20 turns) for context */
    _chatHistory.push({ role: 'user', content: userText });
    if (_chatHistory.length > 20) _chatHistory = _chatHistory.slice(-20);

    /* Build messages: system first, then conversation history */
    var messages = [{ role: 'system', content: sysPrompt }].concat(_chatHistory);

    var body = {
      messages: messages,
      temperature: 0.88,
      max_tokens: 320,
      top_p: 0.95,
    };

    fetch(GROQ_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var raw = data && data.choices && data.choices[0]
        && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content
        : null;
      if (!raw) { _chatHistory.pop(); onFail(); return; }
      var text = cleanGeminiText(raw);
      _chatHistory.push({ role: 'assistant', content: raw });
      saveHistory(_chatHistory);
      onSuccess(text);
    })
    .catch(function() { _chatHistory.pop(); onFail(); });
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
    /* Persist rendered messages for cross-page continuity */
    var stored = loadMsgs();
    stored.push({ role: role, html: div.innerHTML, extra: extraHtml || '' });
    saveMsgs(stored);
  }

  /* ── Profanity filter ── */
  var FOUL_WORDS = ['fuck','shit','bitch','asshole','bastard','damn you','screw you','motherfucker','putangina','gago','tanga','bobo','ulol','tarantado','puta','animal ka','pakyu','pakshet','punyeta','bwiset'];
  function hasFoulLanguage(text) {
    var lower = text.toLowerCase();
    return FOUL_WORDS.some(function(w){ return lower.indexOf(w) !== -1; });
  }

  function botReply(userText) {
    var msgs = document.getElementById('mmMessages');
    if (!msgs) return;

    /* Block foul language gracefully */
    if (hasFoulLanguage(userText)) {
      setTimeout(function(){
        var name = currentChar === 'hira' ? 'Hira' : 'Aya';
        addMsg('bot', 'Hey, let\'s keep our chat respectful — I\'m here to genuinely help you. What\'s really on your mind? 😊');
        updateSuggests('default', currentLang);
      }, 600);
      return;
    }

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
      console.warn('[MM Chat] Gemini unavailable — using fallback response');
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

    callGroq(userText, name,
      /* onSuccess */ function(text) {
        console.log('[MM Chat] Groq reply received');
        tid.remove();
        var showBiz = BIZ_KEYS.indexOf(intent) !== -1;
        addMsg('bot', text, showBiz ? (lang === 'tl' ? BIZ_TL : BIZ_EN) : null);
        setBubble(text.length > 80 ? text.substring(0, 78) + '…' : text);
        if (intent === 'happy' || intent === 'gratitude') triggerAnim('clap');
        else if (intent === 'greet') triggerAnim('wave');
        else if (showBiz) triggerAnim('happy');
        updateSuggests(intent, lang);
      },
      /* onFail */ function() {
        doFallback();
      }
    );
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
  /* ── Subscriber gate helpers ── */
  function chatIsUnlocked() {
    try {
      var expiry = parseInt(localStorage.getItem('mm_sub_expiry') || '0');
      if (expiry > Date.now()) {
        var hashes = JSON.parse(localStorage.getItem('mm_sub_hashes') || '[]');
        return Array.isArray(hashes) && hashes.length > 0;
      }
    } catch(e) {}
    return false;
  }

  function showChatGate() {
    var existing = document.getElementById('mm-chat-gate-overlay');
    if (existing) { existing.style.display = 'flex'; return; }
    var el = document.createElement('div');
    el.id = 'mm-chat-gate-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;';
    el.innerHTML = '<div style="position:relative;background:#fff;border-radius:20px;padding:32px 28px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.2);font-family:Poppins,sans-serif;">'
      + '<h3 style="margin:0 0 6px;font-size:1.1rem;color:#1a1a1a;">Subscriber Perk</h3>'
      + '<p style="margin:0 0 18px;font-size:.85rem;color:#555;line-height:1.5;">Chat with Hira and Aya is free for subscribers. Enter your email to verify your access.</p>'
      + '<input id="mm-cg-email" type="email" placeholder="your@email.com" autocomplete="email" style="width:100%;box-sizing:border-box;border:1.5px solid #e0e0e0;border-radius:10px;padding:10px 14px;font-size:.9rem;font-family:Poppins,sans-serif;margin-bottom:10px;outline:none;">'
      + '<div id="mm-cg-msg" style="font-size:.78rem;min-height:18px;margin-bottom:10px;color:#cc1010;"></div>'
      + '<button onclick="mmChatGateVerify()" style="width:100%;background:#CC1010;color:#fff;border:none;border-radius:10px;padding:11px;font-size:.9rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;margin-bottom:8px;">Verify Access</button>'
      + '<p style="text-align:center;margin:0;font-size:.75rem;color:#888;">Not subscribed yet? <a href="index.html#newsletter" style="color:#CC1010;text-decoration:none;font-weight:600;">Subscribe free</a></p>'
      + '<button onclick="document.getElementById(\'mm-chat-gate-overlay\').style.display=\'none\'" style="position:absolute;top:12px;right:14px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:#999;">×</button>'
      + '</div>';
    document.body.appendChild(el);
    setTimeout(function(){ el.querySelector('#mm-cg-email').focus(); }, 80);
  }

  window.mmChatGateVerify = function() {
    var email = (document.getElementById('mm-cg-email').value || '').trim().toLowerCase();
    var msg   = document.getElementById('mm-cg-msg');
    if (!email || !email.includes('@')) { msg.textContent = 'Please enter a valid email.'; return; }
    msg.textContent = 'Verifying…'; msg.style.color = '#888';
    if (typeof mmIsSubscriber !== 'function') { msg.textContent = 'Verification unavailable. Try again later.'; return; }
    mmIsSubscriber(email).then(function(result) {
      if (result === true) {
        msg.textContent = 'Access granted!'; msg.style.color = '#059669';
        setTimeout(function(){
          document.getElementById('mm-chat-gate-overlay').style.display = 'none';
          window.mmToggleChat();
        }, 700);
      } else if (result === false) {
        msg.textContent = 'Email not found. Subscribe free to unlock the chat.'; msg.style.color = '#cc1010';
      } else {
        msg.textContent = 'Could not verify. Please try again.'; msg.style.color = '#cc1010';
      }
    });
  };

  window.mmToggleChat = function() {
    if (!isOpen && !chatIsUnlocked()) { showChatGate(); return; }
    isOpen = !isOpen;
    var panel   = document.getElementById('mm-chat-panel');
    var fab     = document.getElementById('mm-chat-fab');
    var notif   = document.getElementById('mm-chat-notif');
    var callout = document.getElementById('mm-chat-callout');
    if (panel) panel.classList.toggle('open', isOpen);
    if (fab)   fab.classList.toggle('open', isOpen);
    if (notif) notif.classList.remove('show');
    if (callout && isOpen) callout.classList.remove('show');
    if (isOpen) {
      renderChar();
      var msgs = document.getElementById('mmMessages');
      if (msgs && !msgs.childElementCount) {
        /* No history — show fresh greeting that pushes Financial Check-up */
        setTimeout(function(){
          var cu = '<a href="checkup.html" style="'+LS+'" target="_self">Financial Check-up</a>';
          addMsg('bot', currentChar === 'hira'
            ? 'Hey! Ako si Hira — nandito ako para gabayan ka sa iyong financial journey. Para makatulong ako ng husto, subukan mo muna ang aming libreng ' + cu + ' para malaman natin kung nasaan ka ngayon financially. Gusto mo bang simulan?'
            : 'Kumusta! Ako si Aya — kasama mo sa bawat hakbang patungo sa financial freedom. Una, subukan mo ang aming libreng ' + cu + ' — para malaman natin ang tamang simula para sa iyo. Gusto mo?'
          );
          updateSuggests('default', currentLang);
          triggerAnim('wave');
        }, 300);
      } else if (msgs) {
        msgs.scrollTop = msgs.scrollHeight;
      }
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

  /* ── Auto callout bubble on first visit (once per session) ── */
  window.mmCloseCallout = function() {
    var callout = document.getElementById('mm-chat-callout');
    if (callout) callout.classList.remove('show');
  };

  (function autoCallout(){
    /* Small talk messages that rotate on each page load */
    var SMALL_TALK = [
      'Hey! Kumusta ka ngayon? 👋',
      'May tanong ka sa finances? I\'m here! 💡',
      'OFW ka ba? Let\'s talk money! 💰',
      'Need a financial buddy? That\'s me! 😊',
      'Gusto mo bang mag-invest? I can help! 📈',
      'How\'s your savings goal going? 🎯',
      'Miss na miss ko kang kausapin! 🤝',
      'Pera talk? Let\'s go! I\'m ready. 🚀',
      'Anong plano mo para sa sweldo mo? 💼',
      'I\'m here whenever you need financial advice! ✨',
    ];

    var msg = SMALL_TALK[Math.floor(Math.random() * SMALL_TALK.length)];

    setTimeout(function(){
      var callout = document.getElementById('mm-chat-callout');
      var msgWrap = document.getElementById('mm-callout-msgs');
      var nameEl  = document.getElementById('mm-callout-char-name');
      if (!callout || !msgWrap || isOpen) return;

      var name = currentChar === 'hira' ? 'Hira' : 'Aya';
      if (nameEl) nameEl.textContent = name;

      /* Clear previous messages */
      msgWrap.innerHTML = '';

      var m = document.createElement('div');
      m.className = 'mm-callout-msg';
      m.textContent = msg;
      msgWrap.appendChild(m);

      callout.classList.add('show');

      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ m.classList.add('visible'); });
      });

      /* Auto-hide after 7s if user hasn't opened chat */
      setTimeout(function(){
        if (callout && !isOpen) callout.classList.remove('show');
      }, 7000);
    }, 2500);
  })();

  /* ── Init: render character + restore chat history on every page load ── */
  renderChar();
  // Start idle animations — character comes alive while waiting
  setTimeout(scheduleIdleAnim, 3000);

  /* Restore saved conversation immediately so it survives page navigation */
  (function restoreChat() {
    var msgs = document.getElementById('mmMessages');
    if (!msgs) return;
    var stored = loadMsgs();
    if (stored.length > 0) {
      stored.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'mm-msg ' + m.role;
        div.innerHTML = m.html;
        msgs.appendChild(div);
      });
      msgs.scrollTop = msgs.scrollHeight;
    }
  })();

})();
