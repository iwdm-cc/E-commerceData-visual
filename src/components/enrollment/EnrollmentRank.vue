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
    <div class="com-chart" ref="enrollmentRank"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "EnrollmentRank",
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
      choiceType: 'rank1',
      titleFontSize: 0
    }
  },
  created(){
    // 如果有props.data，直接使用props.data，否则从socket获取数据
    if(Object.keys(this.data || {}).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('enrollmentRankData',this.getData)
    }
  },
  mounted() {
    this.initChart()
    
    // 如果已经有数据则直接更新图表
    if(this.allData) {
      this.updateChart()
    } else {
      // 否则通过socket请求数据
      this.$socket.send({
        action:'getData',
        socketType:'enrollmentRankData',
        chartName:'enrollmentRank',
        value:''
      })
    }
    
    window.addEventListener('resize', this.screenUpdate)
    this.screenUpdate()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenUpdate)
    if(!this.data) {
      this.$socket.unRegisterCallBack('enrollmentRankData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.enrollmentRank, this.theme)
      const initOption = {
        title: {
          text: '课程报名排名',
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
            type: 'shadow'
          },
          formatter: '{b}: {c} 人'
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            formatter: '{value} 人',
            color: getThemeValue(this.theme).titleColor
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: getThemeValue(this.theme).titleColor
            }
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          inverse: true,
          axisLabel: {
            color: getThemeValue(this.theme).titleColor
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: getThemeValue(this.theme).titleColor
            }
          }
        },
        series: [
          {
            name: '报名人数',
            type: 'bar',
            data: [],
            itemStyle: {
              borderRadius: [0, 10, 10, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#0056b3' }
              ])
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{c} 人',
              color: '#fff',
              textBorderColor: 'rgba(0,0,0,0.3)',
              textBorderWidth: 2
            },
            emphasis: {
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#5eaefe' },
                  { offset: 0.7, color: '#2196f3' },
                  { offset: 1, color: '#1976d2' }
                ])
              }
            },
            barWidth: '60%',
            animationDuration: 1500,
            animationDelay: function(idx) {
              return idx * 200;
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
      // 处理无数据情况
      if (!this.allData || !this.allData[this.choiceType]) {
        console.warn('EnrollmentRank: 没有数据或数据格式不正确', this.allData)
        
        // 使用默认数据展示
        const defaultData = {
          yData: ['Vue.js高级开发', 'React全栈开发', 'Node.js实战', 'Python数据分析', 'Java企业级开发'],
          seriesData: [1200, 1000, 800, 700, 600]
        }
        
        const dataOption = {
          yAxis: {
            data: defaultData.yData
          },
          series: [
            {
              data: defaultData.seriesData
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
        return
      }
      
      const dataOption = {
        yAxis: {
          data: this.allData[this.choiceType].yData
        },
        series: [
          {
            data: this.allData[this.choiceType].seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.enrollmentRank.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            barWidth: this.$refs.enrollmentRank.offsetWidth / 60 + '%'
          }
        ]
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
        return '课程排名'
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
