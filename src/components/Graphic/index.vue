<template>
  <div class="maintenancePlanAdd">
    <div class="middle">
        <header>
            <HeaderOperate  
            ref="operate" 
            :operateMenu="operateMenu" 
            @handleOperateMenu="handleOperateMenu" />
        </header>
        <div class="section" ref="section">
            <div ref="canvasdiv" class="canvasdiv" >
              <canvas 
                id="canvas"
              ></canvas>
            </div>
        </div>
    </div>
    <div class="flow-attr">
        
        <el-alert
          v-if="isSave == true"
          title="請先存檔後再離開畫面"
          type="warning"
          center
          :closable="false"
          show-icon
          style="margin-bottom:5px">
        </el-alert>

        <div v-if="type == 'edit' && selectType == null">
          <EquipmentType 
          ref="equipmentType"
          :imgAddress="imgAddress"
          v-on:sendAddressImageIcon="sendAddressImageIcon"></EquipmentType>
        </div>

        <el-form v-if="selectType !== null" class="form-inline" label-position="left" style="padding:10px 8px">  

                <el-form-item label="名稱" label-width="70px" >
                  <el-input v-model="objectName"  
                  placeholder="請輸入名稱" 
                  @input="sendLabelChange"
                  ></el-input>
                </el-form-item>

                <el-form-item v-if="selectType == 'image'" label="點位"  label-width="70px" >
                  <el-select  v-model="addressId" placeholder="請選擇選位" @change="sendAddressChange" filterable style="width:100%">
                    <el-option
                      v-for="(item,index) in imgAddress"
                      :key="index"
                      :label="item.label"
                      :value="item.label"
                      :disabled="item.systemUsed">
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item v-if="selectType == 'path'" label="區塊" label-width="70px" >
                   <el-select 
                   v-model="blockType" placeholder="請選擇區塊類型" @change="sendBlockChange" style="width:100%">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="selectType == 'image'" label="關聯" label-width="70px" >
                   <el-select 
                   v-model="connectId" placeholder="請選擇關聯的圖示或區塊" @change="sendConnectChange"  style="width:100%">
                    <el-option
                      v-for="(item,index) in connectArray"
                      :key="index"
                      :label="item.objectName"
                      :value="item.objId">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="selectType == 'textbox'" label="大小" label-width="70px" >
                  <el-input-number v-model="fontsize" controls-position="right" :min="8" :max="72"
                  style="width:100%" @change="changeAttributes('fontsize')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="selectType == 'path'" label="透明度" label-width="70px" >
                  <el-input-number v-model="opacity" controls-position="right" :min="0" :max="100"
                  style="width:100%" @change="changeAttributes('opacity')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="selectType == 'path'" label="線條" label-width="70px" >
                  <el-select v-model="strokeDash"  placeholder="請選擇" @change="changeAttributes('strokeDash')" style="width:100%">
                    <el-option label="無邊框" value="-1"></el-option>
                    <el-option label="實心線" value="0"></el-option>
                    <el-option label="虛線" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="selectType == 'path'" label="寬度" label-width="70px" >
                  <el-input-number 
                  v-model="strokeWidth" 
                  controls-position="right" :min="0" :max="10"
                  style="width:100%"
                  @change="changeAttributes('strokeWidth')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="selectType == 'textbox'" label="顏色" label-width="70px" >
                  <el-color-picker v-model="fontcolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('fontcolor')"></el-color-picker>
                </el-form-item>
                <el-form-item v-if="selectType == 'path'" label="填充" label-width="70px" >
                  <el-color-picker v-model="fillcolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('fillcolor')"></el-color-picker>
                </el-form-item>
                <el-form-item v-if="selectType == 'path'" label="邊框" label-width="70px" >
                  <el-color-picker v-model="strokecolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('strokecolor')"></el-color-picker>
                </el-form-item>
        </el-form>


    </div>
    <!-- <el-row :gutter="16" class="row" style="height:620px">
      <el-col :xs="24" :sm="24" :md="24" :lg="canvasvalue" style="overflow:auto">
        <div ref="canvasdiv" class="canvasdiv" >
          <canvas id="canvas"></canvas>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="formvalue" style="height:100%;overflow:auto"
      >
        <div>
          <el-form :inline="this.sidebar.opened === true"  class="form-inline" label-position="left">
                <el-form-item v-if="type == 'edit'">
                  <div class="draw-btn-group" >
                    <div :class="{active:drawType==''}" @click="drawTypeChange('')">
                      <i class="el-icon-thumb" style="font-size:25px"></i>
                    </div>
                    <div :class="{active:drawType=='icon'}" @click="openLegendWindows">
                      <i class="el-icon-add-location" style="font-size:25px"></i>
                    </div>
                    <div :class="{active:drawType=='text'}" @click="drawTypeChange('text')">
                      <i class="draw-icon icon-text"></i>
                    </div>
                    <div :class="{active:drawType=='rectangle'}" @click="drawTypeChange('rectangle')">
                      <i class="draw-icon icon-rectangle"></i>
                    </div>
                    <div :class="{active:drawType=='polygon'}" @click="drawTypeChange('polygon')">
                      <i class="draw-icon icon-polygon"></i>
                    </div>
                    <div @click="doUndo">
                      <i class="el-icon-refresh-left" style="font-size:25px"></i>
                    </div>
                    <div @click="doRedo">
                      <i class="el-icon-refresh-right" style="font-size:25px"></i>
                    </div>
                    <div @click="deleteObj">
                      <i class="el-icon-delete" style="font-size:25px"></i>
                    </div>
                    <div @click="saveCanvasFile">
                      <i class="draw-icon icon-save"></i>
                    </div>
                    <div @click="stopAnim">
                      <i class="el-icon-remove-outline" style="font-size:25px"></i>
                    </div>
                  </div>  
                </el-form-item>
                <el-alert
                  v-if="isSave == true"
                  title="請先存檔後再離開畫面"
                  type="warning"
                  center
                  :closable="false"
                  show-icon
                  style="margin-bottom:5px">
                </el-alert>
                <el-form-item label="名稱" label-width="90px" >
                  <el-input v-model="objectName"  
                  placeholder="請輸入名稱" 
                  @input="sendLabelChange"
                  :disabled="isTextBox == null"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="isImage == true" label="點位"  label-width="90px" >
                  <el-select  v-model="addressId" placeholder="請選擇選位" @change="sendDeviceChange" filterable>
                    <el-option
                      v-for="(item,index) in devicearray"
                      :key="index"
                      :label="item.getLinkType().getSelectName()+'-'+item.getOnlyName()"
                      :value="item.getID()"
                      :disabled="item.SystemUsed()">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="區塊" label-width="90px" >
                   <el-select v-model="blockType" placeholder="請選擇區塊類型" @change="sendBlockChange"
                   :disabled="isTextBox == null">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isTextBox == true" label="字體大小" label-width="90px" >
                  <el-input-number v-model="fontsize" controls-position="right" :min="8" :max="72"
                  style="width:100%" @change="changeAttributes('fontsize')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="isTextBox == false" label="透明度" label-width="90px" >
                  <el-input-number v-model="opacity" controls-position="right" :min="0" :max="100"
                  style="width:100%" @change="changeAttributes('opacity')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="isTextBox == false" label="邊框線條" label-width="90px" >
                  <el-select v-model="strokeDash"  placeholder="請選擇" @change="changeAttributes('strokeDash')">
                    <el-option label="無邊框" value="-1"></el-option>
                    <el-option label="實心線" value="0"></el-option>
                    <el-option label="虛線" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isTextBox == false" label="邊框寬度" label-width="90px" >
                  <el-input-number 
                  v-model="strokeWidth" 
                  controls-position="right" :min="0" :max="10"
                  style="width:100%"
                  @change="changeAttributes('strokeWidth')"></el-input-number>
                </el-form-item>
                <el-form-item v-if="isTextBox == true" label="字體" label-width="90px" >
                  <el-color-picker v-model="fontcolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('fontcolor')"></el-color-picker>
                </el-form-item>
                <el-form-item v-if="isTextBox == false" label="填充" label-width="90px" >
                  <el-color-picker v-model="fillcolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('fillcolor')"></el-color-picker>
                </el-form-item>
                <el-form-item v-if="isTextBox == false" label="邊框" label-width="90px" >
                  <el-color-picker v-model="strokecolor" 
                  show-alpha 
                  :predefine="predefineColors" @change="changeAttributes('strokecolor')"></el-color-picker>
                </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row> -->

    <div v-if="infovisible" id="addressInfo" class="addressInfo" draggable="true" :style="{ left: addressDiv.x +'px'  , top:addressDiv.y +'px'}">
      <el-row style="background-color:gray">
        <span>點位資訊</span>
        <i class="el-icon-circle-close" style="float:right;" @click="disableVisible"></i>
      </el-row>
      
      <el-table
        style="width: 100%"
        :data="getValues"
        :show-header="false"
      >
        <el-table-column
          v-for="(item, index) in getHeaders"
          :key="index"
          :prop="item"
        >
        </el-table-column>
      </el-table>
    </div>

    <JsonViewer v-if="jsonInfoVisible" ref="jsonInfo" :data="jsondata"></JsonViewer>

  </div>
