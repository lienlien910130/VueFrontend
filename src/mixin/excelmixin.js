
export default {
    
    data() {
      return {
          excelVisible:false,
          excelType:'',
          exportExcelData:[],
      }
    },
    computed: {
        excelAttrs(){
          return{
              title:this.dialogTitle,
              visible: this.excelVisible,
              excelType: this.excelType,
              exportExcelData: this.exportExcelData,
              config: this.dialogConfig
          }
      }
    }
  }
  