'use strict';

/* ============================================================
   LOADING SCREEN
============================================================ */
const loadFill = document.getElementById('loadFill');
const loadScreen = document.getElementById('loadingScreen');
let loadPct = 0;
const loadIv = setInterval(() => {
  loadPct += Math.random() * 22 + 5;
  if (loadPct >= 100) {
    loadPct = 100;
    clearInterval(loadIv);
    setTimeout(() => loadScreen.classList.add('out'), 300);
  }
  loadFill.style.width = Math.min(loadPct, 100) + '%';
}, 100);

/* ============================================================
   BLOCKCHAIN ENGINE
============================================================ */
class Block {
  constructor(index, data, prevHash = '0') {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.prevHash = prevHash;
    this.hash = '';
  }
}

class Blockchain {
  constructor() { this.chain = []; this._genesis(); }
  _genesis() {
    const b = new Block(0, { type: 'GENESIS', msg: 'StockChain Pro v2' }, '0'.repeat(64));
    b.hash = this._hash(b); this.chain.push(b);
  }
  _hash(b) {
    const s = b.index + b.timestamp + b.prevHash + JSON.stringify(b.data);
    let h = [0xdeadn, 0xbeefn, 0xcafen, 0xbaben];
    const P = [2654435761n, 2246822519n, 3266489917n, 668265263n];
    for (let i = 0; i < s.length; i++) {
      const c = BigInt(s.charCodeAt(i));
      h = h.map((v, j) => ((v ^ c) * P[j]) & 0xFFFFFFFFFFFFFFFFn);
    }
    for (let r = 0; r < 8; r++) h = h.map((v, j) => (v ^ (v >> 17n) ^ BigInt(r * 31 + j)) * P[j] & 0xFFFFFFFFFFFFFFFFn);
    return h.map(v => v.toString(16).padStart(16, '0')).join('');
  }
  add(data) {
    const prev = this.chain[this.chain.length - 1];
    const b = new Block(this.chain.length, data, prev.hash);
    b.hash = this._hash(b); this.chain.push(b); return b;
  }
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const c = this.chain[i], p = this.chain[i - 1];
      if (c.prevHash !== p.hash || c.hash !== this._hash(c)) return false;
    }
    return true;
  }
  short(h) { return h ? h.slice(0, 8) + '…' + h.slice(-6) : '—'; }
}

const bc = new Blockchain();

/* ============================================================
   DATA
============================================================ */
const CATS = { Electronics: '#6366f1', Office: '#10b981', Furniture: '#f59e0b', Tools: '#ef4444', Consumables: '#8b5cf6' };
const CATS_TH = { Electronics: 'อิเล็กทรอนิกส์', Office: 'สำนักงาน', Furniture: 'เฟอร์นิเจอร์', Tools: 'เครื่องมือ', Consumables: 'วัสดุสิ้นเปลือง' };

const inventory = [
  { id: 1,  sku: 'SKU-001', name: 'MacBook Pro 14"',      category: 'Electronics', qty: 15, reorder: 5,  price: 65000 },
  { id: 2,  sku: 'SKU-002', name: 'Dell Monitor 27"',     category: 'Electronics', qty: 28, reorder: 8,  price: 12500 },
  { id: 3,  sku: 'SKU-003', name: 'กระดาษ A4 (รีม)',      category: 'Office',      qty: 4,  reorder: 20, price: 120   },
  { id: 4,  sku: 'SKU-004', name: 'เก้าอี้สำนักงาน',      category: 'Furniture',   qty: 12, reorder: 3,  price: 8500  },
  { id: 5,  sku: 'SKU-005', name: 'ปากกาลูกลื่น (กล่อง)', category: 'Consumables', qty: 3,  reorder: 10, price: 150   },
  { id: 6,  sku: 'SKU-006', name: 'iPhone 15 Pro',        category: 'Electronics', qty: 8,  reorder: 5,  price: 42000 },
  { id: 7,  sku: 'SKU-007', name: 'โต๊ะทำงาน',            category: 'Furniture',   qty: 6,  reorder: 2,  price: 15000 },
  { id: 8,  sku: 'SKU-008', name: 'ไขควงชุด',             category: 'Tools',       qty: 20, reorder: 5,  price: 350   },
  { id: 9,  sku: 'SKU-009', name: 'หมึกพิมพ์ Canon',      category: 'Consumables', qty: 2,  reorder: 8,  price: 450   },
  { id: 10, sku: 'SKU-010', name: 'Keyboard Wireless',    category: 'Electronics', qty: 35, reorder: 10, price: 2200  },
  { id: 11, sku: 'SKU-011', name: 'กระดาน Whiteboard',    category: 'Office',      qty: 5,  reorder: 2,  price: 3500  },
  { id: 12, sku: 'SKU-012', name: 'สว่านไฟฟ้า',           category: 'Tools',       qty: 7,  reorder: 3,  price: 5800  },
];

