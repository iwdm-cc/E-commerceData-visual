<template>
  <div class="table-container">
    <div class="table-title">课程报名详情</div>
    <div class="table-content">
      <table>
        <thead>
          <tr>
            <th>课程名称</th>
            <th>讲师</th>
            <th>报名人数</th>
            <th>完成率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.course }}</td>
            <td>{{ item.teacher }}</td>
            <td>{{ item.students }}</td>
            <td>{{ item.completion }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnrollmentTable',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  .table-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #fff;
    text-align: center;
  }

  .table-content {
    width: 100%;
    height: calc(100% - 40px);
    overflow: auto;
    
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      th {
        background-color: rgba(255,255,255,0.1);
        color: #fff;
        font-weight: bold;
      }
      
      tr:hover {
        background-color: rgba(255,255,255,0.05);
      }
    }
  }
}
</style>
