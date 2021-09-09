<template>
  <div class="maintenancePlanAdd">
    <el-row :gutter="16" class="row" style="height:620px">
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
    </el-row>

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
  </div>
</template>

<script>
import constant from '../../../src/constant'
import { mapGetters } from 'vuex'


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
    },
  },
  computed: {
     ...mapGetters([
        'wsmsg',
        'sidebar',
        'buildingdevices'
    ]),
    formvalue() {
      if (this.sidebar.opened === true) {
        return 24
      } else {
        return 4
      }
    },
    canvasvalue() {
      if (this.sidebar.opened === true) {
        return 24
      } else {
        return 20
      }
    },
    getHeaders() {
      return this.addressInfo.reduce((pre, cur, index) => pre.concat(`value${index}`), ['title'])
    },
    getValues() {
      return this.headers.map(item => {
        return this.addressInfo.reduce((pre, cur, index) => Object.assign(pre, {['value' + index]: cur[item.prop]}), {'title': item.label,});
      })
    }
  },
  data() {
    return {
      hasAnimationStarted:false,
      setPointObj:null,
      updateArray:[],
      devicearray:[],
      addressId:'',
      deviceId:'',
      isImage:false, //控制是否可以設定點位
      isTextBox:null,
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
      objid:0,
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
      }]
    }
  },
  watch: {
      type:{
          handler:async function(){
            if(this.type === 'edit'){
              this.canvas.skipTargetFind = false
              this.canvas.selection = true
            }else{
              this.doDrawing = false
              this.canvas.skipTargetFind = true
              this.canvas.selection = false
            }
          },
          immediate:true
      },
      actionObj:{
        handler:async function(){
          if(this.actionObj !== null){
            console.log('actionObj',this.actionObj,this.actionObj.LinkDevice.DeviceId)
            var index = this.canvas.getObjects().findIndex(o=>o.deviceId == this.actionObj.LinkDevice.DeviceId)
            var obj = this.canvas.getObjects()[index]
            obj.set({ visible : true})
            this.setAnimate(obj,this.actionObj.Action)
            this.canvas.renderAll()
          }
        },
        immediate:true
      }
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas")
    //this.$store.state.graphic.json  this.$refs.canvasdiv.clientWidth
    this.canvas.setWidth(1500)
    this.canvas.setHeight(600)
    this.canvas.skipTargetFind = true
    this.canvas.selection = false
    this.canvas.selectionBorderColor ="red"
    this.canvas.selectionLineWidth = 2
    this.canvas.selectionDashArray = [5, 5]
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
    //添加消息接收函數
    window.addEventListener("message", this.receiveMessage, false)

    document.onkeydown = async(e) => {
      if (e.keyCode == 46) {
        await this.deleteObj()
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
    //父元件傳來的事件
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
      this.sendAllobj()
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
          self.imgEl.src = src
      })
    },
    async loadObjects(val){ //載入初始物件
      if(val !== null){ 
        var self = this
        var obj = JSON.parse(val)
        fabric.util.enlivenObjects(obj,async function(object) {
            var origRenderOnAddRemove = self.canvas.renderOnAddRemove
            self.canvas.renderOnAddRemove = false
            var original = []
            obj.sort((x,y) => x.id - y.id).forEach(item=>{
              original.push(item)
            })
            self.id = original[original.length-1].id +1
            for(let i=0;i<object.length;i++){
              if(object[i].type == 'image'){
                var item = constant.Equipment.filter((item,index) => 
                  item.id == original[i].srcId
                )
                await self.addImageProcess(item[0].imgSrc).then((respone) => {
                  const image = new fabric.Image(respone, {
                    scaleX: object[i].scaleX,
                    scaleY: object[i].scaleY,
                    top: object[i].top,
                    left: object[i].left,
                    visible: false,
                    // opacity: object[i].opacity
                    opacity: object[i].addressId !== '' && object[i].addressId !== undefined ? 
                    1 : object[i].opacity
                  }) 
                  self.canvas.add(image)
                  self.addCustomize(image,original[i].id,original[i].objectName,original[i].blockType,
                  original[i].srcId,original[i].addressId)
                }).catch((err)=>{
                    console.log(err)  
                })
              }else{
                object[i].visible = false
                self.canvas.add(object[i])
                self.addCustomize(object[i],original[i].id,original[i].objectName,original[i].blockType,
                original[i].srcId,original[i].addressId)
              }
            }
            self.canvas.renderOnAddRemove = origRenderOnAddRemove
            self.canvas.renderAll()
            self.state = self.canvas.toJSON()
            self.sendAllobj()
        })
        this.updateArray = []  
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
    objectSelect(val){ //圖層選取物件
      this.canvas.discardActiveObject()
      if(val.visible && this.type == 'edit'){
        this.canvas.setActiveObject(val)
        this.objectName = val.objectName
        this.canvas.renderAll()
      }
    },
    objectDelete(val){ //圖層刪除物件
      val.forEach(obj => {
        this.canvas.remove(obj)
      })
      this.saveCanvasState()
      this.canvas.renderAll()
    },
    //選取 刪除物件
    selectioncreatedandupdated(e){ //畫面顯示選取到的物件的屬性狀況
      console.log(e)
      this.addressDiv = {x:e.e.offsetX,y:e.e.offsetY}
      // this.infovisible = true
      var items = this.canvas.getActiveObjects()
      this.isImage = false
      this.isTextBox = null
      if(items.length === 1){
        this.objectName = items[0].objectName
        this.blockType = items[0].blockType  
        if(items[0].type === 'textbox'){
          this.isTextBox = true
          this.fontsize = items[0].fontSize
          this.fontcolor = items[0].fill
        }else if(items[0].type === 'path' || items[0].type === 'polygon' ){
          this.isTextBox = false
          this.opacity = items[0].opacity*100
          this.fillcolor = items[0].fill
          this.strokecolor = items[0].stroke
          this.strokedash = items[0].strokeDashArray
          this.strokeWidth = items[0].strokeWidth
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
          this.isTextBox = false
          this.opacity = items[0].opacity*100
          this.isImage = true
          this.srcId = items[0].srcId
          this.addressId = items[0].addressId
        }

      }
      items.forEach(item=>{
        item.set({borderColor:'#fbb802',cornerColor:'#fbb802',cornerSize: 10,transparentCorners: false})
      })
      this.$emit('sendActionToLayer','sel',items)
    },
    selectioncleared(e){ //回到預設值
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
      this.isImage = false
      this.isTextBox = null
      this.deviceId = ''
      this.addressId = ''
      this.$emit('sendActionToLayer','sel',null)
    },
    async deleteObj() { //圖控刪除物件
      var item = this.canvas.getActiveObjects()
      if(item.length !== 0){
        await this.$emit('sendActionToLayer','del',item)
      }
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

      if(this.canvas.getActiveObject() == null && this.imgSource.length !== 0 && this.drawType == 'icon'){ //可以點選圖片新增
        if(window.child.closed){
          this.imgSource = []
          this.canvas.skipTargetFind = false
        }else{
          this.drop(e)
        }
      }else if (this.drawType == "text") { 
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
          this.sendAllobj()
          this.isEditChange(true)
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
      if(window.child && window.child.open && !window.child.closed){
        window.child.close()
        this.imgSource = []
      }
      
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
      var item = constant.Equipment.filter((item,index) => 
          item.id == this.imgSource[0]
      ) 
      imgEl.src = item[0].imgSrc
      imgEl.onload = () => {
        const image = new fabric.Image(imgEl, {
          scaleX: 0.1,
          scaleY: 0.1,
          top: this.getY(e) - this.imgSource[2]*0.05,
          left: this.getX(e) - this.imgSource[1]*0.05,
          visible:true,
          opacity:0.5
        })
        this.canvas.add(image)
        this.addCustomize(image,null,this.imgSource[5],null,this.imgSource[0])
        this.sendAllobj() //廣播圖層新增:圖片
        this.canvas.renderAll()
        this.isEditChange(true)
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
      this.sendAllobj() //廣播圖層新增:文字
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
      this.sendAllobj() //廣播圖層新增:多邊形
      this.isEditChange(true)
      this.drawingObject = polygon
      this.activeLine = null
      this.activeShape = null
      this.polygonMode = false
      this.doDrawing = false
      this.drawType = null
    },
    openLegendWindows(){ // 打開圖例
      this.drawType = 'icon'
      const { href } = this.$router.resolve({
        name: 'Graphic_equipmentType'
      })
      if(window.child && window.child.open && !window.child.closed){
        window.child.focus()
      }else{
        window.child = window.open(href, '_blank', 'toolbar=no, width=400, height=600,location=no')
      }
    },
    receiveMessage(event) { //子視窗傳來的
        //event.origin是指發送的消息源，一定要進行驗證！！！
        // if (event.origin !== "http://localhost:9528")return
        if (event.data.source === 'vue-devtools-backend-injection' 
        || event.data.source === 'vue-devtools-proxy' || event.data.source === 'undefined')return
        if(event.data !== "" && event.data !== 'null'){
          this.imgSource = event.data.split(',')
          this.canvas.skipTargetFind = true
        }else if (event.data == 'null'){
          this.imgSource = []
          this.canvas.skipTargetFind = false
        }
    },
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
          this.$emit('sendLabelChange',this.canvas.getActiveObject().id,this.objectName)
        }
      }, 400)
    },
    sendBlockChange(){ //區塊類型修改
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
        this.canvas.getActiveObject().set({ blockType: this.blockType })
        this.isEditChange(true)
        if(this.canvas.getActiveObject().type !== 'image'){
          this.$emit('sendBlcokChange',this.canvas.getActiveObject().id,this.objectName,this.blockType)
        }
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
    async sendDeviceChange(){ //設備修改
      if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
        var originalDevice = this.canvas.getActiveObject().deviceId
        this.canvas.getActiveObject().set({ deviceId: this.deviceId })
        this.isEditChange(true)
        if(originalDevice !== ''){ //原先已有設定值了
          var index1 = this.updateArray.findIndex(d => d.id === originalDevice && d.systemUsed == true )
          if(index1 !== -1){
            this.updateArray[index1].systemUsed = false
            this.updateArray[index1].linkFloors = []
            // this.updateArray[index1].systemNumber = ''
            // this.updateArray[index1].circuitNumber = ''
            // this.updateArray[index1].address = ''
          }else{
            var data = { //新
              id:originalDevice,
              systemUsed:false,
              linkFloors:[],
              // systemNumber:'',
              // circuitNumber:'',
              // address:''
            }
            this.updateArray.push(data)
          }
          var index3 = this.devicearray.findIndex(d => d.id === originalDevice)
          //this.devicearray[index3].disabled = false
          this.devicearray[index3].setSystemUsed(false)
        }
        var index3 = this.devicearray.findIndex(d => d.id === this.deviceId)
        // this.devicearray[index3].disabled = true
        this.devicearray[index3].setSystemUsed(true)
        var index2 = this.updateArray.findIndex(d => d.id === this.deviceId && d.systemUsed == false )
        if(index2 !== -1){
            this.updateArray[index2].systemUsed = true
            this.updateArray[index2].linkFloors = [{id:this.floor.getID()}]
            // this.updateArray[index2].systemNumber = device.systemNumber.replace(/\s*/g,'')
            // this.updateArray[index2].circuitNumber = device.circuitNumber.replace(/\s*/g,'')
            // this.updateArray[index2].address = device.address.replace(/\s*/g,'')
        }else{
            var data = { //新
              id:this.deviceId,
              systemUsed:true,
              linkFloors:[{id:this.floor.getID()}],
              // systemNumber:device.systemNumber.replace(/\s*/g,''),
              // circuitNumber:device.circuitNumber.replace(/\s*/g,''),
              // address:device.address.replace(/\s*/g,'')
            }
            this.updateArray.push(data)
        }
        this.canvas.getActiveObject().set({ opacity: 1 })
        this.isEditChange(true)
        // var pointstr = device.systemNumber.replace(/\s*/g,'')+
        // device.circuitNumber.replace(/\s*/g,'')+device.address.replace(/\s*/g,'')
        // if(pointstr.length >= 8){
        //   // this.devicepoint = pointstr
        //   // this.canvas.getActiveObject().set({ devicepoint: this.devicepoint })
        //   this.canvas.getActiveObject().set({ opacity: 1 })
        //   this.isEditChange(true)
        // } 
        console.log(JSON.stringify(this.updateArray))
      }
    },
    // async checkDevicePointChange(){
    //   this.devicepoint = this.devicepoint.replace(/[^\d]/g,'')
    //   if(this.devicepoint.length == 10){
    //     this.canvas.getActiveObject().set({ devicepoint: this.devicepoint })
    //     this.canvas.getActiveObject().set({ opacity: 1 })
    //     this.isEditChange(true)
    //     this.setPointObj = this.canvas.getActiveObject()
    //     await this.sendDevicePointChange(this.deviceId,this.devicepoint)
    //   }
    // },
    // async sendDevicePointChange(objId,point){
    //   var systemNumber = point.substr(0,2)
    //   var circuitNumber = point.substr(3,3)
    //   var address = point.slice(5)
    //   var index = this.updateArray.findIndex(d => d.id === objId && d.systemUsed == true)
    //   if(index !== -1){ 
    //     this.updateArray[index].systemNumber = systemNumber
    //     this.updateArray[index].circuitNumber = circuitNumber
    //     this.updateArray[index].address = address
    //   }else{
    //     var data = { //新
    //       id:objId,
    //       systemUsed:true,
    //       linkFloors:[{id:this.floor.getID()}],
    //       systemNumber:systemNumber,
    //       circuitNumber:circuitNumber,
    //       address:address
    //     }
    //     this.updateArray.push(data)
    //   }
    // },
    //儲存相關
    addCustomize(canvasObject, id = null, objectname = null, blocktype = null, srcId = null, addressId = null){ //新增客製化元素：貼上/初始化物件/圖例/矩形/文字/多邊
        canvasObject.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.objid,
                    objectName: this.objectName,
                    blockType: this.blockType,
                    srcId:this.srcId,
                    addressId:this.addressId
                })
            }
        })(canvasObject.toObject)
        canvasObject.set("id",id == null ? this.objid++ : id)
        canvasObject.set("objectName",objectname !== null ? objectname : this.objectName == '' ?  
        (new Date()).getTime() : this.objectName) //+'_'+ (new Date()).getTime()
        canvasObject.set("blockType",blocktype == null ? this.blockType : blocktype)
        canvasObject.set("srcId",srcId == null ? '' : srcId)
        canvasObject.set("addressId",addressId == null ? '' : addressId)
    },
    sendAllobj(){ //傳給父元件：貼上/初始化物件/圖例/矩形/文字/多邊
      this.saveCanvasState()
      this.$emit('sendObjectListToLayer',this.canvas.getObjects())
    },
    saveCanvasState(){ //儲存畫布狀態：物件有編輯/物件刪除/傳給父元件(貼上/初始化物件/圖例/矩形/文字/多邊)
      if(JSON.stringify(this.canvas.toJSON()) === JSON.stringify(this.state)) return  
      this.undo.push(this.state)
      this.state = this.canvas.toJSON()
      this.redo = []
    },
    isEditChange(val){ //是否編輯圖控：貼上/上一步/下一步/新增物件(圖例/矩形/文字/多邊)/屬性修改
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
      this.$emit('sendFloorGraphicFile',currState,this.updateArray)
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
              _clipboard.srcId,'') 
            })
            clonedObj.setCoords()
          } else {
            canvas.add(clonedObj)
            self.addCustomize(clonedObj,null,_clipboard.objectName,_clipboard.blockType,
            _clipboard.srcId,'')  
          }
          _clipboard.top += 10
          _clipboard.left += 10
          canvas.setActiveObject(clonedObj)
          canvas.requestRenderAll()
          self.sendAllobj()
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
        this.$emit('sendObjectRedoUndoToLayer',this.canvas.getObjects())
        this.isEditChange(true)
      })
    },
    doRedo () { //下一步
      if (this.redo.length === 0) {
        this.$message.error('目前沒有動作可復原')
        return
      }
      let lastJSON = this.redo.pop()
      this.canvas.loadFromJSON(lastJSON, () => {
        this.undo.push(this.state)
        this.state = lastJSON
        this.$emit('sendObjectRedoUndoToLayer',this.canvas.getObjects())
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

  .canvasdiv{
    width: 1500px;
    margin: auto;
    text-align: center;
    margin-top: 10px;
  }

  canvas {  
    border: 1px dashed black;
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