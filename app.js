'use strict';

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
    const genesis = new Block(0, { type: 'GENESIS', message: 'StockChain Pro — Genesis Block', system: 'v1.0.0' }, '0000000000000000');
    genesis.hash = this.computeHash(genesis);
    this.chain.push(genesis);
  }

  computeHash(block) {
    const str = block.index + block.timestamp + block.previousHash + block.nonce + JSON.stringify(block.data);
    return this.sha256Simple(str);
  }

  sha256Simple(str) {
    let hash = 0n;
    const bigPrime = 11400714819323198485n;
    for (let i = 0; i < str.length; i++) {
      const ch = BigInt(str.charCodeAt(i));
      hash = ((hash << 5n) - hash + ch) * bigPrime;
      hash = hash & 0xFFFFFFFFFFFFFFFFn;
    }
    // Extend to 64-char hex using multiple rounds
    let h1 = hash;
    let h2 = hash ^ 0xDEADBEEFCAFEBABEn;
    let h3 = hash ^ 0xFEEDFACEDEADBEEFn;
    let h4 = hash ^ 0xCAFEBABEFEEDFACEn;
    for (let i = 0; i < 8; i++) {
      h1 = ((h1 << 13n) ^ h1 ^ BigInt(i * 31 + 7)) & 0xFFFFFFFFFFFFFFFFn;
      h2 = ((h2 >> 7n) ^ h2 ^ BigInt(i * 17 + 3)) & 0xFFFFFFFFFFFFFFFFn;
      h3 = ((h3 << 5n) ^ h3 ^ BigInt(i * 41 + 11)) & 0xFFFFFFFFFFFFFFFFn;
      h4 = ((h4 >> 11n) ^ h4 ^ BigInt(i * 23 + 13)) & 0xFFFFFFFFFFFFFFFFn;
    }
    const toHex = (n) => n.toString(16).padStart(16, '0');
    return toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4);
  }

  addBlock(data) {
    const prev = this.chain[this.chain.length - 1];
    const block = new Block(this.chain.length, data, prev.hash);
    block.hash = this.computeHash(block);
    this.chain.push(block);
    return block;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const cur = this.chain[i];
      const prev = this.chain[i - 1];
      if (cur.previousHash !== prev.hash) return false;
      if (cur.hash !== this.computeHash(cur)) return false;
    }
    return true;
  }

  shortHash(hash) { return hash ? hash.slice(0, 8) + '...' + hash.slice(-6) : '—'; }
}

// ===== APP STATE =====
const bc = new Blockchain();

const categories = { Electronics: '#6366f1', Office: '#10b981', Furniture: '#f59e0b', Tools: '#ef4444', Consumables: '#8b5cf6' };

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
  { name: 'Tech Import Co.', category: 'Electronics', contact: 'techimport@email.com', phone: '02-111-2222', rating: 5, products: 45 },
  { name: 'Office Mart', category: 'สำนักงาน', contact: 'officemart@email.com', phone: '02-333-4444', rating: 4, products: 120 },
  { name: 'Furniture Plus', category: 'เฟอร์นิเจอร์', contact: 'furplus@email.com', phone: '02-555-6666', rating: 4, products: 38 },
  { name: 'Tools & More', category: 'เครื่องมือ', contact: 'toolsmore@email.com', phone: '02-777-8888', rating: 5, products: 67 },
  { name: 'Supplies Hub', category: 'วัสดุสิ้นเปลือง', contact: 'supplieshub@email.com', phone: '02-999-0000', rating: 3, products: 200 },
];

