// 自测：删除页面内容内出现的页标题(<h2>)后，功能不回归
// 验证：1) 所有页面渲染无报错；2) 内容区不再含 <h2> 页标题；
//      3) 顶部栏 TITLES 仍保留页面标题；4) 模态框/卡片/分区小标题(<h3>)保留
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK  ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

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
      querySelector: function (s) { return null; },
      setAttribute: function () {}, getAttribute: function () { return ''; },
      appendChild: function () {}, remove: function () {},
      closest: function () { return { remove: function () {} }; }, removeChild: function () {}
    };
  },
  body: { appendChild: function () {}, childNodes: [] },
  addEventListener: function () {}
};

// 加载代码（const/let -> var，避免 eval 块级作用域泄漏）
var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
eval(dc);
eval(ac);

var routes = ['dashboard', 'member', 'walkin', 'service', 'cashier', 'room',
  'inventory', 'employee', 'technician', 'task', 'reservation', 'marketing',
  'locker', 'attendance', 'review', 'package', 'report', 'store'];

console.log('=== A. 数据加载 ===');
assert(typeof DB !== 'undefined' && DB.members.length > 0, 'DB 数据加载正常');

console.log('\n=== B. 各页面渲染 & 页标题已删除 ===');
routes.forEach(function (r) {
  var mockContent = { innerHTML: '' };
  try {
    var fnName = 'render' + r.charAt(0).toUpperCase() + r.slice(1);
    var fn = eval(fnName);
    fn(mockContent);
    var rendered = mockContent.innerHTML;
    assert(rendered.length > 50, '[' + (TITLES[r] || r) + '] 渲染成功 (' + rendered.length + ' 字符)');
    assert(rendered.indexOf('<h2') === -1, '[' + (TITLES[r] || r) + '] 内容区已无 <h2> 页标题');
  } catch (e) {
    assert(false, '[' + r + '] 渲染异常: ' + e.message);
  }
});

console.log('\n=== C. 顶部栏页面标题保留（未丢失） ===');
assert(typeof TITLES === 'object' && Object.keys(TITLES).length === 18, 'TITLES 仍含 18 个页面标题');
routes.forEach(function (r) {
  assert(!!TITLES[r], 'TITLES.' + r + ' = "' + (TITLES[r] || '') + '" 保留于顶部栏');
});

console.log('\n=== D. 模态框/卡片/分区小标题(<h3>)仍保留 ===');
var src = ac;
var h3Count = (src.match(/<h3/g) || []).length;
assert(h3Count > 0, 'app.js 中仍含 <h3> 小标题 (' + h3Count + ' 处，未误删)');
// 转会员弹窗权益标题(<h3>)保留（源码级校验，避免 mock DOM 事件绑定差异）
assert(src.indexOf('会员权益体系') >= 0, '转会员弹窗权益标题(<h3>)保留');
assert(src.indexOf('操作日志') >= 0, '库存操作日志分区标题(<h3>)保留');

console.log('\n=== E. 导航切换模拟 ===');
var pageTitleEl = { textContent: '' };
elements['page-title'] = pageTitleEl;
var navOk = 0;
routes.forEach(function (r) {
  pageTitleEl.textContent = TITLES[r];
  var c = { innerHTML: '' };
  try { eval('render' + r.charAt(0).toUpperCase() + r.slice(1))(c); if (c.innerHTML.length > 20) navOk++; }
  catch (e) { /* ignore */ }
});
assert(navOk === 18, '18 个页面导航全部成功 (ok=' + navOk + ')');

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL ' + tests + ' TESTS PASSED');
else { console.log('FAILURES: ' + failed); process.exit(1); }
