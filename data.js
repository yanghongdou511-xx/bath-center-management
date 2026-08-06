// ===== 模拟数据（内存数据库） =====
const DB = {
  store: { current: '总店', list: ['总店', '浦东分店', '城西分店'] },

  members: [
    { id: 'M10001', name: '张伟', phone: '138****0021', level: '钻石卡', balance: 5280, points: 12400, regDate: '2024-03-12', status: 'active' },
    { id: 'M10002', name: '李娜', phone: '139****8832', level: '金卡', balance: 1860, points: 5200, regDate: '2024-05-20', status: 'active' },
    { id: 'M10003', name: '王芳', phone: '137****1190', level: '银卡', balance: 540, points: 2100, regDate: '2024-07-08', status: 'active' },
    { id: 'M10004', name: '刘洋', phone: '135****6677', level: '普通会员', balance: 120, points: 480, regDate: '2025-01-15', status: 'active' },
    { id: 'M10005', name: '陈静', phone: '136****3344', level: '铂金卡', balance: 3300, points: 8800, regDate: '2024-11-02', status: 'frozen' },
    { id: 'M10006', name: '赵磊', phone: '188****9012', level: '钻石卡', balance: 9600, points: 21000, regDate: '2023-09-18', status: 'active' },
    { id: 'M10007', name: '孙丽', phone: '199****5566', level: '金卡', balance: 720, points: 3400, regDate: '2025-02-28', status: 'active' },
    { id: 'M10008', name: '周强', phone: '133****2210', level: '普通会员', balance: 60, points: 150, regDate: '2025-06-10', status: 'active' },
  ],

  services: [
    { id: 'S2001', name: '经典沐浴', category: '基础洗浴', price: 88, duration: 60, technician: '不限', status: 'on' },
    { id: 'S2002', name: '中药足疗', category: '足疗按摩', price: 168, duration: 90, technician: '需指定', status: 'on' },
    { id: 'S2003', name: '泰式按摩', category: '按摩SPA', price: 298, duration: 120, technician: '需指定', status: 'on' },
    { id: 'S2004', name: '精油SPA', category: '按摩SPA', price: 458, duration: 120, technician: '需指定', status: 'on' },
    { id: 'S2005', name: '汗蒸体验', category: '休闲娱乐', price: 58, duration: 180, technician: '不限', status: 'on' },
    { id: 'S2006', name: '鱼疗', category: '休闲娱乐', price: 68, duration: 45, technician: '不限', status: 'on' },
    { id: 'S2007', name: '搓背服务', category: '基础洗浴', price: 38, duration: 30, technician: '不限', status: 'on' },
    { id: 'S2008', name: 'VIP私汤', category: '包厢服务', price: 688, duration: 240, technician: '需指定', status: 'on' },
    { id: 'S2009', name: '面部护理', category: '美容美体', price: 218, duration: 75, technician: '需指定', status: 'off' },
  ],

  rooms: [
    { no: 'A101', type: '单人汤屋', status: 'free' },
    { no: 'A102', type: '单人汤屋', status: 'busy' },
    { no: 'A103', type: '单人汤屋', status: 'clean' },
    { no: 'B201', type: '双人汤屋', status: 'busy' },
    { no: 'B202', type: '双人汤屋', status: 'free' },
    { no: 'C301', type: 'VIP套房', status: 'busy' },
    { no: 'C302', type: 'VIP套房', status: 'maint' },
    { no: 'D401', type: '通铺大厅', status: 'free' },
    { no: 'D402', type: '通铺大厅', status: 'busy' },
    { no: 'E501', type: '更衣柜区', status: 'free' },
  ],

  inventory: [
    { id: 'P3001', name: '一次性毛巾', stock: 1200, unit: '条', warnLine: 300, supplier: '洁豪日用品', status: 'normal' },
    { id: 'P3002', name: '沐浴露', stock: 86, unit: '瓶', warnLine: 100, supplier: '蓝月亮', status: 'warn' },
    { id: 'P3003', name: '洗发水', stock: 64, unit: '瓶', warnLine: 100, supplier: '蓝月亮', status: 'warn' },
    { id: 'P3004', name: '按摩精油', stock: 240, unit: '瓶', warnLine: 80, supplier: '芳疗世家', status: 'normal' },
    { id: 'P3005', name: '凉茶饮料', stock: 520, unit: '罐', warnLine: 150, supplier: '王老吉', status: 'normal' },
    { id: 'P3006', name: '拖鞋', stock: 45, unit: '双', warnLine: 100, supplier: '足安', status: 'warn' },
    { id: 'P3007', name: '浴袍', stock: 180, unit: '件', warnLine: 60, supplier: '云锦纺织', status: 'normal' },
    { id: 'P3008', name: '一次性牙刷', stock: 2100, unit: '支', warnLine: 500, supplier: '洁豪日用品', status: 'normal' },
  ],
  inventoryLog: [],

  employees: [
    { id: 'E4001', name: '李师傅', role: '高级技师', techLevel: '特级', phone: '151****2233', commission: '15%', status: 'on' },
    { id: 'E4002', name: '王师傅', role: '按摩技师', techLevel: '高级', phone: '152****8899', commission: '12%', status: 'on' },
    { id: 'E4003', name: '赵主管', role: '前台主管', techLevel: '-', phone: '153****1100', commission: '固定', status: 'on' },
    { id: 'E4004', name: '钱收银', role: '收银员', techLevel: '-', phone: '154****4455', commission: '固定', status: 'on' },
    { id: 'E4005', name: '孙技师', role: '足疗技师', techLevel: '中级', phone: '155****6677', commission: '10%', status: 'off' },
    { id: 'E4006', name: '周保洁', role: '保洁员', techLevel: '-', phone: '156****7788', commission: '固定', status: 'on' },
  ],

  // 今日营收趋势（小时）
  hourly: [
    { h: '10:00', v: 1200 }, { h: '11:00', v: 2400 }, { h: '12:00', v: 3800 },
    { h: '13:00', v: 2900 }, { h: '14:00', v: 4200 }, { h: '15:00', v: 5100 },
    { h: '16:00', v: 4800 }, { h: '17:00', v: 6700 }, { h: '18:00', v: 8900 },
    { h: '19:00', v: 11200 }, { h: '20:00', v: 13600 }, { h: '21:00', v: 9800 },
  ],
  // 近7天营收
  weekly: [
    { d: '周一', v: 32000 }, { d: '周二', v: 28500 }, { d: '周三', v: 34600 },
    { d: '周四', v: 29800 }, { d: '周五', v: 45200 }, { d: '周六', v: 68900 }, { d: '周日', v: 71200 },
  ],
  // 技师业绩排行
  techRank: [
    { name: '李师傅', amount: 18600 }, { name: '王师傅', amount: 15400 },
    { name: '孙技师', amount: 9800 }, { name: '陈技师', amount: 7600 },
    { name: '周师傅', amount: 5400 },
  ],

  orders: [
    { id: 'O8001', member: '张伟', items: '经典沐浴+搓背', amount: 126, pay: '会员卡', time: '19:12', cashier: '钱收银' },
    { id: 'O8002', member: '赵磊', items: '泰式按摩', amount: 298, pay: '微信', time: '19:05', cashier: '钱收银' },
    { id: 'O8003', member: '散客', items: '汗蒸+鱼疗', amount: 126, pay: '支付宝', time: '18:52', cashier: '赵主管' },
  ],

  // 预约管理
  reservations: [
    { id: 'B9001', member: '张伟', phone: '138****0021', service: '泰式按摩', room: 'C301', tech: '李师傅', date: '2026-08-04', time: '20:00', people: 2, status: 'confirmed' },
    { id: 'B9002', member: '李娜', phone: '139****8832', service: '经典沐浴+搓背', room: 'A101', tech: '不限', date: '2026-08-04', time: '19:30', people: 1, status: 'pending' },
    { id: 'B9003', member: '赵磊', phone: '188****9012', service: 'VIP私汤', room: 'C302', tech: '王师傅', date: '2026-08-05', time: '21:00', people: 4, status: 'confirmed' },
    { id: 'B9004', member: '陈静', phone: '136****3344', service: '精油SPA', room: 'B201', tech: '孙技师', date: '2026-08-04', time: '18:00', people: 2, status: 'done' },
    { id: 'B9005', member: '散客', phone: '—', service: '汗蒸体验', room: 'D401', tech: '不限', date: '2026-08-04', time: '17:00', people: 6, status: 'cancelled' },
  ],

  // 营销活动：优惠券 + 活动
  coupons: [
    { id: 'C01', name: '满300减50', type: '满减', rule: '消费满300元立减50元', total: 500, used: 213, expire: '2026-09-30', status: 'on' },
    { id: 'C02', name: '会员折扣8.8折', type: '折扣', rule: '会员专享全场8.8折', total: 1000, used: 642, expire: '2026-08-31', status: 'on' },
    { id: 'C03', name: '新客免单券', type: '赠品', rule: '首次到店赠搓背服务1次', total: 200, used: 88, expire: '2026-12-31', status: 'on' },
    { id: 'C04', name: '老带新奖励', type: '满减', rule: '带新客各得50元储值', total: 300, used: 30, expire: '2026-10-15', status: 'off' },
  ],
  campaigns: [
    { id: 'P01', name: '夏日清凉节', desc: '汗蒸 / 鱼疗买一送一，会员储值额外送10%', start: '2026-08-01', end: '2026-08-31', status: 'ongoing' },
    { id: 'P02', name: '七夕双人套餐', desc: 'VIP套房 + 精油SPA 双人特惠 ¥999', start: '2026-08-19', end: '2026-08-26', status: 'upcoming' },
  ],

  // 寄存管理
  lockers: [
    { no: 'L01', zone: 'A区', status: 'free', member: '', item: '', time: '' },
    { no: 'L02', zone: 'A区', status: 'used', member: '张伟', item: '贵重物品袋', time: '14:20' },
    { no: 'L03', zone: 'A区', status: 'used', member: '李娜', item: '衣物+手机', time: '15:40' },
    { no: 'L04', zone: 'B区', status: 'free', member: '', item: '', time: '' },
    { no: 'L05', zone: 'B区', status: 'maint', member: '', item: '', time: '锁具维修' },
    { no: 'L06', zone: 'B区', status: 'used', member: '赵磊', item: '行李箱', time: '16:10' },
    { no: 'L07', zone: 'C区', status: 'free', member: '', item: '', time: '' },
    { no: 'L08', zone: 'C区', status: 'used', member: '王芳', item: '钱包钥匙', time: '13:05' },
  ],

  // 考勤排班
  attendance: {
    schedule: [
      { name: '李师傅', '周一':'早', '周二':'早', '周三':'休', '周四':'早', '周五':'晚', '周六':'晚', '周日':'休', role:'技师' },
      { name: '王师傅', '周一':'晚', '周二':'晚', '周三':'晚', '周四':'休', '周五':'早', '周六':'早', '周日':'早', role:'技师' },
      { name: '赵主管', '周一':'早', '周二':'早', '周三':'早', '周四':'早', '周五':'早', '周六':'休', '周日':'休', role:'管理' },
      { name: '钱收银', '周一':'中', '周二':'中', '周三':'中', '周四':'中', '周五':'中', '周六':'中', '周日':'中', role:'收银' },
      { name: '周保洁', '周一':'早', '周二':'休', '周三':'早', '周四':'早', '周五':'休', '周六':'早', '周日':'早', role:'保洁' },
    ],
    records: [
      { name: '赵主管', date: '2026-08-04', clockIn: '09:02', clockOut: '18:10', status: 'normal', hours: 9.1, role:'管理' },
      { name: '李师傅', date: '2026-08-04', clockIn: '13:50', clockOut: '—', status: 'late', hours: 0, role:'技师' },
      { name: '钱收银', date: '2026-08-04', clockIn: '12:00', clockOut: '—', status: 'normal', hours: 0, role:'收银' },
      { name: '王师傅', date: '2026-08-04', clockIn: '16:30', clockOut: '—', status: 'normal', hours: 0, role:'技师' },
      { name: '周保洁', date: '2026-08-04', clockIn: '07:00', clockOut: '15:00', status: 'normal', hours: 8.0, role:'保洁' },
    ],
    // 历史记录（用于日期切换）
    history: {
      '2026-08-03': [
        { name: '赵主管', date: '2026-08-03', clockIn: '08:55', clockOut: '18:20', status: 'normal', hours: 9.4, role:'管理' },
        { name: '李师傅', date: '2026-08-03', clockIn: '14:00', clockOut: '22:00', status: 'normal', hours: 8.0, role:'技师' },
        { name: '钱收银', date: '2026-08-03', clockIn: '11:58', clockOut: '20:05', status: 'normal', hours: 8.1, role:'收银' },
        { name: '王师傅', date: '2026-08-03', clockIn: '15:10', clockOut: '23:30', status: 'late', hours: 8.3, role:'技师' },
      ],
      '2026-08-02': [
        { name: '赵主管', date: '2026-08-02', clockIn: '09:00', clockOut: '18:00', status: 'normal', hours: 9.0, role:'管理' },
        { name: '李师傅', date: '2026-08-02', clockIn: '13:45', clockOut: '21:30', status: 'normal', hours: 7.75, role:'技师' },
        { name: '钱收银', date: '2026-08-02', clockIn: '12:05', clockOut: '—', status: 'absent', hours: 0, role:'收银' },
      ]
    }
  },

  // 客诉评价
  reviews: [
    { id: 'R01', member: '张伟', rating: 5, content: '环境干净，技师手法专业，下次还来！', time: '2026-08-03 21:30', type: '好评', status: '' },
    { id: 'R02', member: '李娜', rating: 4, content: '整体不错，就是周末等位稍久。', time: '2026-08-03 20:15', type: '好评', status: '' },
    { id: 'R03', member: '王芳', rating: 2, content: '更衣柜锁有点松，建议尽快检修。', time: '2026-08-02 19:40', type: '客诉', status: 'pending' },
    { id: 'R04', member: '赵磊', rating: 1, content: '私汤水温不稳定，已向前台投诉。', time: '2026-08-02 22:05', type: '客诉', status: 'pending' },
    { id: 'R05', member: '孙丽', rating: 5, content: '汗蒸区很舒服，服务态度也好。', time: '2026-08-01 18:50', type: '好评', status: '' },
  ],

  // 会员卡套餐
  packages: [
    { id: 'PK1', name: '储值1000送200', type: '储值卡', price: 1000, gift: 200, points: 1200, tag: '热销', desc: '等价1200元，享会员专属折扣' },
    { id: 'PK2', name: '储值3000送800', type: '储值卡', price: 3000, gift: 800, points: 3800, tag: '超值', desc: '等价3800元，赠VIP私汤体验1次' },
    { id: 'PK3', name: '季卡 ¥1580', type: '期限卡', price: 1580, gift: 0, points: 0, tag: '', desc: '3个月不限次基础洗浴' },
    { id: 'PK4', name: '年卡 ¥4980', type: '期限卡', price: 4980, gift: 0, points: 0, tag: '尊享', desc: '全年不限次 + 每月2次精油SPA' },
    { id: 'PK5', name: '次卡10次 泰式按摩', type: '次卡', price: 2580, gift: 0, points: 0, tag: '', desc: '泰式按摩10次，约8.6折' },
  ],
};
