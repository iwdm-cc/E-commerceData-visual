<template>

  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>退费综合分析</span>
    </div>

    <div style="margin-top: 50px">
      <RefundLineChart :timestamps="refundTimestamps" :amounts="refundAmounts"/>

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import RefundLineChart from "@/views/RefundLineChart.vue";
import RefundBarChart from "@/views/RefundBarChart.vue";
import {getThemeValue} from "@/utils/theme_utils";
import {mapState} from "vuex";

export default {
  name: "OrderChart",
  components: {RefundBarChart, RefundLineChart},
  data() {
    return {
      chartInstance: null,
      timestamps: [],
      prices: [],
      ws: null,
      refundTimestamps: [],
      refundAmounts: [],
      reasonDistribution: {},
      courseRank: {},

    };
  },
  mounted() {
    this.setupWebSocket()
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
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  },
  methods: {
    setupWebSocket() {
      this.ws = new WebSocket('ws://localhost:8000/ws/refund')
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        this.refundTimestamps.push(data.timestamp)
        this.refundAmounts.push(data.refund_amount)

        if (this.refundTimestamps.length > 20) {
          this.refundTimestamps.shift()
          this.refundAmounts.shift()
        }

        this.reasonDistribution = data.reason_distribution
        this.courseRank = data.course_rank
      }
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: {text: "订单金额折线图"},
        tooltip: {trigger: "axis"},
        xAxis: {type: "category", data: []},
        yAxis: {type: "value", name: "金额（元）"},
        series: [{name: "金额", type: "line", data: [], smooth: true}],
      });
    },
    connectWebSocket() {
      this.ws = new WebSocket("ws://localhost:8000/ws/orders");

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.timestamps.length >= 10) {
          this.timestamps.shift();
          this.prices.shift();
        }
        this.timestamps.push(data.timestamp);
        this.prices.push(data.price);

        this.chartInstance.setOption({
          xAxis: {data: this.timestamps},
          series: [{data: this.prices}],
        });
      };

      this.ws.onclose = () => {
        console.log("WebSocket 已关闭");
      };
    },
  },
};
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
