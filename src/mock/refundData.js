// 退款趋势数据
const trendData = {
  '近一周': [
    { date: '周一', amount: 4200, count: 42 },
    { date: '周二', amount: 5800, count: 58 },
    { date: '周三', amount: 6500, count: 65 },
    { date: '周四', amount: 5300, count: 53 },
    { date: '周五', amount: 7800, count: 78 },
    { date: '周六', amount: 8200, count: 82 },
    { date: '周日', amount: 6100, count: 61 }
  ],
  '近一月': [
    { date: '第1周', amount: 22000, count: 220 },
    { date: '第2周', amount: 25000, count: 250 },
    { date: '第3周', amount: 28000, count: 280 },
    { date: '第4周', amount: 26000, count: 260 }
  ],
  '近三月': [
    { date: '1月', amount: 95000, count: 950 },
    { date: '2月', amount: 82000, count: 820 },
    { date: '3月', amount: 105000, count: 1050 }
  ],
  '近一年': [
    { date: '1月', amount: 95000, count: 950 },
    { date: '2月', amount: 82000, count: 820 },
    { date: '3月', amount: 105000, count: 1050 },
    { date: '4月', amount: 98000, count: 980 },
    { date: '5月', amount: 110000, count: 1100 },
    { date: '6月', amount: 115000, count: 1150 },
    { date: '7月', amount: 120000, count: 1200 },
    { date: '8月', amount: 118000, count: 1180 },
    { date: '9月', amount: 125000, count: 1250 },
    { date: '10月', amount: 130000, count: 1300 },
    { date: '11月', amount: 132000, count: 1320 },
    { date: '12月', amount: 138000, count: 1380 }
  ]
}

// 课程退款数据
const courseData = {
  types: [
    { text: '月度', key: 'month' },
    { text: '季度', key: 'quarter' },
    { text: '年度', key: 'year' }
  ],
  month: {
    data: [
      { value: 335, name: '课程内容不满意' },
      { value: 310, name: '讲师授课不满意' },
      { value: 234, name: '个人原因' },
      { value: 135, name: '时间冲突' },
      { value: 154, name: '其他原因' }
    ]
  },
  quarter: {
    data: [
      { value: 935, name: '课程内容不满意' },
      { value: 810, name: '讲师授课不满意' },
      { value: 634, name: '个人原因' },
      { value: 535, name: '时间冲突' },
      { value: 354, name: '其他原因' }
    ]
  },
  year: {
    data: [
      { value: 3335, name: '课程内容不满意' },
      { value: 3110, name: '讲师授课不满意' },
      { value: 2234, name: '个人原因' },
      { value: 1935, name: '时间冲突' },
      { value: 1154, name: '其他原因' }
    ]
  }
}

// 退款排行数据
const rankData = {
  type: [
    { text: '课程排行', key: 'course' },
    { text: '讲师排行', key: 'teacher' }
  ],
  course: {
    title: '课程退款排行',
    data: [
      { name: 'Java高级开发', value: 200 },
      { name: 'Python数据分析', value: 180 },
      { name: '前端工程化实践', value: 150 },
      { name: 'UI设计进阶', value: 120 },
      { name: '大数据实战', value: 100 }
    ]
  },
  teacher: {
    title: '讲师退款排行',
    data: [
      { name: '张老师', value: 180 },
      { name: '李老师', value: 160 },
      { name: '王老师', value: 140 },
      { name: '赵老师', value: 120 },
      { name: '钱老师', value: 100 }
    ]
  }
}

// 地图数据
const mapData = [
  { name: '北京', value: 212 },
  { name: '天津', value: 189 },
  { name: '上海', value: 253 },
  { name: '重庆', value: 167 },
  { name: '河北', value: 124 },
  { name: '河南', value: 113 },
  { name: '云南', value: 98 },
  { name: '辽宁', value: 88 },
  { name: '黑龙江', value: 76 },
  { name: '湖南', value: 156 },
  { name: '安徽', value: 143 },
  { name: '山东', value: 178 },
  { name: '新疆', value: 56 },
  { name: '江苏', value: 198 },
  { name: '浙江', value: 223 },
  { name: '江西', value: 132 },
  { name: '湖北', value: 167 },
  { name: '广西', value: 115 },
  { name: '甘肃', value: 78 },
  { name: '山西', value: 96 },
  { name: '内蒙古', value: 63 },
  { name: '陕西', value: 124 },
  { name: '吉林', value: 68 },
  { name: '福建', value: 146 },
  { name: '贵州', value: 87 },
  { name: '广东', value: 235 },
  { name: '青海', value: 41 },
  { name: '西藏', value: 33 },
  { name: '四川', value: 186 },
  { name: '宁夏', value: 48 },
  { name: '海南', value: 72 },
  { name: '台湾', value: 0 },
  { name: '香港', value: 0 },
  { name: '澳门', value: 0 }
]

// 饼图数据
const pieData = {
  type: [
    { text: '类别分布', key: 'category' },
    { text: '原因分布', key: 'reason' }
  ],
  category: {
    title: '退款类别分布',
    data: [
      { value: 235, name: '全额退款' },
      { value: 274, name: '部分退款' },
      { value: 310, name: '延期处理' },
      { value: 335, name: '转课处理' },
      { value: 400, name: '其他处理' }
    ]
  },
  reason: {
    title: '退款原因分布',
    data: [
      { value: 335, name: '内容不满意' },
      { value: 310, name: '个人原因' },
      { value: 234, name: '时间冲突' },
      { value: 135, name: '授课质量' },
      { value: 154, name: '其他原因' }
    ]
  }
}

// 表格数据
const tableData = {
  type: [
    { text: '详细数据', key: 'detail' },
    { text: '汇总数据', key: 'summary' }
  ],
  detail: {
    title: '退款详细数据',
    data: [
      { name: '全额退款-内容不满意', value: 135 },
      { name: '全额退款-个人原因', value: 100 },
      { name: '部分退款-内容不满意', value: 125 },
      { name: '部分退款-个人原因', value: 149 },
      { name: '延期处理-时间冲突', value: 234 },
      { name: '转课处理-授课质量', value: 135 },
      { name: '其他处理-其他原因', value: 154 }
    ]
  },
  summary: {
    title: '退款汇总数据',
    data: [
      { name: '线上课程', value: 634 },
      { name: '线下课程', value: 435 },
      { name: '录播课程', value: 348 },
      { name: '直播课程', value: 287 },
      { name: '混合课程', value: 245 }
    ]
  }
}

export {
  trendData,
  courseData,
  rankData,
  mapData,
  pieData,
  tableData
}