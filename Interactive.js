/* ===================================================
   Interactive.js — AquaMind Interactive House
   =================================================== */

const IMAGE_W = 1013, IMAGE_H = 862, DEFAULT_PADDING = 0.18;

const rooms = [
  {
    id: 'bathroom', name: 'Bathroom 🚿', padding: 0.15,
    bbox: { x: 590, y: 348, w: 220, h: 160 },
    items: [
      { id: 'shower',  icon: '🚿', label: 'Shower',
        bbox: { x: 600, y: 376, w: 50, h: 80 },
        tipTitle: 'Shower',
        tip: 'Limit showers to 5 minutes instead of 15 — saves 25 gallons each time. Install a low-flow showerhead (2 gpm or less) to cut water use by 40% with no loss of pressure.' },
      { id: 'bathtub', icon: '🛁', label: 'Bathtub',
        bbox: { x: 595, y: 450, w: 128, h: 54 },
        tipTitle: 'Bathtub',
        tip: 'A full bath uses 36–50 gallons. Switching to a 5-minute shower saves roughly half that amount. If you do use the tub, fill it only halfway to cut water use significantly.' },
      { id: 'toilet',  icon: '🚽', label: 'Toilet',
        bbox: { x: 745, y: 430, w: 65, h: 70 },
        tipTitle: 'Toilet',
        tip: 'Older toilets use 6 gallons per flush. Replace with a WaterSense-certified dual-flush model (1.1–1.6 gal). Check for leaks — a silent leak can waste 200 gallons a day!' }
    ]
  },
  {
    id: 'kitchen', name: 'Kitchen 🍳', padding: 0.18,
    bbox: { x: 265, y: 522, w: 220, h: 160 },
    items: [
      { id: 'sink', icon: '🚰', label: 'Kitchen Tap',
        bbox: { x: 340, y: 580, w: 66, h: 35 },
        tipTitle: 'Kitchen Tap',
        tip: 'Turn off the tap while scrubbing dishes — saves 8 gallons a minute. Install a 1.5 gpm aerator to cut flow by 30% without any noticeable difference.' }
    ]
  },
  {
    id: 'garden', name: 'Garden 🌱', padding: 0.12,
    bbox: { x: 30, y: 680, w: 435, h: 145 },
    items: [
      { id: 'hose', icon: '💧', label: 'Garden Hose',
        bbox: { x: 190, y: 750, w: 180, h: 55 },
        tipTitle: 'Garden Hose',
        tip: 'Water in the early morning or after sunset to cut evaporation by 30%. Switch to drip irrigation to save up to 50% of outdoor water use.' }
    ]
  }
];

const roomDetailsData = {
  bathroom: {
    icon: '🚿', title: 'Bathroom', badge: '~120 L / day',
    sub: 'Highest water-use room in the home',
    footer: 'Bathroom habits account for over 35% of total home water use.',
    items: [
      { icon: '🚿', title: 'Shower',
        tip: 'A standard shower runs at ~8 L/min. Cutting from 15 to 5 minutes saves ~80 L per shower. A low-flow showerhead cuts use by 40% with no pressure loss.' },
      { icon: '🛁', title: 'Bathtub',
        tip: 'A full tub uses 140–200 L. Filling only halfway halves this instantly. Reserve baths for once or twice a week.' },
      { icon: '🚽', title: 'Toilet',
        tip: 'Upgrading to a WaterSense dual-flush toilet saves a family of four over 16,000 L per year. Always check for silent leaks.' }
    ]
  },
  kitchen: {
    icon: '🍳', title: 'Kitchen', badge: '~80 L / day',
    sub: 'Smart habits here save big every day',
    footer: 'A full dishwasher load uses 60% less water than hand-washing the same dishes.',
    items: [
      { icon: '🚰', title: 'Kitchen Tap',
        tip: 'Running the tap while washing dishes uses up to 40 L per session. Filling a basin drops this to just 5 L — an 87% reduction.' }
    ]
  },
  garden: {
    icon: '🌱', title: 'Garden', badge: '~100 L / day',
    sub: 'Outdoor watering can exceed all indoor use combined',
    footer: 'Drip irrigation delivers water directly to roots — cutting outdoor use by up to 50%.',
    items: [
      { icon: '💧', title: 'Garden Hose',
        tip: 'A garden hose flows at ~1000 L/hour. Switching to drip irrigation at the right time of day halves outdoor consumption and keeps plants healthier.' }
    ]
  }
};

