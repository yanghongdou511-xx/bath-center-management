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
  if (u === '24031532' && p === '123456') {
    $('login-view').classList.add('hidden');
    $('app-view').classList.remove('hidden');
    try {
      render('dashboard');
    } catch (err) {
      var box = document.getElementById('boot-error');
      if (box) { box.classList.remove('hidden'); box.innerHTML = '⚠️ 首页渲染出错：' + (err && err.message || err); }
    }
    toast('登录成功，欢迎回来！');
  } else {
    toast('账号或密码错误');
  }
});
$('logout-btn').addEventListener('click', () => {
  $('app-view').classList.add('hidden');
  $('login-view').classList.remove('hidden');
});

// ===== 登录页交互（密码显隐 / 按钮涟漪） =====
function initLoginEffects() {
  // 1) 密码显隐切换
  const pw = $('login-pass');
  const toggle = $('pw-toggle');
  if (pw && toggle) {
    toggle.addEventListener('click', () => {
      const show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      toggle.classList.toggle('show', show);
      toggle.setAttribute('aria-checked', String(show));
      toggle.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
    });
  }
  // 2) 登录按钮点击涟漪
  const btn = document.querySelector('.btn-login');
  if (btn && btn.addEventListener) {
    btn.addEventListener('click', function (e) {
      const r = document.createElement('span');
      r.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect ? btn.getBoundingClientRect() : { width: 120, height: 50, left: 0, top: 0 };
      const size = Math.max(rect.width, rect.height);
      const cx = e && e.clientX != null ? e.clientX - rect.left : rect.width / 2;
      const cy = e && e.clientY != null ? e.clientY - rect.top : rect.height / 2;
      r.style.width = r.style.height = size + 'px';
      r.style.left = (cx - size / 2) + 'px';
      r.style.top = (cy - size / 2) + 'px';
      if (btn.appendChild) btn.appendChild(r);
      if (r.remove) setTimeout(() => r.remove(), 700);
    });
  }
}
initLoginEffects();

// ===== 导航配置（细线条 SVG 图标） =====
var NAV_ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>',
  member: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6.4 7-6.4s7 2.8 7 6.4"/></svg>',
  walkin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4c1.4 0 2.2 1.2 2.2 2.6S9.4 9 8 9 5.8 7.8 5.8 6.6 6.6 4 8 4Z"/><path d="M16 13c1.4 0 2.2 1.2 2.2 2.6S17.4 18 16 18s-2.2-1.2-2.2-2.4S14.6 13 16 13Z"/></svg>',
  service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c0 0-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z"/></svg>',
  cashier: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 8l3 4 3-4M12 12v5M9.5 13h5M9.5 15h5"/></svg>',
  room: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17"/><path d="M6 21h12"/><circle cx="14" cy="12" r="1.1"/></svg>',
  inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z"/><path d="M3 7l9 4 9-4"/><path d="M12 11v10"/></svg>',
  employee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3 2.6-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.4c2.5.3 4.5 1.9 4.5 4.6"/></svg>',
  technician: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V6a1.4 1.4 0 0 1 2.8 0v5M10.8 11V5a1.4 1.4 0 0 1 2.8 0v6M13.6 11V6.5a1.4 1.4 0 0 1 2.8 0V15c0 3.3-2.3 6-5.6 6-2.4 0-4-1.2-5-3l-2-3.4a1.4 1.4 0 0 1 2.3-1.5L8 13"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9V4Z"/><path d="M9 11h6M9 15h6"/></svg>',
  reservation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
  marketing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11"/><path d="M12 9C12 9 9 4 6.5 5.5S8 9 12 9Z"/><path d="M12 9c0 0 3-5 5.5-3.5S16 9 12 9Z"/></svg>',
  locker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.2"/></svg>',
  attendance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.3"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V9M16 16v-7"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/></svg>'
};
var NAV = [
  { page: 'dashboard', label: '数据概览' }, { page: 'member', label: '会员管理' },
  { page: 'walkin', label: '散客区' }, { page: 'service', label: '服务项目' },
  { page: 'cashier', label: '前台收银' }, { page: 'room', label: '房间管理' },
  { page: 'inventory', label: '库存管理' }, { page: 'employee', label: '员工管理' },
  { page: 'technician', label: '技师区' }, { page: 'task', label: '任务管理' },
  { page: 'reservation', label: '预约管理' }, { page: 'marketing', label: '营销活动' },
  { page: 'locker', label: '寄存管理' }, { page: 'attendance', label: '考勤排班' },
  { page: 'review', label: '客诉评价' }, { page: 'package', label: '会员卡套餐' },
  { page: 'report', label: '数据报表' }, { page: 'store', label: '门店设置' }
];
function buildMenu() {
  var menu = $('menu');
  if (!menu) return;
  menu.innerHTML = NAV.map(function (n, i) {
    return '<a class="menu-item' + (i === 0 ? ' active' : '') + '" data-page="' + n.page + '">' +
      '<span class="mi-icon">' + (NAV_ICONS[n.page] || '') + '</span>' +
      '<span class="menu-label">' + n.label + '</span></a>';
  }).join('');
}
buildMenu();

// ===== 菜单切换 =====
const TITLES = { dashboard: '数据概览', member: '会员管理', walkin: '散客区', service: '服务项目', cashier: '前台收银', room: '房间管理', inventory: '库存管理', employee: '员工管理', technician: '技师区', task: '任务管理', reservation: '预约管理', marketing: '营销活动', locker: '寄存管理', attendance: '考勤排班', review: '客诉评价', package: '会员卡套餐', report: '数据报表', store: '门店设置' };
$('menu').addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item');
  if (!item) return;
  document.querySelectorAll('.menu-item').forEach((m) => m.classList.remove('active'));
  item.classList.add('active');
  render(item.dataset.page);
});

// 侧边栏折叠/展开
var navToggle = $('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', function () {
    var sb = document.querySelector('.sidebar');
    if (sb) sb.classList.toggle('collapsed');
  });
}

// 用户头像下拉菜单
var userMenu = $('user-menu');
var userTrigger = $('user-trigger');
if (userTrigger && userMenu) {
  userTrigger.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = userMenu.classList.toggle('open');
    userTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (userMenu && !userMenu.contains(e.target)) {
      userMenu.classList.remove('open');
      userTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && userMenu) {
      userMenu.classList.remove('open');
      userTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== 渲染分派 =====
function render(page) {
  $('page-title').textContent = TITLES[page] || '';
  const c = $('content');
  const fns = { dashboard: renderDashboard, member: renderMember, walkin: renderWalkin, service: renderService, cashier: renderCashier, room: renderRoom, inventory: renderInventory, employee: renderEmployee, technician: renderTechnician, task: renderTask, reservation: renderReservation, marketing: renderMarketing, locker: renderLocker, attendance: renderAttendance, review: renderReview, package: renderPackage, report: renderReport, store: renderStore };
  (fns[page] || renderDashboard)(c);
}

// ===== 日期工具（与现实世界同步）=====
var _todayCache = (function () {
  var d = new Date();
  var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate(), wd = d.getDay();
  var mm = m < 10 ? '0' + m : '' + m; var dd = day < 10 ? '0' + day : '' + day;
  var s = y + '-' + mm + '-' + dd;
  var names = ['周日','周一','周二','周三','周四','周五','周六'];
  return { str: s, label: s.slice(5) + ' ' + names[wd], dayName: names[wd], y: y, m: mm, d: dd };
})();
function todayStr()   { return _todayCache.str; }
function todayLabel() { return _todayCache.label; }
function todayDayName(){ return _todayCache.dayName; }
function offsetDateStr(daysOffset) {
  var d = new Date(_todayCache.y, parseInt(_todayCache.m,10)-1, parseInt(_todayCache.d,10)+daysOffset);
  return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2);
}
function formatDayLabel(dateStr) {
  var names = ['周日','周一','周二','周三','周四','周五','周六'];
  var d = new Date(dateStr.replace(/-/g,'/'));
  return dateStr.slice(5) + ' ' + names[d.getDay()];
}

// 填充下拉菜单日期（在日期工具函数之后调用）
var _udDateEl = $('ud-date');
if (_udDateEl) { _udDateEl.textContent = todayLabel(); }

// ===== 数据概览 =====
function animateCountUps(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return;
  root.querySelectorAll('.stat-num').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-num')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 950, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + Math.round(val).toLocaleString('en-US') + suffix;
      if (p < 1) window.requestAnimationFrame(step);
      else el.textContent = prefix + Math.round(target).toLocaleString('en-US') + suffix;
    }
    window.requestAnimationFrame(step);
  });
}

