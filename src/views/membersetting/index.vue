<template>
<div class="setting-container">
        <div class="setting-editor-container">
            <el-row :gutter="20">
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

            <el-row :gutter="20">
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
            brandoption:[],
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
                title:'ContactUnitOptions',
                option:this.contactunitoption,
                type:this.type,
                current:this.current
            }
        },
        deviceAttrs(){
            return{
                title:'DeviceOptions',
                option:this.deviceoption,
                type:this.type,
                current:this.current
            }
        },
        maintainContentAttrs(){
            return{
                title:'MaintainContentOptions',
                option:this.maintaincontentoption,
                type:this.type,
                current:this.current
            }
        },
        brandAttrs(){
            return{
                title:'BrandOptions',
                option:this.brandoption,
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
        await this.getdeviceOption()
        await this.getmaintaincontentOption()
        await this.getbrandOption()
    },
    methods:{
        async getcontactunitOption(){ //取得大樓的廠商分類
            this.contactunitoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('ContactUnitOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.contactunitoption = _temp.map(v => {
                this.$set(v, 'textName', v.textName) 
                this.$set(v, 'id', v.id) 
                return v
                })
            })
        },
        async getdeviceOption(){ //取得大樓的廠商分類
            this.deviceoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('DeviceOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.deviceoption = _temp.map(v => {
                this.$set(v, 'textName', v.textName) 
                this.$set(v, 'id', v.id) 
                return v
                })
            })
        },
        async getmaintaincontentOption(){ //取得大樓的廠商分類
            this.maintaincontentoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('MaintainContentOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.maintaincontentoption = _temp.map(v => {
                this.$set(v, 'textName', v.textName) 
                this.$set(v, 'id', v.id) 
                return v
                })
            })
        },
        async getbrandOption(){ //取得大樓的廠商分類
            this.brandoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('BrandOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.brandoption = _temp.map(v => {
                    this.$set(v, 'value', v.value) 
                    this.$set(v, 'textName', v.textName) 
                    this.$set(v, 'id', v.id) 
                return v
                })
            })
        },
        async handleButtonOption(index,operation,content,value){
            console.log(index,operation,content,value)
            switch(operation){
                case 'create':
                    await this.PostData(index,content,value)
                    break;
                case 'update':
                    await this.UpdateData(index,content)
                    break;
                case 'delete':
                    await this.DeleteData(index,content)
                    break;
                case 'cancelEdit':
                    this.type='view'
                    this.current = ''
                    await this.Temp(index,false)
                    break;
                case 'changeEdit':
                    this.type='edit'
                    this.current = content.id
                    await this.Temp(index,true)
                    break;
                case 'checkDelete':
                    await this.CheckDelete(index,content)
                    break;
                default:
                    break;
            }
        },
        async Temp(index,isSave){
            if(isSave){
                switch(index){
                    case 'ContactUnitOptions':
                        this.temp = JSON.stringify(this.contactunitoption)
                        break;
                    case 'DeviceOptions':
                        this.temp = JSON.stringify(this.deviceoption)
                        break;
                    case 'MaintainContentOptions':
                        this.temp = JSON.stringify(this.maintaincontentoption)
                        break;
                    case 'BrandOptions':
                        this.temp = JSON.stringify(this.brandoption)
                        break;
                }
            }else{
                switch(index){
                    case 'ContactUnitOptions':
                        this.contactunitoption = JSON.parse(this.temp)
                        break;
                    case 'DeviceOptions':
                        this.deviceoption = JSON.parse(this.temp)
                        break;
                    case 'MaintainContentOptions':
                        this.maintaincontentoption = JSON.parse(this.temp)
                        break;
                    case 'BrandOptions':
                        this.brandoption = JSON.parse(this.temp)
                        break;
                }
            }
        },
        async DirectToReloadData(index){
            console.log(index)
            switch(index){
                case 'ContactUnitOptions':
                    await this.getcontactunitOption()
                    break;
                case 'DeviceOptions':
                    await this.getdeviceOption()
                    break;
                case 'MaintainContentOptions':
                    await this.getmaintaincontentOption()
                    break;
                case 'BrandOptions':
                    await this.getbrandOption()
                    break;
                
            }
        },
        async PostData(index,content,value){
            var temp = {
                    classType:index,
                    textName:content,
                    value:value
            }
            await this.$api.setting.apiPostOption(temp).then(response =>{
                    this.$message("新增成功")
            })
            await this.DirectToReloadData(index)
        },
        async UpdateData(index,content){
            await this.$api.setting.apiPatchOption(content).then(response =>{
                this.$message("更新成功")
                this.type='view'
                this.current = ''
            })
            await this.DirectToReloadData(index)
        },
        async DeleteData(index,content){
            await this.$api.setting.apiDeleteOption(content).then(response =>{
                this.$message("刪除成功")
            })
            await this.DirectToReloadData(index)
        },
        async CheckDelete(index,content){
            switch(index){
                case 'ContactUnitOptions':
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
                            await this.DeleteData(index,content)
                        }
                    })
                    break;
                case 'DeviceOptions':
                    await this.DeleteData(index,content)
                    break;
                case 'MaintainContentOptions':
                    
                    break;
                case 'BrandOptions':
                    
                    break;
            }
        }
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