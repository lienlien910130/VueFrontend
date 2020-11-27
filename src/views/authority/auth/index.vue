<template>
    <div class="auth-container">
        <div class="auth-editor-container">
           <el-row :gutter="32">
               <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="chart-wrapper">
                       
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="chart-wrapper">
                       <Table
                       v-bind="tableAttrs"
                       v-on="tableEvent">
                       </Table>
                    </div>
                </el-col>
           </el-row>
        </div>
    </div>
</template>
<script>

export default {
    components:{ 
    
      Table: () => import('@/components/Table/index.vue'),
    },
    data(){
        return{
            tableData:[],
            itemkey:Math.random(),
            config:[
                {
                    label: '缺失項目',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入缺失項目',textarea:false
                },
            ]
        }
    },
    computed: {
        tableAttrs(){
            return {
                tableData: this.tableData,
                itemkey:this.itemkey,
                config:this.config
            }
        },
        tableEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        },
    },
    mounted() {
    
    },
    methods:{
        
    }
}
</script>
<style lang="scss" scoped>
    
.auth-editor-container {
  padding: 20px;
  background-color: #d1e2ec;
  position: relative;
  max-height: calc(100vh - 125px);
  min-height: calc(100vh - 125px);
  overflow: auto;
   
    .chart-wrapper {
        background: #fff;
        padding: 5px 16px 0;
        margin-bottom: 32px;
        height: 730px;
        overflow-x:hidden;
        overflow-y:auto;
        width: 100%;
    }
    
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }

  .maintain-editor-container {
    .left{
      float: none;
      width: 100%;
    }
    .right{
      float: none;
      width: 100%;
      padding-left:0px;
    }
  }
}
</style>