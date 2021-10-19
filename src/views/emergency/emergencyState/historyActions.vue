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
    </div>
</template>
<script>
import { blockmixin, sharemixin } from '@/mixin/index'
export default {
    mixins:[sharemixin, blockmixin],
    computed:{
        blockEvent(){
            return{
                clickPagination:this.clickPagination,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    watch: {
      wsmsg:{
          handler:async function(){
            console.log(this.wsmsg)
            this.blockData = this.wsmsg
            this.listQueryParams.total = this.wsmsg.length
          },
          immediate:true
      },
    },
    data(){
        return{
           
        }
    },
    methods:{
        async init(){
            this.title = 'historyActions'
            this.tableConfig = [
                { label:'時間' , prop:'date', isHidden:false},
                { label:'系統' , prop:'mode', isHidden:false},
                { label:'事件' , prop:'action', isHidden:false},
                { label:'點位' , prop:'point', isHidden:false}
            ]
            this.headerButtonsName = []
            this.isHasButtons = false
            this.buttonsName = []
        },
        async clickPagination(){

        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.clickPagination()
        },
        async changeTable(){},
    }
}
</script>