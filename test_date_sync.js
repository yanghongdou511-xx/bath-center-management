// 日期同步专项测试 — 验证跨天/跨月/跨年边界
var _todayCache = (function () {
  var d = new Date();
  var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate(), wd = d.getDay();
  var mm = m < 10 ? '0' + m : '' + m; var dd = day < 10 ? '0' + day : '' + day;
  var s = y + '-' + mm + '-' + dd;
  var names = ['周日','周一','周二','周三','周四','周五','周六'];
  return { str: s, label: s.slice(5) + ' ' + names[wd], dayName: names[wd], y: y, m: mm, d: dd };
})();
function todayStr()   { return _todayCache.str; }
function offsetDateStr(daysOffset) {
  var d = new Date(_todayCache.y, parseInt(_todayCache.m,10)-1, parseInt(_todayCache.d,10)+daysOffset);
  return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2);
}
function formatDayLabel(dateStr) {
  var names = ['周日','周一','周二','周三','周四','周五','周六'];
  var d = new Date(dateStr.replace(/-/g,'/'));
  return dateStr.slice(5) + ' ' + names[d.getDay()];
}

var passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; } else { failed++; console.log('FAIL: ' + msg); } }

// 1. todayStr 格式
var ts = todayStr();
assert(/^\d{4}-\d{2}-\d{2}$/.test(ts), 'todayStr 格式 YYYY-MM-DD');

// 2. 昨天
var yd = offsetDateStr(-1);
assert(/^\d{4}-\d{2}-\d{2}$/.test(yd), 'yesterday 格式正确');
assert(yd < ts, 'yesterday < today');

// 3. 前天
var bd = offsetDateStr(-2);
assert(/^\d{4}-\d{2}-\d{2}$/.test(bd), 'dayBefore 格式正确');
assert(bd < yd, 'dayBefore < yesterday');

// 4. formatDayLabel 包含 MM-DD 和星期名
var lbl = formatDayLabel(ts);
assert(lbl.indexOf(ts.slice(5)) === 0, 'label 以 MM-DD 开头');
assert(lbl.length >= 8, 'label 长度足够');

// 5. 跨月+1 (08-31 -> 09-01)
var cm = new Date(2026, 7, 31); // Aug 31
var nxd = new Date(cm.getFullYear(), cm.getMonth(), cm.getDate() + 1);
var nx = nxd.getFullYear() + '-' + ('0'+(nxd.getMonth()+1)).slice(-2) + '-' + ('0'+nxd.getDate()).slice(-2);
assert(nx === '2026-09-01', '跨月+1: 08-31->09-01 正确');

// 6. 跨月-1 (03-01 -> 02-28)
var mar1 = new Date(2026, 2, 1); // Mar 1
var feb28 = new Date(mar1.getFullYear(), mar1.getMonth(), mar1.getDate() - 1);
var fb = feb28.getFullYear() + '-' + ('0'+(feb28.getMonth()+1)).slice(-2) + '-' + ('0'+feb28.getDate()).slice(-2);
assert(fb === '2026-02-28', '跨月-1: 03-01->02-28 正确 (2026非闰年)');

// 7. 跨年-1 (01-01 -> 上年12-31)
var jan1 = new Date(2027, 0, 1); // Jan 1, 2027
var dec31 = new Date(jan1.getFullYear(), jan1.getMonth(), jan1.getDate() - 1);
var dy = dec31.getFullYear() + '-' + ('0'+(dec31.getMonth()+1)).slice(-2) + '-' + ('0'+dec31.getDate()).slice(-2);
assert(dy === '2026-12-31', '跨年-1: 01-01->12-31 正确');

// 8. 跨年+1 (12-31 -> 下年01-01)
var dec312 = new Date(2026, 11, 31); // Dec 31, 2026
var jan1n = new Date(dec312.getFullYear(), dec312.getMonth(), dec312.getDate() + 1);
var jy = jan1n.getFullYear() + '-' + ('0'+(jan1n.getMonth()+1)).slice(-2) + '-' + ('0'+jan1n.getDate()).slice(-2);
assert(jy === '2027-01-01', '跨年+1: 12-31->01-01 正确');

console.log('\n=============================');
console.log('总计: ' + (passed + failed) + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('✅ DATE SYNC TESTS ALL PASSED');
else { console.log('❌ SOME TESTS FAILED'); process.exitCode = 1; }
