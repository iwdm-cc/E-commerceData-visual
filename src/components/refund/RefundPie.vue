<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>实时退费原因分布图</span>
    </div>
    <div ref="pieChart" style="width: 100%; height: 100%">
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {getThemeValue} from "@/utils/theme_utils";
import {mapState} from "vuex";

export default {
  name: 'RefundPieChart',
  props: ['reasonDistribution'],
  mounted() {
    this.chart = echarts.init(this.$refs.pieChart)
    this.updateChart()
  },
  watch: {
    reasonDistribution() {
      this.updateChart()
    }
  },
  computed: {

    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    updateChart() {
      this.chart.setOption({
        tooltip: {trigger: 'item'},
        series: [{
          name: '退费原因',
          type: 'pie',
          radius: '50%',
          data: Object.entries(this.reasonDistribution).map(([key, value]) => ({name: key, value}))
        }]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(6, 30, 65, 0.6), rgba(6, 30, 65, 0.8));
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 40px);
  height: 40px;
  text-shadow: 0 0 10px rgba(0, 100, 255, 0.6);
}

.type-selector {
  display: flex;
  margin-right: 20px;
  flex-wrap: nowrap;

  .type-item {
    padding: 2px 10px;
    margin: 0 5px;
    font-size: 0.8em;
    border-radius: 15px;
    background: rgba(61, 85, 125, 0.4);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover {
      background: rgba(61, 85, 125, 0.7);
      color: #fff;
    }

    &.active {
      background: rgba(0, 152, 217, 0.4);
      color: #fff;
      box-shadow: 0 0 10px rgba(0, 152, 217, 0.3);
    }
  }
}

.com-chart {
  width: 100%;
  height: calc(100% - 40px);
  margin-top: 40px;
  position: relative;
}
</style>
