<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="region-total" v-if="regionData.length > 0">
        {{ regionTotal }}人
      </span>
    </div>
    <div class="com-chart" ref="refund_map"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'
import axios from 'axios'

export default {
  name: "RefundMap",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {},
      regionData: [],
      titleFontSize: 0,
      VALUE_RANGES: [
        { min: 0, max: 50, level: 0, label: '0-50人' },
        { min: 51, max: 100, level: 1, label: '51-100人' },
        { min: 101, max: 150, level: 2, label: '101-150人' },
        { min: 151, max: 200, level: 3, label: '151-200人' },
        { min: 201, max: Infinity, level: 4, label: '201人以上' }
      ],
      colorList: [
        { start: '#FEB665', end: '#FED19F', level: 0 },
        { start: '#74E0C0', end: '#A6ECF2', level: 1 },
        { start: '#5ED1FF', end: '#8FE0FF', level: 2 },
        { start: '#9A86F9', end: '#C5B8FB', level: 3 },
        { start: '#FC6E97', end: '#FAA0B9', level: 4 }
      ]
    }
  },
  computed: {
    regionTotal() {
      return this.regionData.reduce((total, item) => {
        return total + item.value
      }, 0)
    },
    showTitle() {
      if (!this.allData) return "退款地区分布";
      return "退款地区分布";
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize / 1.15 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  created() {
    if (this.data && this.data.length > 0) {
      this.allData = this.data
      this.regionData = this.data
    } else {
      this.$socket.registerCallBack('refundMapData', this.getData)
    }
  },
  mounted() {
    this.loadMap()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (!this.data || this.data.length === 0) {
      this.$socket.unRegisterCallBack('refundMapData')
    }
    this.chartInstance && this.chartInstance.dispose()
  },
  methods: {
    async loadMap() {
      try {
        // 先尝试从本地加载地图数据
        const mapJson = require('../../assets/map/china.json')
        this.mapData = mapJson
        this.$echarts.registerMap('china', mapJson)
        this.initChart()
        
        if (this.allData) {
          this.updateChart()
        }
        this.screenAdapter()
      } catch (error) {
        console.error('地图数据加载失败：', error)
      }
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.refund_map, this.theme)
      
      const initOption = {
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.name}<br/>${params.marker}退款学员数：${params.value || 0}人`
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0
        },
        visualMap: {
          type: 'piecewise',
          pieces: this.VALUE_RANGES.map(range => ({
            min: range.min,
            max: range.max === Infinity ? undefined : range.max,
            label: range.label
          })),
          inRange: {
            color: this.colorList.map(item => item.start)
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)'
          },
          bottom: 20,
          left: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '10%',
          bottom: '15%',
          zoom: 1.2,
          roam: true,
          scaleLimit: {
            min: 0.8,
            max: 2
          },
          itemStyle: {
            areaColor: 'rgba(0, 35, 80, 0.8)',
            borderColor: 'rgba(0, 102, 204, 0.5)',
            borderWidth: 1,
            shadowColor: 'rgba(0, 102, 204, 0.8)',
            shadowBlur: 10
          },
          emphasis: {
            itemStyle: {
              areaColor: '#0098d9',
              shadowColor: 'rgba(0, 152, 217, 0.8)',
              shadowBlur: 20
            },
            label: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: []
          }
        ]
      }
      
      this.chartInstance.setOption(initOption)
      
      this.chartInstance.on('mouseover', params => {
        if (params.componentType === 'series') {
          const hoverOption = {
            series: [{
              data: this.regionData.map(item => {
                return {
                  ...item,
                  itemStyle: {
                    areaColor: item.name === params.name ? '#0098d9' : undefined
                  }
                }
              })
            }]
          }
          this.chartInstance.setOption(hoverOption)
        }
      })
    },
    getData(ret) {
      this.allData = ret
      this.regionData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData || !this.allData.length) return
      
      console.log('当前地图数据：', this.allData)
      
      const option = {
        visualMap: {
          type: 'piecewise',
          pieces: this.VALUE_RANGES.map(range => ({
            min: range.min,
            max: range.max === Infinity ? undefined : range.max,
            label: range.label
          })),
          inRange: {
            color: this.colorList.map(item => item.start)
          },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)'
          },
          bottom: 20,
          left: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '10%',
          bottom: '15%',
          zoom: 1.2,
          roam: true,
          scaleLimit: {
            min: 0.8,
            max: 2
          },
          itemStyle: {
            areaColor: 'rgba(0, 35, 80, 0.8)',
            borderColor: 'rgba(0, 102, 204, 0.5)',
            borderWidth: 1,
            shadowColor: 'rgba(0, 102, 204, 0.8)',
            shadowBlur: 10
          },
          emphasis: {
            itemStyle: {
              areaColor: '#0098d9',
              shadowColor: 'rgba(0, 152, 217, 0.8)',
              shadowBlur: 20
            },
            label: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: this.allData.map(item => ({
              name: item.name,
              value: item.value,
              itemStyle: {
                areaColor: this.getGradientColor(item.value)
              }
            }))
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    getGradientColor(value) {
      const range = this.VALUE_RANGES.find(r => value >= r.min && value <= r.max);
      const colorItem = this.colorList[range ? range.level : 0];
      return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colorItem.start },
        { offset: 1, color: colorItem.end }
      ]);
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.refund_map.offsetWidth / 100 * 3.6
      const fontSize = this.titleFontSize / 1.15
      
      const adapterOption = {
        tooltip: {
          textStyle: {
            fontSize: fontSize * 0.8
          }
        },
        visualMap: {
          itemWidth: fontSize * 0.8,
          itemHeight: fontSize * 0.6,
          textStyle: {
            fontSize: fontSize * 0.8
          }
        }
      }
      
      this.chartInstance && this.chartInstance.setOption(adapterOption)
      this.chartInstance && this.chartInstance.resize()
    }
  },
  watch: {
    theme() {
      this.chartInstance && this.chartInstance.dispose()
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
  left: 20px;
  top: 20px;
  z-index: 9;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
  justify-content: space-between;
  
  .region-total {
    font-size: 0.9em;
    background: rgba(0, 152, 217, 0.3);
    padding: 2px 10px;
    border-radius: 20px;
    margin-right: 20px;
    box-shadow: 0 0 10px rgba(0, 152, 217, 0.2);
  }
}

.com-chart {
  width: 100%;
  height: 100%;
}
</style>
