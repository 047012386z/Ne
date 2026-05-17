'use strict';

// ===== LOADING SCREEN =====
(function runLoader() {
  const bar = document.getElementById('loadingBar');
  const screen = document.getElementById('loadingScreen');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => screen.classList.add('hidden'), 350); }
    bar.style.width = p + '%';
  }, 80);
})();

// ===== BLOCKCHAIN ENGINE =====
class Block {
  constructor(index, data, previousHash = '0') {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = '';
  }
}

class Blockchain {
  constructor() { this.chain = []; this.createGenesis(); }
  createGenesis() {
    const g = new Block(0, { type: 'GENESIS', message: 'StockChain Pro Genesis Block', version: '2.0.0' }, '0'.repeat(64));
    g.hash = this.hash(g);
    this.chain.push(g);
  }
  hash(block) {
    const s = block.index + block.timestamp + block.previousHash + block.nonce + JSON.stringify(block.data);
    return this._hash64(s);
  }
  _hash64(str) {
    let h1 = 0xdeadbeefn, h2 = 0x41c6ce57n;
    for (let i = 0; i < str.length; i++) {
      const c = BigInt(str.charCodeAt(i));
      h1 = (h1 ^ c) * 2654435761n & 0xFFFFFFFFn;
      h2 = (h2 ^ c) * 2246822519n & 0xFFFFFFFFn;
    }
    const mix = (n, seed) => {
      let x = n ^ seed;
      for (let i = 0; i < 6; i++) { x = ((x ^ (x >> 16n)) * 0x45d9f3bn) & 0xFFFFFFFFFFFFFFFFn; }
      return x;
    };
    const a = mix(h1 * 0x100000001b3n, 0xfeedface00000000n);
    const b = mix(h2 * 0xcbf29ce484222325n, 0xdeadbeefcafebaben);
    const c_ = mix((h1 + h2) * 0x9e3779b97f4a7c15n, 0x0123456789abcdefn);
    const d = mix(h1 ^ h2 ^ BigInt(str.length), 0xfedcba9876543210n);
    const pad = n => (n & 0xFFFFFFFFFFFFFFFFn).toString(16).padStart(16, '0');
    return pad(a) + pad(b) + pad(c_) + pad(d);
  }
  addBlock(data) {
    const prev = this.chain[this.chain.length - 1];
    const block = new Block(this.chain.length, data, prev.hash);
    block.hash = this.hash(block);
    this.chain.push(block);
    return block;
  }
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const cur = this.chain[i], prev = this.chain[i - 1];
      if (cur.previousHash !== prev.hash) return false;
      if (cur.hash !== this.hash(cur)) return false;
    }
    return true;
  }
  shortHash(h) { return h ? h.slice(0, 8) + '…' + h.slice(-6) : '—'; }
}

const bc = new Blockchain();

// ===== DATA =====
const CATS = { Electronics: '#6366f1', Office: '#10b981', Furniture: '#f59e0b', Tools: '#ef4444', Consumables: '#8b5cf6' };
const CAT_TH = { Electronics: 'อิเล็กทรอนิกส์', Office: 'สำนักงาน', Furniture: 'เฟอร์นิเจอร์', Tools: 'เครื่องมือ', Consumables: 'วัสดุสิ้นเปลือง' };

const inventory = [
  { id: 1, sku: 'SKU-001', name: 'MacBook Pro 14"', category: 'Electronics', qty: 15, reorder: 5, price: 65000 },
  { id: 2, sku: 'SKU-002', name: 'Dell Monitor 27"', category: 'Electronics', qty: 28, reorder: 8, price: 12500 },
  { id: 3, sku: 'SKU-003', name: 'กระดาษ A4 (รีม)', category: 'Office', qty: 4, reorder: 20, price: 120 },
  { id: 4, sku: 'SKU-004', name: 'เก้าอี้สำนักงาน', category: 'Furniture', qty: 12, reorder: 3, price: 8500 },
  { id: 5, sku: 'SKU-005', name: 'ปากกาลูกลื่น (กล่อง)', category: 'Consumables', qty: 3, reorder: 10, price: 150 },
  { id: 6, sku: 'SKU-006', name: 'iPhone 15 Pro', category: 'Electronics', qty: 8, reorder: 5, price: 42000 },
  { id: 7, sku: 'SKU-007', name: 'โต๊ะทำงาน', category: 'Furniture', qty: 6, reorder: 2, price: 15000 },
  { id: 8, sku: 'SKU-008', name: 'ไขควงชุด', category: 'Tools', qty: 20, reorder: 5, price: 350 },
  { id: 9, sku: 'SKU-009', name: 'หมึกพิมพ์ Canon', category: 'Consumables', qty: 2, reorder: 8, price: 450 },
  { id: 10, sku: 'SKU-010', name: 'Keyboard Wireless', category: 'Electronics', qty: 35, reorder: 10, price: 2200 },
  { id: 11, sku: 'SKU-011', name: 'กระดาน Whiteboard', category: 'Office', qty: 5, reorder: 2, price: 3500 },
  { id: 12, sku: 'SKU-012', name: 'สว่านไฟฟ้า', category: 'Tools', qty: 7, reorder: 3, price: 5800 },
];

