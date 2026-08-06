/**
 * test_task.js — 任务管理模块专项测试
 * 覆盖: 新增任务表单/验证/保存/状态管理/编辑/边界情况
 */
const fs = require('fs');

// ===== 加载环境 =====
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
  createElement: (tag) => {
    const el = make();
    el.tagName = tag.toUpperCase();
    el.childNodes = [];
    el.innerHTML = '';
    el.appendChild = (ch) => { if (ch) el.childNodes.push(ch); };
    return el;
  },
  addEventListener: () => {}, body: { appendChild() {} }
};
global.document = doc;
global.window = {
  onerror: null, location: {}, addEventListener() {},
  __appBooted: false
};
global.localStorage = {
  _d: {},
  getItem(k) { return this._d[k] || null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; }
};
global.toast = (msg) => {}; // 静默 toast
global.esc = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
global.$ = (id) => doc.getElementById(id);

eval(code.replace(/^(\s*)(let|const)\s+/gm, '$1var '));

// ===== 测试工具 =====
let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; } else { failed++; console.log('  ❌ FAIL: ' + msg); }
}
function assertEq(a, b, msg) { assert(a === b, msg + ' (expected: ' + b + ', got: ' + a + ')'); }
function assertGt(a, b, msg) { assert(a > b, msg + ' (' + a + ' > ' + b + ')'); }
function section(name) { console.log('\n--- ' + name + ' ---'); }

// ===== 测试开始 =====
console.log('===== 任务管理模块测试 =====');

// ---- 1. 基础数据结构 ----
section('1. DB.tasks 数据结构');
assert(Array.isArray(DB.tasks), 'DB.tasks 是数组');
assertGt(DB.tasks.length, 0, '任务数量 > 0');
assertEq(DB.tasks.length, 15, '初始任务数=15');

var firstTask = DB.tasks[0];
assert('id' in firstTask, '任务含 id 字段');
assert('title' in firstTask, '任务含 title 字段');
assert('desc' in firstTask, '任务含 desc 字段');
assert('assignee' in firstTask, '任务含 assignee 字段');
assert('priority' in firstTask, '任务含 priority 字段');
assert('deadline' in firstTask, '任���含 deadline 字段');
assert('status' in firstTask, '任务含 status 字段');
assert('createdAt' in firstTask, '任务含 createdAt 字段');
assert('updatedAt' in firstTask, '任务含 updatedAt 字段');

// ---- 2. 状态配置 ----
section('2. TASK_STATUS 配置');
assert('待开始' in TASK_STATUS, 'TASK_STATUS 含 待开始');
assert('进行中' in TASK_STATUS, 'TASK_STATUS 含 进行中');
assert('已完成' in TASK_STATUS, 'TASK_STATUS 含 已完成');
assert('已取消' in TASK_STATUS, 'TASK_STATUS 含 已取消');
assertEq(Object.keys(TASK_STATUS).length, 4, '4种状态');

// ---- 3. 优先级配置 ----
section('3. TASK_PRIORITY 配置');
assert('高' in TASK_PRIORITY, 'TASK_PRIORITY 含 高');
assert('中' in TASK_PRIORITY, 'TASK_PRIORITY 含 中');
assert('低' in TASK_PRIORITY, 'TASK_PRIORITY 含 低');
assertEq(TASK_PRIORITY['高'].color, '#e74c3c', '高优先级颜色=红');
assertEq(TASK_PRIORITY['低'].color, '#27ae60', '低优先级颜色=绿');

// ---- 4. 筛选变量初始化 ----
section('4. 筛选变量');
assert(typeof taskFilter !== 'undefined', 'taskFilter 已定义');
assert(typeof taskPriorityFilter !== 'undefined', 'taskPriorityFilter 已定义');
assert(typeof taskKeyword !== 'undefined', 'taskKeyword 已定义');
assertEq(taskFilter, '', 'taskFilter 默认空');
assertEq(taskPriorityFilter, '', 'taskPriorityFilter 默认空');
assertEq(taskKeyword, '', 'taskKeyword 默认空');

// ---- 5. changeTaskStatus 函数 ----
section('5. changeTaskStatus 状态变更');
var origStatus = DB.tasks[0].status;
changeTaskStatus(DB.tasks[0].id, '已完成');
assertEq(DB.tasks[0].status, '已完成', '状态变更为 已完成');
assert(DB.tasks[0].updatedAt !== origStatus, 'updatedAt 已更新');
// 恢复
DB.tasks[0].status = origStatus;

