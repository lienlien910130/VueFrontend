<template>
<div class="setting-container">
        <div class="setting-editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="8">
                    <ContactUnit
                    v-bind="contactUnitAttrs"
                    v-on="settingBlockEvent"
                    ></ContactUnit>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="8">
                    <Device
                    v-bind="deviceAttrs"
                    v-on="settingBlockEvent"
                    ></Device>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="8">
                    <MaintainContent
                    v-bind="maintainContentAttrs"
                    v-on="settingBlockEvent"
                    ></MaintainContent>
                </el-col>
                
            </el-row>

            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="8">
                    <Brand
                    v-bind="brandAttrs"
                    v-on="settingBlockEvent"
                    ></Brand>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { Breadcrumb } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
    components:{
        ContactUnit: () => import('./components/SettingBlock.vue'),
        Device: () => import('./components/SettingBlock.vue'),
        MaintainContent: () => import('./components/SettingBlock.vue'),
        Brand: () => import('./components/SettingBlock.vue'),
    },
    data(){
        return{
            input:'',
            contactunitoption:[],
            deviceoption:[],
            maintaincontentoption:[],
            type:'view',
            current:'',
            temp:[]
        }
    },
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ]),
        contactUnitAttrs(){
            return{
                title:'廠商類別',
                option:this.contactunitoption,
                type:this.type,
                current:this.current
            }
        },
        deviceAttrs(){
            return{
                title:'設備類別',
                option:this.deviceoption,
                type:this.type,
                current:this.current
            }
        },
        maintainContentAttrs(){
            return{
                title:'維護內容',
                option:this.maintaincontentoption,
                type:this.type,
                current:this.current
            }
        },
        brandAttrs(){
            return{
                title:'廠牌名稱&類型',
                option:this.maintaincontentoption,
                type:this.type,
                current:this.current
            }
        },
        settingBlockEvent(){
            return{
                subButton: this.handleButtonOption
            }
        }
    },
    async mounted(){
        await this.getcontactunitOption()
    },
    methods:{
        async getcontactunitOption(){ //取得大樓的廠商分類
            this.contactunitoption = []
            var _temp = []
            await this.$api.setting.apiGetContactUnitOption().then(response => {
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.contactunitoption = _temp.map(v => {
                this.$set(v, 'textName', v.textName) 
                this.$set(v, 'id', v.id) 
                return v
                })
            })
        },
        async getdeviceOption(){ //取得大樓的廠商分類
            
        },
        async getmaintaincontentOption(){ //取得大樓的廠商分類
            
        },
        async handleButtonOption(index,operation,content){
            console.log(index,operation,content)
            switch(index){
                case '廠商類別':
                    await this.ContactUnitOption(operation,content)
                    break;
                case '設備類別':
                    await this.DeviceOption(operation,content)
                    break;
                case '維護內容':
                    await this.MaintainContentOption(operation,content)
                    break;    
            }
        },
        async ContactUnitOption(operation,content){
            if(operation == 'create'){
                var temp ={
                    classType :"ContactUnitOptions",
                    textName:content
                }
                await this.$api.setting.apiPostContactUnitOption(temp).then(async(response) =>{
                    this.$message("新增成功")
                    await this.getcontactunitOption()
                })
            }else if(operation == 'update'){
                await this.$api.setting.apiPatchContactUnitOption(content).then(response =>{
                    this.$message("更新成功")
                    this.type='view'
                    this.current = ''
                })
            }else if(operation == 'delete'){
                await this.$api.setting.apiDeleteContactUnitOption(content).then(async(response) =>{
                    this.$message("刪除成功")
                    await this.getcontactunitOption()
                })
            }else if(operation == 'cancel'){
                this.type='view'
                this.current = ''
                this.contactunitoption = JSON.parse(this.temp)
            }else if(operation == 'changeEdit'){
                this.type='edit'
                this.current = content.id
                this.temp = JSON.stringify(this.contactunitoption)
            }else if (operation == 'checkDelete'){
                var array = []
                await this.$api.building.apiGetContactUnit().then(async(response) => {
                    this.array = response.result.filter((item, index) => 
                        item.type == content )
                    if(this.array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有廠商資料，請先刪除廠商資料!',
                            type: 'warning'
                        });
                    }else{
                        await this.$api.setting.apiDeleteContactUnitOption(content).then(async(response) =>{
                            this.$message("刪除成功")
                            await this.getcontactunitOption()
                        })
                    }
                })
            }
        },
        async DeviceOption(operation,content){
            if(operation == 'create'){
                var temp ={
                    classType :"DeviceOptions",
                    textName:content
                }
                await this.$api.setting.apiPostDeviceOption(temp).then(async(response) =>{
                    this.$message("新增成功")
                    await this.getdeivceOption()
                })
            }else if(operation == 'update'){
                await this.$api.setting.apiPatchDeviceOption(content).then(response =>{
                    this.$message("更新成功")
                    this.type='view'
                    this.current = ''
                })
            }else if(operation == 'delete'){
                await this.$api.setting.apiDeleteDeviceOption(content).then(async(response) =>{
                    this.$message("刪除成功")
                    await this.getdeivceOption()
                })
            }else if(operation == 'cancel'){
                this.type='view'
                this.current = ''
                this.contactunitoption = JSON.parse(this.temp)
            }else if(operation == 'changeEdit'){
                this.type='edit'
                this.current = content.id
                this.temp = JSON.stringify(this.contactunitoption)
            }else if (operation == 'checkDelete'){
                var array = []
                await this.$api.building.apiGetContactUnit().then(async(response) => {
                    this.array = response.result.filter((item, index) => 
                        item.type == content )
                    if(this.array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有廠商資料，請先刪除廠商資料!',
                            type: 'warning'
                        });
                    }else{
                        await this.$api.setting.apiDeleteDeviceOption(content).then(async(response) =>{
                            this.$message("刪除成功")
                            await this.getdeivceOption()
                        })
                    }
                })
            }
        },
        async MaintainContentOption(operation,content){
            if(operation == 'create'){
                var temp ={
                    classType :"MaintainContentOptions",
                    textName:content
                }
                await this.$api.setting.apiPostMaintainContentOption(temp).then(async(response) =>{
                    this.$message("新增成功")
                    await this.getmaintaincontentOption()
                })
            }else if(operation == 'update'){
                await this.$api.setting.apiPatchMaintainContentOption(content).then(response =>{
                    this.$message("更新成功")
                    this.type='view'
                    this.current = ''
                })
            }else if(operation == 'delete'){
                await this.$api.setting.apiDeleteMaintainContentOption(content).then(async(response) =>{
                    this.$message("刪除成功")
                    await this.getmaintaincontentOption()
                })
            }else if(operation == 'cancel'){
                this.type='view'
                this.current = ''
                this.contactunitoption = JSON.parse(this.temp)
            }else if(operation == 'changeEdit'){
                this.type='edit'
                this.current = content.id
                this.temp = JSON.stringify(this.contactunitoption)
            }else if (operation == 'checkDelete'){
                var array = []
                await this.$api.building.apiGetContactUnit().then(async(response) => {
                    this.array = response.result.filter((item, index) => 
                        item.type == content )
                    if(this.array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有廠商資料，請先刪除廠商資料!',
                            type: 'warning'
                        });
                    }else{
                        await this.$api.setting.apiDeleteMaintainContentOption(content).then(async(response) =>{
                            this.$message("刪除成功")
                            await this.getmaintaincontentOption()
                        })
                    }
                })
            }
        },



    }
}
</script>

<style lang="scss" scoped>
.setting-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 125px);
}
</style>