const transactions = [];
const suppliers = [
  { name: 'Tech Import Co.', cat: 'Electronics', email: 'techimport@email.com', phone: '02-111-2222', rating: 5, products: 45 },
  { name: 'Office Mart',     cat: 'Office',      email: 'officemart@email.com', phone: '02-333-4444', rating: 4, products: 120 },
  { name: 'Furniture Plus',  cat: 'Furniture',   email: 'furplus@email.com',    phone: '02-555-6666', rating: 4, products: 38 },
  { name: 'Tools & More',    cat: 'Tools',       email: 'toolsmore@email.com',  phone: '02-777-8888', rating: 5, products: 67 },
  { name: 'Supplies Hub',    cat: 'Consumables', email: 'supplies@email.com',   phone: '02-999-0000', rating: 3, products: 200 },
];

// Seed blockchain
[
  { type:'IN',     product:'MacBook Pro 14"',   qty:15, value:975000, operator:'System',  sku:'SKU-001', daysAgo:5 },
  { type:'IN',     product:'Dell Monitor 27"',  qty:28, value:350000, operator:'System',  sku:'SKU-002', daysAgo:4 },
  { type:'OUT',    product:'กระดาษ A4 (รีม)',   qty:10, value:1200,   operator:'คลัง-01', sku:'SKU-003', daysAgo:3 },
  { type:'IN',     product:'iPhone 15 Pro',     qty:8,  value:336000, operator:'System',  sku:'SKU-006', daysAgo:2 },
  { type:'ADJUST', product:'ปากกาลูกลื่น',       qty:3,  value:450,   operator:'ผู้จัดการ', sku:'SKU-005', daysAgo:1 },
].forEach((s, i) => {
  const txId = 'TX-' + String(1001 + i).padStart(6, '0');
  const { daysAgo, ...data } = s;
  const block = bc.add({ txId, ...data });
  transactions.push({ txId, ...data, time: new Date(Date.now() - daysAgo * 86400000).toISOString(), hash: block.hash, blockIndex: block.index });
});

/* ============================================================
   HELPERS
============================================================ */
const $ = id => document.getElementById(id);
const fmtMoney = n => '฿' + Number(n || 0).toLocaleString();
const fmtTime = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }) + ' ' +
         d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};
const typeIcon = { IN: '↑', OUT: '↓', ADJUST: '⟳' };
const typeBg   = { IN: 'rgba(16,185,129,.15)',  OUT: 'rgba(239,68,68,.15)',  ADJUST: 'rgba(245,158,11,.15)' };
const typeClr  = { IN: 'var(--green)',           OUT: 'var(--red)',           ADJUST: 'var(--yellow)' };
const typeLbl  = { IN: '▲ รับเข้า',             OUT: '▼ จ่ายออก',           ADJUST: '⟳ ปรับปรุง' };
const typeCls  = { IN: 'b-in',                   OUT: 'b-out',               ADJUST: 'b-adj' };
function stockStatus(item) {
  if (item.qty <= 0)               return { label: 'หมด',      cls: 'b-low' };
  if (item.qty < item.reorder)     return { label: 'ใกล้หมด',  cls: 'b-low' };
  if (item.qty < item.reorder * 2) return { label: 'ปกติ',     cls: 'b-mid' };
  return { label: 'เพียงพอ', cls: 'b-ok' };
}
function stockBarColor(item) {
  if (item.qty < item.reorder) return 'var(--red)';
  if (item.qty < item.reorder * 2) return 'var(--yellow)';
  return 'var(--green)';
}
function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

/* ============================================================
   NAVIGATION
============================================================ */
const PAGE_TITLES = {
  dashboard: 'แดชบอร์ด', inventory: 'สินค้าคงคลัง', transactions: 'ธุรกรรม',
  blockchain: 'Blockchain Ledger', suppliers: 'ผู้จัดจำหน่าย', reports: 'รายงาน', alerts: 'การแจ้งเตือน'
};

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-item, .bn-item').forEach(el => el.classList.remove('active'));
  const pg = $('page-' + page); if (pg) pg.classList.add('active');
  document.querySelectorAll(`[data-page="${page}"]`).forEach(el => el.classList.add('active'));
  $('pageTitle').textContent = PAGE_TITLES[page] || page;
  closeSidebar(); closeSearch();
  const renders = { inventory: renderInventory, transactions: renderTransactions, blockchain: renderBlockchain, suppliers: renderSuppliers, alerts: renderAlerts };
  if (renders[page]) renders[page]();
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); if (el.dataset.page) navigateTo(el.dataset.page); });
});

/* ============================================================
   SIDEBAR
============================================================ */
const sidebar = $('sidebar'), overlay = $('overlay');
function openSidebar() {
  sidebar.classList.add('open');
  overlay.style.display = 'block';
  requestAnimationFrame(() => overlay.classList.add('show'));
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  setTimeout(() => { if (!overlay.classList.contains('show')) overlay.style.display = 'none'; }, 200);
}
$('tbMenu').addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
$('sbClose').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Swipe to open sidebar
let swipeX0 = 0;
document.addEventListener('touchstart', e => { swipeX0 = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - swipeX0;
  if (swipeX0 < 20 && dx > 55) openSidebar();
  if (dx < -55 && sidebar.classList.contains('open')) closeSidebar();
}, { passive: true });

