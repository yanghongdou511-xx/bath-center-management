// Flatpickr 日历选择器专项测试
var mockEl = {
  className:'', style:{}, childNodes:[], appendChild:function(c){ this.childNodes.push(c); }, remove:function(){
    var idx = (document._elements||[]).indexOf(this);
    if(idx>=0) document._elements.splice(idx,1);
  },
  setAttribute:function(){}, getAttribute:function(){ return null; },
  addEventListener:function(){}, removeEventListener:function(){},
  focus:function(){}, blur:function(){}, value:'', type:'',
  textContent:'', innerHTML:'', innerText:'',
  getBoundingClientRect:function(){ return {left:0,top:0,right:0,bottom:0,width:0,height:0,x:0,y:0}; },
  querySelectorAll:function(s){ return s==='.flatpickr-calendar'&&_mockCal?[_mockCal]:[]; },
  querySelector:function(s){
    if(s==='.flatpickr-calendar') return _mockCal||null;
    for(var i=0;i<(document._elements||[]).length;i++){
      var e=document._elements[i];
      if(e.className&&e.className.indexOf(s.replace('.',''))>=0) return e;
    }
    return null;
  },
  removeChild:function(){}, parentNode:null, parentElement:null,
  classList:{ contains:function(){return false;}, add:function(){}, remove:function(){}, toggle:function(){} },
  offsetWidth:280, offsetHeight:340,
  dataset:{}, checked:false, disabled:false,
  children:[], firstChild:null, lastChild:null,
  nodeName:'DIV', id:'', placeholder:'',
  cloneNode:function(){ var c=Object.assign({},this); c.childNodes=[]; return c; }
};

var _mockCal = null;
global.document = {
  getElementById:function(){ return null; },
  _elements:[],
  querySelector:function(s){
    if(s==='.flatpickr-calendar') return _mockCal||null;
    for(var i=0;i<this._elements.length;i++){
      if(this._elements[i].className&&this._elements[i].className.indexOf(s.replace('.',''))>=0)
        return this._elements[i];
    }
    return null;
  },
  querySelectorAll:function(s){ return s==='.flatpickr-calendar'&&_mockCal?[_mockCal]:[]; },
  createElement:function(tag){
    var e=Object.assign({},mockEl);
    e.tagName=(tag||'').toUpperCase();
    e.childNodes=[];
    e.appendChild=function(c){e.childNodes.push(c);};
    e.removeChild=function(c){var i=e.childNodes.indexOf(c);if(i>=0)e.childNodes.splice(i,1);};
    document._elements.push(e);
    return e;
  },
  body:Object.assign({},mockEl,{childNodes:[],appendChild:function(c){this.childNodes.push(c);}}),
  addEventListener:function(){},
  activeElement:null
};

global.window = {
  document: global.document,
  getComputedStyle:function(){return{getPropertyValue:function(){return '';};}},
  setTimeout:setTimeout,
  clearTimeout:clearTimeout,
  setInterval:function(){return 0;},
  clearInterval:function(){},
  requestAnimationFrame:function(cb){return setTimeout(cb,16);},
  cancelAnimationFrame:clearTimeout,
  innerWidth:1280,
  innerHeight:720,
  matchMedia:function(){return{matches:false};},
  localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
  sessionStorage:{getItem:function(){return null;},setItem:function(){}},
  alert:function(){},
  confirm:function(){return true;}
};

// Mock flatpickr
global.flatpickr = function(inp, opts) {
  _mockCal = {
    className:'flatpickr-calendar open',
    style:{position:'',zIndex:'',left:'',top:'',marginLeft:''},
    offsetWidth:280,
    offsetHeight:320,
    destroy:function(){ _mockCal=null; },
    open:function(){},
    close:function(){}
  };
  if(opts.onChange&&opts.defaultDate){
    setTimeout(function(){opts.onChange([new Date(opts.defaultDate)],opts.defaultDate);},5);
  }
  return _mockCal;
};

try { eval(require('fs').readFileSync('app.js','utf8').replace(/^(\s*)(let|const)\s+/gm,'$1var ')); } catch(e){}

var passed=0,failed=0;
function assert(cond,msg){if(cond){passed++;}else{failed++;console.log('FAIL: '+msg);}}

// T1: applyCustomDate 正确更新
applyCustomDate('2026-09-15');
assert(_todayCache.str==='2026-09-15','T1 str');
assert(_todayCache.label==='09-15 周二','T1 label');
assert(_todayCache.y===2026,'T1 year');

// T2: 无效日期不更新
var prev=_todayCache.str;
applyCustomDate('invalid');
assert(_todayCache.str===prev,'T2 invalid no-op');

// T3: showDatePicker 创建 flatpickr 实例
var mockAnchor={getBoundingClientRect:function(){return{left:200,top:300,right:260,bottom:326,width:60,height:26};},addEventListener:function(){}};
showDatePicker(mockAnchor);
assert(_fpInstance!==null,'T3 instance created');
assert(_mockCal!==null,'T3 calendar element');
assert(_mockCal.style.position==='fixed','T3 fixed pos='+_mockCal.style.position);
assert(_mockCal.style.zIndex==='9999','T3 zIndex='+_mockCal.style.zIndex);

// T4: hideDatePicker 销毁实例
hideDatePicker();
assert(_fpInstance===null,'T4 instance nulled');
assert(_mockCal===null,'T4 calendar removed');

console.log('\nFLATPICKR DATE PICKER: '+passed+'/'+(passed+failed)+' PASSED'+(fail?' ('+fail+' FAIL)':''));
process.exit(failed?1:0);
