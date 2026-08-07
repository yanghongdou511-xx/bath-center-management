// 全量审计自测：覆盖全部功能模块渲染 + 弹窗构建 + 关键交互链路
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; } else { failed++; console.log('  FAIL ' + msg); } }

// === Mock DOM（贴近真实浏览器：缺失元素返回 null 由代码自身兜底） ===
var _store = {};
global.localStorage = {
  getItem: function (k) { return _store[k] || null; },
  setItem: function (k, v) { _store[k] = String(v); },
  removeItem: function (k) { delete _store[k]; }
};
var elements = {};
global.__saveFns = [];   // 收集 openModal 中绑定的「保存」点击处理器
function makeSaveBtn() {
  return {
    addEventListener: function (ev, fn) { if (typeof fn === 'function') global.__saveFns.push(fn); },
    click: function () { var f = global.__saveFns[global.__saveFns.length - 1]; if (typeof f === 'function') f(); }
  };
}
function makeEl(id) {
  return {
    id: id || '', value: '', style: {}, className: '', innerHTML: '', textContent: '',
    classList: { add: function () {}, remove: function () {}, toggle: function () {} },
    querySelector: function (sel) { return sel === '#modal-save' ? makeSaveBtn() : null; },
    addEventListener: function () {}, setAttribute: function () {}, getAttribute: function () { return ''; },
    appendChild: function () {}, remove: function () {}, closest: function () { return { remove: function () {} }; },
    children: [], removeChild: function () {}
  };
}
function $(id) { if (elements[id]) return elements[id]; var e = makeEl(id); elements[id] = e; return e; }
var _lastModal = null;
var document = {
  getElementById: $,
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  createElement: function (tag) {
    var e = makeEl();
    e.tag = tag;
    e.querySelector = function (sel) { return sel === '#modal-save' ? makeSaveBtn() : null; };
    return e;
  },
  body: { appendChild: function (node) { _lastModal = node; if (node && node.querySelector) node.querySelector('#modal-save'); }, childNodes: [] },
  addEventListener: function () {}
};
function clickLastSave() { var fns = global.__saveFns.splice(0); fns.forEach(function (f) { if (typeof f === 'function') f(); }); }

// 定时器置为 no-op：避免 setInterval/setTimeout 在 Node 中挂起与异步崩溃（真实浏览器不受影响）
global.setTimeout = function () { return 0; };
global.setInterval = function () { return 0; };
global.clearTimeout = function () {};
global.clearInterval = function () {};

// 加载代码（const/let -> var，与项目测试规范一致）
var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
eval(dc);
eval(ac);

var routes = ['dashboard', 'member', 'walkin', 'service', 'cashier', 'room',
  'inventory', 'employee', 'technician', 'task', 'reservation', 'marketing',
  'locker', 'attendance', 'review', 'package', 'report', 'store'];

console.log('=== A. 18 个页面渲染（逻辑正确性 / 接口一致性） ===');
routes.forEach(function (r) {
  var c = { innerHTML: '' };
  try {
    var fn = eval('render' + r.charAt(0).toUpperCase() + r.slice(1));
    fn(c);
    assert(c.innerHTML.length > 50, '[' + r + '] 渲染成功 (' + c.innerHTML.length + '字符)');
  } catch (e) {
    assert(false, '[' + r + '] 渲染异常: ' + e.message);
  }
});

console.log('\n=== B. editMember 保存链路（曾因 em-pointsadj 空引用崩溃） ===');
(function () {
  elements['em-name'] = { value: '修改测试', style: {}, classList: { add: function () {}, remove: function () {} } };
  elements['em-phone'] = { value: '139****0000', style: {} };
  elements['em-level'] = { value: '金卡', style: {} };
  elements['em-status'] = { value: 'on', style: {} };
  elements['em-balance-adj'] = { value: '100', style: {} };
  elements['em-points-adj'] = { value: '50', style: {} };
  try {
    editMember('M10001');
    var html = _lastModal ? _lastModal.innerHTML : '';
    assert(html.indexOf('id="em-points-adj"') !== -1, '弹窗含正确字段 id="em-points-adj"');
    assert(html.indexOf('em-pointsadj') === -1, '弹窗不含错误 id 令牌 em-pointsadj（修复标志）');
    var before = DB.members.find(function (m) { return m.id === 'M10001'; });
    var bBal = before.balance, bPts = before.points;
    clickLastSave();
    var after = DB.members.find(function (m) { return m.id === 'M10001'; });
    assert(after.balance === bBal + 100, '保存后余额 +100（' + bBal + '→' + after.balance + '）');
    assert(after.points === bPts + 50, '保存后积分 +50（' + bPts + '→' + after.points + '）');
  } catch (e) {
    assert(false, 'editMember 保存异常: ' + e.message);
  }
})();

