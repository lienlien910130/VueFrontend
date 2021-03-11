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
import { mapGetters } from 'vuex'
import { changeLink } from '@/utils/index'

export default {
    components:{ 
        Table: () => import('@/components/Table/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            origin:[],
            tableData:[],
            config:[
                { label:'帳號' , prop:'account', mandatory:true, message:'請輸入帳號'},
                { label:'密碼' , prop:'password', mandatory:true, message:'請輸入密碼'},
                { label:'用戶名' , prop:'name', mandatory:true,message:'請輸入用戶名'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述'},
                { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:false,message:'請選擇角色',
                isPattern:false,errorMsg:'',type:'array',typemessage:''},
                { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''},
                { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''},
                { label:'大樓' , prop:'linkBuildings',format:'buildingSelect', mandatory:true, message:'請選擇建築物',
                isPattern:false,errorMsg:'',type:'array',typemessage:''},
            ],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            //Dialog
            dialogButtonsName:[],
            dialogTitle:'',
            dialogConfig:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
        }
    },
    computed: {
        ...mapGetters([
            'buildingid'
        ]),
        tableAttrs(){
            return {
                tableData: this.tableData,
                config:this.config
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
                config: this.dialogConfig
            }
        },
    },
    watch:{
        buildingid:{
            handler:async function(){
                await this.init()
            },
            immediate:true
        },
    },
    methods:{
        async init(){
            await this.setAllAccount()
            await this.getAllAccount()
        },
        async setAllAccount(){
            this.origin = this.$deepClone(await this.$obj.Authority.getAllAccount())
            console.log(JSON.stringify(this.origin))
        },
        async getAllAccount(){
            var data = this.$deepClone(this.origin)
            this.listQueryParams.total = data.length
            this.tableData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
        },
        async handleTableRow(row, option){
            console.log(row, option)
            this.dialogData = []
            this.dialogConfig = this.config
            if(option === 'open'){
                var temp = this.$deepClone(row)
                temp = changeLink('user',temp,'open')
                this.dialogData.push(temp)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(option === 'delete'){
                var isOk = await this.$obj.Authority.deleteAccount(row.id)
                if(isOk){
                    this.$message('刪除成功')
                    await this.init()
                }
            }
            else if(option === 'create'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index !== 'cancel'){
                content = changeLink('user',content,'')
                console.log(JSON.stringify(content))
                var isOk = index === 'update' ? 
                    await this.$obj.Authority.updateAccount(JSON.stringify(content)) :
                    await this.$obj.Authority.postAccount(JSON.stringify(content))
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    await this.init()
                }
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