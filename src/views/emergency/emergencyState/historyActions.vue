<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <GraphicTable
                    :list-query-params.sync="listQueryParams"
                    v-bind="tableAttrs"
                    v-on="tableEvent">
                    </GraphicTable>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    computed:{
        tableAttrs(){
            return {
                title:'historyActions',
                tableData: this.tableData,
                config:this.config,
                hasColumn:false,
                pageSizeList:[5,30,50]
            }
        },
        tableEvent(){
            return {
                clickPagination:this.clickPagination
            }
        }
    },
    data(){
        return{
            tableData:[],
            config:[
                    { label:'時間' , prop:'date'},
                    { label:'樓層' , prop:'floor'},
                    { label:'事件' , prop:'action'},
                    { label:'設備名稱' , prop:'name'},
                    { label:'點位名稱' , prop:'point'},
            ],
            listQueryParams:{
                page: 1,
                limit: 5,
                total: 0
            }
        }
    }
}
</script>