<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div class="header-left">
        <img :src="headerSrc" alt="">
        <span class="logo"></span>
      </div>
      <span class="title">博学谷课程报名分析</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
        <span class="datetime">{{timeDate}}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <EnrollmentTrend ref="trend" :data="chartData.trend"></EnrollmentTrend>
          <div class="resize">
            <span @click="changeSize('trend')"
                  :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.course ? 'fullscreen' : '']">
          <CourseEnrollment ref="course" :data="chartData.course"></CourseEnrollment>
          <div class="resize">
            <span @click="changeSize('course')"
                  :class="['iconfont', fullScreenStatus.course ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <EnrollmentRank ref="rank" :data="chartData.rank"></EnrollmentRank>
          <div class="resize">
            <span @click="changeSize('rank')"
                  :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.pie ? 'fullscreen' : '']">
          <EnrollmentPie ref="pie" :data="chartData.pie"></EnrollmentPie>
          <div class="resize">
            <span @click="changeSize('pie')"
                  :class="['iconfont', fullScreenStatus.pie ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.table ? 'fullscreen' : '']">
          <EnrollmentTable ref="table" :data="chartData.table"></EnrollmentTable>
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
import EnrollmentTrend from '../components/enrollment/EnrollmentTrend.vue'
import EnrollmentMap from '../components/enrollment/EnrollmentMap.vue'
import EnrollmentRank from '../components/enrollment/EnrollmentRank.vue'
import EnrollmentPie from '../components/enrollment/EnrollmentPie.vue'
import EnrollmentTable from '../components/enrollment/EnrollmentTable.vue'
import CourseEnrollment from '../components/enrollment/CourseEnrollment.vue'
import {mapState} from 'vuex'
import {getThemeValue} from '@/utils/theme_utils'
import {formatDate} from '@/utils/utils'
import { trendData, courseData, rankData, pieData, tableData } from '@/mock/enrollmentData'

export default {
  created() {
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  mounted() {
    this.startInterval()
    this.loadMockData()
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
      timeID: null,
      chartData: {
        trend: null,
        course: null,
        rank: null,
        pie: null,
        table: null
      }
    }
  },
  methods: {
    loadMockData() {
      // 直接使用mock数据
      this.chartData = {
        trend: trendData,
        course: courseData,
        rank: rankData,
        pie: pieData,
        table: tableData
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
        this.timeDate = formatDate(timeDate, 'yyyy-MM-dd hh:mm:ss')
      }, 1000)
    }
  },
  components: {
    EnrollmentTrend,
    EnrollmentMap,
    EnrollmentRank,
    EnrollmentPie,
    EnrollmentTable,
    CourseEnrollment
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  box-sizing: border-box;
  overflow: hidden;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 0 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  
  .header-left {
    display: flex;
    align-items: center;
    
    img {
      height: 40px;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 24px;
    font-weight: bold;
    transform: translate(-50%, -50%);
    background: linear-gradient(to right, #00c6ff, #0072ff);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .title-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .qiehuan {
      cursor: pointer;
      width: 24px;
      height: 24px;
      transition: transform 0.3s;
      &:hover {
        transform: rotate(180deg);
      }
    }
    
    .datetime {
      font-size: 16px;
      background: rgba(255,255,255,0.1);
      padding: 5px 10px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }
}

.screen-body {
  width: 100%;
  height: calc(100% - 84px);
  display: flex;
  gap: 15px;

  section {
    height: 100%;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    overflow: hidden;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
  }

  .screen-left {
    width: 27.6%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    #left-top {
      height: 53%;
      position: relative;
      background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    #left-bottom {
      height: 47%;
      position: relative;
      background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;

    #middle-bottom {
      height: 100%;
      position: relative;
      background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
  }

  .screen-right {
    height: 100%;
    width: 30.9%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    #right-top {
      height: 46%;
      position: relative;
      background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    #right-bottom {
      height: 54%;
      position: relative;
      background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
      border-radius: 10px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
  }
}

.resize {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  z-index: 10;
  background: rgba(0,0,0,0.3);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(0,0,0,0.5);
  }
  
  .iconfont {
    color: #fff;
    font-size: 18px;
  }
}

@media screen and (max-width: 1600px) {
  .screen-body {
    flex-direction: column;
    
    section {
      width: 100% !important;
      height: 33.33% !important;
    }
    
    .screen-left, .screen-right {
      flex-direction: row;
      
      #left-top, #left-bottom, #right-top, #right-bottom {
        width: 50%;
        height: 100% !important;
      }
    }
  }
}
</style>
