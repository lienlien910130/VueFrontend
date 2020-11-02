<template>
  <div class="graphic-editor-container">
      <div class="graphic-container">
          <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="6">
                <div class="block-wrapper">
                    <EquipmentType></EquipmentType>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="18">
                <div class="block-wrapper">
                    <Graphic></Graphic>
                </div>
            </el-col>
          </el-row>
          
      </div>
  </div>
</template>

<script>
export default {
    components:{
        EquipmentType: () => import('./components/EquipmentType'),
        Graphic: () => import('@/components/Graphic/index.vue'),
    },
}
</script>

<style lang="scss" scoped>
.graphic-editor-container {
  padding: 32px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 85px);

  .block-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 850px;
    overflow-x:hidden;
    overflow-y:auto;
  }

}
</style>


