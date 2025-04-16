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
    <div class="com-chart" ref="RefundTable"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RefundTable",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chartInstance: null,
      currentPage: 1,
      pageSize: 5,
      allData: null,
      screenWidth: 0,
      ifShowChoice: false,
      choiceType: 'detail', //显示的数据类型
      titleFontSize: 0,
      colorList: [
        { start: '#5470c6', end: '#91cc75' },
        { start: '#fac858', end: '#ee6666' },
        { start: '#73c0de', end: '#3ba272' },
        { start: '#fc8452', end: '#9a60b4' },
        { start: '#ea7ccc', end: '#5470c6' },
        { start: '#91cc75', end: '#fac858' },
        { start: '#ee6666', end: '#73c0de' },
        { start: '#3ba272', end: '#fc8452' },
        { start: '#9a60b4', end: '#ea7ccc' },
        { start: '#ea7ccc', end: '#5470c6' }
      ]
    }
  },
  computed: {
    paginatedData() {
      if (!this.allData || !this.allData.data) return []
      
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.allData.data.slice(start, end)
    },
    totalPages() {
      if (!this.allData || !this.allData.data) return 0
      return Math.ceil(this.allData.data.length / this.pageSize)
    }
  },
  created() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('refundTableData', this.getData)
    }
  },
  mounted() {
    this.screenWidth = window.innerWidth
    this.initChart()
    if (!this.allData) {
      this.$socket.send({
        action: 'getData',
        socketType: 'refundTableData',
        chartName: 'refund',
        value: ''
      })
    }
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    if(!this.data || Object.keys(this.data).length === 0) {
      this.$socket.unRegisterCallBack('refundTableData')
    }
    this.chartInstance.dispose()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RefundTable, 'chalk')
      const initOption = {
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            fontSize: 14
          },
          formatter: '{b}<br/>{c}元'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 14
          }
        },
        yAxis: {
          type: 'value',
          name: '金额',
          nameTextStyle: {
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.6)'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: '35%',
            itemStyle: {
              color: params => {
                const colorList = [
                  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
                  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
                ]
                return colorList[params.dataIndex % colorList.length]
              },
              borderRadius: [5, 5, 0, 0]
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
                borderColor: '#fff',
                shadowBlur: 10,
                shadowColor: 'rgba(255, 255, 255, 0.3)'
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      
      if (this.allData) {
        this.updateChart()
      }
    },
    screenAdapter() {
      this.screenWidth = window.innerWidth
      const adaptionSize = (this.screenWidth / 100) * 0.8
      
      const adaptionOption = {
        xAxis: {
          axisLabel: {
            fontSize: adaptionSize
          }
        },
        yAxis: {
          nameTextStyle: {
            fontSize: adaptionSize
          },
          axisLabel: {
            fontSize: adaptionSize
          }
        },
        tooltip: {
          textStyle: {
            fontSize: adaptionSize
          }
        }
      }
      
      this.chartInstance.setOption(adaptionOption)
      this.chartInstance.resize()
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      if (!this.allData) return
      
      const currentData = this.allData[this.choiceType]
      if (!currentData || !currentData.data) return
      
      console.log('当前表格数据：', currentData)
      
      const tableData = currentData.data.map(item => ({
        name: item.name,
        value: item.value
      }))
      
      const option = {
        grid: {
          top: '15%',
          left: '3%',
          right: '6%',
          bottom: '3%',
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
          data: tableData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 45,
            color: 'rgba(255, 255, 255, 0.7)'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: tableData.map((item, index) => ({
              value: item.value,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: this.colorList[index % this.colorList.length].start },
                  { offset: 1, color: this.colorList[index % this.colorList.length].end }
                ])
              }
            })),
            barWidth: '45%',
            label: {
              show: true,
              position: 'top',
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RefundTable.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
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
    },
    changePage(newPage) {
      this.currentPage = newPage
      this.updateChart()
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.updateChart()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.updateChart()
      }
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
    },
    data: {
      handler(newValue) {
        if (newValue && Object.keys(newValue).length > 0) {
          this.allData = newValue
          this.$nextTick(() => {
            this.updateChart()
          })
        }
      },
      deep: true
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