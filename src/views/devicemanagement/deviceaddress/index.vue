<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="chart-wrapper">
                    <Table
                        :list-query-params.sync="listQueryParams"
                        v-bind="tableAttrs"
                        v-on="tableEvent">
                    </Table>
                </div>
            </el-col>
        </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    components:{ 
        Table: () => import('@/components/Table/index.vue'),
    },
    data(){
        return{
            originalDevice:[],
            tableData:[],
            config:[
                { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20'},
                { label:'類型' , prop:'type',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200'},
                { label: '設備狀況',prop: 'status',format:'DeviceStatusOptions',mandatory:true, message:'請選擇設備狀況'},
                { label:'系統' , prop:'systemNumber', mandatory:true, message:'請輸入系統編號',
                isPattern:false,errorMsg:'',maxlength:'2'},
                { label:'迴路' , prop:'circuitNumber', mandatory:true, message:'請輸入迴路編號',
                isPattern:false,errorMsg:'',maxlength:'3'},
                { label:'點位' , prop:'address', mandatory:true, message:'請輸入點位',
                isPattern:false,errorMsg:'',maxlength:'5'},
            ],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            }
        }
    },
    computed: {
        ...mapGetters([
            'buildingid',
        ]),
        tableAttrs(){
            return {
                title:'address',
                tableData: this.tableData,
                config:this.config,
                hasColumn:false,
                pageSizeList:[50,100]
            }
        },
        tableEvent(){
            return {
                clickPagination:this.getAllDevice,
                handleTableRow:this.handleTableRow
            }
        },
    },
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    await this.init()
                }
            },
            immediate:true
        }
    },
    methods:{
        async init(){
            await this.setAllDevice()
            await this.getAllDevice()
        },
        async setAllDevice(){
            this.originalDevice = this.$deepClone(await this.$obj.Device.getBuildingDevicesManage())
        },
        async getAllDevice(){
            var data = this.$deepClone(this.originalDevice)
            this.listQueryParams.total = data.length
            this.tableData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => y.status - x.status)
        },
        async handleTableRow(data){
            var isOk = await this.$obj.Device.updateDevicesAddress(JSON.stringify(data))
            if(isOk){
                this.$message('更新成功')
                await this.init()
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
    background: #fff;
    padding: 5px 16px 0;
    height: 730px;
    overflow-x:hidden;
    overflow-y:auto;
    width: 100%;
}
</style>