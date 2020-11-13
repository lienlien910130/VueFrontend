<template>
    <div class="analysis-container">
      <div class="analysis-editor-container">
        <Select 
          style="margin-bottom: 20px;"
          v-bind="selectAttrs" 
          v-on="selectEvent">
        </Select>
        <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <LineChart height="100%" width="100%" />
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
        </el-row>
         <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <div class="block-wrapper">
                    <p>基本資料</p>
                </div>
            </el-col>
        </el-row>
      </div>
    </div>

</template>
<script>
export default {
    components:{
      Select: () => import('@/components/Select/index.vue'),
      LineChart :() =>import('@/components/Charts/LineMarker')
    },
    computed:{
      selectAttrs() {
        return {
          selectData: this.selectData,
          title:'Analysis'
        }
      },
      selectEvent(){
        return{
          subChangeOption: this.handleSelectOption
        }
      },
    },
    data(){
        return{
            selectData:[
                {id:1,label:'過去七天內'},
                {id:2,label:'過去一個月'},
                {id:3,label:'過去三個月'}
            ],

        }
    },
    methods:{
        handleSelectOption(){

        }
    }
}
</script>
<style lang="scss" scoped>
.analysis-container{
    height: 100%;

    .analysis-editor-container {
    padding: 20px;
    background-color: rgb(209, 226, 236);
    position: relative;
    max-height: calc(100vh - 125px);
    overflow: auto;

        .block-wrapper {
            background: #fff;
            padding: 5px 5px;
            margin-bottom: 32px;
            height: 300px;
            overflow-x:hidden;
            overflow-y:auto;
        }

    }
}

</style>