
export default {
    
  data() {
    return {
        dialogTitle:'',
        innerVisible:false,
        dialogData:[],
        dialogStatus:'',
        dialogButtonsName:[],
        dialogConfig:[],
        dialogSelect:[]

    }
  },
  computed: {
    dialogAttrs(){
        return{
            title:this.dialogTitle,
            visible: this.innerVisible,
            dialogData: this.dialogData,
            dialogStatus: this.dialogStatus,
            buttonsName: this.dialogButtonsName,
            config: this.dialogConfig,
            selectData: this.dialogSelect
        }
    }
  }
}