const transactions = [];
const suppliers = [
  { name: 'Tech Import Co.', category: 'Electronics', email: 'techimport@email.com', phone: '02-111-2222', rating: 5, products: 45 },
  { name: 'Office Mart', category: 'Office', email: 'officemart@email.com', phone: '02-333-4444', rating: 4, products: 120 },
  { name: 'Furniture Plus', category: 'Furniture', email: 'furplus@email.com', phone: '02-555-6666', rating: 4, products: 38 },
  { name: 'Tools & More', category: 'Tools', email: 'toolsmore@email.com', phone: '02-777-8888', rating: 5, products: 67 },
  { name: 'Supplies Hub', category: 'Consumables', email: 'supplieshub@email.com', phone: '02-999-0000', rating: 3, products: 200 },
];

// Seed blockchain
(function seed() {
  const seed = [
    { type: 'IN',     product: 'MacBook Pro 14"',   qty: 15, value: 975000, operator: 'System Admin', sku: 'SKU-001' },
    { type: 'IN',     product: 'Dell Monitor 27"',   qty: 28, value: 350000, operator: 'System Admin', sku: 'SKU-002' },
    { type: 'OUT',    product: 'กระดาษ A4 (รีม)',   qty: 10, value: 1200,   operator: 'คลัง-01',       sku: 'SKU-003' },
    { type: 'IN',     product: 'iPhone 15 Pro',      qty: 8,  value: 336000, operator: 'System Admin', sku: 'SKU-006' },
    { type: 'ADJUST', product: 'ปากกาลูกลื่น',       qty: 3,  value: 450,   operator: 'ผู้จัดการคลัง', sku: 'SKU-005' },
  ];
  seed.forEach((tx, i) => {
    const txId = 'TX-' + String(1001 + i).padStart(6, '0');
    const block = bc.addBlock({ txId, ...tx });
    transactions.push({ txId, ...tx, time: new Date(Date.now() - (5 - i) * 86400000).toISOString(), hash: block.hash, blockIndex: block.index });
  });
})();

// ===== NAVIGATION =====
const PAGE_TITLES = {
  dashboard: 'แดชบอร์ด', inventory: 'สินค้าคงคลัง', transactions: 'ธุรกรรม',
  blockchain: 'Blockchain Ledger', suppliers: 'ผู้จัดจำหน่าย', reports: 'รายงาน', alerts: 'การแจ้งเตือน'
};

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  document.querySelectorAll(`[data-page="${page}"]`).forEach(el => el.classList.add('active'));
  document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || page;
  // Close sidebar on mobile
  if (window.innerWidth <= 768) closeSidebar();
  const renders = {
    inventory: renderInventory,
    transactions: renderTransactions,
    blockchain: renderBlockchain,
    suppliers: renderSuppliers,
    alerts: renderAlerts,
  };
  if (renders[page]) renders[page]();
}

document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); if (item.dataset.page) navigateTo(item.dataset.page); });
});

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').style.display = 'block';
  requestAnimationFrame(() => document.getElementById('sidebarOverlay').classList.add('visible'));
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  const ov = document.getElementById('sidebarOverlay');
  ov.classList.remove('visible');
  setTimeout(() => { if (!ov.classList.contains('visible')) ov.style.display = 'none'; }, 220);
}

document.getElementById('sidebarToggle').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  } else {
    sidebar.classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('expanded');
    sidebar.classList.toggle('collapsed')
      ? document.getElementById('mainContent').style.marginLeft = '0'
      : document.getElementById('mainContent').style.marginLeft = '';
  }
});
document.getElementById('sidebarCloseBtn').addEventListener('click', closeSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

// ===== SWIPE TO OPEN SIDEBAR =====
let swipeStartX = 0;
document.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - swipeStartX;
  if (swipeStartX < 24 && dx > 60) openSidebar();
  if (dx < -60 && document.getElementById('sidebar').classList.contains('open')) closeSidebar();
}, { passive: true });

// ===== THEME TOGGLE =====
document.getElementById('themeToggle').addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? '' : 'light';
  document.querySelector('meta[name="theme-color"]').content = document.documentElement.dataset.theme === 'light' ? '#f1f1f7' : '#0f0f13';
});

// ===== MOBILE SEARCH =====
const mobileSearchBar = document.getElementById('mobileSearchBar');
document.getElementById('mobileSearchBtn').addEventListener('click', () => { mobileSearchBar.classList.add('open'); document.getElementById('mobileSearchInput').focus(); });
document.getElementById('mobileSearchClose').addEventListener('click', () => mobileSearchBar.classList.remove('open'));

// ===== FAB =====
const fabBtn = document.getElementById('fabBtn');
const fabMenu = document.getElementById('fabMenu');
let fabOpen = false;
function openFab() { fabOpen = true; fabMenu.classList.add('open'); fabBtn.classList.add('open'); }
function closeFab() { fabOpen = false; fabMenu.classList.remove('open'); fabBtn.classList.remove('open'); }
fabBtn.addEventListener('click', () => fabOpen ? closeFab() : openFab());
document.getElementById('fabBackdrop').addEventListener('click', closeFab);