// Seed initial blockchain blocks
function seedBlockchain() {
  const seedTx = [
    { type: 'IN', product: 'MacBook Pro 14"', qty: 15, value: 975000, operator: 'System Admin', sku: 'SKU-001' },
    { type: 'IN', product: 'Dell Monitor 27"', qty: 28, value: 350000, operator: 'System Admin', sku: 'SKU-002' },
    { type: 'OUT', product: 'กระดาษ A4 (รีม)', qty: 10, value: 1200, operator: 'พนักงานคลัง 1', sku: 'SKU-003' },
    { type: 'IN', product: 'iPhone 15 Pro', qty: 8, value: 336000, operator: 'System Admin', sku: 'SKU-006' },
    { type: 'ADJUST', product: 'ปากกาลูกลื่น', qty: 3, value: 450, operator: 'ผู้จัดการคลัง', sku: 'SKU-005' },
  ];
  const times = [
    new Date(Date.now() - 86400000 * 5).toISOString(),
    new Date(Date.now() - 86400000 * 4).toISOString(),
    new Date(Date.now() - 86400000 * 3).toISOString(),
    new Date(Date.now() - 86400000 * 2).toISOString(),
    new Date(Date.now() - 86400000).toISOString(),
  ];
  seedTx.forEach((tx, i) => {
    const txId = 'TX-' + String(1000 + i + 1).padStart(6, '0');
    const block = bc.addBlock({ txId, ...tx });
    transactions.push({ txId, ...tx, time: times[i], hash: block.hash, blockIndex: block.index });
  });
}
seedBlockchain();

// ===== NAVIGATION =====
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  const titles = { dashboard: 'แดชบอร์ด', inventory: 'สินค้าคงคลัง', transactions: 'ธุรกรรม', blockchain: 'Blockchain Ledger', suppliers: 'ผู้จัดจำหน่าย', reports: 'รายงาน', alerts: 'การแจ้งเตือน' };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  if (page === 'inventory') renderInventory();
  if (page === 'transactions') renderTransactions();
  if (page === 'blockchain') renderBlockchain();
  if (page === 'suppliers') renderSuppliers();
  if (page === 'alerts') renderAlerts();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); navigateTo(item.dataset.page); });
});

// ===== SIDEBAR TOGGLE =====
document.getElementById('sidebarToggle').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  sidebar.classList.toggle('collapsed');
  main.classList.toggle('expanded');
});

// ===== THEME TOGGLE =====
document.getElementById('themeToggle').addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'light' ? '' : 'light';
  if (lineChart) updateChartTheme();
});

