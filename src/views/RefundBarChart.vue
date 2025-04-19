<template>
  <div ref="barChart" style="width: 100%; height: 600px"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'RefundBarChart',
  props: ['courseRank'],
  mounted() {
    this.chart = echarts.init(this.$refs.barChart)
    this.updateChart()
  },
  watch: {
    courseRank() {
      this.updateChart()
    }
  },
  methods: {
    updateChart() {
      const sortedCourses = Object.entries(this.courseRank).sort((a, b) => b[1] - a[1])
      const categories = sortedCourses.map(item => item[0])
      const values = sortedCourses.map(item => item[1])

      this.chart.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '实时退课课程排行',
          left: 'left',
          textStyle: {
            color: '#ffffff',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisTick: { alignWithLabel: true },
          axisLine: { lineStyle: { color: '#888' } },
          axisLabel: { color: '#666' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#888' } },
          axisLabel: { color: '#666' },
          splitLine: {
            lineStyle: { type: 'dashed', color: '#ddd' }
          }
        },
        series: [{
          name: '退课次数',
          type: 'bar',
          barWidth: '60%',
          data: values,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#5470C6' },
              { offset: 1, color: '#91CC75' }
            ]),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#91cc75' },
                { offset: 1, color: '#fac858' }
              ])
            }
          }
        }]
      })
    }
  }
}
</script>
