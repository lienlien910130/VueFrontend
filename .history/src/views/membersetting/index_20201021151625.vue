<template>
    <div>
        <p>廠商設定</p>
        <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
    </div>
</template>

<script>
export default {
    components:{
        Block: () => import('@/components/Block/index.vue'),
    },
    data(){
        return{
            blockData:[],
            buttonsName: ['編輯','刪除'],
            tableConfig:[
                { label:'所屬單位' , prop:'usageOfFloorId',format:'manageselect', mandatory:true, message:'請選擇單位',trigger:'change' },
                { label:'職稱' , prop:'title',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
                { label:'姓名' , prop:'userName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
                { label:'電話' , prop:'callNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
                { label:'緊急電話' , prop:'emergencyNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
                { label:'備註' , prop:'note',type:'string', mandatory:false}
            ]
        }
    },
    computed:{
        blockAttrs() {
        return {
            blockData: this.blockData,
            buttonsName: this.buttonsName,
            config: this.tableConfig,
            title:'ContactUnitOption'
        }
        },
        blockEvent() {
            return {
                subOpitonButton: this.handleBlockOption
            }
        },
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){

        },
        handleBlockOption(index, content){

        }
    }
}
</script>

<style scoped>

</style>