<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block 
                    :list-query-params.sync="listQueryParams"
                    :selectSetting.sync="selectSetting"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
                
            </el-col>
        </el-row>
        <Dialog 
        v-if="innerVisible === true"
        v-bind="dialogAttrs" 
        v-on:handleDialog="handleDialog"></Dialog>
    </div>
</template>
<script>

import { setSelectSetting } from '@/utils/index'

export default {
    name:'Device',
    components:{
        Block: () => import('@/components/Block/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue')
    },
    computed:{
        blockAttrs() {
            return {
                blockData: this.blockData,
                buttonsName:this.buttonsName,
                config: this.tableConfig,
                title:'equipment',
                selectData: this.selectData,
                options:this.options,
                sortArray:this.sortArray
            }
        },
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesManage
            }
        },
        dialogAttrs(){
            return{
                title:'equipment',
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.tableConfig,
                selectData: this.selectData,
                dialogOptions: this.options
            }
        }
    },
    data() {
        return {
            tableConfig:[
                    {
                        label: '設備種類',
                        prop: 'type',
                        format:'DeviceOptions',
                        mandatory:true, message:'請選擇設備種類',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true
                    },
                    {
                        label: '廠牌名稱',
                        prop: 'brand',
                        format:'BrandOptions',
                        mandatory:true, message:'請選擇廠牌名稱',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true
                    },
                    {
                        label: '設備型號',
                        prop: 'productId',
                        mandatory:true, message:'請選擇廠牌名稱',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '設備名稱',
                        prop: 'name',
                        mandatory:true, message:'請選擇設備名稱',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '國家認證編號',
                        prop: 'certificationNumber',
                        mandatory:true, message:'請輸入國家認證編號',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '購買日期',
                        prop: 'dateOfPurchase',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請選擇購買日期',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '保固日期',
                        prop: 'dateOfWarranty',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請輸入保固日期',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '位置設置',
                        prop: 'location',
                        mandatory:true, message:'請輸入位置設置',isSelect:false,options:[],selectType:'',isSort:true
                    },
                    {
                        label: '分類群組',
                        prop: 'groupID',
                        mandatory:true, message:'請輸入分類群組',isSelect:true,options:[],
                        selectType:'group',select:'',isSort:true
                    },
                    {
                        label: '保管單位',
                        prop: 'keeperUnitID',
                        format:'contactunitSelect',
                        mandatory:true, message:'請選擇保管單位',isSelect:true,options:[],
                        selectType:'contactunit',select:'',isSort:true
                    },
                    {
                        label: '維護廠商',
                        prop: 'maintainVendorID',
                        format:'contactunitSelect',
                        mandatory:true, message:'請選擇維護廠商',isSelect:true,options:[],
                        selectType:'contactunit',select:'',isSort:true
                    },
                    {
                        label: '設備狀況',
                        prop: 'status',
                        format:'DeviceStatusOptions',
                        mandatory:true, message:'請選擇設備狀況',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true
                    }
                ],
            selectData:[],
            buttonsName:[
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}], 
            blockData:[],
            deviceList:[],
            options:[],
            innerVisible:false,
            dialogStatus:'',
            dialogData:[],
            dialogButtonsName:[],
            // groupData:[],
            origin:[],
            selectGroup:'',
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            selectSetting:[],
            sortArray:[]
        }
    },
    async mounted() {
        await this.getOptions() //取得所有分類
        await this.getContactUnitList() //廠商資料
        await this.getBuildingDevicesManage() //大樓的所有設備
        await this.setSelectSetting()
        if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
            let _array = this.blockData.filter((item, index) => 
                item.id == this.$route.params.target
            )
            await this.handleBlock('equipment','open',_array[0])
        }   
    },
    methods: {
        async getBuildingDevicesManage(sort = null){
            this.blockData = []
            var data = []
            await this.$api.device.apiGetBuildingDevicesManagement().then(response =>{
                this.listQueryParams.total = response.result.length
                this.origin = JSON.stringify(response.result)  
                data = response.result
                this.selectSetting.forEach(element=>{
                    if(element.select != ''){
                        data = data.filter((item, index) => item[element.prop] == element.select )
                    }
                })
                data = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
                if(sort !== '' && sort !== null){
                    if(sort == 'dateOfPurchase' || sort == 'dateOfWarranty'){
                        data = data.sort(function(x,y){
                            var date1 = x[sort].split(' ')
                            var date2 = y[sort].split(' ')
                            var _data1 = new Date(date1[0])
                            var _data2 = new Date(date2[0])
                            return  _data2 - _data1
                        })
                    }else{
                        data = data.sort(function(x,y){
                            return y[sort] - x[sort]
                        })
                    }
                }else{
                    data = data.sort(function(x,y){
                        var a = x.status
                        var b = y.status
                        if(a == b){
                            return y.id - x.id
                        }
                        return y.status - x.status
                    })
                }
                this.blockData = data
            })
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async getOptions(){
            this.options = []
            await this.$api.setting.apiGetBuildingOptions().then(response => {
                var _temp = response.result.sort((x,y) => x.id - y.id)
                this.options = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getContactUnitList(){
            this.selectData = []
            this.$api.building.apiGetBuildingContactUnit().then(response => {
              var _temp = response.result.sort((x,y) => x.id - y.id)
               this.selectData = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.name) 
                    this.$set(v, 'id', v.id) 
                    return v
              })
            })
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            if(index === 'open'){
                this.dialogStatus = 'update'
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
            }else if(index === 'delete'){
                this.$api.device.apiDeleteDevicesManagement(content).then(async(response) => {
                    this.$message('刪除成功')
                    await this.getBuildingDevicesManage()
                })
            }
            else if(index === 'empty'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index === 'update'){
                this.$api.device.apiPatchDevicesManagement(JSON.stringify(content)).then(async(response) => {
                    this.$message('更新成功')
                    await this.getBuildingDevicesManage()
                })
            }else if(index === 'create'){
                this.$api.device.apiPostDevicesManagement(JSON.stringify(content)).then(async(response) => {
                    this.$message('新增成功')
                    await this.getBuildingDevicesManage()
                })
            }
            this.innerVisible = false
        }
    }
}
</script>
<style lang="scss" scoped>
.block-wrapper {
    background: #fff;
    padding: 30px 15px;
    margin-bottom: 32px;
    height: 720px;
}
</style>