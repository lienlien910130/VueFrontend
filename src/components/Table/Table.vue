<template>
  <div>
    <el-table
      :key="itemkey"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;"
      empty-text="暫無資料"
      >

            <el-table-column
            fixed
            type="index">
            </el-table-column>

            <el-table-column 
                v-for="(item,index) in config"
                align="left" 
                :label="item.label" 
                :key="index" 
                :prop="item.prop" 
                sortable
                header-align="center"
                >
                <template slot-scope="scope">
                        <div v-if="scope.column.property == 'lackContent'"
                            v-html="stringToBr(scope.row[scope.column.property])">
                        </div>
                        <span v-else-if="scope.column.property == 'status'">
                            {{  changeOptionName(scope.row[item.prop]) }}
                        </span>
                        <span v-else-if="scope.column.property == 'dateOfFailure' || 
                          scope.column.property == 'dateOfCallRepair' || 
                          scope.column.property == 'completedTime' " style="width:150px"> 
                            {{ dataStr(scope.row[scope.column.property],'YYYY-MM-DD') }}
                        </span>
                        <span v-else-if="scope.column.property == 'processStatus' || scope.column.property == 'processContent'"> 
                            {{  changeOptionName(scope.row[scope.column.property]) }}
                        </span>
                        <span v-else-if="scope.column.property == 'linkDevices'"> 
                            {{ changeDevice(scope.row[scope.column.property]) }}
                        </span>
                        <span v-else-if="scope.column.property == 'linkContactUnits'"> 
                            {{ changeContainUnit(scope.row[scope.column.property]) }}
                        </span>
                        <span v-else-if="scope.column.property == 'linkInspectionLacks'"> 
                            {{ changeInspectionLack(scope.row[scope.column.property]) }}
                        </span>
                        <span v-else>{{  scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
            
            <el-table-column
            fixed="right"
            label="操作">
            <template slot="header" >
                <i class="el-icon-circle-plus-outline" 
                @click="handleTableClick('empty','')" 
                style="cursor: pointer;font-size:25px;float:right"></i>
            </template>
            <template slot-scope="scope">
                <el-button v-if="title !== 'lack'" @click="handleTableClick('openfiles',scope.row)" type="primary" size="small">
                  <i class="el-icon-folder-opened"  
                  style="cursor: pointer;float:right"></i>
                </el-button>
                <el-button @click="handleTableClick('open',scope.row)" type="primary" size="small">編輯</el-button>
                <el-button type="info" size="small" @click="handleTableClick('delete',scope.row)">刪除</el-button> 
            </template>
            </el-table-column>
    </el-table>

        <div v-if="total > 0 " class="pagination-container">
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
import computedmixin  from '@/mixin/computedmixin'

export default {
  name: 'Table',
  mixins:[computedmixin],
  props:{
    itemkey: {
      type: Number,
      dafault : Math.random()
    },
    title: {
      type: String
    },
    tableData:{
      type: Array
    },
    config:{
      type: Array,
      required: true
    },
    listQueryParams: {
      type: Object
    },
    pageSizeList: {
      type: Array,
      default: function() {
        return [5, 10, 30, 50]
      }
    },
  },
  data(){
    return {
      temp:[]
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
    }
  },
  methods:{
    handleTableClick(index,row){
      var title = this.title === 'maintainList' ? 'maintain' : ''
      if(index === 'delete'){
        this.$confirm('是否確定刪除該筆資料?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
        }).then(() => {
        this.$emit('handleTableClick',title, index , row)
        }).catch(() => {})
      }else{
        this.$emit('handleTableClick',title, index , row)
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
    }
  }
}
</script>