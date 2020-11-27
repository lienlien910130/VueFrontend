
<template>
  <div class="maintenancePlanAdd">
    <el-row :gutter="32" class="row">
      
      <el-col :xs="24" :sm="24" :md="24" :lg="24"
      
      >
        <div>
          <el-form :inline="true"  class="form-inline">
                <el-form-item label="工具列">
                  <div class="draw-btn-group">
                  <div :class="{active:drawType==''}" @click="drawTypeChange('')">
                    <i class="draw-icon icon-mouse"></i>
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
                  <!-- <div @click="save">
                    <i class="draw-icon icon-save"></i>
                  </div> -->
                  <div @click="deleteObj">
                    <i class="draw-icon icon-delete"></i>
                  </div>
                </div>  
                </el-form-item>
                <el-form-item label="圖層標題">
                  <el-input v-model="objectname"  placeholder="請輸入標題" @input="textchange"></el-input>
                </el-form-item>
                <el-form-item label="區塊類型">
                   <el-select v-model="blocktype" placeholder="請選擇">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="字體大小">
                  <el-input-number v-model="fontsize" controls-position="right" :min="8" :max="72"></el-input-number>
                </el-form-item>
                <el-form-item label="字體顏色">
                  <el-color-picker v-model="fontcolor" 
                  show-alpha 
                  :predefine="predefineColors"></el-color-picker>
                </el-form-item>
                <el-form-item label="透明度">
                  <el-input-number v-model="opacity" controls-position="right" :min="0" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="填充顏色">
                  <el-color-picker v-model="fillcolor" 
                  show-alpha 
                  :predefine="predefineColors"></el-color-picker>
                </el-form-item>
                <el-form-item label="邊框顏色">
                  <el-color-picker v-model="strokecolor" 
                  show-alpha 
                  :predefine="predefineColors"></el-color-picker>
                </el-form-item>
                <el-form-item label="邊框線條">
                  <el-select v-model="strokeDash"  placeholder="請選擇">
                    <el-option label="無邊框" value="-1"></el-option>
                    <el-option label="實心線" value="0"></el-option>
                    <el-option label="虛線" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邊框線條寬度">
                  <el-input-number v-model="strokeWidth" controls-position="right" :min="0" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="sendObj">廣播</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="openimages">開啟圖例</el-button>
                </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div ref="canvasdiv" class="canvasdiv" >
          <canvas id="canvas"></canvas>
        </div>
      </el-col>
    </el-row>

    <el-dialog 
    
    :visible.sync="dialogTableVisible" 
    title="圖例" 
    @dragDialog="handleDrag"
    :modal="false"
    :close-on-click-modal="false"
    class="dialog"
    style="width:230px"
    width="230px"
    top="0px">
      
            <div class="collapse-wrapper">
                <EquipmentType v-on="equipmentTypeEvent">
                </EquipmentType>
              </div>
      
    </el-dialog>

  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import elDragDialog from '@/directive/el-drag-dialog' 


