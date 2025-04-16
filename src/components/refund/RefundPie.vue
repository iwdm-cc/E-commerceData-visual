<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <div class="type-selector">
        <div
          v-for="(item, index) in typeOptions"
          :key="index"
          :class="['type-item', currentType === item.type ? 'active' : '']"
          @click="handleTypeChange(item.type)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="refund_pie"></div>
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
      currentType: 'category', // 默认显示类别分布
      titleFontSize: 0,
      innerTitle: '退款分布',
      typeOptions: [
        { type: 'category', text: '类别分布' },
        { type: 'reason', text: '原因分布' }
      ],
      colorList: [
        { start: '#FFA07A', end: '#FF6347' },
        { start: '#87CEEB', end: '#4169E1' },
        { start: '#98FB98', end: '#32CD32' },
        { start: '#DDA0DD', end: '#9370DB' },
        { start: '#F0E68C', end: '#DAA520' }
      ]
    }
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
    this.screenAdapter()

    if (this.allData) {
      this.updateChart()
    } else {
      this.requestData()
    }

    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if (!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('refundPieData')
    }
    this.chartInstance && this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.refund_pie, this.theme)
      const initOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0,
          padding: [10, 15]
        },
        grid: {
          containLabel: true
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '5%',
          top: '15%',
          bottom: '15%',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 12,
          pageButtonGap: 10,
          pageButtonItemGap: 5,
          pageButtonPosition: 'end',
          pageFormatter: '{current}/{total}',
          pageIconColor: getThemeValue(this.theme).textColor,
          pageIconInactiveColor: 'rgba(255, 255, 255, 0.3)',
          pageIconSize: 12,
          pageTextStyle: {
            color: getThemeValue(this.theme).textColor
          },
          textStyle: {
            color: getThemeValue(this.theme).textColor,
            fontSize: 12,
            overflow: 'truncate',
            width: 80
          },
          formatter: name => {
            const data = this.chartInstance.getOption().series[0].data;
            const target = data.find(item => item.name === name);
            if (target) {
              const value = target.value;
              if (value >= 1000) {
                return `${name}  ${(value/1000).toFixed(1)}k`;
              }
              return `${name}  ${value}`;
            }
            return name;
          }
        },
        series: [
          {
            name: '退款分布',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['32%', '50%'],
            avoidLabelOverlap: true,
            minShowLabelAngle: 3,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: true,
              position: 'outside',
              formatter: params => {
                const value = params.value;
                let valueStr = value.toString();
                if (value >= 1000) {
                  valueStr = (value/1000).toFixed(1) + 'k';
                }
                return `${params.name}\n${valueStr}(${params.percent}%)`;
              },
              color: getThemeValue(this.theme).textColor,
              fontSize: 12,
              lineHeight: 16,
              padding: [4, 8],
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: 4,
              alignTo: 'edge',
              edgeDistance: '10%',
              distanceToLabelLine: 5
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10,
              maxSurfaceAngle: 80,
              smooth: true,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            data: []
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    requestData() {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundPieData',
        chartName: 'refundPie',
        value: this.currentType
      })
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData) return

      const currentData = this.allData[this.currentType]
      if (!currentData || !currentData.data) return

      const data = currentData.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: this.colorList[index % this.colorList.length].start },
            { offset: 1, color: this.colorList[index % this.colorList.length].end }
          ])
        }
      }))

      const option = {
        series: [{
          data: data
        }]
      }

      this.chartInstance.setOption(option)
    },
    handleTypeChange(type) {
      this.currentType = type
      if (!this.allData) {
        this.requestData()
      } else {
        this.updateChart()
      }
    },
    screenAdapter() {
      const containerWidth = this.$refs.refund_pie.offsetWidth
      const containerHeight = this.$refs.refund_pie.offsetHeight
      this.titleFontSize = Math.min(containerWidth, containerHeight) / 100 * 3.6
      
      const adapterOption = {
        legend: {
          itemWidth: Math.min(this.titleFontSize * 0.7, 10),
          itemHeight: Math.min(this.titleFontSize * 0.7, 10),
          itemGap: Math.min(this.titleFontSize * 0.8, 12),
          textStyle: {
            fontSize: Math.min(this.titleFontSize * 0.7, 12)
          }
        },
        series: [
          {
            radius: [
              Math.min(this.titleFontSize * 3, 30) + '%',
              Math.min(this.titleFontSize * 5.5, 55) + '%'
            ],
            center: ['32%', '50%'],
            label: {
              fontSize: Math.min(this.titleFontSize * 0.65, 12),
              lineHeight: Math.min(this.titleFontSize * 0.9, 16),
              edgeDistance: Math.min(this.titleFontSize * 1.5, 20) + '%'
            },
            labelLine: {
              length: Math.min(this.titleFontSize * 0.6, 10),
              length2: Math.min(this.titleFontSize * 0.6, 10)
            }
          }
        ]
      }
      
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  computed: {
    showTitle() {
      return this.innerTitle
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.updateChart()
      this.screenAdapter()
    }
  }
}
</script>

<style lang="scss" scoped>
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(6, 30, 65, 0.6), rgba(6, 30, 65, 0.8));
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
  height: 40px;
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
}

.type-selector {
  display: flex;
  margin-right: 20px;
  flex-wrap: nowrap;
  
  .type-item {
    padding: 2px 10px;
    margin: 0 5px;
    font-size: 0.8em;
    border-radius: 15px;
    background: rgba(61, 85, 125, 0.4);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
    
    &:hover {
      background: rgba(61, 85, 125, 0.7);
      color: #fff;
    }
    
    &.active {
      background: rgba(0, 152, 217, 0.4);
      color: #fff;
      box-shadow: 0 0 10px rgba(0, 152, 217, 0.3);
    }
  }
}

.com-chart {
  width: 100%;
  height: calc(100% - 40px);
  margin-top: 40px;
  position: relative;
}
</style>
