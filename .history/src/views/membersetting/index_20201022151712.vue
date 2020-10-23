<template>
<div class="setting-container">
        <div class="setting-editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>廠商類別</span>
                                <el-input style="float: right; padding: 10px 0" v-model="input" placeholder="请输入内容"></el-input>
                                <el-button style="float: right; padding: 3px 0" type="text" 
                                @click="onSubmit">新增</el-button>
                            </div>
                            <div v-for="(item,index) in option" :key="index" class="text item">
                                <div v-if="type == 'edit' && current == item.id" >
                                    <span >
                                        {{ index+1 }}.
                                    </span>
                                    <el-input v-model="item.textName" style="width:80%"></el-input>
                                    <i class="el-icon-circle-close" style="float: right;font-size: 25px;" @click="onCancel(item)"></i>
                                    <i class="el-icon-circle-check" style="float: right;font-size: 25px;" @click="onEdit(item)"></i>
                                </div>
                                <div v-else >
                                    <span >
                                        {{ index+1 }}.{{ item.textName }}
                                    </span>
                                    <span v-if="current == ''">
                                        <i class="el-icon-delete" style="float: right;font-size: 25px;" @click="checkDelete(item.id)"></i>
                                        <i class="el-icon-edit" style="float: right;font-size: 25px;" @click="changeEdit(item)"></i>
                                    </span>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getcontactunitList  } from '@/api/building'
import { mapGetters } from 'vuex'

export default {
    components:{

    },
    data(){
        return{
            input:'',
            option:[],
            type:'view',
            current:'',
            temp:[]
        }
    },
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ])
    },
    mounted(){
        this.getcontactunitOption()
    },
    methods:{
        getcontactunitOption(){ //取得大樓的廠商分類
            this.option = []
            this.$api.building.apiGetContactUnitOption().then(response => {
                console.log('get=>'+JSON.stringify(response))
                response.result.forEach(item => {
                    let _array = { 
                        id : item.id, 
                        label: item.textName, 
                        value: item.id
                    }
                    this.option.push(_array)  
                    })
            })
        },
        checkDelete(optionid){ //取得廠商資料
            var array = []
            getcontactunitList(this.buildingid).then(response => {
                this.array = response.result.filter((item, index) => 
                    item.type == optionid )
                if(this.array.length){ //有資料
                    this.$message({
                        showClose: true,
                        message: '該類別尚有廠商資料，請先刪除廠商資料!',
                        type: 'warning'
                    });
                }else{
                    this.onDelete(optionid)
                }
            }).catch(error => {
                console.log("error=>"+error);
            })
        },
        changeEdit(item){
            this.type='edit'
            this.current = item.id
            this.temp = JSON.stringify(this.option)
        },
        onCancel(item){
            this.type='view'
            this.current = ''
            this.option = JSON.parse(this.temp)
        },
        onSubmit(){
            var temp ={
                classType :"ContactUnitOptions",
                textName:this.input
            }
            this.$api.building.apiPostContactUnitOption(temp).then(response =>{
                this.$message("新增成功")
                this.getcontactunitOption()
                this.input = ''
            })
            // crecontactunitOption(this.buildingid,_temp).then(response =>{
            //     this.$message("新增成功")
            //     this.getcontactunitOption()
            //     this.input = ''
            // }).then(error=>{
            //     console.log('error=>'+error)
            // })
        },
        onEdit(data){
            console.log('item=>'+JSON.stringify(data))
            this.$api.building.apiPatchContactUnitOption(data).then(response =>{
                this.$message("更新成功")
                this.input = ''
                this.type='view'
                this.current = ''
            })
            // editcontactunitOption(item).then(response =>{
            //     this.$message("更新成功")
            //     this.input = ''
            //     this.type='view'
            //     this.current = ''
            // }).then(error=>{
            //     console.log('error=>'+error)
            // })
        },
        onDelete(optionid){
            this.$api.building.apiDeleteContactUnitOption(optionid).then(response =>{
                this.$message("刪除成功")
                this.getcontactunitOption()
                this.input = ''
            })
            // delcontactunitOption(optionid).then(response =>{
            //     this.$message("刪除成功")
            //     this.getcontactunitOption()
            //     this.input = ''
            // }).then(error=>{
            //     console.log('error=>'+error)
            // })
        },
        handleBlockOption(index, content){

        }
    }
}
</script>

<style lang="scss" scoped>
.setting-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 85px);

  .setting-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 800px;
    overflow-x:hidden;
    overflow-y:auto;
  }

}
  .text {
    font-size: 18px;
    line-height: 25px;
  }

  .item {
    margin-bottom: 10px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>