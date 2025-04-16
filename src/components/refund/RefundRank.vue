<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <div class="rank-type">
        <div 
          v-for="(item, index) in rankTypes" 
          :key="index"
          :class="['rank-type-item', currentType === item.type ? 'active' : '']"
          @click="handleRankTypeClick(item.type)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="refund_rank"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'

export default {
  name: "RefundRank",
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
      rankData: [],
      rankTitle: '',
      rankTypes: [
        { type: 'course', text: '课程排名' },
        { type: 'teacher', text: '讲师排名' }
      ],
      currentType: 'course',
      titleFontSize: 0,
      innerTitle: '退款排行榜',
      colorList: [
        { start: '#59DAB9', end: '#59DAB9' },
        { start: '#65C6E7', end: '#65C6E7' },
        { start: '#7594FF', end: '#7594FF' },
        { start: '#F0A54A', end: '#F0A54A' },
        { start: '#EB7293', end: '#EB7293' }
      ]
    }
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('refundRankData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    this.screenAdapter()
    
    if (this.allData) {
      this.updateChart()
    } else {
      this.requestData()
    }
    
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('refundRankData')
    }
    this.chartInstance && this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.refund_rank, this.theme)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          padding: [10, 15],
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0,
          formatter: (params) => {
            const data = params[0]
            return `${data.name}<br/>${data.marker} 退款金额: ${data.value} 元`
          }
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: getThemeValue(this.theme).lineColor
            }
          },
          axisLabel: {
            color: getThemeValue(this.theme).textColor,
            formatter: (value) => {
              if (value >= 10000) {
                return (value / 10000).toFixed(1) + 'w'
              }
              return value
            }
          },
          splitLine: {
            lineStyle: {
              color: getThemeValue(this.theme).splitLineColor
            }
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true,
            length: 0
          },
          axisLine: {
            lineStyle: {
              color: getThemeValue(this.theme).lineColor
            }
          },
          axisLabel: {
            color: getThemeValue(this.theme).textColor,
            formatter: (value, index) => {
              const rankNum = index + 1
              let prefix = `${rankNum}. `
              if (value.length > 12) {
                return prefix + value.substring(0, 10) + '...'
              }
              return prefix + value
            }
          }
        },
        series: [
          {
            name: '退款金额',
            type: 'bar',
            data: [],
            barWidth: '45%',
            itemStyle: {
              color: (params) => {
                return this.colorList[params.dataIndex % this.colorList.length].start
              },
              borderRadius: [0, 4, 4, 0]
            },
            label: {
              show: true,
              position: 'right',
              color: getThemeValue(this.theme).textColor,
              formatter: (params) => {
                if (params.value >= 10000) {
                  return (params.value / 10000).toFixed(1) + 'w'
                }
                return params.value
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(option)
    },
    requestData() {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundRankData',
        chartName: 'refundRank',
        value: this.currentType
      })
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData) return
      
      const currentData = this.allData[this.currentType]
      if (!currentData || !currentData.data) return
      
      console.log('当前排行数据：', currentData)
      
      const names = currentData.data.map(item => item.name)
      const values = currentData.data.map(item => item.value)
      
      const option = {
        grid: {
          top: '15%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: names,
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        series: [
          {
            name: '退款数量',
            type: 'bar',
            data: values.map((value, index) => ({
              value,
              itemStyle: {
                color: this.colorList[index % this.colorList.length].start
              }
            })),
            barWidth: '45%',
            label: {
              show: true,
              position: 'right',
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    handleRankTypeClick(type) {
      this.currentType = type
      if (!this.allData) {
        this.requestData()
      } else {
        this.updateChart()
      }
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.refund_rank.offsetWidth / 100 * 3.6
      
      const adaptOption = {
        grid: {
          left: this.titleFontSize,
          right: this.titleFontSize,
          bottom: this.titleFontSize,
          top: this.titleFontSize * 1.5
        },
        xAxis: {
          axisLabel: {
            fontSize: this.titleFontSize / 1.8
          }
        },
        yAxis: {
          axisLabel: {
            fontSize: this.titleFontSize / 1.8
          }
        },
        series: [
          {
            label: {
              fontSize: this.titleFontSize / 1.8
            }
          }
        ]
      }
      
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    }
  },
  computed: {
    showTitle() {
      return this.innerTitle
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.updateChart()
      this.screenAdapter()
    }
  }
}
</script>

<style lang="scss" scoped>
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(6, 30, 65, 0.6), rgba(6, 30, 65, 0.8));
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 40px);
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
}

.rank-type {
  display: flex;
  margin-right: 20px;
  
  .rank-type-item {
    padding: 2px 10px;
    margin: 0 5px;
    font-size: 0.8em;
    border-radius: 15px;
    background: rgba(61, 85, 125, 0.4);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(61, 85, 125, 0.7);
      color: #fff;
    }
    
    &.active {
      background: rgba(0, 152, 217, 0.4);
      color: #fff;
      box-shadow: 0 0 10px rgba(0, 152, 217, 0.3);
    }
  }
}

.com-chart {
  width: 100%;
  height: 100%;
}
</style> 