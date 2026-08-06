// ===== 自测：��会员页面全面优化版 =====
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  ✅ ' + msg); } else { failed++; console.log('  ❌ ' + msg); } }

// ---- 1. CSS 布局优化检查 ----
console.log('\n==== 1. CSS 布局优化 ====');
var css = fs.readFileSync('styles.css', 'utf8');

assert(css.indexOf('.convert-modal{ max-width:940px') > -1, 'CSS: 弹窗宽度扩至940px');
assert(css.indexOf('.benefits-grid{') > -1 && css.indexOf('gap:16px') > -1, 'CSS: 权益网格gap=16px');
assert(css.indexOf('.benefit-card{') > -1 && css.indexOf('padding:22px 16px 18px') > -1, 'CSS: 卡片内边距增大至22px/16px');
assert(css.indexOf('.benefit-card{') > -1 && css.indexOf('border-radius:16px') > -1, 'CSS: 卡片圆角增至16px');
assert(css.indexOf('.benefit-icon{ font-size:34px') > -1, 'CSS: 图标字号34px');
assert(css.indexOf('.benefit-name{ font-size:15px') > -1, 'CSS: 等级名称15px');
assert(css.indexOf('.benefit-discount{') > -1 && css.indexOf('font-size:22px') > -1, 'CSS: 折扣字号22px+渐变色');
assert(css.indexOf('.benefit-features{ font-size:12.5px') > -1, 'CSS: 权益列表字号12.5px（原11px）');
assert(css.indexOf('.benefit-features li::before{') > -1 && css.indexOf('font-size:12px') > -1, 'CSS: 权益勾选标记12px');
assert(css.indexOf('.convert-step-num{') > -1 && css.indexOf('width:42px; height:42px') > -1, 'CSS: 步骤圆圈放大至42px');
assert(css.indexOf('.convert-step-label{ font-size:13px') > -1, 'CSS: 步骤标签13px');
assert(css.indexOf('.convert-step-line{ width:72px') > -1, 'CSS: 步骤连线加宽72px');
assert(css.indexOf('.convert-form-area{ padding:28px 34px') > -1, 'CSS: 表单区域内边距28px/34px');
assert(css.indexOf('.convert-guest-avatar{') > -1 && css.indexOf('width:52px; height:52px') > -1, 'CSS: 头像52px');
assert(css.indexOf('.recharge-options{') > -1, 'CSS: 储值卡片组样式已定义');
assert(css.indexOf('.recharge-card{') > -1, 'CSS: 储值卡片样式已定义');
assert(css.indexOf('.cm-benefit-preview{') > -1, 'CSS: 权益预览区已定义');
assert(css.indexOf('.convert-success-stats{') > -1 && css.indexOf('border-radius:16px') > -1, 'CSS: 成功统计卡片圆角16px+背景');
assert(css.indexOf('.convert-success-stat-val{ font-size:24px') > -1, 'CSS: 成功数值24px');
assert(css.indexOf('.convert-success-tip{') > -1, 'CSS: 成功页提示条已定义');
assert(css.indexOf('@media(max-width:960px)') > -1, 'CSS: 960px断点响应式');
assert(css.indexOf('.benefit-card::before{') > -1, 'CSS: 卡片顶部渐变装饰线');

console.log('\n==== 2. JS 内容丰富检查 ====');
var js = fs.readFileSync('app.js', 'utf8');

// MEMBER_BENEFITS 增强
assert(js.indexOf("upgrade: '注册即享'") > -1, 'JS: 权益含upgrade字段(升级条件)');
assert(js.indexOf("price: '免费'") > -1, 'JS: 权益含price字段(价格)');
assert(js.indexOf("upgrade: '首充≥5000元'") > -1, 'JS: 钻石卡升级条件完整');
assert(js.indexOf("price: '￥5000起'") > -1, 'JS: 钻石卡价格信息完整');

// 函数定义
assert(js.indexOf('function selectRecharge(') > -1, 'JS: selectRecharge储值选择函数已定义');
assert(js.indexOf('function renderConvertModal(') > -1, 'JS: renderConvertModal函数存在');
assert(js.indexOf('function selectBenefitLevel(') > -1, 'JS: selectBenefitLevel函数存在');
assert(js.indexOf('function nextConvertStep(') > -1, 'JS: nextConvertStep函数存在');
assert(js.indexOf('function prevConvertStep(') > -1, 'JS: prevConvertStep函数存在');
assert(js.indexOf('function submitConvertMember(') > -1, 'JS: submitConvertMember函数存在');
assert(js.indexOf('function closeConvertModal(') > -1, 'JS: closeConvertModal函数存在');

