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
                            v-bind="settingAttrs('DeviceStatusOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col>
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
import { mapGetters } from 'vuex'
export default {
    components:{
        SettingBlock:() => import('./components/SettingBlock.vue')
    },
    computed:{
      ...mapGetters([
          'buildingcontactunit',
          'buildingdevices'
      ]),
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
            this.options = await this.$obj.Setting.getAllOption()
            this.$store.dispatch('building/setbuildingoptions',this.options)
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
                    await this.UpdateData(content)
                    break;
                case 'delete':
                    await this.DeleteData(index,content)
                    break;
                case 'cancelEdit':
                    this.type='view'
                    this.current = ''
                    this.options = JSON.parse(this.temp)
                    break;
                case 'changeEdit':
                    this.type = 'edit'
                    this.current = content.id
                    this.temp = JSON.stringify(this.options)
                    break;
                case 'checkDelete':
                    await this.CheckDelete(index,content)
                    break;
                default:
                    break;
            }
        },
        async PostData(index,content){
            var temp = {
                    classType:index,
                    textName:content
            }
            var isOk = await this.$obj.Setting.postOption(JSON.stringify(temp))
            if(isOk){
                this.$message("新增成功")
                await this.getOptions()
            }
        },
        async UpdateData(content){
            var isOk = await this.$obj.Setting.updateOption(JSON.stringify(content))
            if(isOk){
                this.$message("更新成功")
                this.type = 'view'
                this.current = ''
                await this.getOptions()
            }
        },
        async DeleteData(content){
            var isOk = await this.$obj.Setting.deleteOption(content)
            if(isOk){
                this.$message("刪除成功")
                await this.getOptions()
            }
        },
        async CheckDelete(index,content){
            switch(index){
                case 'ContactUnitOptions':
                    var array = this.buildingcontactunit.filter((item,index)=> item.type == content)
                    if(array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有廠商資料，請先刪除關聯的資料',
                            type: 'warning'
                        })
                    }else{
                        await this.DeleteData(content)
                    }
                    break;
                case 'DeviceOptions':
                    var array = this.buildingdevices.filter((item,index)=> item.type == content)
                    if(array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有設備資料，請先刪除關聯的資料',
                            type: 'warning'
                        })
                    }else{
                        await this.DeleteData(content)
                    }
                    break;
                case 'MaintainContentOptions': //尚未解決
                    var maintainList = await this.$obj.Device.getBuildingMaintainList()
                    var array = maintainList.filter((item,index)=> item.name == content)
                    if(array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有維護保養資料，請先刪除關聯的資料',
                            type: 'warning'
                        })
                    }else{
                        await this.DeleteData(content)
                    }
                    break;
                case 'BrandOptions':
                    var array = this.buildingdevices.filter((item,index)=> item.brand == content)
                    if(array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有設備資料，請先刪除關聯的資料',
                            type: 'warning'
                        })
                    }else{
                        await this.DeleteData(content)
                    }
                    break;
                case 'LackStatusOptions':
                    await this.DeleteData(content)
                    break;
                case 'MaintainProcessOptions':
                    await this.DeleteData(content)
                    break;
                case 'DeviceStatusOptions':
                    var array = this.buildingdevices.filter((item,index)=> item.status == content)
                    if(array.length){ //有資料
                        this.$message({
                            showClose: true,
                            message: '該類別尚有設備資料，請先刪除關聯的資料',
                            type: 'warning'
                        })
                    }else{
                        await this.DeleteData(content)
                    }
                    break;
            }
        }
    }
}
</script>
