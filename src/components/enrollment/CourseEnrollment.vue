<template>
  <div class="chart-container">
    <div class="chart-title">课程报名分布</div>
    <div class="chart-content" ref="chartRef"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

export default {
  name: 'CourseEnrollment',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chart = null

    const initChart = () => {
      if (!chartRef.value) return
      
      chart = echarts.init(chartRef.value)
      updateChart()
    }

    const updateChart = () => {
      if (!chart || !props.data) return

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '课程报名',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
                color: '#fff'
              }
            },
            labelLine: {
              show: false
            },
            data: props.data.categories?.map((name, index) => ({
              name,
              value: props.data.data[index]
            })) || []
          }
        ]
      }

      chart.setOption(option)
    }

    const screenUpdate = () => {
      if (chart) {
        chart.resize()
      }
    }

    watch(() => props.data, () => {
      updateChart()
    }, { deep: true })

    onMounted(() => {
      initChart()
      window.addEventListener('resize', screenUpdate)
    })

    return {
      chartRef,
      screenUpdate
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  .chart-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #fff;
    text-align: center;
  }

  .chart-content {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
