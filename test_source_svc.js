// ===== 自测：来源可编辑 + 服务项目新增 =====
var fs = require('fs');
var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  ✅ ' + msg); } else { failed++; console.log('  ❌ ' + msg); } }

console.log('==== 1. 来源字段可编辑 ====');
var js = fs.readFileSync('app.js', 'utf8');

assert(js.indexOf('function walkinSourceEditable(') > -1, 'JS: walkinSourceEditable函数已定义');
assert(js.indexOf('function toggleSourceEdit(') > -1, 'JS: toggleSourceEdit函数已定义');
assert(js.indexOf('function quickChangeSource(') > -1, 'JS: quickChangeSource函数已定义');
assert(js.indexOf("onclick=\"toggleSourceEdit") > -1, 'JS: 来源tag绑定点击事件');
assert(js.indexOf('source-edit-wrap') > -1, 'JS: 使用source-edit-wrap容器');
assert(js.indexOf('source-tag') > -1, 'JS: source-tag可点击样式类');
assert(js.indexOf('source-select') > -1, 'JS: source-select内联下拉样式');
assert(js.indexOf('walkinSourceEditable(g.id, g.source)') > -1, 'JS: 表格使用walkinSourceEditable替代walkinSourceTag');
assert(js.indexOf('点击修改来源') > -1, 'JS: 来源tag有提示文字');
assert(js.indexOf('persistData()') > js.indexOf('quickChangeSource'), 'JS: quickChangeSource调用持久化');

var css = fs.readFileSync('styles.css', 'utf8');
assert(css.indexOf('.source-edit-wrap{') > -1, 'CSS: source-edit-wrap容器样式');
assert(css.indexOf('.source-tag{') > -1, 'CSS: source-tag可点击样式');
assert(css.indexOf('.source-tag:hover') > -1, 'CSS: source-tag hover效果');
assert(css.indexOf('.source-select{') > -1, 'CSS: source-select动画样式');

console.log('\n==== 2. 服务项目数据检查 ====');
var data = fs.readFileSync('data.js', 'utf8');
eval(data.replace(/^(\s*)(let|const)\s+/gm, '$1var '));

// 服务项目总数
assert(DB.services.length >= 25, 'DATA: 服务项目总数≥25（实际' + DB.services.length + '项）');

// 各分类数量统计
var cats = {};
DB.services.forEach(function(s) { cats[s.category] = (cats[s.category] || 0) + 1; });
assert(cats['基础洗浴'] >= 4, 'DATA: 基础洗浴≥4项（实际' + (cats['基础洗浴']||0) + '）');
assert(cats['足疗按摩'] >= 3, 'DATA: 足疗按摩≥3项（实际' + (cats['足疗按摩']||0) + '）');
assert(cats['按摩SPA'] >= 5, 'DATA: 按摩SPA≥5项（实际' + (cats['按摩SPA']||0) + '）');
assert(cats['休闲娱乐'] >= 4, 'DATA: 休闲娱乐≥4项（实际' + (cats['休闲娱乐']||0) + '）');
assert(cats['包厢服务'] >= 3, 'DATA: 包厢服务≥3项（实际' + (cats['包厢服务']||0) + '）');
assert(cats['美容美体'] >= 4, 'DATA: 美容美体≥4项（实际' + (cats['美容美体']||0) + '）');

// 关键项目存在
var svcNames = DB.services.map(function(s){ return s.name; });
assert(svcNames.indexOf('经典沐浴') > -1, 'DATA: 含经典沐浴');
assert(svcNames.indexOf('汗蒸体验') > -1, 'DATA: 含汗蒸体验');
assert(svcNames.indexOf('鱼疗') > -1, 'DATA: 含鱼疗');
assert(svcNames.indexOf('搓背服务') > -1, 'DATA: 含搓背服务');
assert(svcNames.indexOf('VIP私汤') > -1, 'DATA: 含VIP私汤');
// 新增项目
assert(svcNames.indexOf('泡澡套餐（沐浴+搓背+头部）') > -1, 'DATA: 新增-泡澡套餐');
assert(svcNames.indexOf('牛奶玫瑰浴') > -1, 'DATA: 新增-牛奶玫瑰浴');
assert(svcNames.indexOf('中药泡浴') > -1, 'DATA: 新增-中药泡浴');
assert(svcNames.indexOf('足底反射疗法') > -1, 'DATA: 新增-足底反射疗法');
assert(svcNames.indexOf('艾灸养生足疗') > -1, 'DATA: 新增-艾灸养生足疗');
assert(svcNames.indexOf('中式推拿全身') > -1, 'DATA: 新增-中式推拿全身');
assert(svcNames.indexOf('热石疗法') > -1, 'DATA: 新增-热石疗法');
assert(svcNames.indexOf('日式指压') > -1, 'DATA: 新增-日式指压');
assert(svcNames.indexOf('肩颈深度放松') > -1, 'DATA: 新增-肩颈深度放松');
assert(svcNames.indexOf('休闲茶歇（含小吃）') > -1, 'DATA: 新增-休闲茶歇');
assert(svcNames.indexOf('桌球/棋牌畅玩') > -1, 'DATA: 新增-桌球/棋牌');
assert(svcNames.indexOf('3D影院休息') > -1, 'DATA: 新增-3D影院');
assert(svcNames.indexOf('双人VIP包厢') > -1, 'DATA: 新增-双人VIP包厢');
assert(svcNames.indexOf('聚会包厢（4-6人）') > -1, 'DATA: 新增-聚会包厢');
assert(svcNames.indexOf('商务洽谈包厢') > -1, 'DATA: 新增-商务洽谈包厢');
assert(svcNames.indexOf('面部深层护理') > -1, 'DATA: 新增-面部深层护理');
assert(svcNames.indexOf('全身磨砂去角质') > -1, 'DATA: 新增-全身磨砂');
assert(svcNames.indexOf('淋巴排毒') > -1, 'DATA: 新增-淋巴排毒');
assert(svcNames.indexOf('身体塑形紧致') > -1, 'DATA: 新增-身体塑形');

