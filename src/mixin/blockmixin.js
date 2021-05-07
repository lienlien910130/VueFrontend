
export default {
    computed: {
      blockAttrs() {
          return {
              blockData: this.blockData,
              config: this.tableConfig,
              title:this.title,
              // sortArray:this.sortArray,
              isTable:this.isTable,
              isHasButtons:this.isHasButtons,
              buttonsName:this.buttonsName,
              selectSetting:this.selectSetting
          }
      }
    },
    data() {
      return {
        blockData:[],
        tableConfig:[],
        title:'',
        //sortArray:[],
        listQueryParams:{
            page: 1,
            limit: 12,
            total: 0
        },
        isHasButtons:true,
        buttonsName:[
          { name:'編輯',type:'primary',status:'open'},
          { name:'刪除',type:'info',status:'delete'}]
      }
    }
    
}
