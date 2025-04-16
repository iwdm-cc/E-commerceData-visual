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
    <div class="com-chart" ref="RevenueTrend"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RevenueTrend",
  data() {
    return {
      chartInstance: null,
      allData: null,
      ifShowChoice: false,
      choiceType: 'monthly', //显示的数据类型
      titleFontSize: 0,
    }
  },
  created(){
    this.$socket.registerCallBack('revenueTrendData',this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action:'getData',
      socketType:'revenueTrendData',
      chartName:'revenueTrend',
      value:''
    })
    window.addEventListener('resize', this.screenUpdate)
    this.screenUpdate()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenUpdate)
    this.$socket.unRegisterCallBack('revenueTrendData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RevenueTrend, this.theme)
      const initOption = {
        grid: {
          top: '27%',
          bottom: '7%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: '10%',
          top: '17%'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 万'
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
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0, color: colorArr1[index]
            }, {
              offset: 1, color: colorArr2[index]
            }]),
          },
        }
      })
      const legendArr = valueArr.map((item) => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr,
          boundaryGap: false,
        },
        legend: {
          data: legendArr,
          top:'15%'
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RevenueTrend.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize/1.5
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
        return []
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