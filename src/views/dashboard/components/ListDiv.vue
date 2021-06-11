<template>
<div>
    <div>
        {{ title | changeTitleName }}
    </div>
    <div class="list" >
        <div 
        v-for="(item,index) in list" :key="item.getID()"
        style="line-height:40px;">
            <el-link @click="handleList(item)" :style="check(item)">
                {{ '【'+(index+1)+'】'+ listname(item)}}
            </el-link>
        </div>
    </div>
    <el-row>
        <div v-if="total > 0" class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-size="limit"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </el-row>
</div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ListDiv',
    props:{
        title:{ 
            type: String,
            required: true
        },
        list:{
            type: Array,
            required: true
        },
        listQueryParams: {
            type: Object
        }
    },
    filters:{
        changeTitleName: function(val) {
             var name = val == 'maintain' ? '維護保養' : 
             val == 'inspection' ? '檢修申報' : '公安申報'
             return name
        }
    },
    computed:{
        listname(){
            return function (item) {
                if(this.title == 'maintain'){
                   return '故障日期：'+ item.getDateOfFailure()+
                   '，設備：'+item.getDevicesName()
                }else{
                    return '下次檢查日期：'+item.getNextInspectionDate()
                }
            }
        },
        page: function() {
            return this.listQueryParams.pageIndex || 1
        },
        limit: function() {
            return this.listQueryParams.pageSize || 10
        },
        total: function() {
            return this.listQueryParams.total || 0
        }
    },
    methods:{
        handleList(item){
            this.$emit('handleList',this.title,item)
        },
        check(val){
            if(this.title == 'maintain'){
                return {}
            }else{
                var datetime = moment(new Date()).valueOf()
                var data = moment(val.getNextInspectionDate()).valueOf()
                if(datetime-data > 0){
                    return {color:'red'}
                }else{
                    return {}
                }
            }
        },
        // 改變翻頁組件中每頁數據總數
        handleSizeChange(val) {
            this.pictLoading = true
            this.listQueryParams.pageSize = val
            this.listQueryParams.pageIndex = 1 // 改變翻頁數目，將頁面=1
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        },
        // 跳到當前是第幾頁
        handleCurrentChange(val) {
            this.pictLoading = true
            this.listQueryParams.pageIndex = val
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        }
    }
}
</script>
<style lang="scss" scoped>

.list {
    width: 100%;
    height: 300px;
    padding-top: 10px;
    overflow-x:hidden;
    overflow-y:auto;
}

</style>