/* ============================================================
   THEME
============================================================ */
$('themeBtn').addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? '' : 'light';
  document.querySelector('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'light' ? '#f0f0f6' : '#0f0f13';
});

/* ============================================================
   CLOCK
============================================================ */
function tick() {
  const now = new Date();
  $('liveClock').textContent = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
tick(); setInterval(tick, 1000);

/* ============================================================
   MOBILE SEARCH TOGGLE
============================================================ */
const mobileSearch = $('mobileSearch');
$('mobileSearchBtn').addEventListener('click', () => {
  mobileSearch.classList.add('open');
  $('mobileSearchInput').focus();
});
$('mobileSearchClose').addEventListener('click', () => {
  mobileSearch.classList.remove('open');
  $('mobileSearchInput').value = '';
  closeSearch();
});

/* ============================================================
   GLOBAL SEARCH (เชื่อมต่อทั้ง desktop และ mobile)
============================================================ */
const searchResults = $('searchResults');

function doSearch(q) {
  q = q.trim();
  if (!q) { closeSearch(); return; }

  const results = [];

  // Search inventory
  inventory.forEach(item => {
    const nameMatch = item.name.toLowerCase().includes(q.toLowerCase());
    const skuMatch  = item.sku.toLowerCase().includes(q.toLowerCase());
    const catMatch  = (CATS_TH[item.category] || '').includes(q);
    if (nameMatch || skuMatch || catMatch) {
      results.push({ type: 'product', item, match: nameMatch ? item.name : item.sku });
    }
  });

  // Search transactions
  transactions.forEach(tx => {
    const prodMatch = (tx.product || '').toLowerCase().includes(q.toLowerCase());
    const txMatch   = tx.txId.toLowerCase().includes(q.toLowerCase());
    if (prodMatch || txMatch) {
      results.push({ type: 'tx', item: tx, match: prodMatch ? tx.product : tx.txId });
    }
  });

  renderSearchResults(results, q);
}

function renderSearchResults(results, q) {
  searchResults.innerHTML = '';
  if (!results.length) {
    searchResults.innerHTML = `<div class="sr-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      ไม่พบผลลัพธ์สำหรับ "<strong>${q}</strong>"</div>`;
    searchResults.classList.add('open');
    return;
  }

  const prods = results.filter(r => r.type === 'product');
  const txs   = results.filter(r => r.type === 'tx');

  if (prods.length) {
    searchResults.innerHTML += `<div class="sr-header">สินค้า (${prods.length})</div>`;
    prods.slice(0, 5).forEach(r => {
      const { item } = r;
      const color = CATS[item.category] || '#6366f1';
      const st = stockStatus(item);
      const div = document.createElement('div');
      div.className = 'sr-item';
      div.innerHTML = `
        <div class="sr-icon" style="background:${color}20;color:${color}">📦</div>
        <div class="sr-info">
          <div class="sr-name">${highlight(item.name, q)}</div>
          <div class="sr-meta">${item.sku} · ${CATS_TH[item.category]} · คงเหลือ ${item.qty}</div>
        </div>
        <span class="badge ${st.cls}" style="flex-shrink:0">${st.label}</span>`;
      div.addEventListener('click', () => { navigateTo('inventory'); closeSearch(); });
      searchResults.appendChild(div);
    });
  }

  if (txs.length) {
    const hdr = document.createElement('div');
    hdr.className = 'sr-header';
    hdr.textContent = `ธุรกรรม (${txs.length})`;
    searchResults.appendChild(hdr);
    txs.slice(0, 4).forEach(r => {
      const { item } = r;
      const div = document.createElement('div');
      div.className = 'sr-item';
      div.innerHTML = `
        <div class="sr-icon" style="background:${typeBg[item.type]};color:${typeClr[item.type]};font-weight:700">${typeIcon[item.type]}</div>
        <div class="sr-info">
          <div class="sr-name">${highlight(item.product || item.txId, q)}</div>
          <div class="sr-meta">${item.txId} · ${fmtMoney(item.value)} · ${fmtTime(item.time)}</div>
        </div>
        <span class="badge ${typeCls[item.type]}" style="flex-shrink:0">${typeLbl[item.type]}</span>`;
      div.addEventListener('click', () => { navigateTo('transactions'); closeSearch(); });
      searchResults.appendChild(div);
    });
  }

  searchResults.classList.add('open');
}

function closeSearch() {
  searchResults.classList.remove('open');
}

// Desktop search input
$('globalSearch').addEventListener('input', e => doSearch(e.target.value));
$('globalSearch').addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); e.target.value = ''; } });

// Mobile search input
$('mobileSearchInput').addEventListener('input', e => doSearch(e.target.value));
$('mobileSearchInput').addEventListener('keydown', e => { if (e.key === 'Escape') { mobileSearch.classList.remove('open'); closeSearch(); } });

// Inventory page search (live filter)
$('invSearch').addEventListener('input', filterInventory);
$('catFilter').addEventListener('change', filterInventory);

