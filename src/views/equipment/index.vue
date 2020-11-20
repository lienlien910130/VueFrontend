<template>
<div class="fireequ-container">
    <div class="fireequ-editor-container">
        
        <FloorSelect 
            style="margin-bottom: 20px;"
            v-bind="floorselectAttrs" 
            v-on="floorselectEvent">
        </FloorSelect>

        <div v-if="isChose">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="15" :lg="15">
                    <div class="block-wrapper">
                        <p>樓層平面圖</p>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9" :lg="9">
                    <div class="block-wrapper">
                        <div class="outside">
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>消防設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>建築設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>防火/防煙設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>一般設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="4">
                                <p>其他設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="block-wrapper">
                        <p>設備詳細資料</p>
                    </div>
                </el-col>
            </el-row>
        </div>

        
    </div>
    
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getbuInfo } from '@/api/building'

export default {
    name:'Device',
    components:{
        FloorSelect: () => import('@/components/Select/index.vue'),
        Canvas: () => import('./components/Canvas.vue'),
        Checkbox: () => import('./components/Checkbox.vue'),
        Window: () => import('@/components/Window/index.vue')
    },
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ]),
        floorselectAttrs() {
            return {
                selectData: this.selectData,
                title:'Device'
            }
        },
        floorselectEvent(){
            return{
                subChangeOption: this.handleSelectOption
            }
        }
    },
    data() {
        return {
            options:[],
            selectData:[],
            optionData:[],
            isChose:false,
            title:''
        }
    },
    watch: {
        buildingid: function(val){
            
        },
    },
    mounted() {
        this.getfloors()
    },
    methods: {
        getfloors() {
            this.selectData = []
            this.$api.building.apiGetBuildingFloors().then(response => {
            response.result.forEach(element => {
                var _temp = {
                id:element.id,
                label:element.floors>0 ? element.floors+'F' : '地下'+element.floors.substr(1)+'F'
                }
                this.selectData.push(_temp)
            });
            })
        },
        
        handleSelectOption(content){
            this.isChose = true
        }
    }
}
</script>
<style lang="scss" scoped>
.fireequ-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 125px);

  .block-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 700px;
    overflow-x:hidden;
    overflow-y:auto;
  }
}
</style>