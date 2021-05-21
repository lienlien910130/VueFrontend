
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
          { name:'編輯',type:'primary',status:'open'},
          { name:'刪除',type:'info',status:'delete'}]
      }
    }
}
