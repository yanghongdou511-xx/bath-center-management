// ===== 工具函数 =====
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}
function levelTag(lv) {
  const map = { '钻石卡': 'tag-purple', '铂金卡': 'tag-blue', '金卡': 'tag-orange', '银卡': 'tag-green', '普通会员': 'tag-gray' };
  return `<span class="tag ${map[lv] || 'tag-gray'}">${lv}</span>`;
}
function statusTag(s) {
  const map = { active: ['tag-green', '正常'], frozen: ['tag-red', '冻结'], on: ['tag-green', '启用'], off: ['tag-gray', '停用'] };
  const [c, t] = map[s] || ['tag-gray', s];
  return `<span class="tag ${c}">${t}</span>`;
}
const fmtMoney = (n) => '¥' + Number(n).toLocaleString('zh-CN');

// ===== 登录 =====
$('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const u = $('login-user').value.trim();
  const p = $('login-pass').value.trim();
  if (u === 'admin' && p === '123456') {
    $('login-view').classList.add('hidden');
    $('app-view').classList.remove('hidden');
    render('dashboard');
    toast('登录成功，欢迎回来！');
  } else {
    toast('账号或密码错误（演示账号 admin/123456）');
  }
});
$('logout-btn').addEventListener('click', () => {
  $('app-view').classList.add('hidden');
  $('login-view').classList.remove('hidden');
});

// ===== 菜单切换 =====
const TITLES = { dashboard: '数据概览', member: '会员管理', service: '服务项目', cashier: '前台收银', room: '房间管理', inventory: '库存管理', employee: '员工管理', reservation: '预约管理', marketing: '营销活动', locker: '寄存管理', attendance: '考勤排班', review: '客诉评价', package: '会员卡套餐', report: '数据报表', store: '门店设置' };
$('menu').addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item');
  if (!item) return;
  document.querySelectorAll('.menu-item').forEach((m) => m.classList.remove('active'));
  item.classList.add('active');
  render(item.dataset.page);
});

// ===== 渲染分派 =====
function render(page) {
  $('page-title').textContent = TITLES[page] || '';
  const c = $('content');
  const fns = { dashboard: renderDashboard, member: renderMember, service: renderService, cashier: renderCashier, room: renderRoom, inventory: renderInventory, employee: renderEmployee, reservation: renderReservation, marketing: renderMarketing, locker: renderLocker, attendance: renderAttendance, review: renderReview, package: renderPackage, report: renderReport, store: renderStore };
  (fns[page] || renderDashboard)(c);
}

// ===== 数据概览 =====
function renderDashboard(c) {
  const today = DB.hourly.reduce((s, h) => s + h.v, 0);
  const stats = [
    { label: '今日营收', value: fmtMoney(today), trend: '+12.5% 较昨日', up: true, icon: '💰', color: '#1677ff' },
    { label: '会员总数', value: DB.members.length + ' 人', trend: '+3 本周新增', up: true, icon: '👤', color: '#52c41a' },
    { label: '今日订单', value: '128 单', trend: '+8.2% 较昨日', up: true, icon: '🧾', color: '#faad14' },
    { label: '在店客流', value: '46 人', trend: '-5 较一小时前', up: false, icon: '🚶', color: '#722ed1' },
  ];
  c.innerHTML = `
    <div class="stat-grid">
      ${stats.map(s => `
        <div class="stat-card">
          <div class="stat-icon" style="color:${s.color}">${s.icon}</div>
          <div class="stat-label">${s.label}</div>
          <div class="stat-value">${s.value}</div>
          <div class="stat-trend ${s.up ? 'up' : 'down'}">${s.up ? '▲' : '▼'} ${s.trend}</div>
        </div>`).join('')}
    </div>
    <div class="cashier-grid">
      <div class="chart-box">
        <div class="chart-title">今日营收趋势（按小时）</div>
        ${DB.hourly.map(h => {
          const max = Math.max(...DB.hourly.map(x => x.v));
          const pct = (h.v / max * 100).toFixed(1);
          return `<div class="bar-row"><div class="bar-label">${h.h}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><div class="bar-val">${fmtMoney(h.v)}</div></div>`;
        }).join('')}
      </div>
      <div class="card card-pad">
        <div class="chart-title">待办提醒</div>
        <div style="line-height:2.2">
          <div>🔔 库存预警：<b style="color:#fa8c16">2</b> 项商品低于安全库存</div>
          <div>🚪 房间占用：<b>${DB.rooms.filter(r => r.status === 'busy').length}</b> 间使用中</div>
          <div>👥 在岗员工：<b>${DB.employees.filter(e => e.status === 'on').length}</b> 人</div>
          <div>🧾 待结账：<b>3</b> 单</div>
          <div>📅 今日预约：<b>${DB.reservations.filter(r => r.date === '2026-08-04').length}</b> 笔</div>
        </div>
        <button class="btn btn-primary" style="margin-top:16px" onclick="render('cashier')">前往收银 →</button>
      </div>
    </div>`;
}

