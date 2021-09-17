<template>
  <div class="graphic-container">
      <div class="graphic-editor-container">
        <el-row
        align="middle">
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <Select 
              style="margin-bottom: 10px;"
              v-bind="floorselectAttrs" 
              v-on:handleSelect="handleSelect">
            </Select>
            <el-button v-if="type =='view'" type="primary" size="mini" @click="changeType('edit')" :disabled="disabled">編輯</el-button>
            <el-button v-else type="primary" size="mini" @click="changeType('view')">關閉編輯</el-button>
            <!-- <el-button type="primary" size="mini" @click="resetCanvas()" :disabled="disabled">復原位置</el-button>
            <el-button type="primary" size="mini" @click="saveCanvasToImage()" :disabled="disabled">匯出圖片</el-button> -->
            <el-button type="primary" size="mini" :disabled="disabled">歷史紀錄</el-button>
            <el-button type="primary" size="mini" :disabled="disabled" @click="redirect('address')">點位一覽</el-button>
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
                <el-button slot="reference" type="primary" size="mini" :disabled="disabled">快捷鍵</el-button>
                <!-- <i class="el-icon-warning" slot="reference" :disabled="disabled" style="font-size:30px"></i> -->
            </el-popover>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12">
            <div style="float:right">
                <el-checkbox-group 
                v-model="checkList" :disabled="disabled"
                style="display:inline-block" @change="changeViewBlock">
                  <el-checkbox label="未分類" border></el-checkbox>
                  <el-checkbox label="警戒區" border></el-checkbox>
                  <el-checkbox label="防護區" border></el-checkbox>
                  <el-checkbox label="放射區" border></el-checkbox>
                  <el-checkbox label="撒水區" border></el-checkbox>
                </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
         <div class="block-wrapper">
          <el-row>
             <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <Graphic
                  ref="graphic"
                  v-bind="graphicAttrs"
                  v-on="graphicEvent">
                </Graphic>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="16">
              <div class="collapse-wrapper" >
                <GraphicTable
                  :list-query-params.sync="listQueryParams"
                  v-bind="tableAttrs"
                  v-on="tableEvent">
                </GraphicTable>
              </div>
            </el-col>
            <!-- <el-col :xs="24" :sm="24" :md="24" :lg="8">
              <div class="wrapper">
                <ObjectList
                  ref="objectList"
                  v-show="type == 'edit'"
                  v-bind="objectListAttrs"
                  v-on:sendActionToCanvas="sendActionToCanvas">
                </ObjectList>
              </div>
            </el-col> -->
          </el-row>
         </div>
      </div>
  </div>
</template>

<script>
import idb from '@/utils/indexedDB'
import sharemixin  from '@/mixin/sharemixin'
import DrawingControl from '@/object/drawingControl'

