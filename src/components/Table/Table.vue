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
                        v-html="stringToBr(scope.row[scope.column.property])"></div>
                        <span v-else-if="scope.column.property == 'status'">
                        {{  changeLabel(scope.row[item.prop]) }}
                        </span>

                        <span v-else-if="scope.column.property == 'dateOfFailure' || 
                          scope.column.property == 'dateOfCallRepair' || 
                          scope.column.property == 'completedTime' " style="width:150px"> 
                            {{ scope.row[scope.column.property] | dataStr }}</span>
                          <span v-else-if="scope.column.property == 'processStatus'"> 
                            {{  changeLabel(scope.row[scope.column.property]) }}
                          </span>
                          <span v-else-if="scope.column.property == 'linkDevices'"> 
                            {{ changeDevice(scope.row[scope.column.property]) }}
                          </span>
                          <span v-else-if="scope.column.property == 'linkContactUnits'"> 
                            {{ changeContainUnit(scope.row[scope.column.property]) }}
                          </span>
                          <span v-else-if="scope.column.property == 'linkInspectionLacks'"> 
                            <i v-if="scope.row[scope.column.property].length == 0" class="el-icon-close"></i>
                            <i v-else class="el-icon-check"></i>
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
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
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
  filters:{
    dataStr: function(value){
        return moment(value).format('YYYY-MM-DD')
    }
  },
  computed:{
    ...mapGetters([
      'buildingoptions',
      'buildingusers',
      'buildingdevices',
      'buildingcontactunit'
    ]),
    changeLabel(){
            return function (value) {
                if(value !== null){
                    let _array = this.buildingoptions.filter((item, index) => 
                        item.id == value 
                    )
                    return _array[0].textName
                }
                return ""
            }
    },
    optionfilter(){
      return function (a) {
        if(a !== null ){
          let _array = this.buildingoptions.filter((item, index) => 
            item.classType == a 
            )
          return _array
        }else{
          return ""
        }
      }   
    },
    changeDevice(){
      return function (val) {
        var array = []
        if(val !== null){
          val.forEach(item=>{
            var data = this.buildingdevices.filter(element=>{
              return item.id == element.id
            })
            array.push(data[0].name)
          })
          return array.toString()
        }
        return ''
      }
    },
    changeContainUnit(){
      return function (val) {
        var array = []
        if(val !== null){
          val.forEach(item=>{
            var data = this.buildingcontactunit.filter(element=>{
              return item.id == element.id
            })
            array.push(data[0].name)
          })
          return array.toString()
        }
        return ''
      } 
    },
    changeUserName(){
      return function (val) {
        var array = []
        if(val !== null){
          val.forEach(item=>{
            var data = this.buildingusers.filter(element=>{
              return item.id == element.id
            })
            array.push(data[0].name)
          })
          return array.toString()
        }
        return ''
      } 
    },
    changeLinkRoles(){
      return function (val) {
        var array = []
        if(val !== null){
          val.forEach(element => {
          var data = this.$obj.Authority.buildingRole.filter(item=>{
              return item.id == element
            })
            array.push(data[0].name)
          })
          return array.toString()
        }
        return ''
      } 
    },
    stringToBr(){
        return function (a) {
            return a.replace(/{ln}/g, "<br/>")
        }
    },
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
        this.$emit('handleTableClick',title, index , row.id)
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
    },
  }
}
</script>