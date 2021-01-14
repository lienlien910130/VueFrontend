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
            <Dialog 
                v-bind="dialogAttrs" 
                v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import constant from '@/constant/production'

export default {
    components:{ 
        Table: () => import('@/components/Table/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            tableData:[],
            itemkey:Math.random(),
            config:[
                { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述'},
                { label:'排序' , prop:'sort',format:'number', mandatory:true, message:'請輸入排序',
                isPattern:false,errorMsg:'',type:'number',typemessage:''},
                { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''}
            ],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            buttonsName: ['編輯','刪除'],
            //Dialog
            dialogButtonsName:[],
            dialogTitle:'',
            dialogConfig:[],
            dialogSelect:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
        }
    },
    computed: {
        tableAttrs(){
            return {
                tableData: this.tableData,
                itemkey:this.itemkey,
                config:this.config,
                buttonsName:this.buttonsName
            }
        },
        tableEvent(){
            return {
                clickPagination:this.getAllRole,
                handleTableRow:this.handleTableRow
            }
        },
        dialogAttrs(){
            return{
                title:'roles',
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.dialogConfig,
                selectData: this.dialogSelect
            }
        },
    },
    async mounted() {
        await this.getAllRole()
    },
    methods:{
        async getAllRole(){
            await this.$api.authority.apiGetAllRoleAuthority().then(response=>{
                this.tableData = response.result.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
                this.listQueryParams.total = response.result.length
            })
        },
        async handleTableRow(index, row, option){
            console.log(index, row, option)
            this.dialogData = []
            this.dialogConfig = this.config
            if(option === '編輯'){
                this.dialogData.push(row)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(option === '刪除'){
                await this.$api.authority.apiDeleteRoleAuthority(row.id).then(async(response)=>{
                    this.$message('刪除成功')
                    await this.getAllRole()
                })
            }
            else if(option === '新增'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            content.sort = content.sort.toString()
            if(index === 'update'){
                await this.$api.authority.apiPatchRoleAuthority(content).then(async(response)=>{
                    this.$message('更新成功')
                    await this.getAllRole()
                })
            }else if(index === 'create'){
                await this.$api.authority.apiPostRoleAuthority(content).then(async(response)=>{
                    this.$message('新增成功')
                    await this.getAllRole()
                })
            }
            this.innerVisible = false
        },

    }
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
    background: #fff;
    padding: 5px 16px 0;
    margin-bottom: 32px;
    height: 730px;
    overflow-x:hidden;
    overflow-y:auto;
    width: 100%;
}
</style>