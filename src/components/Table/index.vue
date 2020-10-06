<template>
    <div class="mainreport-container">
        <div class="mainreport-editor-container">
            <Table :list-query-params.sync="listQueryParams" v-bind="tableAttrs" v-on="tableEvent" ></Table>
        </div>
    </div>
</template>
<script>


const DefaultTableQuery = {
  page: 1,
  limit: 15,
  total: 0
}

export default {
    name:'',
    components:{ 
    Table: () => import('@/components/Table/Table.vue') 
    },
    data(){
        return{
            loadingStatus: false,
            optionWidth: 280,
            tableConfig: [
                {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD'
                },
                {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD'
                }
            ],
            tableConfig_all:[
                {
                label: '申報年度',
                prop: 'declareYear',
                format: 'YYYY'
                },
                {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD'
                },
                {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD'
                },
                {
                label: '開始檢查日期',
                prop: 'checkStartDate',
                format:'YYYY-MM-DD'
                }
            ],
            listQueryParams: { ...DefaultTableQuery },
            tableData: [],
            buttonsName: ['編輯','刪除']
        }
    },
    computed: {
    tableAttrs() {
      return {
        config: this.tableConfig,
        config_all: this.tableConfig_all,
        tableData: this.tableData,
        loadingStatus: this.loadingStatus,
        buttonsName: this.buttonsName,
        optionColumnWidth: this.optionWidth,
        isExpand: true,
        title:'ReportPublic',
        sort:'declareDeadline'
      }
    },
    tableEvent() {
      return {
        subOpitonButton: this.handleTableOption,
        subClickPagination: this.handleRefreshList
      }
    }
  },
  created() {
   
  },
  methods: {
      // 表格操作功能 index：表格索引, row：表格行數據, option：按鈕名稱
    handleTableOption(index, content) {
       if (index === 'update'){
       
      }else if(index === 'create'){
        
      }else{
        
      }
    },
    // 分頁操作
    handleRefreshList() {
     
    }
  },
}
</script>
<style lang="scss" scoped>
    
.mainreport-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 85px);
    .report-form {
        padding-top: 30px;
    }
    .chart-wrapper {
        background: #fff;
        padding: 5px 16px 0;
        margin-bottom: 32px;
        height: 200px;
        overflow-x:hidden;
        overflow-y:auto;
        width: 100%;
    }
    .top{
        width: 100%;
    }
    .left {
        float: left;
        width: 520px;
    }
    .right {
        overflow: hidden;
        padding-left: 32px;

        .chart-wrapper{
            height: 746px;
        }
    }
    .report{
        font-size: 70px;
        color: red;
    }
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }

  .mainreport-editor-container {
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