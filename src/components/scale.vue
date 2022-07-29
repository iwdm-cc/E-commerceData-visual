<template>
    <div class="com-container">
        <div class="com-chart" ref="scale">aaaa</div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "scale",
    data() {
      return {
        chartInstance: null,
        allData: null, //服务器返回的数据
        currentIndex: 0,//当前展示出的数据页数
        timeId: null,
      }
    },
    created() {
      //组件创建时进行回调函数的注册
      this.$socket.registerCallBack('scaleData', this.getData)
    },
    mounted() {
      this.initChart()
      this.$socket.send({
        action: 'getData',
        socketType: 'scaleData',
        chartName: 'stock',
        value: ''
      })
      window.addEventListener('resize', this.screenUpdate)
      this.screenUpdate()
    },
    destroyed() {
      clearInterval(this.timeId)
      window.removeEventListener('resize', this.screenUpdate)
      this.$socket.unRegisterCallBack('scaleData')
    },
    methods: {
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.scale, this.theme)
        const initOption = {
          title: {
            text: '▎库存和销量分析',
            left: 20,
            top: 20,
          }
        }
        this.chartInstance.setOption(initOption)
        this.chartInstance.on('mouseover', () => {
          clearInterval(this.timeId)
        })
        this.chartInstance.on('mouseout', () => {
          this.startInterVal()
        })
      },
      async getData(ret) {
        // const {data: ret} = await this.$http.get('stock')
        this.allData = ret
        this.updateChart()
        this.startInterVal()
      },
      updateChart() {
        const centerArr = [
          ['18%', '40%'],
          ['50%', '40%'],
          ['82%', '40%'],
          ['34%', '75%'],
          ['66%', '75%'],
        ]
        const colorArr = [
          ['#4FF778', '#0BA82C'],
          ['#E5DD45', '#E8B11C'],
          ['#E8821C', '#E55445'],
          ['#5052EE', '#AB6EE5'],
          ['#23E5E5', '#2E72BF']
        ]
        const start = this.currentIndex * 5
        const end = (this.currentIndex + 1) * 5
        const showData = this.allData.slice(start, end)
        const seriesArr = showData.map((item, index) => {
          return {
            type: 'pie',
            hoverAnimation: false,
            center: centerArr[index],//关闭鼠标移入饼图时的动画效果
            label: {
              position: 'center',
              color: colorArr[index][0]
            },
            labelLine: {
              show: false
            },
            data: [
              {
                name: item.name + '\n\n' + item.sales,
                value: item.sales,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {offset: 0, color: colorArr[index][0]}, {offset: 1, color: colorArr[index][1]}
                  ])
                }
              },
              {
                value: item.stock,
                itemStyle: {
                  color: '#333843'
                }
              }
            ]
          }
        })
        const dataOption = {
          series: seriesArr
        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate() {
        const titleFontSize = this.$refs.scale.offsetWidth / 100 * 3.6
        //和分辨率大小有关的配置项
        const innerRadius = titleFontSize * 2.8
        const outRadius = innerRadius * 1.125
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize
            }
          },
          series: [
            {
              type: 'pie',
              radius: [outRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 1.5
              }
            }, {
              type: 'pie',
              radius: [outRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 1.5
              }
            }, {
              type: 'pie',
              radius: [outRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 1.5
              }
            }, {
              type: 'pie',
              radius: [outRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 1.5
              }
            }, {
              type: 'pie',
              radius: [outRadius, innerRadius],
              label: {
                fontSize: titleFontSize / 1.5
              }
            },
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      startInterVal() {
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => {
          this.currentIndex++
          if (this.currentIndex > 1) {
            this.currentIndex = 0
          }
          this.updateChart()
        }, 5000)
      }
    },
    computed: {
      ...mapState(['theme'])
    },
    watch: {
      theme() {
        this.chartInstance.dispose()//销毁当前的图表
        this.initChart() //重新初始化图表
        this.screenUpdate()//完成屏幕的视频
        this.updateChart()//更新图表的展示
      }
    }
  }
</script>

<style scoped>

</style>