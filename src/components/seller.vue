<!--销量统计横向柱状图-->
<template>
    <div class="com-container">
        <div class="com-chart" ref="seller"></div>
    </div>
</template>

<script>
  export default {
    name: "seller",
    data() {
      return {
        chartInstance: null,
        allData: null, //服务器返回的数据
        currentPage: 1,//当前页数
        totalPage: 0,//一共多少页
        timeId: null,
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize', this.screenUpdate)
      this.screenUpdate()
    },
    destroyed() {
      clearInterval(this.timeId)
      window.removeEventListener('resize', this.screenUpdate)
    },
    methods: {
      //初始化echartInstance对象
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.seller, 'chalk')
        //对图表初始化配置的控制
        const initOption = {
          title: {
            text: '▎商家销售统计',
            left: 35,
            top: 30,
          },
          grid: {
            top:'15%',
            bottom:'7%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              z: 0,
              lineStyle: {
                color: '#2D3443'
              }
            }
          },
          series: [
            {
              type: 'bar',
              label: {
                show: true,
                position: 'right',
                textStyle: {
                  color: 'white',
                }
              },
              itemStyle: {
                // 配置渐变的方向和颜色，不同百分比下的值
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0, color: '#5052EE'
                }, {
                  offset: 1, color: '#AB6EE5'
                }]),
              },
            }
          ]
        }
        this.chartInstance.setOption(initOption)
        //对图表对象进行鼠标事件监听
        this.chartInstance.on('mouseover', () => {
          clearInterval(this.timeId)
        })
        this.chartInstance.on('mouseout', () => {
          this.startInterval()
        })
      },
      //获取服务器数据
      async getData() {
        const ret = await this.$http.get('seller')
        this.allData = ret.data
        //对数据进行排序
        this.allData.sort((a, b) => {
          return a.value - b.value  //从小到大的排序
        })
        //每五个元素显示一页
        if (this.allData.left % 5 === 0) {
          this.totalPage = this.allData.length / 5
        } else {
          this.totalPage = this.allData.length / 5 + 1
        }
        this.updateChart()
        this.startInterval()
      },
      //更新图表
      updateChart() {
        const start = (this.currentPage - 1) * 5
        const end = this.currentPage * 5
        const showData = this.allData.slice(start, end)
        const sellerName = showData.map((item) => {
          return item.name
        })
        const sellerValue = showData.map((item) => {
          return item.value
        })
        //图表数据相关的配置
        const dataOption = {
          yAxis: {
            data: sellerName
          },
          series: [
            {
              data: sellerValue,
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      startInterval() {
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => {
          this.currentPage++
          if (this.currentPage >= this.totalPage) {
            this.currentPage = 1
          }
          this.updateChart()
        }, 3000)
      },
      screenUpdate() {
        const titleFontSize = this.$refs.seller.offsetWidth / 100 * 3.6
        //和分辨率大小有关的配置项
        const adapterOption = {
          title: {
            textStyle: {
              fontsize: titleFontSize
            },
          },
          tooltip: {
            axisPointer: {
              lineStyle: {
                width: titleFontSize,
              }
            }
          },
          series: [
            {
              barWidth: titleFontSize,
              itemStyle: {
                barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
              },
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
  }
</script>

<style scoped>

</style>