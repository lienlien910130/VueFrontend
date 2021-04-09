<template>

        <div class="editor-container">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <span>場所名稱 :</span>
                    </div>
                    <div class="content">
                        <span> {{ this.buildinginfo[0].buildingName }}</span> 
                    </div>
                    </div>
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <span>下次保養時間 :</span>
                    </div>
                    <div class="content">
                        <span class="report"> 2021/03/20 </span> 
                    </div>
                    </div>
                </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="horizontalhalfdiv">
                        <div class="label">
                        <span>管理權人 :</span>
                        </div>
                        <div class="content">
                        <div
                            v-for="(item,index) in this.buildinginfo[0].linkOwners"
                            :key="index" class="user">
                            <div style="padding-bottom:2px">
                                姓名 ： {{ item.name }}
                            </div>
                            <div>
                                電話 ： {{ item.cellPhoneNumber }}
                            </div>
                        </div>
                        </div>
                    </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="horizontalhalfdiv">
                        <div class="label">
                        <span>防火管理人 :</span>
                        </div>
                        <div class="content">
                        <div
                            v-for="(item,index) in this.buildinginfo[0].linkFireManagers"
                            :key="index" class="user">
                            <div style="padding-bottom:2px">
                                姓名 ： {{ item.name }}
                            </div>
                            <div>
                                電話 ： {{ item.cellPhoneNumber }}
                            </div>
                        </div> 
                        </div>
                    </div>
                    </el-col>
                </div>
                </el-col>
            </el-row>
            <el-row :gutter="32">
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
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
            :files="maintainFiles"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="maintainlistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { setSelectSetting } from '@/utils/index'
