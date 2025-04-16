<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎'+ showTitle}}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="ifShowChoice = !ifShowChoice">&#xe6eb</span>
      <div class="select-con" v-show="ifShowChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleChoice(item.key)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="table-wrapper" ref="tableWrapper">
      <table class="revenue-table" :style="tableStyle">
        <thead>
          <tr>
            <th v-for="col in currentColumns" :key="col.key">{{col.title}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in currentData" :key="index">
            <td v-for="col in currentColumns" :key="col.key">
              {{formatValue(row[col.key])}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '../../utils/theme_utils'

export default {
  name: "RevenueTable",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      allData: null,
      ifShowChoice: false,
      choiceType: 'detail',
      titleFontSize: 0
    }
  },
  created() {
    if (Object.keys(this.data).length > 0) {
      this.allData = this.data
    } else {
      this.$socket.registerCallBack('revenueTableData', this.getData)
    }
  },
  mounted() {
    if (!this.allData) {
      this.$socket.send({
        action: 'getData',
        socketType: 'revenueTableData',
        chartName: 'revenueTable',
        value: ''
      })
    }
    window.addEventListener('resize', this.screenUpdate)
    this.screenUpdate()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenUpdate)
    if (!this.data) {
      this.$socket.unRegisterCallBack('revenueTableData')
    }
  },
  methods: {
    getData(ret) {
      this.allData = ret
      this.$nextTick(() => {
        this.screenUpdate()
      })
    },
    screenUpdate() {
      if (this.$refs.tableWrapper) {
        this.titleFontSize = this.$refs.tableWrapper.offsetWidth / 100 * 3.6
      }
    },
    handleChoice(type) {
      this.choiceType = type
      this.ifShowChoice = false
    },
    formatValue(value) {
      if (typeof value === 'number') {
        if (value > 10000) {
          return (value / 10000).toFixed(2) + '万'
        }
        return value.toLocaleString()
      }
      if (value === undefined || value === null) {
        return '-'
      }
      return value
    }
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    currentColumns() {
      if (!this.allData || !this.allData[this.choiceType]) {
        return []
      }
      if (!this.allData[this.choiceType].columns) {
        const firstRow = this.allData[this.choiceType].data[0] || {}
        return Object.keys(firstRow).map(key => ({
          key,
          title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
        }))
      }
      return this.allData[this.choiceType].columns
    },
    currentData() {
      if (!this.allData || !this.allData[this.choiceType]) {
        return []
      }
      return this.allData[this.choiceType].data || []
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize / 1.15 + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle() {
      return {marginLeft: this.titleFontSize / 2.5 + 'px'}
    },
    tableStyle() {
      return {
        color: getThemeValue(this.theme).titleColor,
        fontSize: this.titleFontSize * 0.8 + 'px'
      }
    },
    ...mapState(['theme'])
  }
}
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9;
  font-weight: bold;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
    padding: 5px 0;
    border-radius: 3px;

    .select-item {
      padding: 5px 10px;
      cursor: pointer;
      
      &:hover {
        background-color: #2a2f3c;
      }
    }
  }
}

.com-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  height: 100%;
  padding: 60px 20px 20px;
  box-sizing: border-box;
  overflow: auto;
}

.revenue-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style> 