// ===== KPI COUNTERS =====
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const isLarge = target > 10000;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(ease * target);
    el.textContent = prefix + (isLarge ? val.toLocaleString() : val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('.kpi-value').forEach(el => animateCount(el));

// ===== SPARKLINES =====
function createSparkline(id, data, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  new Chart(canvas, {
    type: 'line',
    data: { labels: data.map((_,i)=>i), datasets: [{ data, borderColor: color, borderWidth: 2, fill: true, backgroundColor: color + '20', pointRadius: 0, tension: 0.4 }] },
    options: { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false }
  });
}
createSparkline('spark1', [18,22,19,28,24,30,26,35,28,38,32,40], '#6366f1');
createSparkline('spark2', [320,340,310,380,360,420,400,460,430,480,450,510], '#10b981');
createSparkline('spark3', [30,45,38,55,42,60,52,70,58,75,65,80], '#f59e0b');
createSparkline('spark4', [8,10,9,12,11,13,12,14,13,15,14,14], '#ef4444');

// ===== DONUT CHART =====
const donutColors = Object.values(categories);
const donutLabels = Object.keys(categories);
const donutData = [85, 60, 30, 45, 28];

const donutCtx = document.getElementById('donutChart').getContext('2d');
new Chart(donutCtx, {
  type: 'doughnut',
  data: {
    labels: donutLabels,
    datasets: [{ data: donutData, backgroundColor: donutColors, borderWidth: 0, hoverOffset: 8 }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} รายการ` } } }
  }
});

const legendEl = document.getElementById('donutLegend');
const labelsTH = { Electronics: 'อิเล็กทรอนิกส์', Office: 'สำนักงาน', Furniture: 'เฟอร์นิเจอร์', Tools: 'เครื่องมือ', Consumables: 'วัสดุสิ้นเปลือง' };
donutLabels.forEach((lbl, i) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.innerHTML = `<div class="legend-dot" style="background:${donutColors[i]}"></div><span class="legend-label">${labelsTH[lbl]}</span><span class="legend-val">${donutData[i]}</span>`;
  legendEl.appendChild(item);
});

// ===== LINE CHART =====
const labels30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return d.getDate() + '/' + (d.getMonth() + 1);
});
const inData = labels30.map(() => Math.floor(Math.random() * 40 + 10));
const outData = labels30.map(() => Math.floor(Math.random() * 30 + 5));

const lineCtx = document.getElementById('lineChart').getContext('2d');
let lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: labels30,
    datasets: [
      { label: 'รับเข้า', data: inData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 },
      { label: 'จ่ายออก', data: outData, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8888a8', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 } }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { ticks: { color: '#8888a8', font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#8888a8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  }
});

function updateChartTheme() { lineChart.update(); }
function setChartPeriod(btn, period) {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ===== 3D VISUALIZATION (Three.js) =====
(function init3D() {
  const container = document.getElementById('three-container');
  if (!container || !window.THREE) return;
  const w = container.clientWidth, h = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.set(0, 8, 18);
  camera.lookAt(0, 0, 0);

  // Ambient + Directional lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Point lights for glow effects
  const pl1 = new THREE.PointLight(0x6366f1, 2, 30); pl1.position.set(-5, 8, 0); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x10b981, 2, 30); pl2.position.set(5, 8, 0); scene.add(pl2);

  // Grid floor
  const gridHelper = new THREE.GridHelper(20, 20, 0x333355, 0x222233);
  scene.add(gridHelper);

  // 3D Bar data
  const barData = [
    { label: 'อิเล็กทรอนิกส์', value: 85, color: 0x6366f1 },
    { label: 'สำนักงาน',       value: 60, color: 0x10b981 },
    { label: 'เฟอร์นิเจอร์',   value: 30, color: 0xf59e0b },
    { label: 'เครื่องมือ',     value: 45, color: 0xef4444 },
    { label: 'วัสดุฯ',         value: 28, color: 0x8b5cf6 },
  ];

  const maxVal = Math.max(...barData.map(d => d.value));
  const bars = [];
  const barWidth = 2.0, barGap = 3.0;
  const totalWidth = (barData.length - 1) * barGap;

  barData.forEach((d, i) => {
    const height = (d.value / maxVal) * 7 + 0.2;
    const x = i * barGap - totalWidth / 2;

    // Bar geometry
    const geo = new THREE.BoxGeometry(barWidth, height, barWidth);
    const mat = new THREE.MeshPhongMaterial({
      color: d.color, emissive: d.color, emissiveIntensity: 0.15,
      shininess: 80, transparent: true, opacity: 0.9
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, height / 2, 0);
    mesh.castShadow = true;
    mesh.userData = { targetY: height / 2, height };
    mesh.position.y = 0;
    scene.add(mesh);
    bars.push(mesh);

    // Top glow cap
    const capGeo = new THREE.BoxGeometry(barWidth + 0.1, 0.15, barWidth + 0.1);
    const capMat = new THREE.MeshPhongMaterial({ color: d.color, emissive: d.color, emissiveIntensity: 0.6 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, height, 0);
    cap.userData = { targetY: height, isCap: true };
    cap.position.y = 0;
    scene.add(cap);
    bars.push(cap);

    // Edge wireframe
    const edgesGeo = new THREE.EdgesGeometry(geo);
    const edgesMat = new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.3 });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    wireframe.position.set(x, height / 2, 0);
    wireframe.userData = { targetY: height / 2 };
    wireframe.position.y = 0;
    scene.add(wireframe);
    bars.push(wireframe);
  });

  // Animate bars rising
  let elapsed = 0;
  const animDuration = 1.5;

  // Orbit params
  let theta = 0;
  let isDragging = false, lastX = 0;
  container.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    theta += (e.clientX - lastX) * 0.008;
    lastX = e.clientX;
  });

  // Touch support
  container.addEventListener('touchstart', e => { isDragging = true; lastX = e.touches[0].clientX; });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    theta += (e.touches[0].clientX - lastX) * 0.008;
    lastX = e.touches[0].clientX;
  });

  let lastTime = 0;
  function animate(time) {
    requestAnimationFrame(animate);
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    elapsed += dt;

    // Rise animation
    const prog = Math.min(elapsed / animDuration, 1);
    const ease = prog < 1 ? 1 - Math.pow(1 - prog, 4) : 1;
    bars.forEach(b => {
      if (b.userData.targetY !== undefined) b.position.y = b.userData.targetY * ease;
    });

    // Auto rotate when not dragging
    if (!isDragging) theta += 0.004;
    const r = 18;
    camera.position.x = Math.sin(theta) * r;
    camera.position.z = Math.cos(theta) * r;
    camera.lookAt(0, 3, 0);

    // Pulsing lights
    pl1.intensity = 1.5 + Math.sin(time * 0.002) * 0.5;
    pl2.intensity = 1.5 + Math.cos(time * 0.002) * 0.5;

    renderer.render(scene, camera);
  }
  animate(0);

  // Resize
  window.addEventListener('resize', () => {
    const cw = container.clientWidth, ch = container.clientHeight;
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    renderer.setSize(cw, ch);
  });
})();

// ===== BLOCKCHAIN MINI =====
function renderBlockchainMini() {
  const el = document.getElementById('blockchainMini');
  if (!el) return;
  el.innerHTML = '';
  const recent = bc.chain.slice(-5).reverse();
  recent.forEach(block => {
    const div = document.createElement('div');
    div.className = 'bc-mini-block';
    const t = new Date(block.timestamp);
    const timeStr = t.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `
      <div class="bc-mini-index">${block.index}</div>
      <div class="bc-mini-info">
        <div class="bc-mini-hash">${bc.shortHash(block.hash)}</div>
        <div class="bc-mini-time">${block.index === 0 ? 'Genesis Block' : block.data.type + ' — ' + (block.data.product || '')} · ${timeStr}</div>
      </div>
      <div class="bc-mini-valid">✓</div>`;
    el.appendChild(div);
  });
}
renderBlockchainMini();

// ===== RECENT TRANSACTIONS TABLE =====
function renderRecentTable() {
  const tbody = document.getElementById('recentTableBody');
  if (!tbody) return;
  const recent = transactions.slice(-8).reverse();
  tbody.innerHTML = recent.map(tx => `
    <tr>
      <td><span style="font-family:monospace;font-size:0.8rem;color:var(--primary)">${tx.txId}</span></td>
      <td>${tx.product || '—'}</td>
      <td><span class="badge badge-${tx.type === 'IN' ? 'in' : tx.type === 'OUT' ? 'out' : 'adjust'}">${tx.type === 'IN' ? '▲ รับเข้า' : tx.type === 'OUT' ? '▼ จ่ายออก' : '⟳ ปรับปรุง'}</span></td>
      <td>${tx.qty || '—'}</td>
      <td>฿${(tx.value || 0).toLocaleString()}</td>
      <td style="font-size:0.78rem;color:var(--text2)">${formatTime(tx.time)}</td>
      <td class="hash-cell" title="${tx.hash}">${bc.shortHash(tx.hash)}</td>
      <td><span class="badge badge-confirmed">✓ ยืนยันแล้ว</span></td>
    </tr>`).join('');
}
renderRecentTable();

function formatTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

// ===== INVENTORY PAGE =====
function getStockStatus(item) {
  if (item.qty <= 0) return { label: 'หมด', cls: 'badge-low' };
  if (item.qty < item.reorder) return { label: 'ใกล้หมด', cls: 'badge-low' };
  if (item.qty < item.reorder * 2) return { label: 'ปกติ', cls: 'badge-mid' };
  return { label: 'เพียงพอ', cls: 'badge-ok' };
}

function renderInventory(data) {
  const items = data || inventory;
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(item => {
    const status = getStockStatus(item);
    const pct = Math.min((item.qty / (item.reorder * 3)) * 100, 100);
    const barColor = item.qty < item.reorder ? '#ef4444' : item.qty < item.reorder * 2 ? '#f59e0b' : '#10b981';
    return `<tr>
      <td style="font-family:monospace;font-size:0.8rem">${item.sku}</td>
      <td><strong>${item.name}</strong></td>
      <td><span class="badge" style="background:${categories[item.category]}22;color:${categories[item.category]}">${item.category}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <strong>${item.qty}</strong>
          <div class="stock-bar"><div class="stock-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
        </div>
      </td>
      <td>${item.reorder}</td>
      <td>฿${item.price.toLocaleString()}</td>
      <td>฿${(item.qty * item.price).toLocaleString()}</td>
      <td><span class="badge ${status.cls}">${status.label}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn" onclick="editItem(${item.id})" title="แก้ไข">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn danger" onclick="deleteItem(${item.id})" title="ลบ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterInventory() {
  const q = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
  const cat = document.getElementById('categoryFilter')?.value || '';
  const filtered = inventory.filter(item =>
    (!q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)) &&
    (!cat || item.category === cat)
  );
  renderInventory(filtered);
}

function editItem(id) { showToast('info', 'แก้ไขสินค้า', 'เปิดแบบฟอร์มแก้ไข...'); }
function deleteItem(id) {
  if (!confirm('ยืนยันการลบสินค้านี้?')) return;
  const idx = inventory.findIndex(i => i.id === id);
  if (idx >= 0) {
    const item = inventory[idx];
    inventory.splice(idx, 1);
    const block = bc.addBlock({ type: 'DELETE', product: item.name, sku: item.sku, operator: 'Admin User' });
    showToast('success', 'ลบสินค้าแล้ว', `${item.name} ถูกลบออกจากระบบ`);
    renderInventory();
    renderBlockchainMini();
    updateChainStats();
  }
}

// ===== TRANSACTIONS PAGE =====
function renderTransactions() {
  const tbody = document.getElementById('txTableBody');
  if (!tbody) return;
  tbody.innerHTML = [...transactions].reverse().map(tx => `
    <tr>
      <td style="font-family:monospace;font-size:0.78rem;color:var(--primary)">${tx.txId}</td>
      <td>${tx.product || '—'}</td>
      <td><span class="badge badge-${tx.type === 'IN' ? 'in' : tx.type === 'OUT' ? 'out' : 'adjust'}">${tx.type === 'IN' ? '▲ รับเข้า' : tx.type === 'OUT' ? '▼ จ่ายออก' : '⟳ ปรับปรุง'}</span></td>
      <td>${tx.qty || '—'}</td>
      <td>฿${(tx.value || 0).toLocaleString()}</td>
      <td>${tx.operator || '—'}</td>
      <td style="font-size:0.78rem;color:var(--text2)">${formatTime(tx.time)}</td>
      <td class="hash-cell" title="${tx.hash}">${bc.shortHash(tx.hash)}</td>
      <td><span class="badge badge-confirmed">✓ บนเชน</span></td>
    </tr>`).join('');
}

// ===== BLOCKCHAIN PAGE =====
function renderBlockchain() {
  const container = document.getElementById('blockchainChain');
  if (!container) return;
  updateChainStats();
  container.innerHTML = '';
  [...bc.chain].reverse().forEach((block, ri) => {
    const isGenesis = block.index === 0;
    const wrapper = document.createElement('div');
    wrapper.className = 'chain-block' + (isGenesis ? ' chain-genesis' : '');

    const dataStr = isGenesis
      ? `<strong>Genesis Block</strong> — จุดเริ่มต้นของ Blockchain`
      : `<strong>${block.data.type}</strong> — ${block.data.product || ''} | จำนวน: ${block.data.qty || '—'} | มูลค่า: ฿${(block.data.value || 0).toLocaleString()} | โดย: ${block.data.operator || '—'}`;

    wrapper.innerHTML = `
      <div class="chain-connector">
        <div class="chain-dot-lg"></div>
        ${ri < bc.chain.length - 1 ? '<div class="chain-line"></div>' : ''}
      </div>
      <div class="block-card">
        <div class="block-top">
          <span class="block-index">#${block.index}</span>
          <span class="block-type ${isGenesis ? 'block-genesis' : ''}">${isGenesis ? 'GENESIS' : block.data.type}</span>
          <span class="block-time">${formatTime(block.timestamp)}</span>
        </div>
        <div class="block-hashes">
          <div class="hash-row">
            <span class="hash-label">Hash (ปัจจุบัน):</span>
            <span class="hash-value">${block.hash}</span>
          </div>
          <div class="hash-row">
            <span class="hash-label">Previous Hash:</span>
            <span class="hash-value prev">${block.previousHash}</span>
          </div>
        </div>
        <div class="block-data">${dataStr}</div>
      </div>`;
    container.appendChild(wrapper);
  });
}

function updateChainStats() {
  const totalEl = document.getElementById('totalBlocks');
  const txEl = document.getElementById('totalTxInChain');
  const validEl = document.getElementById('chainValid');
  if (totalEl) totalEl.textContent = bc.chain.length;
  if (txEl) txEl.textContent = bc.chain.length - 1;
  if (validEl) {
    const valid = bc.isValid();
    validEl.textContent = valid ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง';
    validEl.className = 'bc-stat-value ' + (valid ? 'valid' : 'invalid');
  }
}

function verifyChain() {
  const valid = bc.isValid();
  showToast(valid ? 'success' : 'error',
    valid ? 'ตรวจสอบสำเร็จ' : 'พบความผิดปกติ',
    valid ? `Blockchain ถูกต้อง — ${bc.chain.length} บล็อก ผ่านการตรวจสอบ` : 'พบการแก้ไขข้อมูลในบางบล็อก!'
  );
}

// ===== SUPPLIERS PAGE =====
function renderSuppliers() {
  const grid = document.getElementById('supplierGrid');
  if (!grid) return;
  const icons = ['T', 'O', 'F', 'M', 'S'];
  grid.innerHTML = suppliers.map((s, i) => `
    <div class="supplier-card">
      <div class="supplier-avatar" style="background:linear-gradient(135deg,${donutColors[i % donutColors.length]},${donutColors[(i+1) % donutColors.length]})">${icons[i]}</div>
      <div>
        <div class="supplier-name">${s.name}</div>
        <div class="supplier-detail" style="margin-top:4px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="2"/></svg>
          ${s.category}
        </div>
      </div>
      <div class="supplier-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${s.contact}</div>
      <div class="supplier-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14h0z"/></svg>${s.phone}</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="supplier-rating">${'★'.repeat(s.rating)}${'☆'.repeat(5 - s.rating)}</div>
        <span style="font-size:0.78rem;color:var(--text2)">${s.products} รายการ</span>
      </div>
    </div>`).join('');
}

// ===== ALERTS PAGE =====
function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!list) return;
  const lowStock = inventory.filter(i => i.qty < i.reorder);
  const alerts = [
    ...lowStock.map(item => ({ type: 'danger', title: `สินค้าใกล้หมด: ${item.name}`, desc: `คงเหลือ ${item.qty} ชิ้น / จุดสั่งซื้อ ${item.reorder} ชิ้น`, time: 'เมื่อกี้' })),
    { type: 'warning', title: 'ธุรกรรมรอการอนุมัติ', desc: '2 รายการรอการตรวจสอบจากผู้จัดการ', time: '5 นาทีที่แล้ว' },
    { type: 'warning', title: 'Blockchain Sync', desc: 'กำลังซิงค์ข้อมูลกับ Node สำรอง', time: '12 นาทีที่แล้ว' },
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
  ['fName', 'fSku', 'fPrice', 'fQty', 'fReorder', 'fNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  openModal('addModal');
}

function openTransactionModal() {
  const sel = document.getElementById('txProduct');
  if (sel) {
    sel.innerHTML = inventory.map(i => `<option value="${i.id}">${i.name} (${i.sku})</option>`).join('');
  }
  ['txQty', 'txPrice', 'txNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  openModal('txModal');
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
});

// ===== SAVE PRODUCT =====
function saveProduct() {
  const name = document.getElementById('fName').value.trim();
  const sku = document.getElementById('fSku').value.trim();
  const category = document.getElementById('fCategory').value;
  const price = parseFloat(document.getElementById('fPrice').value) || 0;
  const qty = parseInt(document.getElementById('fQty').value) || 0;
  const reorder = parseInt(document.getElementById('fReorder').value) || 10;

  if (!name || !sku) { showToast('error', 'ข้อผิดพลาด', 'กรุณากรอกชื่อสินค้าและรหัส SKU'); return; }

  const id = Date.now();
  inventory.push({ id, sku, name, category, qty, reorder, price });

  const txId = 'TX-' + String(Date.now()).slice(-6);
  const blockData = { txId, type: 'IN', product: name, sku, qty, value: qty * price, operator: 'Admin User', category };
  const block = bc.addBlock(blockData);
  transactions.push({ txId, ...blockData, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });

  closeModal('addModal');
  showToast('success', 'เพิ่มสินค้าแล้ว', `${name} ถูกบันทึกและเพิ่มในเชนสำเร็จ (Block #${block.index})`);
  renderBlockchainMini();
  renderRecentTable();
  updateChainStats();
}

// ===== SAVE TRANSACTION =====
function saveTransaction() {
  const type = document.getElementById('txType').value;
  const productId = parseInt(document.getElementById('txProduct').value);
  const qty = parseInt(document.getElementById('txQty').value) || 0;
  const price = parseFloat(document.getElementById('txPrice').value) || 0;
  const note = document.getElementById('txNote').value;

  if (!qty || qty <= 0) { showToast('error', 'ข้อผิดพลาด', 'กรุณากรอกจำนวนที่ถูกต้อง'); return; }

  const item = inventory.find(i => i.id === productId);
  if (!item) return;

  if (type === 'OUT' && item.qty < qty) {
    showToast('error', 'สินค้าไม่พอ', `สินค้าคงเหลือ ${item.qty} ชิ้น ไม่สามารถจ่ายออก ${qty} ชิ้น`);
    return;
  }

  if (type === 'IN') item.qty += qty;
  else if (type === 'OUT') item.qty -= qty;
  else item.qty = qty;

  const txId = 'TX-' + String(Date.now()).slice(-6);
  const value = qty * (price || item.price);
  const blockData = { txId, type, product: item.name, sku: item.sku, qty, value, operator: 'Admin User', note };
  const block = bc.addBlock(blockData);
  transactions.push({ txId, ...blockData, time: new Date().toISOString(), hash: block.hash, blockIndex: block.index });

  closeModal('txModal');
  const typeLabel = type === 'IN' ? 'รับเข้า' : type === 'OUT' ? 'จ่ายออก' : 'ปรับปรุง';
  showToast('success', `บันทึก${typeLabel}สำเร็จ`, `${item.name} × ${qty} — Block #${block.index} บนเชน`);
  renderBlockchainMini();
  renderRecentTable();
  updateChainStats();
  if (document.getElementById('page-inventory').classList.contains('active')) renderInventory();
  if (document.getElementById('page-transactions').classList.contains('active')) renderTransactions();
  if (document.getElementById('page-blockchain').classList.contains('active')) renderBlockchain();
}

// ===== TOAST =====
function showToast(type, title, message) {
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><div class="toast-text"><strong>${title}</strong><br><span style="font-weight:400;font-size:0.8rem;color:var(--text2)">${message}</span></div>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(8px)'; toast.style.transition = '0.3s ease'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ===== REPORT MOCK =====
function generateReport(type) {
  const names = { monthly: 'รายงานสต๊อกประจำเดือน', blockchain: 'รายงาน Blockchain Audit', lowstock: 'รายงานสินค้าใกล้หมด', trend: 'รายงานแนวโน้ม' };
  showToast('info', 'กำลังสร้างรายงาน', `${names[type]} — จะดาวน์โหลดภายในไม่กี่วินาที`);
  setTimeout(() => showToast('success', 'รายงานพร้อมแล้ว', `${names[type]}.pdf — ดาวน์โหลดสำเร็จ`), 2000);
}

// Init
showToast('info', 'ยินดีต้อนรับ', 'StockChain Pro พร้อมใช้งาน — Blockchain เชื่อมต่อแล้ว');
