// 诊断：真实模拟「登录 → 渲染首页」全流程，捕获运行时报错
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK   ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

global.localStorage = { _s: {}, getItem: function (k) { return this._s[k] || null; }, setItem: function (k, v) { this._s[k] = String(v); }, removeItem: function (k) { delete this._s[k]; } };

// 持久化元素，便于检验登录前后状态
var elements = {};
function makeEl(id) {
  var handlers = {};
  var classes = {};
  var el = {
    id: id, value: '', style: {}, _classes: classes, _handlers: handlers,
    classList: {
      add: function (c) { classes[c] = true; },
      remove: function (c) { delete classes[c]; },
      toggle: function (c) { classes[c] ? delete classes[c] : classes[c] = true; },
      contains: function (c) { return !!classes[c]; }
    },
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    addEventListener: function (type, fn) { (handlers[type] = handlers[type] || []).push(fn); },
    fire: function (type, ev) { (handlers[type] || []).forEach(function (fn) { fn(ev || { preventDefault: function () {} }); }); },
    innerHTML: '', textContent: '', className: '',
    remove: function () {}, appendChild: function () {},
    closest: function () { return { remove: function () {} }; },
    setAttribute: function () {}, getAttribute: function () { return ''; },
    removeChild: function () {}, children: []
  };
  return el;
}
function $(id) {
  if (!elements[id]) elements[id] = makeEl(id);
  return elements[id];
}
document = {
  getElementById: $,
  querySelector: function (s) { return null; },
  querySelectorAll: function () { return []; },
  createElement: function (tag) { return makeEl('_created_' + tag); },
  body: { appendChild: function () {}, childNodes: [] },
  addEventListener: function () {}
};
global.window = global; // 浏览器中 window 存在；模拟设置启动标记

// 预置登录表单字段值
elements['login-user'] = makeEl('login-user'); elements['login-user'].value = '24031532';
elements['login-pass'] = makeEl('login-pass'); elements['login-pass'].value = '123456';

var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');

console.log('=== 1. 加载脚本（捕获加载期错误） ===');
try { eval(dc); console.log('  OK   data.js 加载无异常'); }
catch (e) { console.log('  FAIL data.js 加载异常: ' + e.message); process.exit(1); }
try { eval(ac); console.log('  OK   app.js 加载无异常（登录监听应已绑定）'); }
catch (e) { console.log('  FAIL app.js 加载异常: ' + e.message + '\n' + e.stack); process.exit(1); }

console.log('\n=== 2. 登录监听是否绑定 ===');
var loginForm = elements['login-form'];
assert(loginForm && loginForm._handlers && loginForm._handlers.submit && loginForm._handlers.submit.length > 0, 'login-form 已绑定 submit 事件处理器');

console.log('\n=== 3. 模拟点击登录（正确账号） ===');
var err = null;
try {
  loginForm.fire('submit', { preventDefault: function () {} });
} catch (e) {
  err = e;
}
if (err) {
  console.log('  FAIL 登录过程抛出异常: ' + err.message);
  console.log(err.stack);
  failed++; tests++;
} else {
  console.log('  OK   登录函数执行未抛异常');
  passed++; tests++;
}

console.log('\n=== 4. 登录后视图切换检查 ===');
var loginView = elements['login-view'];
var appView = elements['app-view'];
assert(loginView && loginView._classes['hidden'] === true, '登录页已隐藏 (login-view.hidden=true)');
assert(appView && appView._classes['hidden'] !== true, '后台页已显示 (app-view 无 hidden)');

console.log('\n=== 5. 首页内容是否渲染 ===');
var content = elements['content'];
assert(content && content.innerHTML && content.innerHTML.length > 100, '首页已渲染内容 (' + (content ? content.innerHTML.length : 0) + ' 字符)');

console.log('\n=== 6. 顶部标题是否已设置 ===');
var pt = elements['page-title'];
assert(pt && pt.textContent === '数据概览', 'page-title 已设为「数据概览」 (实际: ' + (pt ? pt.textContent : 'null') + ')');

console.log('\n=== 7. 启动标记（用于诊断缓存导致的登录失效） ===');
assert(window.__appBooted === true, 'app.js 成功执行并设置 window.__appBooted=true（index.html 自检通过）');

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('结论：本地登录流程完全正常 ✅');
else { console.log('结论：本地存在登录阻断问题 ❌'); process.exit(1); }