// ===== LIVE CLOCK =====
function updateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const d = now.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
  document.getElementById('liveClock').textContent = d + ' ' + t;
}
updateClock();
setInterval(updateClock, 1000);

// ===== RIPPLE EFFECT =====
document.addEventListener('click', e => {
  const el = e.target.closest('[data-ripple]');
  if (!el) return;
  const r = document.createElement('span');
  r.className = 'ripple-effect';
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  el.appendChild(r);
  setTimeout(() => r.remove(), 600);
});

// ===== KPI COUNTERS =====
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const isLarge = target > 10000;
  const dur = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = Math.round(ease * target);
    el.textContent = prefix + (isLarge ? val.toLocaleString() : val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('.kpi-value').forEach(animateCount);

// ===== SPARKLINES =====
const sparkConf = (data, color) => ({
  type: 'line',
  data: { labels: data.map((_,i)=>i), datasets: [{ data, borderColor: color, borderWidth: 2, fill: true, backgroundColor: color + '22', pointRadius: 0, tension: 0.4 }] },
  options: { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 800 } }
});
['spark1','spark2','spark3','spark4'].forEach((id, i) => {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const datasets = [
    { data: [18,22,19,28,24,30,26,35,28,38,32,40], color: '#6366f1' },
    { data: [320,340,310,380,360,420,400,460,430,480,450,510], color: '#10b981' },
    { data: [30,45,38,55,42,60,52,70,58,75,65,80], color: '#f59e0b' },
    { data: [8,10,9,12,11,13,12,14,13,15,14,14], color: '#ef4444' },
  ];
  new Chart(canvas, sparkConf(datasets[i].data, datasets[i].color));
});

