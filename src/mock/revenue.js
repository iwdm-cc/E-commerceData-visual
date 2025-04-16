// 营收趋势数据
export const revenueTrendData = {
  common: {
    month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  type: [
    { key: 'monthly', text: '月度营收' },
    { key: 'quarterly', text: '季度营收' },
    { key: 'yearly', text: '年度营收' }
  ],
  monthly: {
    title: '月度营收趋势',
    data: [
      {
        name: '就业课',
        data: [320, 332, 301, 334, 390, 330, 320, 380, 390, 420, 410, 440]
      },
      {
        name: '技能提升课',
        data: [220, 182, 191, 234, 290, 330, 310, 280, 290, 320, 310, 340]
      },
      {
        name: '零基础课',
        data: [150, 232, 201, 154, 190, 330, 410, 380, 390, 420, 410, 440]
      }
    ]
  },
  quarterly: {
    title: '季度营收趋势',
    data: [
      {
        name: '就业课',
        data: [953, 1050, 1090, 1270]
      },
      {
        name: '技能提升课',
        data: [593, 854, 880, 970]
      },
      {
        name: '零基础课',
        data: [583, 674, 1180, 1270]
      }
    ]
  },
  yearly: {
    title: '年度营收趋势',
    data: [
      {
        name: '就业课',
        data: [4363, 5103, 5803, 6403]
      },
      {
        name: '技能提升课',
        data: [3297, 3733, 4233, 4733]
      },
      {
        name: '零基础课',
        data: [2963, 3663, 4363, 4863]
      }
    ]
  }
}

// 营收地图数据
export const revenueMapData = {
  type: [
    { key: 'province', text: '省份分布' },
    { key: 'city', text: '城市分布' }
  ],
  province: {
    title: '各省份营收分布',
    data: [
      { name: '北京', value: 2800 },
      { name: '上海', value: 2600 },
      { name: '广东', value: 2400 },
      { name: '江苏', value: 2200 },
      { name: '浙江', value: 2000 },
      { name: '四川', value: 1800 },
      { name: '湖北', value: 1600 },
      { name: '湖南', value: 1400 },
      { name: '河南', value: 1200 },
      { name: '河北', value: 1000 }
    ]
  },
  city: {
    title: '各城市营收分布',
    data: [
      { name: '北京', value: 2800 },
      { name: '上海', value: 2600 },
      { name: '广州', value: 2200 },
      { name: '深圳', value: 2000 },
      { name: '杭州', value: 1800 },
      { name: '成都', value: 1600 },
      { name: '武汉', value: 1400 },
      { name: '长沙', value: 1200 },
      { name: '郑州', value: 1000 },
      { name: '西安', value: 800 }
    ]
  }
}

// 营收排名数据
export const revenueRankData = {
  type: [
    { key: 'course', text: '课程排名' },
    { key: 'teacher', text: '讲师排名' }
  ],
  course: {
    title: '课程营收排名',
    data: [
      { name: 'Java就业班', value: 2800, percent: 28 },
      { name: 'Python就业班', value: 2400, percent: 24 },
      { name: '前端就业班', value: 2000, percent: 20 },
      { name: '大数据就业班', value: 1600, percent: 16 },
      { name: 'AI就业班', value: 1200, percent: 12 }
    ]
  },
  teacher: {
    title: '讲师营收排名',
    data: [
      { name: '张明', value: 1800, percent: 25, course: 'Java就业班' },
      { name: '李强', value: 1500, percent: 21, course: 'Python就业班' },
      { name: '王伟', value: 1200, percent: 17, course: '前端就业班' },
      { name: '赵阳', value: 1000, percent: 14, course: '大数据就业班' },
      { name: '刘洋', value: 800, percent: 11, course: 'AI就业班' }
    ]
  }
}

// 营收分布数据
export const revenuePieData = {
  type: [
    { key: 'category', text: '课程类别' },
    { key: 'payment', text: '支付方式' },
    { key: 'channel', text: '营销渠道' }
  ],
  category: {
    title: '课程类别营收占比',
    data: [
      { value: 4800, name: '就业课', percent: 45 },
      { value: 3200, name: '技能提升课', percent: 30 },
      { value: 2700, name: '零基础课', percent: 25 }
    ]
  },
  payment: {
    title: '支付方式占比',
    data: [
      { value: 5500, name: '支付宝', percent: 52 },
      { value: 3800, name: '微信支付', percent: 36 },
      { value: 1300, name: '其他方式', percent: 12 }
    ]
  },
  channel: {
    title: '营销渠道占比',
    data: [
      { value: 4200, name: '官网直销', percent: 40 },
      { value: 3150, name: '渠道合作', percent: 30 },
      { value: 2100, name: '社交媒体', percent: 20 },
      { value: 1050, name: '其他渠道', percent: 10 }
    ]
  }
}

// 营收明细数据
export const revenueTableData = {
  type: [
    { key: 'detail', text: '详细数据' },
    { key: 'summary', text: '汇总数据' }
  ],
  detail: {
    title: '营收详细数据',
    columns: [
      { key: 'date', title: '日期' },
      { key: 'course', title: '课程名称' },
      { key: 'amount', title: '营收金额' },
      { key: 'count', title: '订单数量' },
      { key: 'channel', title: '销售渠道' }
    ],
    data: [
      { date: '2024-03-01', course: 'Java就业班', amount: 299800, count: 23, channel: '官网直销' },
      { date: '2024-03-01', course: 'Python就业班', amount: 258600, count: 19, channel: '渠道合作' },
      { date: '2024-03-02', course: '前端就业班', amount: 226800, count: 18, channel: '社交媒体' },
      { date: '2024-03-02', course: '大数据就业班', amount: 198000, count: 15, channel: '官网直销' },
      { date: '2024-03-03', course: 'AI就业班', amount: 178200, count: 13, channel: '渠道合作' }
    ]
  },
  summary: {
    title: '营收汇总数据',
    columns: [
      { key: 'category', title: '课程类别' },
      { key: 'total_amount', title: '总营收' },
      { key: 'total_count', title: '总订单' },
      { key: 'avg_amount', title: '客单价' }
    ],
    data: [
      { category: '就业课', total_amount: 4800000, total_count: 360, avg_amount: 13333 },
      { category: '技能提升课', total_amount: 3200000, total_count: 320, avg_amount: 10000 },
      { category: '零基础课', total_amount: 2700000, total_count: 450, avg_amount: 6000 }
    ]
  }
}

// 课程营收数据
export const courseRevenueData = {
  type: [
    {
      key: 'course',
      text: '课程营收'
    },
    {
      key: 'teacher',
      text: '讲师营收'
    }
  ],
  course: {
    title: '各课程营收情况',
    data: [
      { name: 'Java就业班', value: 1000 },
      { name: 'Python就业班', value: 900 },
      { name: '前端就业班', value: 800 },
      { name: '大数据就业班', value: 700 },
      { name: '人工智能就业班', value: 600 },
      { name: 'UI设计就业班', value: 500 },
      { name: '软件测试就业班', value: 400 },
      { name: '产品经理就业班', value: 300 },
      { name: '新媒体运营就业班', value: 200 },
      { name: '电商运营就业班', value: 100 }
    ]
  },
  teacher: {
    title: '各讲师营收情况',
    data: [
      { name: '张老师', value: 1000 },
      { name: '李老师', value: 900 },
      { name: '王老师', value: 800 },
      { name: '赵老师', value: 700 },
      { name: '刘老师', value: 600 },
      { name: '陈老师', value: 500 },
      { name: '杨老师', value: 400 },
      { name: '黄老师', value: 300 },
      { name: '周老师', value: 200 },
      { name: '吴老师', value: 100 }
    ]
  }
} 