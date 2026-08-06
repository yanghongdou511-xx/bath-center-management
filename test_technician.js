// 自测：技师区 —— ①关闭按钮可点击 ②非洗浴技能已清理 ③服务目录/渲染正常
// 验证：1) 关闭按钮含.remove()；2) 目录无中医馆项目；3) 技师技能全在目录中；
//      4) 简介/标签/资质无中医关键词；5) 卡片+详情弹窗渲染正常；6) DATA_VERSION=5
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

// ---- 已删除的中医馆/医疗项目黑名单 ----
var BANNED_SKILLS = [
  '经络疏通','艾灸养生','刮痧拔罐','正骨复位','脏腑推拿','小儿推拿',
  '产后修复','腹部调理','泡脚药膳','武术点穴','拔罐刮痧','背部整脊',
  '乳腺疏通','卵巢保养','睡眠调理','全身经络疏通'
];
var BANNED_KEYWORDS = [
  '中医推拿师','中医世家','中医正骨','针灸推拿','北京中医药大学',
  '成都中医药大学','少林寺','俗家弟子','功夫按摩','正骨专家',
  '医学硕士','产后修复','小儿推拿','中医理疗'
];

console.log('=== A. 关闭按钮含 .remove() ===');
var src = ac;
// 检查关闭按钮的 onclick 含 .remove()（而非仅有 .closest()）
var closeBtnPattern = "closest('.modal-mask').remove()";
assert(src.indexOf(closeBtnPattern) >= 0 && src.indexOf("关闭</button>") > src.indexOf(closeBtnPattern),
  '技师详情关闭按钮 onclick 含 .remove()');

console.log('\n=== B. TECH_SERVICE_CATALOG 无已删除项目 ===');
var catKeys = Object.keys(DB.TECH_SERVICE_CATALOG || {});
var foundBanned = catKeys.filter(function (k) { return BANNED_SKILLS.indexOf(k) >= 0; });
assert(foundBanned.length === 0,
  '目录不含已删除项目 (' + catKeys.length + '项剩余' + (foundBanned.length ? ', 残留:' + foundBanned.join(',') : '') + ')');

console.log('\n=== C. 所有技师技能均在目录中（无悬空引用） ===');
var allSpecs = {};
DB.technicians.forEach(function (t) { (t.specialties || []).forEach(function (s) { allSpecs[s] = true; }); });
var specKeys = Object.keys(allSpecs);
var missing = specKeys.filter(function (s) { return !DB.TECH_SERVICE_CATALOG[s]; });
var bannedInSpecs = specKeys.filter(function (s) { return BANNED_SKILLS.indexOf(s) >= 0; });
assert(missing.length === 0,
  '全部 ' + specKeys.length + ' 个技能项均在目录中' + (missing.length ? ' (缺:' + missing.join(',') + ')' : ''));
assert(bannedInSpecs.length === 0,
  '技师 specialties 不含任何已删除项目');

console.log('\n=== C2. 分类筛选/新增表单无「中医推拿师」及中医残留 ===');
assert(TECH_CATEGORIES.indexOf('中医推拿师') < 0,
  'TECH_CATEGORIES 过滤项不含「中医推拿师」(' + TECH_CATEGORIES.join('/') + ')');
assert(ac.indexOf('中医推拿师') < 0, 'app.js 源码不含「中医推拿师」');
assert(ac.indexOf('<option value="中医推拿师">') < 0, '新增技师表单下拉不含「中医推拿师」');
assert(ac.indexOf('中医康复理疗师') < 0, '表单资质 placeholder 不含「中医康复理疗师」');
['刮痧拔罐','艾灸养生','产后修复','全身经络疏通'].forEach(function (b) {
  assert(ac.indexOf('<option value="' + b + '">') < 0, '新增技师表单擅长项不含已删项目: ' + b);
});

console.log('\n=== D. 技师简介/标签/资质无中医关键词 ===');
var kwFound = [];
DB.technicians.forEach(function (t) {
  BANNED_KEYWORDS.forEach(function (kw) {
    if ((t.bio || '').indexOf(kw) >= 0) kwFound.push(t.id + '.bio:' + kw);
    if ((t.tags || []).indexOf(kw) >= 0) kwFound.push(t.id + '.tag:' + kw);
    if ((t.cert || '').indexOf(kw) >= 0) kwFound.push(t.id + '.cert:' + kw);
    if ((t.category || '').indexOf(kw) >= 0) kwFound.push(t.id + '.category:' + kw);
  });
});
assert(kwFound.length === 0,
  '所有技师的 bio/tags/cert/category 无中医关键词' + (kwFound.length ? ' (发现:' + kwFound.join(';') + ')' : ''));

console.log('\n=== E. 每位技师服务项目派生（名称/说明/价格/时长齐全） ===');
var allOk = true;
DB.technicians.forEach(function (t) {
  var svcs = getTechServices(t);
  if (svcs.length !== (t.specialties || []).length) allOk = false;
  svcs.forEach(function (s) {
    if (!s.name || !s.desc || typeof s.price !== 'number' || typeof s.duration !== 'number') allOk = false;
  });
});
assert(allOk, DB.technicians.length + ' 位技师均成功派生服务项目(名称/说明/价格/时长齐全)');
assert(getTechServices(DB.technicians[0]).length === DB.technicians[0].specialties.length, '服务数量 = 擅长项目数量');
assert(typeof fmtMoney(398) === 'string' && fmtMoney(398).indexOf('¥') === 0, 'fmtMoney 格式化正常: ' + fmtMoney(398));

