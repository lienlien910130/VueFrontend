<template>
<div>
  <el-table 
  :key="tableKey"
  :data="list" 
  border 
  fit 
  highlight-current-row 
  style="width: 100%" 
  stripe
  :default-sort = "{prop: 'state', order: 'descending'}"
  >
    <template v-for="item in columnlist">
    <el-table-column 
      v-if="item.value === 'id' "  
      align="center" 
      :label="item.name" 
      :key="item.key" 
      :prop="item.value"  
      width="80"
      sortable
      >
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
    </el-table-column>
     <el-table-column 
     v-else 
     align="center" 
     :label="item.name" 
     :key="item.key" 
     :prop="item.value" 
     :sortable="item.value === 'state' ? true : false"
     :width="item.value === 'address' ? 300 : 'auto' "
     >
        <template slot-scope="scope">
          <el-tag 
          v-if="scope.column.property === 'state'"
          :type=" scope.row[scope.column.property] === '0' ? 'danger' : '' "
          disable-transitions>{{ scope.row[scope.column.property] === '0' ? '未配合':'配合中' }}</el-tag>

          <span v-else>{{  scope.row[scope.column.property] }}</span>
        </template>
     </el-table-column>
    </template>
  </el-table>

  <pagination 
  v-show="total>0" 
  :total="total" 
  :page.sync="listQuery.page" 
  :limit.sync="listQuery.limit" 
  @pagination="getList" />

</div>
</template>

<script>

import { fetchList } from '@/api/building'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

export default {
  props: ['type','selectbuild'],
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 10,
        type: this.type,
        sort: '+id',
        id:''
      },
      total: 0,
      loading: false,
      columnlist:[],
      tableKey:0
    }
  },
  mounted() {
    if(this.listQuery.id !== '') {
        
    }
    //this.getList()
  },
  watch: {
    selectbuild: function() {
      this.listQuery.id = this.selectbuild
      //this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.fetchcolumnlist(response.data.items)
        this.total = response.data.total
      }).catch(error => {
        console.log("error=>"+error);
      })
    },
    fetchcolumnlist(data) {
      if(this.type === 'MC'){
        this.columnlist = [
          { name:'項次' , value:'id'},
          { name:'所屬單位' , value:'job'},
          { name:'職稱' , value:'title'},
          { name:'姓名' , value:'name'},
          { name:'電話' , value:'phone'},
          { name:'緊急電話' , value:'urgent'},
          { name:'備註' , value:'remarks'}]
      }else {
        this.columnlist = [
          { name:'項次' , value:'id'},
          { name:'姓名' , value:'name'},
          { name:'電話' , value:'phone'},
          { name:'地址' , value:'address'},
          { name:'備註' , value:'remarks'},
          { name:'狀態' , value:'state'}
        ]
      }
      this.list = data
      this.loading = false
    }
  }
}
</script>