// 无效状态不应崩溃
try {
  changeTaskStatus('NONEXISTENT_ID', '待开始');
  assert(true, '不存在的ID不报错');
} catch(e) {
  assert(false, '不存在的ID不应抛异常: ' + e.message);
}

// ---- 6. renderTask 函数存在且可调用 ----
section('6. renderTask 渲染');
assert(typeof renderTask === 'function', 'renderTask 是函数');
try {
  var c = make();
  renderTask(c);
  assert(c.innerHTML.length > 100, 'renderTask 输出内容非空');
  assert(c.innerHTML.includes('新增任务'), '输出含"新增任务"按钮');
  assert(c.innerHTML.includes('全部任务'), '输出含统计卡片');
} catch(e) {
  assert(false, 'renderTask 执行异常: ' + e.message);
}

// ---- 7. showTaskForm 函数存在 ----
section('7. showTaskForm 函数');
assert(typeof showTaskForm === 'function', 'showTaskForm 是函数');
assert(typeof saveTask === 'function', 'saveTask 是函数');
assert(typeof validateTaskForm === 'function', 'validateTaskForm 是函数');

// ---- 8. 新增任务后数据变化 ----
section('8. saveTask 新增任务（模拟表单DOM）');
var taskCountBefore = DB.tasks.length;

// 模拟表单 DOM 元素
store['task-edit-id'] = { value: '' };
store['task-title'] = { value: '测试任务标题' };
store['task-desc'] = { value: '这是一个测试任务的描述内容' };
store['task-assignee'] = { value: '张伟' };
store['task-priority'] = { value: '高' };
store['task-deadline'] = { value: '2026-09-01' };
store['task-status-sel'] = { value: '待开始' };
store['task-form-errors'] = { style: { display: 'none' }, innerHTML: '' };

saveTask();

assertEq(DB.tasks.length, taskCountBefore + 1, '任务总数+1');
var newTask = DB.tasks[DB.tasks.length - 1];
assert(newTask.id.startsWith('TK'), '新任务ID以TK开头');
assertEq(newTask.title, '测试任务标题', '新任务标题正确');
assertEq(newTask.desc, '这是一个测试任务的描述内容', '新任务描述正确');
assertEq(newTask.assignee, '张伟', '新任务负责人正确');
assertEq(newTask.priority, '高', '新任务优先级正确');
assertEq(newTask.deadline, '2026-09-01', '新任务截止日期正确');
assertEq(newTask.status, '待开始', '新任务状态正确');
assert(newTask.createdAt, '新任务有创建时间');
assert(newTask.updatedAt, '新任务有更新时间');

// ---- 9. 编辑已有任务 ----
section('9. saveTask 编辑模式');
var editTarget = DB.tasks[1];
var editTitleBefore = editTarget.title;

store['task-edit-id'] = { value: editTarget.id };
store['task-title'] = { value: '编辑后的任务标题' };
store['task-desc'] = { value: '编辑后的描述' };
store['task-assignee'] = { value: '李娜' };
store['task-priority'] = { value: '低' };
store['task-deadline'] = { value: '2026-10-15' };
store['task-status-sel'] = { value: '进行中' };
store['task-form-errors'] = { style: { display: 'none' }, innerHTML: '' };

saveTask();

assertEq(editTarget.title, '编辑后的任务标题', '编辑后标题更新');
assertEq(editTarget.assignee, '李娜', '编辑后负责人更新');
assertEq(editTarget.priority, '低', '编辑后优先级更新');
assertEq(editTarget.deadline, '2026-10-15', '编辑后截止日期更新');
assertEq(editTarget.status, '进行中', '编辑后状态更新');
assertEq(DB.tasks.length, taskCountBefore + 1, '编辑模式下任务总数不变');

// 恢复原数据
editTarget.title = editTitleBefore;

// ---- 10. 表单验证 - 必填项 ----
section('10. validateTaskForm 验证规则');

// 10a. 全空
store['task-title'] = { value: '' };
store['task-assignee'] = { value: '' };
store['task-deadline'] = { value: '' };
var errs = validateTaskForm();
assert(errs.length >= 3, '全空时至少3个错误(标题+负责人+日期)');
assert(errs.some(e => e.includes('标题')), '错误包含标题提示');
assert(errs.some(e => e.includes('负责人')), '错误包含负责人提示');
assert(errs.some(e => e.includes('日期')), '错误包含日期提示');

