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
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingMaintainTimeOptions('MaintainTimeOptions')"
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
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('PublicSafeTimeOptions')"
                            v-on:handleButton="handleButton"
                            ></SettingBlock>
                        </el-col> 
                        <el-col :xs="24" :sm="24" :md="24" :lg="8">
                            <SettingBlock
                            v-bind="settingAttrs('InspectionTimeOptions')"
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
import Setting from '@/object/setting'
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
        settingMaintainTimeOptions(data){
            let array = this.options.filter((item, index) => 
                item.classType == 'MaintainTimeOptions'  && item.value == 'current'
            )
            return{
                title:data,
                option:this.optionsFilter(data),
                type:this.type,
                current:this.current,
                radio:array[0] !== undefined ? array[0].id : ''
            }
        },
        async getOptions(){ //取得大樓的所有分類
            this.options = await Setting.getAllOption()
            this.$store.dispatch('building/setoptions', this.options)
            if(this.setting_record == 0){
                this.$store.dispatch('record/saveSettingRecord',1)
            }
        },
        optionsFilter(title){
            let data = this.options.filter((item, index) => 
                item.classType == title 
            )
            if(title == 'PublicSafeTimeOptions' || title == 'InspectionTimeOptions'){
                data = data.sort(function(x,y){
                    var _data1 = new Date(x.textName)
                    var _data2 = new Date(y.textName)
                    return  _data2 - _data1
                })
            }
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
                    await this.DeleteData(content)
                    break;
                case 'maintainTimeOptions' :

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
                default:
                    break;
            }
        },
        async PostData(index,content){
            var temp = {
                'classType' : index,
                'textName': content,
                'sort':99
            }
            var result = await Setting.postOption(temp)
            if(Object.keys(result).length !== 0){
                this.$message("新增成功")
                await this.getOptions()
                this.$socket.sendMsg('setting', 'create' , result)
            }else{
                this.$message.error('該名稱已存在，請重新輸入')
            }
        },
        async UpdateData(content){
            var result = await Setting.updateOption(content)
            if(Object.keys(result).length !== 0){
                this.$message("更新成功")
                this.type = 'view'
                this.current = ''
                await this.getOptions()
                this.$socket.sendMsg('setting', 'update' , result)
            }else{
                this.$message.error('該名稱已存在，請重新輸入')
            }
        },
        async DeleteData(content){
            var isOk = await Setting.deleteOption(content)
            if(isOk){
                this.$message("刪除成功")
                await this.getOptions()
                this.$socket.sendMsg('setting', 'delete' , content)
            }
        }
    }
}
</script>