</template>

<script>
import constant from '@/constant/development'
const fabric = require('fabric')
import { getUUID } from '@/utils'
import { initAligningGuidelines } from '@/utils/aligning'

export default {
  name: "Graphic",
  props:{
    type: {
      type: String,
      default: 'view'
    },
    checkList: {
      type: Array
    },
    floor: {
      type: Object
    },
    actionObj:{
      type: Object,
      default: null
    },
    pointarray: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components:{
    EquipmentType: () => import('@/views/graphic/components/EquipmentType.vue')
  },
  computed: {
     ...Vuex.mapGetters([
        'wsmsg',
        'sidebar',
        'buildingdevices'
    ]),
    getHeaders() {
      return this.addressInfo.reduce((pre, cur, index) => pre.concat(`value${index}`), ['title'])
    },
    getValues() {
      return this.headers.map(item => {
        return this.addressInfo.reduce((pre, cur, index) => Object.assign(pre, {['value' + index]: cur[item.prop]}), {'title': item.label,});
      })
    },
    connectArray(value){
      var all = this.canvas.getObjects()
      return all.filter(item=>{
        return item.type !== 'textbox' && item.addressId !== this.addressId 
      })
    }
  },
  data() {
    return {
      operateMenu:constant.GraphicMenuView,
      hasAnimationStarted:false,
      setPointObj:null,
      //updateArray:[],
      imgAddress:[],
      addressId:'',
      connectId:'',
      deviceId:'',
      //isImage:false, //控制是否可以設定點位
      //isTextBox:null,
      selectType:null,
      isSave:false, //是否儲存--控制是否跳視窗提醒未儲存
      drawType: '', //選取的類別
      fontsize:'14', //字體大小
      fontcolor:'rgba(255, 0, 0, 1)',//字體顏色
      opacity:50, //透明度
      fillcolor:'rgba(197, 195, 195, 1)', //填充顏色
      strokecolor:'rgb(0, 0, 0)', //邊框顏色
      strokeDash:'0', //顯示在邊框select的對應值
      strokedash:[0,0],
      strokeWidth:1, //邊框寬度
      options: [
        {
          value: '未分類',
          label: '未分類'
        },
        { //區塊類型
          value: '警戒區',
          label: '警戒區'
        }, {
          value: '防護區',
          label: '防護區'
        }, {
          value: '放射區',
          label: '放射區'
        }, {
          value: '撒水區',
          label: '撒水區'
      }],
      predefineColors: [
            '#ff4500',
            '#ff8c00',
            '#ffd700',
            '#90ee90',
            '#00ced1',
            '#1e90ff',
            '#c71585',
            'rgba(255, 69, 0, 0.68)',
            'rgb(255, 120, 0)',
            'hsv(51, 100, 98)',
            'hsva(120, 40, 94, 0.5)',
            'hsl(181, 100%, 37%)',
            'hsla(209, 100%, 56%, 0.73)',
            '#c7158577'
      ],
      canvas: {},
      imgSource:[], //圖例
      drawingObject: null, //當前繪製對象
      moveCount: 1, //繪製移動計數器
      doDrawing: false, // 繪製狀態
      objectCount:0,
      textbox: null,
      viewList:[],
      TimeId:-1,
      imgEl:null,
      mouseFrom: {},
      mouseTo: {},
      //縮放
      zoom: window.zoom ? window.zoom : 1, 
      zoomPoint: new fabric.Point(0, 0), //初始时缩放原点的位置设为（0,0），这是页面的左上顶点
      lastzoomPoint: { x: 0, y: 0 }, //初始时，前一次缩放原点同样为(0,0)
      lastmousePoint: { x: 0, y: 0 }, //进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
      lastzoom: 1, //表示为上一次的缩放倍数，此刻设为1
      //平移
      panning:false, //移動畫布
      lastMovePos:{x:0, y:0},
      relativeMouseX: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
      relativeMouseY: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
      //多邊形
      polygonMode: false,//polygon 相关参数
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: "",
      line: {},
      //複製貼上
      clipboard:null,
      //客製化的元素
      blockType: '未分類',
      objectName:'', //圖層標題
      //上一步下一步
      state:'', //狀態
      undo:[], //之前的步驟
      redo:[],
      //點位資訊
      addressDiv:{x:0,y:0},
      infovisible:false,
      headers: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'address',
          label: '地址',
        },
      ],
      addressInfo:[{
        date: '2016-05-02',
        name: '王小虎',
        address: '123'
      }],
      jsonInfoVisible:false,
      jsondata:[]
    }
  },
  watch: {
      type:{
          handler:async function(){
            if(this.type === 'edit'){
              this.canvas.skipTargetFind = false
              this.canvas.selection = true
              this.operateMenu = constant.GraphicMenuEdit
            }else{
              this.doDrawing = false
              this.canvas.skipTargetFind = true
              this.canvas.selection = false
              this.operateMenu = constant.GraphicMenuView
            }
          },
          immediate:true
      },
      pointarray:{
          handler:async function(){
            var data = _.cloneDeep(this.pointarray)
            this.imgAddress = data.map(item => {
                this.$set(item, 'systemUsed',item.systemUsed) 
                this.$set(item, 'id', item.id) 
                var str = item.internet+'-'+item.system
                if(item.type == 'fire'){
                  str = str.concat('-'+item.address)
                  if(item.number !== '' && item.number !== null && item.number !== undefined){
                     str = str.concat('-'+item.number)
                  } 
                }else{
                  if(item.memeryLoc !== '' && item.memeryLoc !== null && item.memeryLoc !== undefined){
                     str = str.concat('-'+item.memeryLoc)
                  } 
                }
                this.$set(item, 'label',str)
                return item
            })
          },
          immediate:true
      },
      // actionObj:{
      //   handler:async function(){
      //     if(this.actionObj !== null){
      //       console.log('actionObj',this.actionObj,this.actionObj.LinkDevice.DeviceId)
      //       var index = this.canvas.getObjects().findIndex(o=>o.deviceId == this.actionObj.LinkDevice.DeviceId)
      //       var obj = this.canvas.getObjects()[index]
      //       obj.set({ visible : true})
      //       this.setAnimate(obj,this.actionObj.Action)
      //       this.canvas.renderAll()
      //     }
      //   },
      //   immediate:true
      // }
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas")
    this.canvas.setWidth(1650)
    this.canvas.setHeight(750)
    this.canvas.skipTargetFind = true
    this.canvas.selection = false
    this.canvas.selectionBorderColor ="red"
    this.canvas.selectionLineWidth = 2
    this.canvas.selectionDashArray = [5, 5]
    initAligningGuidelines(this.canvas)
    this.canvas.on("drop", this.drop)
    this.canvas.on("dragover", this.drag)
    this.canvas.on("dragenter", this.drag)
    this.canvas.on("mouse:down", this.mousedown)
    this.canvas.on("mouse:move", this.mousemove)
    this.canvas.on("mouse:up", this.mouseup)
    this.canvas.on("mouse:wheel", this.mousewheel)
    this.canvas.on("selection:created", this.selectioncreatedandupdated)
    this.canvas.on("selection:updated", this.selectioncreatedandupdated)
    this.canvas.on("selection:cleared", this.selectioncleared)
    this.canvas.on('object:modified', this.saveCanvasState)
    this.canvas.on("object:moving",(e) => {
        this.canvas.skipTargetFind = true
    })
    // this.canvas.on("object:moved", this.isEditChange(true))
    //添加消息接收函數
    //window.addEventListener("message", this.receiveMessage, false)

    document.onkeydown = async(e) => {
      if (e.keyCode == 46) {
        this.deleteObj()
      }
      if (e.keyCode == 45 && e.altKey) {
        this.saveImg()
      }
      if(e.keyCode == 67 && e.ctrlKey){
        this.copy()
      }
      if(e.keyCode == 86 && e.ctrlKey){
        this.paste()
      }
      if(e.keyCode == 90 && e.ctrlKey){ //上一步 Z
        this.doUndo()
      }
      if(e.keyCode == 89 && e.ctrlKey){ //下一步 y
        this.doRedo()
      }
      if(e.keyCode == 83 && e.ctrlKey){ //存檔 s
        await this.saveCanvasFile()
      }
      if(e.keyCode == 71 && e.altKey){ //打開圖例
        this.openLegendWindows()
      }
      if(e.keyCode == 83 && e.altKey){
        await this.drawTypeChange('')
      }
      if(e.keyCode == 84 && e.altKey){
        await this.drawTypeChange('text')
      }
      if(e.keyCode == 82 && e.altKey){
        await this.drawTypeChange('rectangle')
      }
      if(e.keyCode == 65 && e.altKey){
        await this.drawTypeChange('polygon')
      }
      if(e.keyCode == 81 && e.altKey){
        this.mousewheel(e)
      }
      if(e.keyCode == 87 && e.altKey){
        this.mousewheel(e)
      }
    }
  },
  methods: {
    saveImg() { //儲存圖片
        var a = []
        this.canvas.getObjects().map(item=>{
            if(item.type == 'polygon'){
              var b = {
                  'lu':{'x':item.points[0].x,'y':item.points[0].y},
                  'ru':{'x':item.points[1].x,'y':item.points[1].y},
                  'r':{'x':item.points[2].x,'y':item.points[2].y},
                  'lb':{'x':item.points[3].x,'y':item.points[3].y},
              }
              a.push(b)  
            }
        })
        var canvas = document.getElementById('canvas')
        var imgData = canvas.toDataURL('png')
        imgData = imgData.replace('image/png','image/octet-stream')
        var filename = 'drawingboard_' + (new Date()).getTime() + '.' + 'png' // 下載後的檔名
        var save_link = document.createElement('a')
        save_link.href = imgData
        save_link.download = filename
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        save_link.dispatchEvent(event)
    },
    resetCanvas(){ //重置
      this.canvas.setZoom(1)
      this.canvas.absolutePan(
          new fabric.Point(0, 0)
      )
      this.zoom = 1
      this.zoomPoint= new fabric.Point(0, 0)
      this.lastzoomPoint= { x: 0, y: 0 }
      this.lastmousePoint= { x: 0, y: 0 } 
      this.lastzoom= 1
      
      this.panning = false
      this.lastMovePos= {x:0, y:0}
      this.relativeMouseX = 0
      this.relativeMouseY = 0
      
      this.resetOriginAfterZoom()
    },
    async loadBackgroundImage(objects,imgsrc){ //載入背景圖
      this.canvas.clear()
      fabric.Image.fromURL(imgsrc, (img) => {
          const background = img.set({
           scaleX: this.canvas.width / img.width,
           scaleY: this.canvas.height / img.height,
          })
          this.canvas.setBackgroundImage(background, this.canvas.renderAll.bind(this.canvas))
          this.canvas.renderAll()
      })
      await this.loadObjects(objects)
    },
    addImageProcess(src){ //載入圖片
      var self = this
      return new Promise((resolve, reject) => {
          self.imgEl = new Image()
          self.imgEl.onload = () => resolve(self.imgEl)
          self.imgEl.onerror = ()=>reject("加載失敗")
          self.imgEl.src = require('@assets/equipment/'+src)
      })
    },
    async loadObjects(val){ //載入初始物件
      if(val !== null){ 
        var self = this
        var obj = JSON.parse(val)
        fabric.util.enlivenObjects(obj, async function(object) {
            var origRenderOnAddRemove = self.canvas.renderOnAddRemove
            self.canvas.renderOnAddRemove = false
            var original = []
            obj.forEach(item=>{
              original.push(item)
            })
            for(let i=0;i<object.length;i++){
              if(object[i].type == 'image'){
                var item = constant.Equipment.filter((item,index) => 
                  item.id == object[i].srcId
                )[0]
                await self.addImageProcess(item.status[0].imgSrc).then((respone) => {
                  const image = new fabric.Image(respone, {
                    scaleX: object[i].scaleX,
                    scaleY: object[i].scaleY,
                    top: object[i].top,
                    left: object[i].left,
                    visible: false,
                    opacity: 1,
                    hasControls:false
                  }) 
                  self.canvas.add(image)
                  self.addCustomize(image,object[i].objId,object[i].objectName,object[i].blockType,
                  object[i].srcId,object[i].addressId,object[i].connectId,object[i].status,object[i].action)
                }).catch((err)=>{
                    console.log(err)  
                })
              }else{
                object[i].visible = false
                self.canvas.add(object[i])
                self.addCustomize(object[i],object[i].objId,object[i].objectName,object[i].blockType,
                object[i].srcId,object[i].addressId,object[i].connectId,object[i].status,object[i].action)
              }
            }
            self.canvas.renderOnAddRemove = origRenderOnAddRemove
            self.canvas.renderAll()
            self.state = self.canvas.toJSON()
            //self.sendAllobj()
        })
      }
    },
    searchBlockType(val){ //區塊顯示開關 先關閉全部再開啟對應的類型
      this.canvas.discardActiveObject()
      this.canvas.getObjects().forEach(obj =>{
        obj.visible = false
      })
      val.forEach(item => {
        this.canvas.getObjects().forEach(obj =>{
          if(obj.blockType == item){
            obj.visible = true
          }
        })
      })
      this.canvas.renderAll()
    },
    //圖層傳來的事件
    objectSelect(address){ //圖層選取物件
      // this.canvas.discardActiveObject()
      // if(val.visible && this.type == 'edit'){
      //   this.canvas.setActiveObject(val)
      //   this.objectName = val.objectName
      //   this.canvas.renderAll()
      // }
      this.canvas.discardActiveObject()
      var icon = this.canvas.getObjects().filter(item=>{
        return item.addressId == address
      })[0]
      if(icon !== undefined && icon.visible && this.type == 'edit'){
        this.canvas.setActiveObject(icon)
        this.canvas.renderAll()
      }
    },
    //選取 刪除 移動物件
    selectioncreatedandupdated(e){ //畫面顯示選取到的物件的屬性狀況
      //this.addressDiv = {x:e.e.offsetX,y:e.e.offsetY}
      // this.infovisible = true
      this.selectioncleared(null)
      var items = this.canvas.getActiveObjects()
      //this.isImage = false
      //this.isTextBox = null
      this.selectType = null
      if(items.length === 1){
        //this.objId = items[0].objId
        this.objectName = items[0].objectName
        this.blockType = items[0].blockType  
        if(items[0].type === 'textbox'){
          this.selectType = 'textbox'
          this.fontsize = items[0].fontSize
          this.fontcolor = items[0].fill
        }else if(items[0].type === 'path' || items[0].type === 'polygon' ){
          this.selectType = 'path'
          this.opacity = items[0].opacity*100
          this.fillcolor = items[0].fill
          this.strokecolor = items[0].stroke
          this.strokedash = items[0].strokeDashArray
          this.strokeWidth = items[0].strokeWidth
          this.connectId = items[0].connectId
          if(this.strokedash == null){
            this.strokeDash = '-1'
          }else{
            if(this.strokedash[0] === 0){
              this.strokeDash = '0'
            }else{
              this.strokeDash = '1'
            }
          }
        }else if(items[0].type === 'image'){
          this.selectType = 'image'
          this.srcId = items[0].srcId
          this.addressId = items[0].addressId
          this.connectId = items[0].connectId
        }
      }
      items.forEach(item=>{
        item.set({borderColor:'#fbb802',cornerColor:'#fbb802',cornerSize: 10,transparentCorners: false})
      })
      //this.$emit('sendActionToLayer','sel',items)
    },
    selectioncleared(e){ //回到預設
      //this.objId = null
      this.objectName = ''
      this.blockType = '未分類'
      this.fontsize = '14'
      this.fontcolor = 'rgba(255, 0, 0, 1)'
      this.opacity = 50
      this.fillcolor = 'rgba(197, 195, 195, 1)'
      this.strokecolor = 'rgb(0, 0, 0)'
      this.strokeDash = '0'
      this.strokedash = [0,0]
      this.strokeWidth = 1 
      this.selectType = null
      this.connectId = ''
      this.addressId = ''
      //this.$emit('sendActionToLayer','sel',null)
    },
    deleteObj() { //圖控刪除物件
      var item = this.canvas.getActiveObjects()
      if(item.length == 0){
        this.$message.error('請選擇要刪除的物件')
        return false
      } 
      item.forEach(obj => {
        this.canvas.remove(obj)
        var index = this.imgAddress.findIndex(item=>{ 
          return item.label == obj.addressId })
        if(index !== -1){ 
          this.imgAddress[index].systemUsed = false 
          this.$refs.equipmentType.setDisableDraggle(this.imgAddress[index].id,true)
        }
      })
      this.saveCanvasState()
      this.canvas.renderAll()
      // if(item.length !== 0){
      //   await this.$emit('sendActionToLayer','del',item)
      // }
    },
    //座標相關調整
    getX(o) {
      var x = ""
      if(o.pointer == undefined){
        x = o.e.offsetX
      }else{
        x = o.pointer.x
      }
      return (
        this.lastzoomPoint.x +
        (x - this.zoomPoint.x - this.relativeMouseX) /
          this.canvas.getZoom()
      )
    },
    getY(o) {
      var y = ""
      if(o.pointer == undefined){
        y = o.e.offsetY
      }else{
        y = o.pointer.y
      }
      return (
        this.lastzoomPoint.y +
        (y - this.zoomPoint.y - this.relativeMouseY) /
          this.canvas.getZoom()
      )
    },
    resetOriginAfterZoom() {  // 縮放後重置原點
        this.lastzoomPoint.x =
          this.lastzoomPoint.x +
          (this.zoomPoint.x - this.lastmousePoint.x - this.relativeMouseX) / this.lastzoom
        this.lastzoomPoint.y =
          this.lastzoomPoint.y +
          (this.zoomPoint.y - this.lastmousePoint.y - this.relativeMouseY) / this.lastzoom

        this.lastmousePoint.x = this.zoomPoint.x
        this.lastmousePoint.y = this.zoomPoint.y
        this.lastzoom = this.zoom

        this.relativeMouseX = 0
        this.relativeMouseY = 0
    },
    //滑鼠事件
    mousewheel(e){ //放大縮小
      window.event.stopPropagation()
      window.event.preventDefault()
      this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.canvas.getZoom()
      //this.zoom = (e.key.toLowerCase() =="q" ? 0.1 : -0.1) + this.canvas.getZoom()
      this.zoom = Math.max(0.5, this.zoom)
      this.zoom = Math.min(3, this.zoom)
      const center = this.canvas.getCenter()
      this.zoomPoint = new fabric.Point(center.left, center.top)
      this.canvas.zoomToPoint(this.zoomPoint, this.zoom)
      this.resetOriginAfterZoom()
      this.canvas.renderAll()
    },
    mousedown(e) { //移動畫布
      console.log(this.canvas.skipTargetFind , this.canvas.selection)
      window.event.stopPropagation()
      window.event.preventDefault()
      this.mouseFrom.x = this.getX(e)
      this.mouseFrom.y = this.getY(e)
      this.objectCount = this.canvas.getObjects().length
      if(e.e.altKey && this.drawType == ""){ //移動畫布
        this.panning = true
        this.canvas.skipTargetFind = true
        this.canvas.selection = false
        this.lastMovePos.x = e.e.clientX
        this.lastMovePos.y = e.e.clientY
      }

      if(this.type === 'edit'){
        this.doDrawing = true
      }else{
        return
      }

      // if(this.canvas.getActiveObject() == null && this.imgSource.length !== 0 && this.drawType == 'icon'){ //可以點選圖片新增
      //   if(window.child.closed){
      //     this.imgSource = []
      //     this.canvas.skipTargetFind = false
      //   }else{
      //     this.canvas.skipTargetFind = true
      //     this.drop(e)
      //   }
      // }else 
      if (this.drawType == "text") { 
        this.addTextBox()
      }else if (this.drawType == "polygon") {
        if (this.pointArray.length > 1) {
          if (e.target && e.target.id == this.pointArray[0].id) {
            this.generatePolygon()//最後一個點
          }
        }
        if (this.polygonMode) {
          this.addPoint(e)
        }
      }
    },
    mousemove(e) {
        if (this.canvas.getActiveObjects().length === 0 && this.panning && e && e.e) { //移動畫布
            let deltaX = 0
            let deltaY = 0
            if (this.lastMovePos.x) {
              deltaX = e.e.clientX - this.lastMovePos.x
            }
            if (this.lastMovePos.y) {
              deltaY = e.e.clientY - this.lastMovePos.y
            }
            this.lastMovePos.x = e.e.clientX
            this.lastMovePos.y = e.e.clientY
            let delta = new fabric.Point(deltaX, deltaY)
            this.canvas.relativePan(delta)
            this.relativeMouseX += e.e.movementX //累计每一次移动时候的偏差
            this.relativeMouseY += e.e.movementY
        }
        if (this.moveCount % 2 && !this.doDrawing) { //減少繪製頻率
          return
        }
        this.moveCount++
        this.mouseTo.x = this.getX(e)
        this.mouseTo.y = this.getY(e)
        if (this.drawType == "rectangle") {
          this.drawing()
        }
        if (this.drawType == "polygon") {
          if (this.activeLine && this.activeLine.class == "line") {
            var pointer = this.canvas.getPointer(e.e)
            this.activeLine.set({ x2: pointer.x, y2: pointer.y })
            var points = this.activeShape.get("points")
            points[this.pointArray.length] = {
              x: pointer.x,
              y: pointer.y,
              zIndex: 1
            }
            this.activeShape.set({
              points: points
            })
            this.canvas.renderAll()
          }
          this.canvas.renderAll()
        }
    },
    mouseup(e) {
      this.mouseTo.x = this.getX(e)
      this.mouseTo.y = this.getY(e)
      this.panning = false //移動畫布
      if(this.type !== 'edit'){
        return
      }
      //新增圖例的狀況下應關閉所有選取,才可在方框上新增圖例
      
      if(this.imgSource.length === 0 ){ 
        this.canvas.skipTargetFind = false
        this.canvas.selection = true
      }
      //廣播圖層新增:長方形
      if(this.drawType === 'rectangle'){
        if(this.canvas.getObjects().length !== this.objectCount){
          this.isEditChange(true)
          var imageSelect = this.canvas.getActiveObjects().filter(item=> { return item.type == 'image'})
          //若再有一個框住的話，是否想要可以覆蓋?
          var path = this.canvas.getActiveObjects().filter(item=> { return item.type == 'path'})
          imageSelect.forEach(item=>{
            item.set({ connectId: path[0].objId })
            this.isEditChange(true)
          })
        }
      }
      this.drawingObject = null
      this.moveCount = 1
      if (this.drawType != 'polygon') {
        this.doDrawing = false
      }
      this.objectCount = this.canvas.getObjects().length
    },
    drag(e){
      window.event.stopPropagation()
      window.event.preventDefault()
    },
    //新增物件
    async drawTypeChange(e) { //切換繪圖類別
      // if(window.child && window.child.open && !window.child.closed){
      //   window.child.close()
      //   this.imgSource = []
      // }
      
      if(this.drawType == 'text' && this.textbox !== null){
        this.textbox.exitEditing() //關閉文字框編輯
        this.textbox = null
      }
      if(e == 'polygon'){
        this.polygonMode = true
        this.pointArray = new Array()
        this.lineArray = new Array()
      }
      this.drawType = e
      this.canvas.isDrawingMode = false
    },
    drop(e){ //新增圖例
      window.event.stopPropagation()
      window.event.preventDefault()
      const imgEl = document.createElement('img')
      imgEl.src = require('@assets/equipment/'+this.imgSource[8])
      imgEl.onload = () => {
        const image = new fabric.Image(imgEl, {
          scaleX: 0.1,
          scaleY: 0.1,
          top: this.getY(e) - this.imgSource[2]*0.05,
          left: this.getX(e) - this.imgSource[1]*0.05,
          visible:true,
          opacity:1,
          hasControls:false
        })
        this.canvas.add(image)
        this.addCustomize(image,null,this.imgSource[3],null,this.imgSource[0],this.imgSource[4],null,this.imgSource[5],this.imgSource[6])
        this.canvas.renderAll()
        this.isEditChange(true)
        if(this.imgSource[7] !== null){
          this.$refs.equipmentType.setDisableDraggle(this.imgSource[7],false)
        }
        var index = this.imgAddress.findIndex(item=>{ 
          return item.label == this.imgSource[4] })
        if(index !== -1){ this.imgAddress[index].systemUsed = true }
        this.imgSource = []
        this.canvas.skipTargetFind = false
      }
    },
    drawing() { //新增矩形
      if(this.canvas.getActiveObjects().length === 0){
          if (this.drawingObject !== null) {
            this.canvas.remove(this.drawingObject)
          }
          var canvasObject = null
          var left = this.mouseFrom.x,
              top = this.mouseFrom.y,
              mouseFrom = this.mouseFrom,
              mouseTo = this.mouseTo;
          var path =
                      "M " +
                      mouseFrom.x +
                      " " +
                      mouseFrom.y +
                      " L " +
                      mouseTo.x +
                      " " +
                      mouseFrom.y +
                      " L " +
                      mouseTo.x +
                      " " +
                      mouseTo.y +
                      " L " +
                      mouseFrom.x +
                      " " +
                      mouseTo.y +
                      " L " +
                      mouseFrom.x +
                      " " +
                      mouseFrom.y +
                      " z";
                  canvasObject = new fabric.Path(path, {
                      left: left,
                      top: top,
                      stroke: this.strokecolor,
                      strokeWidth: this.strokeWidth,
                      fill: this.fillcolor,
                      opacity:this.opacity/100,
                      strokeDashArray:this.strokedash,
                      visible:true
                  })
                  this.canvas.add(canvasObject)
                  this.drawingObject = canvasObject
                  this.addCustomize(canvasObject)
      }
    },
    addTextBox(){ //新增文字
      this.textbox = new fabric.Textbox("請輸入文字", {
        left: this.mouseFrom.x,
        top: this.mouseFrom.y,
        fontSize: this.fontsize,
        fill: this.fontcolor, //字體顏色
        editingBorderColor: 'blue',
        visible:true
      })
      this.canvas.add(this.textbox)
      this.textbox.enterEditing()
      this.textbox.hiddenTextarea.focus()
      this.addCustomize(this.textbox)
      this.isEditChange(true)
      this.drawTypeChange('')
    },
    addPoint(e) { //多邊形的點
      var random = Math.floor(Math.random() * 10000);
      var id = new Date().getTime() + random;
      var circle = new fabric.Circle({
        radius: 5,
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 0.5,
        left:this.mouseFrom.x,
        top:this.mouseFrom.y,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center",
        id: id,
        objectCaching: false
      })
      if (this.pointArray.length == 0) {
        circle.set({
          fill: "red"
        })
      }
      var points = [
        this.mouseFrom.x,
        this.mouseFrom.y,
        this.mouseFrom.x,
        this.mouseFrom.y
      ]
      this.line = new fabric.Line(points, {
        strokeWidth: 2,
        fill: "#999999",
        stroke: "#999999",
        class: "line",
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
        strokeDashArray:[0,0]
      })
      if (this.activeShape) {
        var pos = this.canvas.getPointer(e.e)
        var points = this.activeShape.get("points")
        points.push({
          x: pos.x,
          y: pos.y
        })
        var polygon = new fabric.Polygon(points, {
          stroke: "#333333",
          strokeWidth: 1,
          fill: "red",
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false
        })
        this.canvas.remove(this.activeShape)
        this.canvas.add(polygon)
        this.activeShape = polygon
        this.canvas.renderAll()
      } else {
        var polyPoint = [
          {
            x: this.mouseFrom.x,
            y: this.mouseFrom.y
          }
        ]
        var polygon = new fabric.Polygon(polyPoint, {
          stroke: "#333333",
          strokeWidth: 1,
          fill: "#cccccc",
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        })
        this.activeShape = polygon
        this.canvas.add(polygon)
      }
      this.activeLine = this.line
      this.pointArray.push(circle)
      this.lineArray.push(this.line)
      this.canvas.add(this.line)
      this.canvas.add(circle)
    },
    generatePolygon() { //多邊形最後一個點
      var points = new Array()
      this.pointArray.map((point, index) => { //移除點
        points.push({
          x: point.left,
          y: point.top
        })
        this.canvas.remove(point)
      })
      this.lineArray.map((line, index) => { //移除線
        this.canvas.remove(line)
      })
      this.canvas.remove(this.activeShape).remove(this.activeLine)
      var polygon = new fabric.Polygon(points, {
        stroke: this.strokecolor,
        strokeWidth: this.strokeWidth,
        fill: this.fillcolor,
        opacity: this.opacity/100,
        hasBorders: true,
        strokeDashArray: this.strokedash,
        visible:true
      })
      this.canvas.add(polygon)
      this.addCustomize(polygon)
      this.isEditChange(true)
      this.drawingObject = polygon
      this.activeLine = null
      this.activeShape = null
      this.polygonMode = false
      this.doDrawing = false
      this.drawType = null
    },
    // openLegendWindows(){ // 打開圖例
    //   this.drawType = 'icon'
    //   const { href } = this.$router.resolve({
    //     name: 'Graphic_equipmentType'
    //   })
    //   if(window.child && window.child.open && !window.child.closed){
    //     window.child.focus()
    //   }else{
    //     window.child = window.open(href, '_blank', 'toolbar=no, width=400, height=600,location=no')
    //   }
    // },
    sendAddressImageIcon(item,event){ //樓層點位-火警&plc + 圖例新增
      if(item.internet !== undefined){
        var address = item.internet+'-'+item.system
        if(item.type == 'fire'){
          address = address.concat('-'+item.address)
          if(item.number !== '' && item.number !== null && item.number !== undefined){
            address = address.concat('-'+item.number)
          } 
        }else{
          if(item.memeryLoc !== '' && item.memeryLoc !== null && item.memeryLoc !== undefined){
            address = address.concat('-'+item.memeryLoc)
          } 
        }
        // if(item.address !== '' && item.address !== null && item.address !== undefined){
        //     address = address.concat('-'+item.address)
        // }
        // if(item.number !== '' && item.number !== null && item.number !== undefined){
        //     address = address.concat('-'+item.number)
        // }
        // if(item.type == 'plc' && item.memeryLoc !== '' && item.memeryLoc !== null && item.memeryLoc !== undefined){
        //     address = address.concat('-'+item.memeryLoc)
        // }
        var icon = constant.Equipment.filter(icon=>{
          return icon.id == item.iconId 
        })[0]
        this.imgSource = [item.iconId, event.offsetX, event.offsetY, item.deviceFullType, address, 
        icon.status !== undefined ? icon.status : [], 
        icon.action !== undefined ? icon.action : [], 
        item.id, icon.status[0].imgSrc]
        this.objectSelect(address)
      }else{
        var icon = constant.Equipment.filter(icon=>{
          return icon.id == item.id 
        })[0]
        this.imgSource = [item.id, event.offsetX, event.offsetY, item.name, null, 
        icon.status !== undefined ? icon.status : [], 
        icon.action !== undefined ? icon.action : [], 
        null, icon.status[0].imgSrc]
      }
      
    },
    // receiveMessage(event) { //子視窗傳來的
    //     //event.origin是指發送的消息源，一定要進行驗證！！！
    //     // if (event.origin !== "http://localhost:9528")return
    //     if (event.data.source === 'vue-devtools-backend-injection' 
    //     || event.data.source === 'vue-devtools-proxy' || event.data.source === 'undefined')return
    //     if(event.data !== "" && event.data !== 'null'){
    //       this.imgSource = event.data.split('|')
    //       console.log(this.imgSource)
    //       this.canvas.skipTargetFind = true
    //     }else if (event.data == 'null'){
    //       this.imgSource = []
    //       this.canvas.skipTargetFind = false
    //     }
    // },
    //屬性修改
    changeAttributes(type){
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
        switch(type){
          case 'fontsize':
            this.canvas.getActiveObject().set({ fontSize: this.fontsize })
            break;
          case 'fontcolor':
            this.canvas.getActiveObject().set({ fill: this.fontcolor })
            break;
          case 'opacity':
            this.canvas.getActiveObject().set({ opacity:this.opacity/100 })
            break;
          case 'strokeWidth':
            if(this.strokeWidth == '0'){
                this.strokeDash = '-1'
                this.strokedash = null
            }else{
                this.strokeDash = this.strokeDash !== '-1' ?  this.strokeDash : '0'
                this.strokedash =  this.strokedash !== null ?  this.strokedash : [0,0]
            }
            this.canvas.getActiveObject().set({ 
              strokeWidth:this.strokeWidth , strokeDashArray:this.strokedash })
            break;
          case 'strokeDash':
            if(this.strokeDash == -1){
              this.strokedash = null
              this.strokeWidth = 0
            }else if(this.strokeDash == 0){
              this.strokedash = [0,0]
              this.strokeWidth = this.strokeWidth !== 0 ? this.strokeWidth : 1
            }else{
              this.strokedash = [5,10]
              this.strokeWidth = this.strokeWidth !== 0 ? this.strokeWidth : 1
            }
            this.canvas.getActiveObject().set({ 
                strokeWidth:this.strokeWidth , strokeDashArray:this.strokedash })
            break;
          case 'fillcolor':
            this.canvas.getActiveObject().set({ fill: this.fillcolor })  
            break;
          case 'strokecolor':
            this.canvas.getActiveObject().set({ stroke: this.strokecolor }) 
            break;  
        }
        this.isEditChange(true)
        this.canvas.renderAll()
      }
    },
    sendLabelChange(){ //標題修改
      clearTimeout(this.TimeId)
      this.TimeId = setTimeout(() => {
        if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
          this.canvas.getActiveObject().set({ objectName: this.objectName })
          this.isEditChange(true)
        }
      }, 400)
    },
    sendBlockChange(){ //區塊類型修改
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
        this.canvas.getActiveObject().set({ blockType: this.blockType })
        this.isEditChange(true)
        // if(this.canvas.getActiveObject().type !== 'image'){
        //   this.$emit('sendBlcokChange',this.canvas.getActiveObject().id,this.objectName,this.blockType)
        // }
        //檢查現在選取的方框是否有修改的類型
        var ret1 = this.checkList.find((value, index, arr) => {
          return value == this.blockType
        })
        if(ret1 == undefined){
          this.canvas.getActiveObject().set({ visible: false })
          this.canvas.discardActiveObject()
          this.canvas.renderAll()
        }
      }
    },
    sendAddressChange(){ //點位設定修改
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
        var original = this.canvas.getActiveObject().addressId
        var newaddress = this.addressId
        if(original !== newaddress){
          var originalIndex = this.imgAddress.findIndex(item=>{ 
          return item.label == original })
          if(originalIndex !== -1){ 
            this.imgAddress[originalIndex].systemUsed = false 
            this.$refs.equipmentType.setDisableDraggle(this.imgAddress[originalIndex].id,true)
          }
        }
        this.canvas.getActiveObject().set({ addressId: this.addressId })
        var newindex = this.imgAddress.findIndex(item=>{ return item.label == this.addressId })
        if(newindex !== -1){ 
          this.imgAddress[newindex].systemUsed = true 
          this.$refs.equipmentType.setDisableDraggle(this.imgAddress[newindex].id,false)
        }
        this.isEditChange(true)
      }
    },
    sendConnectChange(){ //關聯修改
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
          this.canvas.getActiveObject().set({ connectId: this.connectId })
          this.isEditChange(true)
      }
    },
    //儲存相關
    addCustomize(canvasObject, objId = null, objectname = null, blocktype = null, srcId = null, addressId = null,
    connectId = null, status = null, action = null){ //新增客製化元素：貼上/初始化物件/圖例/矩形/文字/多邊
        canvasObject.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    objId: getUUID(),
                    objectName: this.objectName,
                    blockType: this.blockType,
                    srcId:this.srcId,
                    addressId:this.addressId,
                    connectId:this.connectId,
                    status:status,
                    action:action
                })
            }
        })(canvasObject.toObject)
        canvasObject.set("objId",objId == null ? getUUID() : objId) //唯一性，用來新增icon
        canvasObject.set("objectName",objectname !== null ? objectname : this.objectName == '' ?  
        (new Date()).getTime() : this.objectName) //+'_'+ (new Date()).getTime()
        canvasObject.set("blockType",blocktype == null ? this.blockType : blocktype) //區塊才有
        canvasObject.set("srcId",srcId == null ? '' : srcId) //圖示的id
        canvasObject.set("addressId",addressId == null ? '' : addressId) //點位，用來websocket接收訊息後找icon並且動作
        canvasObject.set("connectId",connectId == null ? '' : connectId) //關聯，區塊要關聯探測器物件的id(uuid)，下拉選單選取所有scrid=探測器的
        canvasObject.set("status",status)
        canvasObject.set("action",action)
    },
    //sendAllobj(){ //傳給父元件：貼上/初始化物件/圖例/矩形/文字/多邊
      // this.saveCanvasState()
      // this.$emit('sendObjectListToLayer',this.canvas.getObjects())
    //},
    saveCanvasState(){ //儲存畫布狀態：物件有編輯/物件刪除/傳給父元件(貼上/初始化物件/圖例/矩形/文字/多邊)
      if(JSON.stringify(this.canvas.toJSON()) === JSON.stringify(this.state)) return  
      this.undo.push(this.state)
      this.state = this.canvas.toJSON()
      this.redo = []
    },
    isEditChange(val){ //是否編輯圖控：貼上/上一步/下一步/新增物件(圖例/矩形/文字/多邊)/屬性修改//移動
      this.isSave = val
      this.$emit('sendSaveToSelect',val)
    },
    async saveCanvasFile(){ //呼叫儲存物件api：存檔
      window.event.stopPropagation()
      window.event.preventDefault()
      var currState =JSON.parse(JSON.stringify(this.canvas.getObjects()))
      currState.forEach(item=>{
        if(item.type=='image'){
          item.src = ''
        }
      })
      this.$emit('sendFloorGraphicFile', currState, this.imgAddress)
      this.isEditChange(false)
    },
    copy(){ //複製圖片
      var object = fabric.util.object.clone(this.canvas.getActiveObject())
      this.clipboard = object
    },
    paste(){ //貼上圖片
      var canvas = this.canvas
      var _clipboard = this.clipboard
      var self = this
      _clipboard.clone(function(clonedObj) {
          canvas.discardActiveObject()
          clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
          })
          if (clonedObj.type === 'activeSelection') {
            clonedObj.canvas = canvas
            clonedObj.forEachObject(function(obj) {
              canvas.add(obj)
              self.addCustomize(obj,null,_clipboard.objectName,_clipboard.blockType,
              _clipboard.srcId,null,null,_clipboard.status,_clipboard.action) 
            })
            clonedObj.setCoords()
          } else {
            canvas.add(clonedObj)
            self.addCustomize(clonedObj,null,_clipboard.objectName,_clipboard.blockType,
            _clipboard.srcId,null,null,_clipboard.status,_clipboard.action)  
          }
          _clipboard.top += 10
          _clipboard.left += 10
          canvas.setActiveObject(clonedObj)
          canvas.requestRenderAll()
          //self.sendAllobj()
          self.isEditChange(true)
        })
    },
    doUndo() { //上一步
      if (this.undo.length === 0) {
        this.$message.error('目前沒有動作可復原')
        return
      }
      let lastJSON = this.undo.pop() // 取出 undo 最後一筆資料讀取
      this.canvas.loadFromJSON(lastJSON, () => {
        this.redo.push(this.state) // 在做上一步時把目前狀態 push 到 redo 陣列
        this.state = lastJSON // 換成上一步的狀態
        //this.$emit('sendObjectRedoUndoToLayer',this.canvas.getObjects())
        this.isEditChange(true)
      })
    },
    doRedo() { //下一步
      if (this.redo.length === 0) {
        this.$message.error('目前沒有動作可復原')
        return
      }
      let lastJSON = this.redo.pop()
      this.canvas.loadFromJSON(lastJSON, () => {
        this.undo.push(this.state)
        this.state = lastJSON
        //this.$emit('sendObjectRedoUndoToLayer',this.canvas.getObjects())
        this.isEditChange(true)
      })
    },
    //websocket
    sendObj(id,type,content){ //廣播
        const msg = {
            type: type,
            content: JSON.stringify(content),
            id:id
        }
        if (this.$socket.$ws && this.$socket.$ws.readyState == 1) {
            this.$socket.$ws.send(JSON.stringify(msg))
        }else{
            this.$socket.$ws
        }
    },
    //動畫
    stopAnim(){
      this.hasAnimationStarted = false
    },
    setAnimate(obj,type){
      this.hasAnimationStarted = true
      this.animateAddTop(obj)
      switch(type){
        case '6666':
          this.animateAddTop(obj)
          break;
        case '6664':
          obj.animate('opacity', obj.opacity === 0.5 ? 1 : 0.5, {
              duration: 500,
              onChange: this.canvas.renderAll.bind(this.canvas),
              onComplete: () => this.setAnimate(obj,'6664'),
              abort: () => !this.hasAnimationStarted,
              easing: fabric.util.ease.easeInCubic
          })
          break;  
      }
    },
    animateAddTop(obj) {
      obj.animate('top', obj.top += 10  , {
        duration: 250,
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: () => this.animateLessTop(obj),
        abort: () => !this.hasAnimationStarted,
        easing: fabric.util.ease.easeInSine
      })
    },
    animateLessTop(obj) {
      obj.animate('top', obj.top -= 10  , {
        duration: 250,
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: () => this.animateAddTop(obj),
        abort: () => !this.hasAnimationStarted,
        easing: fabric.util.ease.easeInSine
      })
    },
    disableVisible(){
      this.infovisible = false
    }, 
    //操作列
    async handleOperateMenu(operate){
      switch(operate){
        case '': case 'text': case 'rectangle': case 'polygon':
          this.drawTypeChange(operate)
          break;
        // case 'icon':
        //   this.openLegendWindows()
        //   break;
        case 'upper-step':
          this.doUndo()
          break;
        case 'next-step':
          this.doRedo()
          break;
        case 'delete':
          this.deleteObj()
          break;
        case 'resetlocation':
          this.resetCanvas()
          break;
        case 'export':
          this.jsondata = this.canvas.toJSON()
          var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.jsondata, null, '\t'));
          var downloadAnchorNode = document.createElement('a')
          downloadAnchorNode.setAttribute("href", datastr);
          downloadAnchorNode.setAttribute("download", 'data.json')
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          this.$message.success("正在下載，請稍後...")
          break;
        case 'view-code':
          this.jsonInfoVisible = true
          this.jsondata = this.canvas.toJSON()
          this.$nextTick(function () {
              this.$refs.jsonInfo.init()
          })
          break;
        case 'save':
          await this.saveCanvasFile()
          break;
        case 'saveImage':
          this.saveImg()
          break;
        case 'clear':
          this.$confirm('確定要清除畫布嗎?', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var items = this.canvas.getObjects()
            if(items.length){
              this.isEditChange(true)
            }
            for(let obj of items){
              this.canvas.remove(obj)
              var index = this.imgAddress.findIndex(item=>{ 
                return item.label == obj.addressId })
              if(index !== -1){ 
                this.imgAddress[index].systemUsed = false 
                this.$refs.equipmentType.setDisableDraggle(this.imgAddress[index].id, true)
              }
            }
            this.saveCanvasState()
            this.canvas.renderAll()
          }).catch(() => {})
          break;
      }
    }
  }
}
</script>


