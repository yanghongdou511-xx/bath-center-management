// 日期选择器专项测试
var mockEl = {
  className:'', style:{}, childNodes:[], appendChild:function(c){ this.childNodes.push(c); }, remove:function(){
    var idx = document._elements.indexOf(this);
    if (idx >= 0) document._elements.splice(idx,1);
  },
  setAttribute:function(){}, getAttribute:function(){ return null; },
  addEventListener:function(){}, removeEventListener:function(){},
  focus:function(){}, blur:function(){}, value:'', type:'',
  textContent:'', innerHTML:'', innerText:'',
  getBoundingClientRect:function(){ return {left:0,top:0,right:0,bottom:0,width:0,height:0,x:0,y:0}; },
  querySelectorAll:function(){ return []; }, querySelector:function(){ return null; },
  removeChild:function(){}, parentNode:null, parentElement:null,
  classList:{ contains:function(){return false;}, add:function(){}, remove:function(){}, toggle:function(){} },
  offsetWidth:180, offsetHeight:40,
  dataset:{}, checked:false, disabled:false, options:[], selectedIndex:-1,
  children:[], firstChild:null, lastChild:null,
  nodeName:'DIV', id:'', placeholder:''
};

global.document = {
  getElementById:function(){ return null; },
  _elements: [],
  querySelector:function(s){
    for (var i = 0; i < this._elements.length; i++) {
      if (this._elements[i].className && this._elements[i].className.indexOf(s.replace('.','')) >= 0) return this._elements[i];
    }
    return null;
  },
  querySelectorAll:function(){ return []; },
  createElement:function(tag){
    var e = Object.assign({}, mockEl);
    e.tagName = (tag||'').toUpperCase();
    e.childNodes = [];
    e.appendChild = function(c){ e.childNodes.push(c); };
    e.removeChild = function(c){ var i = e.childNodes.indexOf(c); if(i>=0) e.childNodes.splice(i,1); };
    document._elements.push(e);
    return e;
  },
  body: Object.assign({}, mockEl, { childNodes:[], appendChild:function(c){ this.childNodes.push(c);} }),
  addEventListener:function(){},
  activeElement: null
};

global.window = {
  document: global.document,
  getComputedStyle:function(){ return { getPropertyValue:function(){return '';} }; },
  setTimeout:setTimeout, clearTimeout:clearTimeout,
  setInterval:function(){return 0;}, clearInterval:function(){},
  requestAnimationFrame:function(cb){ return setTimeout(cb,16); },
  cancelAnimationFrame:clearTimeout,
  innerWidth:1280, innerHeight:720,
  matchMedia:function(){ return { matches:false }; },
  localStorage:{ getItem:function(){return null;}, setItem:function(){}, removeItem:function(){} },
  sessionStorage:{ getItem:function(){return null;}, setItem:function(){} },
  alert:function(){}, confirm:function(){return true;}
};

try { eval(require('fs').readFileSync('app.js','utf8').replace(/^(\s*)(let|const)\s+/gm,'$1var ')); } catch(e) {}

var passed=0, failed=0;
function assert(cond,msg){ if(cond){ passed++; }else{ failed++; console.log('FAIL: '+msg); }}

// T1: applyCustomDate 正确更新
applyCustomDate('2026-09-15');
assert(_todayCache.str === '2026-09-15', 'T1 str');
assert(_todayCache.label === '09-15 周二', 'T1 label');
assert(_todayCache.y === 2026 && _todayCache.m === '09' && _todayCache.d === '15', 'T1 ymd');

// T2: 无效日期不更新
var prev = _todayCache.str;
applyCustomDate('invalid');
assert(_todayCache.str === prev, 'T2 invalid no-op');

// T3: showDatePicker 挂载到 body 并正确定位
var mockAnchor = {
  getBoundingClientRect:function(){ return {left:200,top:300,right:260,bottom:326,width:60,height:26}; },
  addEventListener:function(){}
};
showDatePicker(mockAnchor);
assert(document.body.childNodes.length >= 1, 'T3 body has child');
var pop = document.body.childNodes[document.body.childNodes.length - 1];
assert(pop.className === 'date-picker-pop show', 'T3 class=' + pop.className);
assert(pop.style.left === '230px', 'T3 left=' + pop.style.left);
assert(pop.style.top === '332px', 'T3 top=' + pop.style.top);

// T4: hideDatePicker 清理
hideDatePicker();
assert(document.querySelector('.date-picker-pop') === null, 'T4 removed via querySelector');

console.log('\nDATE PICKER TESTS: ' + passed + '/' + (passed+failed) + ' PASSED' + (failed ? ' ('+failed+' FAIL)' : ''));
process.exit(failed ? 1 : 0);
