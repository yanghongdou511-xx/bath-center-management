// UI 外壳自测：头像下拉交互状态 + 页脚/品牌Logo/消息卡片结构
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

// === 结构断言（解析源文件） ===
var html = fs.readFileSync('index.html', 'utf8');
var appjs = fs.readFileSync('app.js', 'utf8');

console.log('=== A. 顶部导航 / 下拉 / 页脚 结构 ===');
assert(html.indexOf('class="top-brand"') > -1, '顶部含品牌Logo (top-brand)');
assert(html.indexOf('id="user-menu"') > -1, '存在用户菜单容器 (user-menu)');
assert(html.indexOf('id="user-trigger"') > -1, '存在头像触发按钮 (user-trigger)');
assert(html.indexOf('class="user-dropdown"') > -1, '存在下拉面板 (user-dropdown)');
assert(html.indexOf('id="logout-btn"') > -1, '下拉含退出登录 (logout-btn)');
assert(html.indexOf('class="app-footer"') > -1, '存在底部页脚 (app-footer)');
assert(html.indexOf('class="ft-links"') > -1, '页脚含链接区 (ft-links)');
assert(/user-menu[\s\S]*?user-dropdown/.test(html), '下拉面板嵌套在用户菜单内');

console.log('=== B. 仪表盘消息卡片 ===');
assert(appjs.indexOf("'消息通知'") > -1, '仪表盘含「消息通知」卡片');
assert(appjs.indexOf('msgCount') > -1, '消息数量动态计算 (msgCount)');

console.log('=== C. 下拉交互逻辑 ===');
assert(appjs.indexOf("userMenu.classList.toggle('open')") > -1, '点击头像切换 open 状态');
assert(appjs.indexOf('!userMenu.contains(e.target)') > -1, '点击外部关闭下拉');
assert(appjs.indexOf("e.key === 'Escape'") > -1, 'Esc 键关闭下拉');

// === 交互状态模拟（轻量 Mock DOM） ===
function makeClassList() {
  var s = {};
  return {
    add: function (c) { s[c] = 1; },
    remove: function (c) { delete s[c]; },
    contains: function (c) { return !!s[c]; },
    toggle: function (c, force) {
      if (force === undefined) { if (s[c]) { delete s[c]; return false; } s[c] = 1; return true; }
      if (force) { s[c] = 1; return true; } delete s[c]; return false;
    }
  };
}
function makeEl(id) {
  return {
    id: id, style: {}, textContent: '', innerHTML: '',
    classList: makeClassList(),
    _handlers: {},
    addEventListener: function (ev, fn) { (this._handlers[ev] = this._handlers[ev] || []).push(fn); },
    setAttribute: function () {}, getAttribute: function () { return ''; },
    querySelector: function () { return null; },
    closest: function () { return null; },
    contains: function (node) { return node === this; },
    remove: function () {}, appendChild: function () {}
  };
}
var real = { 'user-menu': makeEl('user-menu'), 'user-trigger': makeEl('user-trigger') };
function stub() {
  return {
    style: {}, textContent: '', innerHTML: '', classList: makeClassList(),
    addEventListener: function () {}, setAttribute: function () {}, getAttribute: function () { return ''; },
    querySelector: function () { return null; }, closest: function () { return null; },
    contains: function () { return false; }, remove: function () {}, appendChild: function () {}
  };
}
var docHandlers = {};
global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
global.document = {
  getElementById: function (id) { return real[id] || stub(); },
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  createElement: function () { return stub(); },
  body: { appendChild: function () {}, childNodes: [] },
  addEventListener: function (ev, fn) { (docHandlers[ev] = docHandlers[ev] || []).push(fn); }
};
global.window = undefined;

var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
eval(dc); eval(ac);

console.log('=== D. 交互状态模拟 ===');
var triggerFns = real['user-trigger']._handlers['click'] || [];
assert(triggerFns.length > 0, '头像按钮已绑定 click 事件');
// 1) 点击头像 -> 打开
triggerFns.forEach(function (fn) { fn({ stopPropagation: function () {}, target: real['user-trigger'] }); });
assert(real['user-menu'].classList.contains('open'), '点击头像后下拉展开 (open)');
// 2) 点击外部 -> 关闭
(docHandlers['click'] || []).forEach(function (fn) { fn({ target: { tag: 'body' } }); });
assert(!real['user-menu'].classList.contains('open'), '点击外部后下拉收起');
// 3) 再次点击头像 -> 重新打开
triggerFns.forEach(function (fn) { fn({ stopPropagation: function () {}, target: real['user-trigger'] }); });
assert(real['user-menu'].classList.contains('open'), '再次点击头像重新展开');
// 4) Esc -> 关闭
(docHandlers['keydown'] || []).forEach(function (fn) { fn({ key: 'Escape' }); });
assert(!real['user-menu'].classList.contains('open'), '按 Esc 后下拉收起');

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('✅ UI SHELL TESTS ALL PASSED');
else console.log('❌ SOME TESTS FAILED');
