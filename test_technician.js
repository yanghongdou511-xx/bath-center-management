// 自测：技师区功能增强 —— 每位技师服务项目明细(名称/说明/价格/时长) + 更多人员信息展示
// 验证：1) 服务目录覆盖全部擅长项目；2) 每位技师成功派生服务项目；
//      3) 卡片含资质行+项目预览+价格；4) 详情弹窗含「可约服务项目」专区与今日服务；5) 门店过滤正确
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

// 捕获详情弹窗
var _modals = [];
document.body.appendChild = function (node) { _modals.push(node); };

console.log('=== A. 服务目录覆盖全部擅长项目 ===');
var allSpecs = {};
DB.technicians.forEach(function (t) { (t.specialties || []).forEach(function (s) { allSpecs[s] = true; }); });
var specKeys = Object.keys(allSpecs);
var missing = specKeys.filter(function (s) { return !DB.TECH_SERVICE_CATALOG[s]; });
assert(missing.length === 0, 'TECH_SERVICE_CATALOG 覆盖全部 ' + specKeys.length + ' 个擅长项目' + (missing.length ? ' (缺: ' + missing.join(',') + ')' : ''));

console.log('\n=== B. 每位技师服务项目派生（名称/说明/价格/时长齐全） ===');
var allOk = true;
DB.technicians.forEach(function (t) {
  var svcs = getTechServices(t);
  if (svcs.length !== (t.specialties || []).length) allOk = false;
  svcs.forEach(function (s) {
    if (!s.name || !s.desc || typeof s.price !== 'number' || typeof s.duration !== 'number') allOk = false;
  });
});
assert(allOk, '12 位技师均成功派生服务项目(名称/说明/价格/时长齐全)');
assert(getTechServices(DB.technicians[0]).length === DB.technicians[0].specialties.length, '服务数量 = 擅长项目数量');
assert(typeof fmtMoney(398) === 'string' && fmtMoney(398).indexOf('¥') === 0, 'fmtMoney 格式化正常: ' + fmtMoney(398));

console.log('\n=== C. 技师卡片渲染（资质 + 项目预览 + 价格/时长/门店） ===');
var mockContent = { innerHTML: '' };
try {
  renderTechnician(mockContent);
  var html = mockContent.innerHTML;
  assert(html.indexOf('tech-cert-row') >= 0, '卡片含资质行(tech-cert-row)');
  assert(html.indexOf('tech-services-preview') >= 0, '卡片含服务项目预览(tech-services-preview)');
  assert(html.indexOf('¥') >= 0, '卡片含价格符号(¥)');
  assert(html.indexOf('分钟') >= 0, '卡片含时长(分钟)');
  assert(html.indexOf('旗舰店') >= 0 && (html.indexOf('中心店') >= 0 || html.indexOf('社区店') >= 0), '卡片含门店信息(旗舰店/中心店/社区店)');
  assert(html.indexOf('今日服务') === -1, '卡片不含详情专属统计(今日服务仅详情展示)');
} catch (e) { assert(false, 'renderTechnician 异常: ' + e.message); }

console.log('\n=== D. 技师详情弹窗（可约服务项目专区 + 更多人员信息） ===');
_modals = [];
try {
  showTechnicianDetail(DB.technicians[0].id);
  var m = _modals[_modals.length - 1];
  var mhtml = m.innerHTML;
  assert(mhtml.indexOf('tech-service-grid') >= 0, '详情含可约服务项目网格(tech-service-grid)');
  assert(mhtml.indexOf('tech-service-card') >= 0, '详情含服务卡片(tech-service-card)');
  assert(mhtml.indexOf('tech-detail-cert') >= 0, '详情含资质(tech-detail-cert)');
  assert(mhtml.indexOf('今日服务') >= 0, '详情含今日服务统计');
  var s0 = getTechServices(DB.technicians[0])[0];
  assert(mhtml.indexOf(s0.name) >= 0, '详情含服务名: ' + s0.name);
  assert(mhtml.indexOf('¥' + s0.price.toLocaleString()) >= 0 || mhtml.indexOf('¥' + s0.price) >= 0, '详情含服务价格: ¥' + s0.price);
  assert(mhtml.indexOf(s0.duration + ' 分钟') >= 0 || mhtml.indexOf(s0.duration + '分钟') >= 0, '详情含服务时长: ' + s0.duration + ' 分钟');
  assert(mhtml.indexOf('热门') >= 0, '详情含热门服务标记(tech-svc-badge)');
} catch (e) { assert(false, 'showTechnicianDetail 异常: ' + e.message); }

console.log('\n=== E. 全量技师（含休假）均派生服务 + 字段完整 ===');
var fieldOk = DB.technicians.every(function (t) {
  return getTechServices(t).length > 0 &&
    typeof t.cert === 'string' && typeof t.store === 'string' && typeof t.today === 'number';
});
assert(fieldOk, '所有技师(含休假)均有服务列表且 cert/store/today 字段完整');

console.log('\n=== F. 分类筛选仍正常 ===');
try {
  techCategory = 'SPA技师';
  var mc = { innerHTML: '' };
  renderTechnician(mc);
  assert(mc.innerHTML.indexOf('T1001') >= 0 && mc.innerHTML.indexOf('T1005') === -1, '按 SPA技师 筛选正确');
  techCategory = '';
} catch (e) { assert(false, '分类筛选异常: ' + e.message); }

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL ' + tests + ' TESTS PASSED');
else { console.log('FAILURES: ' + failed); process.exit(1); }
