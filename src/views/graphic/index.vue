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
          <el-button type="primary" :disabled="disabled">點位設定</el-button>
          <el-checkbox-group 
          v-model="checkList" 
          style="display:inline;margin-left:20px;">
            <el-checkbox label="未分類" border></el-checkbox>
            <el-checkbox label="警戒區" border></el-checkbox>
            <el-checkbox label="防護區" border></el-checkbox>
            <el-checkbox label="放射區" border></el-checkbox>
            <el-checkbox label="撒水區" border></el-checkbox>
          </el-checkbox-group>
          <el-alert
            v-if="isSelect"
            title="尚未存檔，請先存檔後再離開畫面"
            type="warning"
            center
            :closable="false"
            show-icon>
          </el-alert>
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
                <Table
                  :list-query-params.sync="listQueryParams"
                  v-bind="tableAttrs"
                  v-on="tableEvent">
                </Table>
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
import idb from '@/utils/indexedDB'
import { formatTime } from '@/utils/index.js'

export default {
    components:{
      Table: () => import('@/components/Table/index.vue'),
      FloorSelect: () => import('@/components/Select/index.vue'),
      ObjectList: () => import('./components/ObjectList'),
      Graphic: () => import('@/components/Graphic/index.vue')
    },
    computed:{
      ...mapGetters([
          'id',
          'buildingid',
          'buildingfloors',
          'wsmsg',
          'buildingdevices'
      ]),
      floorselectAttrs() {
        return {
          selectData: this.selectData,
          title:'GraphicFloor',
          isSelect: this.isSelect
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
              checkList:this.checkList,
              floorId:this.floorId,
              actionObj:this.actionObj
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
            sendBlcokChange:this.sendBlcokChange,
            sendSaveToSelect:this.sendSaveToSelect
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
      tableAttrs(){
        return {
            title:'graphic',
            tableData: this.tableData,
            config:this.config,
            hasColumn:false,
            pageSizeList:[5,30,50]
        }
      },
      tableEvent(){
        return {
            clickPagination:this.clickPagination
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
          floorId:'',
          imageSrc:'',
          disabled:true,
          objects:null,
          checkList:[],
          labelChange:[],
          blockChange:[],
          isEdit:false,
          isSelect:false,
          actionObj:null,
          origindata:[],
          tableData:[],
          config:[
                { label:'時間' , prop:'date'},
                { label:'樓層' , prop:'floor'},
                { label:'事件' , prop:'action'},
                { label:'設備名稱' , prop:'name'},
                { label:'點位名稱' , prop:'point'},
          ],
          listQueryParams:{
            page: 1,
            limit: 5,
            total: 0
          },
        }
    },
    watch: {
      buildingfloors:{
        handler:async function(){
          this.selectData = this.buildingfloors
        },
        immediate:true
      },
      wsmsg:{
        handler:async function(){
            var data = JSON.parse(this.wsmsg.data)
            console.log(data)
            var uid = data.id
            var type = data.type
            var content = data.content
            if(uid !== this.id){
              switch (type){
                case 'enterGraphic':
                  if(this.type == 'edit' && content == this.floorId){
                    this.$socket.sendMag(this.id,'openEdit',this.floorId)
                  }
                  break;
                case 'openEdit':
                  if(content == this.floorId){
                    this.isEdit = true
                  }
                  break;
                case 'closeEdit':
                  if(content == this.floorId){
                    this.isEdit = false
                  }
                  break;
                default:
                  var cons = JSON.parse(content)
                  var index = this.buildingfloors.findIndex(f=>f.id === cons.LinkDevice.FloorId)
                  var index2 = this.buildingdevices.findIndex(d=>d.id === cons.LinkDevice.DeviceId)
                  if(cons.LinkDevice.FloorId !== this.floorId){
                    this.handleSelect(this.buildingfloors[index],cons)
                  }else{
                    this.actionObj = cons
                  }
                  var data = {
                    date:formatTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
                    floor:this.buildingfloors[index].label,
                    action:cons.Action,
                    name:this.buildingdevices[index2].name,
                    point:cons.SystemNumber+'-'+cons.CircuitNumber+'-'+cons.Address
                  }
                  this.origindata.push(data)
                  this.listQueryParams.total = this.origindata.length
                  this.origindata = this.origindata.sort( (a, b) => {
                      return new Date(b.date) - new Date(a.date)
                    })
                  this.clickPagination()
                  break;
              }
            }
        },
        immediate:true
      },
    },
    created(){
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    methods:{
      async handleSelect(content, device = null){
        if(this.type == 'edit'){
          this.$socket.sendMsg(this.id,'closeEdit',this.floorId)
        }
        this.type = 'view'
        this.floorId = content.id
        if(content.floorPlanID == null){
            this.imageSrc = ""
            this.disabled = true
            this.changeType('view')
        }else{
            this.disabled = false
            this.imageSrc = await idb.loadCacheImage((content.floorPlanID).toString())
        }
        await this.getFloorGraphic()
        await this.broadcast()
        if(device !== null){
          this.actionObj = device
        }
      },
      async clickPagination(){
          this.tableData = this.origindata.filter(
            (item, index) => 
            index < this.listQueryParams.limit * this.listQueryParams.page && 
            index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      },
      async getFloorGraphic(){ //取得圖控檔案
        this.objects = await this.$obj.Files.getFloorGraphicFiles(this.floorId)
      },
      async broadcast(){
        this.$socket.sendMsg(this.id,'enterGraphic',this.floorId)
      },
      resetCanvas(reset){
        this.reset = reset
      },
      saveCanvasToImage(save){
        this.save = save
      },
      changeType(type){
        if(!this.isEdit){
          this.type = type
          if(type == 'edit'){
            this.checkList = ['未分類','警戒區','防護區','放射區','撒水區']
            this.$socket.sendMsg(this.id,'openEdit',this.floorId)
          }else{
            this.checkList = []
            this.$socket.sendMsg(this.id,'closeEdit',this.floorId)
          }
        }else{
          alert('請勿同時使用該樓層圖控系統')
        }
      },
      //圖控的事件
      sendSaveToSelect(val){
        this.isSelect = val
      },
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
      async sendFloorGraphicFile(state){ //儲存圖控檔案
        const fileContent = new File([state], this.floorId+'.txt', { type: '' })
        const formData = new FormData()
        formData.append('file', fileContent)
        var isOk = await this.$obj.Files.postFloorGraphicFiles(this.floorId,formData)
        if(isOk){
          this.$message('儲存成功')
        }
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
  padding: 0 20px 5px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;

  .block-wrapper {
    background: #fff;
    padding: 0px 5px 10px;
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


