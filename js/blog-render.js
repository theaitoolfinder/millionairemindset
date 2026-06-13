/* ═══════════════════════════════════════════════
   BLOG RENDERER  v=20260614
   Renders hero, stats, series grid, destinations
   from BLOG_SERIES data (blog-series.js)
═══════════════════════════════════════════════ */
(function(){
  if (typeof BLOG_SERIES === 'undefined') return;

  var EP_COVERS = [
    'photo-1611974789855-9c2a0a7236a3',
    'photo-1526304640581-d334cdbbf45e',
    'photo-1450101499163-c8848c66ca85',
    'photo-1560518883-ce09059eeffa',
    'photo-1553877522-43269d4ea984',
    'photo-1512290923902-8a9f81dc236c',
    'photo-1504384308090-c894fdcc538d',
    'photo-1573496359142-b8d87734a5a2',
    'photo-1488085061387-422e29b40080',
    'photo-1521737711867-e3b97375f902',
    'photo-1579621970563-ebec7560ff3e',
  ];

  var PH_SCENICS = [
    { id:'photo-1518509562904-e7ef99cdcc86', place:'Palawan',  caption:'El Nido, Palawan — Isa sa pinakamagandang dagat sa mundo' },
    { id:'photo-1558618666-fcd25c85cd64', place:'Siargao',     caption:'Siargao — Surfing capital ng Pilipinas' },
    { id:'photo-1506929562872-bb421503ef21', place:'Boracay',  caption:'Boracay — White Beach, paborito ng lahat' },
    { id:'photo-1516026672322-bc52d61a55d5', place:'Banaue',   caption:'Banaue Rice Terraces — Ika-walong kababalaghan ng mundo' },
    { id:'photo-1504701954957-2010ec3bcec1', place:'Manila',   caption:'Manila — Puso ng bansang Pilipinas' },
    { id:'photo-1551966775-a4daa9665a6d',   place:'Bohol',     caption:'Chocolate Hills, Bohol — Natural wonder ng Pilipinas' },
    { id:'photo-1567620905732-2d1ec7ab7445', place:'Sagada',   caption:'Sagada Mountain Province — Mapayapa, malamig, maganda' },
    { id:'photo-1528702748617-c64d49f918af', place:'Cebu',     caption:'Cebu — Lungsod ng kasaysayan at karagatan' },
  ];

  /* ── HERO ── */
  var featured = BLOG_SERIES[0];
  if (featured) {
    var heroBg      = document.getElementById('blogHeroBg');
    var heroContent = document.getElementById('blogHeroContent');
    var pubCount    = featured.posts.filter(function(p){ return p.content; }).length;
    var coverUrl    = featured.cover || ('https://images.unsplash.com/' + EP_COVERS[0] + '?w=1600&q=90&auto=format&fit=crop');
    if (heroBg) heroBg.style.backgroundImage = 'url("' + coverUrl + '")';
    if (heroContent) heroContent.innerHTML =
      '<div class="blog-hero-eyebrow">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
        + 'Featured Series'
      + '</div>'
      + '<h1 class="blog-hero-title">' + featured.title + '</h1>'
      + '<div class="blog-hero-meta">'
        + '<span>' + featured.totalPosts + ' Lessons</span>'
        + '<span class="blog-hero-dot"></span>'
        + '<span>' + pubCount + ' Available Now</span>'
        + '<span class="blog-hero-dot"></span>'
        + '<span>Financial Literacy</span>'
      + '</div>'
      + '<p class="blog-hero-sub">' + featured.subtitle + '</p>'
      + '<div class="blog-hero-btns">'
        + (pubCount > 0
          ? '<a href="post.html?series=' + featured.id + '&day=1" class="blog-btn-primary">'
              + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
              + 'Simulan ang Day 1'
            + '</a>'
          : '<span class="blog-btn-primary" style="opacity:.5;cursor:default;">Coming Soon</span>')
        + '<a href="#seriesGrid" class="blog-btn-ghost">Browse All Series</a>'
      + '</div>';
  }

  /* ── STATS BAR ── */
  var totalSeries   = BLOG_SERIES.length;
  var totalPosts    = BLOG_SERIES.reduce(function(s,sr){ return s + sr.posts.filter(function(p){ return p.content; }).length; }, 0);
  var totalEpisodes = BLOG_SERIES.reduce(function(s,sr){ return s + sr.totalPosts; }, 0);
  var statsInner    = document.getElementById('blogStatsInner');
  if (statsInner) {
    statsInner.innerHTML = [
      { num: totalSeries,   label: 'Reading\nSeries' },
      { num: totalPosts,    label: 'Lessons\nAvailable' },
      { num: totalEpisodes, label: 'Total\nEpisodes' },
      { num: '100+',        label: 'Days of\nContent' },
    ].map(function(s){
      return '<div class="blog-stat-item">'
        + '<div class="blog-stat-num">' + s.num + '</div>'
        + '<div class="blog-stat-label">' + s.label.replace('\n','<br>') + '</div>'
      + '</div>';
    }).join('');
  }

  /* ── SERIES GRID ── */
  var grid = document.getElementById('seriesGrid');
  if (grid) {
    grid.innerHTML = BLOG_SERIES.map(function(series, sIdx){
      var pub = series.posts.filter(function(p){ return p.content; });
      var pct = series.totalPosts > 0 ? Math.round((pub.length / series.totalPosts) * 100) : 0;
      var coverUrl    = series.cover || ('https://images.unsplash.com/' + EP_COVERS[sIdx % EP_COVERS.length] + '?w=640&q=85&auto=format&fit=crop&crop=center');
      var href        = pub.length > 0 ? 'post.html?series=' + series.id + '&day=1' : '#';
      var isComingSoon = pub.length === 0;

      return '<a href="' + href + '" class="series-card" style="' + (isComingSoon ? 'opacity:.75;' : '') + '">'
        + '<div class="series-card-cover">'
          + '<img src="' + coverUrl + '" alt="' + series.title + '" loading="lazy">'
          + '<div class="series-card-cover-overlay"></div>'
          + '<div class="series-card-badge">' + series.emoji + ' Series</div>'
          + (isComingSoon ? '<div class="series-card-coming">Coming Soon</div>' : '')
          + '<div class="series-card-episodes">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
            + series.totalPosts + ' Episodes'
          + '</div>'
        + '</div>'
        + '<div class="series-card-body">'
          + '<div class="series-card-category">Financial Literacy</div>'
          + '<div class="series-card-title">' + series.title + '</div>'
          + '<div class="series-card-sub">' + series.subtitle + '</div>'
          + '<div class="series-prog-bar"><div class="series-prog-fill" style="width:' + pct + '%"></div></div>'
          + '<div class="series-card-footer">'
            + '<div class="series-card-prog">'
              + (pct > 0
                ? '<span>' + pub.length + '</span> of ' + series.totalPosts + ' live'
                : 'Coming soon')
            + '</div>'
            + (pub.length > 0
              ? '<div class="series-card-cta">Start Reading '
                  + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
                + '</div>'
              : '<div class="series-card-cta" style="color:var(--text-dim);">Notify Me</div>')
          + '</div>'
        + '</div>'
      + '</a>';
    }).join('');
  }

  /* ── DESTINATIONS ── */
  var destScroll = document.getElementById('destScroll');
  if (destScroll) {
    destScroll.innerHTML = PH_SCENICS.map(function(s){
      return '<div class="dest-card">'
        + '<img src="https://images.unsplash.com/' + s.id + '?w=600&q=85&auto=format&fit=crop&crop=center" alt="' + s.place + '" loading="lazy">'
        + '<div class="dest-card-overlay">'
          + '<div class="dest-card-label">Destination</div>'
          + '<div class="dest-card-place">' + s.place + '</div>'
          + '<div class="dest-card-caption">' + s.caption + '</div>'
        + '</div>'
      + '</div>';
    }).join('');
  }

})();
