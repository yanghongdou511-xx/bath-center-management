// 内置零依赖日历组件自测：验证日期编辑、日历渲染、翻月、选日、关闭
function makeEl(tag) {
  return {
    tag: tag || 'DIV', className: '', style: {}, innerHTML: '', textContent: '',
    _listeners: {},
    classList: { add: function () {}, remove: function () {}, toggle: function () {}, contains: function () { return false; } },
    addEventListener: function (ev, fn) { (this._listeners[ev] = this._listeners[ev] || []).push(fn); },
    removeEventListener: function () {},
    setAttribute: function () {}, getAttribute: function () { return null; },
    appendChild: function (c) { (this.childNodes = this.childNodes || []).push(c); },
    removeChild: function () {},
    remove: function () {},
    focus: function () {}, blur: function () {},
    getBoundingClientRect: function () { return { left: 200, top: 300, right: 260, bottom: 326, width: 60, height: 26 }; },
    offsetWidth: 280, offsetHeight: 340, parentNode: null,
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    closest: function () { return null; },
    fire: function (ev, arg) {
      var self = this;
      (this._listeners[ev] || []).forEach(function (f) {
        f(arg || { target: self, stopPropagation: function () {}, preventDefault: function () {} });
      });
    }
  };
}
var _lastCal = null;
var document = {
  getElementById: function () { return makeEl(); },
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  createElement: function (tag) {
    var el = makeEl(tag);
    el._subs = {};
    el.querySelector = function (sel) {
      if (!el._subs[sel]) { var s = makeEl('DIV'); s.className = sel.replace('.', ''); el._subs[sel] = s; }
      return el._subs[sel];
    };
    return el;
  },
  body: { appendChild: function (n) { _lastCal = n; if (n) n.parentNode = this; }, childNodes: [], removeChild: function (c) { var i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); } },
  addEventListener: function () {},
  activeElement: null
};
global.document = document;
global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
global.window = { innerWidth: 1280, innerHeight: 720 };
global.requestAnimationFrame = function () {};
global.setTimeout = function () { return 0; };
global.setInterval = function () { return 0; };
global.clearTimeout = function () {};
global.clearInterval = function () {};

try { eval(require('fs').readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ')); } catch (e) {}
try { eval(require('fs').readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ')); } catch (e) {}

var passed = 0, failed = 0;
function assert(c, m) { if (c) { passed++; } else { failed++; console.log('  FAIL ' + m); } }

// T1: applyCustomDate 更新全局缓存
applyCustomDate('2026-09-15');
assert(_todayCache.str === '2026-09-15', 'T1 str=' + _todayCache.str);
assert(_todayCache.label === '09-15 周二', 'T1 label=' + _todayCache.label);
assert(_todayCache.y === 2026, 'T1 year');

// T2: 非法日期不更新
var prev = _todayCache.str;
applyCustomDate('invalid');
assert(_todayCache.str === prev, 'T2 invalid no-op');

// T3: showDatePicker 创建并挂载日历
var anchor = makeEl();
showDatePicker(anchor);
assert(_calEl !== null, 'T3 _calEl created');
assert(_lastCal && _lastCal.className.indexOf('date-cal') >= 0, 'T3 class=' + (_lastCal && _lastCal.className));
assert(_lastCal.style.position === 'fixed', 'T3 fixed pos');

// T4: 日历网格渲染 42 格（6 行 x 7 列）
var grid = _lastCal.querySelector('.cal-grid');
var cellCount = (grid.innerHTML.match(/class="cal-cell/g) || []).length;
assert(cellCount % 7 === 0 && cellCount >= 28 && cellCount <= 42, 'T4 cells=' + cellCount + ' (应为7的倍数, 28~42)');
var title = _lastCal.querySelector('.cal-title');
assert(title.textContent === '2026年9月', 'T4 title=' + title.textContent);

// T5: 翻月（上一月 / 下一月）
var beforeYear = _calYear, beforeMonth = _calMonth;
_lastCal.querySelector('.cal-prev').fire('click', { stopPropagation: function () {} });
assert(_calYear !== beforeYear || _calMonth !== beforeMonth, 'T5 prev changed view');
var m5 = _calMonth;
_lastCal.querySelector('.cal-next').fire('click', { stopPropagation: function () {} });
_lastCal.querySelector('.cal-next').fire('click', { stopPropagation: function () {} });
assert(_calMonth === (m5 + 2) % 12 || _calMonth === m5 + 2 - 12, 'T5 next x2 advanced');

// T6: 选日 → 应用日期并关闭
var grid2 = _lastCal.querySelector('.cal-grid');
grid2.fire('click', {
  target: { closest: function (s) { return s === '.cal-cell' ? { getAttribute: function (a) { return a === 'data-val' ? '2026-10-20' : null; } } : null; } },
  stopPropagation: function () {}
});
assert(_todayCache.str === '2026-10-20', 'T6 selected=' + _todayCache.str);
assert(_calEl === null, 'T6 picker closed');

// T7: hideDatePicker 清理
showDatePicker(makeEl());
assert(_calEl !== null, 'T7 reopened');
hideDatePicker();
assert(_calEl === null, 'T7 closed after hide');

console.log('\n=== 日历组件自测: ' + passed + '/' + (passed + failed) + ' PASSED' + (failed ? ' (' + failed + ' FAIL)' : '') + ' ===');
process.exit(failed ? 1 : 0);
