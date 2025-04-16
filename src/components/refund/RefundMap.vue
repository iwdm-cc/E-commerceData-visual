<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="region-total" v-if="regionData.length > 0">
        总退款人数：{{ regionTotal }}人
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
        { min: 0, max: 50, level: 0, label: '0-50人', color: '#2196F3' },
        { min: 51, max: 100, level: 1, label: '51-100人', color: '#4CAF50' },
        { min: 101, max: 150, level: 2, label: '101-150人', color: '#FF9800' },
        { min: 151, max: 200, level: 3, label: '151-200人', color: '#9C27B0' },
        { min: 201, max: Infinity, level: 4, label: '200人以上', color: '#F44336' }
      ],
      selectedRegion: null
    }
  },
  computed: {
    regionTotal() {
      return this.regionData.reduce((total, item) => total + (item.value || 0), 0)
    },
    showTitle() {
      return "退款地区分布"
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
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
        const response = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
        this.$echarts.registerMap('china', response.data)
        this.initChart()
        
        if (this.allData) {
          this.updateChart()
        } else {
          this.requestData()
        }
        this.screenAdapter()
      } catch (error) {
        console.error('地图数据加载失败：', error)
      }
    },
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.refund_map, this.theme)
      
      const initOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (!params.value && params.value !== 0) return `${params.name}<br/>暂无数据`
            return `${params.name}<br/>
                   ${params.marker}退款人数：${params.value}人<br/>
                   占比：${((params.value / this.regionTotal) * 100).toFixed(1)}%`
          },
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderWidth: 0,
          padding: [10, 15],
          textStyle: {
            color: '#fff'
          }
        },
        visualMap: {
          type: 'piecewise',
          pieces: this.VALUE_RANGES.map(range => ({
            min: range.min,
            max: range.max === Infinity ? undefined : range.max,
            label: range.label,
            color: range.color
          })),
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            color: getThemeValue(this.theme).textColor,
            fontSize: 12
          },
          bottom: '5%',
          left: '5%',
          orient: 'horizontal',
          showLabel: true
        },
        geo: {
          map: 'china',
          top: '8%',
          bottom: '15%',
          zoom: 1.1,
          roam: true,
          scaleLimit: {
            min: 0.8,
            max: 2.5
          },
          itemStyle: {
            areaColor: '#091C3D',
            borderColor: 'rgba(0, 102, 204, 0.3)',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#0098d9',
              shadowColor: 'rgba(0, 152, 217, 0.8)',
              shadowBlur: 15,
              borderWidth: 0
            },
            label: {
              show: true,
              color: '#fff',
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          select: {
            itemStyle: {
              areaColor: '#0098d9'
            }
          },
          label: {
            show: false
          }
        },
        series: [
          {
            name: '退款分布',
            type: 'map',
            geoIndex: 0,
            data: []
          }
        ]
      }
      
      this.chartInstance.setOption(initOption)
      
      // 添加地图交互事件
      this.chartInstance.on('click', params => {
        if (params.componentType === 'geo') {
          if (this.selectedRegion === params.name) {
            // 再次点击取消选中
            this.selectedRegion = null
            this.chartInstance.dispatchAction({
              type: 'downplay',
              name: params.name
            })
          } else {
            // 先重置之前的选中状态
            if (this.selectedRegion) {
              this.chartInstance.dispatchAction({
                type: 'downplay',
                name: this.selectedRegion
              })
            }
            // 设置新的选中状态
            this.selectedRegion = params.name
            this.chartInstance.dispatchAction({
              type: 'highlight',
              name: params.name
            })
          }
        }
      })
    },
    requestData() {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundMapData',
        chartName: 'refundMap',
        value: ''
      })
    },
    getData(ret) {
      console.log('接收到的地图数据：', ret)
      if (Array.isArray(ret)) {
        // 确保数据格式正确
        this.allData = ret.map(item => ({
          name: item.name,
          value: Number(item.value) || 0
        }))
        this.regionData = this.allData
        this.updateChart()
      }
    },
    updateChart() {
      if (!this.allData || !this.chartInstance) return
      
      const seriesData = this.regionData.map(item => ({
        name: item.name,
        value: Number(item.value) || 0
      }))
      
      const option = {
        series: [{
          name: '退款分布',
          type: 'map',
          geoIndex: 0,
          data: seriesData
        }]
      }
      
      this.chartInstance.setOption(option)
    },
    screenAdapter() {
      const containerWidth = this.$refs.refund_map.offsetWidth
      const containerHeight = this.$refs.refund_map.offsetHeight
      this.titleFontSize = Math.min(containerWidth, containerHeight) / 100 * 3.6
      
      const adapterOption = {
        visualMap: {
          itemWidth: Math.min(this.titleFontSize * 0.8, 15),
          itemHeight: Math.min(this.titleFontSize * 0.6, 10),
          itemGap: Math.min(this.titleFontSize * 0.4, 5),
          textStyle: {
            fontSize: Math.min(this.titleFontSize * 0.8, 12)
          }
        },
        geo: {
          zoom: containerWidth < 600 ? 0.8 : 1.1,
          label: {
            fontSize: Math.min(this.titleFontSize * 0.8, 12)
          }
        }
      }
      
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
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

<style lang="scss" scoped>
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(6, 30, 65, 0.5),
    rgba(6, 30, 65, 0.7)
  );
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
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

  .region-total {
    font-size: 0.9em;
    background: rgba(0, 152, 217, 0.2);
    padding: 4px 12px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 152, 217, 0.2);
  }
}

.com-chart {
  width: 100%;
  height: calc(100% - 40px);
  margin-top: 40px;
}
</style>
