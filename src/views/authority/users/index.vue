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
                { label:'帳號' , prop:'account', mandatory:true, message:'請輸入帳號'},
                { label:'密碼' , prop:'password', mandatory:true, message:'請輸入密碼'},
                { label:'用戶名' , prop:'name', mandatory:true,message:'請輸入用戶名'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述'},
                { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:false,message:'請選擇角色',
                isPattern:false,errorMsg:'',type:'array',typemessage:''},
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
                buttonsName:this.buttonsName,
                filterData:this.dialogSelect
            }
        },
        tableEvent(){
            return {
                clickPagination:this.getAllAccount,
                handleTableRow:this.handleTableRow
            }
        },
        dialogAttrs(){
            return{
                title:'account',
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
        await this.getAllAccount()
    },
    methods:{
        async getAllAccount(){
            await this.$api.authority.apiGetAllAccountAuthority().then(response=>{
                this.tableData = response.result.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
                this.tableData.forEach(obj=>{
                    let array = []
                    if(obj.linkRoles !== null)(
                        obj.linkRoles.forEach(item =>{
                            array.push(item.id)
                        })
                    )
                    obj.linkRoles = array
                })
                this.listQueryParams.total = response.result.length
            })
        },
        async getAllRole(){
            await this.$api.authority.apiGetAllRoleAuthority().then(response=>{
                response.result.sort((x,y) => x.id - y.id).forEach(item=>{
                var _temp = {
                    id: item.id,
                    label: item.name,
                    value: item.id
                }
                this.dialogSelect.push(_temp)
                })
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
                await this.$api.authority.apiDeleteAccountAuthority(row.id).then(async(response)=>{
                    this.$message('刪除成功')
                    await this.getAllAccount()
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
            if(content.linkRoles !== undefined){
                var _temp = []
                content.linkRoles.forEach(element => {
                    _temp.push({
                        "id": element
                    })
                })
                content.linkRoles = _temp
            }
            if(index === 'update'){
                await this.$api.authority.apiPatchAccountAuthority(content).then(async(response)=>{
                    this.$message('更新成功')
                    await this.getAllAccount()
                })
            }else if(index === 'create'){
                await this.$api.authority.apiPostAccountAuthority(content).then(async(response)=>{
                    this.$message('新增成功')
                    await this.getAllAccount()
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