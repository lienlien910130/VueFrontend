<template>
    <div>
        <p>廠商設定</p>
        <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
    </div>
</template>

<script>
import { getcontactunitOption  } from '@/api/building'
import { mapGetters } from 'vuex'

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
        ...mapGetters([
            'id',
            'buildingid'
        ]),
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
        this.getcontactunitOption()
    },
    methods:{
        getcontactunitOption(){ //取得大樓的廠商分類
            this.options = []
            getcontactunitOption(this.buildingid).then(response => {
                console.log('getcontactunitOption=>'+JSON.stringify(response))
                response.result.forEach(item => {
                    let _array = { 
                        id : item.id, 
                        label: item.textName, 
                        value: item.id
                    }
                    this.options.push(_array)  
                    })
                this.blockData = this.options
            }).catch(error=>{
                console.log('error=>'+error)
            })
        },
        handleBlockOption(index, content){

        }
    }
}
</script>

<style scoped>

</style>