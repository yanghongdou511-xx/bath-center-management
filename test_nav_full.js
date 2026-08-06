// 功能级自测：所有页面路由/渲染/菜单一致性
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

// === Mock DOM ===
var _store = {};
global.localStorage = {
  getItem: function (k) { return _store[k] || null; },
  setItem: function (k, v) { _store[k] = String(v); },
  removeItem: function (k) { delete _store[k]; }
};
var elements = {};
function $(id) {
  if (elements[id]) return elements[id];
  return {
    value: '', style: {}, className: '',
    classList: { add: function () {}, remove: function () {}, toggle: function () {} },
    querySelector: function () { return null; },
    addEventListener: function () {},
    innerHTML: '', textContent: '',
    remove: function () {}, appendChild: function () {},
    closest: function () { return { remove: function () {} }; },
    setAttribute: function () {}, getAttribute: function () { return ''; },
    children: [], removeChild: function () {}
  };
}
document = {
  getElementById: $,
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  createElement: function (tag) {
    return {
      id: '', style: {}, className: '',
      classList: { add: function () {}, remove: function () {}, toggle: function () {} },
      innerHTML: '', textContent: '', children: [],
      querySelector: function (s) {
        if (s === '#modal-save') return { addEventListener: function (fn) {} };
        return null;
      },
      setAttribute: function () {}, getAttribute: function () { return ''; },
      appendChild: function () {}, remove: function () {},
      closest: function () { return { remove: function () {} }; }, removeChild: function () {}
    };
  },
  body: { appendChild: function () {}, childNodes: [] },
  addEventListener: function () {}
};

// 加载代码（const/let -> var）
var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
eval(dc);
eval(ac);

console.log('=== A. 数据加载 ===');
assert(typeof DB !== 'undefined', 'DB对象存在');
assert(DB.members && DB.members.length > 0, '会员数据加载 (' + DB.members.length + '条)');
assert(DB.walkinGuests && DB.walkinGuests.length > 0, '散客数据加载 (' + DB.walkinGuests.length + '条)');
assert(DB.services && DB.services.length > 0, '服务项目数据 (' + DB.services.length + '条)');
assert(DB.rooms && DB.rooms.length > 0, '房间数据 (' + DB.rooms.length + ')');
assert(DB.inventory && DB.inventory.length > 0, '库存数据 (' + DB.inventory.length + '条)');
assert(DB.employees && DB.employees.length > 0, '员工数据 (' + DB.employees.length + '条)');

console.log('\n=== B. TITLES和渲染函数注册 ===');
assert(typeof TITLES === 'object' && Object.keys(TITLES).length === 18, 'TITLES有18个路由');

// 验证每个路由都有对应的全局渲染函数
var routes = ['dashboard', 'member', 'walkin', 'service', 'cashier', 'room',
  'inventory', 'employee', 'technician', 'task', 'reservation', 'marketing',
  'locker', 'attendance', 'review', 'package', 'report', 'store'];
routes.forEach(function (r) {
  assert(TITLES[r], 'TITLES.' + r + ' 存在: "' + TITLES[r] + '"');
  var fnName = 'render' + r.charAt(0).toUpperCase() + r.slice(1);
  assert(typeof global[fnName] === 'function' || typeof eval(fnName) === 'function',
    fnName + ' 渲染函数存在');
});

console.log('\n=== C. 页面渲染测试（18页） ===');
routes.forEach(function (r) {
  var mockContent = { innerHTML: '' };
  try {
    var fnName = 'render' + r.charAt(0).toUpperCase() + r.slice(1);
    var fn = eval(fnName);
    fn(mockContent);
    var rendered = mockContent.innerHTML;
    assert(rendered.length > 50, '[' + TITLES[r] + '] 渲染成功 (' + rendered.length + '字符)');
    // 页面标题已移至顶部栏 page-title，内容区不再含 <h2> 页标题
    assert(rendered.indexOf('<h2') === -1, '[' + TITLES[r] + '] 内容区无 <h2> 页标题');
  } catch (e) {
    assert(false, '[' + TITLES[r] + '] 渲染异常: ' + e.message);
  }
});

console.log('\n=== D. 菜单项唯一性 ===');
// 从index.html提取
var html = fs.readFileSync('index.html', 'utf8');
var menuItems = html.match(/data-page="(\w+)"[^>]*>.*?<span class="mi-icon">[^<]*<\/span>([^<]+)/g) || [];
var labels = [];
menuItems.forEach(function (m) {
  var lbl = m.match(/mi-icon">[^<]*<\/span>(.+)/)[1];
  labels.push(lbl);
});
assert(labels.length === 18, '侧边栏共18个菜单项');

var seen = {};
var hasDup = false;
labels.forEach(function (l) {
  if (seen[l]) hasDup = true;
  seen[l] = true;
});
assert(!hasDup, '菜单名称全部唯一');

console.log('\n=== E. 核心功能函数可用性 ===');
assert(typeof openModal === 'function', 'openModal可用');
assert(typeof toast === 'function', 'toast可用');
assert(typeof esc === 'function', 'esc可用');
assert(typeof fmtMoney === 'function', 'fmtMoney可用');
assert(typeof persistData === 'function', 'persistData可用');
assert(typeof loadPersistedData === 'function', 'loadPersistedData可用');
assert(typeof convertToMember === 'function', 'convertToMember可用');
assert(typeof nextMemberId === 'function', 'nextMemberId可用');
assert(typeof nextWalkinId === 'function', 'nextWalkinId可用');
assert(typeof quickChangeSource === 'function', 'quickChangeSource可用(来源编辑)');
assert(typeof toggleSourceEdit === 'function', 'toggleSourceEdit可用(来源编辑)');
assert(typeof resetDemoData === 'function', 'resetDemoData可用(重置数据)');

console.log('\n=== F. 导航切换模拟 ===');
var pageTitleEl = { textContent: '' };
elements['page-title'] = pageTitleEl;
elements['content'] = { innerHTML: '' };

// 模拟navigateTo逻辑
function testNavigate(pageKey) {
  var title = TITLES[pageKey];
  pageTitleEl.textContent = title;
  var contentEl = { innerHTML: '' };
  try {
    var fnName = 'render' + pageKey.charAt(0).toUpperCase() + pageKey.slice(1);
    var fn = eval(fnName);
    fn(contentEl);
    return contentEl.innerHTML.length > 20;
  } catch (e) {
    return false;
  }
}

var navOk = 0, navFail = 0;
routes.forEach(function (r) {
  if (testNavigate(r)) navOk++; else navFail++;
});
assert(navOk === 18, '18个页面导航全部成功 (ok=' + navOk + ' fail=' + navFail + ')');

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL ' + tests + ' TESTS PASSED');
else console.log('FAILURES: ' + failed);
