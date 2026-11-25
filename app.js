/* Konvertli to'y taklifnomasi */
(function () {
  'use strict';

  var MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  var DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

  var PRESETS = {
    bordo:    { fon: '#7b2f34', konvert: '#6b1d26', muhr: '#7d1622', oltin: '#d9b26a' },
    yashil:   { fon: '#1f4d41', konvert: '#143a31', muhr: '#17463a', oltin: '#e0bd72' },
    kok:      { fon: '#1d3a5f', konvert: '#142b4a', muhr: '#18335a', oltin: '#e3c27a' },
    pushti:   { fon: '#b4647a', konvert: '#a04a63', muhr: '#8e3550', oltin: '#f1d9a0' },
    qora:     { fon: '#24242a', konvert: '#15151a', muhr: '#3a1f24', oltin: '#e0b65a' },
    binafsha: { fon: '#4b2a63', konvert: '#391c4f', muhr: '#4a2166', oltin: '#e2c27c' }
  };

  var NS = 'http://www.w3.org/2000/svg';
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function isHex(s) { return typeof s === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s); }
  function parse(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, p) {
    var A = parse(a), B = parse(b);
    return '#' + A.map(function (v, i) {
      return ('0' + Math.round(v + (B[i] - v) * p).toString(16)).slice(-2);
    }).join('');
  }

  function applyTheme(cfg) {
    var base = PRESETS[cfg.rang] || PRESETS.bordo;
    var c = {};
    ['fon', 'konvert', 'muhr', 'oltin'].forEach(function (k) {
      c[k] = (cfg.ranglar && isHex(cfg.ranglar[k])) ? cfg.ranglar[k] : base[k];
    });
    c.qogoz = (cfg.ranglar && isHex(cfg.ranglar.qogoz)) ? cfg.ranglar.qogoz : '#fbf6ec';
    var v = {
      '--fon': c.fon, '--fon2': mix(c.fon, '#000000', 0.4),
      '--konvert': c.konvert, '--konvert-qoyil': mix(c.konvert, '#000000', 0.22), '--konvert-yorug': mix(c.konvert, '#ffffff', 0.07),
      '--flap': mix(c.konvert, '#ffffff', 0.1), '--flap-yorug': mix(c.konvert, '#ffffff', 0.18),
      '--muhr': c.muhr, '--muhr-yorug': mix(c.muhr, '#ffffff', 0.22), '--muhr-qoyil': mix(c.muhr, '#000000', 0.4),
      '--oltin': c.oltin, '--oltin-yorug': mix(c.oltin, '#ffffff', 0.4), '--oltin-qoyil': mix(c.oltin, '#000000', 0.5),
      '--oltin-yumshoq': mix(c.oltin, c.fon, 0.3),
      '--qogoz': c.qogoz, '--matn': mix(c.konvert, '#000000', 0.55)
    };
    var root = document.documentElement.style;
    Object.keys(v).forEach(function (k) { root.setProperty(k, v[k]); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', c.fon);
  }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(s || ''));
    if (!m) return null;
    return {
      time: new Date(m[1] + '-' + m[2] + '-' + m[3] + 'T' + m[4] + ':' + m[5] + ':00+05:00').getTime(),
      day: +m[3], month: +m[2], year: +m[1], hh: m[4], mm: m[5],
      weekday: new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay()
    };
  }

  function svg(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }

  function drawEmblem(g, type, cfg, color, dark) {
    if (type === 'yurak') {
      svg('path', { d: 'M0,20 C-34,-2 -24,-28 -9,-22 C-3,-20 0,-15 0,-12 C0,-15 3,-20 9,-22 C24,-28 34,-2 0,20Z', fill: color, stroke: dark, 'stroke-width': 0.8 }, g);
      return;
    }
    if (type === 'harflar') {
      var a = (cfg.kuyov || '?').charAt(0).toUpperCase(), b = (cfg.kelin || '?').charAt(0).toUpperCase();
      var t = svg('text', { x: 0, y: 11, 'text-anchor': 'middle', 'font-size': 32, fill: color, 'font-family': "'Great Vibes','Snell Roundhand',cursive" }, g);
      t.textContent = a + (cfg.belgi || '&') + b;
      return;
    }
    [1, -1].forEach(function (s) {
      var w = svg('g', { transform: 'scale(' + s + ',1)' }, g);
      svg('path', { d: 'M2,-3 C-2,-20 -26,-30 -37,-17 C-43,-8 -30,5 2,2Z', fill: color, stroke: dark, 'stroke-width': 0.8 }, w);
      svg('path', { d: 'M2,4 C-20,7 -33,16 -27,26 C-21,34 -7,26 2,8Z', fill: color, stroke: dark, 'stroke-width': 0.8 }, w);
      svg('path', { d: 'M1,-1 C-10,-9 -22,-14 -30,-14 M1,0 C-12,-2 -26,-4 -35,-8 M1,6 C-8,10 -16,16 -22,22', fill: 'none', stroke: dark, 'stroke-width': 0.6, opacity: 0.7 }, w);
      svg('path', { d: 'M0,-12 C-4,-24 -9,-27 -12,-26', fill: 'none', stroke: color, 'stroke-width': 1, 'stroke-linecap': 'round' }, w);
    });
    svg('ellipse', { cx: 0, cy: 2, rx: 2, ry: 15, fill: color, stroke: dark, 'stroke-width': 0.6 }, g);
  }

  function buildSeal(cfg) {
    var root = svg('svg', { viewBox: '-50 -50 100 100', 'aria-hidden': 'true' });
    var defs = svg('defs', {}, root);
    var gr = svg('radialGradient', { id: 'sg', cx: '35%', cy: '30%', r: '80%' }, defs);
    svg('stop', { offset: '0', 'stop-color': 'var(--muhr-yorug)' }, gr);
    svg('stop', { offset: '0.6', 'stop-color': 'var(--muhr)' }, gr);
    svg('stop', { offset: '1', 'stop-color': 'var(--muhr-qoyil)' }, gr);
    var pts = [], N = 240, i, th, r;
    for (i = 0; i < N; i++) {
      th = 2 * Math.PI * i / N;
      r = 46 + 2.4 * Math.sin(14 * th) + 1.3 * Math.sin(7 * th + 1);
      pts.push((r * Math.cos(th)).toFixed(2) + ',' + (r * Math.sin(th)).toFixed(2));
    }
    svg('path', { d: 'M' + pts.join('L') + 'Z', fill: 'url(#sg)' }, root);
    svg('circle', { r: 33, fill: 'var(--muhr-qoyil)', opacity: 0.55 }, root);
    svg('circle', { r: 32, fill: 'var(--muhr)', stroke: 'var(--muhr-yorug)', 'stroke-width': 1 }, root);
    var g = svg('g', { transform: 'scale(0.62)' }, root);
    drawEmblem(g, cfg.muhr, cfg, 'var(--oltin)', 'var(--oltin-qoyil)');
    return root;
  }

  function buildEmblem(cfg) {
    var root = svg('svg', { viewBox: '-50 -40 100 80', 'class': 'emblem', 'aria-hidden': 'true' });
    var g = svg('g', { transform: 'scale(0.95)' }, root);
    drawEmblem(g, cfg.muhr, cfg, 'var(--konvert)', 'var(--matn)');
    return root;
  }

  function buildFlowers() {
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var root = svg('svg', { viewBox: '0 0 100 280', preserveAspectRatio: 'xMidYMid meet' });
    var stems = [
      { x0: 24, y0: 272, cx: 4, cy: 150, x1: 30, y1: 14 },
      { x0: 34, y0: 272, cx: 70, cy: 180, x1: 62, y1: 60 },
      { x0: 18, y0: 272, cx: 40, cy: 120, x1: 14, y1: 40 }
    ];
    function bez(s, t) {
      var u = 1 - t;
      return [u * u * s.x0 + 2 * u * t * s.cx + t * t * s.x1, u * u * s.y0 + 2 * u * t * s.cy + t * t * s.y1];
    }
    function flower(x, y, sc) {
      var f = svg('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + sc.toFixed(2) + ')' }, root);
      for (var k = 0; k < 5; k++) {
        var a = k * 1.2566;
        svg('circle', { cx: (Math.cos(a) * 3.4).toFixed(2), cy: (Math.sin(a) * 3.4).toFixed(2), r: 2.7, fill: '#fffaf0' }, f);
      }
      svg('circle', { r: 1.5, fill: '#e6d3a3' }, f);
    }
    stems.forEach(function (s) {
      svg('path', { d: 'M' + s.x0 + ',' + s.y0 + ' Q' + s.cx + ',' + s.cy + ' ' + s.x1 + ',' + s.y1, fill: 'none', stroke: '#7a6a45', 'stroke-width': 1.1, 'stroke-linecap': 'round' }, root);
    });
    stems.forEach(function (s) {
      for (var t = 0.18; t <= 1.001; t += 0.07) {
        var p = bez(s, t), side = rnd() < 0.5 ? -1 : 1, len = 5 + rnd() * 11;
        var ex = p[0] + side * len, ey = p[1] - 3 - rnd() * 6;
        svg('path', { d: 'M' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ' L' + ex.toFixed(1) + ',' + ey.toFixed(1), stroke: '#7a6a45', 'stroke-width': 0.7, fill: 'none' }, root);
        flower(ex, ey, 0.75 + rnd() * 0.55);
        if (rnd() < 0.5) flower(p[0] - side * 2, p[1] - 2, 0.6 + rnd() * 0.4);
      }
    });
    return root;
  }

  function buildCard(cfg, d) {
    var paper = el('div', 'paper');
    var i = 0;
    function add(node) { node.classList.add('rv'); node.style.setProperty('--i', i++); paper.appendChild(node); return node; }
    function divider() { var dv = el('div', 'divider'); dv.appendChild(el('i')); return dv; }

    add(buildEmblem(cfg));
    add(el('p', 'c-kicker', cfg.sarlavha || 'To‘y taklifnomasi'));
    add(el('h2', 'c-names', cfg.kuyov + ' ' + (cfg.belgi || '&') + ' ' + cfg.kelin));
    if (cfg.matn) add(el('p', 'c-text', cfg.matn));
    add(divider());

    if (d) {
      var w = el('div');
      w.appendChild(el('p', 'c-label', 'Sana'));
      w.appendChild(el('p', 'c-date', d.day + '-' + MONTHS[d.month - 1]));
      w.appendChild(el('p', 'c-sub', d.year + '-yil, ' + DAYS[d.weekday]));
      w.appendChild(el('p', 'c-sub', 'soat ' + d.hh + ':' + d.mm));
      add(w);
      add(divider());
    }

    if (cfg.tuyxona || cfg.manzil) {
      var v = el('div');
      v.appendChild(el('p', 'c-label', 'Manzil'));
      if (cfg.tuyxona) v.appendChild(el('p', 'c-venue', cfg.tuyxona));
      if (cfg.manzil) v.appendChild(el('p', 'c-addr', cfg.manzil));
      add(v);
    }
    if (cfg.xarita) {
      var m = el('a', 'btn', 'Xaritada ko‘rish');
      m.href = cfg.xarita; m.target = '_blank'; m.rel = 'noopener';
      add(m);
    }

    if (d) {
      add(divider());
      var tm = el('div', 'timer'); tm.id = 'timer';
      [['t-d', 'kun'], ['t-h', 'soat'], ['t-m', 'daqiqa'], ['t-s', 'soniya']].forEach(function (x) {
        var b = el('div'); var n = el('b', '', '0'); n.id = x[0];
        b.appendChild(n); b.appendChild(el('span', '', x[1])); tm.appendChild(b);
      });
      var tw = el('div'); tw.appendChild(el('p', 'c-label', 'To‘ygacha qoldi')); tw.appendChild(tm);
      add(tw);
    }

    if (cfg.suratlar && cfg.suratlar.length) {
      add(divider());
      var gl = el('div', 'gallery');
      cfg.suratlar.forEach(function (src) {
        var im = el('img'); im.src = src; im.alt = ''; im.loading = 'lazy'; gl.appendChild(im);
      });
      add(gl);
    }

    add(divider());
    add(el('p', 'c-end', cfg.yakun || 'Sizni kutib qolamiz!'));
    if (cfg.mezbonlar) add(el('p', 'c-hosts', cfg.mezbonlar));
    if (cfg.telefon) {
      var p = el('a', 'btn ghost', 'Qo‘ng‘iroq qilish: ' + cfg.telefon);
      p.href = 'tel:' + String(cfg.telefon).replace(/[^+\d]/g, '');
      add(p);
    }
    return paper;
  }

  var timerId = null;
  function startTimer(d) {
    if (!d) return;
    var box = $('timer'), nums = ['t-d', 't-h', 't-m', 't-s'].map($);
    function tick() {
      var s = Math.floor((d.time - Date.now()) / 1000);
      if (s <= 0) {
        box.innerHTML = '';
        box.style.display = 'block';
        box.appendChild(el('p', 'timer-done', 'To‘y kuni keldi!'));
        clearInterval(timerId);
        return;
      }
      nums[0].textContent = Math.floor(s / 86400);
      nums[1].textContent = Math.floor(s % 86400 / 3600);
      nums[2].textContent = Math.floor(s % 3600 / 60);
      nums[3].textContent = s % 60;
    }
    tick();
    timerId = setInterval(tick, 1000);
  }

  function init(cfg) {
    cfg.kuyov = cfg.kuyov || 'Kuyov';
    cfg.kelin = cfg.kelin || 'Kelin';
    var sep = cfg.belgi || '&';
    var title = cfg.sarlavha || 'To‘y taklifnomasi';
    var d = parseDate(cfg.sana);

    applyTheme(cfg);
    document.title = cfg.kuyov + ' ' + sep + ' ' + cfg.kelin + ' — taklifnoma';
    $('kicker').textContent = title;
    $('names').textContent = cfg.kuyov + ' ' + sep + ' ' + cfg.kelin;
    $('hint').textContent = cfg.ochish || 'Muhrni bosib oching';
    $('l-kicker').textContent = title;
    $('l-names').textContent = cfg.kuyov + ' ' + sep + ' ' + cfg.kelin;
    $('seal').appendChild(buildSeal(cfg));
    if (cfg.gul !== false) $('gul').appendChild(buildFlowers());
    $('card').appendChild(buildCard(cfg, d));

    var audio = null, btn = $('music');
    if (cfg.musiqa) {
      audio = new Audio(cfg.musiqa); audio.loop = true; audio.preload = 'none';
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
      btn.addEventListener('click', function () {
        if (audio.paused) { audio.play(); btn.classList.remove('off'); }
        else { audio.pause(); btn.classList.add('off'); }
      });
    }

    $('app').hidden = false;

    var slow = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    $('seal').addEventListener('click', function () {
      var env = $('env'), stage = $('stage');
      env.classList.add('is-open');
      stage.classList.add('is-opening');
      if (audio) { audio.play().catch(function () {}); btn.hidden = false; }
      setTimeout(function () { env.classList.add('is-out'); }, slow ? 1400 : 50);
      setTimeout(function () { stage.classList.add('is-gone'); }, slow ? 2300 : 100);
      setTimeout(function () {
        stage.hidden = true; $('card').hidden = false;
        document.body.classList.add('card-on');
        window.scrollTo(0, 0);
        startTimer(d);
      }, slow ? 2900 : 150);
    }, { once: true });
  }

  var DEFAULT_DATA = {
    sarlavha: "Nikoh to‘yiga taklifnoma",
    kuyov: "Sanjar",
    kelin: "Madinabonu",
    belgi: "&",
    ochish: "Muhrni bosib oching",
    matn: "Aziz mehmonimiz! Hayotimizdagi eng quvonchli kunda sizni o‘z davramizda ko‘rishdan behad xursand bo‘lamiz. Baxtli kunimizga marhamat qiling!",
    sana: "2026-12-25 18:00",
    tuyxona: "“Lazzat” tantanalar saroyi",
    manzil: "Samarqand sh., Amir Temur ko‘chasi 45-uy",
    xarita: "https://maps.google.com/",
    telefon: "+998901234567",
    rang: "yashil",
    ranglar: {},
    muhr: "harflar",
    gul: true,
    suratlar: [],
    musiqa: "music.mp3",
    yakun: "Sizni intizorlik bilan kutib qolamiz!",
    mezbonlar: "Hurmat bilan, Olimovlar oilasi"
  };

  var id = (new URLSearchParams(location.search).get('i') || '').replace(/[^a-z0-9_-]/gi, '');
  if (!id) {
    init(DEFAULT_DATA);
  } else {
    fetch('data/' + id + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(init)
      .catch(function () { init(DEFAULT_DATA); });
  }
})();
```[span_0](start_span)[span_0](end_span)

Endi nusxalab olib, GitHub'ga joylab ko'ring. Ishlayaptimi?