function renderDashboard(c) {
  var todayRev = DB.hourly.reduce(function (s, h) { return s + h.v; }, 0);
  var now = new Date();
  var dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
  var msgCount = DB.reviews ? DB.reviews.filter(function (r) { return r.status === 'pending'; }).length : 0;
  if (msgCount === 0) msgCount = 6;
  var stats = [
    { label: '今日订单', prefix: '', value: 128, suffix: ' 单', icon: 'cashier', trend: '+8.2% 较昨日', up: true },
    { label: '今日营收', prefix: '¥', value: todayRev, suffix: '', icon: 'report', trend: '+12.5% 较昨日', up: true },
    { label: '消息通知', prefix: '', value: msgCount, suffix: ' 条', icon: 'review', trend: msgCount + ' 条待处理', up: true },
    { label: '会员总数', prefix: '', value: DB.members.length, suffix: ' 人', icon: 'member', trend: '+3 本周新增', up: true }
  ];
  var maxH = Math.max.apply(null, DB.hourly.map(function (x) { return x.v; }));
  function fmtInt(n, p, s) { return p + Math.round(n).toLocaleString('en-US') + s; }
  c.innerHTML = `
    <div class="dash-head">
      <div>
        <h3 class="lux-h dash-title">经营概览</h3>
        <p class="dash-sub">实时掌握门店水波之间的每一笔生意</p>
      </div>
      <div class="dash-date">${dateStr}</div>
    </div>

    <div class="stat-grid">
      ${stats.map(function (s) {
        return `<div class="stat-card">
          <div class="stat-icon">${NAV_ICONS[s.icon] || ''}</div>
          <div class="stat-label">${s.label}</div>
          <div class="stat-value"><span class="stat-num" data-num="${s.value}" data-prefix="${s.prefix}" data-suffix="${s.suffix}">${fmtInt(s.value, s.prefix, s.suffix)}</span></div>
          <div class="stat-trend ${s.up ? 'up' : 'down'}">${s.up ? '▲' : '▼'} ${s.trend}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="quick-actions">
      <div class="qa-title">快捷操作</div>
      <div class="qa-grid">
        <button type="button" class="qa-btn" onclick="render('member')"><span class="qa-ic">${NAV_ICONS.member}</span><span class="qa-tx">新增会员</span></button>
        <button type="button" class="qa-btn" onclick="render('cashier')"><span class="qa-ic">${NAV_ICONS.cashier}</span><span class="qa-tx">前台收银</span></button>
        <button type="button" class="qa-btn" onclick="render('reservation')"><span class="qa-ic">${NAV_ICONS.reservation}</span><span class="qa-tx">新建预约</span></button>
        <button type="button" class="qa-btn" onclick="render('inventory')"><span class="qa-ic">${NAV_ICONS.inventory}</span><span class="qa-tx">库存补货</span></button>
      </div>
    </div>

    <div class="dash-cols">
      <div class="card card-pad chart-card">
        <div class="chart-title">今日营收趋势（按小时）</div>
        <div class="bars">
          ${DB.hourly.map(function (h) {
            var pct = (h.v / maxH * 100).toFixed(1);
            return `<div class="bar-row"><div class="bar-label">${h.h}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><div class="bar-val">${fmtMoney(h.v)}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="card card-pad todo-card">
        <div class="chart-title">待办提醒</div>
        <ul class="todo-list">
          <li><span class="todo-ic">${NAV_ICONS.inventory}</span><div><b>库存预警</b><span>${DB.inventory.filter(function (i) { return i.status === 'low'; }).length || 2} 项商品低于安全库存</span></div></li>
          <li><span class="todo-ic">${NAV_ICONS.room}</span><div><b>房间占用</b><span>${DB.rooms.filter(function (r) { return r.status === 'busy'; }).length} 间使用中</span></div></li>
          <li><span class="todo-ic">${NAV_ICONS.employee}</span><div><b>在岗员工</b><span>${DB.employees.filter(function (e) { return e.status === 'on'; }).length} 人</span></div></li>
          <li><span class="todo-ic">${NAV_ICONS.cashier}</span><div><b>待结账</b><span>3 单</span></div></li>
          <li><span class="todo-ic">${NAV_ICONS.reservation}</span><div><b>今日预约</b><span>${DB.reservations.filter(function (r) { return r.date === todayStr(); }).length} 笔</span></div></li>
        </ul>
        <button class="btn btn-primary" style="margin-top:16px" onclick="render('cashier')">前往收银 →</button>
      </div>
    </div>

    <div class="card card-pad recent-card">
      <div class="recent-head">
        <h3 class="lux-h">最近订单</h3>
        <a class="recent-more" onclick="render('cashier')">查看全部 →</a>
      </div>
      <div class="table-wrap recent-table-wrap">
        <table class="recent-table">
          <thead><tr><th>订单号</th><th>会员</th><th>消费项目</th><th>金额</th><th>支付方式</th><th>时间</th><th>收银员</th></tr></thead>
          <tbody>
            ${DB.orders.map(function (o) {
              return `<tr><td class="mono">${o.id}</td><td>${esc(o.member)}</td><td>${esc(o.items)}</td><td class="amount">¥${o.amount}</td><td>${esc(o.pay)}</td><td>${o.time}</td><td>${esc(o.cashier)}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  animateCountUps(c);
}

// ===== 会员管理 =====
let memberKeyword = '';
let walkinKeyword = '';
function renderMember(c) {
  const list = DB.members.filter(m => !memberKeyword || m.name.includes(memberKeyword) || m.phone.includes(memberKeyword) || m.id.includes(memberKeyword));
  c.innerHTML = `
    <div class="page-head"><button class="btn btn-primary" onclick="openMemberModal()">+ 新增会员</button></div>
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
              <td>${memStatusSelect(m.id, m.status)}</td>
              <td class="row-actions"><span class="text-link" onclick="recharge('${m.id}')">充值</span><span class="text-link" onclick="editMember('${m.id}')">编辑</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// 会员状态下拉选择框
function memStatusSelect(id, status) {
  var opts = { active: '正常', frozen: '冻结' };
  return '<select class="mem-status-select" onchange="changeMemStatus(\'' + id + '\', this.value)">' +
    Object.keys(opts).map(function(k) {
      return '<option value="' + k + '"' + (k === status ? ' selected' : '') + '>' + opts[k] + '</option>';
    }).join('') + '</select>';
}

function changeMemStatus(mid, newStatus) {
  var m = DB.members.find(function(x) { return x.id === mid; });
  if (m) {
    var old = m.status === 'active' ? '正常' : '冻结';
    m.status = newStatus;
    var nw = newStatus === 'active' ? '正常' : '冻结';
    toast('会员「' + m.name + '」状态：' + old + ' → ' + nw);
    renderMember($('content'));
  }
}

// 增强版充值弹窗（含充值方式选择）
function recharge(id) {
  const m = DB.members.find(x => x.id === id);
  openModal('会员充值 - ' + m.name, `
    <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="color:#5a6a7e;font-size:13px">当前余额</span>
        <span style="font-size:22px;font-weight:800;color:#1677ff">${fmtMoney(m.balance)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#8c98a4">
        <span>积分：<b>${m.points.toLocaleString()}</b></span>
        <span>等级：${m.level}</span>
      </div>
    </div>
    <div class="form-item"><label>充值金额 <span style="color:#e74c3c">*</span></label>
      <input class="input" id="rc-amount" type="number" placeholder="如 500" />
      <div style="display:flex;gap:8px;margin-top:6px">
        ${[100,200,500,1000,2000].map(function(v){ return '<button type="button" class="btn btn-sm" style="flex:1;padding:4px" onclick="$(\'rc-amount\').value=' + v + '">' + v + '</button>'; }).join('')}
      </div>
    </div>
    <div class="form-item"><label>充值方式</label>
      <select class="select" id="rc-method">
        <option value="现金">💵 现金</option>
        <option value="微信">📱 微信支付</option>
        <option value="支付宝">💳 支付宝</option>
        <option value="银行卡">🏦 银行卡</option>
        <option value="会员卡">💎 会员卡转账</option>
      </select>
    </div>
    <div class="form-item"><label>赠送积分</label><input class="input" id="rc-points" type="number" placeholder="如 500" value="500" /></div>
    <div class="muted" style="font-size:12px">💡 充值后余额将实时更新，积分同步到会员账户</div>
  `, () => {
    const a = parseFloat($('rc-amount').value);
    if (!a || a <= 0) return toast('请输入有效充值金额');
    const method = $('rc-method').value;
    const methodNames = { '现金': '现金', '微信': '微信支付', '支付宝': '支付宝', '银行卡': '银行卡', '会员卡': '会员卡转账' };
    m.balance += a;
    m.points += parseInt($('rc-points').value || 0);
    toast('充值成功：' + fmtMoney(a) + '（' + methodNames[method] + '），当前余额 ' + fmtMoney(m.balance));
    renderMember($('content'));
  }, '确认充值');
}

// 编辑会员弹窗
function editMember(id) {
  var m = DB.members.find(function(x) { return x.id === id; });
  if (!m) return;
  openModal('编辑会员 - ' + m.name, `
    <div class="form-item"><label>会员号</label><div class="input" style="background:#fafafa">${m.id}</div></div>
    <div class="form-item"><label>姓名 <span style="color:#e74c3c">*</span></label><input class="input" id="em-name" value="${m.name}" /></div>
    <div class="form-item"><label>手机号</label><input class="input" id="em-phone" value="${m.phone}" /></div>
    <div class="form-item"><label>会员等级</label>
      <select class="select" id="em-level">
        <option${m.level === '普通会员' ? ' selected' : ''}>普通会员</option>
        <option${m.level === '银卡' ? ' selected' : ''}>银卡</option>
        <option${m.level === '金卡' ? ' selected' : ''}>金卡</option>
        <option${m.level === '铂金卡' ? ' selected' : ''}>铂金卡</option>
        <option${m.level === '钻石卡' ? ' selected' : ''}>钻石卡</option>
      </select>
    </div>
    <div class="form-item"><label>账户状态</label>
      <select class="select" id="em-status">
        <option value="active"${m.status === 'active' ? ' selected' : ''}>正常</option>
        <option value="frozen"${m.status === 'frozen' ? ' selected' : ''}>冻结</option>
      </select>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>调整余额（±元）</label><input class="input" id="em-balance-adj" type="number" placeholder="正增负减，如 -50" /></div>
      <div class="form-item" style="flex:1"><label>调整积分（±）</label><input class="input" id="em-points-adj" type="number" placeholder="正增负减" /></div>
    </div>
  `, function() {
    var name = $('em-name').value.trim();
    if (!name) return toast('请输入姓名');
    m.name = name;
    m.phone = $('em-phone').value || m.phone;
    m.level = $('em-level').value;
    m.status = $('em-status').value;
    var balAdj = parseFloat($('em-balance-adj').value || 0);
    if (balAdj) m.balance = Math.max(0, m.balance + balAdj);
    // 积分调整：统一从 em-points-adj 读取（该元素必存在于弹窗内）
    var ptsEl = document.getElementById('em-points-adj');
    var ptsAdjVal = parseInt((ptsEl && ptsEl.value) || 0);
    if (ptsAdjVal) m.points = Math.max(0, m.points + ptsAdjVal);
    toast('会员信息已更新：' + name);
    renderMember($('content'));
  }, '保存修改');
}

// 新增会员弹窗
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

// ===== 散客区 =====
const WALKIN_SOURCES = ['路过', '朋友推荐', '网络平台', '团购', '其他'];
const WALKIN_STATUSES = { active: '在场', checkedout: '已离店', blacklist: '黑名单' };
const WALKIN_SOURCE_TAGS = { '路过': 'tag-gray', '朋友推荐': 'tag-blue', '网络平台': 'tag-green', '团购': 'tag-orange', '其他': 'tag-gray' };

function walkinSourceTag(src) {
  return '<span class="tag ' + (WALKIN_SOURCE_TAGS[src] || 'tag-gray') + '">' + src + '</span>';
}

// 来源字段 —— 可点击编辑版本（内联下拉）
function walkinSourceEditable(id, src) {
  return '<div class="source-edit-wrap" id="source-wrap-' + id + '">' +
    '<span class="tag ' + (WALKIN_SOURCE_TAGS[src] || 'tag-gray') + ' source-tag" onclick="toggleSourceEdit(\'' + id + '\',\'' + src + '\')" title="点击修改来源">' +
    src + ' <small style="opacity:.5;margin-left:2px">✎</small></span>' +
    '</div>';
}

// 切换来源编辑下拉
function toggleSourceEdit(id, currentSrc) {
  var wrap = document.getElementById('source-wrap-' + id);
  if (!wrap) return;
  // 如果已展开则收起
  if (wrap.querySelector('.source-select')) {
    renderWalkin($('content'));
    return;
  }
  var tag = wrap.querySelector('.source-tag');
  if (tag) tag.style.display = 'none';
  // 创建内联select
  var sel = document.createElement('select');
  sel.className = 'select source-select';
  sel.style.cssText = 'width:100%;height:30px;font-size:12.5px;border-radius:6px;cursor:pointer;';
  WALKIN_SOURCES.forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    if (s === currentSrc) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function() { quickChangeSource(id, this.value); });
  sel.addEventListener('blur', function() { setTimeout(function() { renderWalkin($('content')); }, 150); });
  wrap.appendChild(sel);
  sel.focus();
}

// 快速修改来源（不弹窗，直接更新）
function quickChangeSource(id, newSource) {
  var g = DB.walkinGuests.find(function(x) { return x.id === id; });
  if (!g) return;
  var old = g.source;
  g.source = newSource;
  persistData();
  toast('来源已更新：' + old + ' → ' + newSource);
  renderWalkin($('content'));
}

function walkinStatusSelect(id, status) {
  return '<select class="mem-status-select" onchange="changeWalkinStatus(\'' + id + '\', this.value)">' +
    Object.keys(WALKIN_STATUSES).map(function(k) {
      return '<option value="' + k + '"' + (k === status ? ' selected' : '') + '>' + WALKIN_STATUSES[k] + '</option>';
    }).join('') + '</select>';
}

function changeWalkinStatus(wid, newStatus) {
  var g = DB.walkinGuests.find(function(x) { return x.id === wid; });
  if (g) {
    var old = WALKIN_STATUSES[g.status] || g.status;
    g.status = newStatus;
    var nw = WALKIN_STATUSES[newStatus] || newStatus;
    toast('散客「' + g.name + '」状态：' + old + ' → ' + nw);
    renderWalkin($('content'));
  }
}

function renderWalkin(c) {
  var kw = walkinKeyword || '';
  var list = DB.walkinGuests.filter(function(g) {
    if (!kw) return true;
    return g.name.indexOf(kw) !== -1 || g.phone.indexOf(kw) !== -1 || g.id.indexOf(kw) !== -1;
  });
  var total = DB.walkinGuests.length;
  var convertedCnt = DB.walkinGuests.filter(function(g) { return g.converted; }).length;
  var convRate = total ? Math.round(convertedCnt / total * 100) : 0;

  c.innerHTML =
    '<div class="page-head">' +
      '<div style="display:flex;gap:10px;align-items:center">' +
        '<button class="btn btn-text" onclick="resetDemoData()" title="清除本地缓存，恢复初始演示数据">↺ 重置数据</button>' +
        '<button class="btn btn-primary" onclick="addWalkinGuest()">+ 新增散客</button>' +
      '</div>' +
    '</div>' +
    '<div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">' +
      '<div class="stat-card"><div class="stat-icon">🚶</div><div class="stat-label">散客总数</div><div class="stat-value">' + total + '</div><div class="stat-trend" style="color:var(--text-3)">当前在册散客</div></div>' +
      '<div class="stat-card"><div class="stat-icon" style="color:#7c3aed">👑</div><div class="stat-label">已转会员</div><div class="stat-value" style="color:#7c3aed">' + convertedCnt + '</div><div class="stat-trend" style="color:var(--text-3)">累计转化人数</div></div>' +
      '<div class="stat-card"><div class="stat-icon" style="color:#16a34a">📈</div><div class="stat-label">转化率</div><div class="stat-value" style="color:#16a34a">' + convRate + '%</div><div class="stat-trend" style="color:var(--text-3)">已转化 / 散客总数</div></div>' +
    '</div>' +
    '<div class="filter-bar">' +
      '<input class="search-input" placeholder="搜索姓名/手机号/散客号" value="' + esc(kw) + '" oninput="walkinKeyword=this.value;renderWalkin($(\'content\'))" />' +
      '<span class="muted">共 ' + list.length + ' 位散客</span>' +
    '</div>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>散客号</th><th>姓名</th><th>手机号</th><th>来源</th><th>到访次数</th><th>累计消费</th><th>最近到访</th><th>状态</th><th>操作</th></tr></thead>' +
      '<tbody>' + list.map(function(g) {
        return '<tr>' +
          '<td>' + g.id + '</td>' +
          '<td>' + esc(g.name) + '</td>' +
          '<td>' + esc(g.phone) + '</td>' +
          '<td>' + walkinSourceEditable(g.id, g.source) + '</td>' +
          '<td>' + g.visitCount + ' 次</td>' +
          '<td><b>' + fmtMoney(g.totalSpent) + '</b></td>' +
          '<td>' + g.lastVisit + '</td>' +
          '<td>' + walkinStatusSelect(g.id, g.status) + '</td>' +
          '<td class="row-actions">' +
            (g.converted ? '<span class="tag tag-purple" style="font-size:11px">已转会员</span> ' : '<span class="text-link" style="color:#1677ff;font-weight:600" onclick="convertToMember(\'' + g.id + '\')">👑 转会员</span>') +
            '<span class="text-link" onclick="editWalkinGuest(\'' + g.id + '\')">编辑</span>' +
            '<span class="text-link" style="color:#e74c3c" onclick="deleteWalkinGuest(\'' + g.id + '\')">删除</span>' +
          '</td></tr>';
      }).join('') + '</tbody></table></div>';
}

// 生成下一个散客号：取现有最大编号 +1，避免删除后重号
function nextWalkinId() {
  var max = 10000;
  DB.walkinGuests.forEach(function(g) {
    var n = parseInt(String(g.id).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return 'W' + (max + 1);
}

// 新增散客弹窗
function addWalkinGuest() {
  openModal('新增散客',
    '<div class="form-item"><label>姓名 <span style="color:#e74c3c">*</span></label><input class="input" id="wg-name" placeholder="请输入姓名" /></div>' +
    '<div class="form-item"><label>手机号</label><input class="input" id="wg-phone" placeholder="11位手机号" /></div>' +
    '<div class="form-item"><label>来源渠道</label>' +
      '<select class="select" id="wg-source">' +
        WALKIN_SOURCES.map(function(s) { return '<option>' + s + '</option>'; }).join('') +
      '</select></div>' +
    '<div class="form-item"><label>本次消费金额</label><input class="input" id="wg-amount" type="number" placeholder="如 88" value="0" /></div>',
    function() {
      var name = $('wg-name').value.trim();
      if (!name) return toast('请输入姓名');
      var id = nextWalkinId();
      DB.walkinGuests.unshift({
        id: id,
        name: name,
        phone: $('wg-phone').value || '—',
        source: $('wg-source').value,
        visitCount: 1,
        totalSpent: parseFloat($('wg-amount').value || 0),
        lastVisit: new Date().toISOString().slice(0, 10),
        status: 'active'
      });
      toast('散客添加成功：' + name);
      renderWalkin($('content'));
    }, '确认新增');
}

// 编辑散客弹窗
function editWalkinGuest(id) {
  var g = DB.walkinGuests.find(function(x) { return x.id === id; });
  if (!g) return;
  openModal('编辑散客 - ' + g.name,
    '<div class="form-item"><label>散客号</label><div class="input" style="background:#fafafa">' + g.id + '</div></div>' +
    '<div class="form-item"><label>姓名 <span style="color:#e74c3c">*</span></label><input class="input" id="eg-name" value="' + esc(g.name) + '" /></div>' +
    '<div class="form-item"><label>手机号</label><input class="input" id="eg-phone" value="' + esc(g.phone) + '" /></div>' +
    '<div class="form-item"><label>来源渠道</label>' +
      '<select class="select" id="eg-source">' +
        WALKIN_SOURCES.map(function(s) { return '<option' + (s === g.source ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
      '</select></div>' +
    '<div class="form-item"><label>到访状态</label>' +
      '<select class="select" id="eg-status">' +
        Object.keys(WALKIN_STATUSES).map(function(k) { return '<option value="' + k + '"' + (k === g.status ? ' selected' : '') + '>' + WALKIN_STATUSES[k] + '</option>'; }).join('') +
      '</select></div>' +
    '<div style="display:flex;gap:12px">' +
      '<div class="form-item" style="flex:1"><label>调整到访次数（±）</label><input class="input" id="eg-visit-adj" type="number" placeholder="如 1" /></div>' +
      '<div class="form-item" style="flex:1"><label>调整累计消费（±元）</label><input class="input" id="eg-spend-adj" type="number" placeholder="如 -50" /></div>' +
    '</div>',
    function() {
      var name = $('eg-name').value.trim();
      if (!name) return toast('请输入姓名');
      g.name = name;
      g.phone = $('eg-phone').value || g.phone;
      g.source = $('eg-source').value;
      g.status = $('eg-status').value;
      var vAdj = parseInt($('eg-visit-adj').value || 0);
      var sAdj = parseFloat($('eg-spend-adj').value || 0);
      if (vAdj) g.visitCount = Math.max(1, g.visitCount + vAdj);
      if (sAdj) g.totalSpent = Math.max(0, g.totalSpent + sAdj);
      toast('散客信息已更新：' + name);
      renderWalkin($('content'));
    }, '保存修改');
}

// 删除散客（带确认）
function deleteWalkinGuest(id) {
  var g = DB.walkinGuests.find(function(x) { return x.id === id; });
  if (!g) return;
  openModal('⚠️ 确认删除',
    '<p style="font-size:14px;color:#5a6a7e;margin:8px 0">确定要删除散客 <b>' + esc(g.name) + '</b>(' + g.id + ') 吗？</p>' +
    '<p style="font-size:12px;color:#999">此操作不可撤销。</p>',
    function() {
      var idx = DB.walkinGuests.findIndex(function(x) { return x.id === id; });
      if (idx !== -1) { DB.walkinGuests.splice(idx, 1); }
      toast('已删除散客：' + g.name);
      renderWalkin($('content'));
    }, '确认删除');
}

// ===== 散客转会员模块 =====

// 会员等级权益配置（增强版 —— 每级含升级条件与专属权益描述）
const MEMBER_BENEFITS = [
  { level: '普通会员', icon: '🥉', discount: '9.8折', color: '#94a3b8', bgColor: '#f8fafc',
    upgrade: '注册即享', price: '免费',
    features: ['基础会员折扣', '积分累计1倍/元', '生日当月8.8折', '在线预约服务'] },
  { level: '银卡', icon: '🥈', discount: '9.5折', color: '#64748b', bgColor: '#f1f5f9',
    upgrade: '首充≥500元', price: '￥500起',
    features: ['银卡专属折扣', '积分累计1.2倍/元', '生日当月8.5折', '每月1次免费茶点', '优先排队'] },
  { level: '金卡', icon: '🥇', discount: '9.0折', color: '#d97706', bgColor: '#fffbf0',
    upgrade: '首充≥1000元', price: '￥1000起',
    features: ['金卡专属折扣', '积分累计1.5倍/元', '生日当月8折', '每月2次免费茶点', 'VIP休息区', '免费停车2h'] },
  { level: '铂金卡', icon: '💎', discount: '8.5折', color: '#7c3aed', bgColor: '#f6f2ff',
    upgrade: '首充≥3000元', price: '￥3000起',
    features: ['铂金专属折扣', '积分累计2倍/元', '生日免单1次(限¥200)', '无限次免费茶点', 'VIP包厢优先', '免费停车4h', '专属客服'] },
  { level: '钻石卡', icon: '👑', discount: '8.0折', color: '#dc2626', bgColor: '#fef3f2',
    upgrade: '首充≥5000元', price: '￥5000起',
    features: ['钻石专属折扣', '积分累计3倍/元', '生日免单1次(限¥500)', '全品类免费茶点', 'VIP私汤预留', '免费停车不限', '专属客服+技师', '年度健康体检'] }
];

// 转化步骤状态
let convertStep = 1;
let convertSelectedLevel = 2; // 默认推荐金卡
let convertGuestId = null;

// 主入口：点击"转会员"
function convertToMember(guestId) {
  var g = DB.walkinGuests.find(function(x) { return x.id === guestId; });
  if (!g) return;
  if (g.status === 'blacklist') { toast('黑名单用户无法转为会员'); return; }
  if (g.converted) { toast('该散客已于 ' + (g.convertDate || '') + ' 转为会员 ' + g.convertedTo); return; }

  convertGuestId = guestId;
  convertStep = 1;
  convertSelectedLevel = 2; // 默认推荐金卡

  renderConvertModal(g);
}

// 渲染转化弹窗（多步骤 —— 内容丰富版）
function renderConvertModal(guest) {
  // 步骤条
  var stepsHtml = '';
  for (var i = 1; i <= 4; i++) {
    var cls = i === convertStep ? 'active' : (i < convertStep ? 'done' : '');
    var lineCls = i < 4 ? (i < convertStep ? 'done' : '') : '';
    stepsHtml += '<div class="convert-step ' + cls + '">' +
      '<div class="convert-step-num">' + (i < convertStep ? '✓' : i) + '</div>' +
      '<span class="convert-step-label">' + ['','查看权益','选卡类型','填写信息','完成'][i] + '</span>' +
      '</div>';
    if (i < 4) stepsHtml += '<div class="convert-step-line ' + lineCls + '"></div>';
  }

  var bodyHtml = '<div class="convert-steps">' + stepsHtml + '</div>';

  if (convertStep === 1) {
    // ===== Step 1: 权益展示（增强版） =====
    bodyHtml += '<div class="benefits-header">' +
      '<h3>🏆 悦泉会员权益体系</h3>' +
      '<p>选择适合的会员等级，即刻享受专属特权与超值优惠</p></div>';
    bodyHtml += '<div class="benefits-grid">';
    for (var bi = 0; bi < MEMBER_BENEFITS.length; bi++) {
      var b = MEMBER_BENEFITS[bi];
      var sel = bi === convertSelectedLevel ? ' selected' : '';
      var rec = bi === 2 ? ' recommended' : '';
      bodyHtml += '<div class="benefit-card' + sel + rec + '" onclick="selectBenefitLevel(' + bi + ')" style="--bc-primary:' + b.color + ';--bc-accent:' + b.bgColor + '">' +
        '<div class="benefit-icon">' + b.icon + '</div>' +
        '<div class="benefit-name">' + b.level + '</div>' +
        '<div class="benefit-discount">' + b.discount + '</div>' +
        '<ul class="benefit-features">' + b.features.map(function(f){ return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }
    bodyHtml += '</div>';
    // 已选等级提示
    var curB = MEMBER_BENEFITS[convertSelectedLevel];
    bodyHtml += '<div style="padding:14px 30px;background:linear-gradient(135deg,#eff6ff,#f0f9ff);border-top:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;gap:12px;">' +
      '<span style="font-size:13px;color:#475569">已选择：</span>' +
      '<span style="font-size:15px;font-weight:800;color:#2563eb">' + curB.icon + ' ' + curB.level + '（' + curB.discount + '）</span>' +
      '<span style="font-size:12px;color:#64748b;padding:2px 10px;background:#fff;border-radius:8px;border:1px solid #e2e8f0">' + curB.upgrade + '</span>' +
      '</div>';
    bodyHtml += '<div class="benefits-footer"><button class="btn btn-primary" onclick="nextConvertStep()">下一步：选择此等级 →</button></div>';

  } else if (convertStep === 2) {
    // ===== Step 2: 确认卡类型 + 储值选择（增强版：卡片式储值选项） =====
    var bSel = MEMBER_BENEFITS[convertSelectedLevel];
    bodyHtml += '<div class="convert-form-area">';
    // 散客信息卡片
    bodyHtml += '<div class="convert-guest-info">' +
      '<div class="convert-guest-avatar">' + guest.name.charAt(0) + '</div>' +
      '<div class="convert-guest-detail">' +
      '<div class="convert-guest-name">' + esc(guest.name) + ' <span style="font-weight:400;font-size:14px;color:var(--text-3)">→ 申请成为会员</span></div>' +
      '<div class="convert-guest-meta">📱 ' + esc(guest.phone) + ' &nbsp;|&nbsp; 🕐 到访 <b>' + guest.visitCount + '</b> 次 &nbsp;|&nbsp; 💰 累计消费 <b>' + fmtMoney(guest.totalSpent) + '</b> &nbsp;|&nbsp; 来源：<b>' + (guest.source || '到店') + '</b></div>' +
      '</div></div>';

    // 已选会员等级展示
    bodyHtml += '<div style="background:' + bSel.bgColor + ';border:2px solid ' + bSel.color + ';border-radius:14px;padding:18px 22px;margin-bottom:22px;display:flex;align-items:center;gap:16px">' +
      '<div style="font-size:40px">' + bSel.icon + '</div>' +
      '<div style="flex:1"><div style="font-size:18px;font-weight:800;color:' + bSel.color + '">' + bSel.level + '</div>' +
      '<div style="font-size:24px;font-weight:900;color:' + bSel.color + ';margin-top:2px">' + bSel.discount + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:12px;color:' + bSel.color + ';font-weight:600">升级条件</div><div style="font-size:15px;font-weight:700;color:' + bSel.color + '">' + bSel.price + '</div></div>' +
      '</div>';

    // 储值方案 —— 卡片式选择
    bodyHtml += '<div class="cm-form-section-title">💳 选择储值方案（可选，充值享赠送）</div>';
    bodyHtml += '<div class="recharge-options">';
    var rechargePlans = [
      { amt: 0, bonus: 0, label: '暂不储值', tip: '先开通后充值', popular: false },
      { amt: 500, bonus: 0, label: '￥500', tip: '', popular: false },
      { amt: 1000, bonus: 200, label: '￥1000', tip: '送￥200', popular: true },
      { amt: 2000, bonus: 500, label: '￥2000', tip: '送￥500', popular: false },
      { amt: 3000, bonus: 800, label: '￥3000', tip: '送￥800', popular: false },
      { amt: 5000, bonus: 1500, label: '￥5000', tip: '送￥1500', popular: false }
    ];
    for (var ri = 0; ri < rechargePlans.length; ri++) {
      var rp = rechargePlans[ri];
      var popCls = rp.popular ? ' popular' : '';
      var ptsEst = Math.floor(rp.amt * (convertSelectedLevel + 1)) + 100;
      bodyHtml += '<div class="recharge-card' + popCls + '" data-amt="' + rp.amt + '" onclick="selectRecharge(this,' + rp.amt + ')">' +
        '<div class="rc-amount">' + rp.label + '</div>' +
        (rp.bonus > 0 ? '<div class="rc-bonus">🎁 ' + rp.tip + '</div>' : '<div class="rc-bonus" style="color:var(--text-3)">' + rp.tip + '</div>') +
        '<div class="rc-points">≈ ' + ptsEst.toLocaleString() + ' 积分</div>' +
        '</div>';
    }
    bodyHtml += '</div>';
    // 隐藏的select供JS读取
    bodyHtml += '<input type="hidden" id="cv-recharge" value="1000" />';

    bodyHtml += '<div style="display:flex;gap:12px;margin-top:26px"><button class="btn btn-text" onclick="prevConvertStep()" style="height:44px;font-size:14px">← 上一步</button><button class="btn btn-primary" style="flex:1;height:48px;font-size:15px;font-weight:700;border-radius:12px" onclick="nextConvertStep()">下一步：填写信息 →</button></div>';
    bodyHtml += '</div>';

  } else if (convertStep === 3) {
    // ===== Step 3: 信息采集表单（增强版） =====
    var bSel3 = MEMBER_BENEFITS[convertSelectedLevel];
    bodyHtml += '<div class="convert-form-area">';
    bodyHtml += '<div class="convert-guest-info"><div class="convert-guest-avatar">' + guest.name.charAt(0) + '</div><div class="convert-guest-detail"><div class="convert-guest-name">' + esc(guest.name) + ' → ' + bSel3.icon + ' ' + bSel3.level + ' 注册</div><div class="convert-guest-meta">完善以下信息即可完成会员开通 · 所有字段均加密存储</div></div></div>';

    // 基本信息
    bodyHtml += '<div class="cm-form-section"><div class="cm-form-section-title">📝 基本信息（必填）</div>';
    bodyHtml += '<div class="form-row">';
    bodyHtml += '<div class="form-item"><label>真实姓名 <span style="color:#e74c3c">*</span></label><input class="input" id="cm-name" value="' + esc(guest.name) + '" placeholder="请输入真实姓名，用于身份核验" /></div>';
    bodyHtml += '<div class="form-item"><label>手机号码 <span style="color:#e74c3c">*</span></label><input class="input" id="cm-phone" value="' + (guest.phone && guest.phone !== '—' ? guest.phone.replace(/\*+/g, '') : '') + '" placeholder="11位手机号，用于接收通知" /></div>';
    bodyHtml += '</div></div>';

    // 补充信息
    bodyHtml += '<div class="cm-form-section"><div class="cm-form-section-title">👤 补充信息（选填，提升服务体验）</div>';
    bodyHtml += '<div class="form-row">';
    bodyHtml += '<div class="form-item"><label>性别</label><select class="select" id="cm-gender"><option value="">请选择</option><option value="男" selected>男</option><option value="女">女</option></select></div>';
    bodyHtml += '<div class="form-item"><label>出生日期</label><input class="input" id="cm-birthday" type="date" placeholder="生日当月享特别折扣" /></div>';
    bodyHtml += '</div>';
    bodyHtml += '<div class="form-item"><label>备注信息</label><input class="input" id="cm-note" placeholder="如：过敏史、特殊需求、偏好技师等（可选）" /></div>';
    bodyHtml += '</div>';

    // 权益预览
    bodyHtml += '<div class="cm-benefit-preview"><div class="cm-benefit-preview-title">🎉 开通即享 · ' + bSel3.icon + ' ' + bSel3.level + ' 专属权益</div><div class="cm-benefit-preview-list">';
    for (var fi = 0; fi < bSel3.features.length; fi++) {
      bodyHtml += '<span>✓ ' + bSel3.features[fi] + '</span>';
    }
    bodyHtml += '</div></div>';

    bodyHtml += '<div style="display:flex;gap:12px;margin-top:22px"><button class="btn btn-text" onclick="prevConvertStep()" style="height:44px;font-size:14px">← 上一步</button><button class="btn btn-primary" style="flex:1;height:48px;font-size:15px;font-weight:700;border-radius:12px" onclick="submitConvertMember()">✓ 确认开通会员</button></div>';
    bodyHtml += '</div>';

  } else if (convertStep === 4) {
    // ===== Step 4: 完成成功页（增强版） =====
    bodyHtml += '<div class="convert-success">';
    bodyHtml += '<div class="convert-success-icon">✓</div>';
    bodyHtml += '<h3>🎊 会员开通成功！</h3>';
    bodyHtml += '<p>欢迎加入悦泉洗浴会员大家庭<br/>您的会员账号已生成，权益即时生效</p>';
    bodyHtml += '<div class="convert-success-stats" id="convert-success-stats"></div>';
    bodyHtml += '<div class="convert-success-tip">💡 提示：会员卡已同步至系统，下次到店报手机号或出示会员号即可享受全部权益</div>';
    bodyHtml += '<button class="btn btn-primary" style="margin-top:20px;padding:0 40px;height:48px;font-size:16px;font-weight:700;border-radius:12px" onclick="closeConvertModal()">👥 查看会员列表</button>';
    bodyHtml += '</div>';
  }

  openModal('散客转会员', bodyHtml, function() {}, '✓ 确认');
  // 给弹窗加特殊class，隐藏默认footer（转化流程有自己按钮）
  var modals = document.querySelectorAll('.modal');
  if (modals.length > 0) {
    var m = modals[modals.length - 1];
    m.classList.add('convert-modal');
    var foot = m.querySelector('.modal-foot');
    if (foot) foot.style.display = 'none';
    // Step 2 时自动选中默认储值卡片
    if (convertStep === 2) {
      setTimeout(function() {
        var defaultCard = m.querySelector('.recharge-card[data-amt="1000"]');
        if (defaultCard) selectRecharge(defaultCard, 1000);
      }, 80);
    }
  }
}

// 选择权益等级
function selectBenefitLevel(idx) {
  convertSelectedLevel = idx;
  renderConvertModal(DB.walkinGuests.find(function(x) { return x.id === convertGuestId; }));
}

// 选择储值方案（卡片式）
function selectRecharge(el, amt) {
  // 移除其他选中
  var cards = document.querySelectorAll('.recharge-card');
  for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('selected'); }
  el.classList.add('selected');
  // 更新隐藏字段
  var hidden = document.getElementById('cv-recharge');
  if (hidden) hidden.value = String(amt);
}

// 下一步
function nextConvertStep() {
  if (convertStep < 4) { convertStep++; renderConvertModal(DB.walkinGuests.find(function(x) { return x.id === convertGuestId; })); }
}

// 上一步
function prevConvertStep() {
  if (convertStep > 1) { convertStep--; renderConvertModal(DB.walkinGuests.find(function(x) { return x.id === convertGuestId; })); }
}

// 储值赠送规则（与下拉选项文案保持一致）
const RECHARGE_BONUS = { 0: 0, 500: 0, 1000: 200, 2000: 500, 3000: 800, 5000: 1500 };
function rechargeBonus(amt) {
  return RECHARGE_BONUS[amt] !== undefined ? RECHARGE_BONUS[amt] : 0;
}

// 生成下一个会员号：取现有最大编号 +1
function nextMemberId() {
  var max = 10000;
  DB.members.forEach(function(m) {
    var n = parseInt(String(m.id).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return 'M' + (max + 1);
}

// 提交转化 —— 创建会员记录 + 持久化
function submitConvertMember() {
  var name = $('cm-name').value.trim();
  var phone = $('cm-phone').value.trim();
  if (!name) return toast('请输入姓名');
  if (!phone || phone.length < 11) return toast('请输入有效的手机号');

  var guest = DB.walkinGuests.find(function(x) { return x.id === convertGuestId; });
  if (!guest) return toast('散客数据异常');

  var benefit = MEMBER_BENEFITS[convertSelectedLevel];
  var rechargeAmt = parseInt($('cv-recharge').value || '1000', 10) || 0;
  var bonusAmt = rechargeBonus(rechargeAmt);

  // 生成新会员号（取现有最大编号 +1，避免跳号与重号）
  var newId = nextMemberId();
  var nowStr = new Date().toISOString().slice(0, 10);

  // 创建会员记录
  var newMember = {
    id: newId,
    name: name,
    phone: phone.indexOf('*') > -1 ? guest.phone : (phone.substring(0, 3) + '****' + phone.substring(7)),
    level: benefit.level,
    balance: rechargeAmt + bonusAmt,          // 储值本金 + 赠送金额
    points: Math.floor(rechargeAmt * (convertSelectedLevel + 1)) + 100, // 等级倍率积分 + 开卡礼100
    regDate: nowStr,
    status: 'active',
    sourceWalkin: guest.id, // 记录来源散客
    gender: $('cm-gender').value || '',
    birthday: $('cm-birthday').value || '',
    note: $('cm-note').value || ''
  };

  // 添加到内存数据库
  DB.members.push(newMember);

  // 标记散客为已转化
  guest.converted = true;
  guest.convertedTo = newId;
  guest.convertDate = nowStr;

  // 持久化到 localStorage
  persistData();

  // 进入完成页，显示结果
  convertStep = 4;
  renderConvertModal(guest);

  // 填充成功统计数据（增强版）
  setTimeout(function() {
    var statsEl = document.getElementById('convert-success-stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="convert-success-stat"><div class="convert-success-stat-val" style="font-size:20px">' + newId + '</div><div class="convert-success-stat-lbl">会员号</div></div>' +
        '<div class="convert-success-stat"><div class="convert-success-stat-val" style="font-size:22px">' + benefit.icon + ' ' + benefit.level + '</div><div class="convert-success-stat-lbl">会员等级</div></div>' +
        '<div class="convert-success-stat"><div class="convert-success-stat-val" style="color:#16a34a">￥' + (newMember.balance).toLocaleString() + '</div><div class="convert-success-stat-lbl">卡内余额' + (bonusAmt > 0 ? '（含赠￥' + bonusAmt.toLocaleString() + '）' : '') + '</div></div>' +
        '<div class="convert-success-stat"><div class="convert-success-stat-val" style="color:#f59e0b">' + newMember.points.toLocaleString() + '</div><div class="convert-success-stat-lbl">赠送积分</div></div>';
    }
  }, 50);

  toast('🎉 恭喜「' + name + '」成为悦泉' + benefit.level + '会员！');
}

// 关闭转化弹窗后刷新页面
function closeConvertModal() {
  var masks = document.querySelectorAll('.modal-mask');
  if (masks.length > 0) { masks[masks.length - 1].remove(); }
  render('member'); // 跳转到会员列表
}

// 数据持久化 —— localStorage
const DATA_VERSION = 5; // data.js 结构变更时递增，旧缓存自动失效

function persistData() {
  try {
    var dataToSave = {
      _v: DATA_VERSION,
      _savedAt: new Date().toISOString(),
      members: DB.members,
      walkinGuests: DB.walkinGuests,
      orders: DB.orders,
      inventory: DB.inventory,
      inventoryLog: DB.inventoryLog,
      tasks: DB.tasks,
      reviews: DB.reviews,
      lockers: DB.lockers,
      coupons: DB.coupons,
      packages: DB.packages,
      services: DB.services,
      technicians: DB.technicians,
      employees: DB.employees,
      reservations: DB.reservations
    };
    localStorage.setItem('bathcenter_data', JSON.stringify(dataToSave));
  } catch(e) {
    console.warn('持久化失败:', e);
  }
}

// 加载持久化数据
function loadPersistedData() {
  try {
    var saved = localStorage.getItem('bathcenter_data');
    if (saved) {
      var data = JSON.parse(saved);
      // 版本不一致 → 丢弃旧缓存，使用 data.js 的最新种子数据
      if (data._v !== DATA_VERSION) {
        localStorage.removeItem('bathcenter_data');
        return;
      }
      if (data.members) DB.members = data.members;
      if (data.walkinGuests) DB.walkinGuests = data.walkinGuests;
      if (data.orders) DB.orders = data.orders;
      if (data.inventory) DB.inventory = data.inventory;
      if (data.inventoryLog) DB.inventoryLog = data.inventoryLog;
      if (data.tasks) DB.tasks = data.tasks;
      if (data.reviews) DB.reviews = data.reviews;
      if (data.lockers) DB.lockers = data.lockers;
      if (data.coupons) DB.coupons = data.coupons;
      if (data.packages) DB.packages = data.packages;
      if (data.services) DB.services = data.services;
      if (data.technicians) DB.technicians = data.technicians;
      if (data.employees) DB.employees = data.employees;
      if (data.reservations) DB.reservations = data.reservations;
    }
  } catch(e) {
    console.warn('加载持久化数据失败:', e);
  }
}
// 重置演示数据：清除本地缓存并重新加载页面
function resetDemoData() {
  openModal('↺ 重置演示数据',
    '<p style="font-size:14px;color:var(--text-2);margin:8px 0">将清除浏览器本地保存的所有业务数据（含新增会员、转化记录等），恢复为初始演示数据。</p>' +
    '<p style="font-size:12px;color:#e74c3c">此操作不可撤销。</p>',
    function() {
      try { localStorage.removeItem('bathcenter_data'); } catch (e) {}
      toast('已重置，正在重新加载…');
      setTimeout(function() { location.reload(); }, 600);
    }, '确认重置');
}

// 页面加载时尝试恢复数据
loadPersistedData();

// 自动持久化兜底：页面关闭/刷新或切到后台时保存，避免任何未显式保存的改动丢失
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('beforeunload', persistData);
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') persistData();
    });
  }
}

// ===== 服务项目 =====
let svcCategory = '';
const SVC_CATEGORIES = ['基础洗浴', '足疗按摩', '按摩SPA', '休闲娱乐', '包厢服务', '美容美体'];
const SVC_STATUSES = { on: '启用', off: '停用' };

function svcStatusSelect(id, status) {
  return '<select class="svc-status-select" onchange="changeSvcStatus(\'' + id + '\', this.value)">' +
    Object.keys(SVC_STATUSES).map(function(k) {
      return '<option value="' + k + '"' + (k === status ? ' selected' : '') + '>' + SVC_STATUSES[k] + '</option>';
    }).join('') + '</select>';
}

function changeSvcStatus(sid, newStatus) {
  var s = DB.services.find(function(x) { return x.id === sid; });
  if (s) { s.status = newStatus; toast('项目「' + s.name + '」状态：' + SVC_STATUSES[newStatus]); renderService($('content')); persistData(); }
}

function renderService(c) {
  const cats = ['全部', ...new Set(DB.services.map(s => s.category))];
  const list = svcCategory && svcCategory !== '全部' ? DB.services.filter(s => s.category === svcCategory) : DB.services;
  c.innerHTML = `
    <div class="page-head"><button class="btn btn-primary" onclick="openAddServiceModal()">+ 新增项目</button></div>
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
            <td>${svcStatusSelect(s.id, s.status)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// 新增服务项目弹窗
function openAddServiceModal() {
  var newId = 'S' + (2010 + DB.services.length);
  openModal('新增服务项目', `
    <div class="form-item"><label>项目名称 <span style="color:#e74c3c">*</span></label><input class="input" id="as-name" placeholder="如：精油开背SPA" /></div>
    <div class="form-item"><label>项目分类 <span style="color:#e74c3c">*</span></label>
      <select class="select" id="as-category">${SVC_CATEGORIES.map(function(c){ return '<option>' + c + '</option>'; }).join('')}</select>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>价格（元）<span style="color:#e74c3c">*</span></label><input class="input" id="as-price" type="number" placeholder="如 298" /></div>
      <div class="form-item" style="flex:1"><label>时长（分钟）<span style="color:#e74c3c">*</span></label><input class="input" id="as-duration" type="number" placeholder="如 60" /></div>
    </div>
    <div class="form-item"><label>技师要求</label>
      <select class="select" id="as-tech"><option value="不限">不限</option><option value="需指定">需指定</option></select>
    </div>
    <div class="form-item"><label>项目描述</label><textarea class="input" id="as-desc" rows="3" placeholder="简要描述该项目的内容和特色..." style="resize:vertical"></textarea></div>
  `, function() {
    var name = $('as-name').value.trim();
    if (!name) return toast('请输入项目名称');
    var price = parseFloat($('as-price').value);
    if (!price || price <= 0) return toast('请输入有效价格');
    var dur = parseInt($('as-duration').value);
    if (!dur || dur <= 0) return toast('请输入有效时长');
    DB.services.push({
      id: newId, name: name, category: $('as-category').value,
      price: price, duration: dur, technician: $('as-tech').value,
      status: 'on', desc: $('as-desc').value.trim()
    });
    toast('新增项目成功：' + name + '（' + fmtMoney(price) + '）');
    renderService($('content'));
  }, '保存');
}

// ===== 前台收银（增强版） =====
let cart = [];          // { id, name, price, qty, categoryId }
let cashierFilter = '全部';
let selectedCoupon = null;
let orderNote = '';
let assignedRoom = '';
let assignedTech = '';

function renderCashier(c) {
  const cats = ['全部', ...new Set(DB.services.map(s => s.category))];
  const svcList = cashierFilter === '全部' ? DB.services.filter(s => s.status === 'on') : DB.services.filter(s => s.status === 'on' && s.category === cashierFilter);
  const memberId = $('cash-member') ? $('cash-member').value : '';
  const member = memberId ? DB.members.find(m => m.id === memberId) : null;

  // 计算金额
  const originalTotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  let discountAmount = 0;
  let discountLabel = '';
  if (selectedCoupon && originalTotal > 0) {
    if (selectedCoupon.type === '满减') {
      const match = selectedCoupon.rule.match(/满(\d+)减(\d+)/);
      if (match && originalTotal >= parseInt(match[1])) {
        discountAmount = parseInt(match[2]);
        discountLabel = `满减 -${fmtMoney(discountAmount)}`;
      }
    } else if (selectedCoupon.type === '折扣') {
      const match = selectedCoupon.rule.match(/(\d+\.?\d*)折/);
      if (match) {
        const rate = parseFloat(match[1]) / 10;
        discountAmount = Math.round(originalTotal * (1 - rate));
        discountLabel = `${match[1]}折 -${fmtMoney(discountAmount)}`;
      }
    } else if (selectedCoupon.type === '赠品') {
      discountLabel = '赠品券（已享受）';
    }
  }
  // 会员折扣（非赠品券时额外8.8折）
  let memberDiscount = 0;
  let memberDiscountLabel = '';
  if (member && selectedCoupon?.type !== '赠品' && selectedCoupon?.type !== '折扣') {
    memberDiscount = Math.round(originalTotal * 0.12); // 8.8折 = 减12%
    memberDiscountLabel = '会员8.8折';
  }
  const finalTotal = Math.max(0, originalTotal - discountAmount - memberDiscount);

  c.innerHTML = `
    <div class="page-head"><span class="muted">当前门店：${DB.store.current}</span></div>
    <div class="cashier-grid">
      <!-- 左侧：服务项目 -->
      <div class="order-panel">
        <div class="chart-title">可选项目</div>
        <input class="search-input" placeholder="🔍 搜索服务项目..." value="" oninput="cashierSearch=this.value;renderCashier($('content'))" style="margin-bottom:10px" />
        <div class="svc-cat-tabs">${cats.map(cat => `<button class="btn btn-sm ${cashierFilter === cat ? 'btn-primary' : ''}" onclick="cashierFilter='${cat}';renderCashier($('content'))">${cat}</button>`).join('')}</div>
        <div style="max-height:380px;overflow:auto;padding-right:4px">
          ${svcList.filter(s => !cashierSearch || s.name.includes(cashierSearch) || s.category.includes(cashierSearch)).map(s => {
            const inCart = cart.find(x => x.id === s.id);
            return `
            <div class="svc-card ${inCart ? 'svc-in-cart' : ''}">
              <div class="svc-info">
                <div class="svc-name"><b>${s.name}</b> ${s.technician === '需指定' ? '<span class="tag tag-orange" style="font-size:11px;margin-left:4px">需技师</span>' : ''}</div>
                <div class="svc-meta"><span class="muted">${s.category}</span> · <span class="muted">${s.duration}分钟</span></div>
                <div class="svc-price">${fmtMoney(s.price)}</div>
              </div>
              <div class="svc-action">
                ${inCart ? `
                  <div class="qty-control">
                    <button class="qty-btn" onclick="cartQty('${s.id}',-1)">−</button>
                    <span class="qty-val">${inCart.qty}</span>
                    <button class="qty-btn" onclick="cartQty('${s.id}',1)">+</button>
                  </div>` : `
                  <button class="btn btn-sm btn-primary" onclick="addCart('${s.id}')">加入</button>`}
              </div>
            </div>`;
          }).join('')}
          ${svcList.filter(s => !cashierSearch || s.name.includes(cashierSearch) || s.category.includes(cashierSearch)).length === 0 ? '<div class="empty" style="padding:30px">无匹配项目</div>' : ''}
        </div>
      </div>

      <!-- 右侧：订单区域 -->
      <div class="order-panel order-right">
        <!-- 会员信息卡 -->
        <div class="chart-title">当前订单</div>
        <div class="form-item" style="margin-bottom:12px"><label>选择会员</label>
          <select class="select" id="cash-member" onchange="renderCashier($('content'))"><option value="">散客（不选会员）</option>${DB.members.filter(m => m.status === 'active').map(m => `<option value="${m.id}" ${memberId === m.id ? 'selected' : ''}>${m.name}（${m.level}·余${fmtMoney(m.balance)}）</option>`).join('')}</select>
        </div>

        ${member ? `
        <div class="member-card-mini">
          <div class="member-mini-left"><div class="member-avatar-sm">${member.name.slice(0,1)}</div><div><b>${member.name}</b>${levelTag(member.level)}<br><span class="muted" style="font-size:12px">${member.phone}</span></div></div>
          <div class="member-mini-right"><div>余额 <b style="color:#1677ff;font-size:16px">${fmtMoney(member.balance)}</b></div><div class="muted">积分 ${member.points.toLocaleString()}</div></div>
        </div>` : '<div class="muted" style="padding:8px 0;font-size:13px">💡 选择会员可使用会员卡支付、享受会员折扣、累积积分</div>'}

        <!-- 购物车 -->
        <div class="selected-list" id="cart-list">
          ${cart.length === 0 ? '<div class="empty-cart"><div class="empty-icon">🛒</div><div>请从左面选择服务项目</div><div class="muted" style="font-size:12px">点击「加入」或使用数量调节快速添加</div></div>' : `
            <div class="cart-table-header"><span>项目</span><span>单价</span><span>数量</span><span>小计</span><span></span></div>
            ${cart.map((it, i) => `
              <div class="cart-row">
                <span class="cart-item-name"><b>${it.name}</b></span>
                <span class="cart-item-price">${fmtMoney(it.price)}</span>
                <span class="cart-item-qty">
                  <button class="qty-btn-xs" onclick="cartQty('${it.id}',-1)">−</button>
                  <span>${it.qty}</span>
                  <button class="qty-btn-xs" onclick="cartQty('${it.id}',1)">+</button>
                </span>
                <span class="cart-item-subtotal">${fmtMoney(it.price * it.qty)}</span>
                <span class="text-link" onclick="removeCart(${i})" style="color:#ff4d4f">✕</span>
              </div>`).join('')}
          `}
        </div>

        <!-- 优惠 -->
        ${cart.length > 0 ? `
        <div class="discount-section">
          <div class="discount-row">
            <label>优惠券</label>
            <select class="select select-sm" id="cash-coupon" onchange="applyCoupon(this.value)">
              <option value="">不使用优惠券</option>
              ${DB.coupons.filter(cp => cp.status === 'on').map(cp => `<option value="${cp.id}" ${selectedCoupon?.id === cp.id ? 'selected' : ''}>${cp.name}（${cp.rule}）</option>`).join('')}
            </select>
          </div>
          ${member ? `<div class="discount-row"><label></label><span class="muted" style="font-size:12px">✅ 会员自动享${memberDiscountLabel || '8.8折'}优惠</span></div>` : ''}
        </div>

        <!-- 分配 -->
        <div class="assign-section">
          <div class="assign-row">
            <label>分配房间</label>
            <select class="select select-sm" id="cash-room" onchange="assignedRoom=this.value">
              <option value="">不分配</option>
              ${DB.rooms.filter(r => r.status === 'free').map(r => `<option value="${r.no}" ${assignedRoom === r.no ? 'selected' : ''}>${r.no}（${r.type}）</option>`).join('')}
            </select>
          </div>
          <div class="assign-row">
            <label>指定技师</label>
            <select class="select select-sm" id="cash-tech" onchange="assignedTech=this.value">
              <option value="">不限/自选</option>
              ${(DB.technicians || []).filter(t => t.status === 'on').map(t => {
                var starIcon = t.rating >= 4.8 ? '⭐' : t.rating >= 4.5 ? '🌟' : '✨';
                var busyTag = t.busy ? ' [服务中]' : '';
                return `<option value="${t.name}" ${assignedTech === t.name ? 'selected' : ''}>${t.name}（${t.category}/${starIcon}${t.rating}${busyTag}）</option>`;
              }).join('')}
            </select>
          </div>
          <div class="assign-row">
            <label>订单备注</label>
            <input class="input input-sm" id="cash-note" value="${esc(orderNote)}" placeholder="可选，如 特殊要求..." oninput="orderNote=this.value" />
          </div>
        </div>

        <!-- 合计 -->
        <div class="total-section">
          ${originalTotal > 0 ? `<div class="total-line"><span>原价合计</span><span>${fmtMoney(originalTotal)}</span></div>` : ''}
          ${discountAmount > 0 ? `<div class="total-line discount-line"><span>优惠券 ${discountLabel.split('-')[0]}</span><span>-${fmtMoney(discountAmount)}</span></div>` : ''}
          ${memberDiscount > 0 ? `<div class="total-line discount-line"><span>会员${memberDiscountLabel}</span><span>-${fmtMoney(memberDiscount)}</span></div>` : ''}
          <div class="total-line total-final"><span>应付金额</span><span class="final-amount">${fmtMoney(finalTotal)}</span></div>
        </div>

        <!-- 支付按钮 -->
        <div class="pay-row-enhanced">
          <button class="btn btn-success pay-btn-large" onclick="confirmPay('会员卡',${finalTotal})" ${!member ? 'disabled title="请先选择会员"' : ''} ${member && member.balance < finalTotal ? 'disabled title="余额不足"' : ''}>
            💳 会员卡${member ? `<small style="opacity:.7">（余${fmtMoney(member.balance)}）</small>` : ''}
          </button>
          <button class="btn btn-primary pay-btn" onclick="confirmPay('微信',${finalTotal})">微信支付</button>
          <button class="btn btn-primary pay-btn" onclick="confirmPay('支付宝',${finalTotal})">支付宝</button>
          <button class="btn pay-btn" onclick="confirmPay('现金',${finalTotal})">现金</button>
          <button class="btn btn-text" onclick="clearCart()">清空</button>
        </div>` : ''}

        <!-- 最近订单 -->
        <div style="margin-top:16px">
          <div class="chart-title">最近订单 <span class="muted" style="font-size:12px;font-weight:normal">（共 ${DB.orders.length} 单）</span></div>
          <div class="recent-orders">
            ${DB.orders.slice(0, 6).map(o => `
              <div class="recent-order-row" onclick="showOrderDetail('${o.id}')">
                <div class="ro-time">${o.time}</div>
                <div class="ro-id">${o.id}</div>
                <div class="ro-member">${o.member}</div>
                <div class="ro-items">${o.items.length > 15 ? o.items.slice(0,15)+'...' : o.items}</div>
                <div class="ro-pay"><span class="tag tag-${o.pay==='会员卡'?'green':o.pay==='微信'?'blue':o.pay==='支付宝'?'cyan':'gray'}" style="font-size:11px">${o.pay}</span></div>
                <b class="ro-amount">${fmtMoney(o.amount)}</b>
              </div>`).join('')}
            ${DB.orders.length === 0 ? '<div class="muted" style="padding:12px;text-align:center">暂无订单记录</div>' : ''}
          </div>
        </div>
      </div>
    </div>`;
}

// ---- 搜索关键词 ----
let cashierSearch = '';

// ---- 加入购物车 ----
function addCart(id) {
  const s = DB.services.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: s.id, name: s.name, price: s.price, qty: 1 });
  }
  toast('已添加：' + s.name);
  renderCashier($('content'));
}

// ---- 数量调整 ----
function cartQty(id, delta) {
  const it = cart.find(x => x.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
    toast('已移除：' + it.name);
  }
  renderCashier($('content'));
}

// ---- 移除购物车项 ----
function removeCart(i) {
  const removed = cart.splice(i, 1)[0];
  toast('已移除：' + removed.name);
  renderCashier($('content'));
}

// ---- 应用优惠券 ----
function applyCoupon(couponId) {
  if (!couponId) { selectedCoupon = null; renderCashier($('content')); return; }
  selectedCoupon = DB.coupons.find(c => c.id === couponId);
  renderCashier($('content'));
  if (selectedCoupon) toast('已应用：' + selectedCoupon.name);
}

// ---- 清空购物车 ----
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  selectedCoupon = null;
  orderNote = '';
  assignedRoom = '';
  assignedTech = '';
  renderCashier($('content'));
  toast('购物车已清空');
}

// ---- 支付确认弹窗（增强版） ----
function confirmPay(method, total) {
  if (cart.length === 0) return toast('请先选择服务项目');
  const memberId = $('cash-member').value;
  const member = memberId ? DB.members.find(m => m.id === memberId) : null;

  if (method === '会员卡' && !member) return toast('会员卡支付需要选择会员');
  if (method === '会员卡' && member.balance < total) return toast(`余额不足！当前${fmtMoney(member.balance)}，需${fmtMoney(total)}`);

  if (method === '现金') {
    openModal('💵 现金收款', `
      <div class="cash-pay-box">
        <div class="cash-total-label">应收金额</div>
        <div class="cash-total-amount">${fmtMoney(total)}</div>
        <div class="quick-amounts">
          ${[20,50,100,200,500].map(v => `<button class="btn btn-sm ${v >= total ? 'btn-outline' : ''}" onclick="$('cash-received').value=${v};updateChange(${total})">${v}</button>`).join('')}
        </div>
        <div class="form-row" style="margin-top:12px"><label>实收金额</label><input id="cash-received" class="input cash-input" type="number" value="${Math.ceil(total / 10) * 10}" min="${total}" oninput="updateChange(${total})" /></div>
        <div class="change-display" id="cash-change"></div>
      </div>
    `, () => {
      completePayment(method, total, member, parseFloat($('cash-received').value));
    }, '确认收款');
    setTimeout(() => updateChange(total), 50);
  } else if (method === '会员卡') {
    openModal('💳 会员卡支付确认', `
      <div class="card-pay-box">
        <div class="card-member-info"><b>${member.name}</b> ${levelTag(member.level)}</div>
        <div class="card-balance-row"><span>当前余额</span><span class="card-bal-before">${fmtMoney(member.balance)}</span></div>
        <div class="card-balance-row"><span>消费金额</span><span class="card-amt">-${fmtMoney(total)}</span></div>
        <div class="card-balance-row card-balance-after"><span>剩余余额</span><span>${fmtMoney(member.balance - total)}</span></div>
        <div class="muted" style="margin-top:12px;font-size:12px">本次消费可获得 <b style="color:#1677ff">${Math.round(total)}</b> 积分</div>
        <div class="form-item" style="margin-top:14px"><label>验证密码</label><input id="card-pwd" class="input" type="password" placeholder="请输入6位支付密码" maxlength="6" /></div>
      </div>
    `, () => {
      const pwd = $('card-pwd').value;
      if (!pwd || pwd.length < 4) return toast('请输入支付密码（演示：任意4位以上）');
      // 模拟密码验证延迟
      const btn = document.getElementById('modal-save');
      btn.disabled = true; btn.textContent = '验证中...';
      setTimeout(() => { completePayment(method, total, member); }, 600);
    }, '确认支付');
  } else {
    // 微信/支付宝 — 品牌化扫码支付
    const isWechat = method === '微信';
    const brandColor = isWechat ? '#07C160' : '#1677FF';
    const brandBg = isWechat ? 'linear-gradient(135deg,#07C160,#06AD56)' : 'linear-gradient(135deg,#1677FF,#4096FF)';
    const logoIcon = isWechat ? '<svg viewBox="0 0 24 24" width="28" height="28" fill="#07C160"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.97 3.258c-1.918-.018-3.954.537-5.442 1.776-1.655 1.38-2.54 3.66-1.704 6.174.98 2.281 3.274 3.836 5.91 3.836.826 0 1.622-.12 2.361-.343a.67.67 0 01.553.076l1.468.858a.252.252 0 00.129.041.227.227 0 00.228-.227c0-.055-.023-.11-.037-.164l-.3-1.138a.452.452 0 01.163-.512C20.537 18.175 21.5 16.496 21.5 14.61c0-3.08-2.79-5.337-5.932-5.36zm-2.564 2.094c.526 0 .953.433.953.967a.96.96 0 01-.953.965.96.96 0 01-.953-.965c0-.534.427-.967.953-.967zm5.128 0c.526 0 .953.433.953.967a.96.96 0 01-.953.965.96.96 0 01-.953-.965c0-.534.427-.967.953-.967z"/></svg>' : '<svg viewBox="0 0 24 24" width="28" height="28" fill="#1677FF"><path d="M21.422 15.358c-.945-.502-1.953-.89-3.006-1.148a11.8 11.8 0 00-.574-1.392c1.72-.73 2.947-1.87 3.68-3.418A7.61 7.61 0 0022.5 6.07C22.5 2.72 19.58 0 16 0S9.5 2.72 9.5 6.07c0 1.207.33 2.34.904 3.33a11.84 11.84 0 00-2.658-.31c-4.142 0-7.5 3.134-7.5 7s3.358 7 7.5 7c1.93 0 3.69-.68 5.05-1.805.76.475 1.59.86 2.474 1.137.63.196 1.283.338 1.952.422v-7.486zM16 2c2.485 0 4.5 1.82 4.5 4.07 0 .99-.365 1.9-.97 2.62-.81-.29-1.66-.51-2.53-.65V2.82c-.33-.06-.66-.1-1-.1zm-8.254 9.09c3.038 0 5.5 2.297 5.5 5.13s-2.462 5.13-5.5 5.13-5.5-2.298-5.5-5.13 2.462-5.13 5.5-5.13z"/></svg>';
    const payAppName = isWechat ? '微信' : '支付宝';

    openModal('', `
      <div class="qr-pay-enhanced" style="--brand:${brandColor};--brand-bg:${brandBg}">
        <div class="qr-header" style="background:${brandBg}">
          <div class="qr-logo">${logoIcon}</div>
          <div class="qr-title">${payAppName}支付</div>
          <div class="qr-amount-big">¥${total.toLocaleString('zh-CN')}</div>
        </div>
        <div class="qr-body">
          <div class="qr-code-wrapper">
            <div class="qr-code-pattern" id="qr-pattern"></div>
            <div class="qr-scan-line"></div>
            <div class="qr-status-overlay" id="qr-status" style="display:none">
              <div class="qr-success-icon">✓</div>
              <div>支付成功</div>
            </div>
          </div>
          <div class="qr-hint">
            <div class="qr-hint-main">请使用${payAppName}扫一扫</div>
            <div class="qr-countdown" id="qr-timer">二维码有效期 <span id="qr-time-left">5:00</span></div>
          </div>
        </div>
        <div class="qr-footer-note">
          <span class="qr-demo-tag">演示模式</span> 点击「确认收款」模拟用户扫码付款
        </div>
      </div>
    `, () => {
      simulateQRPayment(method, total, member);
    }, '确认收款');

    // 生成CSS二维码图案
    generateQRPattern();
    // 启动倒计时
    startQRTimer(300);
  }
}

// ---- 生成CSS二维码图案 ----
function generateQRPattern() {
  const el = document.getElementById('qr-pattern');
  if (!el) return;
  let cells = '';
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      // 定位图案（左上、右上、左下角）
      const isFinder = (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
      // 随机模拟数据区域
      const isData = !isFinder && Math.random() > 0.45;
      // 定位图案内部空心
      const isHole = isFinder && i > 1 && i < 5 && j > 1 && j < 5;
      // 定位图案内圈
      const isInner = isFinder && i > 0 && i < 6 && j > 0 && j < 6 && !(i > 1 && i < 5 && j > 1 && j < 5);
      if (isInner || isData) cells += '<div class="qr-cell qr-cell-on"></div>';
      else if (isHole) cells += '<div class="qr-cell qr-cell-off"></div>';
      else cells += '<div class="qr-cell"></div>';
    }
  }
  el.innerHTML = cells;
}

// ---- 二维码倒计时 ----
let qrTimerInterval = null;
function startQRTimer(seconds) {
  const timeEl = document.getElementById('qr-time-left');
  if (!timeEl) return;
  let remaining = seconds;
  clearInterval(qrTimerInterval);
  qrTimerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(qrTimerInterval);
      timeEl.textContent = '已过期';
      if (timeEl.parentElement) timeEl.parentElement.classList.add('expired');
      return;
    }
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    timeEl.textContent = m + ':' + s;
  }, 1000);
}

