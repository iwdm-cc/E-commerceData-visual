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
    <div class="com-chart" ref="RevenueRank"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RevenueRank",
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
      choiceType: 'course',
      titleFontSize: 0
    }
  },
  created() {
    if (Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('revenueRankData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    if (!this.allData) {
      this.$socket.send({
        action: 'getData',
        socketType: 'revenueRankData',
        chartName: 'revenueRank',
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
      this.$socket.unRegisterCallBack('revenueRankData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RevenueRank, this.theme)
      const initOption = {
        title: {
          text: '营收排名',
          left: 'center',
          top: '5%',
          textStyle: {
            color: getThemeValue(this.theme).titleColor
          }
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: getThemeValue(this.theme).titleColor,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: getThemeValue(this.theme).titleColor,
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
      if (!this.allData) {
        return
      }
      const colorArr = [
        '#37a2da',
        '#32c5e9',
        '#9fe6b8',
        '#ffdb5c',
        '#ff9f7f'
      ]
      const valueArr = this.allData[this.choiceType].data
      const dataOption = {
        title: {
          text: this.allData[this.choiceType].title
        },
        dataset: {
          source: valueArr.map(item => [item.name, item.value, item.percent])
        },
        series: [
          {
            type: 'bar',
            encode: {
              x: 0,
              y: 1
            },
            itemStyle: {
              color: (params) => colorArr[params.dataIndex],
              borderRadius: [5, 5, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
                const item = valueArr[params.dataIndex]
                return item.percent ? item.percent + '%' : ''
              },
              color: getThemeValue(this.theme).titleColor
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RevenueRank.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
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
        },
        series: [
          {
            label: {
              fontSize: this.titleFontSize * 0.8
            }
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

<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9;
  font-weight: bold;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
    padding: 5px 0;
    border-radius: 3px;

    .select-item {
      padding: 5px 10px;
      cursor: pointer;
      
      &:hover {
        background-color: #2a2f3c;
      }
    }
  }
}

.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.com-chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style> 