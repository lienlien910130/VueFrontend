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
              <p class="tipck">2.【滑鼠滾輪】：放大&縮小</p>
              <p class="tipck">3.【Alt】+【S】：選取</p>
              <p class="tipck">4.【Alt】+【T】：文字</p>
              <p class="tipck">5.【Alt】+【R】：矩形</p>
              <p class="tipck">6.【Alt】+【A】：多邊形</p>
              <!-- <p class="tipck">8.【Alt】+【Z】：取消拖曳圖片</p> -->
              <p class="tipck">7.【Alt】+【G】：打開圖例</p>
              <p class="tipck">8.【Ctrl】+【C】：複製</p>
              <p class="tipck">9.【Ctrl】+【V】：貼上</p>
              <p class="tipck">10.【Ctrl】+【Z】：上一步</p>
              <p class="tipck">11.【Ctrl】+【Y】：下一步</p>
              <p class="tipck">12.【Delete】：刪除</p>
              <p class="tipck">13.【Insert】：下載圖片</p>
              <el-button slot="reference" type="primary" :disabled="disabled">快捷鍵</el-button>
          </el-popover>

          <el-button v-if="type =='view'" type="primary" @click="changeType('edit')" :disabled="disabled">編輯圖控</el-button>
          <el-button v-else type="primary" @click="changeType('view')">關閉編輯</el-button>
          <el-button type="primary" @click="resetCanvas(true)" :disabled="disabled">復原位置</el-button>
          <el-button type="primary" @click="saveCanvasToImage(true)" :disabled="disabled">匯出圖片</el-button>
          <el-button type="primary" :disabled="disabled">歷史紀錄</el-button>
          <el-checkbox-group v-model="checkList" style="display:inline;margin-left:20px;" >
            <el-checkbox label="未分類" border></el-checkbox>
            <el-checkbox label="警戒區" border></el-checkbox>
            <el-checkbox label="防護區" border></el-checkbox>
            <el-checkbox label="放射區" border></el-checkbox>
            <el-checkbox label="撒水區" border></el-checkbox>
          </el-checkbox-group>
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
              <div class="collapse-wrapper">
                <ObjectList
                  v-show="type == 'edit'"
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
              objects:this.objects,
              checkList:this.checkList
            }
      },
      graphicEvent(){
        return{
            sendActionToLayer:this.sendActionToLayer,
            sendObjectListToLayer: this.sendObjectListToLayer,
            sendObjectRedoUndoToLayer:this.sendObjectRedoUndoToLayer,
            sendFloorGraphicFile: this.sendFloorGraphicFile,
            resetCanvas: this.resetCanvas,
            saveCanvasToImage: this.saveCanvasToImage,
            returnDeleteObjects: this.returnDeleteObjects,
            sendLabelChange:this.sendLabelChange,
            sendBlcokChange:this.sendBlcokChange
        }
      },
      objectListAttrs(){
        return {
            list: this.objectList,
            objectDelete:this.objectDelete,
            objectSelect:this.objectSelect,
            redoundo:this.redoundo,
            type:this.type,
            labelChange:this.labelChange,
            blockChange:this.blockChange
        }
      },
      objectListEvent(){
        return {
            sendActionToCanvas: this.sendActionToCanvas,
            returnDeleteSuccess: this.returnDeleteSuccess,
            returnObjectRedoUndo:this.returnObjectRedoUndo
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
          objectSelect:null,
          deleteSuccess:null,
          redoundo:null,
          addobject:null,
          tableData:[],
          floorImageId:'',
          floorId:'',
          imageSrc:'',
          disabled:true,
          objects:null,
          checkList:[],
          labelChange:[],
          blockChange:[]
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
          })
        })
      },
      async handleSelect(content){
        this.floorId = content[0].id
        await this.getFloorImageId()
        await this.getFloorImage()
        await this.getFloorGraphic()
      },
      async getFloorGraphic(){ //取得圖控檔案
        await this.$api.graphic.apiGetFloorIdToGraphicFile(this.floorId).then(response =>{
          this.$store.dispatch('graphic/sendJson',response.result.codeContent)
          this.objects = response.result.codeContent
        })
      },
      async getFloorImageId(){ //儲存floorimageID
        await this.$api.building.apiGetFloor(this.floorId).then(response=> {
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
          this.changeType('view')
        }else{
          await this.$api.files.apiGetFloorImage(this.floorImageId).then(response=> {
              const bufferUrl = btoa(new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.imageSrc = 'data:image/png;base64,' + bufferUrl
              this.disabled = false
          })
        }
      },  
      // sendToCanvas(){
      //   console.log(this.checkList)
      // },
      resetCanvas(reset){
        this.reset = reset
      },
      saveCanvasToImage(save){
        this.save = save
      },
      changeType(type){
        this.type = type
        if(type == 'edit'){
          this.checkList = ['未分類','警戒區','防護區','放射區','撒水區']
        }else{
          this.checkList = []
        }
      },
      //圖控的事件
      sendObjectListToLayer(val){ //圖控傳過來的所有物件清單,更新圖層節點用
        this.objectList = val
      },
      sendActionToLayer(index,val){ //圖控上面選取/刪除物件
        if(index == 'del'){
          this.objectDelete = val
        }else{
          this.objectSelect = val
        }
      },
      sendLabelChange(id,objname){
        this.labelChange = [id,objname]
      },
      sendBlcokChange(id,objname,blocktype){
        this.blockChange = [id,objname,blocktype]
      },
      sendObjectRedoUndoToLayer(val){//圖控上一步下一步
        this.redoundo = val
      },
      async sendFloorGraphicFile(state){
        var _temp = {
           "CodeContent" : state
        }
        await this.$api.graphic.apiPostGraphicFile(this.floorId,JSON.stringify(_temp)).then(response =>{
          this.$message('儲存成功')
        })
      },
      returnDeleteObjects(){ //重置圖層及圖控刪除的物件
        this.deleteObject = null
        this.deleteSuccess = null
        this.objectDelete = null
      },
      //圖層事件
      returnObjectRedoUndo(){
        this.redoundo = null
      },
      sendActionToCanvas(index,val){ //圖層選取/刪除物件
          if(index == "del"){
            this.deleteObject = val
          }else{
            this.selectObject = val
          }
      },
      returnDeleteSuccess(val){ //圖控刪除物件給圖層檢查是否可以刪除,刪除成功的回傳
        this.deleteSuccess = val
      }
    }
}
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin-right: 0px;
}
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


