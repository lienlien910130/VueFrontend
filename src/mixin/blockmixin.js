
export default {
    computed: {
      blockAttrs() {
          return {
              blockData: this.blockData,
              config: this.tableConfig,
              title:this.title,
              sortArray:this.sortArray,
              isTable:this.isTable,
              isHasButtons:this.isHasButtons,
              buttonsName:this.buttonsName
          }
      }
    },
    data() {
      return {
        blockData:[],
        tableConfig:[],
        title:'',
        sortArray:[],
        // deviceList:[],
        listQueryParams:{
            page: 1,
            limit: 10,
            total: 0
        },
        isHasButtons:true,
        buttonsName:[
          { name:'編輯',type:'primary',status:'open'},
          { name:'刪除',type:'info',status:'delete'}]
      }
    }
    
}
