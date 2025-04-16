<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + title }}</span>
      <div class="time-type">
        <div 
          v-for="(item, index) in timeTypeList" 
          :key="index"
          :class="['time-type-item', activeTimeType === item.name ? 'active' : '']"
          @click="changeTimeType(item.name)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_chart"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'

export default {
  name: "RefundTrend",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      allData: {},
      timeTypeList: [
        { name: '近一周', key: '近一周' },
        { name: '近一月', key: '近一月' },
        { name: '近三月', key: '近三月' },
        { name: '近一年', key: '近一年' }
      ],
      activeTimeType: '近一周',
      chartInstance: null,
      loading: false,
      titleFontSize: 0,
      title: '退款申请趋势',
      seriesColors: [
        ['#FC6E97', '#FFCBD0'], // 金额
        ['#74E0C0', '#C4F5E9']  // 数量
      ]
    }
  },
  computed: {
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  created() {
    if(this.data && Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('refundTrendData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    this.screenAdapter()
    
    if(this.allData) {
      this.updateChart()
    } else {
      this.requestData()
    }
    
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if(!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('refundTrendData')
    }
    this.chartInstance && this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_chart, this.theme)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [10, 15],
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          },
          formatter: params => {
            let result = params[0].axisValue + '<br>'
            params.forEach(item => {
              let seriesName = item.seriesName
              let color = item.color
              let value = item.value
              if (seriesName.includes('金额')) {
                result += `${item.marker} ${seriesName}: ${value} 元<br>`
              } else {
                result += `${item.marker} ${seriesName}: ${value} 人<br>`
              }
            })
            return result
          }
        },
        grid: {
          top: '25%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          top: '10%',
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: getThemeValue(this.theme).textColor
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: getThemeValue(this.theme).lineColor
            }
          },
          axisLabel: {
            color: getThemeValue(this.theme).textColor,
            rotate: this.activeTimeType === 'year' ? 45 : 0,
            margin: 14
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            nameTextStyle: {
              color: getThemeValue(this.theme).textColor
            },
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.seriesColors[0][0]
              }
            },
            axisLabel: {
              color: getThemeValue(this.theme).textColor,
              formatter: value => value + ' 元'
            },
            splitLine: {
              lineStyle: {
                color: getThemeValue(this.theme).splitLineColor
              }
            }
          },
          {
            type: 'value',
            name: '数量',
            nameTextStyle: {
              color: getThemeValue(this.theme).textColor
            },
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.seriesColors[1][0]
              }
            },
            axisLabel: {
              color: getThemeValue(this.theme).textColor,
              formatter: value => value + ' 人'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '退款金额',
            type: 'bar',
            yAxisIndex: 0,
            data: [],
            barWidth: '25%',
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.seriesColors[0][0] },
                { offset: 1, color: this.seriesColors[0][1] }
              ]),
              borderRadius: [4, 4, 0, 0]
            }
          },
          {
            name: '退款数量',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            smooth: true,
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: this.seriesColors[1][0]
            },
            itemStyle: {
              color: this.seriesColors[1][0]
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.seriesColors[1][0] + 'AA' },
                { offset: 1, color: this.seriesColors[1][1] + '10' }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(option)
      
      // 图表点击事件
      this.chartInstance.on('click', params => {
        // 可以在这里处理图表点击事件
        console.log('点击了图表项：', params)
      })
    },
    requestData() {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundTrendData',
        chartName: 'refundTrend',
        value: this.activeTimeType
      })
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.chartInstance || !this.allData) return
      
      // 根据当前选择的时间类型获取对应的数据
      const currentData = this.allData[this.activeTimeType] || []
      console.log('当前趋势数据：', currentData)
      
      const option = {
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: currentData.map(item => item.date)
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.seriesColors[0][0]
              }
            },
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '数量',
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: this.seriesColors[1][0]
              }
            },
            axisLabel: {
              formatter: '{value} 人'
            }
          }
        ],
        series: [
          {
            name: '退款金额',
            type: 'bar',
            yAxisIndex: 0,
            data: currentData.map(item => item.amount),
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.seriesColors[0][0] },
                { offset: 1, color: this.seriesColors[0][1] }
              ])
            }
          },
          {
            name: '退款数量',
            type: 'line',
            yAxisIndex: 1,
            data: currentData.map(item => item.value),
            smooth: true,
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: this.seriesColors[1][0]
            },
            itemStyle: {
              color: this.seriesColors[1][0]
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.seriesColors[1][0] + 'AA' },
                { offset: 1, color: this.seriesColors[1][1] + '10' }
              ])
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    changeTimeType(type) {
      this.activeTimeType = type
      if (!this.allData) {
        this.requestData()
      } else {
        this.updateChart()
      }
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.trend_chart.offsetWidth / 100 * 3.6
      
      const adaptOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 3,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        },
        xAxis: {
          axisLabel: {
            fontSize: this.titleFontSize / 1.6
          }
        },
        yAxis: [
          {
            nameTextStyle: {
              fontSize: this.titleFontSize / 1.6
            },
            axisLabel: {
              fontSize: this.titleFontSize / 1.6
            }
          },
          {
            nameTextStyle: {
              fontSize: this.titleFontSize / 1.6
            },
            axisLabel: {
              fontSize: this.titleFontSize / 1.6
            }
          }
        ]
      }
      
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    }
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

.time-type {
  display: flex;
  margin-right: 20px;
  
  .time-type-item {
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
