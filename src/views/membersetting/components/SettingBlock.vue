<template>
    <div class="setting-wrapper">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{title}}</span>
                    <el-input style="float: right; padding: 10px 0" v-model="input" placeholder="請輸入內容"></el-input>
                    <el-button style="float: right; padding: 3px 0" type="text" 
                        @click="onSubmit">新增</el-button>
                </div>
                <div v-for="(item,index) in option" :key="index" class="text item">
                    <div v-if="type == 'edit' && current == item.id" >
                        <span >
                            {{ index+1 }}.
                        </span>
                        <el-input v-model="item.textName" style="width:80%"></el-input>
                        <i class="el-icon-circle-close" style="float: right;font-size: 30px;margin-top:5px" @click="onCancel()"></i>
                        <i class="el-icon-circle-check" style="float: right;font-size: 30px;margin-top:5px" @click="onEdit(item)"></i>
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
</template>
<script>
export default {
    props:['title','option','type','current'],
    data(){
        return{
            input:''
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
            this.$emit('subButton', this.title, 'cancel' , '')
        },
        onEdit(item){
            this.$emit('subButton', this.title, 'update' , item)
        },
        changeEdit(item){
            this.$emit('subButton', this.title, 'changeEdit' , item)
        },
        checkDelete(id){
            this.$emit('subButton', this.title, 'checkDelete' , id)
        },
    }
}
</script>
<style lang="scss" scoped>
.text {
    font-size: 18px;
    line-height: 25px;
  }

  .item {
    margin-bottom: 10px;
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

  .box-card {
    width: 480px;
  }
</style>