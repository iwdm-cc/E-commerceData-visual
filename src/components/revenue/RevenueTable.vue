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
    <div class="com-chart" ref="RevenueTable"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RevenueTable",
  data() {
    return {
      chartInstance: null,
      allData: null,
      ifShowChoice: false,
      choiceType: 'detail', //显示的数据类型
      titleFontSize: 0,
    }
  },
  created(){
    this.$socket.registerCallBack('revenueTableData',this.getData)
  },
  mounted() {
    this.initChart()
    this.$socket.send({
      action:'getData',
      socketType:'revenueTableData',
      chartName:'revenueTable',
      value:''
    })
    window.addEventListener('resize', this.screenUpdate)
    this.screenUpdate()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenUpdate)
    this.$socket.unRegisterCallBack('revenueTableData')
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.RevenueTable, this.theme)
      const initOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 万'
          }
        },
        series: [
          {
            name: '营收金额',
            type: 'bar',
            data: []
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(ret) {
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      const dataOption = {
        xAxis: {
          data: this.allData[this.choiceType].data.map(item => item.name)
        },
        series: [
          {
            data: this.allData[this.choiceType].data.map(item => item.value)
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenUpdate() {
      this.titleFontSize = this.$refs.RevenueTable.offsetWidth / 100 * 3.6
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