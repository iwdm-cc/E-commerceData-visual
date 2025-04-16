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
    <div class="com-chart" ref="RevenuePie"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RevenuePie",
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
      choiceType: 'category',
      titleFontSize: 0
    }
  },
  created() {
    if (Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('revenuePieData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    if (!this.allData) {
      this.$socket.send({
        action: 'getData',
        socketType: 'revenuePieData',
        chartName: 'revenuePie',
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
      this.$socket.unRegisterCallBack('revenuePieData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RevenuePie, this.theme)
      const initOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}万 ({d}%)'
        },
        legend: {
          top: '15%',
          left: 'center',
          textStyle: {
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
      const colorArr = [
        '#37a2da',
        '#32c5e9',
        '#9fe6b8',
        '#ffdb5c',
        '#ff9f7f',
        '#fb7293',
        '#e7bcf3',
        '#8378ea'
      ]
      const valueArr = this.allData[this.choiceType].data
      const dataOption = {
        title: {
          text: this.allData[this.choiceType].title,
          left: 'center',
          top: '8%',
          textStyle: {
            fontSize: this.titleFontSize,
            color: getThemeValue(this.theme).titleColor
          }
        },
        series: [
          {
            name: this.allData[this.choiceType].title,
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['50%', '60%'],
            data: valueArr,
            label: {
              show: true,
              formatter: '{b}: {d}%',
              color: getThemeValue(this.theme).titleColor
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          }
        ],
        color: colorArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RevenuePie.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            label: {
              fontSize: this.titleFontSize * 0.8
            }
          }
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
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