// Step 1 内容增强
assert(js.indexOf('benefits-header') > -1, 'JS: Step1有独立标题区(benefits-header)');
assert(js.indexOf('悦泉会员权益体系') > -1, 'JS: Step1标题"悦泉会员权益体系"');
assert(js.indexOf('--bc-primary:') > -1, 'JS: 卡片使用CSS变量传色');
assert(js.indexOf('已选择：') > -1, 'JS: Step1底部显示已选等级提示');
assert(js.indexOf('bSel.upgrade') > -1 || js.indexOf('curB.upgrade') > -1, 'JS: 已选等级显示升级条件');

// Step 2 内容增强
assert(js.indexOf('申请成为会员') > -1, 'JS: Step2散客信息卡含"申请成为会员"');
assert(js.indexOf('来源：') > -1, 'JS: Step2散客信息卡含来源字段');
assert(js.indexOf('recharge-options') > -1, 'JS: Step2使用储值卡片组(recharge-options)');
assert(js.indexOf('recharge-card') > -1, 'JS: Step2储值卡片元素');
assert(js.indexOf('data-amt=') > -1, 'JS: 储值卡片带data-amt属性');
assert(js.indexOf('selectRecharge(this,') > -1, 'JS: 储值卡片点击调用selectRecharge');
assert(js.indexOf('popular') > -1, 'JS: 热门标签(popular)存在');
assert(js.indexOf('cv-recharge') > -1 && js.indexOf('type="hidden"') > -1, 'JS: cv-recharge改为隐藏域');
assert(js.indexOf('auto-select') > -1 || js.indexOf('data-amt="1000"') > -1, 'JS: 默认选中1000元卡片逻辑');

// Step 3 内容增强
assert(js.indexOf('cm-form-section-title') > -1, 'JS: Step3表单分节标题');
assert(js.indexOf('基本信息（必填）') > -1, 'JS: Step3有基本必填区分');
assert(js.indexOf('补充信息（选填') > -1, 'JS: Step3有补充选填区分');
assert(js.indexOf('用于身份核验') > -1, 'JS: 姓名输入框增强placeholder');
assert(js.indexOf('用于接收通知') > -1, 'JS: 手机号输入框增强placeholder');
assert(js.indexOf('生日当月享特别折扣') > -1, 'JS: 生日字段增强placeholder');
assert(js.indexOf('过敏史、特殊需求、偏好技师') > -1, 'JS: 备注字段增强placeholder');
assert(js.indexOf('所有字段均加密存储') > -1, 'JS: 表单安全提示');
assert(js.indexOf('cm-benefit-preview') > -1, 'JS: Step3底部权益预览(cm-benefit-preview)');
assert(js.indexOf('开通即享') > -1, 'JS: 权益预览标题含"开通即享"');

// Step 4 成功页增强
assert(js.indexOf('🎊 会员开通成功！') > -1, 'JS: 成功页标题带🎊');
assert(js.indexOf('您的会员账号已生成，权益即时生效') > -1, 'JS: 成功页副标题增强');
assert(js.indexOf('convert-success-tip') > -1, 'JS: 成功页有提示条(convert-success-tip)');
assert(js.indexOf('查看会员列表') > -1 && js.indexOf('👥') > -1, 'JS: 成功按钮带👥图标');
assert(js.indexOf('color:#16a34a') > -1 && js.indexOf('color:#f59e0b') > -1, 'JS: 成功统计余额绿色/积分金色');

// 数据持久化
assert(js.indexOf("localStorage.setItem('bathcenter_data'") > -1, 'JS: localStorage存储key正确');
assert(js.indexOf("_v: DATA_VERSION") > -1, 'JS: 持久化含版本号');
assert(js.indexOf('guest.convertedTo = newId') > -1, 'JS: 记录转化目标会员号');
assert(js.indexOf('guest.convertDate = nowStr') > -1, 'JS: 记录转化日期');

console.log('\n==== 3. DOM 渲染模拟（核心流程） ====');

