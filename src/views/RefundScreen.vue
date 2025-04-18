<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo"></span>
      <span class="title">博学谷退费分析{{ socketData }}</span>
      <p>{{ socketData }}</p>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
        <span class="datetime">{{ timeDate }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <RefundTrend ref="trend" :data="chartData.trendData"></RefundTrend>
          <div class="resize">
              <span @click="changeSize('trend')"
                    :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.course ? 'fullscreen' : '']">
          <CourseRefund ref="course" :data="chartData.courseData"></CourseRefund>
          <div class="resize">
              <span @click="changeSize('course')"
                    :class="['iconfont', fullScreenStatus.course ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <RefundMap ref="map" :data="chartData.mapData"></RefundMap>
          <div class="resize">
              <span @click="changeSize('map')"
                    :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <RefundRank ref="rank" :data="chartData.rankData"></RefundRank>
          <div class="resize">
              <span @click="changeSize('rank')"
                    :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.pie ? 'fullscreen' : '']">
          <RefundPie ref="pie" :data="chartData.pieData"></RefundPie>
          <div class="resize">
              <span @click="changeSize('pie')"
                    :class="['iconfont', fullScreenStatus.pie ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.table ? 'fullscreen' : '']">
          <RefundTable ref="table" :data="chartData.tableData"></RefundTable>
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
import RefundTrend from '../components/refund/RefundTrend.vue'
import RefundMap from '../components/refund/RefundMap.vue'
import RefundRank from '../components/refund/RefundRank.vue'
import RefundPie from '../components/refund/RefundPie.vue'
import RefundTable from '../components/refund/RefundTable.vue'
import CourseRefund from '../components/refund/CourseRefund.vue'
import {mapState} from 'vuex'
import {getThemeValue} from '@/utils/theme_utils'
import {formatDate} from '@/utils/utils'
import * as refundData from '../mock/refundData.js'
import SocketService from "@/utils/socket_service";

export default {
  created() {
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
    clearInterval(this.timeId)
  },
  data() {
    return {
      socketData: null,  // 存储 WebSocket 数据
      fullScreenStatus: {
        trend: false,
        course: false,
        map: false,
        rank: false,
        pie: false,
        table: false
      },
      timeDate: '',
      timeID: null,
      chartData: {
        trendData: {},
        courseData: {},
        rankData: {},
        mapData: [],
        pieData: {},
        tableData: {}
      }
    }
  },
  mounted() {
    this.startInterval()
    this.loadMockData()
    // 连接 WebSocket
    SocketService.Instance.connect();

    // 注册 WebSocket 数据回调
    SocketService.Instance.registerCallBack('socketDataType', this.handleSocketData);
  },
  beforeDestroy() {
    // 在组件销毁时取消回调
    SocketService.Instance.unRegisterCallBack('socketDataType');
  },
  methods: {
    // WebSocket 数据处理回调
    handleSocketData(data) {
      this.socketData = data;
      console.log('Received WebSocket Data:', data);
    },
    loadMockData() {
      try {
        console.log('开始加载模拟数据')

        // 确保数据格式正确
        this.chartData = {
          trendData: {
            title: '退款趋势',
            '近一周': refundData.trendData['近一周'].map(item => ({
              date: item.date,
              value: item.count,
              amount: item.amount
            })),
            '近一月': refundData.trendData['近一月'].map(item => ({
              date: item.date,
              value: item.count,
              amount: item.amount
            })),
            '近三月': refundData.trendData['近三月'].map(item => ({
              date: item.date,
              value: item.count,
              amount: item.amount
            })),
            '近一年': refundData.trendData['近一年'].map(item => ({
              date: item.date,
              value: item.count,
              amount: item.amount
            }))
          },
          courseData: {
            title: '课程退款分布',
            type: refundData.courseData.types,
            month: refundData.courseData.month,
            quarter: refundData.courseData.quarter,
            year: refundData.courseData.year
          },
          rankData: {
            title: '退款排名',
            type: refundData.rankData.type,
            course: refundData.rankData.course,
            teacher: refundData.rankData.teacher
          },
          mapData: refundData.mapData,
          pieData: {
            title: '退款分布',
            type: refundData.pieData.type,
            category: refundData.pieData.category,
            reason: refundData.pieData.reason
          },
          tableData: {
            title: '退款明细',
            type: refundData.tableData.type,
            detail: refundData.tableData.detail,
            summary: refundData.tableData.summary
          }
        }

        console.log('数据转换完成：', this.chartData)

        // 使用 $nextTick 确保组件已经挂载
        this.$nextTick(() => {
          // 更新每个组件的数据
          Object.keys(this.$refs).forEach(refKey => {
            const component = this.$refs[refKey]
            if (component && typeof component.updateChart === 'function') {
              console.log(`更新组件 ${refKey} 的数据:`, this.chartData[`${refKey}Data`])
              component.allData = this.chartData[`${refKey}Data`]
              component.updateChart()
            }
          })
        })
      } catch (error) {
        console.error('数据加载失败：', error)
        console.error('错误堆栈：', error.stack)
      }
    },
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
        if (chartName === 'trend' || chartName === 'course' || chartName === 'map') {
          this.$refs[chartName].screenAdapter()
        } else {
          this.$refs[chartName].screenUpdate()
        }
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
    RefundTrend,
    RefundMap,
    RefundRank,
    RefundPie,
    RefundTable,
    CourseRefund
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