import { MaintainManagementList, MaintainManagement }  from '@/object/maintainManagement'
import Files  from '@/object/files'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    data(){
        return{
            maintainList:'',
            maintain:'',
            maintainArray:[], //存放linkmaintain
            //dialog額外的參數
            maintainFiles:[],
            formtableData:[],
            formtableconfig:MaintainManagement.getConfig(),
            maintainlistQueryParams:{
                page: 1,
                limit: 5,
                total: 0
            }
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingMaintain,
                changeTable:this.changeTable,
                handleDialog:this.handleDialog
            }
        }
    },
    watch: {
    //   buildingdevices:{
    //     handler:async function(){
    //         this.deviceList = this.buildingdevices.map(v => {
    //             this.$set(v, 'value', v.id) 
    //             this.$set(v, 'label', v.name) 
    //             this.$set(v, 'id', v.id) 
    //             return v
    //         })
    //     },
    //     immediate:true
    //   }
    },
    methods:{
        async init(){   
            this.tableConfig = MaintainManagementList.getConfig()
            this.title = 'maintain'
            await this.reload()
        },
        async reload(){
            this.maintainlistQueryParams = {
                page: 1,
                limit: 5,
                total: 0
            }
            await this.saveBuildingMaintain()
            await this.getBuildingMaintain()
            await this.setSelectSetting()
        },
        async saveBuildingMaintain(){
            var data = await MaintainManagementList.get()
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getBuildingMaintain(sort = null){ //取得大樓維護保養
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
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
            if(sort !== '' && sort !== null){
                if(sort == 'createdDate'){
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
                    return y.id - x.id
                })
            }
            data = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            this.blockData = data
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async handleBlock(title,index, content) { //維護保養的操作
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            if(index === 'open'){
                this.dialogTitle = 'maintainList' //為了控制dialog大小
                this.maintainList = content
                this.dialogData.push(content)
                this.dialogConfig = this.tableConfig
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
                this.maintainArray = content.linkMaintains.map(item=>{ return item.clone(item) })
                var data = this.maintainArray.map(item=>{ return item.clone(item) })
                this.maintainlistQueryParams.total = this.maintainArray.length
                this.formtableData = data.filter((item, index) => 
                    index < this.maintainlistQueryParams.limit * this.maintainlistQueryParams.page && 
                    index >= this.maintainlistQueryParams.limit * (this.maintainlistQueryParams.page - 1))
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    this.listQueryParams = {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                    await this.reload()
                }
            }else if(index === 'empty'){
                this.dialogTitle = 'createmaintainlist'
                this.dialogConfig = MaintainManagementList.getCreateConfig()
                this.dialogData.push( MaintainManagementList.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'openfiles'){
                this.dialogTitle = 'uploadFiles'
                this.maintainList = content
                this.maintainFiles = await content.files()
                this.dialogButtonsName = []
                this.innerVisible = true
                this.dialogStatus = 'upload'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(title === 'maintain'){
                await this.handleMaintain(index,content)
            }else{
                if(index === 'create' || index === 'update'){
                    this.$delete(content,'linkMaintains')
                    var isOk = index === 'update' ? await content.update() : await content.create()
                    if(isOk){
                        this.innerVisible = false
                        index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                        await this.reload()
                    }
                }else if(index === 'createfile'){
                    const formData = new FormData()
                    content.forEach(item => {
                        formData.append('file', item.raw)
                    })
                    isOk = await this.maintainList.createfiles(formData) 
                    if(isOk){
                        this.$message('上傳成功')
                        this.maintainFiles = await this.maintainList.files()
                    }
                }else if(index === 'deletefile'){
                    var data = { id:content.toString() }
                    isOk = await Files.delete(data)
                    if(isOk){
                        this.$message('刪除成功')
                        this.maintainFiles = await this.maintainList.files()
                    }
                }else if(index === 'cancel'){
                    this.innerVisible = false
                }else if(index === 'clickPagination'){
                    this.maintainlistQueryParams = content
                    this.formtableData = this.maintainArray.filter((item, index) => 
                        index <  this.maintainlistQueryParams.limit *  this.maintainlistQueryParams.page && 
                        index >=  this.maintainlistQueryParams.limit * ( this.maintainlistQueryParams.page - 1))
                }
            }
        },
        
        async changeTable(value){
            this.isTable = value
            this.listQueryParams = {
                page: 1,
                limit: 12,
                total: 0
            }
            if(value == true){
                var array = []
                for(let element of this.origin){
                    array.push(element['linkMaintains'])
                }
                var concatarray = array.reduce(
                    function(a, b) {
                        return a.concat(b)
                    },[]
                )
                this.origin = concatarray.map(item=>{ return item.clone(item) })
                this.tableConfig = MaintainManagement.getConfig()
                this.listQueryParams.total = this.origin.length
                concatarray = concatarray.filter((item, index) => 
                    index < this.listQueryParams.limit * this.listQueryParams.page && 
                    index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
                this.blockData = concatarray
                this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            }else{
                await this.init()
            }
        },
        async handleMaintain(index, content){
            this.dialogData = []
            this.dialogTitle = 'maintain'
            if(index === 'empty'){
                this.dialogConfig = this.formtableconfig
                this.dialogSelect = await MaintainManagementList.getAllLack()
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'createmaintain'},
                { name:'返回',type:'info',status:'cancel'}]
                this.dialogData.push( MaintainManagement.empty() )
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'open'){
                this.dialogSelect = await MaintainManagementList.getAllLack()
                this.dialogConfig = this.formtableconfig  
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'updatemaintain'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                    var isDelete = await content.delete()
                    if(isDelete){
                        this.$message('刪除成功')
                    }
                    if(this.isTable == false){
                        await this.reload()
                        var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                        await this.handleBlock('maintainList','open',data)
                    }else{
                        await this.saveBuildingMaintain()
                        await this.changeTable(this.isTable)
                    }
            }else if(index === 'createmaintain' || index === 'updatemaintain'){
                var isOk = index === 'createmaintain' ? 
                await content.create(this.maintainList.getID()) : await content.update()
                if(isOk){
                    index === 'updatemaintain' ? this.$message('更新成功') : this.$message('新增成功')
                }
                if(this.isTable == false){
                    await this.reload()
                    var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                    await this.handleBlock('maintainList','open',data)
                }else{
                    await this.saveBuildingMaintain()
                    await this.changeTable(this.isTable)
                    this.innerVisible = false
                }
            }else if(index === 'cancel'){
                    if(this.isTable == false){
                        this.maintainlistQueryParams = {
                            page: 1,
                            limit: 5,
                            total: 0
                        }
                        var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                        await this.handleBlock('maintainList','open',data)
                    }else{
                        this.innerVisible = false
                    }
            }else if(index === 'openfiles'){
                    this.dialogTitle = 'maintain'
                    this.maintain = content
                    this.maintainFiles = await content.files()
                    this.dialogButtonsName = []
                    this.innerVisible = true
                    this.dialogStatus = 'upload'
            }else if(index === 'createfile'){
                const formData = new FormData()
                content.forEach(item => {
                    formData.append('file', item.raw)
                })
                isOk = await this.maintain.createfiles(formData)
                if(isOk){
                    this.$message('上傳成功')
                    this.maintainFiles = await this.maintain.files()
                }
            }else if(index === 'deletefile'){
                var data = { id:content.toString() }
                isOk = await Files.delete(data)
                if(isOk){
                    this.$message('刪除成功')
                    this.maintainFiles = await this.maintain.files()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .chart-wrapper {
        background: #fff;
        padding: 10px 10px;
        margin-bottom: 30px;
        height: 150px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .verticalhalfdiv{
          width: 100%;
          min-height: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
          }
          .content{
            min-width: 60%;
            display:inline-block;
            font-size: 30px;
          }
        }
        .horizontalhalfdiv{
          height: 100%;
          min-width: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
            vertical-align:top;
          }
          .content{
            min-width: 70%;
            display:inline-block;
            font-size: 24px;
            .user{
              padding: 0px 8px 8px 8px;
            }
          }
        }
        .report{
            font-size: 50px;
            color: red;
        }
    }
    .block-wrapper {
        background: #fff;
        padding: 30px 15px;
        height: 720px;
    }
    

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
    .left{
      float: none;
      width: 100%;
    }
    .right{
      float: none;
      width: 100%;
      padding-left:0px;
    }
}
</style>