// Transactions page search (live filter)
$('txSearch').addEventListener('input', filterTransactions);

// Close search on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#searchResults') && !e.target.closest('#searchWrap') && !e.target.closest('#mobileSearch')) {
    closeSearch();
  }
});

/* ============================================================
   KPI COUNTERS
============================================================ */
document.querySelectorAll('.kpi-num').forEach(el => {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const isLarge = target > 10000;
  const dur = 1300, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const v = Math.round(ease * target);
    el.textContent = prefix + (isLarge ? v.toLocaleString() : v);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
});

/* ============================================================
   CHARTS
============================================================ */
// Donut
const donutColors = Object.values(CATS);
const donutKeys   = Object.keys(CATS);
const donutData   = [85, 60, 30, 45, 28];
const donutCtx    = $('donutChart')?.getContext('2d');
if (donutCtx) {
  new Chart(donutCtx, {
    type: 'doughnut',
    data: { labels: donutKeys, datasets: [{ data: donutData, backgroundColor: donutColors, borderWidth: 0, hoverOffset: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '73%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${CATS_TH[ctx.label]}: ${ctx.parsed}` } } }, animation: { animateScale: true } }
  });
  const leg = $('donutLegend');
  donutKeys.forEach((k, i) => {
    const el = document.createElement('div');
    el.className = 'dl-item';
    el.innerHTML = `<div class="dl-dot" style="background:${donutColors[i]}"></div><span class="dl-name">${CATS_TH[k]}</span><span class="dl-val">${donutData[i]}</span>`;
    leg.appendChild(el);
  });
}

// Line chart
const labels30 = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (29 - i)); return d.getDate() + '/' + (d.getMonth() + 1); });
const inData   = labels30.map(() => Math.floor(Math.random() * 40 + 10));
const outData  = labels30.map(() => Math.floor(Math.random() * 30 + 5));
const lineCtx  = $('lineChart')?.getContext('2d');
if (lineCtx) {
  new Chart(lineCtx, {
    type: 'line',
    data: { labels: labels30, datasets: [
      { label: 'รับเข้า',  data: inData,  borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.2 },
      { label: 'จ่ายออก', data: outData, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)',  fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.2 }
    ]},
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#8888a8', font: { size: 10 }, usePointStyle: true } } },
      scales: {
        x: { ticks: { color: '#8888a8', font: { size: 9 }, maxTicksLimit: 7 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8888a8', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function setPeriod(btn, _) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ============================================================
   3D BAR CHART
============================================================ */
(function init3D() {
  const wrap = $('threeWrap');
  if (!wrap || !window.THREE) return;
  const W = wrap.clientWidth, H = wrap.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, W / H, 0.1, 200);
  cam.position.set(0, 8, 17);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(10, 20, 10); scene.add(dir);
  const pl1 = new THREE.PointLight(0x6366f1, 3, 30); pl1.position.set(-5, 10, 0); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x10b981, 3, 30); pl2.position.set(5, 10, 0); scene.add(pl2);
  scene.add(new THREE.GridHelper(20, 20, 0x333355, 0x1f1f2e));

  const bars = [
    { v: 85, c: 0x6366f1, lbl: 'อิเล็กฯ' }, { v: 60, c: 0x10b981, lbl: 'สำนักงาน' },
    { v: 30, c: 0xf59e0b, lbl: 'เฟอร์นิ' }, { v: 45, c: 0xef4444, lbl: 'เครื่องมือ' },
    { v: 28, c: 0x8b5cf6, lbl: 'วัสดุฯ' },
  ];
  const maxV = Math.max(...bars.map(b => b.v));
  const gap = 3, total = (bars.length - 1) * gap;
  const risers = [];

  bars.forEach((b, i) => {
    const h = (b.v / maxV) * 7 + 0.2, x = i * gap - total / 2;
    const geo = new THREE.BoxGeometry(1.8, h, 1.8);
    const mat = new THREE.MeshPhongMaterial({ color: b.c, emissive: b.c, emissiveIntensity: 0.12, shininess: 60 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0, 0); mesh.userData.ty = h / 2;
    scene.add(mesh); risers.push(mesh);

    const capG = new THREE.BoxGeometry(1.95, 0.1, 1.95);
    const capM = new THREE.MeshPhongMaterial({ color: b.c, emissive: b.c, emissiveIntensity: 0.7 });
    const cap  = new THREE.Mesh(capG, capM);
    cap.position.set(x, 0, 0); cap.userData.ty = h;
    scene.add(cap); risers.push(cap);
  });

  // legend chips
  const legEl = $('threeLegend');
  if (legEl) bars.forEach(b => {
    const el = document.createElement('div');
    el.className = 'tl-item';
    el.innerHTML = `<div class="tl-dot" style="background:#${b.c.toString(16).padStart(6,'0')}"></div><span>${b.lbl}: ${b.v}</span>`;
    legEl.appendChild(el);
  });

  // Drag orbit
  let theta = 0, dragging = false, lastX = 0;
  wrap.addEventListener('mousedown',  e => { dragging = true;  lastX = e.clientX; }, { passive: true });
  wrap.addEventListener('touchstart', e => { dragging = true;  lastX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('mouseup',  () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });
  window.addEventListener('mousemove', e => { if (dragging) { theta += (e.clientX - lastX) * 0.009; lastX = e.clientX; } });
  window.addEventListener('touchmove', e => { if (dragging) { theta += (e.touches[0].clientX - lastX) * 0.009; lastX = e.touches[0].clientX; } }, { passive: true });

  let elapsed = 0, last = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    const dt = Math.min((t - last) / 1000, 0.05); last = t; elapsed += dt;
    const ease = elapsed < 1.5 ? 1 - Math.pow(1 - Math.min(elapsed / 1.5, 1), 4) : 1;
    risers.forEach(r => { r.position.y = r.userData.ty * ease; });
    if (!dragging) theta += 0.005;
    const R = 17;
    cam.position.x = Math.sin(theta) * R; cam.position.z = Math.cos(theta) * R;
    cam.lookAt(0, 3, 0);
    pl1.intensity = 2.5 + Math.sin(t * 0.0015) * 0.8;
    pl2.intensity = 2.5 + Math.cos(t * 0.0015) * 0.8;
    renderer.render(scene, cam);
  }
  animate(0);

  window.addEventListener('resize', () => {
    const nW = wrap.clientWidth, nH = wrap.clientHeight;
    cam.aspect = nW / nH; cam.updateProjectionMatrix(); renderer.setSize(nW, nH);
  });
})();

/* ============================================================
   BLOCKCHAIN MINI (dashboard)
============================================================ */
function renderBcMini() {
  const el = $('bcMini'); if (!el) return;
  el.innerHTML = '';
  [...bc.chain].slice(-5).reverse().forEach(block => {
    const t = new Date(block.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const label = block.index === 0 ? 'Genesis Block' : `${block.data.type} — ${block.data.product || ''}`;
    const div = document.createElement('div');
    div.className = 'bc-mi';
    div.innerHTML = `<div class="bc-mi-idx">${block.index}</div><div class="bc-mi-info"><div class="bc-mi-hash">${bc.short(block.hash)}</div><div class="bc-mi-t">${label} · ${t}</div></div><div class="bc-mi-ok">✓</div>`;
    el.appendChild(div);
  });
}
renderBcMini();

/* ============================================================
   RECENT TRANSACTIONS (dashboard)
============================================================ */
function renderRecent() {
  const recent = transactions.slice(-8).reverse();

  // Desktop table
  const tbody = $('recentTbody');
  if (tbody) tbody.innerHTML = recent.map(tx => `<tr>
    <td style="font-family:monospace;font-size:.76rem;color:var(--primary)">${tx.txId}</td>
    <td><strong>${tx.product || '—'}</strong></td>
    <td><span class="badge ${typeCls[tx.type]}">${typeLbl[tx.type]}</span></td>
    <td>${tx.qty || '—'}</td>
    <td>${fmtMoney(tx.value)}</td>
    <td style="font-size:.74rem;color:var(--text2)">${fmtTime(tx.time)}</td>
    <td class="hash-mono" title="${tx.hash}">${bc.short(tx.hash)}</td>
    <td><span class="badge b-ok2">✓ ยืนยัน</span></td>
  </tr>`).join('');

  // Mobile list
  const list = $('recentTxList');
  if (list) list.innerHTML = recent.map(tx => `
    <div class="tx-row">
      <div class="tx-ico" style="background:${typeBg[tx.type]};color:${typeClr[tx.type]}">${typeIcon[tx.type]}</div>
      <div class="tx-info">
        <div class="tx-prod">${tx.product || '—'}</div>
        <div class="tx-hash">${bc.short(tx.hash)}</div>
      </div>
      <div class="tx-right">
        <div class="tx-val" style="color:${typeClr[tx.type]}">${tx.type === 'OUT' ? '-' : '+'}${fmtMoney(tx.value)}</div>
        <div class="tx-time">${fmtTime(tx.time)}</div>
      </div>
    </div>`).join('');
}
renderRecent();

/* ============================================================
   INVENTORY PAGE
============================================================ */
function renderInventory(data) {
  const items = data || inventory;
  const bar = $('invResultBar');
  if (bar) bar.textContent = data ? `พบ ${items.length} รายการ` : '';

  // Desktop
  const tbody = $('invTbody');
  if (tbody) tbody.innerHTML = items.map(item => {
    const st  = stockStatus(item);
    const pct = Math.min((item.qty / (item.reorder * 3)) * 100, 100);
    const bc2 = stockBarColor(item);
    return `<tr>
      <td style="font-family:monospace;font-size:.75rem;color:var(--text2)">${item.sku}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="badge" style="background:${CATS[item.category]}18;color:${CATS[item.category]}">${CATS_TH[item.category]}</span></td>
      <td><strong>${item.qty}</strong><span class="sbar"><span class="sbar-f" style="width:${pct}%;background:${bc2}"></span></span></td>
      <td>${item.reorder}</td>
      <td>${fmtMoney(item.price)}</td>
      <td>${fmtMoney(item.qty * item.price)}</td>
      <td><span class="badge ${st.cls}">${st.label}</span></td>
      <td><div class="act-btns">
        <button class="act-btn" onclick="showToast('info','แก้ไขสินค้า','${item.name}')" title="แก้ไข"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="act-btn del" onclick="deleteItem(${item.id})" title="ลบ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
      </div></td>
    </tr>`;
  }).join('');

  // Mobile cards
  const cards = $('invCards');
  if (cards) cards.innerHTML = items.map(item => {
    const st  = stockStatus(item);
    const pct = Math.min((item.qty / (item.reorder * 3)) * 100, 100);
    const bc2 = stockBarColor(item);
    return `<div class="inv-card">
      <div class="inv-card-top">
        <div>
          <div class="inv-card-name">${item.name}</div>
          <div class="inv-card-sku">${item.sku}</div>
        </div>
        <span class="badge ${st.cls}">${st.label}</span>
      </div>
      <div class="inv-card-grid">
        <div class="inv-cf"><span class="inv-cf-l">หมวดหมู่</span><span class="inv-cf-v" style="color:${CATS[item.category]}">${CATS_TH[item.category]}</span></div>
        <div class="inv-cf"><span class="inv-cf-l">ราคา/หน่วย</span><span class="inv-cf-v">${fmtMoney(item.price)}</span></div>
        <div class="inv-cf"><span class="inv-cf-l">จุดสั่งซื้อ</span><span class="inv-cf-v">${item.reorder}</span></div>
        <div class="inv-cf"><span class="inv-cf-l">มูลค่ารวม</span><span class="inv-cf-v">${fmtMoney(item.qty * item.price)}</span></div>
      </div>
      <div class="inv-card-bot">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="inv-qty">${item.qty}</span>
          <span class="sbar" style="width:90px"><span class="sbar-f" style="width:${pct}%;background:${bc2}"></span></span>
        </div>
        <div class="act-btns">
          <button class="act-btn" onclick="showToast('info','แก้ไข','${item.name}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="act-btn del" onclick="deleteItem(${item.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterInventory() {
  const q   = ($('invSearch')?.value || '').toLowerCase().trim();
  const cat = $('catFilter')?.value || '';
  const filtered = inventory.filter(item =>
    (!q   || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)) &&
    (!cat || item.category === cat)
  );
  renderInventory(filtered);
}

function deleteItem(id) {
  if (!confirm('ยืนยันการลบสินค้านี้?')) return;
  const idx = inventory.findIndex(i => i.id === id);
  if (idx < 0) return;
  const item = inventory.splice(idx, 1)[0];
  const block = bc.add({ type: 'DELETE', product: item.name, sku: item.sku, operator: 'Admin' });
  showToast('success', 'ลบแล้ว', `${item.name} — Block #${block.index}`);
  renderInventory(); renderBcMini(); updateBcStats();
  $('sbInvCount').textContent = inventory.length;
}

/* ============================================================
   TRANSACTIONS PAGE
============================================================ */
function renderTransactions(data) {
  const items = data || transactions;
  const all = [...items].reverse();

  // Desktop
  const tbody = $('txTbody');
  if (tbody) tbody.innerHTML = all.map(tx => `<tr>
    <td style="font-family:monospace;font-size:.74rem;color:var(--primary)">${tx.txId}</td>
    <td><strong>${tx.product || '—'}</strong></td>
    <td><span class="badge ${typeCls[tx.type]}">${typeLbl[tx.type]}</span></td>
    <td>${tx.qty || '—'}</td>
    <td>${fmtMoney(tx.value)}</td>
    <td style="font-size:.75rem">${tx.operator || '—'}</td>
    <td style="font-size:.74rem;color:var(--text2)">${fmtTime(tx.time)}</td>
    <td class="hash-mono" title="${tx.hash}">${bc.short(tx.hash)}</td>
    <td><span class="badge b-ok2">✓ บนเชน</span></td>
  </tr>`).join('');

  // Mobile
  const mlist = $('txMobileList');
  if (mlist) mlist.innerHTML = all.map(tx => `
    <div class="tx-row">
      <div class="tx-ico" style="background:${typeBg[tx.type]};color:${typeClr[tx.type]}">${typeIcon[tx.type]}</div>
      <div class="tx-info">
        <div class="tx-prod">${tx.product || '—'}</div>
        <div class="tx-hash">${tx.txId} · ${bc.short(tx.hash)}</div>
      </div>
      <div class="tx-right">
        <div class="tx-val" style="color:${typeClr[tx.type]}">${fmtMoney(tx.value)}</div>
        <div class="tx-time">${fmtTime(tx.time)}</div>
      </div>
    </div>`).join('');
}

function filterTransactions() {
  const q = ($('txSearch')?.value || '').toLowerCase().trim();
  if (!q) { renderTransactions(); return; }
  const filtered = transactions.filter(tx =>
    (tx.product || '').toLowerCase().includes(q) ||
    tx.txId.toLowerCase().includes(q) ||
    (tx.operator || '').toLowerCase().includes(q)
  );
  renderTransactions(filtered);
}

/* ============================================================
   BLOCKCHAIN PAGE
============================================================ */
function renderBlockchain() {
  updateBcStats();
  const chain = $('bcChain'); if (!chain) return;
  chain.innerHTML = '';
  [...bc.chain].reverse().forEach((block, ri) => {
    const isGen = block.index === 0;
    const wrapper = document.createElement('div');
    wrapper.className = 'bc-block' + (isGen ? ' bc-genesis' : '');
    const dataStr = isGen
      ? `<strong>Genesis Block</strong> — จุดเริ่มต้นของ Blockchain`
      : `<strong>${block.data.type}</strong> — ${block.data.product || ''} | จำนวน: ${block.data.qty || '—'} | มูลค่า: ${fmtMoney(block.data.value)} | โดย: ${block.data.operator || '—'}`;
    wrapper.innerHTML = `
      <div class="bc-line-wrap">
        <div class="bc-node"></div>
        ${ri < bc.chain.length - 1 ? '<div class="bc-vline"></div>' : ''}
      </div>
      <div class="bc-bcard">
        <div class="bc-btop">
          <span class="bc-bidx">#${block.index}</span>
          <span class="bc-btype ${isGen ? 'gen' : ''}">${isGen ? 'GENESIS' : block.data.type}</span>
          <span class="bc-btime">${fmtTime(block.timestamp)}</span>
        </div>
        <div class="bc-hrow"><span class="bc-hlbl">Hash:</span><span class="bc-hval">${block.hash}</span></div>
        <div class="bc-hrow"><span class="bc-hlbl">Prev Hash:</span><span class="bc-hval prev">${block.prevHash}</span></div>
        <div class="bc-bdata">${dataStr}</div>
      </div>`;
    chain.appendChild(wrapper);
  });
}

function updateBcStats() {
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set('bcTotal', bc.chain.length);
  set('bcTxCount', bc.chain.length - 1);
  const ok = bc.isValid();
  const el = $('bcValid');
  if (el) { el.textContent = ok ? '✓ ถูกต้อง' : '✗ ผิดปกติ'; el.style.color = ok ? 'var(--green)' : 'var(--red)'; }
}

function verifyChain() {
  const ok = bc.isValid();
  showToast(ok ? 'success' : 'error', ok ? 'Chain ถูกต้องสมบูรณ์' : 'พบความผิดปกติ!',
    ok ? `${bc.chain.length} บล็อกผ่าน SHA-256 ทั้งหมด` : 'บางบล็อกถูกแก้ไข!');
}

/* ============================================================
   SUPPLIERS
============================================================ */
function renderSuppliers() {
  const grid = $('supGrid'); if (!grid) return;
  const colors = Object.values(CATS);
  grid.innerHTML = suppliers.map((s, i) => `
    <div class="sup-card">
      <div style="display:flex;align-items:center;gap:11px">
        <div class="sup-av" style="background:linear-gradient(135deg,${colors[i%5]},${colors[(i+1)%5]})">${s.name[0]}</div>
        <div><div class="sup-name">${s.name}</div><div style="font-size:.7rem;color:${colors[i%5]};font-weight:600;margin-top:2px">${CATS_TH[s.cat]||s.cat}</div></div>
      </div>
      <div class="sup-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${s.email}</div>
      <div class="sup-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>${s.phone}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="sup-stars">${'⭐'.repeat(s.rating)}${'☆'.repeat(5-s.rating)}</div>
        <span style="font-size:.74rem;color:var(--text2)">${s.products} รายการ</span>
      </div>
    </div>`).join('');
}

/* ============================================================
   ALERTS
============================================================ */
function renderAlerts() {
  const list = $('alertsList'); if (!list) return;
  const lowStock = inventory.filter(i => i.qty < i.reorder);
  const items = [
    ...lowStock.map(item => ({ type: 'red', title: `สินค้าใกล้หมด: ${item.name}`, desc: `คงเหลือ ${item.qty} ชิ้น | จุดสั่งซื้อ ${item.reorder} | ${item.sku}`, time: 'เมื่อกี้' })),
    { type: 'yellow', title: 'ธุรกรรมรอการอนุมัติ', desc: '2 รายการรอการตรวจสอบจากผู้จัดการ', time: '5 นาที' },
    { type: 'yellow', title: 'Blockchain Sync', desc: `กำลังซิงค์ ${bc.chain.length} บล็อกกับ Node สำรอง`, time: '12 นาที' },
  ];
  list.innerHTML = items.map(a => `
    <div class="al-item">
      <div class="al-ico ${a.type}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${a.type === 'red' ? '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
        </svg>
      </div>
      <div class="al-info"><div class="al-title">${a.title}</div><div class="al-desc">${a.desc}</div></div>
      <span class="al-time">${a.time}</span>
    </div>`).join('');
  $('alertBadge').textContent = items.length;
}

/* ============================================================
   MODALS
============================================================ */
function openAddModal() {
  ['fName','fSku','fPrice','fQty','fReorder'].forEach(id => { const el = $(id); if (el) el.value = ''; });
  openModal('addModal');
}
function openTxModal() {
  const sel = $('txProduct');
  if (sel) sel.innerHTML = inventory.map(i => `<option value="${i.id}">${i.name} (${i.sku})</option>`).join('');
  ['txQty','txPrice','txNote'].forEach(id => { const el = $(id); if (el) el.value = ''; });
  openModal('txModal');
}
function openModal(id) { const el = $(id); if (!el) return; el.classList.add('open'); setTimeout(() => el.querySelector('input,select')?.focus(), 100); }
function closeModal(id) { $(id)?.classList.remove('open'); }

document.querySelectorAll('.modal-bg').forEach(bg => bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); }));

function saveProduct() {
  const name    = $('fName').value.trim();
  const sku     = $('fSku').value.trim();
  if (!name || !sku) { showToast('error', 'ข้อมูลไม่ครบ', 'กรุณากรอกชื่อสินค้าและ SKU'); return; }
  const price   = parseFloat($('fPrice').value) || 0;
  const qty     = parseInt($('fQty').value)     || 0;
  const reorder = parseInt($('fReorder').value) || 10;
  const category = $('fCat').value;
  const id = Date.now();
  inventory.push({ id, sku, name, category, qty, reorder, price });
  const txId = 'TX-' + String(Date.now()).slice(-6);
  const data = { txId, type: 'IN', product: name, sku, qty, value: qty * price, operator: 'Admin', category };
  const block = bc.add(data);
  transactions.push({ ...data, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });
  closeModal('addModal');
  showToast('success', 'เพิ่มสินค้าแล้ว', `${name} — Block #${block.index}`);
  $('sbInvCount').textContent = inventory.length;
  renderBcMini(); renderRecent(); updateBcStats();
}

function saveTransaction() {
  const type  = $('txType').value;
  const pid   = parseInt($('txProduct').value);
  const qty   = parseInt($('txQty').value) || 0;
  const price = parseFloat($('txPrice').value) || 0;
  if (!qty || qty <= 0) { showToast('error', 'จำนวนไม่ถูกต้อง', 'กรุณากรอกจำนวนมากกว่า 0'); return; }
  const item = inventory.find(i => i.id === pid);
  if (!item) return;
  if (type === 'OUT' && item.qty < qty) { showToast('error', 'สินค้าไม่พอ', `คงเหลือ ${item.qty} ชิ้น`); return; }
  if (type === 'IN')     item.qty += qty;
  else if (type === 'OUT') item.qty -= qty;
  else item.qty = qty;
  const txId = 'TX-' + String(Date.now()).slice(-6);
  const value = qty * (price || item.price);
  const data = { txId, type, product: item.name, sku: item.sku, qty, value, operator: 'Admin' };
  const block = bc.add(data);
  transactions.push({ ...data, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });
  closeModal('txModal');
  const lbl = { IN: 'รับเข้า', OUT: 'จ่ายออก', ADJUST: 'ปรับปรุง' };
  showToast('success', `${lbl[type]}สำเร็จ`, `${item.name} × ${qty} — Block #${block.index}`);
  renderBcMini(); renderRecent(); updateBcStats();
  if ($('page-inventory').classList.contains('active')) renderInventory();
  if ($('page-transactions').classList.contains('active')) renderTransactions();
  if ($('page-blockchain').classList.contains('active')) renderBlockchain();
}

/* ============================================================
   REPORTS
============================================================ */
function generateReport(type) {
  const n = { monthly:'รายงานสต๊อก', blockchain:'Blockchain Audit', lowstock:'สินค้าใกล้หมด', trend:'วิเคราะห์แนวโน้ม' };
  showToast('info', 'กำลังสร้างรายงาน', n[type] + '...');
  setTimeout(() => showToast('success', 'พร้อมแล้ว', `${n[type]}.pdf`), 2000);
}

/* ============================================================
   FAB
============================================================ */
const fabBtn     = $('fabBtn');
const fabMenu    = $('fabMenu');
const fabOverlay = $('fabOverlay');
let fabOpen = false;
function openFab()  { fabOpen = true;  fabMenu.classList.add('show');    fabOverlay.classList.add('show');    fabBtn.classList.add('open'); }
function closeFab() { fabOpen = false; fabMenu.classList.remove('show'); fabOverlay.classList.remove('show'); fabBtn.classList.remove('open'); }
fabBtn.addEventListener('click', () => fabOpen ? closeFab() : openFab());
fabOverlay.addEventListener('click', closeFab);

/* ============================================================
   TOAST
============================================================ */
function showToast(type, title, desc) {
  const ICONS = {
    success: '<svg class="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg class="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info:    '<svg class="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };
  const container = $('toasts');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${ICONS[type]}<div class="tt">${title}<span class="td">${desc}</span></div>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; setTimeout(() => t.remove(), 350); }, 4000);
}

/* ============================================================
   INIT
============================================================ */
setTimeout(() => showToast('info', 'ยินดีต้อนรับ', 'StockChain Pro — Blockchain พร้อมใช้งาน'), 1000);
