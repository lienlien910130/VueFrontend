<template>
<div>
  <div v-if="floorinformation !== ''">
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button 
      :loading="downloadLoading" 
      style="margin:0 0 20px 20px;" 
      type="primary" 
      icon="el-icon-document" 
      @click="handleDownload">
      Export Excel
      </el-button>
  </div>

  <el-table 
  :key="tableKey"
  :data="floorlist" 
  border 
  fit 
  highlight-current-row 
  style="width: 100%" 
  stripe
  empty-text="請選擇樓層"
  >
    <template v-for="item in floorcollist">
      <el-table-column 
      align="center" 
      :label="item.name" 
      :key="item.key" 
      :prop="item.value" 
      >
          <template slot-scope="scope">
            <span>{{  scope.row[scope.column.property] }}</span>
          </template>
      </el-table-column>
    </template>
  </el-table>

  <!-- <pagination 
  v-show="total>0" 
  :total="total" 
  :page.sync="listQuery.page" 
  :limit.sync="listQuery.limit" 
  @pagination="getList" /> -->

</div>
</template>

<script>

import {  } from '@/api/building'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import FilenameOption from '@/components/Excel/FilenameOption'
import AutoWidthOption from '@/components/Excel/AutoWidthOption'
import BookTypeOption from '@/components/Excel/BookTypeOption'

export default {
  props: ['selectbuild','floorinformation'],
  components: { 
    Pagination: () => import('@/components/Pagination'),
    FilenameOption: () => import('@/components/Excel/FilenameOption'),
    AutoWidthOption: () => import('@/components/Excel/AutoWidthOption'),
    BookTypeOption: () => import('@/components/Excel/BookTypeOption'),
  },
  directives: { waves: () => import('@/directive/waves') },
  data() {
    return {
      floorlist: null,
      listQuery: {
        page: 1,
        limit: 10,
        type: this.type,
        sort: '+id',
        id:''
      },
      total: 0,
      loading: false,
      floorcollist:[
        { name:'編號' , value:'number'},
        { name:'名稱' , value:'name'},
        { name:'電話' , value:'phone'},
        { name:'緊急連絡人' , value:'nameurgent'},
        { name:'緊急電話' , value:'urgent'},
        { name:'檔案' , value:'file'},
        { name:'備註' , value:'remarks'}],
      tableKey:0,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  mounted() {
  },
  watch: {
    selectbuild: function() {
      this.listQuery.id = this.selectbuild
    },
    floorinformation: function(){
      this.floorlist = this.floorinformation
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['編號', '名稱', '電話', '緊急連絡人', '緊急電話','備註']
        const filterVal = ['number', 'name', 'phone', 'nameurgent', 'urgent','remarks']
        const list = this.floorlist
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