<style lang="scss" scoped>

.form-inline{
  margin-top: 5px;
}
.maintenancePlanAdd{
  width: 100%;
  height: 100%;
  display: flex;
  > div {
    display: flex;
    flex-direction: column;
  }
  header {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #eee;
  }
  .section {
    flex: 1;
  }
  .canvasdiv{
    width: 1650px;
    margin: auto;
    text-align: center;
  }
  canvas {  
    border: 1px dashed black;
  }
  .flow-attr {
    width: 100%;
  }

}
img,
input {
  display: none;
}

.graphic {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-form-item{
  margin-bottom: 10px;
}

.draw-btn-group {
  // width: 1270px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & > div {
    background: #fafafa;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
    height: 30px;
    i {
      display: flex;
      background-repeat: no-repeat;
      background-size: 80%;
      background-position: 50% 50%;
      height: 25px;
      width: 25px;
      padding-right: 5px;
    }
    .icon-polygon {
      background-image: url("../../assets/image/polygon.png");
      background-size: 80%;
    }
    .icon-rectangle {
      background-image: url("../../assets/image/rectangle.png");
      background-size: 80%;
    }
    .icon-text {
      background-image: url("../../assets/image/text.png");
      background-size: 80%;
    }
    .icon-delete {
      background-image: url("../../assets/image/delete.png");
      background-size: 80%;
    }
    .icon-save {
      background-image: url("../../assets/image/save.png");
      background-size: 80%;
    }
    .icon-mouse {
      background-image: url("../../assets/image/mouse.png");
      background-size: 60%;
    }
  }
  .active {
    background: rgb(194, 193, 193);
  }
}

.dialog{
  margin-top: 307px;
  .el-dialog{
    margin: 0px 0px 0px 0px;
  }
}

.addressInfo{
  position: absolute;
  z-index:99;
  border: 1px dotted black;
  text-align: center;
  cursor: move;
  span{
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 18px;
    width: 100%;
  }
  i{
    font-size: 20px;
    cursor:pointer;
    float: right;
  }
}
</style>