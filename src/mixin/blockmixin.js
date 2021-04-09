
export default {
    computed: {
      blockAttrs() {
          return {
              blockData: this.blockData,
              config: this.tableConfig,
              title:this.title,
              // deviceList:this.deviceList,
              sortArray:this.sortArray,
              isTable:this.isTable
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
        }
      }
    },
    
}
