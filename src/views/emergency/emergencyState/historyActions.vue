<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs"
                    v-on="blockEvent"
                    :blockData="reversedMessage"></Block>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { blockmixin } from '@/mixin/index'
export default {
    mixins:[blockmixin],
    computed:{
        ...Vuex.mapGetters([
            'wsmsg'
        ]),
        blockEvent(){
            return{
                clickPagination:this.clickPagination,
                resetlistQueryParams:this.resetlistQueryParams
            }
        },
        reversedMessage: function () {
          return this.actionList.sort(function(a,b){
            return new Date(b.date) - new Date(a.date)
          })
        }
    },
    mounted(){
        this.init()
        this.changeTable(true)
    },
    watch: {
        wsmsg:{
            handler:async function(){
                this.actionList = this.wsmsg
                this.listQueryParams.total = this.wsmsg.length
            },
            immediate:true
        }
    },
    data(){
        return{
           actionList:[]
        }
    },
    methods:{
        init(){
            this.title = 'historyActions'
            this.hasSearch = false
            this.tableConfig = [
                { label:'時間' , prop:'date', isHidden:false},
                { label:'系統' , prop:'mode', isHidden:false},
                { label:'動作' , prop:'actionName', isHidden:false},
                { label:'區域' , prop:'areaName', isHidden:false},
                { label:'設備' , prop:'deviceName', isHidden:false},
                { label:'點位' , prop:'label', isHidden:false}
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
        changeTable(value){
            this.isTable = value
        }
    }
}
</script>