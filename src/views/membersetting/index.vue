<template>
    <div class="editor-container">
        <el-tabs tab-position="left">
                <el-tab-pane label="建築物">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('ContactUnitOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="設備">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('DeviceOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('BrandOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="維護保養">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('MaintainContentOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('MaintainProcessOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="檢修及公安申報">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('LackStatusOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>  
                    </el-row>   
                </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    components:{
        SettingBlock:() => import('./components/SettingBlock.vue')
    },
    data(){
        return{
            options:[],
            input:'',
            type:'view',
            current:'',
            temp:[]
        }
    },
    async mounted(){
        await this.getOptions()
    },
    methods:{
        settingAttrs(data){
            return{
                title:data,
                option:this.optionsFilter(data),
                type:this.type,
                current:this.current
            }
        },
        async getOptions(){ //取得大樓的所有分類
            this.options = []
            await this.$api.setting.apiGetBuildingOptions().then(response => {
                var _temp = response.result.sort((x,y) => x.id - y.id)
                this.options = _temp.map(v => {
                this.$set(v, 'textName', v.textName) 
                return v
                })
            })
            this.contactunitoption = this.optionsFilter('ContactUnitOptions')
        },
        optionsFilter(title){
            let data = this.options.filter((item, index) => 
                item.classType == title 
            )
            return data
        },
        async handleButton(index,operation,content){
            console.log(index,operation,content)
            switch(operation){
                case 'create':
                    await this.PostData(index,content)
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
                    case 'LackStatusOptions':
                        this.temp = JSON.stringify(this.lackstatusoption)
                        break;
                    case 'MaintainProcessOptions':
                        this.temp = JSON.stringify(this.maintainprocessoption)
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
                    case 'LackStatusOptions':
                        this.lackstatusoption = JSON.parse(this.temp)
                        break;
                    case 'MaintainProcessOptions':
                        this.maintainprocessoption = JSON.parse(this.temp)
                        break;
                }
            }
        },
        async DirectToReloadData(index){
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
                case 'LackStatusOptions':
                    await this.getlackstatusOption()
                    break;
                case 'MaintainProcessOptions':
                    await this.getmaintainprocessOption()
                    break;
            }
        },
        async PostData(index,content){
            var temp = {
                    classType:index,
                    textName:content
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
                case 'LackStatusOptions':
                    
                    break;
                case 'MaintainProcessOptions':
                    
                    break;
            }
        }
    }
}
</script>
