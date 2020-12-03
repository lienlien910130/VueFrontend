<template>
    <div class="users-container">
        <div class="users-editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="chart-wrapper">
                    <Table
                       v-bind="tableAttrs"
                       v-on="tableEvent">
                       </Table>
                </div>
            </el-col>
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
                    label: '權限名稱',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入權限名稱',textarea:false
                },
                {
                    label: '描述',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入描述',textarea:false
                },
                {
                    label: '狀態',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入狀態',textarea:false
                }
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
                
            }
        },
    },
    async mounted() {
       
    },
    methods:{
        

    }
}
</script>
<style lang="scss" scoped>
    
.users-editor-container {
  padding: 20px;
  background-color: #d1e2ec;
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
   
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

}
</style>