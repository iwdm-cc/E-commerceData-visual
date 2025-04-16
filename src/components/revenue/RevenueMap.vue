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
    <div class="com-chart" ref="RevenueMap"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'
import axios from 'axios'

export default {
  name: "RevenueMap",
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
      mapData: null,
      ifShowChoice: false,
      choiceType: 'province',
      titleFontSize: 0
    }
  },
  created() {
    if (Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('revenueMapData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    this.getMapData()
    if (!this.allData) {
      this.$socket.send({
        action: 'getData',
        socketType: 'revenueMapData',
        chartName: 'revenueMap',
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
      this.$socket.unRegisterCallBack('revenueMapData')
    }
  },
  methods: {
    async getMapData() {
      const { data: ret } = await axios.get('http://localhost:9998/static/map/china.json')
      this.mapData = ret
      this.$echarts.registerMap('china', ret)
      this.updateChart()
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RevenueMap, this.theme)
      const initOption = {
        title: {
          text: '营收地图分布',
          left: 'center',
          top: '5%',
          textStyle: {
            color: getThemeValue(this.theme).titleColor
          }
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: 'right',
          top: 'center',
          orient: 'vertical',
          textStyle: {
            color: getThemeValue(this.theme).titleColor
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}万'
        },
        visualMap: {
          min: 0,
          max: 3000,
          left: '20',
          bottom: '20',
          calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
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
      if (!this.allData || !this.mapData) {
        return
      }
      const dataOption = {
        series: [
          {
            type: 'map',
            map: 'china',
            data: this.allData[this.choiceType].data,
            label: {
              show: true,
              color: '#fff',
              fontSize: this.titleFontSize * 0.6
            },
            itemStyle: {
              areaColor: '#2E72BF',
              borderColor: '#333'
            },
            emphasis: {
              itemStyle: {
                areaColor: '#4499d0'
              },
              label: {
                color: '#fff',
                fontSize: this.titleFontSize * 0.8
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RevenueMap.offsetWidth / 100 * 3.6
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
        visualMap: {
          itemWidth: this.titleFontSize * 0.8,
          itemHeight: this.titleFontSize * 4,
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