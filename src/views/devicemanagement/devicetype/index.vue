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
import { setSelectSetting } from '@/utils/index'

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
                title:'devicetype',
                sortArray:this.sortArray
            }
        },
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesType
            }
        },
        dialogAttrs(){
            return{
                title:'devicetype',
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
                        label: '設備類型',
                        prop: 'fullType',
                        mandatory:true, message:'請輸入設備類型',isSelect:true,options:[],selectType:'',select:'',
                        isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '設備名稱',
                        prop: 'name',
                        mandatory:true, message:'請輸入設備名稱',isSelect:false,
                        isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '廠牌名稱',
                        prop: 'brand',
                        mandatory:true, message:'請輸入廠牌名稱',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '設備型號',
                        prop: 'productId',
                        mandatory:true, message:'請輸入設備型號',isSelect:true,options:[],selectType:'',select:'',
                        isSort:true,isHidden:false,maxlength:'20'
                    },
                    {
                        label: '國家認證編號',
                        prop: 'certificationNumber',
                        mandatory:true, message:'請輸入國家認證編號',isSelect:false,options:[],selectType:'',select:'',
                        isSort:true,isHidden:false,maxlength:'20'
                    }
                ],
            blockData:[],
            innerVisible:false,
            dialogStatus:'',
            dialogData:[],
            dialogButtonsName:[],
            origin:[],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            selectSetting:[],
            sortArray:[],
            defaultFulltype:[]
        }
    },
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    this.defaultFulltype = await this.$obj.Device.getDefaultFullType()
                    console.log(JSON.stringify(this.defaultFulltype))
                    await this.init()
                }
            },
            immediate:true
        },
    },
    methods: {
        async init(){
            await this.saveBuildingDevicesTypeArray()
            await this.getBuildingDevicesType() //大樓的所有設備類型
            await this.setSelectSetting()
        },
        async saveBuildingDevicesTypeArray(){
            var data = await this.$obj.Device.getDeviceType()
            this.origin = this.$deepClone(data)
        },
        async getBuildingDevicesType(sort = null){
            this.blockData = []
            var data = this.$deepClone(this.origin)
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select !== ''){
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
                data = data.sort(function(x,y){
                    return y[sort] - x[sort]
                })
            }else{
                data = data.sort(function(x,y){
                    return y.id - x.id
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
                this.dialogData.push(temp)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
            }else if(index === 'delete'){
                var isDelete = await this.$obj.Device.deleteDeviceType(content)
                if(isDelete){
                    this.$message('刪除成功')
                    //this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
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
                var isOk = index === 'update' ? 
                await this.$obj.Device.updateDeviceType(JSON.stringify(content)) : 
                await this.$obj.Device.postDeviceType(JSON.stringify(content))
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    //this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
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