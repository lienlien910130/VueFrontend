<template>
  <el-table
    :data="tableData"
    :key="itemkey"
    border
    highlight-current-row
    style="width: 100%;"
    empty-text="暫無資料"
            >
    <el-table-column
      fixed
      type="index">
    </el-table-column>

    <template v-for="(item,index) in config">
        <el-table-column 
          align="left" 
          :label="item.label" 
          :key="index" 
          :prop="item.prop" 
          sortable
          header-align="center"
          :width="item.width"
        >
          <template slot-scope="scope">
              <span >{{  scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
    </template>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
          <el-button @click="handleUpdata(scope.row)" type="primary" size="small">編輯</el-button>
          <el-button type="info" size="small" @click="handleDelete(scope.row)">刪除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props:['tableData','itemkey','config'],
  methods:{
    handleUpdata(row){
        
    },
    handleDelete(row){
      this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
         }).then(() => {
            
         })
    },
  }
}
</script>