console.log('\n=== F. 技师卡片渲染（资质 + 项目预览 + 价格/时长/门店） ===');
var mockContent = { innerHTML: '' };
try {
  renderTechnician(mockContent);
  var html = mockContent.innerHTML;
  assert(html.indexOf('tech-cert-row') >= 0, '卡片含���质行(tech-cert-row)');
  assert(html.indexOf('tech-services-preview') >= 0, '卡片含服务项目预览(tech-services-preview)');
  assert(html.indexOf('¥') >= 0, '卡片含价格符号(¥)');
  assert(html.indexOf('分钟') >= 0, '卡片含时长(分钟)');
  assert(html.indexOf('旗舰店') >= 0 && (html.indexOf('中心店') >= 0 || html.indexOf('社区店') >= 0), '卡片含门店信息');
} catch (e) { assert(false, 'renderTechnician 异常: ' + e.message); }

console.log('\n=== G. 技师详情弹窗（关闭按钮 + 服务项目专区） ===');
_modals = [];
try {
  showTechnicianDetail(DB.technicians[0].id);
  var m = _modals[_modals.length - 1];
  var mhtml = m.innerHTML;
  // 关闭按钮在弹窗 HTML 中
  assert(mhtml.indexOf(closeBtnPattern) >= 0 || mhtml.indexOf('.remove()">关闭') >= 0,
    '详情弹窗关闭按钮含 .remove()');
  assert(mhtml.indexOf('tech-service-grid') >= 0, '详情含可约服务项目网格(tech-service-grid)');
  assert(mhtml.indexOf('tech-detail-cert') >= 0, '详情含资质(tech-detail-cert)');
  assert(mhtml.indexOf('今日服务') >= 0, '详情含今日服务统计');
  var s0 = getTechServices(DB.technicians[0])[0];
  assert(mhtml.indexOf(s0.name) >= 0, '详情含服务名: ' + s0.name);
} catch (e) { assert(false, 'showTechnicianDetail 异常: ' + e.message); }

console.log('\n=== H. 全量技师字段完整 + 新增6位女技师 + DATA_VERSION ===');
var fieldOk = DB.technicians.every(function (t) {
  return getTechServices(t).length > 0 &&
    typeof t.cert === 'string' && typeof t.store === 'string' && typeof t.today === 'number';
});
assert(fieldOk, '所有技师均有服务列表且 cert/store/today 字段完整');
assert(DB.technicians.length === 18, '技师总数 = 18（原12 + 新增6）实际:' + DB.technicians.length);
var newFemales = DB.technicians.filter(function (t) {
  return ['T1013','T1014','T1015','T1016','T1017','T1018'].indexOf(t.id) >= 0;
});
assert(newFemales.length === 6, '新增女技师数 = 6（实际 ' + newFemales.length + '）');
assert(newFemales.every(function (t) { return t.gender === '女'; }), '6 位新增技师均为女性');
assert(newFemales.every(function (t) {
  return t.name && t.empNo && t.avatar && t.category && (t.specialties || []).length >= 1 &&
    typeof t.experience === 'number' && typeof t.rating === 'number' && t.schedule && t.phone && t.bio && (t.tags || []).length >= 1;
}), '6 位新增女技师字段完整(姓名/工号/头像/分类/擅长/从业/评分/班次/电话/简介/标签)');
assert(newFemales.every(function (t) {
  return (t.specialties || []).every(function (s) { return !!DB.TECH_SERVICE_CATALOG[s]; });
}), '6 位新增女技师的擅长项目均能在服务目录中找到说明');
var femaleCount = DB.technicians.filter(function (t) { return t.gender === '女'; }).length;
assert(femaleCount >= 12, '女技师总数 ≥ 12（实际 ' + femaleCount + '）');

console.log('\n=== I. 渲染页面无「中医推拿师」文本 ===');
var mockContent2 = { innerHTML: '' };
try {
  renderTechnician(mockContent2);
  var rh = mockContent2.innerHTML;
  assert(rh.indexOf('中医推拿师') < 0, '技师区渲染结果不含「中医推拿师」');
  assert(rh.indexOf('att-stat-ico') >= 0, '技师区统计卡含图标圆(att-stat-ico)视觉增强');
  assert(rh.indexOf('tech-avatar-f') >= 0 || rh.indexOf('tech-avatar-m') >= 0, '技师卡片含性别头像描边(tech-avatar-f/m)');
} catch (e) { assert(false, 'renderTechnician 异常: ' + e.message); }

assert(DATA_VERSION === 5, 'DATA_VERSION = 5（旧缓存自动失效）');

console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL ' + tests + ' TESTS PASSED');
else { console.log('FAILURES: ' + failed); process.exit(1); }
