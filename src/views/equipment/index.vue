<template>
<div class="fireequ-container">
    <div class="fireequ-editor-container">
        
        <!-- <FloorSelect 
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
        </div> -->

        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                </div>
            </el-col>
        </el-row>
    </div>
    
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name:'Device',
    components:{
    },
    computed:{
        
    },
    data() {
        return {
           
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.fireequ-editor-container {
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;

  .block-wrapper {
    background: #fff;
    padding: 10px;
    margin-bottom: 32px;
    height: 720px;
  }
}
</style>