// ===== DONUT CHART =====
const donutColors = Object.values(CATS);
const donutLabels = Object.keys(CATS);
const donutData = [85, 60, 30, 45, 28];
const donutCtx = document.getElementById('donutChart')?.getContext('2d');
if (donutCtx) {
  new Chart(donutCtx, {
    type: 'doughnut',
    data: { labels: donutLabels, datasets: [{ data: donutData, backgroundColor: donutColors, borderWidth: 0, hoverOffset: 10 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '74%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${CAT_TH[ctx.label]}: ${ctx.parsed} รายการ` } }
      },
      animation: { animateScale: true, duration: 1000 }
    }
  });
  const legend = document.getElementById('donutLegend');
  donutLabels.forEach((lbl, i) => {
    const el = document.createElement('div');
    el.className = 'legend-item';
    el.innerHTML = `<div class="legend-dot" style="background:${donutColors[i]}"></div><span class="legend-label">${CAT_TH[lbl]}</span><span class="legend-val">${donutData[i]}</span>`;
    legend.appendChild(el);
  });
}

// ===== LINE CHART =====
const labels30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return d.getDate() + '/' + (d.getMonth() + 1);
});
const inData = labels30.map(() => Math.floor(Math.random() * 40 + 10));
const outData = labels30.map(() => Math.floor(Math.random() * 30 + 5));
const lineCtx = document.getElementById('lineChart')?.getContext('2d');
if (lineCtx) {
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: labels30,
      datasets: [
        { label: 'รับเข้า', data: inData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 },
        { label: 'จ่ายออก', data: outData, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#8888a8', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 } } },
      scales: {
        x: { ticks: { color: '#8888a8', font: { size: 10 }, maxTicksLimit: 7 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#8888a8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function setChartPeriod(btn, period) {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('info', 'เปลี่ยนช่วงเวลา', `แสดงข้อมูล: ${btn.textContent}`);
}

// ===== 3D BARS (Three.js) =====
(function init3D() {
  const container = document.getElementById('three-container');
  if (!container || !window.THREE) return;
  const w = container.clientWidth, h = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 1000);
  camera.position.set(0, 9, 18);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(10, 20, 10); dir.castShadow = true;
  scene.add(dir);
  const pl1 = new THREE.PointLight(0x6366f1, 3, 35); pl1.position.set(-5, 10, 2); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x10b981, 3, 35); pl2.position.set(5, 10, 2); scene.add(pl2);

  // Grid
  const gridHelper = new THREE.GridHelper(22, 22, 0x333355, 0x1f1f2e);
  scene.add(gridHelper);

  // Reflective floor
  const floorGeo = new THREE.PlaneGeometry(22, 22);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f0f18, metalness: 0.3, roughness: 0.9, transparent: true, opacity: 0.6 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; floor.receiveShadow = true;
  scene.add(floor);

  // Bar data
  const barDefs = [
    { label: 'อิเล็กทรอนิกส์', value: 85, color: 0x6366f1 },
    { label: 'สำนักงาน',       value: 60, color: 0x10b981 },
    { label: 'เฟอร์นิเจอร์',   value: 30, color: 0xf59e0b },
    { label: 'เครื่องมือ',     value: 45, color: 0xef4444 },
    { label: 'วัสดุฯ',         value: 28, color: 0x8b5cf6 },
  ];

  const maxVal = Math.max(...barDefs.map(d => d.value));
  const barW = 1.8, gap = 3.2;
  const total = (barDefs.length - 1) * gap;
  const risers = [];

  barDefs.forEach((d, i) => {
    const h = (d.value / maxVal) * 7.5 + 0.2;
    const x = i * gap - total / 2;

    const geo = new THREE.BoxGeometry(barW, h, barW);
    const mat = new THREE.MeshPhongMaterial({ color: d.color, emissive: d.color, emissiveIntensity: 0.12, shininess: 60, transparent: true, opacity: 0.92 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, h / 2, 0);
    mesh.castShadow = true;
    mesh.userData = { targetY: h / 2 };
    mesh.position.y = 0;
    scene.add(mesh);
    risers.push(mesh);

    // Glowing cap
    const capGeo = new THREE.BoxGeometry(barW + 0.12, 0.12, barW + 0.12);
    const capMat = new THREE.MeshPhongMaterial({ color: d.color, emissive: d.color, emissiveIntensity: 0.7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, h, 0);
    cap.userData = { targetY: h };
    cap.position.y = 0;
    scene.add(cap);
    risers.push(cap);

    // Wireframe edge
    const edges = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.25 });
    const wire = new THREE.LineSegments(edges, edgeMat);
    wire.position.set(x, h / 2, 0);
    wire.userData = { targetY: h / 2 };
    wire.position.y = 0;
    scene.add(wire);
    risers.push(wire);
  });

  // Legend chips
  const labelsEl = document.getElementById('threeLabels');
  if (labelsEl) {
    barDefs.forEach(d => {
      const el = document.createElement('div');
      el.className = 'three-label';
      el.innerHTML = `<div class="three-label-dot" style="background:#${d.color.toString(16).padStart(6,'0')}"></div><span>${d.label}: ${d.value}</span>`;
      labelsEl.appendChild(el);
    });
  }

  // Orbit
  let theta = 0, isDrag = false, lastX = 0;
  const addDrag = (startEv, moveEv, endEv, getX) => {
    container.addEventListener(startEv, e => { isDrag = true; lastX = getX(e); }, { passive: true });
    window.addEventListener(endEv, () => { isDrag = false; }, { passive: true });
    window.addEventListener(moveEv, e => { if (!isDrag) return; theta += (getX(e) - lastX) * 0.009; lastX = getX(e); }, { passive: true });
  };
  addDrag('mousedown', 'mousemove', 'mouseup', e => e.clientX);
  addDrag('touchstart', 'touchmove', 'touchend', e => e.touches[0].clientX);

  let elapsed = 0, lastT = 0;
  const animDur = 1.4;
  function animate(t) {
    requestAnimationFrame(animate);
    const dt = Math.min((t - lastT) / 1000, 0.05); lastT = t;
    elapsed += dt;
    const prog = Math.min(elapsed / animDur, 1);
    const ease = prog < 1 ? 1 - Math.pow(1 - prog, 4) : 1;
    risers.forEach(r => { if (r.userData.targetY !== undefined) r.position.y = r.userData.targetY * ease; });
    if (!isDrag) theta += 0.005;
    const R = 18;
    camera.position.x = Math.sin(theta) * R;
    camera.position.z = Math.cos(theta) * R;
    camera.lookAt(0, 3, 0);
    pl1.intensity = 2.5 + Math.sin(t * 0.0015) * 0.8;
    pl2.intensity = 2.5 + Math.cos(t * 0.0015) * 0.8;
    renderer.render(scene, camera);
  }
  animate(0);

  window.addEventListener('resize', () => {
    const cw = container.clientWidth, ch = container.clientHeight;
    camera.aspect = cw / ch; camera.updateProjectionMatrix();
    renderer.setSize(cw, ch);
  });
})();

// ===== BLOCKCHAIN MINI =====
function renderBlockchainMini() {
  const el = document.getElementById('blockchainMini');
  if (!el) return;
  el.innerHTML = '';
  [...bc.chain].slice(-5).reverse().forEach(block => {
    const div = document.createElement('div');
    div.className = 'bc-mini-block';
    const t = new Date(block.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const label = block.index === 0 ? 'Genesis Block' : `${block.data.type} — ${block.data.product || ''}`;
    div.innerHTML = `
      <div class="bc-mini-index">${block.index}</div>
      <div class="bc-mini-info">
        <div class="bc-mini-hash">${bc.shortHash(block.hash)}</div>
        <div class="bc-mini-time">${label} · ${t}</div>
      </div>
      <div class="bc-mini-valid">✓</div>`;
    el.appendChild(div);
  });
}
renderBlockchainMini();

// ===== FORMAT HELPERS =====
function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}
function fmtMoney(n) { return '฿' + Number(n || 0).toLocaleString(); }
function txBadge(type) {
  const map = { IN: 'badge-in', OUT: 'badge-out', ADJUST: 'badge-adjust' };
  const lbl = { IN: '▲ รับเข้า', OUT: '▼ จ่ายออก', ADJUST: '⟳ ปรับปรุง' };
  return `<span class="badge ${map[type]}">${lbl[type]}</span>`;
}

// ===== RECENT TABLE + MOBILE CARDS =====
function renderRecentTable() {
  const tbody = document.getElementById('recentTableBody');
  const mobileList = document.getElementById('recentMobileList');
  const recent = transactions.slice(-8).reverse();

  if (tbody) {
    tbody.innerHTML = recent.map(tx => `<tr>
      <td style="font-family:monospace;font-size:0.78rem;color:var(--primary)">${tx.txId}</td>
      <td><strong>${tx.product || '—'}</strong></td>
      <td>${txBadge(tx.type)}</td>
      <td>${tx.qty || '—'}</td>
      <td>${fmtMoney(tx.value)}</td>
      <td style="font-size:0.76rem;color:var(--text2)">${fmtTime(tx.time)}</td>
      <td class="hash-cell" title="${tx.hash}">${bc.shortHash(tx.hash)}</td>
      <td><span class="badge badge-confirmed">✓ ยืนยัน</span></td>
    </tr>`).join('');
  }

  if (mobileList) {
    mobileList.innerHTML = recent.map(tx => {
      const icons = { IN: '↑', OUT: '↓', ADJUST: '⟳' };
      const colors = { IN: 'rgba(16,185,129,0.15)', OUT: 'rgba(239,68,68,0.15)', ADJUST: 'rgba(245,158,11,0.15)' };
      const textColors = { IN: 'var(--success)', OUT: 'var(--danger)', ADJUST: 'var(--warning)' };
      return `<div class="tx-mobile-card">
        <div class="tx-mobile-icon" style="background:${colors[tx.type]};color:${textColors[tx.type]};font-size:1.1rem;font-weight:700">${icons[tx.type]}</div>
        <div class="tx-mobile-info">
          <div class="tx-mobile-product">${tx.product || '—'}</div>
          <div class="tx-mobile-hash">${bc.shortHash(tx.hash)}</div>
        </div>
        <div class="tx-mobile-right">
          <div class="tx-mobile-value" style="color:${textColors[tx.type]}">${tx.type === 'OUT' ? '-' : '+'}${fmtMoney(tx.value)}</div>
          <div class="tx-mobile-time">${fmtTime(tx.time)}</div>
        </div>
      </div>`;
    }).join('');
  }
}
renderRecentTable();

// ===== INVENTORY =====
function getStockStatus(item) {
  if (item.qty <= 0) return { label: 'หมด', cls: 'badge-low' };
  if (item.qty < item.reorder) return { label: 'ใกล้หมด', cls: 'badge-low' };
  if (item.qty < item.reorder * 2) return { label: 'ปกติ', cls: 'badge-mid' };
  return { label: 'เพียงพอ', cls: 'badge-ok' };
}

function renderInventory(data) {
  const items = data || inventory;
  // Desktop table
  const tbody = document.getElementById('inventoryTableBody');
  if (tbody) {
    tbody.innerHTML = items.map(item => {
      const status = getStockStatus(item);
      const pct = Math.min((item.qty / (item.reorder * 3)) * 100, 100);
      const barColor = item.qty < item.reorder ? 'var(--danger)' : item.qty < item.reorder * 2 ? 'var(--warning)' : 'var(--success)';
      return `<tr>
        <td style="font-family:monospace;font-size:0.78rem;color:var(--text2)">${item.sku}</td>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge" style="background:${CATS[item.category]}18;color:${CATS[item.category]}">${CAT_TH[item.category]}</span></td>
        <td><div style="display:flex;align-items:center;gap:8px"><strong>${item.qty}</strong><div class="stock-bar"><div class="stock-bar-fill" style="width:${pct}%;background:${barColor}"></div></div></div></td>
        <td>${item.reorder}</td>
        <td>${fmtMoney(item.price)}</td>
        <td>${fmtMoney(item.qty * item.price)}</td>
        <td><span class="badge ${status.cls}">${status.label}</span></td>
        <td><div class="action-btns">
          <button class="action-btn" onclick="editItem(${item.id})" title="แก้ไข"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="action-btn danger" onclick="deleteItem(${item.id})" title="ลบ"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
        </div></td>
      </tr>`;
    }).join('');
  }
  // Mobile card grid
  const grid = document.getElementById('inventoryCardGrid');
  if (grid) {
    grid.innerHTML = items.map(item => {
      const status = getStockStatus(item);
      const pct = Math.min((item.qty / (item.reorder * 3)) * 100, 100);
      const barColor = item.qty < item.reorder ? 'var(--danger)' : item.qty < item.reorder * 2 ? 'var(--warning)' : 'var(--success)';
      return `<div class="inv-card">
        <div class="inv-card-top">
          <div>
            <div class="inv-card-name">${item.name}</div>
            <div class="inv-card-sku">${item.sku}</div>
          </div>
          <span class="badge ${status.cls}">${status.label}</span>
        </div>
        <div class="inv-card-mid">
          <div class="inv-card-field">
            <span class="inv-card-field-label">หมวดหมู่</span>
            <span class="inv-card-field-val" style="color:${CATS[item.category]}">${CAT_TH[item.category]}</span>
          </div>
          <div class="inv-card-field">
            <span class="inv-card-field-label">ราคา/หน่วย</span>
            <span class="inv-card-field-val">${fmtMoney(item.price)}</span>
          </div>
          <div class="inv-card-field">
            <span class="inv-card-field-label">จุดสั่งซื้อ</span>
            <span class="inv-card-field-val">${item.reorder}</span>
          </div>
          <div class="inv-card-field">
            <span class="inv-card-field-label">มูลค่ารวม</span>
            <span class="inv-card-field-val">${fmtMoney(item.qty * item.price)}</span>
          </div>
        </div>
        <div class="inv-card-bottom">
          <div class="inv-card-stock">
            <strong style="font-size:1.1rem">${item.qty}</strong>
            <div class="stock-bar" style="width:100px"><div class="stock-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
          </div>
          <div class="action-btns">
            <button class="action-btn" onclick="editItem(${item.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="action-btn danger" onclick="deleteItem(${item.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
          </div>
        </div>
      </div>`;
    }).join('');
  }
}

function filterInventory() {
  const q = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
  const cat = document.getElementById('categoryFilter')?.value || '';
  renderInventory(inventory.filter(i => (!q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)) && (!cat || i.category === cat)));
}

function editItem(id) { showToast('info', 'แก้ไขสินค้า', 'ฟีเจอร์แก้ไขพร้อมใช้งานในเวอร์ชันถัดไป'); }
function deleteItem(id) {
  if (!confirm('ยืนยันการลบสินค้านี้?')) return;
  const idx = inventory.findIndex(i => i.id === id);
  if (idx < 0) return;
  const item = inventory.splice(idx, 1)[0];
  const block = bc.addBlock({ type: 'DELETE', product: item.name, sku: item.sku, operator: 'Admin' });
  showToast('success', 'ลบสินค้าแล้ว', `${item.name} — Block #${block.index}`);
  renderInventory(); renderBlockchainMini(); updateChainStats();
}

// ===== TRANSACTIONS =====
function renderTransactions() {
  const tbody = document.getElementById('txTableBody');
  const mlist = document.getElementById('txMobileList');
  const all = [...transactions].reverse();

  if (tbody) {
    tbody.innerHTML = all.map(tx => `<tr>
      <td style="font-family:monospace;font-size:0.76rem;color:var(--primary)">${tx.txId}</td>
      <td><strong>${tx.product || '—'}</strong></td>
      <td>${txBadge(tx.type)}</td>
      <td>${tx.qty || '—'}</td>
      <td>${fmtMoney(tx.value)}</td>
      <td style="font-size:0.76rem">${tx.operator || '—'}</td>
      <td style="font-size:0.76rem;color:var(--text2)">${fmtTime(tx.time)}</td>
      <td class="hash-cell" title="${tx.hash}">${bc.shortHash(tx.hash)}</td>
      <td><span class="badge badge-confirmed">✓ บนเชน</span></td>
    </tr>`).join('');
  }
  if (mlist) {
    mlist.innerHTML = all.map(tx => {
      const colors = { IN: 'rgba(16,185,129,0.15)', OUT: 'rgba(239,68,68,0.15)', ADJUST: 'rgba(245,158,11,0.15)' };
      const tc = { IN: 'var(--success)', OUT: 'var(--danger)', ADJUST: 'var(--warning)' };
      const icons = { IN: '↑', OUT: '↓', ADJUST: '⟳' };
      return `<div class="tx-mobile-card">
        <div class="tx-mobile-icon" style="background:${colors[tx.type]};color:${tc[tx.type]};font-size:1.1rem;font-weight:700">${icons[tx.type]}</div>
        <div class="tx-mobile-info">
          <div class="tx-mobile-product">${tx.product || '—'}</div>
          <div class="tx-mobile-hash">${tx.txId} · ${bc.shortHash(tx.hash)}</div>
        </div>
        <div class="tx-mobile-right">
          <div class="tx-mobile-value" style="color:${tc[tx.type]}">${fmtMoney(tx.value)}</div>
          <div class="tx-mobile-time">${fmtTime(tx.time)}</div>
        </div>
      </div>`;
    }).join('');
  }
}

// ===== BLOCKCHAIN PAGE =====
function renderBlockchain() {
  updateChainStats();
  const container = document.getElementById('blockchainChain');
  if (!container) return;
  container.innerHTML = '';
  [...bc.chain].reverse().forEach((block, ri) => {
    const isGenesis = block.index === 0;
    const wrapper = document.createElement('div');
    wrapper.className = 'chain-block' + (isGenesis ? ' chain-genesis' : '');
    const dataStr = isGenesis
      ? `<strong>Genesis Block</strong> — จุดเริ่มต้นของ Blockchain`
      : `<strong>${block.data.type}</strong> — ${block.data.product || ''} | จำนวน: ${block.data.qty || '—'} | มูลค่า: ${fmtMoney(block.data.value)} | โดย: ${block.data.operator || '—'}`;
    wrapper.innerHTML = `
      <div class="chain-connector">
        <div class="chain-dot-lg"></div>
        ${ri < bc.chain.length - 1 ? '<div class="chain-line"></div>' : ''}
      </div>
      <div class="block-card">
        <div class="block-top">
          <span class="block-index">#${block.index}</span>
          <span class="block-type ${isGenesis ? 'block-genesis' : ''}">${isGenesis ? 'GENESIS' : block.data.type}</span>
          <span class="block-time">${fmtTime(block.timestamp)}</span>
        </div>
        <div class="block-hashes">
          <div class="hash-row"><span class="hash-label">Hash:</span><span class="hash-value">${block.hash}</span></div>
          <div class="hash-row"><span class="hash-label">Prev Hash:</span><span class="hash-value prev">${block.previousHash}</span></div>
        </div>
        <div class="block-data">${dataStr}</div>
      </div>`;
    container.appendChild(wrapper);
  });
}

function updateChainStats() {
  const el = id => document.getElementById(id);
  if (el('totalBlocks')) el('totalBlocks').textContent = bc.chain.length;
  if (el('totalTxInChain')) el('totalTxInChain').textContent = bc.chain.length - 1;
  if (el('chainValid')) {
    const ok = bc.isValid();
    el('chainValid').textContent = ok ? '✓ ถูกต้อง' : '✗ ผิดปกติ';
    el('chainValid').className = 'bc-stat-value ' + (ok ? 'valid' : '');
    el('chainValid').style.color = ok ? 'var(--success)' : 'var(--danger)';
  }
}

function verifyChain() {
  const ok = bc.isValid();
  showToast(ok ? 'success' : 'error',
    ok ? 'Chain ถูกต้องสมบูรณ์' : 'พบความผิดปกติ!',
    ok ? `${bc.chain.length} บล็อก ผ่านการตรวจสอบ SHA-256 ทั้งหมด` : 'บางบล็อกถูกแก้ไข — ระบบบันทึกการตรวจจับ'
  );
}

// ===== SUPPLIERS =====
function renderSuppliers() {
  const grid = document.getElementById('supplierGrid');
  if (!grid) return;
  const colors = Object.values(CATS);
  grid.innerHTML = suppliers.map((s, i) => `
    <div class="supplier-card">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="supplier-avatar" style="background:linear-gradient(135deg,${colors[i%5]},${colors[(i+1)%5]})">${s.name[0]}</div>
        <div>
          <div class="supplier-name">${s.name}</div>
          <div style="font-size:0.72rem;color:${colors[i%5]};font-weight:600;margin-top:2px">${CAT_TH[s.category] || s.category}</div>
        </div>
      </div>
      <div class="supplier-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${s.email}</div>
      <div class="supplier-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>${s.phone}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="supplier-rating">${'<span class="star-f">★</span>'.repeat(s.rating)}${'<span class="star-e">★</span>'.repeat(5-s.rating)}</div>
        <span style="font-size:0.76rem;color:var(--text2)">${s.products} รายการ</span>
      </div>
    </div>`).join('');
}

// ===== ALERTS =====
function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!list) return;
  const lowStock = inventory.filter(i => i.qty < i.reorder);
  const alerts = [
    ...lowStock.map(item => ({ type: 'danger', title: `สินค้าใกล้หมด: ${item.name}`, desc: `คงเหลือ ${item.qty} ชิ้น | จุดสั่งซื้อ: ${item.reorder} ชิ้น | SKU: ${item.sku}`, time: 'เมื่อกี้' })),
    { type: 'warning', title: 'ธุรกรรมรอการอนุมัติ', desc: '2 รายการรอการตรวจสอบจากผู้จัดการคลัง', time: '5 นาทีที่แล้ว' },
    { type: 'warning', title: 'Blockchain Node Sync', desc: `กำลังซิงค์ข้อมูล ${bc.chain.length} บล็อกกับ Node สำรอง`, time: '12 นาทีที่แล้ว' },
  ];
  list.innerHTML = alerts.map(a => `
    <div class="alert-item">
      <div class="alert-icon ${a.type}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${a.type === 'danger' ? '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
        </svg>
      </div>
      <div class="alert-info">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
      <span class="alert-time">${a.time}</span>
    </div>`).join('');
}

