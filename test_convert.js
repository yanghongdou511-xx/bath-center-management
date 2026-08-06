// ===== 自测：布局间距 + 散客转会员模块 =====
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

var fs = require('fs');
var css = fs.readFileSync('styles.css', 'utf8');
var js = fs.readFileSync('app.js', 'utf8');

// ---- 1. CSS间距检查 ----
assert(css.indexOf('.row-actions{ display:flex; align-items:center; gap:6px') > -1, 'CSS: row-actions使用flex+gap=6px');
assert(css.indexOf('th,td{ text-align:left; padding:14px 20px') > -1, 'CSS: 表格单元格padding增至14px/20px');
assert(css.indexOf('.card-pad{') > -1 && css.indexOf('padding:26px') > -1, 'CSS: 卡片内��距增至26px');
assert(css.indexOf('.page-head{') > -1 && css.indexOf('margin-bottom:24px') > -1, 'CSS: page-head底部间距24px');
assert(css.indexOf('.stat-grid{') > -1 && css.indexOf('gap:22px') > -1, 'CSS: 统计卡片网格gap=22px');
assert(css.indexOf('.content{') > -1 && css.indexOf('padding:30px') > -1, 'CSS: 主内容区padding=30px');
assert(css.indexOf('.modal-body{ padding:26px 26px') > -1, 'CSS: 弹窗body内边距26px');
assert(css.indexOf('.form-row{') > -1 && css.indexOf('margin-bottom:18px') > -1, 'CSS: 表单行间距18px');
assert(css.indexOf('.filter-bar{') > -1 && css.indexOf('margin-bottom:22px') > -1, 'CSS: 筛选栏底部间距22px');
assert(css.indexOf('.convert-modal') > -1, 'CSS: 转化弹窗样式已定义');
assert(css.indexOf('.convert-steps') > -1, 'CSS: 步骤条样式已定义');
assert(css.indexOf('.benefits-grid') > -1, 'CSS: 权益网格已定义');
assert(css.indexOf('.convert-success') > -1, 'CSS: 成功页样式已定义');

console.log('\n---- 2. JS功能检查 ----');

assert(js.indexOf('function convertToMember(') > -1, 'JS: convertToMember函数已定义');
assert(js.indexOf('function renderConvertModal(') > -1, 'JS: renderConvertModal函数已定义');
assert(js.indexOf('function selectBenefitLevel(') > -1, 'JS: selectBenefitLevel函数已定义');
assert(js.indexOf('function nextConvertStep(') > -1, 'JS: nextConvertStep函数已定义');
assert(js.indexOf('function prevConvertStep(') > -1, 'JS: prevConvertStep函数已定义');
assert(js.indexOf('function submitConvertMember(') > -1, 'JS: submitConvertMember函数已定义');
assert(js.indexOf('function closeConvertModal(') > -1, 'JS: closeConvertModal函数已定义');
assert(js.indexOf('function persistData(') > -1, 'JS: persistData持久化函数已定义');
assert(js.indexOf('function loadPersistedData(') > -1, 'JS: loadPersistedData加载函数已定义');
assert(js.indexOf('const MEMBER_BENEFITS') > -1, 'JS: MEMBER_BENEFITS权益配置已定义');
assert(js.indexOf("level: '普通会员'") > -1, 'JS: 权益包含普通会员');
assert(js.indexOf("level: '钻石卡'") > -1, 'JS: 权益包含钻石卡');
assert(js.indexOf("discount: '8.0折'") > -1, 'JS: 钻石卡折扣8.0折');
assert(js.indexOf('\u{1F451} \u8F6C\u4F1A\u5458') > -1 || js.indexOf('转会员') > -1, 'JS: 操作列含转会员按钮');
assert(js.indexOf('g.converted ?') > -1, 'JS: 已转化散客显示标识');
assert(js.indexOf('convertStep === 1') > -1, 'JS: Step1权益展示');
assert(js.indexOf('convertStep === 2') > -1, 'JS: Step2选卡类型');
assert(js.indexOf('convertStep === 3') > -1, 'JS: Step3填写信息');
assert(js.indexOf('convertStep === 4') > -1, 'JS: Step4完成成功');
assert(js.indexOf("localStorage.setItem('bathcenter_data'") > -1, 'JS: localStorage存储key正确');
assert(js.indexOf("localStorage.getItem('bathcenter_data'") > -1, 'JS: localStorage读取key正确');
assert(js.indexOf('guest.converted = true') > -1, 'JS: 散客标记已转化');
assert(js.indexOf('guest.convertedTo = newId') > -1, 'JS: 记录转化目标会员号');

