<template>
    <div class="com-container" @dblclick="revertMap">
        <div class="com-chart" ref="map">

        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import {getProvinceMapInfo} from '../utils/map_utils'

  export default {
    name: "ViewMap",
    data() {
      return {
        chartInstance: null,
        allData: null,
        mapData:{},//省份地图数据缓存
      }
    },
    created(){
      //组件创建时进行回调函数的注册
      this.$socket.registerCallBack('mapData',this.getData)
    },
    mounted() {
      this.initChart()
      this.$socket.send({
        action:'getData',
        socketType:'mapData',
        chartName:'map',
        value:''
      })
      window.addEventListener('resize', this.screenUpdate)
      this.screenUpdate()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenUpdate)
      this.$socket.unRegisterCallBack('mapData')
    },
    methods: {
      async initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.map, this.theme)
        //获取的地图数据不是位于koa后台，所以不用this.$http
        const ret = await axios.get('http://localhost:8999/static/map/china.json')
        this.allData = ret.data
        this.$echarts.registerMap('ChinaMap', this.allData)
        const initOption = {
          title: {
            text: '▎商家分布',
            left: 20,
            top: 20,
          },
          geo: {
            type: 'map',
            map: 'ChinaMap',
            top: '5%',
            bottom: '5%',
            roam: true,
            itemStyle: {
              areaColor: '#2E72BF',
              borderColor: '#333',
            },
            label: {
              show: true
            },
          },
          legend: {
            left: '5%',
            bottom: '5%',
            orient: 'vertical' //控制图例方向
          },
        }
        this.chartInstance.setOption(initOption)
        this.chartInstance.on('click', async arg => {
          const ProvinceMapInfo = getProvinceMapInfo(arg.name)
          //判断当前请求的数据在mapData中是否存在
          if(!this.mapData[ProvinceMapInfo.key]){
            const ret = await axios.get('http://localhost:8999' + ProvinceMapInfo.path)
            this.mapData[ProvinceMapInfo.key] = ret.data
            this.$echarts.registerMap(ProvinceMapInfo.key, ret.data)
          }
          const changeOption = {
            geo:{
              map: ProvinceMapInfo.key,
            }
          }
          this.chartInstance.setOption(changeOption)
        })
      },
      async getData(ret) {
        // const {data: ret} = await this.$http.get('map')
        this.allData = ret
        // console.log(this.allData)
        this.updateChart()
      },
      //更新图表
      updateChart() {
        //图例的数据
        const legendArr = this.allData.map(item => {
          return item.name
        })
        const seriesArr = this.allData.map(item => {
          //return所有的散点数据
          //如果想在地图中显示散点，则需要在散点的图表中配置coordinateSystem:geo,来表示散点图使用地图的坐标系统
          return {
            type: 'effectScatter',
            rippleEffect: {
              scale: 5,
              brushType: 'stroke',//空心的涟漪动画效果
            },
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo',
          }
        })
        const dataOption = {
          series: seriesArr,
          legend: {
            data: legendArr
          }
        }
        this.chartInstance.setOption(dataOption)
      },
      screenUpdate() {
        const titleFontSize = this.$refs.map.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize / 1.5
            }
          },
          legend: {
            itemWidth: titleFontSize / 2,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2,
            textStyle: {
              fontSize: titleFontSize / 2
            }
          }
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      //回到中国地图
      revertMap(){
        const revertOption = {
          geo:{
            map:'ChinaMap'
          }
        }
        this.chartInstance.setOption(revertOption)
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