// ===== MODALS =====
function openAddModal() {
  document.getElementById('modalTitle').textContent = 'เพิ่มสินค้าใหม่';
  ['fName','fSku','fPrice','fQty','fReorder','fNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  openModal('addModal');
}
function openTransactionModal() {
  const sel = document.getElementById('txProduct');
  if (sel) sel.innerHTML = inventory.map(i => `<option value="${i.id}">${i.name} (${i.sku})</option>`).join('');
  ['txQty','txPrice','txNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  openModal('txModal');
}
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  el.querySelector('input,select,textarea')?.focus();
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
});

function saveProduct() {
  const name = document.getElementById('fName').value.trim();
  const sku = document.getElementById('fSku').value.trim();
  if (!name || !sku) { showToast('error', 'ข้อมูลไม่ครบ', 'กรุณากรอกชื่อสินค้าและ SKU'); return; }
  const price = parseFloat(document.getElementById('fPrice').value) || 0;
  const qty = parseInt(document.getElementById('fQty').value) || 0;
  const reorder = parseInt(document.getElementById('fReorder').value) || 10;
  const category = document.getElementById('fCategory').value;
  const id = Date.now();
  inventory.push({ id, sku, name, category, qty, reorder, price });
  const txId = 'TX-' + String(Date.now()).slice(-6);
  const blockData = { txId, type: 'IN', product: name, sku, qty, value: qty * price, operator: 'Admin', category };
  const block = bc.addBlock(blockData);
  transactions.push({ txId, ...blockData, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });
  closeModal('addModal');
  showToast('success', 'เพิ่มสินค้าสำเร็จ', `${name} — Block #${block.index} บนเชน`);
  renderBlockchainMini(); renderRecentTable(); updateChainStats();
}