/* ═══════════════════════════════════════
   EVERYTHING RUNS AFTER DOM IS READY
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── DOM refs ── */
  const stage         = document.getElementById('stage');
  const imgWrapper    = document.getElementById('imgWrapper');
  const overlayEl     = document.getElementById('overlayAreas');
  const itemLayer     = document.getElementById('itemLayer');
  const infoPanel     = document.getElementById('infoPanel');
  const panelName     = document.getElementById('panelRoomName');
  const panelItems    = document.getElementById('panelItems');
  const tipCard       = document.getElementById('tipCard');
  const tipTitle      = document.getElementById('tipTitle');
  const tipText       = document.getElementById('tipText');
  const resetBtn      = document.getElementById('resetBtn');
  const viewMoreBtn   = document.getElementById('viewMoreBtn');
  const roomDetailsEl = document.getElementById('roomDetails');

  let isZoomed    = false;
  let activeRoom  = null;
  let activeItem  = null;
  let currentZoom = { S: 1, tx: 0, ty: 0 };

  /* ══════════════════════════════
     HERO COUNTER ANIMATION
  ══════════════════════════════ */
  function animateCounter(el, target) {
    var duration = 1600;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* Use IntersectionObserver so counters animate when scrolled into view */
  var statEls = document.querySelectorAll('.ih-stat-num[data-target]');
  if (statEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target, parseInt(entry.target.getAttribute('data-target'), 10));
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statEls.forEach(function(el) { io.observe(el); });
    } else {
      statEls.forEach(function(el) {
        animateCounter(el, parseInt(el.getAttribute('data-target'), 10));
      });
    }
  }

  /* ══════════════════════════════
     HERO PARTICLES
  ══════════════════════════════ */
  var particlesEl = document.getElementById('particles');
  if (particlesEl) {
    for (var i = 0; i < 18; i++) {
      var p    = document.createElement('div');
      p.className = 'ih-particle';
      var size = Math.random() * 6 + 3;
      p.style.width            = size + 'px';
      p.style.height           = size + 'px';
      p.style.left             = (Math.random() * 100) + '%';
      p.style.top              = (Math.random() * 100) + '%';
      p.style.animationDuration= (Math.random() * 6 + 4) + 's';
      p.style.animationDelay   = (Math.random() * 4)     + 's';
      p.style.opacity          = (Math.random() * 0.5 + 0.2).toFixed(2);
      particlesEl.appendChild(p);
    }
  }

  /* ══════════════════════════════
     ZOOM MATH
  ══════════════════════════════ */
  function computeZoom(bbox, padding) {
    var sw  = stage.offsetWidth,  sh  = stage.offsetHeight;
    var scx = sw / IMAGE_W,       scy = sh / IMAGE_H;
    var rx  = bbox.x * scx,       ry  = bbox.y * scy;
    var rw  = bbox.w * scx,       rh  = bbox.h * scy;
    var ph  = rw * padding,       pv  = rh * padding;
    var padX = rx - ph,  padY = ry - pv;
    var padW = rw + ph*2, padH = rh + pv*2;
    var S   = Math.min(sw / padW, sh / padH);
    var cx  = padX + padW / 2,   cy  = padY + padH / 2;
    return { S: S, tx: sw/2 - cx*S, ty: sh/2 - cy*S };
  }

  function applyZoom(bbox, padding) {
    var z = computeZoom(bbox, padding);
    currentZoom = z;
    imgWrapper.style.transform = 'translate(' + z.tx + 'px, ' + z.ty + 'px) scale(' + z.S + ')';
    return z;
  }

  function imageToScreen(ix, iy, iw, ih) {
    var sw  = stage.offsetWidth,  sh  = stage.offsetHeight;
    var scx = sw / IMAGE_W,       scy = sh / IMAGE_H;
    var S = currentZoom.S, tx = currentZoom.tx, ty = currentZoom.ty;
    return {
      left:   ix * scx * S + tx,
      top:    iy * scy * S + ty,
      width:  iw * scx * S,
      height: ih * scy * S
    };
  }

  /* ══════════════════════════════
     ROOM OVERLAYS
  ══════════════════════════════ */
  function buildRoomOverlays() {
    overlayEl.innerHTML = '';
    var sw  = stage.offsetWidth,  sh  = stage.offsetHeight;
    var scx = sw / IMAGE_W,       scy = sh / IMAGE_H;

    rooms.forEach(function(room) {
      var div = document.createElement('div');
      div.className  = 'room-hit';
      div.dataset.id = room.id;
      div.style.left   = (room.bbox.x * scx) + 'px';
      div.style.top    = (room.bbox.y * scy) + 'px';
      div.style.width  = (room.bbox.w * scx) + 'px';
      div.style.height = (room.bbox.h * scy) + 'px';

      var tag = document.createElement('div');
      tag.className   = 'room-tag';
      tag.textContent = room.name;
      div.appendChild(tag);

      div.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isZoomed) zoomToRoom(room);
      });
      overlayEl.appendChild(div);
    });
  }

  /* ══════════════════════════════
     ITEM OVERLAYS
  ══════════════════════════════ */
  function makeItemDiv(item, idx, fadeIn) {
    var div = document.createElement('div');
    div.className  = 'item-hit' + (fadeIn ? '' : ' active');
    div.dataset.id = item.id;

    var pos = imageToScreen(item.bbox.x, item.bbox.y, item.bbox.w, item.bbox.h);
    div.style.left   = pos.left   + 'px';
    div.style.top    = pos.top    + 'px';
    div.style.width  = pos.width  + 'px';
    div.style.height = pos.height + 'px';
    if (fadeIn) div.style.transitionDelay = (0.45 + idx * 0.08) + 's';

    var inner = document.createElement('div'); inner.className = 'item-inner';
    var pulse = document.createElement('div'); pulse.className = 'item-pulse';
    var emoji = document.createElement('div'); emoji.className = 'item-emoji'; emoji.textContent = item.icon;
    var nm    = document.createElement('div'); nm.className    = 'item-name-label'; nm.textContent = item.label;

    inner.appendChild(pulse);
    inner.appendChild(emoji);
    div.appendChild(inner);
    div.appendChild(nm);

    div.addEventListener('click', function(e) { e.preventDefault(); selectItem(item); });
    return div;
  }

  function buildItemOverlays(room) {
    itemLayer.innerHTML = '';
    room.items.forEach(function(item, idx) {
      var div = makeItemDiv(item, idx, true);
      itemLayer.appendChild(div);
      requestAnimationFrame(function() { requestAnimationFrame(function() { div.classList.add('active'); }); });
    });
  }

  function buildItemOverlaysKeepSelected(selectedItem) {
    if (!activeRoom) return;
    itemLayer.innerHTML = '';
    activeRoom.items.forEach(function(item, idx) {
      var div = makeItemDiv(item, idx, false);
      if (item.id === selectedItem.id) div.classList.add('selected');
      itemLayer.appendChild(div);
    });
  }

  /* ══════════════════════════════
     ZOOM TO ROOM
  ══════════════════════════════ */
  function zoomToRoom(room) {
    isZoomed   = true;
    activeRoom = room;
    activeItem = null;

    applyZoom(room.bbox, room.padding != null ? room.padding : DEFAULT_PADDING);
    overlayEl.querySelectorAll('.room-hit').forEach(function(h) { h.style.pointerEvents = 'none'; });

    /* Side panel */
    panelName.textContent = room.name;
    panelItems.innerHTML  = '';
    room.items.forEach(function(item) {
      var btn = document.createElement('button');
      btn.className  = 'panel-item-btn';
      btn.dataset.id = item.id;
      btn.innerHTML  = '<span class="btn-icon">' + item.icon + '</span><span class="btn-label">' + item.label + '</span>';
      btn.addEventListener('click', function() { selectItem(item); });
      panelItems.appendChild(btn);
    });

    infoPanel.classList.add('visible');
    viewMoreBtn.classList.add('visible');
    renderDetails(room);

    setTimeout(function() { buildItemOverlays(room); }, 720);
  }

  /* ══════════════════════════════
     SELECT ITEM
  ══════════════════════════════ */
  function selectItem(item) {
    if (activeItem && activeItem.id === item.id) { reset(); return; }
    activeItem = item;

    panelItems.querySelectorAll('.panel-item-btn').forEach(function(b) {
      b.classList.toggle('selected', b.dataset.id === item.id);
    });
    itemLayer.querySelectorAll('.item-hit').forEach(function(d) {
      d.classList.toggle('selected', d.dataset.id === item.id);
    });

    applyZoom(item.bbox, 0.95);
    setTimeout(function() { buildItemOverlaysKeepSelected(item); }, 720);

    tipTitle.textContent = item.icon + '  ' + item.tipTitle;
    tipText.textContent  = item.tip;
    tipCard.classList.add('visible');
  }

  /* ══════════════════════════════
     RENDER VIEW MORE PANEL
  ══════════════════════════════ */
  function renderDetails(room) {
    var d = roomDetailsData[room.id];
    if (!d) return;
    roomDetailsEl.classList.remove('visible');

    var itemsHTML = d.items.map(function(it) {
      return '<div class="rd-item">' +
        '<div class="rd-item-icon">' + it.icon + '</div>' +
        '<div>' +
          '<div class="rd-item-title">' + it.title + '</div>' +
          '<div class="rd-item-tip">'   + it.tip   + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    roomDetailsEl.innerHTML =
      '<div class="rd-header">' +
        '<div class="rd-icon">'  + d.icon  + '</div>' +
        '<div>' +
          '<div class="rd-title">' + d.title + '</div>' +
          '<div class="rd-sub">'   + d.sub   + '</div>' +
        '</div>' +
        '<span class="rd-badge">' + d.badge + '</span>' +
      '</div>' +
      '<div class="rd-items">' + itemsHTML + '</div>' +
      '<div class="rd-footer"><div class="rd-footer-text">💡 ' + d.footer + '</div></div>';
  }

viewMoreBtn.addEventListener('click', function() {
  roomDetailsEl.classList.add('visible');
  setTimeout(function() {
    var top = roomDetailsEl.getBoundingClientRect().top + window.scrollY - 230;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }, 20);
});

// ==============================
//  DARK / LIGHT MODE 
// ==============================
themeToggle.addEventListener("click", () => {

    const currentTheme = htmlEl.getAttribute("data-theme");

    if (currentTheme === "light") {

        htmlEl.setAttribute("data-theme", "dark");

        themeToggle.classList.replace("fa-moon", "fa-sun");
    } else {

        htmlEl.setAttribute("data-theme", "light");

        themeToggle.classList.replace("fa-sun", "fa-moon");
    }
    

    localStorage.setItem("theme", htmlEl.getAttribute("data-theme"));
});


const savedTheme = localStorage.getItem("theme") || "dark";
htmlEl.setAttribute("data-theme", savedTheme);
if(savedTheme === "light") themeToggle.classList.replace("fa-sun", "fa-moon");

  /* ══════════════════════════════
     RESET
  ══════════════════════════════ */
  function reset() {
    currentZoom = { S: 1, tx: 0, ty: 0 };
    imgWrapper.style.transform = 'translate(0px, 0px) scale(1)';
    infoPanel.classList.remove('visible');
    tipCard.classList.remove('visible');
    itemLayer.innerHTML = '';
    viewMoreBtn.classList.remove('visible');
    roomDetailsEl.classList.remove('visible');
    isZoomed = false; activeRoom = null; activeItem = null;
    setTimeout(function() {
      overlayEl.querySelectorAll('.room-hit').forEach(function(h) { h.style.pointerEvents = 'all'; });
    }, 750);
  }

  resetBtn.addEventListener('click', reset);

  /* ══════════════════════════════
     NAVBAR SCROLL
  ══════════════════════════════ */
  window.addEventListener('scroll', function() {
    var nb = document.querySelector('.navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ══════════════════════════════
     RESIZE HANDLER
  ══════════════════════════════ */
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (isZoomed) { reset(); setTimeout(buildRoomOverlays, 800); }
      else buildRoomOverlays();
    }, 120);
  });

  /* ══════════════════════════════
     INIT
  ══════════════════════════════ */
  buildRoomOverlays();

}); /* end DOMContentLoaded */