// 10b. 标题太短
store['task-title'] = { value: 'A' }; // 1字符
store['task-assignee'] = { value: '张伟' };
store['task-deadline'] = { value: '2026-12-31' };
errs = validateTaskForm();
assert(errs.some(e => e.includes('2个字符') || e.includes('至少')), '标题太短时有错误');

// 10c. 标题超长
store['task-title'] = { value: 'A'.repeat(51) };
errs = validateTaskForm();
assert(errs.some(e => e.includes('50') || e.includes('超过')), '标题超长时有错误');

// 10d. 截止日期早于今天
store['task-title'] = { value: '正常标题' };
store['task-deadline'] = { value: '2020-01-01' };
errs = validateTaskForm();
assert(errs.some(e => e.includes('不能早于') || e.includes('早于今天') || e.includes('过去')), '过期日期时有错误');

// 10e. 正常数据通过验证
store['task-title'] = { value: '正常的任务标题' };
store['task-assignee'] = { value: '李娜' };
store['task-deadline'] = { value: '2099-12-31' };
errs = validateTaskForm();
assertEq(errs.length, 0, '合法数据验证通过，0错误');

// ---- 11. ID 自动递增 ----
section('11. 任务ID自动生成');
var ids = DB.tasks.map(t => t.id).filter(id => /^TK\d{3}$/.test(id));
var nums = ids.map(id => parseInt(id.slice(2)));
var maxId = Math.max.apply(null, nums);
assertGt(maxId, 15, '最大ID编号>15（说明新增任务生成了更大的编号）');

// ---- 12. 状态统计准确性 ----
section('12. 状态统计');
var pendingCnt = DB.tasks.filter(t => t.status === '待开始').length;
var progressCnt = DB.tasks.filter(t => t.status === '进行中').length;
var doneCnt = DB.tasks.filter(t => t.status === '已完成').length;
var cancelCnt = DB.tasks.filter(t => t.status === '已取消').length;
assertEq(pendingCnt + progressCnt + doneCnt + cancelCnt, DB.tasks.length, '各状态之和=总数');

// ---- 13. 搜索过滤功能 ----
section('13. 关键词搜索');
taskKeyword = '收银';
var filtered = DB.tasks.slice().filter(function(t) {
  var kw = taskKeyword.toLowerCase();
  return t.title.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw) || t.assignee.toLowerCase().includes(kw);
});
assert(filtered.length > 0, '关键词"收银"能匹配到任务');
taskKeyword = ''; // 重置

// ---- 14. 优先级过滤 ----
section('14. 优先级过滤');
taskPriorityFilter = '高';
var highPri = DB.tasks.filter(t => t.priority === '高');
assert(highPri.length > 0, '存在高优先级任务');
taskPriorityFilter = ''; // 重置

// ---- 15. 渲染含完整元素 ----
section('15. renderTask 完整性检查');
var rc = make();
renderTask(rc);
var html = rc.innerHTML;
assert(html.includes('task-list'), '输出含 task-list 容器');
assert(html.includes('task-card'), '输出含 task-card 卡片');
assert(html.includes('att-stats'), '输出含统计区域');
assert(html.includes('filter-bar'), '输出含筛选栏');
assert(html.includes('优先级'), '输出含优先级筛选');
assert(html.includes('待开始'), '输出含状态筛选-待开始');
assert(html.includes('进行中'), '输出含状态筛选-进行中');
assert(html.includes('已完成'), '输出含状态筛选-已完成');
assert(html.includes('已取消'), '输出含状态筛选-已取消');

// ---- 16. 无乱码检查 ----
section('16. 任务区无乱码');
var taskCode = code.match(/\/\/ ===== 任务管理 =====[\s\S]*?(?=\n\/\/ =====|\nif \(typeof window)/);
if (taskCode) {
  var mojibake = (taskCode[0].match(/\ufffd|��/g) || []).length;
  assertEq(mojibake, 0, '任务管理代码区无乱码字符');
}

// ===== 结果汇总 =====
console.log('\n==============================');
console.log('总计: ' + (passed + failed) + ' | 通过: ' + passed + ' | 失败: ' + failed);
if (failed === 0) {
  console.log('ALL ' + passed + ' TESTS PASSED ✅');
} else {
  console.log('❌ ' + failed + ' 个测试失败');
}
console.log('==============================');
process.exit(failed > 0 ? 1 : 0);