// ---- 模拟扫码支付流程 ----
function simulateQRPayment(method, total, member) {
  const statusEl = document.getElementById('qr-status');
  const lineEl = document.querySelector('.qr-scan-line');
  const btn = document.getElementById('modal-save');
  if (!btn) return;

  // 步骤1: 扫描中
  btn.disabled = true;
  btn.textContent = '扫码中...';
  if (lineEl) lineEl.style.display = 'none';

  setTimeout(() => {
    // 步骤2: 支付中
    btn.textContent = '支付处理中...';
    if (statusEl) {
      statusEl.style.display = 'flex';
      statusEl.className = 'qr-status-overlay qr-status-processing';
      statusEl.innerHTML = '<div class="qr-spinner"></div><div>正在处理支付...</div>';
    }

    setTimeout(() => {
      // 步骤3: 成功
      if (statusEl) {
        statusEl.className = 'qr-status-overlay qr-status-success';
        statusEl.innerHTML = '<div class="qr-success-icon">✓</div><div>支付成功</div>';
      }
      btn.textContent = '完成';

      // 播放成功音效提示
      toast('✅ ' + method + '收款成功！');

      // 延迟关闭并完成订单
      setTimeout(() => {
        completePayment(method, total, member);
        // 关闭弹窗
        const mask = document.querySelector('.modal-mask');
        if (mask) mask.remove();
        clearInterval(qrTimerInterval);
      }, 800);
    }, 1200);
  }, 800);
}

