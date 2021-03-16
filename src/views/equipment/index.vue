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
import { mapGetters } from 'vuex'
import { setSelectSetting,changeLink } from '@/utils/index'

export default {
    name:'Device',
    components:{
        Block: () => import('@/components/Block/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue')
    },
    computed:{
        ...mapGetters([
            'buildingid'
        ]),
        blockAttrs() {
            return {
                blockData: this.blockData,
                config: this.tableConfig,
                title:'equipment',
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
                config: this.tableConfig
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
                        selectType:'options',select:'',isSort:true,isHidden:false
                    },
                    {
                        label: '廠牌名稱',
                        prop: 'brand',
                        format:'BrandOptions',
                        mandatory:true, message:'請選擇廠牌名稱',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true,isHidden:false
                    },
                    {
                        label: '設備型號',
                        prop: 'productId',
                        mandatory:true, message:'請選擇廠牌名稱',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '設備名稱',
                        prop: 'name',
                        mandatory:true, message:'請選擇設備名稱',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '國家認證編號',
                        prop: 'certificationNumber',
                        mandatory:true, message:'請輸入國家認證編號',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:true,maxlength:'20'
                    },
                    {
                        label: '購買日期',
                        prop: 'dateOfPurchase',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請選擇購買日期',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:true
                    },
                    {
                        label: '保固日期',
                        prop: 'dateOfWarranty',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請輸入保固日期',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:false
                    },
                    {
                        label: '位置設置',
                        prop: 'location',
                        mandatory:true, message:'請輸入位置設置',isSelect:false,options:[],selectType:'',
                        isSort:true,isHidden:true,maxlength:'20'
                    },
                    {
                        label: '分類群組',
                        prop: 'groupID',
                        mandatory:true, message:'請輸入分類群組',isSelect:true,options:[],
                        selectType:'group',select:'',isSort:true,isHidden:true,maxlength:'10'
                    },
                    {
                        label: '保管單位',
                        prop: 'linkKeeperUnits',
                        format:'contactunitSelect',
                        mandatory:true,trigger: 'change', message:'請選擇保管單位',isSelect:true,options:[],
                        selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:false
                    },
                    {
                        label: '維護廠商',
                        prop: 'linkMaintainVendors',
                        format:'contactunitSelect',
                        mandatory:true,trigger: 'change', message:'請選擇維護廠商',isSelect:true,options:[],
                        selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:true 
                    },
                    {
                        label: '設備狀況',
                        prop: 'status',
                        format:'DeviceStatusOptions',
                        mandatory:true, message:'請選擇設備狀況',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true,isHidden:false
                    }
                ],
            blockData:[],
            deviceList:[],
            innerVisible:false,
            dialogStatus:'',
            dialogData:[],
            dialogButtonsName:[],
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
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    await this.init()
                    if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
                        let _array = this.blockData.filter((item, index) => 
                            item.id == this.$route.params.target
                        )
                        await this.handleBlock('equipment','open',_array[0])
                    } 
                }
            },
            immediate:true
        },
    },
    methods: {
        async init(){
            await this.saveBuildingDevicesManageArray()
            await this.getBuildingDevicesManage() //大樓的所有設備
            await this.setSelectSetting()
        },
        async saveBuildingDevicesManageArray(){
            var data = await this.$obj.Device.getBuildingDevicesManage()
            this.origin = this.$deepClone(data)
        },
        async getBuildingDevicesManage(sort = null){
            this.blockData = []
            var data = this.$deepClone(this.origin)
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select != ''){
                    data = data.filter(function(item,index){
                        if(typeof item[element.prop] !== 'object'){
                            return item[element.prop] == element.select
                        }else{ //物件形式
                            for(let obj of item[element.prop]){
                                if(obj.id == element.select){
                                return item
                                }
                            }
                        }
                    })
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
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            if(index === 'open'){
                this.dialogStatus = 'update'
                var temp = this.$deepClone(content)
                temp = changeLink('equipment',temp,'open')
                this.dialogData.push(temp)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
            }else if(index === 'delete'){
                var isDelete = await this.$obj.Device.deleteBuildingDevicesManage(content)
                if(isDelete){
                    this.$message('刪除成功')
                    this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
                    this.listQueryParams = {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                    await this.init()
                }
            }else if(index === 'empty'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index !== 'cancel'){
                content = changeLink('equipment',content,'')
                var isOk = index === 'update' ? 
                await this.$obj.Device.updateBuildingDevicesManage(JSON.stringify(content)) : 
                await this.$obj.Device.postBuildingDevicesManage(JSON.stringify(content))
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
                    await this.init()
                }
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
    height: 720px;
}
</style>