<template>
    <div class="setting-wrapper">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{ titleToch }}</span>
                    
                    <div style="margin-top:10px">
                        <!-- <el-row v-if="title =='BrandOptions'">
                            <el-input :style="{float: 'left', margin: '5px',width:'30%'}" v-model="input" placeholder="請輸入名稱"></el-input>
                            <el-input 
                            :style="{float: 'left', margin: '5px',width:'45%'}" v-model="value" placeholder="請輸入型號"></el-input>
                            <el-button style="float: right;" type="primary" 
                            @click="onSubmit">新增</el-button>
                        </el-row> -->
                        <el-row >
                            <el-input :style="{float: 'left', margin: '5px',width:inputstyle}" v-model="input" placeholder="請輸入名稱"></el-input>
                            <el-button style="float: right;" type="primary" 
                            @click="onSubmit">新增</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="settingbody">
                    <div v-for="(item,index) in option" :key="index" class="text" :style="itemtext">
                        <div v-if="type == 'edit' && current == item.id" >
                            <span >
                                名稱：
                            </span>
                            <el-input v-model="item.textName" style="width:60%"></el-input>
                            <!-- <span v-if="title =='BrandOptions'">
                                <br>
                                型號：
                            </span>
                            <el-input v-if="title =='BrandOptions'" v-model="item.value" style="width:60%"></el-input> -->
                            <i class="el-icon-circle-close" style="float: right;font-size: 30px;margin-top:5px" @click="onCancel()"></i>
                            <i class="el-icon-circle-check" style="float: right;font-size: 30px;margin-top:5px" @click="onEdit(item)"></i>
                        </div>
                        <div v-else >
                            <div :style="{display:'inline-block',width:labelstyle}">
                                 <span>
                                    {{ index+1 }}. 
                                    <!-- <span v-if="title =='BrandOptions'">
                                        廠牌
                                    </span>  -->
                                    {{ item.textName }} 
                                </span>
                            </div>
                            <!-- <div v-if="title =='BrandOptions'" style="display:inline-block;width:30%">
                                <span >
                                    型號：{{ item.value }} 
                                </span>
                            </div> -->
                            <span v-if="current == ''">
                                <i class="el-icon-delete" style="float: right;font-size: 25px;" @click="checkDelete(item.id)"></i>
                                <i class="el-icon-edit" style="float: right;font-size: 25px;" @click="changeEdit(item)"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
            </el-card>
    </div>
</template>
<script>
export default {
    props:['title','option','type','current'],
    data(){
        return{
            input:''
        }
    },
    computed:{
        titleToch(){
            switch(this.title){
                case 'ContactUnitOptions':
                    return '廠商類別'
                    break;
                case 'DeviceOptions':
                    return '設備種類'
                    break;
                case 'MaintainContentOptions':
                    return '維護保養內容'
                    break;
                case 'BrandOptions':
                    return '廠牌名稱&型號'
                    break;
                case 'LackStatusOptions':
                    return '缺失內容改善狀況'
                    break;
                case 'MaintainProcessOptions':
                    return '維護保養處理狀況'
                    break;
            }
        },
        inputstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '60%'
            } else {
                return '80%'
            }
        },
        labelstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '80%'
            } else {
                // if(this.title == 'BrandOptions'){
                //     return '40%'
                // }
                return '60%'
            }
        },
        itemtext(){
            if (this.$store.state.app.device === 'mobile') {
                return 'font-size:14px'
            } else {
                return 'font-size:18px'
            }
        }
    },
    methods:{
        onSubmit(){
            if(this.input == ''){
                this.$message({
                    message: '請輸入名稱',
                    type: 'warning'
                })
            }else{
                this.$emit('subButton', this.title, 'create' , this.input)
            }
        },
        onCancel(){
            this.$emit('subButton', this.title, 'cancelEdit' , '')
        },
        onEdit(item){
            this.$emit('subButton', this.title, 'update' , item)
        },
        changeEdit(item){
            this.$emit('subButton', this.title, 'changeEdit' , item)
        },
        checkDelete(id){
             this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('subButton', this.title, 'checkDelete' , id)
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.setting-wrapper{
    margin: 10px;
    .el-card{
        height: 400px;
    }
    .text {
    line-height: 25px;
    margin-bottom: 10px;
  }
  
  .settingbody{
    height: 240px;
    overflow: auto;
  }
   
}


  

    i{
        cursor: pointer;
    }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>