// ---- 现金找零计算 ----
function updateChange(total) {
  const el = $('cash-change');
  if (!el) return;
  const received = parseFloat($('cash-received').value) || 0;
  const change = received - total;
  if (received >= total) {
    el.innerHTML = `<div class="change-ok">找零：<b style="color:#52c41a;font-size:24px">${fmtMoney(change)}</b></div>`;
  } else {
    el.innerHTML = `<div class="change-error">还差 <b style="color:#ff4d4f">${fmtMoney(-change)}</b></div>`;
  }
}

// ---- 完成支付 ----
function completePayment(method, total, member, received) {
  // 扣减会员余额
  if (method === '会员卡' && member) {
    member.balance -= total;
    member.points += Math.round(total); // 积分奖励
  }

  // 生成订单号
  const oid = 'O' + (8004 + DB.orders.length);
  const memberId = $('cash-member').value;
  const memberName = memberId ? (DB.members.find(m => m.id === memberId)?.name || '散客') : '散客';

  // 构建订单项描述
  const itemDesc = cart.map(x => (x.qty > 1 ? x.name + '×' + x.qty : x.name)).join('+');

  // 记录订单
  DB.orders.unshift({
    id: oid,
    member: memberName,
    items: itemDesc,
    amount: total,
    pay: method,
    time: new Date().toTimeString().slice(0, 5),
    cashier: '钱收银',
    room: assignedRoom || '',
    tech: assignedTech || '',
    note: orderNote || '',
    coupon: selectedCoupon?.name || '',
    detail: cart.map(x => ({ name: x.name, price: x.price, qty: x.qty, subtotal: x.price * x.qty }))
  });

  // 如果分配了房间，更新房间状态
  if (assignedRoom) {
    const r = DB.rooms.find(x => x.no === assignedRoom);
    if (r && r.status === 'free') r.status = 'busy';
  }

  // 显示小票
  showReceipt({
    id: oid, member: memberName, items: cart, total, method,
    payTime: new Date().toLocaleString('zh-CN'),
    room: assignedRoom, tech: assignedTech, note: orderNote,
    coupon: selectedCoupon?.name || '',
    balanceAfter: member ? member.balance : 0,
    pointsEarned: member ? Math.round(total) : 0,
    change: method === '现金' ? (received - total) : 0
  });

  // 重置状态
  cart = [];
  selectedCoupon = null;
  orderNote = '';
  assignedRoom = '';
  assignedTech = '';

  toast('✅ 收银成功：' + fmtMoney(total) + ' · ' + method);
  renderCashier($('content'));
}

