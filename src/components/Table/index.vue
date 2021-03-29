<template>
<div>
  <el-button 
    v-if="title !== 'building' && title !== 'graphic'" type="primary" 
    @click="title == 'address' ? OpenUpdate() : OpenCreate()" style="float:right">{{ title == 'address' ? '儲存' : '新增'}}</el-button>
  <el-table
    :data="tableData.filter(data => !search ||  data.name.toLowerCase().includes(search.toLowerCase()))"
    :key="itemkey"
    border
    highlight-current-row
    style="width: 100%;"
    empty-text="暫無資料"
    height="600">
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
              <span v-if="scope.column.property == 'status' && title !== 'address'"> 
                {{ scope.row[scope.column.property] | changeStatus }}</span>
              <span v-else-if="scope.column.property == 'status' && title == 'address'"> 
                {{ optionfilter(scope.row[scope.column.property])  }}</span>
              <span v-else-if="scope.column.property == 'removable'"> 
                {{ scope.row[scope.column.property] | changeRemoveable }}</span>
              <span v-else-if="scope.column.property == 'linkOwners' || 
              scope.column.property == 'linkFireManagers'"> 
                {{ changeUserName(scope.row[scope.column.property]) }}
              </span>
              <span v-else-if="scope.column.property == 'linkRoles'"> 
                {{  changeLinkRoles(scope.row[scope.column.property]) }}</span>
              <span v-else-if="scope.column.property == 'linkDeviceTypes'"> 
                {{  changeLinkDeviceType(scope.row[scope.column.property]) }}</span>
              <span v-else-if="scope.column.property == 'linkBuildings'"> 
                {{  changeLinkBuilding(scope.row[scope.column.property]) }}</span>
              <el-input v-else-if="scope.column.property == 'systemNumber' || 
              scope.column.property == 'circuitNumber' ||
              scope.column.property == 'address' "
              v-model="scope.row[scope.column.property]"
              :maxlength="item.maxlength"
              show-word-limit
              @change="checkupdate(scope.row)"
              @input="scope.row[scope.column.property] = scope.row[scope.column.property].replace(/[^\d]/g,'').replace(/\s*/g,'')">
              </el-input>
              <span v-else >{{  scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
    </template>
    <el-table-column
    v-if="hasColumn"
      width="250px"
      align="right"
      >
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
              v-if="option.status !== 'delete'"
              :type="option.type"
              size="small"
              @click="handleClickOption( scope.row, option.status)"
            >
              <span>{{ option.name }}</span>
            </el-button>
            <el-button
              v-else-if="scope.row.removable !== false"
              :type="option.type"
              size="small"
              @click="handleClickOption( scope.row, option.status)"
            >
              <span>{{ option.name }}</span>
            </el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="total > 0 && hasPagin" class="pagination-container">
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
    title: {
      type: String
    },
    tableData: {
      type: Array
    },
    itemkey: {
      type: Number,
      dafault : Math.random()
    },
    hasPagin:{
      type:Boolean,
      default:true
    },
    hasColumn:{
      type:Boolean,
      default:true
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
      type: Array,
      default: function() {
      return [
        { name:'編輯',type:'primary',status:'open'},
        { name:'刪除',type:'info',status:'delete'}]
      }
    },
    pageSizeList: {
      type: Array,
      default: function() {
        return [10, 30, 50, 100]
      }
    },
    selectId:{
      type: String
    }
  },
  filters:{
    changeStatus: function(val) {
      if(val == true){
        return '啟用'
      }else{
        return '禁用'
      }
    },
    changeRemoveable: function(val) {
      if(val == true){
        return '允許'
      }else{
        return '禁止'
      }
    },
    dataStr: function(value){
        return moment(value).format('YYYY-MM-DD')
    },
  },
  computed:{
    ...mapGetters([
      'buildingoptions',
      'buildingusers',
      'buildingdevices',
      'buildingcontactunit',
      'buildingroles',
      'buildingarray'
    ]),
    optionfilter(){
      return function (a) {
        if(a !== null && a !== undefined && this.buildingoptions.length>0){
          let _array = this.buildingoptions.filter((item, index) => 
              item.id == a 
          )
          return _array[0].textName
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
    changeLinkBuilding(){
      return function (val) {
        var array = []
        if(val !== null){
          val.forEach(item=>{
            var data = this.buildingarray.filter(element=>{
              return item.id == element.id
            })
            if(data.length) array.push(data[0].buildingName)
           
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
          val.forEach(item => {
          var data = this.buildingroles.filter(element=>{
              return item.id == element.id
            })
            array.push(data[0].name)
          })
          return array.toString()
        }
        return ''
      } 
    },
    changeLinkDeviceType(){
      return function (val) {
         var array = []
          if(val !== null){
            val.forEach(item => {
            var data = this.filterData.filter(element=>{
                return item.id == element.id
              })
              array.push(data[0].name)
            })
            return array.toString()
          }
          return ''
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
  data(){
    return{
      updateArray:[],
      search:''
    }
  },
  methods:{
    checkupdate(row){
      var index = this.updateArray.findIndex(d => d.id === row.id)
      if(index !== -1){
        this.updateArray[index].systemNumber = row.systemNumber
        this.updateArray[index].circuitNumber = row.circuitNumber
        this.updateArray[index].address = row.address
      }else{
        var data = {
          id:row.id,
          systemNumber:row.systemNumber,
          circuitNumber:row.circuitNumber,
          address:row.address
        }
        this.updateArray.push(data)
      }
      console.log(JSON.stringify(this.updateArray))
    },
    OpenCreate(){
      console.log('OpenUpdate')
      this.$emit('handleTableRow', '', 'create')
    },
    OpenUpdate(){
      console.log('OpenUpdate')
      this.$emit('handleTableRow', this.updateArray)
    },
    handleClickOption(row, option) {
      console.log('handleClickOption',JSON.stringify(row),option)
      if(option == 'delete'){
        this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
            this.$emit('handleTableRow',  row, option)
        })
      }else{
        this.$emit('handleTableRow',  row, option)
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

<style lang="scss" scoped>
.pagination-container{
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>