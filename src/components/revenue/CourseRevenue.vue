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
      <div class="com-chart" ref="CourseRevenue"></div>
    </div>
  </template>
  
  <script>
  import {mapState} from 'vuex'
  import {getThemeValue} from '../../utils/theme_utils'
  
  export default {
    name: "CourseRevenue",
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
        choiceType: 'monthly',
        titleFontSize: 0
      }
    },
    created() {
      if (Object.keys(this.data).length > 0) {
        this.allData = this.data
      } else {
        this.$socket.registerCallBack('courseRevenueData', this.getData)
      }
    },
    mounted() {
      this.initChart()
      if (!this.allData) {
        this.$socket.send({
          action: 'getData',
          socketType: 'courseRevenueData',
          chartName: 'courseRevenue',
          value: ''
        })
      } else {
        this.updateChart()
      }
      window.addEventListener('resize', this.screenUpdate)
      this.screenUpdate()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenUpdate)
      if (!this.data) {
        this.$socket.unRegisterCallBack('courseRevenueData')
      }
    },
    methods: {
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.CourseRevenue, this.theme)
        const initOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            top: '5%',
            textStyle: {
              color: getThemeValue(this.theme).titleColor
            }
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: getThemeValue(this.theme).titleColor,
              rotate: 30
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} 万',
              color: getThemeValue(this.theme).titleColor
            }
          }
        }
        this.chartInstance.setOption(initOption)
      },
      getData(ret) {
        this.allData = ret
        this.updateChart()
      },
      updateChart() {
        if (!this.allData || !this.allData[this.choiceType]) {
          return
        }
        
        const colorList = [
          ['#83bff6', '#188df0'],
          ['#76f2f2', '#188df0'],
          ['#9fe6b8', '#37a2da']
        ]
        
        const currentData = this.allData[this.choiceType].data
        const legendData = currentData.map(item => item.name)
        const xAxisData = currentData.map(item => item.name)
        
        const series = [{
          type: 'bar',
          data: currentData.map(item => item.value),
          itemStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorList[0][0] },
              { offset: 1, color: colorList[0][1] }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorList[0][0] },
                { offset: 1, color: colorList[0][1] }
              ])
            }
          }
        }]
        
        const dataOption = {
          title: {
            text: this.allData[this.choiceType].title,
            left: 'center',
            top: '2%',
            textStyle: {
              fontSize: this.titleFontSize,
              color: getThemeValue(this.theme).titleColor
            }
          },
          xAxis: {
            data: xAxisData
          },
          series
        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate() {
        this.titleFontSize = this.$refs.CourseRevenue.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: this.titleFontSize
            }
          },
          legend: {
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle: {
              fontSize: this.titleFontSize * 0.8
            }
          },
          xAxis: {
            axisLabel: {
              fontSize: this.titleFontSize * 0.8
            }
          },
          yAxis: {
            axisLabel: {
              fontSize: this.titleFontSize * 0.8
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
        if (!this.allData) {
          return []
        } else {
          return this.allData.type.filter(item => {
            return item.key !== this.choiceType
          })
        }
      },
      showTitle() {
        if (!this.allData) {
          return ''
        } else {
          return this.allData[this.choiceType].title
        }
      },
      comStyle() {
        return {
          fontSize: this.titleFontSize / 1.15 + 'px',
          color: getThemeValue(this.theme).titleColor
        }
      },
      marginStyle() {
        return {marginLeft: this.titleFontSize / 2.5 + 'px'}
      },
      ...mapState(['theme'])
    },
    watch: {
      theme() {
        this.chartInstance.dispose()
        this.initChart()
        this.screenUpdate()
        this.updateChart()
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .title {
    position: absolute;
    left: 35px;
    top: 20px;
    z-index: 9;
    color: white;
    font-weight:bold;
    .title-icon {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con{
      background-color: #222733;
      .select-item {
        cursor: pointer;
      }
    }
  }
  </style>