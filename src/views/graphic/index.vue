<template>
  <div class="graphic-container">
      <div class="graphic-editor-container">
        <FloorSelect 
          style="margin-bottom: 20px;"
          v-bind="floorselectAttrs" 
          v-on="floorselectEvent">
        </FloorSelect>

        <el-popover
          placement="left-start"
          title="快捷鍵"
          width="270"
          trigger="manual"
          v-model="visible" >
            <p class="tipck">1.【Alt】+【➚】+【滑鼠左鍵】：平移</p>
            <p class="tipck">2.【Alt】+【Q】：放大</p>
            <p class="tipck">3.【Alt】+【W】：縮小</p>
            <p class="tipck">4.【Alt】+【S】：選取</p>
            <p class="tipck">5.【Alt】+【T】：文字</p>
            <p class="tipck">6.【Alt】+【R】：矩形</p>
            <p class="tipck">7.【Alt】+【A】：多邊形</p>
            <p class="tipck">8.【Ctrl】+【C】：複製</p>
            <p class="tipck">9.【Ctrl】+【V】：貼上</p>
            <p class="tipck">10.【Ctrl】+【Z】：返回上一步</p>
            <p class="tipck">11.【Delete】：刪除</p>
            <p class="tipck">12.【Insert】：下載圖片</p>
            <i class="el-icon-warning" slot="reference" @click="visible = !visible"
            style="font-size:40px" type="button"/>
        </el-popover>

        <el-button v-if="type =='view'" type="primary" @click="changetype('edit')">編輯圖控</el-button>
        <el-button v-else type="primary" @click="changetype('view')">關閉編輯</el-button>
        <el-button type="primary" @click="resetcanvas">復原位置</el-button>
        <el-button type="primary" @click="savetoimage">匯出圖片</el-button>


         <div class="block-wrapper">
          <el-row>
             <el-col :xs="24" :sm="24" :md="24" :lg="24">
                
                    <Graphic
                        v-bind="graphicAttrs"
                        v-on="graphicEvent"></Graphic>
               
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
              <div class="collapse-wrapper" v-if="type =='edit'">
                  <ObjectList
                  
                      v-bind="objectListAttrs"
                      v-on="objectListEvent"
                  ></ObjectList>
              </div>
            </el-col>
          </el-row>
         </div>
        

      </div>
       
  </div>
 
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components:{
      FloorSelect: () => import('@/components/Select/index.vue'),
      ObjectList: () => import('./components/ObjectList'),
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
      graphicAttrs(){
        return{
                movingImage:this.movingImage,
                imgDragOffset:this.imgDragOffset,
                deleteObject:this.deleteObject,
                selectObject:this.selectObject,
                deletesuccess:this.deletesuccess,
                reset:this.reset,
                saveimg:this.save,
                title:this.type
            }
      },
      graphicEvent(){
        return{
              subObjectListOption: this.handleGraphicObjListOption,
              subResetOption: this.handleGraphicResetOption,
              subSaveOption: this.handleGraphicSaveOption,
              subJsonOption: this.handleGraphicJsonOption,
              subResetSelectOption: this.handleResetSelectOption,
              subResetDeleteOption: this.handleResetDeleteOption,
              subObjectDeleteOption:this.handleGraphicObjDeleteOption
          }
      },
      objectListAttrs(){
            return {
              list: this.objectlist,
              objectDelete:this.objectDelete
            }
        },
      objectListEvent(){
            return {
              subSelectOption: this.handleObjSelectOption,
              subDeleteReturnOption: this.handleDeleteReturnOption,
            }
      },
    },
    data() {
        return {
          selectData:[],
          visible:false,
          reset:false,
          type:'view',
          save:false,
          canjson:'',
          objectlist:[],
          deleteObject:null,
          selectObject:null,
          objectDelete:null,
          deletesuccess:null,
          movingImage:null,
          imgDragOffset:{offsetX: 0,offsetY: 0},
          addobject:null
        }
    },
    mounted(){
      this.getfloors()
    },
    methods:{
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
      handleSelectOption(){

      },
      handleResetSelectOption(){
        this.selectObject = null
      },
      handleResetDeleteOption(){
        this.deleteObject = null
        this.deletesuccess = null
      },
      handleObjSelectOption(index,val){
          if(index == "del"){
            this.deleteObject = val
          }else{
            this.selectObject = val
          }
      },
      handleDeleteReturnOption(){
        this.deletesuccess = true
      },
      handleGraphicObjListOption(val){
        this.objectlist = val
      },
      handleGraphicObjDeleteOption(val){
        this.objectDelete = val
      },
      handleGraphicResetOption(){
        this.reset = false
      },
      handleGraphicSaveOption(){
        this.save = false
      },
      handleGraphicJsonOption(val){
        console.log('store=>'+JSON.stringify(this.$store.state.graphic.json))
        this.canjson = val
      },
      resetcanvas(){
        this.reset = true
      },
      savetoimage(){
        this.save = true
      },
      changetype(type){
        this.type = type
      },
      
    }
}
</script>

<style lang="scss" scoped>
.graphic-container{
  height: 100%;
}
.graphic-editor-container {
  padding: 20px;
  background-color: rgb(209, 226, 236);
  position: relative;
  max-height: calc(100vh - 125px);
  overflow: auto;

  .block-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    
  }

}
i{
  cursor: pointer;
}
.collapse-wrapper{
    background: snow;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    margin-top: 32px;
    margin-left: 32px;
    height: 400px;
    overflow-x:hidden;
    overflow-y:auto;
}
</style>


