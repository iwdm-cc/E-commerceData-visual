<template>
    <div class="com-container">
        <div class="com-chart" ref="rank">
        </div>
    </div>
</template>

<script>
  export default {
    name: "rank",
    data(){
      return{
        chartInstance: null,
        allData: null, //服务器返回的数据
        startValue:0,//区域缩放起点值,
        endValue:9,//区域缩放的终点值
        timeId:null,
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
      clearInterval(this.timeId)
    },
    methods:{
      //初始化echartInstance对象
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.rank, 'chalk')
        const initOption = {
          title:{
            text:'▎地区销售排行',
            left:20,
            top:20,
          },
          grid:{
            top:'25%',
            bottom:'7%',
            containLabel:true
          },
          tooltip: {
            show:true
          },
            xAxis:{
              type:'category'
            },
            yAxis:{
              type:'value'
            },
          series:[
            {
              type:'bar',
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'white',
                }
              },
            }
          ]
        }
        this.chartInstance.setOption(initOption)
        this.chartInstance.on('mouseover', () => {
          clearInterval(this.timeId)
        })
        this.chartInstance.on('mouseout', () => {
          this.startInterval()
        })
      },
      async getData(){
        const {data:ret} = await this.$http.get('rank')
        this.allData = ret
        //对数据进行排序
        this.allData.sort((a, b) => {
          return b.value - a.value  //从小到大的排序
        })
        this.updateChart()
        this.startInterval()
      },
      updateChart(){
        const colorArr = [
          ['#0BA82C', '#4FF778'],
          ['#2E72BF', '#23E5E5'],
          ['#5052EE', '#AB6EE5']
        ]
        const provinceArr = this.allData.map(item=>{
          return item.name
        })
        const rankValue = this.allData.map(item =>{
          return item.value
        })
        const dataOption = {
          xAxis: {
            data: provinceArr
          },
          dataZoom:{
               show:false,//区域缩放
               startValue:this.startValue,
               endValue:this.endValue,
          },
          series: [
            {
              data: rankValue,
              itemStyle: {
                // 配置渐变的方向和颜色，不同百分比下的值
                color:arg=>{
                  let targetColorArr = null
                  if(arg.value >300){
                    targetColorArr = colorArr[0]
                  }else if(arg.value>200){
                    targetColorArr = colorArr[1]
                  }else {
                    targetColorArr = colorArr[2]
                  }
                  return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                    { offset: 0, color: targetColorArr[0]},{offset: 1, color: targetColorArr[1]}
                  ])
                }
              },
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate(){
        const titleFontSize = this.$refs.rank.offsetWidth / 100 * 3.6
        //和分辨率大小有关的配置项
        const adapterOption = {
          title:{
            titleStyle:{
                fontSize:titleFontSize/2
            }
          },
          series:[
            {
              barWidth:titleFontSize,
              itemStyle:{
                barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0]
              }
            }
          ]
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      startInterval(){
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(()=>{
          if(this.endValue<this.allData.length-1){
            this.startValue++
            this.endValue++
          }else {
            this.startValue=0
            this.endValue=9
          }
          this.updateChart()
        },2000)
      }
    }
  }
</script>

<style scoped>

</style>