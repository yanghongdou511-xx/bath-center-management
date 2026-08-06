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

  // ===== 散客（非会员） =====
  walkinGuests: [
    { id: 'W10001', name: '吴明', phone: '150****3321', source: '路过', visitCount: 3, totalSpent: 456, lastVisit: '2026-08-04', status: 'active' },
    { id: 'W10002', name: '郑华', phone: '157****7788', source: '朋友推荐', visitCount: 5, totalSpent: 1280, lastVisit: '2026-08-03', status: 'active' },
    { id: 'W10003', name: '何晓', phone: '131****9900', source: '网络平台', visitCount: 1, totalSpent: 88, lastVisit: '2026-08-04', status: 'active' },
    { id: 'W10004', name: '冯强', phone: '186****1122', source: '团购', visitCount: 2, totalSpent: 356, lastVisit: '2026-08-02', status: 'blacklist' },
    { id: 'W10005', name: '曹丽', phone: '139****5544', source: '路过', visitCount: 1, totalSpent: 298, lastVisit: '2026-08-04', status: 'active' },
    { id: 'W10006', name: '蒋伟', phone: '158****6677', source: '朋友推荐', visitCount: 4, totalSpent: 920, lastVisit: '2026-08-01', status: 'checkedout' },
    { id: 'W10007', name: '韩梅', phone: '133****8899', source: '网络平台', visitCount: 1, totalSpent: 168, lastVisit: '2026-08-03', status: 'active' },
    { id: 'W10008', name: '杨帆', phone: '199****0011', source: '路过', visitCount: 2, totalSpent: 226, lastVisit: '2026-07-28', status: 'active' },
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

  // 技师专区（详尽资料）
  technicians: [
    {
      id: 'T1001', name: '林婉清', gender: '女', empNo: 'E4001',
      avatar: '👩‍💼', category: 'SPA技师', specialties: ['精油SPA', '泰式按摩', '面部护理', '淋巴排毒'],
      experience: 8, rating: 4.9, reviewCount: 328, serviceCount: 4860,
      status: 'on', busy: false,
      bio: '国家高级美容师认证，曾赴泰国清迈进修泰式古法按摩。擅长精油开背与面部深层护理，手法细腻力度适中，尤其对肩颈酸痛和失眠调理有独到心得。累计服务超过4800位顾客，零投诉记录。性格温和，善于倾听顾客需求，是店内的金牌技师之一。',
      tags: ['金牌技师', '五星好评', '人气TOP3'],
      schedule: '早班 09:00-17:00', phone: '158****3321'
    },
    {
      id: 'T1002', name: '苏雨晴', gender: '女', empNo: 'E4002',
      avatar: '👩‍🦰', category: '足疗技师', specialties: ['中药足疗', '经络疏通', '艾灸养生', '刮痧拔罐'],
      experience: 6, rating: 4.8, reviewCount: 256, serviceCount: 3520,
      status: 'on', busy: false,
      bio: '中医推拿专业毕业，持有中医康复理疗师资格证。精通十二经络走向，擅长通过足底反射区调理亚健康状态。中药足浴配方独家调配，对手脚冰凉、湿气重、疲劳乏力效果显著。服务耐心细致，深受女性顾客喜爱。',
      tags: ['中医理疗', '养生专家'],
      schedule: '早班 09:00-17:00', phone: '159****4456'
    },
    {
      id: 'T1003', name: '陈思琪', gender: '女', empNo: 'E4003',
      avatar: '👩‍🦱', category: '按摩技师', specialties: ['泰式按摩', '中式推拿', '热石疗法', '头部舒缓'],
      experience: 5, rating: 4.7, reviewCount: 198, serviceCount: 2890,
      status: 'on', busy: true,
      bio: '毕业于成都中医药大学针灸推拿系，曾在五星级酒店SPA任职三年。手法刚柔并济，力道渗透力强。特别擅长泰式拉伸和热石能量疗法，对运动后肌肉恢复和办公室综合症（颈椎病、腰肌劳损）有丰富经验。',
      tags: ['新锐技师', '运动恢复'],
      schedule: '中班 12:00-20:00', phone: '137****7788'
    },
    {
      id: 'T1004', name: '王雅婷', gender: '女', empNo: 'E4004',
      avatar: '👩‍🦳', category: 'SPA技师', specialties: ['精油SPA', '玫瑰花瓣浴', '海藻面膜护理', '全身磨砂'],
      experience: 7, rating: 4.9, reviewCount: 412, serviceCount: 5230,
      status: 'on', busy: false,
      bio: '资深芳疗师，国际芳香治疗师协会(IFA)会员。精研植物精油配伍，根据每位顾客的体质和情绪定制专属精油方案。玫瑰花瓣浴和海藻护理是其招牌项目，多次获得店内"月度服务之星"。注重服务细节，从音乐到香氛都精心搭配。',
      tags: ['芳疗师', '月度之星', 'VIP专属'],
      schedule: '晚班 16:00-24:00', phone: '136****9900'
    },
    {
      id: 'T1005', name: '李明轩', gender: '男', empNo: 'E4005',
      avatar: '👨‍💼', category: '按摩技师', specialties: ['中式推拿', '正骨复位', '运动损伤修复', '深度指压'],
      experience: 12, rating: 4.8, reviewCount: 386, serviceCount: 6800,
      status: 'on', busy: false,
      bio: '中医世家第三代传人，自幼习武练功，后系统学习中医正骨。手法沉稳有力，尤其擅长腰椎间盘突出、颈椎病的保守治疗调理。许多老顾客专程预约其正骨服务。为人稳重可靠，是店内从业年限最长的技师之一。',
      tags: ['中医世家', '正骨专家', '元老技师'],
      schedule: '早班 09:00-17:00', phone: '151****2233'
    },
    {
      id: 'T1006', name: '赵晓雯', gender: '女', empNo: 'E4006',
      avatar: '👩', category: '足疗技师', specialties: ['中药足疗', '足底反射疗法', '腿部塑形按摩', '泡脚药膳'],
      experience: 4, rating: 4.6, reviewCount: 145, serviceCount: 2100,
      status: 'on', busy: false,
      bio: '毕业于河北中医学院康复治疗专业，年轻有活力。擅长结合现代解剖学与中医反射理论进行足疗服务。自创腿部塑形按摩手法，对水肿腿、静脉曲张预防效果良好。态度热情开朗，与年轻顾客沟通融洽。',
      tags: ['新生代', '活力满满'],
      schedule: '中班 12:00-20:00', phone: '152****8899'
    },
    {
      id: 'T1007', name: '张浩然', gender: '男', empNo: 'E4007',
      avatar: '👨', category: '按摩技师', specialties: ['泰式按摩', '武术点穴', '拔罐刮痧', '背部整脊'],
      experience: 9, rating: 4.7, reviewCount: 267, serviceCount: 4100,
      status: 'on', busy: true,
      bio: '河南少林寺俗家弟子出身，习武15年。将传统武术点穴融入按摩技法中，形成独特的"功夫按摩"风格。力道强劲但收放自如，适合喜欢大力按压的男性顾客。性格豪爽幽默，服务过程中常与顾客畅聊解压。',
      tags: ['功夫按摩', '大力士'],
      schedule: '晚班 16:00-24:00', phone: '153****1100'
    },
    {
      id: 'T1008', name: '刘诗涵', gender: '女', empNo: 'E4008',
      avatar: '👩‍🦰', category: '中医推拿师', specialties: ['脏腑推拿', '��儿推拿', '产后修复', '腹部调理'],
      experience: 10, rating: 4.9, reviewCount: 502, serviceCount: 7200,
      status: 'on', busy: false,
      bio: '北京中医药大学硕士，主修针灸推拿学专业。专注内科杂症的推拿调理，尤其擅长脾胃调理、痛经缓解和产后骨盆修复。小儿推拿方面经验丰富，是很多宝妈顾客的首选。治学严谨，每次服务前都会详细问诊辨证施术。',
      tags: ['医学硕士', '产后修复', '小儿推拿'],
      schedule: '早班 09:00-17:00', phone: '154****4455'
    },
    {
      id: 'T1009', name: '周子墨', gender: '男', empNo: 'E4009',
      avatar: '👨‍🦱', category: 'SPA技师', specialties: ['男士专属SPA', '商务减压套餐', '头皮养护', '眼部舒缓'],
      experience: 3, rating: 4.5, reviewCount: 89, serviceCount: 1380,
      status: 'off', busy: false,
      bio: '新晋技师，曾在知名连锁SPA品牌接受系统培训。专注于男士护肤与减压领域，商务减压套餐融合了头皮养护、眼部热敷和肩颈放松，专为职场精英设计。学习能力强，正在进修高级芳疗课程。',
      tags: ['新晋技师', '男士专属'],
      schedule: '休假中', phone: '155****6677'
    },
    {
      id: 'T1010', name: '吴佳倪', gender: '女', empNo: 'E4010',
      avatar: '👩‍🦱', category: '美容美体师', specialties: ['面部抗衰', '身体塑形', '乳腺疏通', '卵巢保养'],
      experience: 6, rating: 4.8, reviewCount: 301, serviceCount: 3950,
      status: 'on', busy: false,
      bio: '韩国首尔美容大学交换生经历，将韩式皮肤管理与中式养生理念相结合。面部抗衰采用进口仪器配合手工按摩，效果显著。身体塑形项目帮助众多产后妈妈恢复身材曲线。温柔细致的服务风格备受女性顾客推崇。',
      tags: ['韩式美学', '产后恢复'],
      schedule: '中班 12:00-20:00', phone: '156****7788'
    },
    {
      id: 'T1011', name: '郑凯文', gender: '男', empNo: 'E4011',
      avatar: '👨‍🦰', category: '按摩技师', specialties: ['日式指压', '禅意头疗', '肩颈深度放松', '睡眠调理'],
      experience: 5, rating: 4.6, reviewCount: 178, serviceCount: 2680,
      status: 'on', busy: false,
      bio: '曾赴日本东京进修日式指压（Shiatsu）两年，取得日本指压师资格认证。手法以指尖按压为主，节奏缓慢而有韵律感，特别适合压力大的都市人群。禅意头疗项目结合了穴位刺激与冥想引导，对改善失眠焦虑效果显著。',
      tags: ['日式指压', '海归背景'],
      schedule: '晚班 16:00-24:00', phone: '157****8899'
    },
    {
      id: 'T1012', name: '孙悦心', gender: '女', empNo: 'E4012',
      avatar: '👩‍🦳', category: '全能技师', specialties: ['精油SPA', '泰式按摩', '中药足疗', '全身经络疏通'],
      experience: 11, rating: 4.9, reviewCount: 567, serviceCount: 8100,
      status: 'on', busy: true,
      bio: '店内从业年限最长的女技师，全能型选手。精通所有门店服务项目，尤其擅长为首次到店的顾客提供个性化推荐方案。多次被评为年度优秀员工，带教过8名新人技师。服务全面周到，从进门接待到离店关怀都让人倍感舒适。是很多老顾客的指定首选。',
      tags: ['全能技师', '年度优秀', '带教导师'],
      schedule: '早班 09:00-17:00', phone: '158****0012'
    }
  ],

  // 会员卡套餐
  packages: [
    { id: 'PK1', name: '储值1000送200', type: '储值卡', price: 1000, gift: 200, points: 1200, tag: '热销', desc: '等价1200元，享会员专属折扣' },
    { id: 'PK2', name: '储值3000送800', type: '储值卡', price: 3000, gift: 800, points: 3800, tag: '超值', desc: '等价3800元，赠VIP私汤体验1次' },
    { id: 'PK3', name: '季卡 ¥1580', type: '期限卡', price: 1580, gift: 0, points: 0, tag: '', desc: '3个月不限次基础洗浴' },
    { id: 'PK4', name: '年卡 ¥4980', type: '期限卡', price: 4980, gift: 0, points: 0, tag: '尊享', desc: '全年不限次 + 每月2次精油SPA' },
    { id: 'PK5', name: '次卡10次 泰式按摩', type: '次卡', price: 2580, gift: 0, points: 0, tag: '', desc: '泰式按摩10次，约8.6折' },
  ],

  // 任务管理
  tasks: [
    {
      id: 'TK001', title: '完成收银台模块优化', desc: '对前台收银模块进行全面优化，包括：支付流程简化、优惠券自动匹配、会员折扣实时计算、小票打印模板美化、多支付方式混合结算等功能。需与财务系统对接确保账目一致。', assignee: '张伟', priority: '高', deadline: '2026-08-10', status: '进行中', createdAt: '2026-08-01 09:15:00', updatedAt: '2026-08-05 14:30:00'
    },
    {
      id: 'TK002', title: '新员工入职培训计划制定', desc: '为本月新入职的3名技师和2名前台人员制定系统的培训计划，涵盖企业文化、服务标准、操作流程、安全规范等内容。培训周期为两周，需安排考核环节。', assignee: '李娜', priority: '中', deadline: '2026-08-15', status: '待开始', createdAt: '2026-08-03 11:20:00', updatedAt: '2026-08-03 11:20:00'
    },
    {
      id: 'TK003', title: '库存盘点与补货申请', desc: '月底全面盘点库存物资，重点核对沐浴露、洗发水、拖鞋等易耗品。根据盘点结果生成补货申请单，联系供应商确认到货时间。同时更新库存预警阈值。', assignee: '王芳', priority: '高', deadline: '2026-08-08', status: '进行中', createdAt: '2026-07-28 16:45:00', updatedAt: '2026-08-06 09:00:00'
    },
    {
      id: 'TK004', title: 'VIP客户回访安排', desc: '整理钻石卡和铂金卡会员名单，制定本月VIP回访计划。重点回访近30天未到店的高价值会员，了解需求并推送个性化优惠方案。目标回访率不低于80%。', assignee: '赵磊', priority: '中', deadline: '2026-08-20', status: '待开始', createdAt: '2026-08-04 10:00:00', updatedAt: '2026-08-04 10:00:00'
    },
    {
      id: 'TK005', title: '空调系统维护保养', desc: '联系专业维保团队对全店中央空调系统进行季度维护保养，包括滤网清洗、制冷剂检测、管道检修等工作。需安排在客流量较少的周二至周三进行。', assignee: '周强', priority: '低', deadline: '2026-08-25', status: '待开始', createdAt: '2026-08-02 14:10:00', updatedAt: '2026-08-02 14:10:00'
    },
    {
      id: 'TK006', title: '微信公众号营销活动策划', desc: '策划8月份线上营销活动主题，结合七夕节日推出情侣套餐优惠。设计海报文案、制定活动规则、配置公众号自动回复、准备客服话术。预算控制在5000元以内。', assignee: '陈静', priority: '高', deadline: '2026-08-12', status: '进行中', createdAt: '2026-07-30 09:30:00', updatedAt: '2026-08-05 16:20:00'
    },
    {
      id: 'TK007', title: '消防设施年度检查', desc: '配合消防部门完成年度消防安全检查，提前自查灭火器压力、应急照明、疏散指示标识、喷淋系统等设施。整理检查资料存档，对发现的问题限期整改。', assignee: '周强', priority: '高', deadline: '2026-08-18', status: '待开始', createdAt: '2026-08-01 08:00:00', updatedAt: '2026-08-01 08:00:00'
    },
    {
      id: 'TK008', title: '员工考勤制度修订', desc: '根据近期运营情况调整考勤排班制度，优化高峰期人员配置。新增弹性排班规则、完善加班计算方式、明确请假审批流程。草案完成后征求各部门意见。', assignee: '李娜', priority: '中', deadline: '2026-08-22', status: '待开始', createdAt: '2026-08-05 13:40:00', updatedAt: '2026-08-05 13:40:00'
    },
    {
      id: 'TK009', title: '更衣柜区改造工程验收', desc: '更衣柜区智能化改造项目已完工，需组织验收工作：检查智能锁功能、测试电路安全性、核实材质环保达标情况、清点交付数量。验收通过后办理竣工手续。', assignee: '张伟', priority: '中', deadline: '2026-08-06', status: '已完成', createdAt: '2026-07-25 10:15:00', updatedAt: '2026-08-05 17:00:00'
    },
    {
      id: 'TK010', title: '供应商合同续签评估', desc: '梳理即将到期的供应商合作合同（洁豪日用品、蓝月亮、芳疗世家），综合评估供货质量、价格竞争力、服务响应速度，形成续签或替换建议报告提交管理层决策。', assignee: '王芳', priority: '低', deadline: '2026-08-28', status: '待开始', createdAt: '2026-08-03 15:30:00', updatedAt: '2026-08-03 15:30:00'
    },
    {
      id: 'TK011', title: '门店卫生巡查整改跟进', desc: '上周卫生巡查发现的5项问题（大堂地砖污损/男更衣区异味/毛巾消毒记录不全/走廊灯泡损坏/急救箱药品过期）需逐一确认整改进度，未完成的催促责任人限时解决。', assignee: '孙丽', priority: '高', deadline: '2026-08-07', status: '进行中', createdAt: '2026-08-04 16:00:00', updatedAt: '2026-08-06 08:30:00'
    },
    {
      id: 'TK012', title: '会员积分兑换商城选品', desc: '为即将上线的积分兑换功能筛选商品，要求单价在50-500元区间、与洗浴场景相关或为日常实用物品。初步拟定20款候选商品，核算成本后确定最终上架清单。', assignee: '陈静', priority: '中', deadline: '2026-08-30', status: '待开始', createdAt: '2026-08-05 09:00:00', updatedAt: '2026-08-05 09:00:00'
    },
    {
      id: 'TK013', title: '上月经营报表分析会', desc: '组织7月份经营数据分析会议，准备PPT汇报材料，重点分析营收环比变化、会员增长趋势、热门服务项目排名、客诉问题归类及改进措施。邀请各主管参加。', assignee: '赵磊', priority: '中', deadline: '2026-08-05', status: '已完成', createdAt: '2026-08-01 11:00:00', updatedAt: '2026-08-04 15:45:00'
    },
    {
      id: 'TK014', title: '招聘兼职按摩师启事发布', desc: '因周末客流高峰人手不足，拟招聘2-3名兼职按摩师。起草招聘启事（含岗位要求、薪资待遇、工作时间），在本地招聘平台和朋友圈同步发布，收集简历后安排面试。', assignee: '李娜', priority: '低', deadline: '2026-08-14', status: '已取消', createdAt: '2026-07-28 14:00:00', updatedAt: '2026-08-04 10:00:00'
    },
    {
      id: 'TK015', title: '水疗区水温控制系统调试', desc: '新安装的智能恒温系统需要调试各项参数：汤屋42℃/SPA池38℃/足疗池43℃/儿童池36℃。联合厂家技术人员逐池校准，记录基准值并存档备查。', assignee: '张伟', priority: '高', deadline: '2026-08-09', status: '进行中', createdAt: '2026-08-04 08:30:00', updatedAt: '2026-08-06 11:00:00'
    }
  ],
};
