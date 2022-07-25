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
        <div class="com-chart" ref="Trend"></div>
    </div>
</template>

<script>
  export default {
    name: "trend",
    data() {
      return {
        chartInstance: null,
        allData: null,
        ifShowChoice: false,
        choiceType: 'map', //显示的数据类型
        titleFontSize: 0,
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize', this.screenUpdate)
      this.screenUpdate()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenUpdate)
    },
    methods: {
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.Trend, 'chalk')
        const initOption = {
          grid: {
            top: '27%',
            bottom: '7%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            left: '10%',
            top: '17%'
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            type: 'value'
          }
        }
        this.chartInstance.setOption(initOption)
      },
      async getData() {
        const ret = await this.$http.get('trend')
        this.allData = ret.data
        this.updateChart()
      },
      updateChart() {
        //处理数据
        const colorArr1 = [
          'rgba(11, 168, 44, 0.5)',
          'rgba(44, 110, 255, 0.5)',
          'rgba(22, 242, 217, 0.5)',
          'rgba(254, 33, 30, 0.5)',
          'rgba(250, 105, 0, 0.5)'
        ]
        // 全透明的颜色值
        const colorArr2 = [
          'rgba(11, 168, 44, 0)',
          'rgba(44, 110, 255, 0)',
          'rgba(22, 242, 217, 0)',
          'rgba(254, 33, 30, 0)',
          'rgba(250, 105, 0, 0)'
        ]
        //x轴,类目轴的数据
        const timeArr = this.allData.common.month
        //y轴，series下的数据
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
        //图例的数据
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
          },
          series: seriesArr,

        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate() {
        this.titleFontSize = this.$refs.Trend.offsetWidth / 100 * 3.6
        const adapterOption = {
          legend: {
            itemWidth: this.titleFontSize/2,
            itemHeight: this.titleFontSize/2,
            itemGap: this.titleFontSize,
            textStyle: {
              fontSize: this.titleFontSize/2.5
            }
          }
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      //将点击的type更新并处理选择后的下拉框隐藏
      handleChoice(type) {
        this.choiceType = type
        this.updateChart()
        this.ifShowChoice = false
      }
    },
    computed: {
      //显示可以选择的图表
      selectTypes() {
        if (!this.allData) {
          return []
        } else {
          return this.allData.type.filter(item => {
            return item.key !== this.choiceType
          })
        }
      },
      //展示的标签
      showTitle() {
        if (!this.allData) {
          return []
        } else {
          return this.allData[this.choiceType].title
        }
      },
      //标题字体大小
      comStyle() {
        return {
          fontSize: this.titleFontSize / 1.7 + 'px'
        }
      },
      marginStyle(){
        return {marginLeft: this.titleFontSize/2.5 + 'px'}
      }
    }
  }
</script>

<style scoped lang="scss">
    .title {
        position: absolute;
        left: 55px;
        top: 25px;
        z-index: 9;
        color: white;
        .title-icon {
            margin-left: 10px;
            cursor: pointer; /*鼠标移上的效果*/
        }
        .select-con{
            background-color: #222733;
            .select-item {
                cursor: pointer;
            }
        }
    }

</style>