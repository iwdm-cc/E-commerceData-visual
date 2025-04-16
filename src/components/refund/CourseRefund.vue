<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="category">
        <div 
          class="category-item" 
          v-for="item in typeOptions" 
          :key="item.key"
          :class="{ active: currentType === item.key }"
          @click="handleSelect(item.key)"
        >{{ item.text }}</div>
      </span>
    </div>
    <div class="com-chart" ref="CourseRefund"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'

export default {
  name: "CourseRefund",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentType: 'month',
      titleFontSize: 0,
      colorList: [
        {
          start: '#FC6E97',
          end: '#FAA0B9'
        },
        {
          start: '#9A86F9',
          end: '#C5B8FB'
        },
        {
          start: '#5ED1FF',
          end: '#8FE0FF'
        },
        {
          start: '#FEB665',
          end: '#FED19F'
        },
        {
          start: '#6AE7C7',
          end: '#9FF0DA'
        }
      ]
    }
  },
  computed: {
    showTitle() {
      if (!this.allData) return "退款原因";
      return this.allData.title;
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize / 1.15 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    typeOptions() {
      if (!this.allData) {
        return [
          { key: 'month', text: '月度' },
          { key: 'quarter', text: '季度' },
          { key: 'year', text: '年度' }
        ]
      } else {
        return this.allData.type || [
          { key: 'month', text: '月度' },
          { key: 'quarter', text: '季度' },
          { key: 'year', text: '年度' }
        ]
      }
    },
    ...mapState(['theme'])
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('courseRefundData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    if (this.allData) {
      this.updateChart()
    } else {
      this.$socket.send({
        action: 'getData',
        socketType: 'courseRefundData',
        chartName: 'courseRefund',
        value: ''
      })
    }
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('courseRefundData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.CourseRefund, this.theme)
      
      const initOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            const dataItem = params[0]
            return `${dataItem.name}<br/>${dataItem.marker}${dataItem.value}人`
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderWidth: 0
        },
        grid: {
          top: '25%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        series: [
          {
            name: '退款原因',
            type: 'bar',
            barWidth: '45%',
            data: [],
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      this.chartInstance.setOption(initOption)
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData) return
      
      const currentData = this.allData[this.currentType]
      if (!currentData || !currentData.data) return
      
      console.log('当前课程退款数据：', currentData)
      
      const names = currentData.data.map(item => item.name)
      const values = currentData.data.map(item => item.value)
      
      const dataOption = {
        xAxis: {
          data: names,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        series: [
          {
            name: '退款数量',
            data: values.map((value, index) => ({
              value,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: this.colorList[index % this.colorList.length].start },
                  { offset: 1, color: this.colorList[index % this.colorList.length].end }
                ])
              }
            }))
          }
        ]
      }
      
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.CourseRefund.offsetWidth / 100 * 3.6
      const fontSize = this.titleFontSize / 1.15
      
      const adapterOption = {
        tooltip: {
          textStyle: {
            fontSize: fontSize * 0.8
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: fontSize * 0.8
          }
        },
        yAxis: {
          axisLabel: {
            fontSize: fontSize * 0.8
          }
        }
      }
      
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(type) {
      this.currentType = type
      this.updateChart()
    }
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  }
}
</script>

<style scoped lang="scss">
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(6, 30, 65, 0.6), rgba(6, 30, 65, 0.8));
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.title {
  position: absolute;
  left: 35px;
  top: 20px;
  z-index: 9;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 70px);

  .category {
    display: flex;
    margin-right: 35px;
    
    .category-item {
      padding: 2px 12px;
      margin: 0 3px;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.3s;
      background: rgba(255, 255, 255, 0.1);
      font-size: 0.85em;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      &.active {
        background: rgba(92, 153, 255, 0.5);
        box-shadow: 0 0 10px rgba(92, 153, 255, 0.3);
      }
    }
  }
}

.com-chart {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style> 