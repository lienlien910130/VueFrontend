
export default {
    computed: {
      blockAttrs() {
          return {
              hasSearch:this.hasSearch,
              blockData: this.blockData,
              config: this.tableConfig,
              title:this.title,
              isTable:this.isTable,
              isHasButtons:this.isHasButtons,
              buttonsName:this.buttonsName,
              headerButtonsName:this.headerButtonsName,
              selectSetting:this.selectSetting
          }
      }
    },
    data() {
      return {
        hasSearch:true,
        blockData:[],
        tableConfig:[],
        title:'',
        listQueryParams:{
          pageIndex: 1,
          pageSize: 12,
          total:0
        },
        isHasButtons:true,
        buttonsName:[
          { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'}],
        headerButtonsName:[
          { name:'新增資料',icon:'el-icon-circle-plus-outline',status:'empty'},
          { name:'匯出檔案',icon:'el-icon-download',status:'exportExcel'},
          { name:'匯入檔案',icon:'el-icon-upload2',status:'uploadExcel'}]
      }
    }
}
