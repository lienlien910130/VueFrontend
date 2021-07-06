<template>
    <div class="setting-wrapper">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>{{ titleToch }}</span>
                    <div style="margin-top:10px">
                        <el-row
                        >
                            <el-date-picker
                            v-if="title === 'PublicSafeTimeOptions' || 
                                title === 'InspectionTimeOptions' "
                            :style="{float: 'left', margin: '5px',width:inputstyle}"
                            v-model="input"
                            type="date"
                            placeholder="請選擇日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-input 
                            v-else
                            :style="{float: 'left', margin: '5px',width:inputstyle}" v-model="input" 
                            placeholder="請輸入名稱" @keyup.enter.native="onSubmit"
                            maxlength="30"
                            show-word-limit></el-input>
                            <el-button style="float: right;" type="primary" size="mini"
                            @click="onSubmit">新增</el-button>
                            <el-button 
                            v-if="title == 'MaintainTimeOptions'"
                            style="float: right;" type="info" size="mini"
                            @click="onSave">儲存</el-button>
                        </el-row>
                    </div>
                </div>
                <div class="settingbody">
                    <div>
                        <div 
                        v-for="(item,index) in option" :key="index" class="text" 
                        :style="itemtext">
                            <div v-if="type == 'edit' && current == item.id" >
                                <el-input v-model="item.textName" style="width:60%" maxlength="30"
                                show-word-limit @keyup.enter.native="onEdit(item)"></el-input>
                                <i class="el-icon-circle-close" style="float: right;font-size: 30px;margin-top:5px" 
                                @click="onCancel()"></i>
                                <i 
                                class="el-icon-circle-check" 
                                style="float: right;font-size: 30px;margin-top:5px" 
                                @click="onEdit(item)"></i>
                            </div>
                            <div v-else >
                                <div :style="{display:'inline-block',width:labelstyle}">
                                    <el-radio 
                                    v-if="title == 'MaintainTimeOptions'"
                                    v-model="radio" :label="item.id">
                                        <span style="color:#303133;font-size:18px">
                                            {{ index+1 }}. 
                                            {{ item.textName }} 
                                        </span>
                                    </el-radio>
                                    <span
                                    v-else>
                                        {{ index+1 }}. 
                                        {{ item.textName }} 
                                    </span>
                                </div>
                                <span v-if="current == '' && item.value == null ">
                                    <i class="el-icon-delete" 
                                    style="float: right;font-size: 25px;" 
                                    @click="deleteData(item.id)"></i>
                                    <i 
                                    v-if="title !== 'PublicSafeTimeOptions' && 
                                    title !== 'InspectionTimeOptions' && title !== 'MaintainTimeOptions' "
                                    class="el-icon-edit" 
                                    style="float: right;font-size: 25px;" 
                                    @click="changeEdit(item)"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String
        },
        option:{
            type:Array
        },
        type:{
            type:String
        },
        current:{
            type:String
        },
        radio:{
            type:String
        }
    },
    data(){
        return{
            input:'',
            origin:'',
            datetime:null
        }
    },
    computed:{
        titleToch(){
            switch(this.title){
                case 'ContactUnitOptions':
                    return '廠商類別'
                case 'MaintainContentOptions':
                    return '維護保養內容'
                case 'LackStatusOptions':
                    return '公安申報缺失內容改善狀況'
                case 'MaintainProcessOptions':
                    return '維護保養處理狀況'
                case 'PublicSafeTimeOptions':
                    return '公安申報提醒設定'
                case 'InspectionTimeOptions':
                    return '檢修申報提醒設定'
                case 'MaintainTimeOptions':
                    return '維護保養提醒設定'
            }
        },
        inputstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '60%'
            } else {
                return '79%'
            }
        },
        labelstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '80%'
            } else {
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
                    type: 'error'
                })
            }else{
                this.$emit('handleButton', this.title, 'create' , this.input)
            }
        },
        onSave(){
            this.$emit('handleButton', this.title, 'maintainTimeOptions' , this.radio)
        },
        onCancel(){
            this.$emit('handleButton', this.title, 'cancelEdit' , '')
        },
        onEdit(item){
            if(item.textName !== this.origin){
               this.$emit('handleButton', this.title, 'update' , item) 
            }else{
                this.onCancel()
            }
        },
        changeEdit(item){
            this.origin = item.textName
            this.$emit('handleButton', this.title, 'changeEdit' , item)
        },
        deleteData(id){
             this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('handleButton', this.title, 'delete' , id)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.setting-wrapper {
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