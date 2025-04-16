<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span class="category">
        <div 
          class="category-item" 
          v-for="item in pieTypes" 
          :key="item.key"
          :class="{ active: currentType === item.key }"
          @click="handleSelect(item.key)"
        >{{ item.text }}</div>
      </span>
    </div>
    <div class="com-chart" ref="RefundPie"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../../utils/theme_utils'

export default {
  name: "RefundPie",
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
      currentType: 'category',
      titleFontSize: 0,
      pieColors: [
        ['#80FFA5', '#00DDFF'],
        ['#37A2FF', '#7337FF'],
        ['#FFBF00', '#FF8A00'],
        ['#FF4949', '#FF0000'],
        ['#00EAFF', '#188df0'],
        ['#EC0C20', '#FE8A4B'],
        ['#FEBD69', '#FF3366'],
        ['#9F8BFF', '#5A61FF'],
        ['#FF9A9A', '#FF3C47'],
        ['#43E7FE', '#4B9AFE']
      ]
    }
  },
  computed: {
    showTitle() {
      if (!this.allData) return "退款分布";
      return this.allData.title
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize / 1.15 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    pieTypes() {
      if (!this.allData) {
        return [
          { key: 'category', text: '品类' },
          { key: 'reason', text: '原因' }
        ]
      } else {
        return this.allData.type || [
          { key: 'category', text: '品类' },
          { key: 'reason', text: '原因' }
        ]
      }
    },
    ...mapState(['theme'])
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('refundPieData', this.getData)
    }
  },
  mounted() {
    this.initChart()
    if (this.allData) {
      this.updateChart()
    } else {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundPieData',
        chartName: 'refundPie',
        value: ''
      })
    }
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('refundPieData')
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RefundPie, this.theme)
      const initOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderWidth: 0,
          textStyle: {
            fontSize: 14
          }
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'middle',
          itemWidth: 14,
          itemHeight: 14,
          icon: 'circle',
          textStyle: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14
          }
        },
        series: [
          {
            name: '退款分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{b}: {c} ({d}%)'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', params => {
        const isDataItem = params.seriesType === 'pie'
        if (isDataItem) {
          const centerX = this.chartInstance.getWidth() * 0.4
          const centerY = this.chartInstance.getHeight() * 0.5
          
          const point = {
            x: centerX + (Math.sin(params.percent * Math.PI * 2) * this.chartInstance.getWidth() * 0.3),
            y: centerY - (Math.cos(params.percent * Math.PI * 2) * this.chartInstance.getHeight() * 0.3)
          }
          
          this.chartInstance.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: params.dataIndex,
            position: [point.x, point.y]
          })
        }
      })
    },
    processPieData(data) {
      if (!data || !data.data || !Array.isArray(data.data)) {
        console.warn('Invalid pie data format')
        return []
      }

      return data.data.map((item, index) => ({
        name: item.name || `未命名${index + 1}`,
        value: this.validateValue(item.value),
        itemStyle: {
          color: this.getGradientColor(index)
        }
      }))
    },
    validateValue(value) {
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    },
    getGradientColor(index) {
      const colors = this.pieColors[index % this.pieColors.length]
      return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors[0] },
        { offset: 1, color: colors[1] }
      ])
    },
    updateChart() {
      if (!this.allData) return
      const currentData = this.allData[this.currentType]
      if (!currentData || !currentData.data) return
      
      console.log('当前饼图数据：', currentData)
      
      const pieData = currentData.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: this.pieColors[index % this.pieColors.length][0] },
            { offset: 1, color: this.pieColors[index % this.pieColors.length][1] }
          ])
        }
      }))

      const option = {
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'middle',
          data: pieData.map(item => item.name)
        },
        series: [{
          name: '退款分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          data: pieData,
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      
      this.chartInstance.setOption(option)
    },
    getData(ret) {
      try {
        if (!ret || typeof ret !== 'object') {
          throw new Error('Invalid data received')
        }
        this.allData = ret
        this.updateChart()
      } catch (error) {
        console.error('Error processing pie data:', error)
        // 可以在这里添加错误提示UI
      }
    },
    screenAdapter() {
      this.titleFontSize = this.$refs.RefundPie.offsetWidth / 100 * 3.6
      const fontSize = this.titleFontSize / 1.15
      
      const adapterOption = {
        tooltip: {
          textStyle: {
            fontSize: fontSize * 0.8
          }
        },
        legend: {
          itemWidth: fontSize * 0.8,
          itemHeight: fontSize * 0.8,
          textStyle: {
            fontSize: fontSize * 0.8
          }
        },
        series: [
          {
            label: {
              fontSize: fontSize * 0.8
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(type) {
      this.currentType = type
      this.updateChart()
    }
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
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
  left: 35px;
  top: 20px;
  z-index: 9;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 70px);

  .category {
    display: flex;
    margin-right: 35px;
    
    .category-item {
      padding: 2px 12px;
      margin: 0 3px;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.3s;
      background: rgba(255, 255, 255, 0.1);
      font-size: 0.85em;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      &.active {
        background: rgba(92, 153, 255, 0.5);
        box-shadow: 0 0 10px rgba(92, 153, 255, 0.3);
      }
    }
  }
}

.com-chart {
  width: 100%;
  height: 100%;
  padding: 10px;
}
</style> 