<template>
    <div class="com-container">
        <div class="com-chart" ref="scale">aaaa</div>
    </div>
</template>

<script>
  export default {
    name: "scale",
    data() {
      return {}
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
        this.chartInstance = this.$echarts.init(this.$refs.scale, 'chalk')
        const initOption = {}
        this.chartInstance.setOption(initOption)
      },
      async getData() {
        const {data: ret} = await this.$http.get('stock')
        this.allData = ret
        this.updateChart()
      },
      updateChart() {
        const centerArr = [
          ['18%','40%'],
          ['50%','40%'],
          ['82%','40%'],
          ['34%','75%'],
          ['66%','75%'],
        ]
        const showData = this.allData.slice(0,5)
        const seriesArr = showData.map((item,index) => {
          return {
            type:'pie',
            radius:[110,100],
            center:centerArr[index],
            data:[
              {
                value:item.sales
              },
              {
                value:item.stock
              }
            ]
          }
        })
        const dataOption = {
          series:seriesArr
        }
        this.chartInstance.setOption(dataOption)

      },
      screenUpdate() {
        this.titleFontSize = this.$refs.scale.offsetWidth / 100 * 3.6
        //和分辨率大小有关的配置项
        const adapterOption = {}
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
  }
</script>

<style scoped>

</style>