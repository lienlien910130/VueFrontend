<template>
  <div class="graphic-container">
      <div class="graphic-editor-container">
        <el-row
        align="middle">
          <FloorSelect 
            style="margin-bottom: 20px;"
            v-bind="floorselectAttrs" 
            v-on:handleSelect="handleSelect">
          </FloorSelect>

          <el-popover
            placement="left-start"
            title="快捷鍵"
            width="270"
            trigger="click"
            >
              <p class="tipck">1.【Alt】+【➚】+【滑鼠左鍵】：平移</p>
              <p class="tipck">2.【Alt】+【Q】：放大</p>
              <p class="tipck">3.【Alt】+【W】：縮小</p>
              <p class="tipck">4.【Alt】+【S】：選取</p>
              <p class="tipck">5.【Alt】+【T】：文字</p>
              <p class="tipck">6.【Alt】+【R】：矩形</p>
              <p class="tipck">7.【Alt】+【A】：多邊形</p>
              <!-- <p class="tipck">8.【Alt】+【Z】：取消拖曳圖片</p> -->
              <p class="tipck">9.【Alt】+【G】：打開圖例</p>
              <p class="tipck">10.【Ctrl】+【C】：複製</p>
              <p class="tipck">11.【Ctrl】+【V】：貼上</p>
              <p class="tipck">12.【Ctrl】+【Z】：上一步</p>
              <p class="tipck">13.【Ctrl】+【Y】：下一步</p>
              <p class="tipck">14.【Delete】：刪除</p>
              <p class="tipck">15.【Insert】：下載圖片</p>
              <el-button slot="reference" type="primary" :disabled="disabled">快捷鍵</el-button>
          </el-popover>

          <el-button v-if="type =='view'" type="primary" @click="changetype('edit')" :disabled="disabled">編輯圖控</el-button>
          <el-button v-else type="primary" @click="changetype('view')">關閉編輯</el-button>
          <el-button type="primary" @click="resetcanvas" :disabled="disabled">復原位置</el-button>
          <el-button type="primary" @click="savetoimage" :disabled="disabled">匯出圖片</el-button>
          <el-button type="primary" :disabled="disabled">歷史紀錄</el-button>
        </el-row>
         <div class="block-wrapper">
          <el-row>
             <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <Graphic
                  v-bind="graphicAttrs"
                  v-on="graphicEvent">
                </Graphic>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="16">
              <div class="collapse-wrapper" >
                <el-table
                  class="realtime"
                  :data="tableData" empty-text="暫無資料">
                  <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="時間"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="事件">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="點位名稱">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
              <div class="collapse-wrapper" v-if="type =='edit'">
                <ObjectList
                  v-bind="objectListAttrs"
                  v-on="objectListEvent">
                </ObjectList>
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
      Graphic: () => import('@/components/Graphic/index.vue')
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
      graphicAttrs(){
        return{
              deleteObject:this.deleteObject,
              selectObject:this.selectObject,
              deleteSuccess:this.deleteSuccess,
              reset:this.reset,
              saveimg:this.save,
              type:this.type,
              imageSrc:this.imageSrc,
              objects:this.objects
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
              subObjectDeleteOption:this.handleGraphicObjDeleteOption,
              subObjectSelectOption:this.handleGraphicObjSelectOption,
              subRedoUndoOption:this.handleRedoUndo
          }
      },
      objectListAttrs(){
            return {
              list: this.objectList,
              objectDelete:this.objectDelete,
              objectSelect:this.objectSelect,
              redoundo:this.redoundo
            }
        },
      objectListEvent(){
            return {
              subSelectOption: this.handleObjSelectOption,
              subDeleteReturnOption: this.handleDeleteReturnOption,
              subResetRedoUndoOption:this.handleResetRedoUndoOption
            }
      },
    },
    data() {
        return {
          selectData:[],
          reset:false,
          type:'view',
          save:false,
          objectList:[],
          deleteObject:null,
          selectObject:null,
          objectDelete:null,
          deleteSuccess:null,
          redoundo:null,
          addobject:null,
          tableData:[],
          floorImageId:'',
          floorId:'',
          imageSrc:'',
          disabled:true,
          objects:null
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
      async handleSelect(content){
        await this.getFloorGraphic(content[0].id)
        this.floorId = content[0].id
        await this.getFloorImageId(content[0].id)
        await this.getFloorImage()
      },
      async getFloorGraphic(floorId){
        await this.$api.graphic.apiGetFloorIdToGraphicFile(floorId).then(response =>{
          console.log(JSON.stringify(response))
        })
      },
      async addFloorGraphicFile(state){
        var _temp = {
           "CodeContent" : state
        }
        console.log(JSON.stringify(_temp))
        await this.$api.graphic.apiPostGraphicFile(this.floorId,JSON.stringify(_temp)).then(response =>{
          console.log(JSON.stringify(response))
        })
      },
      async getFloorImageId(floorId){ //儲存floorimageID
        await this.$api.building.apiGetFloor(floorId).then(response=> {
            if(response.result[0].floorPlanID !== null){
              this.floorImageId = (response.result[0].floorPlanID).toString()
            }else{
              this.floorImageId = null
            }
        })
      }, 
      async getFloorImage(){ //載入平面圖
        if(this.floorImageId == null){
          this.imageSrc = ""
          this.disabled = true
          this.changetype('view')
        }else{
          await this.$api.files.apiGetFloorImage(this.floorImageId).then(response=> {
              const bufferUrl = btoa(new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.imageSrc = 'data:image/png;base64,' + bufferUrl
              this.disabled = false
          })
        }
      },  
      handleResetSelectOption(){
        this.selectObject = null
        this.objectSelect = null
      },
      handleResetDeleteOption(){
        this.deleteObject = null
        this.deleteSuccess = null
        this.objectDelete = null
      },
      handleResetRedoUndoOption(){
        this.redoundo = null
      },
      handleObjSelectOption(index,val){
          if(index == "del"){
            this.deleteObject = val
          }else{
            this.selectObject = val
          }
      },
      handleDeleteReturnOption(val){
        this.deleteSuccess = val
      },
      handleGraphicObjListOption(val){
        this.objectList = val
      },
      handleRedoUndo(val){
        this.redoundo = val
      },
      handleGraphicObjDeleteOption(val){
        this.objectDelete = val
      },
      handleGraphicObjSelectOption(val){
        this.objectSelect = val
      },
      handleGraphicResetOption(){
        this.reset = false
      },
      handleGraphicSaveOption(){
        this.save = false
      },
      async handleGraphicJsonOption(val){
        await this.addFloorGraphicFile(val)
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
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;

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
    padding: 15px;
    margin-bottom: 32px;
    margin-top: 32px;
    margin-left: 32px;
    height: 400px;
    overflow-x:hidden;
    overflow-y:auto;
}
.realtime{
  width: 100%;
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>