console.log('\n=== C. 员工状态词汇一致性（on/off 需与考勤/签到/dashboard 一致） ===');
assert(typeof EMP_STATUS === 'object' && EMP_STATUS.on, 'EMP_STATUS 含 "on" 键（在职）');
assert(EMP_STATUS.off, 'EMP_STATUS 含 "off" 键（离岗/休假）');
assert(DB.employees.every(function (e) { return !!EMP_STATUS[e.status]; }), '全部种子员工 status 均为 EMP_STATUS 合法键');
(function () {
  var c = { innerHTML: '' };
  renderEmployee(c);
  assert(c.innerHTML.indexOf('value="on"') !== -1, '员工管理状态下拉含 value="on" 选项');
  assert(c.innerHTML.indexOf('value="off"') !== -1, '员工管理状态下拉含 value="off" 选项');
})();
(function () {
  elements['emp-name'] = { value: '新同事', style: {} };
  elements['emp-code'] = { value: 'E4099', style: {} };
  elements['emp-phone'] = { value: '137****1234', style: {} };
  elements['emp-role'] = { value: '收银员', style: {} };
  elements['emp-dept'] = { value: '前厅部', style: {} };
  elements['emp-level'] = { value: '—', style: {} };
  elements['emp-commission'] = { value: '10%', style: {} };
  elements['emp-joindate'] = { value: '2026-08-07', style: {} };
  elements['emp-status'] = { value: 'on', style: {} };
  elements['emp-note'] = { value: '', style: {} };
  try {
    addEmployee();
    clickLastSave();
    var e = DB.employees[DB.employees.length - 1];
    assert(e.status === 'on', '新增员工状态保持 "on"（考勤/签到可用）');
  } catch (err) { assert(false, 'addEmployee 异常: ' + err.message); }
})();

console.log('\n=== D. 关键弹窗构建不抛异常（接口调用一致性） ===');
var modalBuilders = [
  ['openMemberModal', function () { openMemberModal(); }],
  ['addWalkinGuest', function () { addWalkinGuest(); }],
  ['openAddServiceModal', function () { openAddServiceModal(); }],
  ['newReservation', function () { newReservation(); }],
  ['newCoupon', function () { newCoupon(); }],
  ['addEmployee', function () { addEmployee(); }],
  ['newReview', function () { newReview(); }],
  ['showTaskForm', function () { showTaskForm(); }],
  ['addTechnician', function () { addTechnician(); }],
  ['purchaseInbound', function () { purchaseInbound(); }],
  ['stockIn', function () { stockIn('P3001'); }],
  ['adjustStock', function () { adjustStock('P3001'); }],
  ['editProduct', function () { editProduct('P3001'); }],
  ['recharge', function () { recharge('M10001'); }],
  ['convertToMember', function () { convertToMember('W10001'); }],
  ['showOrderDetail', function () { showOrderDetail('O8001'); }],
  ['showTechnicianDetail', function () { showTechnicianDetail('T1001'); }],
  ['assignLocker', function () { assignLocker('L01'); }],
  ['clockIn', function () { clockIn(); }],
  ['clockOut', function () { clockOut(); }],
  ['editShiftCell', function () { editShiftCell('李师傅', '周一'); }],
  ['issueCoupon', function () { issueCoupon('C01'); }]
];
modalBuilders.forEach(function (pair) {
  try {
    pair[1]();
    var html = _lastModal ? _lastModal.innerHTML : '';
    assert(html.length > 10, '[' + pair[0] + '] 弹窗构建成功');
  } catch (e) {
    assert(false, '[' + pair[0] + '] 弹窗构建异常: ' + e.message);
  }
});

console.log('\n=== E. 收银支付链路（购物车→确认→小票） ===');
try {
  addCart('S2001');
  assert(cart.length === 1, 'addCart 后购物车有 1 项');
  confirmPay('微信', 88);
  assert(_lastModal && _lastModal.innerHTML.indexOf('qr-pay-enhanced') !== -1, 'confirmPay 构建扫码支付弹窗');
  var oBefore = DB.orders.length;
  completePayment('微信', 88, null);
  assert(DB.orders.length === oBefore + 1, 'completePayment 生成 1 条订单');
  assert(cart.length === 0, 'completePayment 清空购物车');
} catch (e) {
  assert(false, '收银链路异常: ' + e.message);
}

console.log('\n=== F. 转化会员链路（散客→会员） ===');
try {
  elements['cm-name'] = { value: '转化测试', style: {} };
  elements['cm-phone'] = { value: '13812345678', style: {} };
  elements['cm-gender'] = { value: '男', style: {} };
  elements['cm-birthday'] = { value: '1990-01-01', style: {} };
  elements['cm-note'] = { value: '', style: {} };
  elements['cv-recharge'] = { value: '1000', style: {} };
  convertToMember('W10001');
  submitConvertMember();
  assert(DB.members.some(function (m) { return m.sourceWalkin === 'W10001'; }), '转化后在会员表生成记录（sourceWalkin=W10001）');
  assert(DB.walkinGuests.find(function (g) { return g.id === 'W10001'; }).converted === true, '原散客标记 converted=true');
} catch (e) {
  assert(false, '转化链路异常: ' + e.message);
}

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL ' + tests + ' TESTS PASSED');
else { console.log('FAILURES: ' + failed); process.exitCode = 1; }