export default {
  name: "App",
  props:['deleteObject','selectObject','reset','title','saveimg','deletesuccess'],
  directives: { elDragDialog },
  components:{
    EquipmentType: () => import('../../views/graphic/components/EquipmentType.vue'),
  },
  computed: {
      ...mapGetters([
        'json'
    ]),
    getWsMsg() {
        return this.$store.state.websocket.msg
    },
    equipmentTypeEvent(){
        return{
          subDragOption: this.handleDragOption,
          subSelectionOption : this.handleSelectionOption
        }
    }
  },
  data() {
    return {
      drawType: '', //選取的類別
      objectname:'', //圖層標題
      fontsize:'14', //字體大小
      fontcolor:'rgba(255, 0, 0, 1)',//字體顏色
      opacity:50, //透明度
      fillcolor:'rgba(197, 195, 195, 1)', //填充顏色
      strokecolor:'rgb(0, 0, 0)', //邊框顏色
      strokeDash:'0', //顯示在邊框select的對應值
      strokedash:[0,0],
      strokeWidth:1, //邊框寬度
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
      drawingObject: null, //当前绘制对象
      moveCount: 1, //绘制移动计数器
      doDrawing: false, // 绘制状态
      textbox: null,
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
      previousEvent:'', //移動畫布所需
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

      clipboard:null,
      drawer:false,
      dialogTableVisible:false,
      movingImage:null,
      imgDragOffset:{offsetX: 0,offsetY: 0},

      options: [{
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
      blocktype: '',
      id:0
    }
  },
  watch: {
    title(){
      this.canvastojson()
    },
    saveimg(val){
      if(val == true){
        this.save()
      }
    },
    reset(val){
      if(val == true){
        this.resetCanvas()
      }
    },
    selectObject(){
      if(this.selectObject !== null){
        this.canvas.discardActiveObject()
        this.canvas.setActiveObject(this.selectObject)
        this.objectname = this.selectObject.name
        this.canvas.renderAll()
      }
    },
    deleteObject(){
      if(this.deleteObject !== null){
        this.canvas.remove(this.deleteObject)
        this.$emit('subResetDeleteOption')
        this.canvas.renderAll()
      }
    },
    deletesuccess(){
      if(this.deletesuccess !== null){
         this.deletesuccess.forEach(obj => {
          this.canvas.remove(obj)
        })
        this.$emit('subResetDeleteOption')
      }
    },
    getWsMsg: function (data, val) {
        console.log('getWsMsg=>'+JSON.stringify(JSON.parse(JSON.parse(JSON.parse(data)).content).target))
        var target = JSON.parse(JSON.parse(JSON.parse(data)).content).target
        var canvasObject = null
        switch(target.type){
            
            case 'path': //rect
                canvasObject = new fabric.Path(target.path, {
                    left: target.left,
                    top: target.top,
                    stroke: target.stroke,
                    strokeWidth: target.strokeWidth,
                    fill: target.fill,
                    opacity: target.opacity
                })
                break
            case 'text':
                // canvasObject = new fabric.Textbox("", {
                //     left: mouseFrom.x,
                //     top: mouseFrom.y - 10,
                //     // width: 150,
                //     fontSize: 16,
                //     borderColor: this.strokecolor,
                //     fill: this.fillcolor,
                //     opacity:this.opacity
                // })
                break
            case 'polygon':
                break

        }
        
        this.canvas.add(canvasObject)
    },
    fontsize(){
      if(this.textbox !== null){
        var index = this.canvas.getObjects().indexOf(this.textbox)
        var items = this.canvas.getObjects()
        items[index].set({ fontSize: this.fontsize })
      }
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') === 'textbox'){
          this.canvas.getActiveObject().set({ fontSize: this.fontsize })
        }
      }
      this.canvas.renderAll()
    },
    fontcolor(){
      if(this.textbox !== null){
        var index = this.canvas.getObjects().indexOf(this.textbox)
        var items = this.canvas.getObjects()
        items[index].set({ fill: this.fontcolor })
      }
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') === 'textbox'){
          this.canvas.getActiveObject().set({ fill: this.fontcolor })
        }
      }
      this.canvas.renderAll()
    },
    opacity(){
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') !== 'textbox'){
          this.canvas.getActiveObject().set({ opacity:this.opacity/100 })
        }
      }
      this.canvas.renderAll()
    },
    strokeWidth(val){  
      if(val == '0'){
          this.strokeDash = '-1'
          this.strokedash = null
      }else{
          this.strokeDash = this.strokeDash !== '-1' ?  this.strokeDash : '0'
          this.strokedash =  this.strokedash !== null ?  this.strokedash : [0,0]
      }
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') !== 'textbox'){
          this.canvas.getActiveObject().set({ 
          strokeWidth:this.strokeWidth , strokeDashArray:this.strokedash })
        }
      }
      this.canvas.renderAll()
    },
    strokeDash(val){
      switch(val){
        case '-1': //無邊框
          this.strokedash = null
          this.strokeWidth = 0
          break;
        case '0': //實心線
          this.strokedash = [0,0]
          this.strokeWidth = this.strokeWidth !== 0 ? this.strokeWidth : 1
          break;
        case '1': //虛線
          this.strokedash = [5,10]
          this.strokeWidth = this.strokeWidth !== 0 ? this.strokeWidth : 1
      }
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') !== 'textbox'){
          this.canvas.getActiveObject().set({ 
          strokeWidth:this.strokeWidth , strokeDashArray:this.strokedash })
        }
      }
      this.canvas.renderAll()
    },
    fillcolor(val){
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') !== 'textbox'){
          this.canvas.getActiveObject().set({ fill: this.fillcolor })
        }
      }
      this.canvas.renderAll()
    },
    strokecolor(val){
      if(this.canvas.getActiveObject() !== undefined ){
        if(this.canvas.getActiveObject().get('type') !== 'textbox'){
          this.canvas.getActiveObject().set({ stroke: this.strokecolor })
        }else{
          this.canvas.getActiveObject().set({ borderColor: this.strokecolor })
        }
      }
      this.canvas.renderAll()
    },
    blocktype(val){
      if(this.canvas.getActiveObject() !== undefined ){
        this.canvas.getActiveObject().set("blocktype",this.blocktype)
      }
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas")
    this.canvas.loadFromJSON(this.$store.state.graphic.json, () => {
      this.canvas.renderAll()
    })
    //this.$refs.canvasdiv.clientWidth
    this.canvas.setWidth(1550)
    this.canvas.setHeight(800)

    fabric.Image.fromURL(require("../../assets/image/5F_MAP.jpg"), (img) => {
        img.set({
        scaleX: this.canvas.width / img.width,
        scaleY: this.canvas.height / img.height,
        })
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas))
        this.canvas.renderAll()
    })
    //this.canvas.selectionColor = 'rgba(0,255,0,0.3)'
    //this.canvas.selectionColor = "rgba(0,0,0,0.3)"
    this.canvas.selectionBorderColor ="red"
    this.canvas.selectionLineWidth = 2
    this.canvas.selectionDashArray = [5, 5]
    this.canvas.on("drop", this.drop)
    this.canvas.on("mouse:down", this.mousedown)
    this.canvas.on("mouse:move", this.mousemove)
    this.canvas.on("mouse:up", this.mouseup)
    this.canvas.on("selection:created", this.selectioncreatedandupdated)
    this.canvas.on("selection:updated", this.selectioncreatedandupdated)
    this.canvas.on("selection:cleared", this.selectioncleared)
    //this.canvas.on("mouse:wheel",this.mousewheel)
    this.canvas.on("object:moving",(e) => {
        this.canvas.selection = false
        //this.objectaction(e,'moving')
    })
    // this.canvas.on('object:modified', (e) => {
    //   this.setAnimate(e.target)
    // })
    // delete insert
    // ctrl+c ctrl+v ctrl+z
    // alt+q alt+w
    // alt+s alt+t alt+r alr+a
    document.onkeydown = async(e) => {
      if (e.keyCode == 46) {
        await this.deleteObj()
      }
      if (e.keyCode == 45) {
        this.save()
      }
      if(e.keyCode == 67 && e.ctrlKey){
        this.copy()
      }
      if(e.keyCode == 86 && e.ctrlKey){
        this.paste()
      }
      if(e.keyCode == 90 && e.ctrlKey){
        
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
    // var originalRender = fabric.Textbox.prototype._render;
    // fabric.Textbox.prototype._render = function(ctx) {
    //   originalRender.call(this, ctx);
    //   //Don't draw border if it is active(selected/ editing mode)
    //   if (this.active) return;
    //   if(this.showTextBoxBorder){
    //     var w = this.width,
    //       h = this.height,
    //       x = -this.width / 2,
    //       y = -this.height / 2;
    //     ctx.beginPath();
    //     ctx.moveTo(x, y);
    //     ctx.lineTo(x + w, y);
    //     ctx.lineTo(x + w, y + h);
    //     ctx.lineTo(x, y + h);
    //     ctx.lineTo(x, y);
    //     ctx.closePath();
    //     var stroke = ctx.strokeStyle;
    //     ctx.strokeStyle = this.textboxBorderColor;
    //     ctx.stroke();
    //     ctx.strokeStyle = stroke;
    //   }
    // }
    // fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');
  },
  methods: {
   selectioncreatedandupdated(e){
      console.log('selectioncreatedandupdated')
      this.objectname = e.target.name
      var items = this.canvas.getActiveObjects()
      items.forEach(item=>{
        item.set({borderColor:'#fbb802',
        cornerColor:'#fbb802',cornerSize: 18,transparentCorners: false})
        
      })
      this.$emit('subObjectSelectOption',items)
    },
    selectioncleared(e){
      console.log('selectioncleared')
      this.objectname = ""
      this.$emit('subObjectSelectOption',null)
      this.$emit('subResetSelectOption')
    },
    async drawTypeChange(e) { //切換繪圖類別
      if(this.drawType == 'text' && this.textbox !== null){
        this.textbox.exitEditing() //關閉文字框編輯
        await this.deleteblankTextobj() 
        this.textbox = null
      }
      if(e == "polygon"){
        this.polygonMode = true
        this.pointArray = new Array()
        this.lineArray = new Array()
      }
      this.drawType = e
      this.canvas.isDrawingMode = false
    },
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
    mousewheel(e){ //放大縮小
      this.zoom = (e.key.toLowerCase() =="q" ? 0.1 : -0.1) + this.canvas.getZoom()
      this.zoom = Math.max(0.5, this.zoom)
      this.zoom = Math.min(3, this.zoom)
      const center = this.canvas.getCenter()
      this.zoomPoint = new fabric.Point(center.left, center.top)
      this.canvas.zoomToPoint(this.zoomPoint, this.zoom)
      this.resetOriginAfterZoom()
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
    mousedown(e) { 
      this.mouseFrom.x = this.getX(e)
      this.mouseFrom.y = this.getY(e)
      this.doDrawing = true
      if(this.canvas.getActiveObject() == null && this.movingImage !== null && this.drawType == ""){ //可以點選圖片新增
        this.drop(e)
      }else if(e.e.altKey && this.drawType == ""){ //移動畫布
        this.panning = true
        this.canvas.selection = false
        this.lastMovePos.x = e.e.clientX
        this.lastMovePos.y = e.e.clientY
      }

      if (this.drawType == "text") { 
        this.drawing()
      }
      if (this.drawType == "polygon") {
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
        if (this.moveCount % 2 && !this.doDrawing) { //減少繪製頻率
          return
        }
        if (this.canvas.getActiveObjects().length === 0 && //移動畫布
         this.panning && e && e.e) {
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
      if(this.drawingObject !== null){
        //this.objectaction(e,'added') //廣播新增
      }
      this.drawingObject = null
      this.moveCount = 1
      this.panning = false
      this.canvas.selection = true
      if (this.drawType != "polygon") {
        this.doDrawing = false
        this.sendAllobj()
      }
    },
    drop(e){ //拖曳圖片近來觸發
      const image = new fabric.Image(this.movingImage, {
        width: this.movingImage.naturalWidth,
        height: this.movingImage.naturalHeight,
        scaleX: 0.1,
        scaleY: 0.1,
        top: this.getY(e) - this.imgDragOffset.offsetY*0.05,
        left: this.getX(e) - this.imgDragOffset.offsetX*0.05
      })
      
      this.canvas.add(image)
      this.addCustomize(image,this.movingImage.alt)
      this.sendAllobj()
    },
    resetCanvas(){ //重置
      this.canvas.setZoom(1)
      this.canvas.absolutePan(
          new fabric.Point(0, 0)
      )
      this.lastzoom= 1
      this.zoomPoint= new fabric.Point(0, 0)
      this.relativeMouseX = 0
      this.relativeMouseY = 0
      this.lastzoomPoint= { x: 0, y: 0 }
      this.lastmousePoint= { x: 0, y: 0 } 
      this.resetOriginAfterZoom()
      this.$emit('subResetOption',false)
    },
    drawing() {
      if(this.canvas.getActiveObjects().length === 0){
          if (this.drawingObject !== null) {
            this.canvas.remove(this.drawingObject)
          }
            var canvasObject = null
            var left = this.mouseFrom.x,
                top = this.mouseFrom.y,
                mouseFrom = this.mouseFrom,
                mouseTo = this.mouseTo;
            switch (this.drawType) {
                case "rectangle": //长方形
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
                      strokeDashArray:this.strokedash
                  })
                break;
                case "text": //文本框
                  this.textbox = new fabric.Textbox("", {
                      left: this.mouseFrom.x,
                      top: this.mouseFrom.y,
                      fontSize: this.fontsize,
                      borderColor: this.strokecolor,
                      fill: this.fontcolor, //字體顏色
                      opacity:this.opacity,
                      editingBorderColor: 'blue'
                  })
                  
                  this.canvas.add(this.textbox)
                  this.textbox.enterEditing()
                  this.textbox.hiddenTextarea.focus()
                  this.addCustomize(this.textbox,this.objectname)
                 
                break
                default:
                break
            }
            if (canvasObject) {
              this.canvas.add(canvasObject)
              this.drawingObject = canvasObject
              this.addCustomize(canvasObject,this.objectname)
            }
      }
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
      this.canvas.remove(this.activeShape).remove(this.activeLine);
      var polygon = new fabric.Polygon(points, {
        stroke: this.strokecolor,
        strokeWidth: this.strokeWidth,
        fill: this.fillcolor,
        opacity: this.opacity/100,
        hasBorders: true,
        strokeDashArray: this.strokedash
      })
      this.canvas.add(polygon)
      this.addCustomize(polygon,this.objectname)
      this.sendAllobj()
      this.drawingObject = polygon
      this.activeLine = null
      this.activeShape = null
      this.polygonMode = false
      this.doDrawing = false
      this.drawType = null
    },
    async deleteObj() { //刪除物件
      var item = this.canvas.getActiveObjects()
      await this.$emit('subObjectDeleteOption',item)
    },
    async deleteblankTextobj(){ //刪除空白文字的物件
      let _temp = this.canvas.getObjects().filter((item, index) =>
        item.text == "" && item.type == "textbox"
      )
      await this.$emit('subObjectDeleteOption',_temp)
    },
    addCustomize(canvasObject,name){ //新增客製化元素
        canvasObject.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id,
                    name: this.name,
                    blocktype: this.blocktype
                })
            }
        })(canvasObject.toObject)
        canvasObject.set("id",this.id++)
        canvasObject.set("name",name) //+'_'+ (new Date()).getTime()
        canvasObject.set("blocktype",this.blocktype == '' ? '' : this.blocktype)
    },
    sendAllobj(){ //傳給父元件
      this.$emit('subObjectListOption',this.canvas.getObjects())
    },
    textchange(){ //標題修改
      if(this.canvas.getActiveObject()){
        this.canvas.getActiveObject().set({ name: this.objectname })
        this.sendAllobj()
      }
    },
    save() { //儲存圖片
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
        this.$emit('subSaveOption',false)
    },
    canvastojson(){
      var currState = this.canvas.toJSON()
      this.$store.dispatch('graphic/sendJson',currState)
      this.$emit('subJsonOption',currState)
    },
    copy(){ //複製圖片
      var object = fabric.util.object.clone(this.canvas.getActiveObject());
      this.clipboard = object;
    },
    paste(){ //貼上圖片
    var canvas = this.canvas
    var _clipboard = this.clipboard
    var objname = this.objectname
    var self = this
    console.log('paste',_clipboard)
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
            if(_clipboard.type === 'image'){
              self.addCustomize(obj,_clipboard.name)  
            }else{
              self.addCustomize(obj,objname)
            }
          });
          clonedObj.setCoords()
        } else {
          canvas.add(clonedObj)
          if(_clipboard.type === 'image'){
            self.addCustomize(clonedObj,_clipboard.name)  
          }else{
            self.addCustomize(clonedObj,objname)
          }
        }
        _clipboard.top += 10
        _clipboard.left += 10
        canvas.setActiveObject(clonedObj)
        canvas.requestRenderAll()
        self.sendAllobj()
      })
    },

    objectaction(e,action){ //封裝廣播內容
        var change = []
        var id = ''
        switch(action){
            case 'added':
                id = e.target.id
                change = e
                break
            case 'moving':
                id = e.target.id
                change = [ 
                    e.transform.original.left,
                    e.transform.original.top,
                    e.transform.target.left,
                    e.transform.target.top
                ]
                break
            case 'removed':
                id = e.id
                change = e
                break  
        }
        this.sendObj(id,action,change)
    },
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
    
    setAnimate(obj){
        obj.animate('opacity', obj.opacity === 0.5 ? 1 : 0.5, {
            duration: 1000,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => this.setAnimate(obj),
            easing: fabric.util.ease.easeInCubic
        })
    },

    openimages(){
      this.dialogTableVisible = true
    },
    handleDrag() {
      console.log('drag')
    },
    handleDragOption(e){
        if(e !== null){
          this.imgDragOffset.offsetX = e.offsetX
          this.imgDragOffset.offsetY = e.offsetY
          this.movingImage = e.target
        }else{
          this.movingImage = null
        }
    },
    handleSelectionOption(content){
      console.log('content'+content)
      this.canvas.forEachObject(function(object){ 
            object.selectable = content
      });
    }
  },
  
};
</script>

