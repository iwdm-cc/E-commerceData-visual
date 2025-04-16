// 报名趋势数据
export const trendData = {
  xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  series: [
    {
      name: '报名人数',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 220, 180, 200]
    },
    {
      name: '完成人数',
      type: 'line',
      data: [100, 120, 90, 120, 80, 200, 180, 160, 170, 200, 160, 180]
    }
  ]
}

// 课程报名数据
export const courseData = {
  categories: ['前端开发', '后端开发', '移动开发', '人工智能', '大数据', 'UI设计'],
  data: [120, 200, 150, 80, 70, 110]
}

// 报名排名数据
export const rankData = {
  type: [
    { key: 'rank1', text: '综合排名' },
    { key: 'rank2', text: '前端课程排名' },
    { key: 'rank3', text: '后端课程排名' }
  ],
  rank1: {
    title: '课程综合排名',
    yData: ['Vue.js高级开发', 'React全栈开发', 'Node.js实战', 'Python数据分析', 'Java企业级开发'],
    seriesData: [1200, 1000, 800, 700, 600]
  },
  rank2: {
    title: '前端课程排名',
    yData: ['Vue.js高级开发', 'React全栈开发', 'Angular实战', 'React Native入门', 'TypeScript高级'],
    seriesData: [900, 850, 750, 650, 600]
  },
  rank3: {
    title: '后端课程排名',
    yData: ['Node.js实战', 'Java企业级开发', 'Python Web开发', 'Go语言入门', 'PHP框架开发'],
    seriesData: [800, 750, 720, 650, 550]
  }
}

// 饼图数据
export const pieData = [
  { value: 40, name: '18-24岁' },
  { value: 30, name: '25-30岁' },
  { value: 20, name: '31-35岁' },
  { value: 10, name: '36岁以上' }
]

// 表格数据
export const tableData = [
  { id: 1, course: 'Vue.js高级开发', teacher: '张老师', students: 120, completion: 90 },
  { id: 2, course: 'React全栈开发', teacher: '李老师', students: 100, completion: 85 },
  { id: 3, course: 'Node.js实战', teacher: '王老师', students: 80, completion: 75 },
  { id: 4, course: 'Python数据分析', teacher: '赵老师', students: 90, completion: 80 },
  { id: 5, course: 'Java企业级开发', teacher: '刘老师', students: 110, completion: 95 }
] 