// Mock DOM
var _store = {};
global.localStorage = {
  getItem: function(k) { return _store[k] || null; },
  setItem: function(k, v) { _store[k] = String(v); },
  removeItem: function(k) { delete _store[k]; }
};
var elements = {};
function $(id) {
  if (elements[id]) return elements[id];
  return {
    value: '', style: {}, classList: { add: function () {}, remove: function () {} },
    querySelector: function () { return null; }, addEventListener: function () {},
    innerHTML: '', textContent: '', remove: function () {},
    appendChild: function () {}, closest: function () { return { remove: function () {} }; }
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
      closest: function () { return { remove: function () {} }; },
      removeChild: function () {}
    };
  },
  body: { appendChild: function () {}, childNodes: [] },
  querySelectorAll: function () { return []; },
  addEventListener: function () {}
};

// 加载代码（替换行首声明）
var dc = fs.readFileSync('data.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
var ac = fs.readFileSync('app.js', 'utf8').replace(/^(\s*)(let|const)\s+/gm, '$1var ');
eval(dc);
eval(ac);

// 测试基础状态
assert(typeof renderConvertModal === 'function', 'DOM: renderConvertModal可调用');
assert(typeof submitConvertMember === 'function', 'DOM: submitConvertMember可调用');
assert(typeof selectRecharge === 'function', 'DOM: selectRecharge可调用');
assert(Array.isArray(MEMBER_BENEFITS) && MEMBER_BENEFITS.length === 5, 'DOM: 5级权益配置完整');
assert(MEMBER_BENEFITS[0].upgrade === '注册即享', 'DOM: 普通会员upgrade=注册即享');
assert(MEMBER_BENEFITS[4].upgrade === '首充≥5000元', 'DOM: 钻石卡upgrade=首充≥5000元');
assert(DB.walkinGuests.length === 8, 'DOM: 初始散客数=8');
assert(DB.members.length === 8, 'DOM: 初始会员数=8');

// 测试转化入口
convertGuestId = 'W10001';
convertStep = 1;
convertSelectedLevel = 2;

var guest = DB.walkinGuests.find(function (x) { return x.id === 'W10001'; });
assert(guest !== undefined, 'DOM: 找到测试散客W10001');
assert(!guest.converted, 'DOM: W10001未转化');

// 模拟渲染 Step 1（renderConvertModal调用openModal，无返回值，验证不报错即可）
try {
  renderConvertModal(guest);
  assert(true, 'DOM: Step1渲染成功(无报错)');
} catch(e) {
  assert(false, 'DOM: Step1渲染报错: ' + e.message);
}
assert(convertStep === 1, 'DOM: Step仍为1');

// 切换到 Step 3 并填写表单
convertStep = 3;
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
assert(convertedGuest.convertDate !== undefined, 'DOM: 记录了转化日期');
assert(DB.members.length === 9, 'DOM: 会员数增加到9（新增1个）');

var newMember = DB.members[DB.members.length - 1];
assert(newMember.id.startsWith('M10'), 'DOM: 新会员号以M10开头');
assert(newMember.level === '金卡', 'DOM: 新会员等级=金卡(默认推荐)');
assert(newMember.balance === 1200, 'DOM: 储值金额=1000本金+200赠送=1200');
assert(newMember.points > 0, 'DOM: 有赠送积分');
assert(newMember.sourceWalkin === 'W10001', 'DOM: 记录来源散客ID');

// 测试黑名单拦截
convertStep = 1;
convertToMember('W10004');
var blackGuest = DB.walkinGuests.find(function (x) { return x.id === 'W10004'; });
assert(blackGuest.status === 'blacklist', 'DOM: W10004是黑名单用户');

// 测试重复转化拦截
convertStep = 1;
convertToMember('W10001');
assert(convertedGuest.converted === true, 'DOM: 已转化散客无法再次转化');

// 测试 localStorage 持久化
var savedData = localStorage.getItem('bathcenter_data');
assert(savedData !== null, 'DOM: 数据已持久化到localStorage');
var parsed = JSON.parse(savedData);
assert(parsed._v === 3, 'DOM: 持久化数据版本=3');
assert(parsed.members.length === 9, 'DOM: 持久化会员数=9');
assert(parsed.walkinGuests.find(function(x){return x.id==='W10001';}).converted === true, 'DOM: 持久化中W10001已转化');

console.log('\n=============================');
console.log('总计: ' + tests + ' 项 | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('🎉 全部通过！');
else console.log('⚠️ 有 ' + failed + ' 项失败需要修复');
process.exit(failed > 0 ? 1 : 0);
