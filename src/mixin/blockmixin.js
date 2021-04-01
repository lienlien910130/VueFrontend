
export default {
  data() {
    return {
      blockData:[],
      tableConfig:[],
      title:'',
      sortArray:[],
      deviceList:[],
      isTable:false,
      tablelabel:[],
      listQueryParams:{
          page: 1,
          limit: 10,
          total: 0
      },
    }
  },
  computed: {
    
    label() {
        if (this.$store.state.app.device === 'mobile') {
            return 'top'
        } else {
            return 'left'
        }
    },
    blockAttrs() {
        return {
            blockData: this.blockData,
            config: this.tableConfig,
            title:this.title,
            deviceList:this.deviceList,
            sortArray:this.sortArray,
            isTable:this.isTable,
            tablelabel:this.tablelabel
        }
    },
  }
}