export default {
    mixins:[sharemixin],
    components:{
      ObjectList: () => import('./components/ObjectList')
    },
    computed:{
      floorselectAttrs() {
        return {
          selectData: this.selectData,
          title:'GraphicFloor',
          isSelect: this.isSelect
        }
      },
      graphicAttrs(){
        return{
              type:this.type,
              checkList:this.checkList,
              floor:this.floor,
              actionObj:this.actionObj,
              pointarray:this.pointarray
            }
      },
      graphicEvent(){
        return{
            sendActionToLayer:this.sendActionToLayer,
            sendObjectListToLayer: this.sendObjectListToLayer,
            sendObjectRedoUndoToLayer:this.sendObjectRedoUndoToLayer,
            sendFloorGraphicFile: this.sendFloorGraphicFile,
            sendLabelChange:this.sendLabelChange,
            sendBlcokChange:this.sendBlcokChange,
            sendSaveToSelect:this.sendSaveToSelect
        }
      },
      objectListAttrs(){
        return {
            objectList: this.objectList,
            type:this.type
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
      }
    },
    data() {
        return {
          codeContentId:null,
          pointarray:[], //樓層點位列表
          checkList:[], //區域選擇
          floor:null, //正在開啟的樓層
          selectData:[], //樓層選單
          disabled:true, //若樓層沒平面圖則不開啟按鈕使用
          isSelect:false, //是否有尚未儲存的資料
          type:'view', //檢視&編輯
          objectList:[], //圖控上的所有元件
          //跟wsg相關
          isEdit:false, //是否可編輯圖控
          actionObj:null, //正在做動的物件
          origindata:[], //即時訊息
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
          }
        }
    },
    watch: {
      // buildingfloors:{
      //   handler:async function(){
      //     this.selectData = this.buildingfloors
      //   },
      //   immediate:true
      // },
      // wsmsg:{
      //   handler:async function(){
      //       var data = JSON.parse(this.wsmsg.data)
      //       console.log(data)
      //       var uid = data.id
      //       var type = data.type
      //       var content = data.content
      //       if(uid !== this.id){
      //         switch (type){
      //           case 'enterGraphic':
      //             if(this.type == 'edit' && content == this.floor.getID()){
      //               this.$socket.sendMag(this.id,'openEdit',this.floor.getID())
      //             }
      //             break;
      //           case 'openEdit':
      //             if(content == this.floor.getID()){
      //               this.isEdit = true
      //             }
      //             break;
      //           case 'closeEdit':
      //             if(content == this.floor.getID()){
      //               this.isEdit = false
      //             }
      //             break;
      //           default:
      //             var cons = JSON.parse(content)
      //             console.log(cons)
      //             var index = this.buildingfloors.findIndex(f=>f.id === cons.LinkDevice.FloorId)
      //             var index2 = this.buildingdevices.findIndex(d=>d.id === cons.LinkDevice.DeviceId)
      //             if(cons.LinkDevice.FloorId !== this.floor.getID()){
      //               this.handleSelect(this.buildingfloors[index],cons)
      //             }else{
      //               this.actionObj = cons
      //             }
      //             var data = {
      //               date:formatTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
      //               floor:this.buildingfloors[index].label,
      //               action:cons.Action,
      //               name:this.buildingdevices[index2].name,
      //               point:cons.SystemNumber+'-'+cons.CircuitNumber+'-'+cons.Address
      //             }
      //             this.origindata.push(data)
      //             this.listQueryParams.total = this.origindata.length
      //             this.origindata = this.origindata.sort( (a, b) => {
      //                 return new Date(b.date) - new Date(a.date)
      //               })
      //             this.clickPagination()
      //             break;
      //         }
      //       }
      //   },
      //   immediate:true
      // },
    },
    created(){
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    methods:{
      async init(){
        if(this.floor_record == 0){
          await this.$store.dispatch('building/setFloors')
          await this.$store.dispatch('record/saveFloorRecord',1)
        }
        this.selectData = this.buildingfloors.map(v => {
          this.$set(v, 'value', v.getID()) 
          this.$set(v, 'label', v.getName()) 
          this.$set(v, 'id', v.getID()) 
          return v
        })
      },
      async clickPagination(){
          this.tableData = this.origindata.filter(
            (item, index) => 
            index < this.listQueryParams.limit * this.listQueryParams.page && 
            index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      },
      redirect(name){ //點位設定&歷史紀錄--另開新頁
        // var routeData
        // switch (name) {
        //   case 'address':
        //     routeData = this.$router.resolve(
        //                     { path: '/equipment/address' })
        //     break;
        // }
        // window.open(routeData.href, '_blank')
      },
      changeType(type){ //編輯/檢視
        if(!this.isEdit){
          this.type = type
          if(type == 'edit'){
            this.checkList = ['未分類','警戒區','防護區','放射區','撒水區']
            //this.$socket.sendMsg(this.id,'openEdit',this.floor.getID())
          }else{
            this.checkList = []
            //this.$socket.sendMsg(this.id,'closeEdit',this.floor.getID())
          }
          this.$refs.graphic.searchBlockType(this.checkList)
        }else{
          alert('請勿同時編輯該樓層圖控系統')
        }
      },
      changeViewBlock(){ //篩選區塊顯示
        this.$refs.graphic.searchBlockType(this.checkList)
      },
      //樓層事件
      async handleSelect(content, device = null){
        console.log('handleSelect',device)
        if(this.type == 'edit'){
          //this.$socket.sendMsg(this.id,'closeEdit',this.floor.getID())
        }
        this.type = 'view'
        this.floor = content
        this.pointarray = [] //儲存樓層點位
        this.pointarray  = await DrawingControl.getOfFloor(this.floor.getID())
        console.log(JSON.stringify(this.pointarray))
        var obj = await this.floor.getGraphicFiles()
        this.codeContentId = obj.id
        if(content.getImageID() == null){
            this.disabled = true
            this.changeType('view')
            this.$refs.graphic.loadBackgroundImage(obj.codeContent,'')
        }else{
            this.disabled = false
            var data = await idb.loadCacheImage((content.getImageID()))
            this.$refs.graphic.loadBackgroundImage(obj.codeContent,data)
        }
        //this.$socket.sendMsg(this.id,'enterGraphic',this.floor.getID())
        if(device !== null){
          this.actionObj = device
        }
      },
      //圖層事件
      sendActionToCanvas(index,val){ //圖層選取/刪除物件
          if(index == "del"){
            this.$refs.graphic.objectDelete(val)
          }else{
            this.$refs.graphic.objectSelect(val)
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
        // if(index == 'del'){
        //   this.$refs.objectList.objectDelete(val)
        // }else{
        //   this.$refs.objectList.objectSelect(val)
        // }
      },
      sendLabelChange(id,objname){ //圖控更新標題，圖層須連動更新
        //this.$refs.objectList.updateNodeLabel([id,objname])
      },
      sendBlcokChange(id,objname,blocktype){ //圖控更新區塊類型，圖層須連動更新
        //this.$refs.objectList.updateNodeLevel([id,objname,blocktype])
      },
      sendObjectRedoUndoToLayer(val){//圖控上一步下一步，圖層須連動更新
        //this.$refs.objectList.redoundo(val)
      },
      async sendFloorGraphicFile(state,array){ //儲存圖控檔案，同步更新點位有無被設置
        console.log(state)
        var str = JSON.stringify(state)
        const fileContent = new File([str], this.floor.getID()+'.txt', { type: '' })
        const formData = new FormData()
        formData.append('file', fileContent)
        var isOk = await this.floor.postGraphicFiles(formData)
        if(isOk){
          // if(array.length !==0 ){
          //   await Device.updatefromGraphic(array)
          //   this.$store.dispatch('building/setbuildingdevices',await Device.get())
          // }
          this.$message('儲存成功')
        }else{
          this.$message.error('系統錯誤')
        }
      },
      //畫面
      async changeTable(value){

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
  min-height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;

  .block-wrapper {
    background: #fff;
    padding: 0px 5px 10px;
  }

}
i{
  cursor: pointer;
}
.collapse-wrapper{
    background: snow;
    padding: 8px;
    height: 200px;
    overflow-x:hidden;
    overflow-y:auto;
}
.wrapper{
    background: snow;
    padding: 15px;
    height: 400px;
    margin-bottom:5px;
    margin-top: 32px;
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