console.log('\n---- 3. DOM渲染模拟（核心流程） ----');

// Mock localStorage
var _store = {};
global.localStorage = {
  getItem: function (k) { return _store[k] || null; },
  setItem: function (k, v) { _store[k] = String(v); },
  removeItem: function (k) { delete _store[k]; },
  clear: function () { _store = {}; }
};

// Mock DOM
var elements = {};
function $(id) {
  if (elements[id]) return elements[id];
  return {
    value: '', style: {}, classList: { add: function () {}, remove: function () {} },
    querySelector: function () { return null; }, addEventListener: function () {},
    innerHTML: '', textContent: '', remove: function () {}, appendChild: function () {},
    closest: function () { return { remove: function () {} }; }
  };
}
document = {
  getElementById: $,
  querySelector: function () { return null; },
  createElement: function (tag) {
    return {
      id: '', style: {}, className: '', classList: { add: function () {}, remove: function () {}, toggle: function () {} },
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
  querySelectorAll: function () { return []; },
  addEventListener: function () {}
};

// 加载数据和代码
// 注意：eval 中的 let/const 是块级绑定，不会泄漏到外层，
// 导致测试无法给 convertGuestId 等模块级状态赋值 → 必须转成 var（函数作用域，可被外部读写）
function toVarScope(src) {
  return src.replace(/^(\s*)(let|const)\s+/gm, '$1var ');
}
eval(toVarScope(fs.readFileSync('data.js', 'utf8')));
eval(toVarScope(fs.readFileSync('app.js', 'utf8')));

assert(typeof convertToMember === 'function', 'DOM: convertToMember可调用');
assert(typeof submitConvertMember === 'function', 'DOM: submitConvertMember可调用');
assert(Array.isArray(MEMBER_BENEFITS) && MEMBER_BENEFITS.length === 5, 'DOM: 5级权益配置完整');
assert(DB.walkinGuests.length === 8, 'DOM: 初始散客数=8');
assert(DB.members.length === 8, 'DOM: 初始会员数=8');

// 测试转化流程
convertGuestId = 'W10001';
convertStep = 1;
convertSelectedLevel = 2;

var guest = DB.walkinGuests.find(function (x) { return x.id === 'W10001'; });
assert(guest !== undefined, 'DOM: 找到测试散客W10001');
assert(!guest.converted, 'DOM: W10001未转化');

// 模拟表单填写
elements['cm-name'] = { value: '吴明' };
elements['cm-phone'] = { value: '15012345678' };
elements['cm-gender'] = { value: '男' };
elements['cm-birthday'] = { value: '1990-05-15' };
elements['cm-note'] = { value: '' };
elements['cv-recharge'] = { value: '1000' };

submitConvertMember();

// 验证转化结果
var convertedGuest = DB.walkinGuests.find(function (x) { return x.id === 'W10001'; });
assert(convertedGuest.converted === true, 'DOM: W10001标记为已转化');
assert(convertedGuest.convertedTo !== undefined, 'DOM: 记录了转化目标会员号');
assert(DB.members.length === 9, 'DOM: 会员数增加到9(新增1个)');

var newMember = DB.members[DB.members.length - 1];
assert(newMember.id.indexOf('M10') === 0, 'DOM: 新会员号以M10开头');
assert(newMember.id === 'M10009', 'DOM: 会员号连续无跳号(M10009)');
assert(newMember.name === '吴明', 'DOM: 新会员姓名正确');
assert(newMember.phone === '150****5678', 'DOM: 手机号已脱敏');
assert(newMember.level === '金卡', 'DOM: 新会员等级=金卡(默认推荐)');
assert(newMember.balance === 1200, 'DOM: 余额=1000本金+200赠送');
assert(newMember.points === 3100, 'DOM: 积分=1000x3倍率+100开卡礼');
assert(newMember.sourceWalkin === 'W10001', 'DOM: 记录来源散客ID');
assert(newMember.gender === '男' && newMember.birthday === '1990-05-15', 'DOM: 采集的性别/生日已保存');

console.log('\n---- 4. 数据持久化验证 ----');
var raw = localStorage.getItem('bathcenter_data');
assert(raw !== null, '持久化: localStorage已写入数据');
var parsed = JSON.parse(raw);
assert(parsed._v === DATA_VERSION, '持久化: 版本号已写入(_v=' + DATA_VERSION + ')');
assert(parsed.members.length === 9, '持久化: 会员数据已保存(9条)');
var savedGuest = parsed.walkinGuests.find(function (x) { return x.id === 'W10001'; });
assert(savedGuest && savedGuest.converted === true, '持久化: 散客转化状态已保存');
assert(savedGuest.convertedTo === 'M10009', '持久化: 转化关联会员号已保存');

// 模拟刷新页面：清空内存 → 从缓存恢复
DB.members = [];
DB.walkinGuests = [];
loadPersistedData();
assert(DB.members.length === 9, '持久化: 刷新后会员数据可恢复');
assert(DB.walkinGuests.length === 8, '持久化: 刷新后散客数据可恢复');

// 版本失效验证
localStorage.setItem('bathcenter_data', JSON.stringify({ _v: 999, members: [] }));
var before = DB.members.length;
loadPersistedData();
assert(DB.members.length === before && localStorage.getItem('bathcenter_data') === null,
  '持久化: 版本不匹配时丢弃旧缓存');

console.log('\n---- 5. 边界与工具函数 ----');
assert(typeof nextMemberId === 'function' && nextMemberId() === 'M10010', '工具: nextMemberId取最大值+1');
assert(typeof nextWalkinId === 'function' && nextWalkinId() === 'W10009', '工具: nextWalkinId取最大值+1');
assert(rechargeBonus(1000) === 200 && rechargeBonus(5000) === 1500 && rechargeBonus(500) === 0,
  '工具: rechargeBonus赠送规则正确');
assert(typeof resetDemoData === 'function', '工具: resetDemoData重置函数已定义');

// 黑名单用户不可转化
var blackGuest = DB.walkinGuests.find(function (x) { return x.id === 'W10004'; });
assert(blackGuest.status === 'blacklist', '边界: W10004是黑名单用户');
var toastMsg = '';
var _origToast = typeof toast === 'function' ? toast : null;
toast = function (m) { toastMsg = m; };
convertToMember('W10004');
assert(toastMsg.indexOf('黑名单') > -1, '边界: 黑名单用户拦截转化并提示');
assert(convertGuestId !== 'W10004', '边界: 黑名单未进入转化流程');

// 重复转化保护：已转化散客列表不再显示转会员按钮
var mockC = { innerHTML: '' };
walkinKeyword = '';
renderWalkin(mockC);
var rowW1 = mockC.innerHTML.indexOf('W10001');
var seg = mockC.innerHTML.substring(rowW1, rowW1 + 1200);
assert(seg.indexOf('已转会员') > -1, '边界: 已转化散客显示"已转会员"标签');
assert(mockC.innerHTML.indexOf('转化率') > -1, '统计: 散客区展示转化率卡片');
if (_origToast) toast = _origToast;

console.log('\n=============================');
console.log('总计: ' + tests + ' 项 | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL TESTS PASSED!');
else console.log('WARNING: ' + failed + ' tests failed');
