<template>
<div>
  <el-button type="primary" @click="OpenCreate">新增</el-button>
  <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
              <span v-if="scope.column.property == 'status'"> 
                {{ scope.row[scope.column.property] | changeStatus }}</span>
              <span v-else-if="scope.column.property == 'linkRoles'"> 
                {{  changeLinkRoles(scope.row[scope.column.property]) }}</span>
              <span v-else >{{  scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
    </template>
    <el-table-column
    width="350px"
      align="right">
      <template slot="header" >
        <el-input
          v-model="search"
          size="mini"
          placeholder="請輸入關鍵字搜尋"/>
      </template>
      <template slot-scope="scope">
         <span
            v-for="(option, index) in buttonsName"
            :key="index"
            class="button-margin-left"
          >
            <el-button
              size="small"
              :type="index == 0 ? 'primary' : 'info'"
              @click="handleClickOption(scope.$index, scope.row, option,$event)"
            >
              <span>{{ option }}</span>
            </el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="total > 0" class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="page"
        :page-sizes="pageSizeList"
        :page-size="limit"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
  </div>
</div>
</template>

<script>
export default {
  props:{
    tableData: {
      type: Array
    },
    itemkey: {
      type: Number
    },
    config: {
      type: Array
    },
    listQueryParams: {
      type: Object
    },
    filterData: {
      type: Array
    },
    buttonsName: {
      type: Array
    },
    pageSizeList: {
      type: Array,
      default: function() {
        return [10, 30, 50, 100]
      }
    },
  },
  filters:{
    changeStatus: function(val) {
      if(val == true){
        return '啟用'
      }else{
        return '禁用'
      }
    }
    
  },
  computed:{
    page: function() {
      return this.listQueryParams.page || 1
    },
    limit: function() {
      return this.listQueryParams.limit || 10
    },
    total: function() {
      return this.listQueryParams.total || 0
    },
    
  },
  watch:{
  },
  data(){
    return{
      search:''
    }
  },
  methods:{
    changeLinkRoles: function(val){
      if(val !== null){
        var _temp = []
        val.forEach(element => {
          var data = this.filterData.filter(item=>{
            return item.id == element
          })
          _temp.push(data[0].label)
        })
        return _temp.toString()
      }else{
        return ''
      }
    },
    OpenCreate(){
      this.$emit('handleTableRow', '', '', '新增')
    },
    handleClickOption(index, row, option) {
      if(option == '刪除'){
        this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            this.$emit('handleTableRow', index, row, option)
        })
      }else{
        this.$emit('handleTableRow', index, row, option)
      }
    },
    // 改變翻頁組件中每頁數據總數
    handleSizeChange(val) {
      this.listQueryParams.limit = val
      this.listQueryParams.page = 1 // 改變翻頁數目，將頁面=1
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('clickPagination', this.listQueryParams)
    },
    // 跳到當前是第幾頁
    handleCurrentChange(val) {
      this.listQueryParams.page = val
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('clickPagination', this.listQueryParams)
    },
  }
}
</script>

<style lang="scss" scoped>
.pagination-container{
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>