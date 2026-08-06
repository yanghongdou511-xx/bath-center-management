/**
 * test_persist.js — 数据持久化专项测试
 * 覆盖: persistData/loadPersistedData 字段完整性、内联状态切换即时持久化、往返还原
 */
const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8') + '\n' + fs.readFileSync('app.js', 'utf8');
const store = {};
const make = () => ({
  _html: '', innerHTML: '', style: {},
  classList: { add() {}, remove() {} },
  appendChild() {}, querySelector: () => null, querySelectorAll: () => [],
  addEventListener() {}, setAttribute() {}, remove() {}, value: '',
  closest() { return null; }
});
const doc = {
  getElementById: (id) => store[id] || (store[id] = make()),
  querySelector: () => null, querySelectorAll: () => [],
  createElement: (tag) => { const el = make(); el.tagName = (tag || '').toUpperCase(); el.childNodes = []; el.innerHTML = ''; el.appendChild = (ch) => { if (ch) el.childNodes.push(ch); }; return el; },
  addEventListener: () => {}, body: { appendChild() {} }
};
global.document = doc;
global.window = { onerror: null, location: {}, addEventListener() {}, __appBooted: false };
global.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
global.toast = () => {};
global.esc = (s) => (s == null ? '' : String(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
global.$ = (id) => doc.getElementById(id);

eval(code.replace(/^(\s*)(let|const)\s+/gm, '$1var '));

// ===== 测试工具 =====
let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; } else { failed++; console.log('  ❌ FAIL: ' + msg); } }
function section(name) { console.log('\n--- ' + name + ' ---'); }
function savedBlob() { return JSON.parse(localStorage.getItem('bathcenter_data')); }

console.log('===== 数据持久化专项测试 =====');

// ---- 1. persistData 字段完整性 ----
section('1. persistData 已包含 services/technicians/employees/reservations');
persistData();
const blob = savedBlob();
assert(blob && Array.isArray(blob.members), 'members 已持久化');
assert(Array.isArray(blob.services), 'services 已持久化（此前缺失）');
assert(Array.isArray(blob.technicians), 'technicians 已持久化（此前缺失）');
assert(Array.isArray(blob.employees), 'employees 已持久化（此前缺失）');
assert(Array.isArray(blob.reservations), 'reservations 已持久化（此前缺失）');
assert(blob.services.length === DB.services.length, 'services 长度一致');
assert(blob.technicians.length === DB.technicians.length, 'technicians 长度一致');
assert(blob.employees.length === DB.employees.length, 'employees 长度一致');
assert(blob.reservations.length === DB.reservations.length, 'reservations 长度一致');

// ---- 2. 内联状态切换即时持久化 ----
section('2. 服务状态切换即时持久化');
const svcId = DB.services[0].id;
const svcOld = DB.services[0].status;
changeSvcStatus(svcId, svcOld === 'off' ? 'on' : 'off');
let b2 = savedBlob();
const svcSaved = b2.services.find(s => s.id === svcId);
assert(svcSaved && svcSaved.status === (svcOld === 'off' ? 'on' : 'off'), '服务状态变更已写入 localStorage');
changeSvcStatus(svcId, svcOld); // 复原

section('3. 预约状态切换即时持久化');
if (DB.reservations.length) {
  const rid = DB.reservations[0].id;
  const rOld = DB.reservations[0].status;
  setResv(rid, 'done');
  let b3 = savedBlob();
  const rSaved = b3.reservations.find(r => r.id === rid);
  assert(rSaved && rSaved.status === 'done', '预约状态变更已写入 localStorage');
  setResv(rid, rOld); // 复原
} else {
  assert(true, '无预约数据，跳过（占位通过）');
}

// ---- 3. 往返还原（清空后从 localStorage 恢复）----
section('4. 持久化→清空→还原 往返正确');
const techCount = DB.technicians.length;
DB.technicians.push({ id: 'T9999', name: '持久化测试技师', gender: '女', busy: false, skills: '测试' });
DB.employees.push({ id: 'E9999', name: '持久化测试员工', role: '技师', department: '测试部', hireDate: '2026-08-06' });
persistData();
const b4 = savedBlob();
assert(b4.technicians.some(t => t.id === 'T9999'), '新增技师已落盘');
assert(b4.employees.some(e => e.id === 'E9999'), '新增员工已落盘');
// 清空内存，再还原
DB.technicians = [];
DB.employees = [];
loadPersistedData();
assert(DB.technicians.length === techCount + 1, '还原后技师数量正确（含新增）');
assert(DB.technicians.some(t => t.id === 'T9999'), '还原后保留新增技师');
assert(DB.employees.length >= 1 && DB.employees.some(e => e.id === 'E9999'), '还原后保留新增员工');

// ---- 5. DATA_VERSION 一致 ----
section('5. DATA_VERSION 一致');
const b5 = savedBlob();
assert(b5._v === DATA_VERSION, '持久化版本与 DATA_VERSION 一致 (' + b5._v + ')');

// ===== 汇总 =====
console.log('\n==============================');
console.log('总计: ' + (passed + failed) + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) console.log('ALL PERSIST TESTS PASSED ✅');
else console.log('有 ' + failed + ' 项失败 ❌');
process.exit(failed === 0 ? 0 : 1);
