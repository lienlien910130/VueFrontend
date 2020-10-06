<template>
  <div>
    <!-- 表頭 -->
    <!-- <div v-if="title" class="table-title">{{ title }}</div> -->
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
        新增
    </el-button>
    <!-- 表格主體 -->
    <el-table
      :ref="ref"
      v-loading="listLoading"
      :data="tableData"
      border
      :element-loading-text="loadingText"
      :header-cell-style="{ backgroundColor: '#e5e9f2', color: '#333' }"
      highlight-current-row
      stripe
      size="small"
      empty-text="暫無數據"
      :default-sort = "{prop: sort, order: 'descending'}"
    >
    <!-- 有展開 -->
    <el-table-column v-if="isExpand" :type="isExpand == true ? 'expand' : undefined">
      <template slot-scope="scope" >
        <el-form label-position="left" inline class="demo-table-expand" >
          <el-form-item
                 v-for="(item, index) in config_all"
                 :key="index"
                 :prop="item.prop"
                 :label="item.label"
                >
                <span v-if="item.format == 'YYYY' | item.format === 'YYYY-MM-DD'">{{ dataStr(scope.row[item.prop],item.format) }}</span>
                <el-tag 
                v-else-if="item.format == 'tag' "
                :type=" scope.row[item.prop] === false ? 'danger' : '' "
                > {{ tagChange(scope.row[item.prop]) }}</el-tag>

                <span v-else> {{ scope.row[item.prop] }}</span>
            </el-form-item>
        </el-form>
      </template>
    </el-table-column> 

    <el-table-column v-if="isShowNumber"  type="index" :index="tableIndex"></el-table-column>
   
    <el-table-column
    v-for="(item, index) in config"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      sortable >
      <template slot-scope="scope">
        <span v-if="item.format == 'YYYY' | item.format === 'YYYY-MM-DD'">
          {{ dataStr(scope.row[item.prop],item.format) }}</span>
                <el-tag 
                v-else-if="item.format == 'tag' "
                :type=" scope.row[item.prop] === false ? 'danger' : '' "
                > {{ tagChange(scope.row[item.prop]) }}</el-tag>

                <span v-else> {{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
   
      <!-- 表格操作按鈕欄 -->
      <el-table-column
        v-if="isHasButtons"
        class="clearfix"
        :width="optionColumnWidth+'px'"
      >
        <template slot-scope="scope">
          <!-- 基本操作 -->
          <span
            v-for="(option, index) in buttonsName"
            :key="index"
            class="button-margin-left"
          >
            <el-button
              size="small"
              :type="index == 0 ? 'primary' : ''"
              @click="handleClickOption(scope.$index, scope.row, option,$event)"
            >
              <span >{{ option }}</span>
            </el-button>
          </span>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁組件 -->
    <div v-if="isShowPagination && total > 0" class="pagination-container">
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


    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
        <el-form-item 
            v-for="(item, index) in config_all"
            :key="index"
            :prop="item.prop"
            :label="item.label"
        >
          <el-date-picker 
          v-if="item.format == 'YYYY'" 
          v-model="temp[item.prop]" type="year" /> 
         
          <el-date-picker 
          v-else-if="item.format == 'YYYY-MM-DD'" 
          v-model="temp[item.prop]" type="date" /> 

          <el-checkbox 
          v-else-if="item.format == 'tag' "
          v-model="temp[item.prop]"
          >
          {{ checkboxChange(temp[item.prop]) }}

          </el-checkbox>

          <el-input v-else
          :ref="item.prop"
          :name="item.prop"
          v-model="temp[item.prop]" >
          </el-input>

        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelData()">
          取消
        </el-button>
        <el-button type="primary" @click="sendData()">
          儲存
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

import moment from 'moment';
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'AppTable',
  directives: { elDragDialog },
  props: {
    isShowNumber: {
      type: Boolean,
      default: true
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    isShowPagination: {
      type: Boolean,
      default: true
    },
    isHasButtons: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    tableData: {
      type: Array,
      required: true
    },
    config: {
      type: Array,
      required: true
    },
    config_all: {
      type: Array,
      required: true
    },
    loadingText: {
      type: String,
      default: '加載中...'
    },
    loadingStatus: {
      type: Boolean,
      default: false
    },
    listQueryParams: {
      type: Object
    },
    buttonsName: {
      type: Array
    },
    optionColumnWidth: {
      type: Number,
      default: 100
    },
    pageSizeList: {
      type: Array,
      default: function() {
        return [15, 30, 50, 100]
      }
    },
    sort: {
      type: String
    }
  },
  watch: {
    sort:{
      deep:true,
      immediate:true
    }
  },
  computed: {
    // 看是否是多選表格
    ref: function() {
      return undefined
    },
    // 第幾頁
    page: function() {
      return this.listQueryParams.page || 1
    },
    // 每頁數據數
    limit: function() {
      return this.listQueryParams.limit || 15
    },
    // 數據總數
    total: function() {
      return this.listQueryParams.total || 0
    },
    // 獲取當前loading的狀態
    listLoading: function() {
      return this.loadingStatus
    },
    dataStr(){
        return function (a,b) {
            return moment(a).format(b)
        }
    },
    tagChange(){
        return function (a) {
            if(this.title == 'ReportInspectio' | this.title == 'ReportPublic'){
                switch(a){
                    case false:
                        return '未改善'
                        break;
                    case true:
                        return '已改善'
                        break;    
                }
            }else if(this.title == 'ContactUnit'){
                switch(a){
                    case false:
                        return '未配合'
                        break;
                    case true:
                        return '配合中'
                        break;    
                }
            }
        }
    },
    checkboxChange(){
      return function (a) {
            if(this.title == 'ReportInspectio' | this.title == 'ReportPublic'){
              return '改善'
            }else if(this.title == 'ContactUnit'){
               return '配合'
            }
      }
    }

  },
  data() {
    return {
          dialogFormVisible: false,
          textMap: {
            update: '編輯',
            create: '新增'
          },
          dialogStatus: '',
          temp: {},
          origin:[] 
      }
  },
  methods: {
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        //this.$refs['dataForm'].clearValidate()
      })
      this.temp = {}
    },
    // 刪除跟編輯的操作
    handleClickOption(index, row, option) {
      if (option === '刪除') {
        this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.dialogStatus = 'delete'
          if(this.title == 'Floor'){
            let content = {
              id: row.id,
              fid: row.id
            }
            this.$emit('subOpitonButton', this.dialogStatus, content)
          }else{
            this.$emit('subOpitonButton', this.dialogStatus, row.id)
          }
        }).catch(() => {
          this.dialogStatus = ''
        });
      } else {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
            //this.$refs.form.clearValidate()
        })
        this.temp = Object.assign({}, row)
      } 
    },
    cancelData(){
       this.dialogFormVisible = false
    },
    //新增或更新的操作
    sendData(){
      const tempData = Object.assign({}, this.temp)
      this.$emit('subOpitonButton', this.dialogStatus, tempData)
      // this.$refs.dataForm.validate(valid =>{
      //   if(valid){
      //     this.$message('submit!')
      //     this.$emit('subOpitonButton', this.dialogStatus, this.temp)
      //   }
      // })
    },
    // 改變翻頁組件中每頁數據總數
    handleSizeChange(val) {
      this.listQueryParams.limit = val
      // 改變翻頁數目，將頁面=1
      this.listQueryParams.page = 1
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('subClickPagination', this.listQueryParams)
    },

    // 跳到當前是第幾頁
    handleCurrentChange(val) {
      this.listQueryParams.page = val
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('subClickPagination', this.listQueryParams)
    },

    // 重寫索引生成方法
    tableIndex(index) {
      const i = (this.page - 1) * this.limit + index + 1
      return i
    },
  }
}
</script>

<style lang="scss" scoped>
.image-size {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.table-title {
  margin-top: 10px;
  font-size: 18px;
}

.button-margin-left {
  margin-left: 8px;
}
.link {
  cursor: pointer;
  color: #4876ff;
}
.el-table {
  .el-table__empty-block {
    height: unset;
  }
}
 .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 200px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>