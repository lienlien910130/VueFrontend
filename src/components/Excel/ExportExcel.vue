<template>
  <div>
    <div class="rowdiv">
        <label class="rowlabel" >檔案名稱: </label>
        <el-input v-model="filename" placeholder="請輸入檔案名稱(預設excel-list)" 
        style="width:80%" prefix-icon="el-icon-document" />
    </div>
    <div class="rowdiv">
        <label class="rowlabel" >表格寬度: </label>
        <el-radio-group v-model="autoWidth" style="width:80%">
          <el-radio :label="true" border>
            自動調整
          </el-radio>
          <el-radio :label="false" border>
            不自動調整
          </el-radio>
        </el-radio-group>
    </div>
    <div class="rowdiv">
        <label class="rowlabel" >檔案類型: </label>
        <el-select v-model="bookType" style="width:80%">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
    </div>
    <el-button :loading="downloadLoading" style="float:right"  type="primary" icon="el-icon-document" 
        @click="handleDownload">
          匯出
    </el-button>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ExportExcel',
  props:{
    exportExcelData: {
      type: Array,
      default: function () {
          return []
      }
    },
    config: {
      type: Array
    },
    title:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      options: ['xlsx', 'csv', 'txt']
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var array = this.config.filter(item=>{ return item.isHidden == false})
        const tHeader = array.map(item=>item.label)
        const filterVal = array.map(function(element){
          return {
            prop:element.prop,
            format:element.format
          }
        })
        const list = this.exportExcelData
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
        if (j.format == 'YYYY-MM-DD') {
          return moment(v[j.prop]).format(j.format)
        } else if (typeof v[j.prop] == 'object') {
          return v[j.prop].map(item => item.getName())
        } else {
          return v[j.prop]
        }
      }))
    }
  }
}
</script>

<style>
.rowdiv{
  display:inline-block;
  width:100%;
  margin-bottom:10px
}
.rowlabel {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  width:100%
}
</style>