<style lang="scss" scoped>
.form-inline{
  margin-top: 5px;
}
.maintenancePlanAdd{
  width: 100%;
  height: 100%;
  .canvasdiv{
    width: 1550px;
    margin: auto;
    text-align: center;
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
  margin-bottom: 0px;
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
    i {
      display: flex;
      background-repeat: no-repeat;
      background-size: 80%;
      background-position: 50% 50%;
      height: 30px;
      width: 30px;
    }
    // .icon-1 {
    //   background-image: url("../../assets/icons/draw/1.png");
    // }
    // .icon-pentagram {
    //   background-image: url("../../assets/icons/draw/pentagram.png");
    // }
    // .icon-2 {
    //   background-image: url("../../assets/icons/draw/2.png");
    // }
    // .icon-3 {
    //   background-image: url("../../assets/icons/draw/3.png");
    // }
    // .icon-4 {
    //   background-image: url("../../assets/icons/draw/4.png");
    //   background-size: 75%;
    // }
    // .icon-5 {
    //   background-image: url("../../assets/icons/draw/5.png");
    //   background-size: 70%;
    // }
    // .icon-6 {
    //   background-image: url("../../assets/icons/draw/6.png");
    // }
    // .icon-7 {
    //   background-image: url("../../assets/icons/draw/7.png");
    //   background-size: 80%;
    // }
    // .icon-del {
    //   background-image: url("../../assets/icons/draw/del.png");
    //   background-size: 90%;
    // }
    // .icon-img {
    //   background-image: url("../../assets/icons/draw/img.png");
    //   background-size: 80%;
    // }
    // .icon-back {
    //   background-image: url("../../assets/icons/draw/back.png");
    //   background-size: 75%;
    // }
    // .icon-save {
    //   background-image: url("../../assets/icons/draw/save.png");
    //   background-size: 80%;
    // }
    // .icon-mouse {
    //   background-image: url("../../assets/icons/draw/mouse.png");
    //   background-size: 60%;
    // }
  }
  .active {
    background: rgb(194, 193, 193);
  }
}
</style>