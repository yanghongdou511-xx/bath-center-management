// 全面扫描重复菜单项/标题/路由
var fs = require('fs');
var html = fs.readFileSync('index.html', 'utf8');
var js = fs.readFileSync('app.js', 'utf8');

var tests = 0, passed = 0, failed = 0;
function assert(cond, msg) { tests++; if (cond) { passed++; console.log('  OK ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

// === 1. 提取菜单项（菜单由 app.js 的 NAV 配置动态生成，故从这里解析） ===
var navMatch = js.match(/var NAV = \[([\s\S]*?)\];/);
var menus = {}, menuLabels = [];
if (navMatch) {
  var navItems = navMatch[1].match(/\{ page:\s*'([^']+)',\s*label:\s*'([^']+)'\s*\}/g) || [];
  navItems.forEach(function(it) {
    var kv = it.match(/\{ page:\s*'([^']+)',\s*label:\s*'([^']+)'\s*\}/);
    menus[kv[1]] = kv[2];
    menuLabels.push(kv[2]);
  });
}

console.log('=== 1. 菜单项 (' + menuLabels.length + '项) ===');
menuLabels.forEach(function(l, i) { console.log('  ' + (i + 1) + '. ' + l); });

// 菜单名称重复检测
var labelCount = {};
menuLabels.forEach(function(l) { labelCount[l] = (labelCount[l] || 0) + 1; });
var dupLabels = Object.keys(labelCount).filter(function(l) { return labelCount[l] > 1; });
assert(dupLabels.length === 0, '菜单名称无重复 (dupLabels=' + JSON.stringify(dupLabels) + ')');

// data-page 路由重复
var pageKeys = Object.keys(menus);
var routeCount = {};
pageKeys.forEach(function(p) { routeCount[p] = (routeCount[p] || 0) + 1; });
var dupRoutes = Object.keys(routeCount).filter(function(p) { return routeCount[p] > 1; });
assert(dupRoutes.length === 0, 'data-page路由无重复 (dupRoutes=' + JSON.stringify(dupRoutes) + ')');

// === 2. TITLES 字典 ===
var titleMatch = js.match(/TITLES\s*=\s*\{([\s\S]*?)\};/);
var titles = {};
if (titleMatch) {
  var pairs = titleMatch[1].match(/(\w+):\s*'([^']*)'/g) || [];
  pairs.forEach(function(p) {
    var kv = p.match(/(\w+):\s*'([^']*)'/);
    titles[kv[1]] = kv[2];
  });
}
console.log('\n=== 2. TITLES字典 (' + Object.keys(titles).length + '项) ===');

// 菜单 vs TITLES key 一致
var missingInTitles = pageKeys.filter(function(k) { return !titles[k]; });
var missingInMenu = Object.keys(titles).filter(function(k) { return !menus[k]; });
assert(missingInTitles.length === 0, 'TITLES包含所有菜单路由 (missing=' + JSON.stringify(missingInTitles) + ')');
assert(missingInMenu.length === 0, '菜单包含所有TITLES路由 (missing=' + JSON.stringify(missingInMenu) + ')');

// 菜单label vs TITLES value 一致
var mismatches = [];
pageKeys.forEach(function(k) {
  if (menus[k] !== titles[k]) mismatches.push({ key: k, menu: menus[k], title: titles[k] });
});
assert(mismatches.length === 0, '菜单标签与TITLES值完全匹配 (mismatches=' + JSON.stringify(mismatches) + ')');

// === 3. h2 页面标题 ===
var h2Matches = js.match(/<h2>([^<]+)<\/h2>/g) || [];
var h2titles = {};
h2Matches.forEach(function(h) {
  var t = h.match(/<h2>([^<]+)<\/h2>/)[1];
  h2titles[t] = (h2titles[t] || 0) + 1;
});
console.log('\n=== 3. 页面h2标题 (' + h2Matches.length + '个) ===');
Object.keys(h2titles).forEach(function(t) { console.log('  "' + t + '" x' + h2titles[t]); });

var h2dups = Object.keys(h2titles).filter(function(t) { return h2titles[t] > 1; });
assert(h2dups.length === 0, 'h2页面标题无重复 (dups=' + JSON.stringify(h2dups) + ')');

// === 4. fns 路由注册完整性 ===
var fnsMatch = js.match(/fns\s*=\s*\{([\s\S]*?)\};/);
var fns = {};
if (fnsMatch) {
  var fnPairs = fnsMatch[1].match(/(\w+):\s*\w+/g) || [];
  fnPairs.forEach(function(p) {
    var kv = p.match(/(\w+):\s*(\w+)/);
    if (kv) fns[kv[1]] = kv[2];
  });
}
console.log('\n=== 4. fns路由注册 (' + Object.keys(fns).length + '项) ===');
var missingFns = pageKeys.filter(function(k) { return !fns[k]; });
assert(missingFns.length === 0, '所有菜单页面对应渲染函数已注册 (missing=' + JSON.stringify(missingFns) + ')');

// === 5. 检查截图中的具体问题：库存管理是否重复 ===
console.log('\n=== 5. 截图问题专项排查 ===');
var inventoryCount = menuLabels.filter(function(l) { return l === '库存管理'; }).length;
assert(inventoryCount === 1, '库存管理仅出现' + inventoryCount + '次（应为1次）');

// 检查是否有"短信管理"残留
var hasSms = menuLabels.indexOf('短信管理') >= 0;
assert(!hasSms, '无短信管理菜单项（旧版残留检查）');

// === 汇总 ===
console.log('\n=============================');
console.log('总计: ' + tests + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL PASSED');
else console.log('HAS FAILURES: ' + failed);