// ---- 小票弹窗 ----
function showReceipt(order) {
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal receipt-modal">
      <div class="modal-head"><span>🧾 收银小票</span><span class="close-x" onclick="this.closest('.modal-mask').remove()">×</span></div>
      <div class="receipt-body">
        <div class="receipt-store">${DB.store.current}</div>
        <div class="receipt-divider"></div>
        <div class="receipt-row"><span>订单号</span><span>${order.id}</span></div>
        <div class="receipt-row"><span>时间</span><span>${order.payTime}</span></div>
        <div class="receipt-row"><span>会员</span><span>${order.member}</span></div>
        ${order.room ? `<div class="receipt-row"><span>房间</span><span>${order.room}</span></div>` : ''}
        ${order.tech ? `<div class="receipt-row"><span>技师</span><span>${order.tech}</span></div>` : ''}
        <div class="receipt-divider"></div>
        ${order.items.map(it => `
          <div class="receipt-item"><span>${it.name}${it.qty > 1 ? ' ×' + it.qty : ''}</span><span>${fmtMoney(it.price * it.qty)}</span></div>
        `).join('')}
        <div class="receipt-divider"></div>
        ${order.coupon ? `<div class="receipt-row receipt-discount"><span>优惠</span><span>${order.coupon}</span></div>` : ''}
        <div class="receipt-row receipt-total"><span>合计</span><span>${fmtMoney(order.total)}</span></div>
        <div class="receipt-row"><span>支付方式</span><span>${order.method}</span></div>
        ${order.method === '现金' && order.change > 0 ? `<div class="receipt-row"><span>实收</span><span>${fmtMoney(order.total + order.change)}</span></div>
          <div class="receipt-row receipt-change"><span>找零</span><span>${fmtMoney(order.change)}</span></div>` : ''}
        ${order.method === '会员卡' ? `<div class="receipt-row"><span>余额</span><span>${fmtMoney(order.balanceAfter)}</span></div>
          <div class="receipt-row"><span>获积分</span><span>+${order.pointsEarned}</span></div>` : ''}
        ${order.note ? `<div class="receipt-divider"></div><div class="receipt-row receipt-note"><span>备注</span><span>${order.note}</span></div>` : ''}
        <div class="receipt-divider"></div>
        <div class="receipt-footer">谢谢惠顾，欢迎下次光临！</div>
      </div>
      <div class="modal-foot"><button class="btn" onclick="this.closest('.modal-mask').remove()">关闭</button><button class="btn btn-primary" onclick="this.closest('.modal-mask').remove();toast('小票已打印')">🖨️ 打印小票</button></div>
    </div>`;
  document.body.appendChild(mask);
}

// ---- 查看订单详情 ----
function showOrderDetail(oid) {
  const o = DB.orders.find(x => x.id === oid);
  if (!o) return;
  openModal('订单详情 - ' + o.id, `
    <div class="detail-grid">
      <div class="detail-row"><label>订单号</label><b>${o.id}</b></div>
      <div class="detail-row"><label>会员</label>${o.member}</div>
      <div class="detail-row"><label>消费项目</label><b>${o.items}</b></div>
      <div class="detail-row"><label>金额</label><b style="color:#fa541c;font-size:18px">${fmtMoney(o.amount)}</b></div>
      <div class="detail-row"><label>支付方式</label><span class="tag tag-${o.pay==='会员卡'?'green':o.pay==='微信'?'blue':'gray'}">${o.pay}</span></div>
      <div class="detail-row"><label>时间</label>${o.time}</div>
      <div class="detail-row"><label>收银员</label>${o.cashier}</div>
      ${o.room ? `<div class="detail-row"><label>房间</label>${o.room}</div>` : ''}
      ${o.tech ? `<div class="detail-row"><label>技师</label>${o.tech}</div>` : ''}
      ${o.note ? `<div class="detail-row"><label>备注</label>${o.note}</div>` : ''}
      ${o.coupon ? `<div class="detail-row"><label>优惠券</label>${o.coupon}</div>` : ''}
    </div>
  `, () => {});
}

// ===== 房间管理 =====
function renderRoom(c) {
  const labels = { free: ['tag-green', '空闲'], busy: ['tag-orange', '使用中'], clean: ['tag-blue', '待清洁'], cleaning: ['tag-teal', '清洁完成'], maint: ['tag-red', '维护中'] };
  c.innerHTML = `
    <div class="page-head"><span class="muted">空闲 ${DB.rooms.filter(r => r.status === 'free').length} · 使用中 ${DB.rooms.filter(r => r.status === 'busy').length}</span></div>
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
const INV_STATUS_TXT = { normal: '正常', warn: '库存预警', disabled: '停用' };
const INV_STATUS_OPTIONS = [
  { value: 'normal', label: '正常', cls: 'tag-green' },
  { value: 'warn', label: '库存预警', cls: 'tag-red' },
  { value: 'disabled', label: '停用', cls: 'tag-gray' }
];

// 状态下拉选择框（带颜色标识）
function invStatusSelect(pid, currentStatus) {
  const opts = INV_STATUS_OPTIONS.map(o =>
    `<option value="${o.value}" ${o.value === currentStatus ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  return `<select class="inv-status-select" data-pid="${pid}" onchange="changeInvStatus(this)">
    ${opts}
  </select>`;
}

function changeInvStatus(sel) {
  const pid = sel.dataset.pid;
  const newStatus = sel.value;
  const p = DB.inventory.find(x => x.id === pid);
  if (!p) return;
  const oldStatus = p.status;
  if (oldStatus === newStatus) return;
  p.status = newStatus;
  addInvLog(pid, p.name, 0, '状态变更', INV_STATUS_TXT[oldStatus] + ' → ' + INV_STATUS_TXT[newStatus]);
  toast(p.name + ' 状态 → ' + INV_STATUS_TXT[newStatus]);
  // 只刷新当前行状态列，不重新渲染整个表格（避免闪烁）
  sel.className = 'inv-status-select inv-status-' + newStatus;
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
    <div class="page-head">
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-primary" onclick="purchaseInbound()">+ 采购入库</button>
        <button class="btn" onclick="showInvLog()">📋 操作日志</button>
      </div>
    </div>
    <div class="filter-bar" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <span class="muted">⚠️ 红色为低于安全库存预警商品</span>
      <div style="display:flex;align-items:center;gap:6px;margin-left:auto">
        <label class="muted" style="font-size:13px;white-space:nowrap">状态筛选：</label>
        <select id="inv-filter-status" class="select" style="width:120px;padding:4px 8px;font-size:13px;border-radius:6px" onchange="renderInventory($('content'))">
          <option value="">全部</option>
          <option value="normal">正常</option>
          <option value="warn">库存预警</option>
          <option value="disabled">停用</option>
        </select>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>编号</th><th>商品名称</th><th>当前库存</th><th>单位</th><th>安全线</th><th>供应商</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          ${(() => {
            const fStatus = $('inv-filter-status') ? $('inv-filter-status').value : '';
            let items = DB.inventory;
            if (fStatus) items = items.filter(p => p.status === fStatus);
            return items.map(p => {
              const autoWarn = p.stock < p.warnLine && p.status !== 'disabled';
              return `<tr style="${autoWarn && p.status !== 'disabled' ? 'background:#fff1f0' : ''}">
                <td>${p.id}</td>
                <td><b>${p.name}</b></td>
                <td><span class="inv-stock" style="cursor:pointer;font-weight:600;color:${autoWarn ? '#ff4d4f' : '#333'};text-decoration:underline;text-decoration-style:dotted;padding:2px 6px;border-radius:4px;background:${autoWarn ? '#fff1f0':'#f8fafc'}" onclick="adjustStock('${p.id}')">${p.stock}</span></td>
                <td>${p.unit}</td>
                <td>${p.warnLine}</td>
                <td>${p.supplier}</td>
                <td>${invStatusSelect(p.id, autoWarn && p.status !== 'disabled' ? 'warn' : p.status)}</td>
                <td>
                  <button class="btn btn-sm btn-primary" onclick="stockIn('${p.id}')">入库</button>
                  <button class="btn btn-sm" onclick="stockOut('${p.id}')">出库</button>
                  <button class="btn btn-sm" onclick="editProduct('${p.id}')">编辑</button>
                </td>
              </tr>`;
            }).join('');
          })()}
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
const EMP_STATUS = { on: ['tag-green', '在职'], leave: ['tag-red', '离职'], trial: ['tag-yellow', '试用期'], suspended: ['tag-gray', '停薪留职'], off: ['tag-gray', '离岗/休假'] };
function renderEmployee(c) {
  c.innerHTML = `
    <div class="page-head"><button class="btn btn-primary" onclick="addEmployee()">+ 新增员工</button></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>工号</th><th>姓名</th><th>岗位</th><th>部门</th><th>技师等级</th><th>提成</th><th>联系电话</th><th>入职日期</th><th>状态</th></tr></thead>
        <tbody>
          ${DB.employees.map(e => `
            <tr><td>${e.id}</td><td><b>${e.name}</b></td><td><span class="tag tag-purple">${e.role}</span></td>
            <td><span class="tag" style="font-size:11px;background:#e8f4fd;color:#1565c0">${e.department || '—'}</span></td>
            <td>${e.techLevel === '-' ? '—' : e.techLevel}</td><td>${e.commission}</td><td>${e.phone}</td>
            <td style="font-size:12px;color:#666">${e.hireDate || '—'}</td>
            <td><select class="emp-status-select" onchange="empStatusChange('${e.id}',this.value)">
              ${Object.entries(EMP_STATUS).map(([k,v]) => `<option value="${k}" ${e.status===k?'selected':''}>${v[1]}</option>`).join('')}
            </select></td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function empStatusChange(id, newStatus) {
  const e = DB.employees.find(x => x.id === id);
  if (!e) return;
  const oldStatus = e.status;
  e.status = newStatus;
  const statusName = EMP_STATUS[newStatus] ? EMP_STATUS[newStatus][1] : newStatus;
  toast('员工「' + e.name + '」状态已更新为：' + statusName);
}
function addEmployee() {
  openModal('新增员工', `
    <div class="form-item"><label>姓名 <span class="required">*</span></label><input class="input" id="emp-name" placeholder="请输入员工姓名" /></div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>工号</label><input class="input" id="emp-code" placeholder="自动生成" readonly style="background:#f5f7fa;color:#999" value="E${String(4000+DB.employees.length+1).padStart(3,'0')}" /></div>
      <div class="form-item" style="flex:1"><label>联系电话</label><input class="input" id="emp-phone" placeholder="11位手机号" /></div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>岗位</label>
        <select class="select" id="emp-role">
          <option value="高级技师">高级技师</option>
          <option value="按摩技师">按摩技师</option>
          <option value="足疗技师">足疗技师</option>
          <option value="美容美体师">美容美体师</option>
          <option value="前台主管">前台主管</option>
          <option value="收银员">收银员</option>
          <option value="前台接待">前台接待</option>
          <option value="保洁员">保洁员</option>
          <option value="保安/安保员">保安/安保员</option>
          <option value="会计">会计</option>
          <option value="人事专员">人事专员</option>
          <option value="餐饮厨师">餐饮厨师</option>
          <option value="餐厅服务员">餐厅服务员</option>
          <option value="设备维修">设备维修</option>
          <option value="门店经理">门店经理</option>
        </select>
      </div>
      <div class="form-item" style="flex:1"><label>部门</label>
        <select class="select" id="emp-dept">
          <option value="技师部">技师部</option>
          <option value="前厅部">前厅部</option>
          <option value="后勤部">后勤部</option>
          <option value="财务部">财务部</option>
          <option value="人事部">人事部</option>
          <option value="安保部">安保部</option>
          <option value="餐饮部">餐饮部</option>
          <option value="管理层">管理层</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>技师等级</label>
        <select class="select" id="emp-level">
          <option value="—">—（非技师）</option>
          <option value="特级">特级</option>
          <option value="高级">高级</option>
          <option value="中级">中级</option>
          <option value="初级">初级</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>提成比例</label><input class="input" id="emp-commission" placeholder="如 15%" value="10%" /></div>
      <div class="form-item" style="flex:1"><label>入职日期</label><input class="input" id="emp-joindate" type="date" value="${new Date().toISOString().slice(0,10)}" /></div>
    </div>
    <div class="form-item"><label>状态</label>
      <select class="select" id="emp-status">
        <option value="on" selected>在职</option>
        <option value="trial">试用期</option>
        <option value="suspended">停薪留职</option>
        <option value="leave">离职</option>
      </select>
    </div>
    <div class="form-item"><label>备注</label><textarea class="input" id="emp-note" rows="2" placeholder="可选，填写备注信息"></textarea></div>
  `, () => {
    const name = $('emp-name').value.trim();
    if (!name) return toast('请输入员工姓名');
    const phone = $('emp-phone').value.trim();
    const code = $('emp-code').value.trim() || ('E' + String(4000+DB.employees.length+1).padStart(3,'0'));
    // 检查工号重复
    if (DB.employees.find(e => e.id === code)) {
      // 工号冲突则递增
      let newCode = code;
      for (let i = 1; i <= 99; i++) {
        newCode = 'E' + String(4000+DB.employees.length+i).padStart(3,'0');
        if (!DB.employees.find(e => e.id === newCode)) break;
      }
      code = newCode;
    }
    DB.employees.push({
      id: code,
      name: name,
      role: $('emp-role').value,
      department: $('emp-dept').value,
      techLevel: $('emp-level').value,
      commission: $('emp-commission').value || '10%',
      phone: phone || '—',
      status: $('emp-status').value,
      hireDate: $('emp-joindate').value,
      note: $('emp-note').value.trim()
    });
    toast('员工添加成功：' + name + '（工号：' + code + '）');
    renderEmployee($('content'));
  }, '确认添加');
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
function openModal(title, bodyHtml, onSave, confirmText) {
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal">
      <div class="modal-head"><span>${title}</span><span class="close-x" onclick="this.closest('.modal-mask').remove()">×</span></div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-foot"><button class="btn" onclick="this.closest('.modal-mask').remove()">取消</button><button class="btn btn-primary" id="modal-save">${confirmText || '保存'}</button></div>
    </div>`;
  document.body.appendChild(mask);
  mask.querySelector('#modal-save').addEventListener('click', () => { onSave(); persistData(); mask.remove(); });
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
    <div class="page-head"><button class="btn btn-primary" onclick="newReservation()">+ 新增预约</button></div>
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
  persistData();
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
      <div class="form-item"><label>预约日期</label><input class="input" id="rv-date" type="date" value="${todayStr()}" /></div>
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
    <div class="page-head"><button class="btn btn-primary" onclick="newCoupon()">+ 新建优惠券</button></div>
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
    <div class="page-head"><span class="muted">共 ${DB.lockers.length} 个柜位 · 使用中 ${usedCount} · 空闲 ${DB.lockers.length - usedCount}</span></div>
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
const SHIFT_OPTIONS = [
  { value: '早', label: '早班', cls: 'shift-morning', time: '08:00-16:00' },
  { value: '中', label: '中班', cls: 'shift-afternoon', time: '12:00-20:00' },
  { value: '晚', label: '晚班', cls: 'shift-evening', time: '16:00-24:00' },
  { value: '休', label: '休息', cls: 'shift-rest', time: '' }
];
const STATUS_MAP = {
  normal: { text: '正常', cls: 'tag-green' },
  late: { text: '迟到', cls: 'tag-orange' },
  early: { text: '早退', cls: 'tag-orange' },
  absent: { text: '缺勤', cls: 'tag-red' },
  leave: { text: '请假', cls: 'tag-blue' },
  overtime: { text: '加班', cls: 'tag-purple' }
};
let attDate = todayStr();

function getShiftInfo(val) {
  return SHIFT_OPTIONS.find(s => s.value === val) || { label: val || '\u2014', cls: '', time: '' };
}

function shiftBadge(val) {
  const s = getShiftInfo(val);
  if (!val || val === '') return '<span class="shift-empty">\u2014</span>';
  return '<span class="shift-badge ' + s.cls + '" title="' + s.time + '">' + s.label + '</span>';
}

function statusBadge(st) {
  var s = STATUS_MAP[st] || STATUS_MAP.normal;
  return '<span class="tag ' + s.cls + '">' + s.text + '</span>';
}
function renderAttendance(c) {
  var todayRecs = DB.attendance.records;
  var totalEmp = DB.employees.filter(function(e) { return e.status === 'on'; }).length;
  var clockedIn = todayRecs.filter(function(r) { return r.clockIn !== '\u2014'; }).length;
  var clockedOut = todayRecs.filter(function(r) { return r.clockOut !== '\u2014'; }).length;
  var lateCount = todayRecs.filter(function(r) { return r.status === 'late'; }).length;
  var totalHours = todayRecs.reduce(function(sum, r) { return sum + (r.hours || 0); }, 0);
  var attendRate = totalEmp > 0 ? Math.round(clockedIn / totalEmp * 100) : 0;

  var d = new Date(attDate.replace(/-/g, '/'));
  var dayNames = ['\u5468\u65e5','\u5468\u4e00','\u5468\u4e8c','\u5468\u4e09','\u5468\u56db','\u5468\u4e94','\u5468\u516d'];
  var todayDayName = dayNames[d.getDay()];

  c.innerHTML =
    '<div class="page-head">' +
    '<div style="display:flex;gap:8px;align-items:center">' +
      '<button class="btn btn-primary" onclick="clockIn()">\ud83d\udccb \u5458\u5de5\u7b7e\u5230</button>' +
      '<button class="btn" onclick="clockOut()">\ud83d\udeaa \u5458\u5de5\u7b7e\u9000</button>' +
      '<button class="btn" onclick="editSchedule()">\u270f\ufe0f \u7f16\u8f91\u6392\u73ed</button>' +
    '</div></div>' +

    // 统计卡片
    '<div class="att-stats">' +
      '<div class="att-stat-card"><div class="att-stat-num">' + totalEmp + '</div><div class="att-stat-label">\u5728\u5c97\u4eba\u6570</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num att-stat-green">' + clockedIn + '</div><div class="att-stat-label">\u5df2\u7b7e\u5230</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num att-stat-blue">' + clockedOut + '</div><div class="att-stat-label">\u5df2\u7b7e\u9000</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num' + (lateCount > 0 ? ' att-stat-orange' : '') + '">' + lateCount + '</div><div class="att-stat-label">\u8fdf\u5230</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num">' + totalHours.toFixed(1) + 'h</div><div class="att-stat-label">\u603b\u5de5\u65f6</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num ' + (attendRate >= 90 ? 'att-stat-green' : attendRate >= 70 ? 'att-stat-orange' : 'att-stat-red') + '">' + attendRate + '%</div><div class="att-stat-label">\u51fa\u52e4\u7387</div></div>' +
    '</div>' +

    // 排班表
    '<div class="chart-title">\u672c\u5468\u6392\u73ed\u8868<span class="muted" style="font-size:12px;font-weight:400;float:right">\u70b9\u51fb\u5355\u5143\u683c\u53ef\u4fee\u6539\u73ed\u6b21 \u00b7 \u4eca\u65e5\uff1a' + todayDayName + '</span></div>' +
    '<div class="table-wrap" style="overflow:auto"><table class="sched-table">' +
      '<thead><tr><th>\u5458\u5de5<span class="muted" style="font-size:11px;font-weight:400;display:block">\u5c97\u4f4d</span></th>' +
        DAYS.map(function(d) { var isToday = d === todayDayName; return '<th' + (isToday ? ' class="today-col"' : '') + '>' + d + (isToday ? '<span class="today-dot"></span>' : '') + '</th>'; }).join('') +
      '</tr></thead>' +
      '<tbody>' +
        DB.attendance.schedule.map(function(r) {
          return '<tr><td><b>' + r.name + '</b><span class="muted" style="font-size:11px;display:block">' + (r.role||'') + '</span></td>' +
            DAYS.map(function(d) {
              var val = r[d] || '';
              var isToday = d === todayDayName;
              var s = getShiftInfo(val);
              if (!val) return '<td class="' + (isToday ? 'today-cell' : '') + '" onclick="editShiftCell(\'' + r.name + '\',\'' + d + '\')"><span class="shift-empty editable-shift" title="\u70b9\u51fb\u8bbe\u7f6e\u73ed\u6b21">+</span></td>';
              return '<td class="' + (isToday ? 'today-cell' : '') + '" onclick="editShiftCell(\'' + r.name + '\',\'' + d + '\')"><span class="shift-badge ' + s.cls + '" title="' + s.time + ' &#10;\u70b9\u51fb\u4fee\u6539">' + s.label + '</span></td>';
            }).join('') +
          '</tr>';
        }).join('') +
      '</tbody></table></div>' +

    // 考勤记录
    '<div class="chart-title" style="margin-top:22px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
      '<span>\u8003\u52e4\u8bb0\u5f55</span>' +
      '<select id="att-date-sel" class="select" style="width:150px;padding:4px 8px;font-size:13px;border-radius:6px" onchange="switchAttDate(this.value)">' +
        '<option value="' + todayStr() + '"' + (attDate===todayStr()?' selected':'') + '>\u4eca\u5929 (' + formatDayLabel(todayStr()) + ')</option>' +
        '<option value="' + offsetDateStr(-1) + '"' + (attDate===offsetDateStr(-1)?' selected':'') + '>\u6628\u5929 (' + formatDayLabel(offsetDateStr(-1)) + ')</option>' +
        '<option value="' + offsetDateStr(-2) + '"' + (attDate===offsetDateStr(-2)?' selected':'') + '>\u524d\u5929 (' + formatDayLabel(offsetDateStr(-2)) + ')</option>' +
      '</select>' +
      '<span class="muted" style="font-size:12px;font-weight:400">' + clockedIn + '/' + totalEmp + ' \u4eba\u5df2\u7b7e\u5230</span>' +
    '</div>' +
    '<div class="table-wrap"><table>' +
      '<thead><tr><th>\u5458\u5de5</th><th>\u5c97\u4f4d</th><th>\u4e0a\u73ed</th><th>\u4e0b\u73ed</th><th>\u5de5\u65f6</th><th>\u72b6\u6001</th><th>\u64cd\u4f5c</th></tr></thead>' +
      '<tbody>' + (function() {
        var recs = getAttRecords();
        if (recs.length === 0) return '<tr><td colspan="7" class="muted" style="text-align:center;padding:20px">\u6682\u65e0\u8003\u52e4\u8bb0\u5f55</td></tr>';
        return recs.map(function(r) {
          return '<tr>' +
            '<td><b>' + r.name + '</b></td>' +
            '<td><span class="muted" style="font-size:12px">' + (r.role||'\u2014') + '</span></td>' +
            '<td style="' + (r.status==='late'?'color:#d48806;font-weight:600':'') + '">' + r.clockIn + '</td>' +
            '<td>' + r.clockOut + '</td>' +
            '<td>' + (r.hours > 0 ? r.hours.toFixed(1) + 'h' : '\u2014') + '</td>' +
            '<td>' + statusBadge(r.status) + '</td>' +
            '<td>' + (r.clockOut === '\u2014' ? '<button class="btn btn-sm btn-primary" onclick="doClockOut(\'' + r.name + '\')">\u7b7e\u9000</button>' : '<span class="muted" style="font-size:12px">\u5df2\u5b8c\u6210</span>') + '</td>' +
          '</tr>';
        }).join('');
      })() + '</tbody></table></div>';
}
function getAttRecords() {
  if (attDate === todayStr()) return DB.attendance.records;
  return DB.attendance.history[attDate] || [];
}

function switchAttDate(dateStr) {
  attDate = dateStr;
  renderAttendance($('content'));
}

function editShiftCell(name, day) {
  var row = DB.attendance.schedule.find(function(r) { return r.name === name; });
  if (!row) return;
  var currentVal = row[day] || '';
  openModal('\u4fee\u6539\u6392\u73ed - ' + name + ' (' + day + ')',
    '<div class="form-row"><label>\u5f53\u524d\u73ed\u6b21</label><b>' + (currentVal || '\u672a\u8bbe\u7f6e') + '</b></div>' +
    '<div class="form-row"><label>\u9009\u62e9\u73ed\u6b21</label><select id="shift-sel" class="input">' +
      SHIFT_OPTIONS.map(function(s) { return '<option value="' + s.value + '"' + (s.value === currentVal ? ' selected' : '') + '>' + s.label + ' (' + (s.time || '\u4f11\u606f') + ')</option>'; }).join('') +
    '</select></div>',
  function() {
    var newVal = $('shift-sel').value;
    row[day] = newVal;
    var s = getShiftInfo(newVal);
    toast(name + ' ' + day + ' \u2192 ' + s.label);
    renderAttendance($('content'));
  });
}

function editSchedule() {
  var empOpts = DB.attendance.schedule.map(function(r) {
    return '<option value="' + r.name + '">' + r.name + ' (' + r.role + ')</option>';
  }).join('');
  var daysHtml = DAYS.map(function(d) {
    return '<div class="form-row"><label>' + d + '</label><select id="sched-' + d + '" class="input">' +
      SHIFT_OPTIONS.map(function(s) { return '<option value="' + s.value + '">' + s.label + '</option>'; }).join('') +
    '</select></div>';
  }).join('');

  openModal('\u7f16\u8f91\u6392\u73ed',
    '<div class="form-row"><label>\u9009\u62e9\u5458\u5de5</label><select id="sched-emp" class="input">' + empOpts + '</select></div>' +
    daysHtml +
    '<p class="muted" style="font-size:12px">\u4fdd\u5b58\u540e\u5c06\u66f4\u65b0\u8be5\u5458\u5de5\u672c\u5468\u5168\u90e8\u6392\u73ed</p>',
  function() {
    var name = $('sched-emp').value;
    var row = DB.attendance.schedule.find(function(r) { return r.name === name; });
    if (!row) return;
    DAYS.forEach(function(d) { row[d] = $('sched-' + d).value; });
    toast(name + ' \u6392\u73ed\u5df2\u66f4\u65b0');
    renderAttendance($('content'));
  });
  setTimeout(function() {
    var name = $('sched-emp').value;
    var row = DB.attendance.schedule.find(function(r) { return r.name === name; });
    if (row) DAYS.forEach(function(d) {
      var sel = $('sched-' + d);
      if (sel && row[d]) sel.value = row[d];
    });
  }, 50);
}

function clockIn() {
  var memOpts = DB.employees.filter(function(e) { return e.status === 'on'; })
    .map(function(e) { return '<option value="' + e.name + '">' + e.name + '\uff08' + e.role + '\uff09</option>'; }).join('');
  openModal('\u5458\u5de5\u7b7e\u5230',
    '<div class="form-item"><label>\u9009\u62e9\u5458\u5de5</label><select class="select" id="at-emp">' + memOpts + '</select></div>' +
    '<div class="form-item"><label>\u5907\u6ce8</label><input id="at-note" class="input" placeholder="\u53ef\u9009\uff0c\u5982\uff1a\u8fdf\u5230\u539f\u56e0" /></div>' +
    '<p class="muted">\u7b7e\u5230\u65f6\u95f4\u5c06\u81ea\u52a8\u8bb0\u5f55\u4e3a\u5f53\u524d\u65f6\u95f4</p>',
  function() {
    var name = $('at-emp').value;
    var now = new Date();
    var timeStr = now.toTimeString().slice(0, 5);
    var hour = now.getHours();
    var minute = now.getMinutes();
    var status = 'normal';
    if (hour >= 9 && minute > 10) status = 'late';

    var existing = DB.attendance.records.find(function(r) { return r.name === name && r.date === attDate; });
    if (existing) { toast(name + ' \u4eca\u5929\u5df2\u7b7e\u5230\uff08' + existing.clockIn + '\uff09'); return; }

    var emp = DB.employees.find(function(e) { return e.name === name; });
    DB.attendance.records.unshift({
      name: name, date: attDate,
      clockIn: timeStr, clockOut: '\u2014',
      status: status, hours: 0,
      role: emp ? emp.role : ''
    });
    toast(name + ' \u7b7e\u5230\u6210\u529f\uff1a' + timeStr + (status === 'late' ? ' \u26a0\ufe0f \u8fdf\u5230' : ''));
    renderAttendance($('content'));
  });
}

function clockOut() {
  var activeRecs = DB.attendance.records.filter(function(r) { return r.clockOut === '\u2014'; });
  if (activeRecs.length === 0) { toast('\u6ca1\u6709\u5f85\u7b7e\u9000\u7684\u5458\u5de5'); return; }
  var opts = activeRecs.map(function(r) {
    return '<option value="' + r.name + '">' + r.name + ' (\u7b7e\u5230 ' + r.clockIn + ')</option>';
  }).join('');
  openModal('\u5458\u5de5\u7b7e\u9000',
    '<div class="form-item"><label>\u9009\u62e9\u5458\u5de5</label><select class="select" id="out-emp">' + opts + '</select></div>' +
    '<p class="muted">\u7b7e\u9000\u65f6\u95f4\u5c06\u81ea\u52a8\u8bb0\u5f55\u4e3a\u5f53\u524d\u65f6\u95f4</p>',
  function() { doClockOut($('out-emp').value); });
}

function doClockOut(name) {
  var rec = DB.attendance.records.find(function(r) { return r.name === name && r.date === attDate && r.clockOut === '\u2014'; });
  if (!rec) { toast('\u672a\u627e\u5230\u8be5\u5458\u5de5\u7684\u7b7e\u5230\u8bb0\u5f55'); return; }
  var now = new Date().toTimeString().slice(0, 5);
  rec.clockOut = now;

  var inParts = rec.clockIn.split(':').map(Number);
  var outParts = rec.clockOut.split(':').map(Number);
  var hours = (outParts[0] + outParts[1] / 60) - (inParts[0] + inParts[1] / 60);
  if (hours < 0) hours += 24;
  rec.hours = Math.round(hours * 10) / 10;

  if (hours > 10) rec.status = 'overtime';
  else if (hours < 6 && rec.status !== 'late') rec.status = 'early';

  toast(name + ' \u7b7e\u9000\u6210\u529f\uff1a' + now + ' \u00b7 \u5de5\u65f6 ' + rec.hours.toFixed(1) + 'h');
  renderAttendance($('content'));
}

// ===== 客诉评价 =====
let reviewFilter = '全部';
function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function reviewTypeTag(t) { return t === '客诉' ? '<span class="tag tag-red">客诉</span>' : '<span class="tag tag-green">好评</span>'; }
function reviewStatusTag(s) { if (s === 'resolved') return '<span class="tag tag-green">已处理</span>'; if (s === 'pending') return '<span class="tag tag-orange">待处理</span>'; return ''; }
function renderReview(c) {
  const list = reviewFilter === '全部' ? DB.reviews : DB.reviews.filter(r => r.type === reviewFilter);
  c.innerHTML = `
    <div class="page-head"><button class="btn btn-primary" onclick="newReview()">+ 新增评价</button></div>
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
    <div class="page-head"><span class="muted">储值 / 期限 / 次卡，前台一键售卖并到账</span></div>
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

// ===== 技师区 =====
let techCategory = '';
let techKeyword = '';
let techStatusFilter = '';

const TECH_CATEGORIES = ['全部', 'SPA技师', '足疗技师', '按摩技师', '美容美体师', '全能技师'];

function starRating(score) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '<span class="tech-stars">' +
    '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty) +
    '</span> <span class="tech-score">' + score.toFixed(1) + '</span>';
}

function genderTag(gender) {
  return gender === '女'
    ? '<span class="tag tag-blue" style="font-size:11px">♀ 女</span>'
    : '<span class="tag tag-teal" style="font-size:11px">♂ 男</span>';
}

// 根据技师擅长项目，从服务目录派生详细服务列表（名称/说明/价格/时长）
function getTechServices(t) {
  var catalog = (DB.TECH_SERVICE_CATALOG || {});
  return (t.specialties || []).map(function(name) {
    var info = catalog[name] || { desc: '由专业技师为您量身定制服务方案。', price: 0, duration: 60, hot: false };
    return {
      name: name,
      desc: info.desc,
      price: info.price,
      duration: info.duration,
      hot: !!info.hot
    };
  });
}

function renderTechnician(c) {
  // 筛选逻辑
  let list = DB.technicians.filter(t => t.status !== 'off');
  if (techCategory && techCategory !== '全部') {
    list = list.filter(t => t.category === techCategory);
  }
  if (techKeyword) {
    const kw = techKeyword.toLowerCase();
    list = list.filter(t =>
      t.name.toLowerCase().includes(kw) ||
      t.empNo.toLowerCase().includes(kw) ||
      t.category.includes(kw) ||
      t.specialties.some(s => s.includes(kw))
    );
  }
  if (techStatusFilter === 'busy') {
    list = list.filter(t => t.busy);
  } else if (techStatusFilter === 'free') {
    list = list.filter(t => !t.busy);
  }

  // 统计
  const totalCount = DB.technicians.length;
  const onCount = DB.technicians.filter(t => t.status === 'on').length;
  const femaleCount = DB.technicians.filter(t => t.gender === '女' && t.status === 'on').length;
  const busyCount = DB.technicians.filter(t => t.busy).length;
  const avgRating = (DB.technicians.reduce((s, t) => s + t.rating, 0) / DB.technicians.length).toFixed(1);

  c.innerHTML =
    // 页头
    '<div class="page-head">' +
    '<button class="btn btn-primary" onclick="addTechnician()">+ 新增技师</button></div>' +

    // 统计卡片
    '<div class="att-stats">' +
      '<div class="att-stat-card"><div class="att-stat-ico">👥</div><div class="att-stat-num">' + totalCount + '</div><div class="att-stat-label">总人数</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-ico att-ico-green">✅</div><div class="att-stat-num att-stat-green">' + onCount + '</div><div class="att-stat-label">在岗</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-ico att-ico-blue">💁</div><div class="att-stat-num att-stat-blue">' + femaleCount + '</div><div class="att-stat-label">女技师</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-ico att-ico-orange">💆</div><div class="att-stat-num' + (busyCount > 0 ? ' att-stat-orange' : '') + '">' + busyCount + '</div><div class="att-stat-label">服务中</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-ico att-ico-gold">⭐</div><div class="att-stat-num att-stat-gold">' + avgRating + '</div><div class="att-stat-label">平均评分</div></div>' +
    '</div>' +

    // 筛选栏
    '<div class="filter-bar" style="align-items:center">' +
      '<input class="search-input" placeholder="🔍 搜索技师姓名/工号/擅长项目..." value="' + esc(techKeyword) + '" oninput="techKeyword=this.value;renderTechnician($(\'content\'))" />' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-left:auto">' +
        TECH_CATEGORIES.map(cat =>
          '<button class="btn btn-sm ' + (techCategory === cat || (!techCategory && cat === '全部') ? 'btn-primary' : '') + '" onclick="techCategory=\'' + cat + '\';renderTechnician($(\'content\'))">' + cat + '</button>'
        ).join('') +
      '</div>' +
    '</div>' +
    '<div class="filter-bar" style="margin-top:-10px;padding-top:4px">' +
      '<label class="muted" style="font-size:13px;white-space:nowrap">状态：</label>' +
      '<button class="btn btn-sm ' + (!techStatusFilter ? 'btn-primary' : '') + '" onclick="techStatusFilter=\'\';renderTechnician($(\'content\'))">全部</button>' +
      '<button class="btn btn-sm ' + (techStatusFilter === 'free' ? 'btn-primary' : '') + '" onclick="techStatusFilter=\'free\';renderTechnician($(\'content\'))">空闲</button>' +
      '<button class="btn btn-sm ' + (techStatusFilter === 'busy' ? 'btn-primary' : '') + '" onclick="techStatusFilter=\'busy\';renderTechnician($(\'content\'))">服务中</button>' +
      '<span class="muted" style="margin-left:auto">共 <b>' + list.length + '</b> 位技师</span>' +
    '</div>' +

    // 技师卡片网格
    '<div class="tech-grid">' +
      list.map(function(t) {
        var services = getTechServices(t);
        return '<div class="tech-card" onclick="showTechnicianDetail(\'' + t.id + '\')">' +
          // 头部：头像+姓名+状态
          '<div class="tech-card-head">' +
            '<div class="tech-avatar ' + (t.gender === '女' ? 'tech-avatar-f' : 'tech-avatar-m') + '">' + t.avatar + '</div>' +
            '<div class="tech-name-row">' +
              '<div class="tech-name">' + t.name + '</div>' +
              '<div class="tech-tag-inline">' +
                genderTag(t.gender) +
                '<span class="tag ' + (t.busy ? 'tag-orange' : 'tag-green') + '" style="font-size:11px">' + (t.busy ? '服务中' : '空闲') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="tech-emp-no">工号：' + t.empNo + (t.store ? ' · ' + t.store : '') + '</div>' +
          '</div>' +

          // 分类与评分
          '<div class="tech-meta-row">' +
            '<span class="tag tag-purple" style="font-size:11px">' + t.category + '</span>' +
            '<span class="tech-rating-inline">' + starRating(t.rating) + '</span>' +
          '</div>' +

          // 资质
          '<div class="tech-cert-row">🎓 ' + esc(t.cert || '—') + '</div>' +

          // 擅长项目标签
          '<div class="tech-specialties">' +
            t.specialties.slice(0, 3).map(function(s) {
              return '<span class="tech-skill-tag">' + s + '</span>';
            }).join('') +
            (t.specialties.length > 3 ? '<span class="tech-skill-tag tech-more">+' + (t.specialties.length - 3) + '</span>' : '') +
          '</div>' +

          // 服务项目预览（名称 + 价格 + 时长）
          '<div class="tech-services-preview">' +
            services.slice(0, 2).map(function(s) {
              return '<div class="tech-svc-chip"><span class="tech-svc-chip-name">' + s.name + '</span><span class="tech-svc-chip-meta">' + fmtMoney(s.price) + ' · ' + s.duration + '分钟</span></div>';
            }).join('') +
            '<div class="tech-svc-more">查看全部 ' + services.length + ' 项可约服务 ›</div>' +
          '</div>' +

          // 从业年限与服务次数
          '<div class="tech-stats-row">' +
            '<div class="tech-stat-item"><span class="tech-stat-val">' + t.experience + '年</span><span class="tech-stat-lbl">从业</span></div>' +
            '<div class="tech-stat-item"><span class="tech-stat-val">' + t.serviceCount.toLocaleString() + '</span><span class="tech-stat-lbl">服务</span></div>' +
            '<div class="tech-stat-item"><span class="tech-stat-val">' + t.reviewCount + '</span><span class="tech-stat-lbl">评价</span></div>' +
          '</div>' +

          // 荣誉标签
          '<div class="tech-tags-row">' +
            t.tags.map(function(tag) {
              return '<span class="tech-honor-tag">' + tag + '</span>';
            }).join('') +
          '</div>' +

          // 班次信息
          '<div class="tech-schedule-row">🕐 ' + t.schedule + '</div>' +
        '</div>';
      }).join('') +
    '</div>' +

    (list.length === 0 ?
      '<div class="empty" style="grid-column:1/-1"><div style="font-size:40px;margin-bottom:10px">💆</div>没有匹配的技师<br><span class="muted">请尝试调整筛选条件</span></div>'
      : '');
}

// ---- 技师详情弹窗 ----
function showTechnicianDetail(tid) {
  var t = DB.technicians.find(function(x) { return x.id === tid; });
  if (!t) return;

  var mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML =
    '<div class="modal tech-detail-modal">' +
      '<div class="modal-head">' +
        '<span>💆 技师详情 - ' + t.name + '</span>' +
        '<span class="close-x" onclick="this.closest(\'.modal-mask\').remove()">×</span>' +
      '</div>' +
      '<div class="modal-body tech-detail-body">' +
        // 顶部基本信息
        '<div class="tech-detail-header">' +
          '<div class="tech-detail-avatar">' + t.avatar + '</div>' +
          '<div class="tech-detail-info">' +
            '<div class="tech-detail-name-row">' +
              '<h3 style="font-size:20px;font-weight:800;margin:0">' + t.name + '</h3>' +
              '<div class="tech-tag-inline">' +
                genderTag(t.gender) +
                '<span class="tag ' + (t.busy ? 'tag-orange' : 'tag-green') + '">' + (t.busy ? '服务中' : '空闲') + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="tech-detail-meta">' +
              '<span>工号：<b>' + t.empNo + '</b></span>' +
              '<span style="margin-left:16px">分类：<b>' + t.category + '</b></span>' +
              '<span style="margin-left:16px">从业：<b>' + t.experience + ' 年</b></span>' +
              '<span style="margin-left:16px">门店：<b>' + (t.store || '—') + '</b></span>' +
            '</div>' +
            '<div class="tech-detail-cert">🎓 ' + esc(t.cert || '—') + '</div>' +
            '<div class="tech-detail-rating">' + starRating(t.rating) + ' <span class="muted">（' + t.reviewCount + ' 条评价）</span></div>' +
          '</div>' +
        '</div>' +

        // 联系方式与班次
        '<div class="tech-detail-contact">' +
          '<div class="tech-contact-item">📱 ' + t.phone + '</div>' +
          '<div class="tech-contact-item">🏬 ' + (t.store || '—') + '</div>' +
          '<div class="tech-contact-item">🕐 ' + t.schedule + '</div>' +
        '</div>' +

        // 服务统计
        '<div class="tech-detail-stats">' +
          '<div class="tech-dstat"><div class="tech-dstat-val">' + t.serviceCount.toLocaleString() + '</div><div class="tech-dstat-lbl">累计服务</div></div>' +
          '<div class="tech-dstat"><div class="tech-dstat-val">' + t.reviewCount + '</div><div class="tech-dstat-lbl">顾客评价</div></div>' +
          '<div class="tech-dstat"><div class="tech-dstat-val">' + t.experience + '年</div><div class="tech-dstat-lbl">从业年限</div></div>' +
          '<div class="tech-dstat"><div class="tech-dstat-val">' + t.specialties.length + '项</div><div class="tech-dstat-lbl">擅长项目</div></div>' +
          '<div class="tech-dstat"><div class="tech-dstat-val">' + (t.today || 0) + '</div><div class="tech-dstat-lbl">今日服务</div></div>' +
        '</div>' +

        // 擅长项目
        '<div class="tech-detail-section">' +
          '<h4 style="font-size:15px;font-weight:700;margin-bottom:10px">🎯 擅长项目</h4>' +
          '<div class="tech-specialty-list">' +
            t.specialties.map(function(s) {
              return '<span class="tech-specialty-item">' + s + '</span>';
            }).join('') +
          '</div>' +
        '</div>' +

        // 可约服务项目（服务名称 / 内容说明 / 价格 / 时长）
        '<div class="tech-detail-section">' +
          '<h4 style="font-size:15px;font-weight:700;margin-bottom:10px">💆 可约服务项目（' + getTechServices(t).length + '）</h4>' +
          '<div class="tech-service-grid">' +
            getTechServices(t).map(function(s) {
              return '<div class="tech-service-card' + (s.hot ? ' tech-service-hot' : '') + '">' +
                '<div class="tech-svc-head"><span class="tech-svc-title">' + s.name + '</span>' + (s.hot ? '<span class="tech-svc-badge">热门</span>' : '') + '</div>' +
                '<div class="tech-svc-desc">' + s.desc + '</div>' +
                '<div class="tech-svc-foot">' +
                  '<span class="tech-svc-price">' + fmtMoney(s.price) + '</span>' +
                  '<span class="tech-svc-dur">⏱ ' + s.duration + ' 分钟</span>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        // 荣誉标签
        '<div class="tech-detail-section">' +
          '<h4 style="font-size:15px;font-weight:700;margin-bottom:10px">🏆 荣誉资质</h4>' +
          '<div class="tech-honor-list">' +
            t.tags.map(function(tag) {
              return '<span class="tech-honor-item">' + tag + '</span>';
            }).join('') +
          '</div>' +
        '</div>' +

        // 详细简介
        '<div class="tech-detail-section">' +
          '<h4 style="font-size:15px;font-weight:700;margin-bottom:10px">📝 个人简介</h4>' +
          '<div class="tech-bio-text">' + t.bio + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-foot">' +
        '<button class="btn" onclick="this.closest(\'.modal-mask\').remove()">关闭</button>' +
        (t.status === 'on' && !t.busy ?
          '<button class="btn btn-primary" onclick="toast(\'已将 ' + t.name + ' 加入收银台指定技师\');$(\'.modal-mask\').remove()">预约此技师</button>'
          : (t.busy ?
            '<button class="btn btn-primary" disabled title="该技师正在服务中">当前服务中</button>'
            :           '<button class="btn" disabled title="该技师暂未在岗">暂未在岗</button>')) +
      '</div>' +
    '</div>';
  document.body.appendChild(mask);
}

// ===== 新增技师 =====
function addTechnician() {
  var newId = 'T' + String(1000 + DB.technicians.length + 1).padStart(4, '0');
  var newEmpNo = 'E' + String(4000 + DB.technicians.length + 13).padStart(4, '0');
  openModal('新增技师', `
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>姓名 <span class="required">*</span></label><input class="input" id="nt-name" placeholder="技师姓名" /></div>
      <div class="form-item" style="flex:1"><label>性别</label>
        <select class="select" id="nt-gender">
          <option value="女">女</option>
          <option value="男">男</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>工号</label><input class="input" id="nt-empno" value="${newEmpNo}" readonly style="background:#f5f7fa;color:#999" /></div>
      <div class="form-item" style="flex:1"><label>分类</label>
        <select class="select" id="nt-category">
          <option value="SPA技师">SPA技师</option>
          <option value="足疗技师">足疗技师</option>
          <option value="按摩技师">按摩技师</option>
          <option value="美容美体师">美容美体师</option>
          <option value="全能技师">全能技师</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>从业年限</label><input class="input" id="nt-exp" type="number" placeholder="如 5" value="3" min="1" max="30" /></div>
      <div class="form-item" style="flex:1"><label>初始评分</label>
        <select class="select" id="nt-rating">
          <option value="4.9">4.9 ⭐⭐⭐⭐⭐</option>
          <option value="4.8">4.8 ⭐⭐⭐⭐☆</option>
          <option value="4.7" selected>4.7 ⭐⭐⭐⭐☆</option>
          <option value="4.6">4.6 ⭐⭐⭐☆☆</option>
          <option value="4.5">4.5 ⭐⭐⭐☆☆</option>
        </select>
      </div>
    </div>
    <div class="form-item"><label>擅长项目（多选，按住Ctrl）</label>
      <select class="select" id="nt-specs" multiple size="4" style="height:auto;min-height:80px">
        <option value="精油SPA">精油SPA</option>
        <option value="泰式按摩">泰式按摩</option>
        <option value="中药足疗">中药足疗</option>
        <option value="中式推拿">中式推拿</option>
        <option value="面部护理">面部护理</option>
        <option value="淋巴排毒">淋巴排毒</option>
        <option value="热石疗法">热石疗法</option>
        <option value="身体塑形">身体塑形</option>
        <option value="玫瑰花瓣浴">玫瑰花瓣浴</option>
        <option value="头皮养护">头皮养护</option>
      </select>
    </div>
    <div class="form-item"><label>联系电话</label><input class="input" id="nt-phone" placeholder="11位手机号" /></div>
    <div class="form-item"><label>个人简介</label><textarea class="input" id="nt-bio" rows="3" placeholder="简要介绍技师的从业背景、擅长领域、服务特色等..."></textarea></div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>资质认证</label><input class="input" id="nt-cert" placeholder="如：国家高级美容师 / 高级按摩师" /></div>
      <div class="form-item" style="flex:1"><label>所属门店</label>
        <select class="select" id="nt-store">
          <option value="旗舰店">旗舰店</option>
          <option value="中心店">中心店</option>
          <option value="社区店">社区店</option>
        </select>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <div class="form-item" style="flex:1"><label>状态</label>
        <select class="select" id="nt-status">
          <option value="on" selected>在岗</option>
          <option value="off">离岗/休假</option>
        </select>
      </div>
      <div class="form-item" style="flex:1"><label>头像图标</label>
        <select class="select" id="nt-avatar">
          <option value="👩‍💼">👩‍💼 女职业</option>
          <option value="👩‍🦰">👩‍🦰 女红发</option>
          <option value="👩‍🦱">👩‍🦱 女金发</option>
          <option value="👩">👩 女</option>
          <option value="👩‍🦳">👩‍🦳 女银发</option>
          <option value="👨‍💼">👨‍💼 男职业</option>
          <option value="👨">👨 男</option>
          <option value="👨‍🦱">👨‍🦱 男金发</option>
          <option value="👨‍🦰">👨‍🦰 男红发</option>
        </select>
      </div>
    </div>
  `, function() {
    var name = $('nt-name').value.trim();
    if (!name) return toast('请输入技师姓名');
    // 收集多选擅长项目
    var sel = $('nt-specs');
    var specs = [];
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].selected) specs.push(sel.options[i].value);
    }
    if (specs.length === 0) specs = ['待定'];

    DB.technicians.push({
      id: newId,
      name: name,
      gender: $('nt-gender').value,
      empNo: $('nt-empno').value || newEmpNo,
      avatar: $('nt-avatar').value,
      category: $('nt-category').value,
      specialties: specs,
      experience: parseInt($('nt-exp').value) || 3,
      rating: parseFloat($('nt-rating').value) || 4.5,
      reviewCount: 0,
      serviceCount: 0,
      status: $('nt-status').value,
      busy: false,
      phone: $('nt-phone').value.trim() || '—',
      cert: $('nt-cert').value.trim() || '—',
      store: $('nt-store').value || '旗舰店',
      today: 0,
      bio: $('nt-bio').value.trim() || name + '，' + $('nt-category').value + '，从业' + ($('nt-exp').value || 3) + '年，欢迎到店体验。',
      tags: ['新入职']
    });
    toast('技师添加成功：' + name + '（工号：' + newEmpNo + '）');
    renderTechnician($('content'));
  }, '确认添加');
}

// ===== 任务管理 =====
var taskFilter = '';       // 状态筛选: '' | '待开始' | '进行中' | '已完成' | '已取消'
var taskPriorityFilter = ''; // 优先级筛选: '' | '高' | '中' | '低'
var taskKeyword = '';      // 搜索关键词

// 状态配置：标签样式 + 颜色
var TASK_STATUS = {
  '待开始': ['tag-gray', '待开始'],
  '进行中': ['tag-blue', '进行中'],
  '已完成': ['tag-green', '已完成'],
  '已取消': ['tag-red', '已取消']
};

// 优先级配置：颜色 + 图标
var TASK_PRIORITY = {
  '高': { color: '#e74c3c', bg: '#fdf0ef', icon: '🔴' },
  '中': { color: '#f39c12', bg: '#fef9e7', icon: '🟡' },
  '低': { color: '#27ae60', bg: '#eafaf1', icon: '🟢' }
};

// 点击状态标签切换
function toggleTaskStatusMenu(event, taskId) {
  event.stopPropagation();
  var existing = document.querySelector('.task-status-dropdown');
  if (existing) existing.remove();

  var task = DB.tasks.find(function(t) { return t.id === taskId; });
  if (!task) return;

  var btn = event.currentTarget;
  var rect = btn.getBoundingClientRect();

  var dropdown = document.createElement('div');
  dropdown.className = 'task-status-dropdown';
  dropdown.innerHTML =
    '<div class="tsd-arrow"></div>' +
    Object.keys(TASK_STATUS).map(function(s) {
      var cls = TASK_STATUS[s][0];
      var active = s === task.status ? ' tsd-active' : '';
      return '<div class="tsd-item' + active + '" data-status="' + s + '" onclick="changeTaskStatus(\'' + taskId + '\', \'' + s + '\')">' +
        '<span class="tag ' + cls + '" style="font-size:12px;pointer-events:none">' + s + '</span>' +
        '</div>';
    }).join('');

  dropdown.style.position = 'fixed';
  dropdown.style.left = (rect.left + rect.width / 2 - 60) + 'px';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  document.body.appendChild(dropdown);

  setTimeout(function() {
    document.addEventListener('click', function closeDrop() {
      var d = document.querySelector('.task-status-dropdown');
      if (d) d.remove();
      document.removeEventListener('click', closeDrop);
    });
  }, 10);
}

// 执行状态变更
function changeTaskStatus(taskId, newStatus) {
  var task = DB.tasks.find(function(t) { return t.id === taskId; });
  if (!task) return;
  var oldStatus = task.status;
  task.status = newStatus;
  task.updatedAt = new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-');

  var drop = document.querySelector('.task-status-dropdown');
  if (drop) drop.remove();

  toast('任务「' + task.title + '」状态：' + oldStatus + ' → ' + newStatus);
  renderTask($('content'));
}

// ===== 新增任务表单 =====
function showTaskForm(editId) {
  var task = editId ? DB.tasks.find(function(t) { return t.id === editId; }) : null;
  var isEdit = !!task;
  var title = isEdit ? '编辑任务' : '新增任务';

  // 负责人选项：从员工列表提取
  var assigneeOptions = DB.employees.map(function(e) {
    return '<option value="' + e.name + '"' + (task && task.assignee === e.name ? ' selected' : '') + '>' + e.name + ' (' + e.role + ')</option>';
  }).join('');

  var modal = document.createElement('div');
  modal.className = 'modal-mask';
  modal.innerHTML =
    '<div class="modal" style="max-width:580px;width:90%">' +
      '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close" onclick="this.closest(\'.modal-mask\').remove()">&times;</button></div>' +
      '<div class="modal-body">' +
        '<form id="taskForm" onsubmit="return false;">' +
          '<input type="hidden" id="task-edit-id" value="' + (editId || '') + '" />' +

          '<div class="form-item"><label>任务标题 <span style="color:#e74c3c">*</span></label>' +
            '<input type="text" id="task-title" class="input" placeholder="请输入任务标题（必填，2-50字）" value="' + esc(task ? task.title : '') + '" maxlength="50" /></div>' +

          '<div class="form-item"><label>任务描述</label>' +
            '<textarea id="task-desc" class="textarea" rows="3" placeholder="请输入任务详细描述（选填）" maxlength="500">' + esc(task ? task.desc : '') + '</textarea>' +
            '<div class="muted" style="font-size:11px;text-align:right;margin-top:2px"><span id="task-desc-count">' + (task && task.desc ? task.desc.length : 0) + '</span>/500</div></div>' +

          '<div style="display:flex;gap:12px">' +
            '<div class="form-item" style="flex:1"><label>负责人 <span style="color:#e74c3c">*</span></label>' +
              '<select id="task-assignee" class="select">' +
                '<option value="">-- 请选择负责人 --</option>' +
                assigneeOptions +
              '</select></div>' +
            '<div class="form-item" style="flex:1"><label>优先级</label>' +
              '<select id="task-priority" class="select">' +
                '<option value="高"' + (task && task.priority === '高' ? ' selected' : '') + '>🔴 高优先</option>' +
                '<option value="中"' + (!task || task.priority === '中' ? ' selected' : '') + '>🟡 中优先</option>' +
                '<option value="低"' + (task && task.priority === '低' ? ' selected' : '') + '>🟢 低优先</option>' +
              '</select></div>' +
          '</div>' +

          '<div style="display:flex;gap:12px">' +
            '<div class="form-item" style="flex:1"><label>截止日期 <span style="color:#e74c3c">*</span></label>' +
              '<input type="date" id="task-deadline" class="input" value="' + (task ? task.deadline : '') + '" /></div>' +
            '<div class="form-item" style="flex:1"><label>状态</label>' +
              '<select id="task-status-sel" class="select">' +
                '<option value="待开始"' + ((!task || task.status === '待开始') ? ' selected' : '') + '>待开始</option>' +
                '<option value="进行中"' + (task && task.status === '进行中' ? ' selected' : '') + '>进行中</option>' +
                '<option value="已完成"' + (task && task.status === '已完成' ? ' selected' : '') + '>已完成</option>' +
                '<option value="已取消"' + (task && task.status === '已取消' ? ' selected' : '') + '>已取消</option>' +
              '</select></div>' +
          '</div>' +

          '<div id="task-form-errors" class="task-form-errors" style="display:none"></div>' +
        '</form>' +
      '</div>' +
      '<div class="modal-footer" style="justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #eee">' +
        '<button class="btn btn-sm" onclick="this.closest(\'.modal-mask\').remove()">取消</button>' +
        '<button class="btn btn-primary btn-sm" onclick="saveTask()">' + (isEdit ? '保存修改' : '创建任务') + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);

  // 描述字数统计
  var descEl = document.getElementById('task-desc');
  if (descEl) {
    descEl.addEventListener('input', function() {
      document.getElementById('task-desc-count').textContent = this.value.length;
    });
  }

  // 截止日期默认值：今天+7天
  if (!task) {
    var dl = document.getElementById('task-deadline');
    if (dl && !dl.value) {
      var def = new Date();
      def.setDate(def.getDate() + 7);
      dl.value = def.toISOString().slice(0, 10);
    }
  }
}

// 表单验证
function validateTaskForm() {
  var errors = [];
  var title = document.getElementById('task-title').value.trim();
  var assignee = document.getElementById('task-assignee').value;
  var deadline = document.getElementById('task-deadline').value;

  if (!title) {
    errors.push('任务标题为必填项');
  } else if (title.length < 2) {
    errors.push('任务标题至少需要2个字符');
  } else if (title.length > 50) {
    errors.push('任务标题不能超过50个字符');
  }

  if (!assignee) {
    errors.push('请选择负责人');
  }

  if (!deadline) {
    errors.push('截止日期为必填项');
  } else {
    var d = new Date(deadline);
    var today = new Date(); today.setHours(0,0,0,0);
    if (d < today) {
      errors.push('截止日期不能早于今天');
    }
  }

  return errors;
}

// 显示/隐藏表单错误
function showTaskErrors(errors) {
  var el = document.getElementById('task-form-errors');
  if (!el) return;
  if (errors.length > 0) {
    el.style.display = 'block';
    el.innerHTML = errors.map(function(e) { return '<div style="color:#e74c3c;font-size:12px;margin-bottom:4px">⚠️ ' + e + '</div>'; }).join('');
  } else {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

// 保存任务
function saveTask() {
  var errors = validateTaskForm();
  showTaskErrors(errors);
  if (errors.length > 0) return;

  var editId = document.getElementById('task-edit-id').value;
  var title = document.getElementById('task-title').value.trim();
  var desc = document.getElementById('task-desc').value.trim();
  var assignee = document.getElementById('task-assignee').value;
  var priority = document.getElementById('task-priority').value;
  var deadline = document.getElementById('task-deadline').value;
  var status = document.getElementById('task-status-sel').value;
  var now = new Date().toLocaleString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(/\//g, '-');

  if (editId) {
    // 编辑模式
    var task = DB.tasks.find(function(t) { return t.id === editId; });
    if (task) {
      task.title = title;
      task.desc = desc;
      task.assignee = assignee;
      task.priority = priority;
      task.deadline = deadline;
      task.status = status;
      task.updatedAt = now;
      toast('任务「' + title + '」已更新');
    }
  } else {
    // 新增模式 - 自动生成ID
    var maxNum = 0;
    DB.tasks.forEach(function(t) {
      var m = t.id.match(/^TK(\d+)$/);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
    });
    var newId = 'TK' + String(maxNum + 1).padStart(3, '0');

    var newTask = {
      id: newId,
      title: title,
      desc: desc,
      assignee: assignee,
      priority: priority,
      deadline: deadline,
      status: status,
      createdAt: now,
      updatedAt: now
    };
    DB.tasks.push(newTask);
    toast('任务「' + title + '」创建成功（编号：' + newId + '）');
  }

  // 持久化到 localStorage
  persistData();

  // 关闭弹窗并刷新
  var modal = document.querySelector('.modal-mask');
  if (modal) modal.remove();

  renderTask($('content'));
}

function renderTask(c) {
  var list = DB.tasks.slice();
  if (taskFilter) list = list.filter(function(t) { return t.status === taskFilter; });
  if (taskPriorityFilter) list = list.filter(function(t) { return t.priority === taskPriorityFilter; });
  if (taskKeyword) {
    var kw = taskKeyword.toLowerCase();
    list = list.filter(function(t) {
      return t.title.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw) || t.assignee.toLowerCase().includes(kw);
    });
  }

  var total = DB.tasks.length;
  var pending = DB.tasks.filter(function(t) { return t.status === '待开始'; }).length;
  var inProgress = DB.tasks.filter(function(t) { return t.status === '进行中'; }).length;
  var done = DB.tasks.filter(function(t) { return t.status === '已完成'; }).length;
  var cancelled = DB.tasks.filter(function(t) { return t.status === '已取消'; }).length;

  c.innerHTML =
    '<div class="page-head">' +
    '<button class="btn btn-primary" onclick="showTaskForm()">+ 新增任务</button></div>' +

    '<div class="att-stats">' +
      '<div class="att-stat-card"><div class="att-stat-num">' + total + '</div><div class="att-stat-label">全部任务</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num att-stat-orange">' + pending + '</div><div class="att-stat-label">待开始</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num att-stat-blue">' + inProgress + '</div><div class="att-stat-label">进行中</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num att-stat-green">' + done + '</div><div class="att-stat-label">已完成</div></div>' +
      '<div class="att-stat-card"><div class="att-stat-num" style="color:#999">' + cancelled + '</div><div class="att-stat-label">已取消</div></div>' +
    '</div>' +

    '<div class="filter-bar" style="align-items:center">' +
      '<input class="search-input" placeholder="🔍 搜索任务标题/描述/负责人..." value="' + esc(taskKeyword) + '" oninput="taskKeyword=this.value;renderTask($(\'content\'))" />' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-left:auto">' +
        ['全部', '高', '中', '低'].map(function(p) {
          var isActive = (!taskPriorityFilter && p === '全部') || (taskPriorityFilter === p);
          var pColor = p === '高' ? '#e74c3c' : (p === '中' ? '#f39c12' : (p === '低' ? '#27ae60' : ''));
          return '<button class="btn btn-sm ' + (isActive ? 'btn-primary' : '') + '" onclick="taskPriorityFilter=\'' + (p === '全部' ? '' : p) + '\';renderTask($(\'content\'))" style="' + (pColor ? 'border-color:' + pColor + ';color:' + pColor : '') + '">' + (p === '全部' ? '优先级' : TASK_PRIORITY[p].icon + ' ' + p + '优先') + '</button>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div class="filter-bar" style="margin-top:-10px;padding-top:4px">' +
      '<label class="muted" style="font-size:13px;white-space:nowrap">状态：</label>' +
      [''].concat(Object.keys(TASK_STATUS)).map(function(s) {
        var label = s || '全部';
        var isActive = (taskFilter === s);
        return '<button class="btn btn-sm ' + (isActive ? 'btn-primary' : '') + '" onclick="taskFilter=\'' + s + '\';renderTask($(\'content\'))">' + label + '</button>';
      }).join('') +
      '<span class="muted" style="margin-left:auto">共 <b>' + list.length + '</b> 条任务</span>' +
    '</div>' +

    '<div class="task-list">' +
      list.map(function(t) {
        var pri = TASK_PRIORITY[t.priority];
        var stCls = TASK_STATUS[t.status];
        var todayStr = new Date().toISOString().slice(0, 10);
        var isOverdue = t.deadline < todayStr && t.status !== '已完成' && t.status !== '已取消';

        return '<div class="task-card" data-priority="' + t.priority + '">' +
          '<div class="task-priority-bar" style="background:' + pri.color + '"></div>' +
          '<div class="task-card-body">' +
            '<div class="task-card-header">' +
              '<h3 class="task-title">' + t.title + '</h3>' +
              '<div class="task-status-wrapper" onclick="toggleTaskStatusMenu(event,\'' + t.id + '\')">' +
                '<span class="tag ' + stCls[0] + ' task-status-tag">' + t.status + ' ▾</span>' +
              '</div>' +
            '</div>' +
            '<p class="task-desc">' + t.desc + '</p>' +
            '<div class="task-meta-row">' +
              '<span class="task-meta-item">👤 ' + t.assignee + '</span>' +
              '<span class="task-meta-item" style="color:' + pri.color + ';font-weight:600">' + pri.icon + ' ' + t.priority + '</span>' +
              '<span class="task-meta-item" style="color:' + (isOverdue ? '#e74c3c' : 'inherit') + '">📅 ' + t.deadline + (isOverdue ? ' ⚠️ 已逾期' : '') + '</span>' +
            '</div>' +
            '<div class="task-time-row">' +
              '<span>创建：' + (t.createdAt || '').split(' ')[0] + '</span>' +
              '<span>更新：' + (t.updatedAt || '').split(' ')[0] + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>' +

    (list.length === 0 ?
      '<div class="empty" style="grid-column:1/-1"><div style="font-size:40px;margin-bottom:10px">📋</div>没有匹配的任务<br><span class="muted">请尝试调整筛选条件</span></div>'
      : '');
}

// 启动完成标记：供 index.html 自检脚本判断是否成功加载（用于诊断“点登录无反应”）
if (typeof window !== 'undefined') window.__appBooted = true;
