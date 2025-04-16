<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎'+ showTitle}}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="ifShowChoice = !ifShowChoice">&#xe6eb</span>
      <div class="select-con" v-show="ifShowChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleChoice(item.key)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="enrollmentTrend"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "EnrollmentTrend",
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
      ifShowChoice: false,
      choiceType: 'trend1',
      titleFontSize: 0
    }
  },
  created(){
    if(Object.keys(this.data || {}).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('enrollmentTrendData',this.getData)
    }
  },
  mounted() {
    this.initChart()
    
    if(this.allData) {
      this.updateChart()
    } else {
      this.$socket.send({
        action:'getData',
        socketType:'enrollmentTrendData',
        chartName:'enrollmentTrend',
        value:''
      })
    }
    
    window.addEventListener('resize', this.screenUpdate)
    this.screenUpdate()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenUpdate)
    if(!this.data) {
      this.$socket.unRegisterCallBack('enrollmentTrendData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.enrollmentTrend, this.theme)
      const initOption = {
        title: {
          text: '报名趋势分析',
          left: 'center',
          top: '5%',
          textStyle: {
            color: getThemeValue(this.theme).titleColor,
            fontSize: 16,
            fontWeight: 600
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            let result = params[0].axisValue + '<br/>'
            params.forEach(item => {
              result += item.marker + item.seriesName + ': ' + item.value + ' 人<br/>'
            })
            return result
          }
        },
        legend: {
          data: ['报名人数', '完成人数'],
          top: '15%',
          textStyle: {
            color: getThemeValue(this.theme).titleColor
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: getThemeValue(this.theme).titleColor,
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: getThemeValue(this.theme).titleColor
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: getThemeValue(this.theme).titleColor,
            formatter: '{value} 人'
          },
          axisLine: {
            lineStyle: {
              color: getThemeValue(this.theme).titleColor
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        series: [
          {
            name: '报名人数',
            type: 'line',
            data: [],
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00c6ff' },
                { offset: 1, color: '#0072ff' }
              ])
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(0,198,255,0.3)',
              shadowBlur: 10,
              shadowOffsetY: 8
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0,198,255,0.3)' },
                { offset: 1, color: 'rgba(0,114,255,0.1)' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: '#00c6ff',
                borderColor: '#fff',
                borderWidth: 2
              }
            }
          },
          {
            name: '完成人数',
            type: 'line',
            data: [],
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff9a9e' },
                { offset: 1, color: '#fad0c4' }
              ])
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(255,154,158,0.3)',
              shadowBlur: 10,
              shadowOffsetY: 8
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255,154,158,0.3)' },
                { offset: 1, color: 'rgba(250,208,196,0.1)' }
              ])
            },
            emphasis: {
              itemStyle: {
                color: '#ff9a9e',
                borderColor: '#fff',
                borderWidth: 2
              }
            }
          }
        ],
        animationDuration: 2000,
        animationEasing: 'cubicInOut'
      }
      this.chartInstance.setOption(initOption)
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData) {
        console.warn('EnrollmentTrend: 没有数据', this.allData)
        return
      }
      
      const dataOption = {
        xAxis: {
          data: this.allData.xAxis
        },
        series: [
          {
            data: this.allData.series[0].data
          },
          {
            data: this.allData.series[1].data
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.enrollmentTrend.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleChoice(type) {
      this.choiceType = type
      this.updateChart()
      this.ifShowChoice = false
    }
  },
  computed: {
    selectTypes() {
      if (!this.allData || !this.allData.type) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData || !this.allData[this.choiceType]) {
        return '报名趋势'
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize /1.15 + 'px' ,
        color:getThemeValue(this.theme).titleColor
      }
    },
    marginStyle(){
      return {marginLeft: this.titleFontSize/2.5 + 'px'}
    },
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.screenUpdate()
      this.updateChart()
    },
    data: {
      handler(newVal) {
        if(newVal && Object.keys(newVal).length > 0) {
          this.allData = newVal
          if(this.chartInstance) {
            this.updateChart()
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, rgba(5,39,103,0.7) 0%, rgba(5,39,103,0.3) 100%);
}

.title {
  position: absolute;
  left: 35px;
  top: 20px;
  z-index: 9;
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  .select-con {
    background-color: rgba(34, 39, 51, 0.9);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    overflow: hidden;
    
    .select-item {
      cursor: pointer;
      padding: 8px 15px;
      transition: all 0.2s;
      
      &:hover {
        background-color: #1976d2;
      }
    }
  }
}

.com-chart {
  flex: 1;
  padding: 60px 20px 20px 20px;
}
</style>