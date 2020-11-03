<template>
  <div class="graphic-editor-container">
      <div class="graphic-container">
          <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="6">
              <div class="block-wrapper">
                <FloorSelect 
                  style="margin-bottom: 20px;"
                  v-bind="floorselectAttrs" 
                  v-on="floorselectEvent">
                </FloorSelect>
                <EquipmentType
                  v-on="equipmentTypeEvent">
                </EquipmentType>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="18">
                <div class="block-wrapper">
                    <Graphic
                    v-bind="graphicAttrs"></Graphic>
                </div>
            </el-col>
          </el-row>
          
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components:{
      FloorSelect: () => import('@/components/Select/index.vue'),
      EquipmentType: () => import('./components/EquipmentType'),
      Graphic: () => import('@/components/Graphic/index.vue'),
    },
    computed:{
      ...mapGetters([
            'id',
            'buildingid'
      ]),
      floorselectAttrs() {
          return {
              selectData: this.selectData,
              title:'GraphicFloor'
          }
      },
      floorselectEvent(){
          return{
              subChangeOption: this.handleSelectOption
          }
      },
      equipmentTypeEvent(){
          return{
              subDragOption: this.handleDragOption
          }
      },
      graphicAttrs(){
        return{
          movingImage:this.movingImage,
          imgDragOffset:this.imgDragOffset
        }
      }
    },
    data() {
        return {
            selectData:[],
            movingImage:null,
            imgDragOffset:{offsetX: 0,offsetY: 0}
        }
    },
    mounted(){
      this.getfloors()
    },
    methods:{
      getfloors() {
        this.selectData = []
        this.$api.building.apiGetFloors().then(response => {
          response.result.forEach(element => {
            var _temp = {
              id:element.id,
              label:element.floors>0 ? element.floors+'F' : '地下'+element.floors.substr(1)+'F'
            }
            this.selectData.push(_temp)
          });
        })
      },
      handleSelectOption(){

      },
      handleDragOption(e){
        this.imgDragOffset.offsetX = e.clientX - e.target.offsetLeft
        this.imgDragOffset.offsetY = e.clientY - e.target.offsetTop
        this.movingImage = e.target
      }
    }
}
</script>

<style lang="scss" scoped>
.graphic-editor-container {
  padding: 32px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 125px);

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


