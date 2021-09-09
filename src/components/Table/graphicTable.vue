<template>
  <div>
    <!-- 圖控 -->
    <el-table
      :key="itemkey"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;"
      empty-text="暫無資料"
      @sort-change="sortChange"
      height="180px"
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
                :column-key="item.prop"
                sortable="custom"
                header-align="center"
                >
                <template slot-scope="scope">
                    <span >{{  scope.row[item.prop] }}</span>
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
  name: 'GraphicTable',
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
        return [10, 20, 50, 100]
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
      return this.listQueryParams.pageIndex || 1
    },
    limit: function() {
      return this.listQueryParams.pageSize || 10
    },
    total: function() {
      return this.listQueryParams.total || 0
    }
  },
  methods:{
    //表格排序
    sortChange(column){
            var self = this
            if (column.order === "descending") {
                this.blockData = this.blockData.sort(function(str1,str2){
                    var s1 = str1[column.prop] == null ? '' : str1[column.prop]
                    var s2 = str2[column.prop] == null ? '' : str2[column.prop]
                    return self.sortRule(s2,s1)
                })
            } else if (column.order === "ascending") {
                this.blockData = this.blockData.sort(function(str1,str2){
                    var s1 = str1[column.prop] == null ? '' : str1[column.prop]
                    var s2 = str2[column.prop] == null ? '' : str2[column.prop]
                    return self.sortRule(s1,s2)
                })
            }
    },
    sortRule(str1, str2) {
            let res = 0
            for (let i = 0; ;i++) {
				if (!str1[i] || !str2[i]) {
                    res = str1.length - str2.length
                    if(typeof str1 == 'boolean' && typeof str2 == 'boolean'){
                        res = str1 - str2
                    }
                    break
                }
                const char1 = str1[i]
                const char1Type = this.getChartType(char1)
                const char2 = str2[i]
                const char2Type = this.getChartType(char2)

                if (char1Type[0] === char2Type[0]) {
                    if (char1 === char2) {
                        continue
                    } else {
                        if (char1Type[0] === 'zh') {
                            res = char1.localeCompare(char2)
                        } else if (char1Type[0] === 'en') {
                            res = char1.charCodeAt(0) - char2.charCodeAt(0)
                        } else {
                            res = char1 - char2
                        }
                        break
                    }
                } else {
                    // 类型不同的，直接用返回的数字相减
                    res = char1Type[1] - char2Type[1]
                    break
                }
			}
			return res
		},
		getChartType(char) {
			// 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
			if (/^[\u4e00-\u9fa5]$/.test(char)) {
				return ['zh', 300]
			}
			if (/^[a-zA-Z]$/.test(char)) {
				return ['en', 200]
			}
			if (/^[0-9]$/.test(char)) {
				return ['number', 100]
			}
			return ['others', 999]
		},
    //窗口
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
      this.listQueryParams.pageSize = val
      this.listQueryParams.pageIndex = 1 // 改變翻頁數目，將頁面=1
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('clickPagination', this.listQueryParams)
    },
    // 跳到當前是第幾頁
    handleCurrentChange(val) {
      this.listQueryParams.pageIndex = val
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('clickPagination', this.listQueryParams)
    }
  }
}
</script>