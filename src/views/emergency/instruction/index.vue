<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
            </el-col>
        </el-row>

        <DialogForm 
        ref="dialogform"
        v-if="innerVisible === true"
        v-bind="dialogAttrs"
        v-on:handleDialog="handleDialog"></DialogForm>

        <DialogExcel 
        ref="dialogexcel"
        v-if="excelVisible === true"
        v-bind="excelAttrs"
        v-on:handleDialog="handleDialog"></DialogExcel>

    </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from '@/mixin/index'
import { SampleNodeList } from '@/object/index'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getSampleNode,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    methods: {
        async init(){
            this.title = 'instruction'
            this.tableConfig = SampleNodeList.getTableConfig()
            await this.getSampleNode()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getSampleNode()
        },
        async getSampleNode(){
            var data = await SampleNodeList.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            this.dialogButtonsName = []
            if(index === 'open'){
                this.dialogStatus = 'update'
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    // this.$store.dispatch('building/setDevice')
                    // this.$socket.sendMsg('sampleNode', 'delete' , content.getID())
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    await this.getSampleNode()
                }else{
                    this.$message.error('系統錯誤') 
                }
            }else if(index === 'empty'){
                this.dialogData.push( SampleNodeList.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.excelVisible = true
                this.excelType = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index === 'update' || index === 'create'){
                var result = index === 'update' ? await content.update() : await content.create()
                if(Object.keys(result).length !== 0){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    // if(index === 'update'){
                    //     this.$store.dispatch('building/setDevice')
                    // }
                    // this.$socket.sendMsg('sampleNode', index , result)
                    await this.getSampleNode()
                    this.innerVisible = false
                }else{
                    this.$message.error('節點類型已存在，請重新輸入')
                }
            }else if(index === 'uploadExcelSave'){
                var result = await SampleNodeList.postMany(content)
                if(result.result.length){
                    this.$message('新增成功')
                    // this.$socket.sendMsg('sampleNode', index , result.result)
                    await this.getSampleNode()
                    this.excelVisible = false
                }
                if(result.repeatDataList !== undefined){
                    var list = []
                    result.repeatDataList.forEach(item=>{
                        list.push(item.name)
                    })
                    this.$message.error('【'+list.toString()+'】節點類型已存在，請重新上傳')
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
        }
    }
}
</script>
