<template>
  <div class="maintenancePlanAdd">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div>
              <el-form :inline="true"  class="form-inline">
                <el-form-item label="工具列">
                  <div class="draw-btn-group">
                  <div :class="{active:drawType==''}" @click="drawTypeChange('')">
                    <i class="draw-icon icon-mouse"></i>
                  </div>
                  <div :class="{active:drawType=='text'}" @click="drawTypeChange('text')">
                    <i class="draw-icon icon-2"></i>
                  </div>
                  <div :class="{active:drawType=='rectangle'}" @click="drawTypeChange('rectangle')">
                    <i class="draw-icon icon-4"></i>
                  </div>
                  <div :class="{active:drawType=='polygon'}" @click="drawTypeChange('polygon')">
                    <i class="draw-icon icon-6"></i>
                  </div>
                  <div @click="save">
                    <i class="draw-icon icon-save"></i>
                  </div>
                  <div @click="deleteObj">
                    <i class="el-icon-delete"></i>
                  </div>
                </div>  
                </el-form-item>
                <el-form-item label="圖層標題">
                  <el-input v-model="objectname"  placeholder="請輸入標題"></el-input>
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
              </el-form>
            </div>
            <div>
              <el-form :inline="true"  class="form-inline">
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
                    <el-option label="無邊框" value="[0,0]"></el-option>
                    <el-option label="實心線" value="[1,1]"></el-option>
                    <el-option label="短虛線" value="[5,5]"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邊框線條寬度">
                  <el-input-number v-model="strokeWidth" controls-position="right" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="sendObj">sendObj</el-button>
                </el-form-item>
              </el-form>
            </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <div ref="canvasdiv" class="canvasdiv">
            <canvas id="canvas"></canvas>
          </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "App",
  props:['movingImage','imgDragOffset'],
  computed: {
    getWsMsg() {
        return this.$store.state.websocket.msg
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
      strokeDash:[0,0], //邊框
      strokeWidth:1, //邊框寬度

      panning:false, //移動畫布
      previousEvent:'', //移動畫布所需

      canvas: {},
      x: "",
      y: "",
      
      mouseFrom: {},
      mouseTo: {},
      zoom: window.zoom ? window.zoom : 1,
      zoomPoint: new fabric.Point(0, 0), //初始时缩放原点的位置设为（0,0），这是页面的左上顶点
      lastzoomPoint: { x: 0, y: 0 }, //初始时，前一次缩放原点同样为(0,0)
      lastmousePoint: { x: 0, y: 0 }, //进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
      lastzoom: 1, //表示为上一次的缩放倍数，此刻设为1
      relativeMouseX: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
      relativeMouseY: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
      
      canvasObjectIndex: 0,
      textbox: null,
      rectangleLabel: "warning",
      drawWidth: 3, //笔触宽度
      
      drawingObject: null, //当前绘制对象
      moveCount: 1, //绘制移动计数器
      doDrawing: false, // 绘制状态
      //polygon 相关参数
      polygonMode: false,
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: "",
      line: {},

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
      
      copiedObjects:[],
    };
  },
  watch: {
    drawType() {
        this.canvas.selection = !this.drawType;
    },
    getWsMsg: function (data, val) {
        console.log('getWsMsg=>'+JSON.stringify(JSON.parse(JSON.parse(JSON.parse(data)).content).target))
        var target = JSON.parse(JSON.parse(JSON.parse(data)).content).target
        var canvasObject = null
        switch(target.type){
            case 'ellipse':
                canvasObject = new fabric.Ellipse({
                    left: target.left,
                    top: target.top,
                    stroke: target.stroke,
                    fill: target.fill,
                    originX: target.originX,
                    originY: target.originY,
                    rx: target.rx,
                    ry: target.ry,
                    strokeWidth: target.strokeWidth,
                    opacity: target.opacity
                });
                break;
            case 'path': //rect
                canvasObject = new fabric.Path(target.path, {
                    left: target.left,
                    top: target.top,
                    stroke: target.stroke,
                    strokeWidth: target.strokeWidth,
                    fill: target.fill,
                    opacity: target.opacity
                });
                break;
            case 'text':
                // canvasObject = new fabric.Textbox("", {
                //     left: mouseFrom.x,
                //     top: mouseFrom.y - 10,
                //     // width: 150,
                //     fontSize: 16,
                //     borderColor: this.strokecolor,
                //     fill: this.fillcolor,
                //     opacity:this.opacity
                // });
                break;
            case 'pen':
                break;
            case 'polygon':
                break;

        }
        
        this.canvas.add(canvasObject)
    },
    fontsize(){
      if(this.canvas.getActiveObject()){
        this.canvas.getActiveObject().set({ opacity:this.opacity })
      }
    },
    opacity(){
        if(this.canvas.getActiveObject()){
            this.canvas.getActiveObject().set({ opacity:this.opacity })
        }
    },
    strokeWidth(){
        if(this.canvas.getActiveObject()){
            this.canvas.getActiveObject().set({ stroke:this.strokeWidth })
        }
    },
    strokeDash(){
      console.log('strokeDash=>'+this.strokeDash)
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");
    this.canvas.setWidth(this.$refs.canvasdiv.clientWidth)
    this.canvas.setHeight(600)

    fabric.Image.fromURL(require("../../assets/image/5F_MAP.jpg"), (img) => {
        img.set({
        // 通過scale來設定圖片大小，這裡設定和畫布一樣大
        scaleX: this.canvas.width / img.width,
        scaleY: this.canvas.height / img.height,
        });
        // 設定背景
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
        this.canvas.renderAll();
    });
    this.canvas.selectionColor = "rgba(0,0,0,0.3)"
    this.canvas.selectionBorderColor ="black"
    this.canvas.selectionDashArray = [5, 5]
    this.canvas.on("drop", this.drop)
    this.canvas.on("mouse:down", this.mousedown)
    this.canvas.on("mouse:move", this.mousemove)
    this.canvas.on("mouse:up", this.mouseup)
    this.canvas.on("mouse:wheel",this.mousewheel)
    this.canvas.on("object:moving",(e) => {
        this.canvas.selection = false
        this.objectaction(e,'moving')
    })
    this.canvas.on('object:modified', (e) => {
      
        //this.setAnimate(e.target)
    })
    
    document.onkeydown = e => {
      let key = window.event.keyCode;
      if (e.keyCode == 46) {
        this.deleteObj();
      }
      if(e.keyCode == 67 && e.ctrlKey){
          this.copy()
      }
      if(e.keyCode == 86 && e.ctrlKey){
          this.paste()
      }
    }
  },
  methods: {
    drawTypeChange(e) { //切換繪圖類別
      if(this.drawType == 'text'){
        this.textbox.exitEditing() //關閉文字框編輯
      }
      if(e == "polygon"){
        this.polygonMode = true;
        this.pointArray = new Array();
        this.lineArray = new Array();
      }
      this.drawType = e;
      this.canvas.isDrawingMode = false;
    },
    mousewheel(e){ //放大縮小
        this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.canvas.getZoom();
        this.zoom = Math.max(0.5, this.zoom); 
        this.zoom = Math.min(3, this.zoom); 
        this.zoomPoint = new fabric.Point(event.pageX, event.pageY);
        this.canvas.zoomToPoint(this.zoomPoint, this.zoom);
        this.resetOriginAfterZoom()
    },
    mousedown(e) { 
      this.mouseFrom.x = this.getX(e)
      this.mouseFrom.y = this.getY(e)
      this.doDrawing = true;
        if(e.e.altKey) { //移動畫布
          this.panning = true;
          this.canvas.selection = false;
        }
        if (this.drawType == "text") { 
          this.drawing();
        }
        if (this.drawType == "polygon") {
          try {
            if (this.pointArray.length > 1) {
              if (e.target && e.target.id == this.pointArray[0].id) {
                this.generatePolygon();//最後一個點
              }
            }
            if (this.polygonMode) {
              this.addPoint(e);
            }
          } catch (error) {
            console.log(error);
          }
      }
    },
    mousemove(e) {
        if (this.moveCount % 2 && !this.doDrawing) { //減少繪製頻率
          return;
        }
        if (this.canvas.getActiveObjects().length === 0 && this.drawType === '' && //移動畫布
         this.panning && e && e.e) {
            var x = e.e.movementX;
            var y = e.e.movementY;
            if(!x) {
                x = e.e.screenX - this.previousEvent.e.screenX;
                y = e.e.screenY - this.previousEvent.e.screenY;
            }
            var delta = new fabric.Point(x, y);
            this.canvas.relativePan(delta);
            this.relativeMouseX += e.e.movementX //累计每一次移动时候的偏差
            this.relativeMouseY += e.e.movementY
        }
        this.previousEvent = e
        this.moveCount++;
        this.mouseTo.x = this.getX(e)
        this.mouseTo.y = this.getY(e)
        if (this.drawType == "rectangle") {
          this.drawing();
        }
        if (this.drawType == "polygon") {
          if (this.activeLine && this.activeLine.class == "line") {
            var pointer = this.canvas.getPointer(e.e);
            this.activeLine.set({ x2: pointer.x, y2: pointer.y });
            var points = this.activeShape.get("points");
            points[this.pointArray.length] = {
              x: pointer.x,
              y: pointer.y,
              zIndex: 1
            };
            this.activeShape.set({
              points: points
            });
            this.canvas.renderAll();
          }
          this.canvas.renderAll();
        }
    },
    mouseup(e) {
      this.mouseTo.x = this.getX(e)
      this.mouseTo.y = this.getY(e)
      if(this.drawingObject){
        this.objectaction(e,'added') //廣播新增
      }
      this.drawingObject = null;
      this.moveCount = 1;
      this.panning = false;
      this.canvas.selection = true;
      if (this.drawType != "polygon") {
        this.doDrawing = false;
        this.sendAllobj()
      }
    },
    drawing() {
      if(this.canvas.getActiveObjects().length === 0){
          if (this.drawingObject) {
            this.canvas.remove(this.drawingObject);
          }
            var canvasObject = null;
            var left = this.mouseFrom.x,
                top = this.mouseFrom.y,
                mouseFrom = this.mouseFrom,
                mouseTo = this.mouseTo;
            console.log(left,top,mouseFrom,mouseTo)
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
                      strokeWidth: this.drawWidth,
                      fill: this.fillcolor,
                      opacity:this.opacity,
                      strokeDashArray:this.strokeDash
                  });
                break;
                case "text": //文本框
                  this.textbox = new fabric.Textbox("", {
                      left: left,
                      top: top - 10,
                      fontSize: this.fontsize,
                      borderColor: this.strokecolor,
                      fill: this.fontcolor,
                      opacity:this.opacity
                  });
                  
                  this.canvas.add(this.textbox);
                  this.textbox.enterEditing();
                  this.textbox.hiddenTextarea.focus();
                break;
                default:
                break;
            }
            if (canvasObject) {
              this.canvas.add(canvasObject); 
              this.drawingObject = canvasObject;
              this.addCustomize(canvasObject)
            }
      }
    },
    addCustomize(canvasObject){
        canvasObject.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id,
                    name: this.name
                });
            };
        })(canvasObject.toObject);
        canvasObject.set("id",this.canvas.getObjects().indexOf(canvasObject))
        canvasObject.set("name",this.objectname +'_'+ (new Date()).getTime())
    },
    sendAllobj(){
      var item = this.canvas.getObjects()
      this.$emit('subSelectOption',item)
    },
    sendObj(id,type,content){
        const msg = {
            type: type,
            content: JSON.stringify(content),
            id:id
        }
        if (this.$socket.$ws && this.$socket.$ws.readyState == 1) {
            this.$socket.$ws.send(JSON.stringify(msg));
        }else{
            this.$socket.$ws
        }
    },
    getX(o) {
        console.log(o)
        return (
          this.lastzoomPoint.x +
          (o.pointer.x - this.zoomPoint.x - this.relativeMouseX) /
            this.canvas.getZoom()
        )
    },
    getY(o) {
        return (
          this.lastzoomPoint.y +
          (o.pointer.y - this.zoomPoint.y - this.relativeMouseY) /
            this.canvas.getZoom()
        )
    },
      // 缩放后重置原点
    resetOriginAfterZoom() {
        this.lastzoomPoint.x =
          this.lastzoomPoint.x +
          (this.zoomPoint.x - this.lastmousePoint.x - this.relativeMouseX) /
            this.lastzoom
        this.lastzoomPoint.y =
          this.lastzoomPoint.y +
          (this.zoomPoint.y - this.lastmousePoint.y - this.relativeMouseY) /
            this.lastzoom

        this.lastmousePoint.x = this.zoomPoint.x
        this.lastmousePoint.y = this.zoomPoint.y
        this.lastzoom = this.zoom

        this.tempmouseX = this.relativeMouseX
        this.tempmouseY = this.relativeMouseY
        this.relativeMouseX = 0
        this.relativeMouseY = 0
    },
    save() {
        console.log('save=>'+JSON.stringify(this.canvas.toObject()))
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
        var imgData = canvas.toDataURL('png');
        imgData = imgData.replace('image/png','image/octet-stream');
        var filename = 'drawingboard_' + (new Date()).getTime() + '.' + 'png'; // 下載後的檔名
        this.saveFile(imgData,filename);
    },
    saveFile(data, filename){
      var save_link = document.createElement('a');
      save_link.href = data;
      save_link.download = filename;
    
      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      save_link.dispatchEvent(event);
    },
    copy(){
        var _self = this;
        this.canvas.getActiveObject().clone(function(cloned){
            // let _clipboard = cloned;
              _self.paste(cloned);
        })
    },
    paste(_clipboard){
        _clipboard.clone(function(clonedObj) {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 20,
                top: clonedObj.top + 20,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject(function(obj) {
                    this.canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                this.canvas.add(clonedObj);
            }
            _clipboard.top += 20;
            _clipboard.left += 20;
            this.canvas.setActiveObject(clonedObj);
            // canvas.requestRenderAll();
        });
    },
    
    setAnimate(obj){
        obj.animate('opacity', obj.opacity === 0.5 ? 1 : 0.5, {
            duration: 1000,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => this.setAnimate(obj),
            easing: fabric.util.ease.easeInCubic
        });
    },
    
    
    
    
    drop(e){
      console.log(e)
      const {offsetX, offsetY} = e.e
      
      const image = new fabric.Image(this.movingImage, {
        width: this.movingImage.naturalWidth,
        height: this.movingImage.naturalHeight,
        scaleX: 0.1,
        scaleY: 0.1,
        top: offsetY - this.imgDragOffset.offsetY*0.1,
        left: offsetX - this.imgDragOffset.offsetX*0.1
        // top: this.mouseFrom.y - this.imgDragOffset.offsetY, // 计算起始位置
        // left: this.mouseFrom.x - this.imgDragOffset.offsetX
      })
      console.log(this.getX(e))
      console.log(offsetY,this.imgDragOffset.offsetY,image.top)
      console.log(offsetX,this.imgDragOffset.offsetX,image.left)
      this.canvas.add(image)
    },
    objectaction(e,action){
        var change = []
        var id = ''
        switch(action){
            case 'added':
                id = e.target.id
                change = e
                break;
            case 'moving':
                id = e.target.id
                change = [ 
                    e.transform.original.left,
                    e.transform.original.top,
                    e.transform.target.left,
                    e.transform.target.top
                ]
                break;  
            case 'removed':
                id = e.id
                change = e
                break;   
        }
        this.sendObj(id,action,change)
    },
    deleteObj() {
      this.canvas.getActiveObjects().map(item => {
          this.canvas.remove(item);
          this.objectaction(item,'removed')
      })
      this.sendAllobj()
    },
    
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / 1, y: mouseY / 1 };
    },
    
    addPoint(e) {
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
      });
      if (this.pointArray.length == 0) {
        circle.set({
          fill: "red"
        });
      }
      var points = [
        this.mouseFrom.x,
        this.mouseFrom.y,
        this.mouseFrom.x,
        this.mouseFrom.y
      ];
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
        strokeDashArray:this.strokeDash
      });
      if (this.activeShape) {
        var pos = this.canvas.getPointer(e.e);
        var points = this.activeShape.get("points");
        points.push({
          x: pos.x,
          y: pos.y
        });
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
        });
        this.canvas.remove(this.activeShape);
        this.canvas.add(polygon);
        this.activeShape = polygon;
        this.canvas.renderAll();
      } else {
        var polyPoint = [
          {
            x: this.mouseFrom.x,
            y: this.mouseFrom.y
          }
        ];
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
        });
        this.activeShape = polygon;
        this.canvas.add(polygon);
      }
      this.activeLine = this.line;
      this.pointArray.push(circle);
      this.lineArray.push(this.line);
      this.canvas.add(this.line);
      this.canvas.add(circle);
    },
    generatePolygon() {
      var points = new Array();
      this.pointArray.map((point, index) => { //移除點
        points.push({
          x: point.left,
          y: point.top
        });
        this.canvas.remove(point);
      });
      this.lineArray.map((line, index) => { //移除線
        this.canvas.remove(line);
      });
      this.canvas.remove(this.activeShape).remove(this.activeLine);
      var polygon = new fabric.Polygon(points, {
        stroke: this.strokecolor,
        strokeWidth: this.drawWidth,
        fill: this.fillcolor,
        opacity: this.opacity,
        hasBorders: true
      });
      this.canvas.add(polygon);
      this.addCustomize(polygon)
      this.sendAllobj()
      this.drawingObject = polygon
      this.activeLine = null;
      this.activeShape = null;
      this.polygonMode = false;
      this.doDrawing = false;
      this.drawType = null;
    },
    
    
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
    .icon-1 {
      background-image: url("../../assets/icons/draw/1.png");
    }
    .icon-pentagram {
      background-image: url("../../assets/icons/draw/pentagram.png");
    }
    .icon-2 {
      background-image: url("../../assets/icons/draw/2.png");
    }
    .icon-3 {
      background-image: url("../../assets/icons/draw/3.png");
    }
    .icon-4 {
      background-image: url("../../assets/icons/draw/4.png");
      background-size: 75%;
    }
    .icon-5 {
      background-image: url("../../assets/icons/draw/5.png");
      background-size: 70%;
    }
    .icon-6 {
      background-image: url("../../assets/icons/draw/6.png");
    }
    .icon-7 {
      background-image: url("../../assets/icons/draw/7.png");
      background-size: 80%;
    }
    .icon-del {
      background-image: url("../../assets/icons/draw/del.png");
      background-size: 90%;
    }
    .icon-img {
      background-image: url("../../assets/icons/draw/img.png");
      background-size: 80%;
    }
    .icon-back {
      background-image: url("../../assets/icons/draw/back.png");
      background-size: 75%;
    }
    .icon-save {
      background-image: url("../../assets/icons/draw/save.png");
      background-size: 80%;
    }
    .icon-mouse {
      background-image: url("../../assets/icons/draw/mouse.png");
      background-size: 60%;
    }
  }
  .active {
    background: rgb(194, 193, 193);
  }
}
</style>