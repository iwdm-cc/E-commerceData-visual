<template>
  <div ref="lineChart" style="width: 100%; height: 600px"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'RefundLineChart',
  props: ['timestamps', 'amounts'],
  mounted() {
    this.chart = echarts.init(this.$refs.lineChart)
    this.updateChart()
  },
  watch: {
    timestamps() {
      this.updateChart()
    },
    amounts() {
      this.updateChart()
    }
  },
  methods: {
    updateChart() {
      this.chart.setOption({
        title: {
          text: '实时退费金额趋势图',
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.timestamps,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: { color: '#666' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: { color: '#666' },
          splitLine: {
            lineStyle: { type: 'dashed', color: '#eee' }
          }
        },
        series: [{
          name: '退费金额',
          type: 'line',
          data: this.amounts,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#3ba272'
          },
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#3ba272' },
              { offset: 1, color: '#6be6c1' }
            ])
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59,162,114,0.4)' },
              { offset: 1, color: 'rgba(59,162,114,0.05)' }
            ])
          },
          emphasis: {
            itemStyle: {
              borderColor: '#3ba272',
              borderWidth: 2
            }
          }
        }]
      })
    }
  }
}
</script>
