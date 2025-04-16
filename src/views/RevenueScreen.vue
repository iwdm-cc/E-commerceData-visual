<template>
    <div class="screen-container" :style="containerStyle">
      <header class="screen-header">
        <div>
          <img :src="headerSrc" alt="">
        </div>
        <span class="logo"></span>
        <span class="title">博学谷营收业绩分析</span>
        <div class="title-right">
          <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
          <span class="datetime">{{timeDate}}</span>
        </div>
      </header>
      <div class="screen-body">
        <section class="screen-left">
          <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
            <RevenueTrend ref="trend"></RevenueTrend>
            <div class="resize">
              <span @click="changeSize('trend')"
                    :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
          <div id="left-bottom" :class="[fullScreenStatus.course ? 'fullscreen' : '']">
            <CourseRevenue ref="course"></CourseRevenue>
            <div class="resize">
              <span @click="changeSize('course')"
                    :class="['iconfont', fullScreenStatus.course ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
        </section>
        <section class="screen-middle">
          <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
            <RevenueMap ref="map"></RevenueMap>
            <div class="resize">
              <span @click="changeSize('map')"
                    :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
          <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
            <RevenueRank ref="rank"></RevenueRank>
            <div class="resize">
              <span @click="changeSize('rank')"
                    :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
        </section>
        <section class="screen-right">
          <div id="right-top" :class="[fullScreenStatus.pie ? 'fullscreen' : '']">
            <RevenuePie ref="pie"></RevenuePie>
            <div class="resize">
              <span @click="changeSize('pie')"
                    :class="['iconfont', fullScreenStatus.pie ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
          <div id="right-bottom" :class="[fullScreenStatus.table ? 'fullscreen' : '']">
            <RevenueTable ref="table"></RevenueTable>
            <div class="resize">
              <span @click="changeSize('table')"
                    :class="['iconfont', fullScreenStatus.table ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  import RevenueTrend from '../components/revenue/RevenueTrend.vue'
  import RevenueMap from '../components/revenue/RevenueMap.vue'
  import RevenueRank from '../components/revenue/RevenueRank.vue'
  import RevenuePie from '../components/revenue/RevenuePie.vue'
  import RevenueTable from '../components/revenue/RevenueTable.vue'
  import CourseRevenue from '../components/revenue/CourseRevenue.vue'
  import {mapState} from 'vuex'
  import {getThemeValue} from '../utils/theme_utils'
  import {formatDate} from '../utils/utils'
  
  export default {
    created() {
      this.$socket.registerCallBack('fullScreen', this.recvData)
      this.$socket.registerCallBack('themeChange', this.recvThemeChange)
    },
    mounted() {
      this.startInterval()
    },
    destroyed() {
      this.$socket.unRegisterCallBack('fullScreen')
      this.$socket.unRegisterCallBack('themeChange')
      clearInterval(this.timeId)
    },
    data() {
      return {
        fullScreenStatus: {
          trend: false,
          course: false,
          map: false,
          rank: false,
          pie: false,
          table: false
        },
        timeDate:'',
        timeID: null
      }
    },
    methods: {
      changeSize(chartName) {
        const targetValue = !this.fullScreenStatus[chartName]
        this.$socket.send({
          action: 'fullScreen',
          socketType: 'fullScreen',
          chartName: chartName,
          value: targetValue
        })
      },
      recvData(data) {
        const chartName = data.chartName
        const targetValue = data.value
        this.fullScreenStatus[chartName] = targetValue
        this.$nextTick(() => {
          this.$refs[chartName].screenUpdate()
        })
      },
      handleChangeTheme() {
        this.$socket.send({
          action: 'themeChange',
          socketType: 'themeChange',
          chartName: '',
          value: ''
        })
      },
      recvThemeChange() {
        this.$store.commit('changeTheme')
      },
      startInterval() {
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => {
          let timeDate = new Date()
          this.timeDate = formatDate(timeDate, 'yyyy-MM-dddd  hh:mm:ss')
        }, 1000)
      }
    },
    components: {
      RevenueTrend,
      RevenueMap,
      RevenueRank,
      RevenuePie,
      RevenueTable,
      CourseRevenue
    },
    computed: {
      logoSrc() {
        return '/static/img/' + getThemeValue(this.theme).logoSrc
      },
      headerSrc() {
        return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
      },
      themeSrc() {
        return '/static/img/' + getThemeValue(this.theme).themeSrc
      },
      containerStyle() {
        return {
          backgroundColor: getThemeValue(this.theme).backgroundColor,
          color: getThemeValue(this.theme).titleColor
        }
      },
      ...mapState(['theme'])
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    z-index: 100;
  }
  
  .screen-container {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    background-color: #161522;
    color: #fff;
    box-sizing: border-box;
  }
  
  .screen-header {
    width: 100%;
    height: 64px;
    font-size: 20px;
    position: relative;
  
    div {
      img {
        width: 100%;
      }
    }
  
    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 20px;
      transform: translate(-50%, -50%);
    }
  
    .title-right {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-80%);
    }
  }
  
  .screen-body {
    width: 100%;
    height: calc(100% - 64px);
    display: flex;
    margin-top: 10px;
  
    .screen-left {
      height: 100%;
      width: 27.6%;
      margin-right: 10px;
  
      #left-top {
        height: 53%;
        position: relative;
        margin-bottom: 10px;
      }
  
      #left-bottom {
        height: 47%;
        position: relative;
      }
    }
  
    .screen-middle {
      height: 100%;
      width: 41.5%;
      margin-right: 10px;
  
      #middle-top {
        height: 56%;
        position: relative;
        margin-bottom: 10px;
      }
  
      #middle-bottom {
        height: 44%;
        position: relative;
      }
    }
  
    .screen-right {
      height: 100%;
      width: 27.6%;
  
      #right-top {
        height: 46%;
        position: relative;
        margin-bottom: 10px;
      }
  
      #right-bottom {
        height: 54%;
        position: relative;
      }
    }
  }
  
  .resize {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  </style>