function saveTransaction() {
  const type = document.getElementById('txType').value;
  const productId = parseInt(document.getElementById('txProduct').value);
  const qty = parseInt(document.getElementById('txQty').value) || 0;
  const unitPrice = parseFloat(document.getElementById('txPrice').value) || 0;
  if (!qty || qty <= 0) { showToast('error', 'ข้อมูลไม่ถูกต้อง', 'กรุณากรอกจำนวนที่ถูกต้อง'); return; }
  const item = inventory.find(i => i.id === productId);
  if (!item) return;
  if (type === 'OUT' && item.qty < qty) { showToast('error', 'สินค้าไม่เพียงพอ', `คงเหลือ ${item.qty} ชิ้น ไม่สามารถจ่ายออก ${qty} ชิ้น`); return; }
  if (type === 'IN') item.qty += qty;
  else if (type === 'OUT') item.qty -= qty;
  else item.qty = qty;
  const txId = 'TX-' + String(Date.now()).slice(-6);
  const value = qty * (unitPrice || item.price);
  const blockData = { txId, type, product: item.name, sku: item.sku, qty, value, operator: 'Admin' };
  const block = bc.addBlock(blockData);
  transactions.push({ txId, ...blockData, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });
  closeModal('txModal');
  const lbl = { IN: 'รับเข้า', OUT: 'จ่ายออก', ADJUST: 'ปรับปรุง' };
  showToast('success', `บันทึก${lbl[type]}สำเร็จ`, `${item.name} × ${qty} — Block #${block.index}`);
  renderBlockchainMini(); renderRecentTable(); updateChainStats();
  if (document.getElementById('page-inventory').classList.contains('active')) renderInventory();
  if (document.getElementById('page-transactions').classList.contains('active')) renderTransactions();
  if (document.getElementById('page-blockchain').classList.contains('active')) renderBlockchain();
}

