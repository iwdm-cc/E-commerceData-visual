// 营收趋势数据
export const revenueTrendData = {
  common: {
    month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  type: [
    {
      key: 'monthly',
      text: '月度营收'
    },
    {
      key: 'quarterly',
      text: '季度营收'
    },
    {
      key: 'yearly',
      text: '年度营收'
    }
  ],
  monthly: {
    title: '月度营收趋势',
    data: [
      {
        name: '就业课',
        data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 220, 210, 240]
      },
      {
        name: '技能提升课',
        data: [220, 182, 191, 234, 290, 330, 310, 280, 290, 320, 310, 340]
      },
      {
        name: '零基础入门课',
        data: [150, 232, 201, 154, 190, 330, 410, 380, 390, 420, 410, 440]
      }
    ]
  },
  quarterly: {
    title: '季度营收趋势',
    data: [
      {
        name: '就业课',
        data: [353, 530, 620]
      },
      {
        name: '技能提升课',
        data: [593, 920, 920]
      },
      {
        name: '零基础入门课',
        data: [583, 1140, 1240]
      }
    ]
  },
  yearly: {
    title: '年度营收趋势',
    data: [
      {
        name: '就业课',
        data: [1503, 1803, 2103, 2403]
      },
      {
        name: '技能提升课',
        data: [2433, 2733, 3033, 3333]
      },
      {
        name: '零基础入门课',
        data: [2963, 3263, 3563, 3863]
      }
    ]
  }
}

// 营收地图数据
export const revenueMapData = {
  type: [
    {
      key: 'province',
      text: '省份分布'
    },
    {
      key: 'city',
      text: '城市分布'
    }
  ],
  province: {
    title: '各省份营收分布',
    data: [
      { name: '北京', value: 1000 },
      { name: '上海', value: 800 },
      { name: '广东', value: 900 },
      { name: '江苏', value: 700 },
      { name: '浙江', value: 600 },
      { name: '四川', value: 500 },
      { name: '湖北', value: 400 },
      { name: '湖南', value: 300 },
      { name: '河南', value: 200 },
      { name: '河北', value: 100 }
    ]
  },
  city: {
    title: '各城市营收分布',
    data: [
      { name: '北京', value: 1000 },
      { name: '上海', value: 800 },
      { name: '广州', value: 700 },
      { name: '深圳', value: 600 },
      { name: '杭州', value: 500 },
      { name: '成都', value: 400 },
      { name: '武汉', value: 300 },
      { name: '长沙', value: 200 },
      { name: '郑州', value: 100 },
      { name: '石家庄', value: 50 }
    ]
  }
}

// 营收排名数据
export const revenueRankData = {
  type: [
    {
      key: 'course',
      text: '课程排名'
    },
    {
      key: 'teacher',
      text: '讲师排名'
    },
    {
      key: 'student',
      text: '学员排名'
    }
  ],
  course: {
    title: '课程营收排名',
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
    title: '讲师营收排名',
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
  },
  student: {
    title: '学员消费排名',
    data: [
      { name: '张三', value: 10 },
      { name: '李四', value: 9 },
      { name: '王五', value: 8 },
      { name: '赵六', value: 7 },
      { name: '刘七', value: 6 },
      { name: '陈八', value: 5 },
      { name: '杨九', value: 4 },
      { name: '黄十', value: 3 },
      { name: '周十一', value: 2 },
      { name: '吴十二', value: 1 }
    ]
  }
}

// 营收饼图数据
export const revenuePieData = {
  type: [
    {
      key: 'category',
      text: '课程类别'
    },
    {
      key: 'payment',
      text: '支付方式'
    },
    {
      key: 'channel',
      text: '营销渠道'
    }
  ],
  category: {
    title: '课程类别营收占比',
    data: [
      { value: 1048, name: '就业课' },
      { value: 735, name: '技能提升课' },
      { value: 580, name: '零基础入门课' },
      { value: 484, name: '职业规划课' },
      { value: 300, name: '其他课程' }
    ]
  },
  payment: {
    title: '支付方式占比',
    data: [
      { value: 1048, name: '支付宝' },
      { value: 735, name: '微信支付' },
      { value: 580, name: '银行卡' },
      { value: 484, name: '花呗分期' },
      { value: 300, name: '其他方式' }
    ]
  },
  channel: {
    title: '营销渠道占比',
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '社交媒体' },
      { value: 580, name: '推荐' },
      { value: 484, name: '广告' },
      { value: 300, name: '其他渠道' }
    ]
  }
}

// 营收表格数据
export const revenueTableData = {
  type: [
    {
      key: 'detail',
      text: '详细数据'
    },
    {
      key: 'summary',
      text: '汇总数据'
    }
  ],
  detail: {
    title: '营收详细数据',
    data: [
      { name: '1月', value: 1000 },
      { name: '2月', value: 900 },
      { name: '3月', value: 800 },
      { name: '4月', value: 700 },
      { name: '5月', value: 600 },
      { name: '6月', value: 500 },
      { name: '7月', value: 400 },
      { name: '8月', value: 300 },
      { name: '9月', value: 200 },
      { name: '10月', value: 100 }
    ]
  },
  summary: {
    title: '营收汇总数据',
    data: [
      { name: '第一季度', value: 2700 },
      { name: '第二季度', value: 1800 },
      { name: '第三季度', value: 900 },
      { name: '第四季度', value: 100 }
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