// ===== 会员管理 =====
let memberKeyword = '';
function renderMember(c) {
  const list = DB.members.filter(m => !memberKeyword || m.name.includes(memberKeyword) || m.phone.includes(memberKeyword) || m.id.includes(memberKeyword));
  c.innerHTML = `
    <div class="page-head"><h2>会员管理</h2><button class="btn btn-primary" onclick="openMemberModal()">+ 新增会员</button></div>
    <div class="filter-bar">
      <input class="search-input" placeholder="搜索姓名/手机号/会员号" value="${memberKeyword}" oninput="memberKeyword=this.value;renderMember($('content'))" />
      <span class="muted">共 ${list.length} 位会员</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>会员号</th><th>姓名</th><th>手机号</th><th>等级</th><th>账户余额</th><th>积分</th><th>注册日期</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${list.map(m => `
            <tr>
              <td>${m.id}</td><td>${m.name}</td><td>${m.phone}</td><td>${levelTag(m.level)}</td>
              <td><b>${fmtMoney(m.balance)}</b></td><td>${m.points.toLocaleString()}</td><td>${m.regDate}</td>
              <td>${statusTag(m.status)}</td>
              <td class="row-actions"><span class="text-link" onclick="recharge('${m.id}')">充值</span><span class="text-link" onclick="toast('演示环境：编辑功能已预留')">编辑</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function recharge(id) {
  const m = DB.members.find(x => x.id === id);
  openModal('会员充值 - ' + m.name, `
    <div class="form-item"><label>当前余额</label><div class="input" style="background:#fafafa">${fmtMoney(m.balance)}</div></div>
    <div class="form-item"><label>充值金额</label><input class="input" id="rc-amount" type="number" placeholder="如 500" /></div>
    <div class="form-item"><label>赠送积分</label><input class="input" id="rc-points" type="number" placeholder="如 500" value="500" /></div>
  `, () => {
    const a = parseFloat($('rc-amount').value);
    if (!a || a <= 0) return toast('请输入有效金额');
    m.balance += a; m.points += parseInt($('rc-points').value || 0);
    toast('充值成功：' + fmtMoney(a) + '，当前余额 ' + fmtMoney(m.balance));
    renderMember($('content'));
  });
}
function openMemberModal() {
  openModal('新增会员', `
    <div class="form-item"><label>姓名</label><input class="input" id="nm-name" placeholder="请输入姓名" /></div>
    <div class="form-item"><label>手机号</label><input class="input" id="nm-phone" placeholder="11位手机号" /></div>
    <div class="form-item"><label>会员等级</label>
      <select class="select" id="nm-level"><option>普通会员</option><option>银卡</option><option>金卡</option><option>铂金卡</option><option>钻石卡</option></select>
    </div>
    <div class="form-item"><label>初始充值</label><input class="input" id="nm-balance" type="number" placeholder="如 200" value="200" /></div>
  `, () => {
    const name = $('nm-name').value.trim();
    if (!name) return toast('请输入姓名');
    const id = 'M' + (10009 + DB.members.length);
    DB.members.unshift({ id, name, phone: $('nm-phone').value || '—', level: $('nm-level').value, balance: parseFloat($('nm-balance').value || 0), points: 0, regDate: new Date().toISOString().slice(0, 10), status: 'active' });
    toast('会员添加成功：' + name);
    renderMember($('content'));
  });
}

// ===== 服务项目 =====
let svcCategory = '';
function renderService(c) {
  const cats = ['全部', ...new Set(DB.services.map(s => s.category))];
  const list = svcCategory && svcCategory !== '全部' ? DB.services.filter(s => s.category === svcCategory) : DB.services;
  c.innerHTML = `
    <div class="page-head"><h2>服务项目</h2><button class="btn btn-primary" onclick="toast('演示环境：新增服务已预留')">+ 新增项目</button></div>
    <div class="filter-bar">
      ${cats.map(cat => `<button class="btn btn-sm ${svcCategory === cat || (!svcCategory && cat === '全部') ? 'btn-primary' : ''}" onclick="svcCategory='${cat}';renderService($('content'))">${cat}</button>`).join('')}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>编号</th><th>项目名称</th><th>分类</th><th>价格</th><th>时长</th><th>技师</th><th>状态</th></tr></thead>
        <tbody>
          ${list.map(s => `
            <tr><td>${s.id}</td><td><b>${s.name}</b></td><td><span class="tag tag-blue">${s.category}</span></td>
            <td style="color:#fa541c;font-weight:600">${fmtMoney(s.price)}</td><td>${s.duration} 分钟</td><td>${s.technician}</td>
            <td>${statusTag(s.status)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ===== 前台收银 =====
let cart = [];
function renderCashier(c) {
  const max = Math.max(...DB.hourly.map(x => x.v));
  c.innerHTML = `
    <div class="page-head"><h2>前台收银</h2><span class="muted">当前门店：${DB.store.current}</span></div>
    <div class="cashier-grid">
      <div class="order-panel">
        <div class="chart-title">可选项目</div>
        <div style="max-height:340px;overflow:auto">
          ${DB.services.filter(s => s.status === 'on').map(s => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0">
              <div><b>${s.name}</b> <span class="muted">${s.duration}分钟</span><br><span style="color:#fa541c;font-weight:600">${fmtMoney(s.price)}</span></div>
              <button class="btn btn-sm btn-primary" onclick="addCart('${s.id}')">加入</button>
            </div>`).join('')}
        </div>
      </div>
      <div class="order-panel">
        <div class="chart-title">当前订单</div>
        <div class="form-item" style="margin-bottom:12px"><label>选择会员</label>
          <select class="select" id="cash-member"><option value="">散客</option>${DB.members.map(m => `<option value="${m.id}">${m.name}（${m.level}·余${fmtMoney(m.balance)}）</option>`).join('')}</select>
        </div>
        <div class="selected-list" id="cart-list">
          ${cart.length === 0 ? '<div class="empty">请从左面选择服务项目</div>' : cart.map((it, i) => `<div class="sel-item"><span>${it.name}</span><span>${fmtMoney(it.price)} <span class="text-link" onclick="removeCart(${i})">✕</span></span></div>`).join('')}
        </div>
        <div class="total-box">合计：${fmtMoney(cart.reduce((s, x) => s + x.price, 0))}</div>
        <div class="pay-row">
          <button class="btn btn-success" onclick="payOrder('会员卡')">会员卡</button>
          <button class="btn btn-primary" onclick="payOrder('微信')">微信</button>
          <button class="btn btn-primary" onclick="payOrder('支付宝')">支付宝</button>
          <button class="btn" onclick="payOrder('现金')">现金</button>
          <button class="btn btn-text" onclick="cart=[];renderCashier($('content'))">清空</button>
        </div>
        <div style="margin-top:14px">
          <div class="chart-title">最近订单</div>
          ${DB.orders.slice(0, 4).map(o => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eee;font-size:13px"><span>${o.time} ${o.id}</span><span>${o.member}·${o.pay}</span><b style="color:#fa541c">${fmtMoney(o.amount)}</b></div>`).join('')}
        </div>
      </div>
    </div>`;
}
function addCart(id) {
  const s = DB.services.find(x => x.id === id);
  cart.push({ name: s.name, price: s.price });
  renderCashier($('content'));
}
function removeCart(i) { cart.splice(i, 1); renderCashier($('content')); }
function payOrder(method) {
  if (cart.length === 0) return toast('请先选择服务项目');
  const total = cart.reduce((s, x) => s + x.price, 0);
  const memberId = $('cash-member').value;
  if (method === '会员卡' && memberId) {
    const m = DB.members.find(x => x.id === memberId);
    if (m.balance < total) return toast('会员卡余额不足');
    m.balance -= total;
  }
  const oid = 'O' + (8004 + DB.orders.length);
  const member = memberId ? DB.members.find(x => x.id === memberId).name : '散客';
  DB.orders.unshift({ id: oid, member, items: cart.map(x => x.name).join('+'), amount: total, pay: method, time: new Date().toTimeString().slice(0, 5), cashier: '钱收银' });
  cart = [];
  toast('收银成功：' + fmtMoney(total) + ' · ' + method);
  renderCashier($('content'));
}

// ===== 房间管理 =====
function renderRoom(c) {
  const labels = { free: ['tag-green', '空闲'], busy: ['tag-orange', '使用中'], clean: ['tag-blue', '待清洁'], cleaning: ['tag-teal', '清洁完成'], maint: ['tag-red', '维护中'] };
  c.innerHTML = `
    <div class="page-head"><h2>房间 / 柜位管理</h2><span class="muted">空闲 ${DB.rooms.filter(r => r.status === 'free').length} · 使用中 ${DB.rooms.filter(r => r.status === 'busy').length}</span></div>
    <div class="room-grid">
      ${DB.rooms.map(r => {
        const [cls, txt] = labels[r.status];
        const next = r.status === 'free' ? 'busy' : r.status === 'busy' ? 'clean' : r.status === 'clean' ? 'cleaning' : r.status === 'cleaning' ? 'free' : 'free';
        const nextTxt = r.status === 'free' ? '开房' : r.status === 'busy' ? '结账' : r.status === 'clean' ? '清洁' : r.status === 'cleaning' ? '置空' : '修复';
        return `<div class="room-card ${r.status}">
          <div class="room-no">${r.no}</div>
          <div class="room-type">${r.type}</div>
          <div class="room-status"><span class="tag ${cls}">${txt}</span></div>
          <button class="btn btn-sm" style="margin-top:10px" onclick="toggleRoom('${r.no}')">${nextTxt}</button>
        </div>`;
      }).join('')}
    </div>`;
}
function toggleRoom(no) {
  const r = DB.rooms.find(x => x.no === no);
  const flow = { free: 'busy', busy: 'clean', clean: 'cleaning', cleaning: 'free', maint: 'free' };
  r.status = flow[r.status];
  toast(no + ' 状态已更新');
  renderRoom($('content'));
}

// ===== 库存管理 =====
const INV_STATUS = { normal: ['tag-green', '正常'], warn: ['tag-red', '库存预警'], disabled: ['tag-gray', '停用'] };
const INV_STATUS_FLOW = { normal: 'warn', warn: 'disabled', disabled: 'normal' };
const INV_STATUS_TXT = { normal: '正常', warn: '库存预警', disabled: '停用' };

function invStatusTag(s) {
  const [c, t] = INV_STATUS[s] || INV_STATUS['normal'];
  return `<span class="tag ${c}" style="cursor:pointer;user-select:none" onclick="toggleInvStatus(this)" data-status="${s}">${t} ▾</span>`;
}

function toggleInvStatus(el) {
  const cur = el.dataset.status;
  const next = INV_STATUS_FLOW[cur];
  // 找到对应商品（向上找到tr，再找id）
  const tr = el.closest('tr');
  if (!tr) return;
  const pid = tr.cells[0].textContent.trim();
  const p = DB.inventory.find(x => x.id === pid);
  if (!p) return;
  p.status = next;
  addInvLog(pid, p.name, 0, '状态变更', INV_STATUS_TXT[cur] + ' → ' + INV_STATUS_TXT[next]);
  toast(p.name + ' 状态 → ' + INV_STATUS_TXT[next]);
  renderInventory($('content'));
}

function addInvLog(pid, pname, qty, type, note) {
  DB.inventoryLog.unshift({
    id: 'IL' + String(Date.now()).slice(-6),
    pid, pname, qty, type, note,
    time: new Date().toLocaleString('zh-CN').slice(5, 16),
    afterStock: (DB.inventory.find(x => x.id === pid) || {}).stock || 0
  });
  if (DB.inventoryLog.length > 100) DB.inventoryLog.pop();
}

function renderInventory(c) {
  c.innerHTML = `
    <div class="page-head"><h2>库存管理</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" onclick="purchaseInbound()">+ 采购入库</button>
        <button class="btn" onclick="showInvLog()">📋 操作日志</button>
      </div>
    </div>
    <div class="filter-bar">
      <span class="muted">⚠️ 红色为低于安全库存预警商品 · 点击状态标签可切换 正常↔预警↔停用</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>编号</th><th>商品名称</th><th>当前库存</th><th>单位</th><th>安全线</th><th>供应商</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${DB.inventory.map(p => {
            const autoWarn = p.stock < p.warnLine && p.status !== 'disabled';
            const statusShow = p.status === 'disabled' ? INV_STATUS[p.status] : (autoWarn ? INV_STATUS['warn'] : INV_STATUS['normal']);
            const [sCls, sTxt] = statusShow;
            return `<tr style="${autoWarn && p.status !== 'disabled' ? 'background:#fff1f0' : ''}">
              <td>${p.id}</td>
              <td><b>${p.name}</b></td>
              <td><span class="inv-stock" style="cursor:pointer;font-weight:600;color:${autoWarn ? '#ff4d4f' : '#333'};text-decoration:underline;text-decoration-style:dotted;padding:2px 6px;border-radius:4px;background:${autoWarn ? '#fff1f0':'#f8fafc'}" onclick="adjustStock('${p.id}')">${p.stock}</span></td>
              <td>${p.unit}</td>
              <td>${p.warnLine}</td>
              <td>${p.supplier}</td>
              <td><span class="tag ${sCls}" style="cursor:pointer;user-select:none" onclick="toggleInvStatus(this)" data-status="${p.status}">${sTxt} ▾</span></td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="stockIn('${p.id}')">入库</button>
                <button class="btn btn-sm" onclick="stockOut('${p.id}')">出库</button>
                <button class="btn btn-sm" onclick="editProduct('${p.id}')">编辑</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div id="inv-log-area" style="display:none;margin-top:20px">
      <div class="page-head"><h3>📋 操作日志</h3><span class="muted">最近 ${DB.inventoryLog.length} 条记录</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>时间</th><th>商品</th><th>类型</th><th>数量</th><th>库存后</th><th>备注</th></tr></thead>
          <tbody>
            ${DB.inventoryLog.length === 0 ? '<tr><td colspan="6" class="muted" style="text-align:center;padding:20px">暂无操作记录</td></tr>' :
            DB.inventoryLog.map(l => `<tr>
              <td>${l.time}</td><td><b>${l.pname}</b></td>
              <td><span class="tag tag-${l.type==='入库'||l.type==='采购'?'green':l.type==='出库'?'orange':'blue'}">${l.type}</span></td>
              <td style="font-weight:600;color:${l.qty>=0 ? '#15a34a':'#d92d20'}">${l.qty > 0 ? '+' : ''}${l.qty}</td>
              <td>${l.afterStock}</td>
              <td class="muted">${l.note}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ---- 入库弹窗 ----
function stockIn(pid) {
  const p = DB.inventory.find(x => x.id === pid);
  openModal('入库 - ' + p.name, `
    <div class="form-row"><label>当前库存</label><b>${p.stock} ${p.unit}</b></div>
    <div class="form-row"><label>入库数量</label><input id="inv-qty" class="input" type="number" value="10" min="1" /></div>
    <div class="form-row"><label>备注</label><input id="inv-note" class="input" value="采购入库" placeholder="可选" /></div>
  `, () => {
    const qty = parseInt($('inv-qty').value) || 0;
    if (qty <= 0) { toast('请输入有效数量'); return; }
    p.stock += qty;
    addInvLog(p.id, p.name, +qty, '入库', $('inv-note').value || '入库');
    toast(p.name + ' 入库 +' + qty + ' → 库存 ' + p.stock);
    renderInventory($('content'));
  });
}

// ---- 出库弹窗 ----
function stockOut(pid) {
  const p = DB.inventory.find(x => x.id === pid);
  openModal('出库 - ' + p.name, `
    <div class="form-row"><label>当前库存</label><b>${p.stock} ${p.unit}</b></div>
    <div class="form-row"><label>出库数量</label><input id="inv-qty" class="input" type="number" value="1" min="1" max="${p.stock}" /></div>
    <div class="form-row"><label>备注</label><input id="inv-note" class="input" value="领用出库" placeholder="可选" /></div>
  `, () => {
    const qty = parseInt($('inv-qty').value) || 0;
    if (qty <= 0) { toast('请输入有效数量'); return; }
    if (qty > p.stock) { toast('出库数量不能超过库存'); return; }
    p.stock -= qty;
    addInvLog(p.id, p.name, -qty, '出库', $('inv-note').value || '出库');
    toast(p.name + ' 出库 -' + qty + ' → 库存 ' + p.stock);
    renderInventory($('content'));
  });
}

// ---- 盘点调整弹窗 ----
function adjustStock(pid) {
  const p = DB.inventory.find(x => x.id === pid);
  openModal('盘点调整 - ' + p.name, `
    <div class="form-row"><label>当前库存</label><b style="color:#1f5cff;font-size:18px">${p.stock}</b> ${p.unit}</div>
    <div class="form-row"><label>调整后库存</label><input id="inv-new" class="input" type="number" value="${p.stock}" min="0" /></div>
    <div class="form-row"><label>调整原因</label>
      <select id="inv-reason" class="input">
        <option value="盘点修正">盘点修正</option>
        <option value="报损">报损</option>
        <option value="盘盈">盘盈</option>
        <option value="退货">退货</option>
        <option value="其他">其他</option>
      </select>
    </div>
    <div class="form-row"><label>备注</label><input id="inv-note" class="input" placeholder="可选" /></div>
    <div class="muted" style="font-size:12px;margin-top:4px">系统将自动计算差值并记录为 入库/出库/调整</div>
  `, () => {
    const newVal = parseInt($('inv-new').value);
    if (isNaN(newVal) || newVal < 0) { toast('请输入有效的库存数'); return; }
    const diff = newVal - p.stock;
    const type = diff > 0 ? '入库' : diff < 0 ? '出库' : '无变化';
    const reason = $('inv-reason').value;
    p.stock = newVal;
    if (diff !== 0) addInvLog(p.id, p.name, diff, reason, ($('inv-note').value || '') || ('调整为 ' + newVal));
    toast(p.name + ' → ' + newVal + (diff !== 0 ? '（' + (diff > 0 ? '+' : '') + diff + '）' : ''));
    renderInventory($('content'));
  });
}

// ---- 编辑商品信息 ----
function editProduct(pid) {
  const p = DB.inventory.find(x => x.id === pid);
  openModal('编辑商品 - ' + p.name, `
    <div class="form-row"><label>编号</label><input id="ep-id" class="input" value="${p.id}" readonly style="background:#f1f5f9" /></div>
    <div class="form-row"><label>名称</label><input id="ep-name" class="input" value="${p.name}" /></div>
    <div class="form-row"><label>单位</label><input id="ep-unit" class="input" value="${p.unit}" /></div>
    <div class="form-row"><label>安全线</label><input id="ep-warn" class="input" type="number" value="${p.warnLine}" min="0" /></div>
    <div class="form-row"><label>供应商</label><input id="ep-supplier" class="input" value="${p.supplier}" /></div>
  `, () => {
    p.name = $('ep-name').value.trim() || p.name;
    p.unit = $('ep-unit').value.trim() || p.unit;
    p.warnLine = parseInt($('ep-warn').value) || p.warnLine;
    p.supplier = $('ep-supplier').value.trim() || p.supplier;
    toast(p.id + ' 信息已更新');
    renderInventory($('content'));
  });
}

// ---- 采购入库（多商品） ----
function purchaseInbound() {
  const opts = DB.inventory.map(p => `<option value="${p.id}">${p.name}（当前${p.stock}${p.unit}）</option>`).join('');
  openModal('采购入库', `
    <div class="form-row"><label>选择商品</label><select id="pi-pid" class="input">${opts}</select></div>
    <div class="form-row"><label>入库数量</label><input id="pi-qty" class="input" type="number" value="50" min="1" /></div>
    <div class="form-row"><label>供应商</label><input id="pi-sup" class="input" placeholder="留空则使用默认供应商" /></div>
    <div class="form-row"><label>备注</label><input id="pi-note" class="input" value="采购入库" /></div>
  `, () => {
    const pid = $('pi-pid').value;
    const p = DB.inventory.find(x => x.id === pid);
    const qty = parseInt($('pi-qty').value) || 0;
    if (qty <= 0) { toast('请输入有效数量'); return; }
    p.stock += qty;
    if ($('pi-sup').value.trim()) p.supplier = $('pi-sup').value.trim();
    addInvLog(p.id, p.name, +qty, '采购', $('pi-note').value || '采购入库');
    toast(p.name + ' 采购入库 +' + qty + ' → 库存 ' + p.stock);
    renderInventory($('content'));
  });
}

// ---- 操作日志 ----
let invLogVisible = false;
function showInvLog() {
  invLogVisible = !invLogVisible;
  const logArea = $('inv-log-area');
  if (!logArea) { renderInventory($('content')); showInvLog(); return; }
  logArea.style.display = invLogVisible ? '' : 'none';
  if (invLogVisible) logArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 员工管理 =====
function renderEmployee(c) {
  c.innerHTML = `
    <div class="page-head"><h2>员工管理</h2><button class="btn btn-primary" onclick="toast('演示环境：新增员工已预留')">+ 新增员工</button></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>工号</th><th>姓名</th><th>岗位</th><th>技师等级</th><th>提成</th><th>联系电话</th><th>状态</th></tr></thead>
        <tbody>
          ${DB.employees.map(e => `
            <tr><td>${e.id}</td><td><b>${e.name}</b></td><td><span class="tag tag-purple">${e.role}</span></td>
            <td>${e.techLevel === '-' ? '—' : e.techLevel}</td><td>${e.commission}</td><td>${e.phone}</td>
            <td>${statusTag(e.status)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ===== 数据报表 =====
function renderReport(c) {
  const maxW = Math.max(...DB.weekly.map(x => x.v));
  const maxT = Math.max(...DB.techRank.map(x => x.amount));
  c.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">本周营收</div><div class="stat-value">${fmtMoney(DB.weekly.reduce((s, x) => s + x.v, 0))}</div><div class="stat-trend up">▲ 较上周 +15.3%</div></div>
      <div class="stat-card"><div class="stat-label">本月营收</div><div class="stat-value">${fmtMoney(486200)}</div><div class="stat-trend up">▲ +9.8%</div></div>
      <div class="stat-card"><div class="stat-label">客单价</div><div class="stat-value">¥268</div><div class="stat-trend up">▲ +5.1%</div></div>
      <div class="stat-card"><div class="stat-label">会员复购率</div><div class="stat-value">62%</div><div class="stat-trend down">▼ -2.0%</div></div>
    </div>
    <div class="cashier-grid">
      <div class="chart-box">
        <div class="chart-title">近7日营收（元）</div>
        <div class="line-chart">
          ${DB.weekly.map(w => `<div class="line-col"><div class="line-bar" style="height:${(w.v / maxW * 160).toFixed(0)}px"></div><div class="line-x">${w.d}</div></div>`).join('')}
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-title">技师业绩排行（本月）</div>
        ${DB.techRank.map(t => `<div class="bar-row"><div class="bar-label">${t.name}</div><div class="bar-track"><div class="bar-fill" style="width:${(t.amount / maxT * 100).toFixed(1)}%"></div></div><div class="bar-val">${fmtMoney(t.amount)}</div></div>`).join('')}
      </div>
    </div>`;
}

// ===== 门店设置 =====
function renderStore(c) {
  c.innerHTML = `
    <div class="page-head"><h2>门店设置</h2></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>门店名称</th><th>地址</th><th>负责人</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${DB.store.list.map((s, i) => `
            <tr><td><b>${s}</b></td><td>示例地址 ${i + 1} 号</td><td>${['张总', '李经理', '王店长'][i]}</td>
            <td><span class="tag tag-green">营业中</span></td>
            <td>${DB.store.current === s ? '<span class="tag tag-blue">当前门店</span>' : `<span class="text-link" onclick="switchStore('${s}')">切换</span>`}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function switchStore(s) { DB.store.current = s; $('current-store').textContent = '🏬 ' + s; toast('已切换至 ' + s); renderStore($('content')); }

// ===== 通用弹窗 =====
function openModal(title, bodyHtml, onSave) {
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal">
      <div class="modal-head"><span>${title}</span><span class="close-x" onclick="this.closest('.modal-mask').remove()">×</span></div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-foot"><button class="btn" onclick="this.closest('.modal-mask').remove()">取消</button><button class="btn btn-primary" id="modal-save">保存</button></div>
    </div>`;
  document.body.appendChild(mask);
  mask.querySelector('#modal-save').addEventListener('click', () => { onSave(); mask.remove(); });
}

// ===== 预约管理 =====
let resvFilter = '全部';
const RESV_STATUS = { pending: ['tag-orange', '待确认'], confirmed: ['tag-blue', '已确认'], done: ['tag-green', '已完成'], cancelled: ['tag-gray', '已取消'] };
function resvTag(s) { const [c, t] = RESV_STATUS[s] || ['tag-gray', s]; return `<span class="tag ${c}">${t}</span>`; }
function renderReservation(c) {
  const list = resvFilter === '全部' ? DB.reservations : DB.reservations.filter(r => r.status === resvFilter);
  const filters = ['全部', 'pending', 'confirmed', 'done', 'cancelled'];
  const fmap = { 全部: '全部', pending: '待确认', confirmed: '已确认', done: '已完成', cancelled: '已取消' };
  c.innerHTML = `
    <div class="page-head"><h2>预约管理</h2><button class="btn btn-primary" onclick="newReservation()">+ 新增预约</button></div>
    <div class="filter-bar">
      ${filters.map(f => `<button class="btn btn-sm ${resvFilter === f ? 'btn-primary' : ''}" onclick="resvFilter='${f}';renderReservation($('content'))">${fmap[f]}</button>`).join('')}
      <span class="muted">共 ${list.length} 笔预约</span>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>预约号</th><th>会员</th><th>电话</th><th>服务项目</th><th>房间</th><th>技师</th><th>日期</th><th>时间</th><th>人数</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${list.map(r => `
            <tr>
              <td>${r.id}</td><td>${r.member}</td><td>${r.phone}</td><td>${r.service}</td>
              <td>${r.room}</td><td>${r.tech}</td><td>${r.date}</td><td>${r.time}</td><td>${r.people} 人</td>
              <td>${resvTag(r.status)}</td>
              <td class="row-actions">
                ${r.status === 'pending' ? `<span class="text-link" onclick="setResv('${r.id}','confirmed')">确认</span>` : ''}
                ${r.status === 'confirmed' ? `<span class="text-link" onclick="setResv('${r.id}','done')">完成</span>` : ''}
                ${(r.status === 'pending' || r.status === 'confirmed') ? `<span class="text-link" onclick="setResv('${r.id}','cancelled')">取消</span>` : ''}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function setResv(id, st) {
  const r = DB.reservations.find(x => x.id === id);
  const lbl = { confirmed: '已确认', done: '已完成', cancelled: '已取消' }[st];
  r.status = st;
  toast(r.id + ' 状态已更新为「' + lbl + '」');
  renderReservation($('content'));
}
function newReservation() {
  const memOpts = DB.members.map(m => `<option value="${m.name}">${m.name}（${m.phone}）</option>`).join('');
  const svcOpts = DB.services.filter(s => s.status === 'on').map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  const roomOpts = DB.rooms.map(r => `<option value="${r.no}">${r.no}（${r.type}）</option>`).join('');
  const techOpts = DB.employees.filter(e => e.role.includes('技师')).map(e => `<option value="${e.name}">${e.name}</option>`).join('') + '<option value="不限">不限</option>';
  openModal('新增预约', `
    <div class="form-row">
      <div class="form-item"><label>会员</label><select class="select" id="rv-member">${memOpts}</select></div>
      <div class="form-item"><label>服务项目</label><select class="select" id="rv-svc">${svcOpts}</select></div>
    </div>
    <div class="form-row">
      <div class="form-item"><label>房间/柜位</label><select class="select" id="rv-room">${roomOpts}</select></div>
      <div class="form-item"><label>指定技师</label><select class="select" id="rv-tech">${techOpts}</select></div>
    </div>
    <div class="form-row">
      <div class="form-item"><label>预约日期</label><input class="input" id="rv-date" type="date" value="2026-08-04" /></div>
      <div class="form-item"><label>到店时间</label><input class="input" id="rv-time" type="time" value="20:00" /></div>
      <div class="form-item"><label>人数</label><input class="input" id="rv-people" type="number" value="2" min="1" /></div>
    </div>
  `, () => {
    const member = $('rv-member').value;
    const phone = (DB.members.find(m => m.name === member) || {}).phone || '—';
    const id = 'B' + (9006 + DB.reservations.length);
    DB.reservations.unshift({ id, member, phone, service: $('rv-svc').value, room: $('rv-room').value, tech: $('rv-tech').value, date: $('rv-date').value, time: $('rv-time').value, people: parseInt($('rv-people').value || 1), status: 'pending' });
    toast('预约创建成功：' + member + ' · ' + $('rv-svc').value);
    renderReservation($('content'));
  });
}

// ===== 营销活动 =====
let couponFilter = '全部';
const COUPON_TYPE = { '满减': 'tag-orange', '折扣': 'tag-blue', '赠品': 'tag-purple' };
function couponTag(t) { return `<span class="tag ${COUPON_TYPE[t] || 'tag-gray'}">${t}</span>`; }
const CAMP_STATUS = { ongoing: ['tag-green', '进行中'], upcoming: ['tag-orange', '即将开始'], ended: ['tag-gray', '已结束'] };
function campTag(s) { const [c, t] = CAMP_STATUS[s] || ['tag-gray', s]; return `<span class="tag ${c}">${t}</span>`; }
function renderMarketing(c) {
  const list = couponFilter === '全部' ? DB.coupons : DB.coupons.filter(x => x.status === (couponFilter === '启用' ? 'on' : 'off'));
  c.innerHTML = `
    <div class="page-head"><h2>营销活动</h2><button class="btn btn-primary" onclick="newCoupon()">+ 新建优惠券</button></div>
    <div class="filter-bar">
      ${['全部', '启用', '停用'].map(f => `<button class="btn btn-sm ${couponFilter === f ? 'btn-primary' : ''}" onclick="couponFilter='${f}';renderMarketing($('content'))">${f}</button>`).join('')}
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>券码</th><th>名称</th><th>类型</th><th>规则</th><th>已领/总量</th><th>有效期至</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${list.map(x => `
            <tr><td>${x.id}</td><td><b>${x.name}</b></td><td>${couponTag(x.type)}</td><td>${x.rule}</td>
            <td>${x.used} / ${x.total}</td><td>${x.expire}</td>
            <td>${statusTag(x.status)}</td>
            <td class="row-actions"><span class="text-link" onclick="issueCoupon('${x.id}')">发放</span><span class="text-link" onclick="toast('演示环境：编辑功能已预留')">编辑</span></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="chart-title" style="margin:22px 0 4px">🎉 进行中的活动</div>
    <div class="camp-grid">
      ${DB.campaigns.map(p => `
        <div class="camp-card">
          <h3>${p.name} ${campTag(p.status)}</h3>
          <div class="camp-desc">${p.desc}</div>
          <div class="camp-date">📆 ${p.start} ~ ${p.end}</div>
        </div>`).join('')}
    </div>`;
}
function newCoupon() {
  openModal('新建优惠券', `
    <div class="form-row">
      <div class="form-item"><label>券名称</label><input class="input" id="cp-name" placeholder="如 满500减80" /></div>
      <div class="form-item"><label>类型</label><select class="select" id="cp-type"><option>满减</option><option>折扣</option><option>赠品</option></select></div>
    </div>
    <div class="form-item"><label>使用规则</label><input class="input" id="cp-rule" placeholder="如 消费满500元立减80元" /></div>
    <div class="form-row">
      <div class="form-item"><label>发放总量</label><input class="input" id="cp-total" type="number" value="300" /></div>
      <div class="form-item"><label>有效期至</label><input class="input" id="cp-expire" type="date" value="2026-12-31" /></div>
    </div>
  `, () => {
    const name = $('cp-name').value.trim();
    if (!name) return toast('请输入券名称');
    const id = 'C' + (10 + DB.coupons.length);
    DB.coupons.unshift({ id, name, type: $('cp-type').value, rule: $('cp-rule').value, total: parseInt($('cp-total').value || 0), used: 0, expire: $('cp-expire').value, status: 'on' });
    toast('优惠券创建成功：' + name);
    renderMarketing($('content'));
  });
}
function issueCoupon(id) {
  const x = DB.coupons.find(c => c.id === id);
  const memOpts = DB.members.map(m => `<option value="${m.id}">${m.name}（${m.level}）</option>`).join('');
  openModal('发放优惠券 - ' + x.name, `
    <div class="form-item"><label>选择会员</label><select class="select" id="ic-member">${memOpts}</select></div>
    <p class="muted">将向该会员账户发放「${x.name}」一张。</p>
  `, () => {
    const m = DB.members.find(mm => mm.id === $('ic-member').value);
    x.used = Math.min(x.total, x.used + 1);
    toast('已发放「' + x.name + '」给会员 ' + m.name);
    renderMarketing($('content'));
  });
}

// ===== 寄存管理 =====
const LOCKER_STATUS = { free: ['tag-green', '空闲'], used: ['tag-orange', '使用中'], maint: ['tag-red', '维护中'] };
function lockerTag(s) { const [c, t] = LOCKER_STATUS[s] || ['tag-gray', s]; return `<span class="tag ${c}">${t}</span>`; }
function renderLocker(c) {
  const usedCount = DB.lockers.filter(l => l.status === 'used').length;
  c.innerHTML = `
    <div class="page-head"><h2>寄存管理</h2><span class="muted">共 ${DB.lockers.length} 个柜位 · 使用中 ${usedCount} · 空闲 ${DB.lockers.length - usedCount}</span></div>
    <div class="locker-grid">
      ${DB.lockers.map(l => {
        const [cls, txt] = LOCKER_STATUS[l.status];
        const btn = l.status === 'free' ? `<button class="btn btn-sm btn-primary" onclick="assignLocker('${l.no}')">分配</button>`
          : l.status === 'used' ? `<button class="btn btn-sm" onclick="clearLocker('${l.no}')">置空</button>`
          : `<button class="btn btn-sm" onclick="fixLocker('${l.no}')">修复</button>`;
        return `<div class="locker-card ${l.status}">
          <div class="locker-no">🔐 ${l.no}</div>
          <div class="locker-zone">${l.zone}</div>
          <div>${lockerTag(l.status)}</div>
          ${l.status === 'used' ? `<div class="locker-occ">存放人：${l.member}<br>物品：${l.item}<br>时间：${l.time}</div>` : (l.status === 'maint' ? `<div class="locker-occ">${l.time}</div>` : '')}
          <div style="margin-top:10px">${btn}</div>
        </div>`;
      }).join('')}
    </div>`;
}
function assignLocker(no) {
  openModal('分配柜位 - ' + no, `
    <div class="form-item"><label>会员姓名</label><input class="input" id="lk-member" placeholder="物品所属会员" /></div>
    <div class="form-item"><label>寄存物品</label><input class="input" id="lk-item" placeholder="如 贵重物品袋 / 衣物" /></div>
  `, () => {
    const l = DB.lockers.find(x => x.no === no);
    l.status = 'used'; l.member = $('lk-member').value || '散客'; l.item = $('lk-item').value || '—'; l.time = new Date().toTimeString().slice(0, 5);
    toast(no + ' 已分配给 ' + l.member);
    renderLocker($('content'));
  });
}
function clearLocker(no) { const l = DB.lockers.find(x => x.no === no); l.status = 'free'; l.member = ''; l.item = ''; l.time = ''; toast(no + ' 已置空'); renderLocker($('content')); }
function fixLocker(no) { const l = DB.lockers.find(x => x.no === no); l.status = 'free'; l.member = ''; l.item = ''; l.time = ''; toast(no + ' 已修复可用'); renderLocker($('content')); }

// ===== 考勤排班 =====
const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const SHIFT_CLS = { '早': 'shift-早', '晚': 'shift-晚', '中': 'shift-中', '休': 'shift-休' };
function renderAttendance(c) {
  c.innerHTML = `
    <div class="page-head"><h2>考勤排班</h2><button class="btn btn-primary" onclick="clockIn()">员工签到</button></div>
    <div class="chart-title">本周排班表</div>
    <div class="table-wrap" style="overflow:auto">
      <table class="sched-table">
        <thead><tr><th>员工</th>${DAYS.map(d => `<th>${d}</th>`).join('')}</tr></thead>
        <tbody>
          ${DB.attendance.schedule.map(r => `<tr><td><b>${r.name}</b></td>${DAYS.map(d => `<td><span class="${SHIFT_CLS[r[d]] || ''}">${r[d]}</span></td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="chart-title" style="margin-top:22px">今日考勤记录（2026-08-04 周二）</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>员工</th><th>日期</th><th>上班</th><th>下班</th><th>状态</th></tr></thead>
        <tbody>
          ${DB.attendance.records.map(r => `<tr><td><b>${r.name}</b></td><td>${r.date}</td><td>${r.clockIn}</td><td>${r.clockOut}</td><td>${r.status === 'late' ? '<span class="tag tag-orange">迟到</span>' : '<span class="tag tag-green">正常</span>'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function clockIn() {
  const memOpts = DB.employees.filter(e => e.status === 'on').map(e => `<option value="${e.name}">${e.name}（${e.role}）</option>`).join('');
  openModal('员工签到', `
    <div class="form-item"><label>选择员工</label><select class="select" id="at-emp">${memOpts}</select></div>
    <p class="muted">签到时间将记录为当前时间。</p>
  `, () => {
    const name = $('at-emp').value;
    const now = new Date().toTimeString().slice(0, 5);
    DB.attendance.records.unshift({ name, date: '2026-08-04', clockIn: now, clockOut: '—', status: 'normal' });
    toast(name + ' 签到成功：' + now);
    renderAttendance($('content'));
  });
}

// ===== 客诉评价 =====
let reviewFilter = '全部';
function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function reviewTypeTag(t) { return t === '客诉' ? '<span class="tag tag-red">客诉</span>' : '<span class="tag tag-green">好评</span>'; }
function reviewStatusTag(s) { if (s === 'resolved') return '<span class="tag tag-green">已处理</span>'; if (s === 'pending') return '<span class="tag tag-orange">待处理</span>'; return ''; }
function renderReview(c) {
  const list = reviewFilter === '全部' ? DB.reviews : DB.reviews.filter(r => r.type === reviewFilter);
  c.innerHTML = `
    <div class="page-head"><h2>客诉评价</h2><button class="btn btn-primary" onclick="newReview()">+ 新增评价</button></div>
    <div class="filter-bar">
      ${['全部', '好评', '客诉'].map(f => `<button class="btn btn-sm ${reviewFilter === f ? 'btn-primary' : ''}" onclick="reviewFilter='${f}';renderReview($('content'))">${f}</button>`).join('')}
      <span class="muted">共 ${list.length} 条</span>
    </div>
    <div class="review-grid">
      ${list.map(r => `
        <div class="review-card">
          <div class="review-head">
            <div class="review-avatar">${r.member.slice(0, 1)}</div>
            <div style="flex:1"><b>${r.member}</b> ${reviewTypeTag(r.type)}</div>
            <div class="review-stars">${stars(r.rating)}</div>
          </div>
          <div class="review-content">${esc(r.content)}</div>
          <div class="review-meta"><span>${r.time}</span>${reviewStatusTag(r.status)}</div>
          ${r.type === '客诉' && r.status === 'pending' ? `<div style="margin-top:10px"><button class="btn btn-sm" onclick="resolveReview('${r.id}')">标记为已处理</button></div>` : ''}
        </div>`).join('')}
    </div>`;
}
function resolveReview(id) { const r = DB.reviews.find(x => x.id === id); r.status = 'resolved'; toast('客诉已标记为已处理'); renderReview($('content')); }
function newReview() {
  const memOpts = DB.members.map(m => `<option value="${m.name}">${m.name}（${m.level}）</option>`).join('') + '<option value="散客">散客</option>';
  openModal('新增评价/客诉', `
    <div class="form-row">
      <div class="form-item"><label>会员</label><select class="select" id="rv-member2">${memOpts}</select></div>
      <div class="form-item"><label>类型</label><select class="select" id="rv-type"><option value="好评">好评</option><option value="客诉">客诉</option></select></div>
    </div>
    <div class="form-item"><label>评分</label><select class="select" id="rv-rating"><option value="5">★★★★★ 5分</option><option value="4">★★★★☆ 4分</option><option value="3">★★★☆☆ 3分</option><option value="2">★★☆☆☆ 2分</option><option value="1">★☆☆☆☆ 1分</option></select></div>
    <div class="form-item"><label>内容</label><input class="input" id="rv-content" placeholder="请输入评价或客诉内容" /></div>
  `, () => {
    const type = $('rv-type').value;
    const id = 'R' + (10 + DB.reviews.length);
    DB.reviews.unshift({ id, member: $('rv-member2').value, rating: parseInt($('rv-rating').value), content: $('rv-content').value || '（无内容）', time: new Date().toLocaleString('zh-CN').slice(0, 16), type, status: type === '客诉' ? 'pending' : '' });
    toast('评价已提交');
    renderReview($('content'));
  });
}

// ===== 会员卡套餐 =====
const PKG_TYPE = { '储值卡': 'tag-blue', '期限卡': 'tag-purple', '次卡': 'tag-orange' };
function renderPackage(c) {
  c.innerHTML = `
    <div class="page-head"><h2>会员卡套餐</h2><span class="muted">储值 / 期限 / 次卡，前台一键售卖并到账</span></div>
    <div class="pkg-grid">
      ${DB.packages.map(p => `
        <div class="pkg-card">
          ${p.tag ? `<div class="pkg-tag">${p.tag}</div>` : ''}
          <div class="pkg-name">${p.name}</div>
          <div>${PKG_TYPE[p.type] ? `<span class="tag ${PKG_TYPE[p.type]}">${p.type}</span>` : ''}</div>
          <div class="pkg-price">${fmtMoney(p.price)}</div>
          ${p.gift > 0 ? `<div class="pkg-gift">赠送 ${fmtMoney(p.gift)}${p.points ? ' + ' + p.points + ' 积分' : ''}</div>` : (p.points ? `<div class="pkg-gift">赠送 ${p.points} 积分</div>` : '')}
          <div class="pkg-desc">${p.desc}</div>
          <button class="btn btn-primary" onclick="sellPackage('${p.id}')">售卖</button>
        </div>`).join('')}
    </div>`;
}
function sellPackage(id) {
  const p = DB.packages.find(x => x.id === id);
  const memOpts = DB.members.map(m => `<option value="${m.id}">${m.name}（余${fmtMoney(m.balance)}）</option>`).join('');
  openModal('售卖套餐 - ' + p.name, `
    <div class="form-item"><label>选择会员</label><select class="select" id="pk-member">${memOpts}</select></div>
    <div class="form-item"><label>到账金额</label><div class="input" style="background:#fafafa">${fmtMoney(p.price + p.gift)}</div></div>
    <p class="muted">${p.gift > 0 ? '含赠送 ' + fmtMoney(p.gift) : ''}${p.points ? '，赠送 ' + p.points + ' 积分' : ''}</p>
  `, () => {
    const m = DB.members.find(x => x.id === $('pk-member').value);
    m.balance += p.price + p.gift;
    m.points += p.points || 0;
    toast('套餐售卖成功：' + m.name + ' 到账 ' + fmtMoney(p.price + p.gift));
    renderPackage($('content'));
  });
}