// 价格合理性
var cheapSvc = DB.services.filter(function(s){ return s.price < 20; });
assert(cheapSvc.length === 0, 'DATA: 无异常低价项目（<20元）');
var expensiveSvc = DB.services.filter(function(s){ return s.price > 5000; });
assert(expensiveSvc.length === 0, 'DATA: 无异常高价项目（>5000元）');

console.log('\n==== 3. DOM 渲染模拟（来源编辑流程） ====');
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
    value: '', style: {}, classList: { add: function() {}, remove: function() {} },
    querySelector: function() { return null; }, addEventListener: function() {},
    innerHTML: '', textContent: '', remove: function() {}, appendChild: function() {},
    closest: function() { return { remove: function() {} }; }
  };
}
document = {
  getElementById: $,
  querySelector: function() { return null; },
  createElement: function(tag) {
    return {
      id: '', style: {}, className: '',
      classList: { add: function() {}, remove: function() {}, toggle: function() {} },
      innerHTML: '', textContent: '', children: [],
      querySelector: function(s) {
        if (s === '#modal-save') return { addEventListener: function(fn) {} };
        return null;
      },
      setAttribute: function() {}, getAttribute: function() { return ''; },
      appendChild: function() {}, remove: function() {},
      closest: function() { return { remove: function() {} }; },
      removeChild: function() {}
    };
  },
  body: { appendChild: function() {}, childNodes: [] },
  querySelectorAll: function() { return []; },
  addEventListener: function() {}
};

eval(fs.readFileSync('data.js','utf8').replace(/^(\s*)(let|const)\s+/gm,'$1var '));
eval(fs.readFileSync('app.js','utf8').replace(/^(\s*)(let|const)\s+/gm,'$1var '));

assert(typeof walkinSourceEditable === 'function', 'DOM: walkinSourceEditable可调用');
assert(typeof toggleSourceEdit === 'function', 'DOM: toggleSourceEdit可调用');
assert(typeof quickChangeSource === 'function', 'DOM: quickChangeSource可调用');
assert(typeof renderWalkin === 'function', 'DOM: renderWalkin可调用');

// 测试来源标签渲染
var tagHtml = walkinSourceEditable('W10001', '朋友推荐');
assert(tagHtml.indexOf('toggleSourceEdit') > -1, 'DOM: 来源标签含toggleSourceEdit调用');
assert(tagHtml.indexOf('source-wrap-W10001') > -1, 'DOM: 来源标签含唯一wrap ID');
assert(tagHtml.indexOf('✎') > -1, 'DOM: 来源标签含编辑图标');

// 测试quickChangeSource
var testGuest = DB.walkinGuests.find(function(x){return x.id==='W10001';});
assert(testGuest !== undefined, 'DOM: 找到测试散客W10001');
var oldSrc = testGuest.source;
quickChangeSource('W10001', '团购');
assert(testGuest.source === '团购', 'DOM: W10001来源已改为团购');
assert(testGuest.source !== oldSrc, 'DOM: 来源确实发生了变化');

// 测试渲染不报错
try {
  var mockContent = { innerHTML: '' };
  renderWalkin(mockContent);
  assert(mockContent.innerHTML.length > 100, 'DOM: renderWalkin生成内容正常');
} catch(e) {
  assert(false, 'DOM: renderWalkin报错: ' + e.message);
}

// 服务项目在收银模块可用
assert(DB.services.length > 9, 'DOM: services数组已扩展（原9→' + DB.services.length + '）');

console.log('\n=============================');
console.log('总计: ' + tests + ' 项 | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('🎉 全部通过！');
else console.log('⚠️ 有 ' + failed + ' 项失败需要修复');
process.exit(failed > 0 ? 1 : 0);
