<template>
    <div class="com-container">
        <div class="com-chart" ref="hot">
        </div>
        <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{catName}}</span>
    </div>
</template>

<script>
  export default {
    name: "hot",
    data() {
      return {
        chartInstance: null,
        allData: null, //服务器返回的数据
        currentIndex: 0,//当前展示出的数据页数
        titleFontSize:0
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
        this.chartInstance = this.$echarts.init(this.$refs.hot, 'chalk')
        const initOption = {
          title: {
            text: '▎热销商品占比',
            left: 20,
            top: 20,
          },
          legend: {
            top: '12%',
            icon: 'circle'
          },
          tooltip: {
            show: true,
            formatter:(arg) =>{
              const thirdCategory = arg.data.children
              let total = 0
              thirdCategory.forEach(item=>{
                 total += item.value
              })
              let GoodsPercentRet = ''
              thirdCategory.forEach(item =>{
                GoodsPercentRet += `${item.name}:
                ${parseInt(item.value/total*100) + '%'}
                <br/>`
              })
              return GoodsPercentRet
            }
          },
          series: [
            {
              type: 'pie',
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              // labelLine:{
              //   show:false
              // }
            }
          ]
        }
        this.chartInstance.setOption(initOption)
      },
      async getData() {
        const {data: ret} = await this.$http.get('hotproduct')
        this.allData = ret
        this.updateChart()
      },
      updateChart() {
        const LegendArr = this.allData[this.currentIndex].children.map(item => {
          return item.name
        })
        const seriesArr = this.allData[this.currentIndex].children.map(item => {
          return {
            name: item.name,
            value: item.value,
            children:item.children
          }
        })
        const dataOption = {
          legend: {
            data: LegendArr
          },
          series: [
            {
              data: seriesArr
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate() {
       this.titleFontSize = this.$refs.hot.offsetWidth / 100 * 3.6
        //和分辨率大小有关的配置项
        const adapterOption = {
          title:{
            textStyle:{
              fontSize:this.titleFontSize/1.5,
            }
          },
          legend:{
            itemWidth:this.titleFontSize/2,
            itemHeight:this.titleFontSize/2,
            itemGap:this.titleFontSize/2,
            textStyle:{
              fontSize:this.titleFontSize/2
            }
          },
          series:[
            {
              radius:this.titleFontSize*4.5,
              center:['50%','60%'],
              label:{
                fontSize:this.titleFontSize/3
              }
            },

          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      toLeft() {
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = this.allData.length - 1
        }
        this.updateChart()
      },
      toRight() {
        this.currentIndex++
        if (this.currentIndex > this.allData.length - 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }
    },
    computed: {
      catName() {
        if (!this.allData) {
          return {}
        } else {
          return this.allData[this.currentIndex].name
        }
      },
      comStyle(){
        return {fontSize:this.titleFontSize + 'px'}
      }
    }
  }
</script>

<style scoped lang="scss">
    @mixin hotStyle {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: white;
    }

    .arr-left {
        @include hotStyle;
        left: 10%;
    }

    .arr-right {
        @include hotStyle;
        right: 10%;
    }

    .cat-name {
        position: absolute;
        left: 80%;
        bottom: 25px;
        color: white;
    }
</style>