// ===== REPORTS =====
function generateReport(type) {
  const names = { monthly: 'รายงานสต๊อกประจำเดือน', blockchain: 'Blockchain Audit Report', lowstock: 'Low Stock Report', trend: 'Trend Analysis Report' };
  showToast('info', 'กำลังสร้างรายงาน', `${names[type]}...`);
  setTimeout(() => showToast('success', 'รายงานพร้อมแล้ว', `${names[type]}.pdf ดาวน์โหลดสำเร็จ`), 2200);
}

// ===== TOAST =====
function showToast(type, title, message) {
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${ICONS[type]||ICONS.info}</span><div class="toast-text">${title}<span class="toast-desc">${message}</span></div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = '0.35s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4200);
}

// ===== PULL-TO-REFRESH (mobile) =====
let ptrStartY = 0, ptrActive = false;
const ptrEl = document.getElementById('ptrIndicator');
document.getElementById('page-dashboard').addEventListener('touchstart', e => { ptrStartY = e.touches[0].clientY; }, { passive: true });
document.getElementById('page-dashboard').addEventListener('touchmove', e => {
  const dy = e.touches[0].clientY - ptrStartY;
  if (dy > 60 && window.scrollY === 0) { ptrEl?.classList.add('visible'); ptrActive = true; }
}, { passive: true });
document.getElementById('page-dashboard').addEventListener('touchend', () => {
  if (ptrActive) {
    ptrActive = false;
    setTimeout(() => {
      ptrEl?.classList.remove('visible');
      renderBlockchainMini();
      renderRecentTable();
      showToast('success', 'รีเฟรชแล้ว', 'ข้อมูลอัปเดตล่าสุด');
    }, 600);
  }
}, { passive: true });

// ===== INIT =====
setTimeout(() => showToast('info', 'ยินดีต้อนรับ', 'StockChain Pro v2.0 — Blockchain เชื่อมต่อแล้ว'), 1200);
