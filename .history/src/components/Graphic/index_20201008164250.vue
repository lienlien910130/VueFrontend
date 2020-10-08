<template>
  <div class="maintenancePlanAdd">
    <div class="panel-body">
      <div class="demo">
        <div class="draw-btn-group">
          <div :class="{active:drawType==''}" @click="drawTypeChange('')">
            <i class="draw-icon icon-mouse"></i>
          </div>
          <!-- <div :class="{active:drawType=='arrow'}" @click="drawTypeChange('arrow')">
            <i class="draw-icon icon-1"></i>
          </div> -->
          <div :class="{active:drawType=='text'}" @click="drawTypeChange('text')">
            <i class="draw-icon icon-2"></i>
          </div>
          <div :class="{active:drawType=='ellipse'}" @click="drawTypeChange('ellipse')">
            <i class="draw-icon icon-3"></i>
          </div>
          <div :class="{active:drawType=='rectangle'}" @click="drawTypeChange('rectangle')">
            <i class="draw-icon icon-4"></i>
          </div>
          <!-- <div
            :class="{active:drawType=='rectangle-text'}"
            @click="drawTypeChange('rectangle-text')"
          >
            <i class="draw-icon icon-5"></i>
          </div> -->
          <div :class="{active:drawType=='polygon'}" @click="drawPolygon">
            <i class="draw-icon icon-6"></i>
          </div>
          <div :class="{active:drawType=='pen'}" @click="drawTypeChange('pen')">
            <i class="draw-icon icon-7"></i>
          </div>
          <!-- <div :class="{active:drawType=='pentagram'}" @click="drawTypeChange('pentagram')">
            <i class="draw-icon icon-pentagram"></i>
          </div> -->
          <div @click="save">
            <i class="draw-icon icon-save"></i>
          </div>
          <div @click="deleteObj">
            <i class="el-icon-delete"></i>
          </div>
          <el-color-picker v-model="fillcolor" 
          show-alpha 
          :predefine="predefineColors"></el-color-picker>
          <el-color-picker v-model="strokecolor" 
          show-alpha 
          :predefine="predefineColors"></el-color-picker>
          <el-input v-model="opacity"></el-input>
          <el-input v-model.number="drawWidth" type="number"></el-input>
          <el-input v-model="objectname" type="text"></el-input>
          <!-- <el-select v-model="strokeDash" default placeholder="">
                <el-option label="直線" value="[0,0]">直線</el-option>
                <el-option label="虛線" value="[3,3]">虛線</el-option>
            </el-select> -->
          <el-button @click="sendObj">sendObj</el-button>
        </div>

        <canvas id="canvas" :width="width" :height="height"></canvas>
      </div>
    </div>
    
    <img id="img" :src="imgSrc" />
    <img id="expImg" src="../../assets/icons/draw/exp.jpg" />
  </div>
</template>
<script>
export default {
  name: "App",
  computed: {
    getWsMsg() {
        return this.$store.state.websocket.msg
    }
  },
  data() {
    return {
        width:1280,
        height:720,
        rect: [],
        canvas: {},
        showMenu: false,
        x: "",
        y: "",
        opacity:1,
        mouseFrom: {},
        mouseTo: {},
        zoom: window.zoom ? window.zoom : 1,
        zoomPoint: new fabric.Point(0, 0), //初始时缩放原点的位置设为（0,0），这是页面的左上顶点
        lastzoomPoint: { x: 0, y: 0 }, //初始时，前一次缩放原点同样为(0,0)
        lastmousePoint: { x: 0, y: 0 }, //进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
        lastzoom: 1, //表示为上一次的缩放倍数，此刻设为1
        relativeMouseX: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
        relativeMouseY: 0, //表示相对的鼠标位移，用来记录画布的绝对移动距离
        drawType: '',
        canvasObjectIndex: 0,
        textbox: null,
        rectangleLabel: "warning",
        drawWidth: 3, //笔触宽度
        fillcolor:'rgb(255, 160, 57)',
        strokecolor:'rgba(6, 45, 218, 1)',
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
        imgFile: {},
        imgSrc: "",
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
        panning:false,
        previousEvent:'',
        copiedObjects:[],
        objectname:'',
        strokeDash:[0,0]
    };
  },
  watch: {
    drawType() {
        this.canvas.selection = !this.drawType;
    },
    width(){
        this.canvas.setWidth(this.width) 
    },
    height(){
        this.canvas.setHeight(this.height) 
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
    opacity(){
        if(this.canvas.getActiveObject()){
            this.canvas.getActiveObject().set({ opacity:this.opacity })
        }
    },
    drawWidth(){
        if(this.canvas.getActiveObject()){
            this.canvas.getActiveObject().set({ stroke:this.drawWidth })
        }
    },
    strokeDash(){
        console.log('strokeDash=>'+this.strokeDash)
    }
  },
  mounted:{
      //載入json
  },
  methods: {
      sendObj(id,type,content){
        const msg = {
            type: type,
            content: JSON.stringify(content),
            id:id
        }
        console.log('send=>'+JSON.stringify(msg))
        if (this.$socket.$ws && this.$socket.$ws.readyState == 1) {
            this.$socket.$ws.send(JSON.stringify(msg));
        }else{
            this.$socket.$ws
        }
      },
    getX(o) {
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
        console.log(JSON.stringify(a))
        var canvas = document.getElementById('canvas')
        var imgData = canvas.toDataURL('png');
        imgData = imgData.replace('image/png','image/octet-stream');
        // 下载后的问题名
        var filename = 'drawingboard_' + (new Date()).getTime() + '.' + 'png';
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
    drawTypeChange(e) {
      this.drawType = e;
      if (e == "pen") {
        this.canvas.isDrawingMode = true;
      } else {
        this.canvas.isDrawingMode = false;
      }
    },
    setAnimate(obj){
        obj.animate('opacity', obj.opacity === 0.5 ? 1 : 0.5, {
            duration: 1000,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => this.setAnimate(obj),
            easing: fabric.util.ease.easeInCubic
        });
    },
    mousedown(e) {
        var xy =e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
        //this.mouseFrom.x = xy.x;
        //this.mouseFrom.y = xy.y;
        this.mouseFrom.x = this.getX(e)
        this.mouseFrom.y = this.getY(e)
        this.doDrawing = true;
        if(e.e.altKey) {
          this.panning = true;
          this.canvas.selection = false;
        }
        if (this.drawType == "text") {
            this.drawing();
        }
        if (this.drawType == "rectangle-text") {
            this.textbox = new fabric.Textbox("", {
            left: this.mouseFrom.x,
            top: this.mouseFrom.y - 17,
            // width: 150,
            fontSize: 15,
            hasBorders: false,
            padding: 5,
            borderColor: this.strokecolor,
            fill: this.fillcolor,
            hasControls: false,
            textboxBorderColor: this.fillcolor,
            showTextBoxBorder: true,
            zIndex: 1,
            text: this.rectangleLabel
            });
            this.canvas.add(this.textbox);
        }
        if (this.drawType == "polygon") {
        try {
          if (this.pointArray.length > 1) {
            if (e.target && e.target.id == this.pointArray[0].id) {
                //最後一個點
                this.generatePolygon();
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
    mouseup(e) {
      var xy =e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
    //   this.mouseTo.x = xy.x;
    //   this.mouseTo.y = xy.y;
      this.mouseTo.x = this.getX(e)
      this.mouseTo.y = this.getY(e)
      // drawing();
      if(this.drawingObject){
        this.objectaction(e,'added')
      }
      this.drawingObject = null;
      this.moveCount = 1;
      this.panning = false;
      this.canvas.selection = true;
      if (this.drawType != "polygon") {
        this.doDrawing = false;
      }
    },
    mousemove(e) {
        if (this.moveCount % 2 && !this.doDrawing) {
                //减少绘制频率
                return;
        }
        //移動畫布
        if (this.canvas.getActiveObjects().length === 0 && this.drawType === '' &&
         this.panning &&
          e && e.e) {
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
      var xy =e.pointer || this.transformMouse(e.e.offsetX, e.e.offsetY);
    //   this.mouseTo.x = xy.x;
    //   this.mouseTo.y = xy.y;
        this.mouseTo.x = this.getX(e)
        this.mouseTo.y = this.getY(e)
      if (this.drawType != "text" || this.drawType != "polygon") {
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
    mousewheel(e){
        this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.canvas.getZoom();
        this.zoom = Math.max(0.1, this.zoom); //最小为原来的1/10
        this.zoom = Math.min(3, this.zoom); //最大是原来的3倍
        this.zoomPoint = new fabric.Point(event.pageX, event.pageY);
        this.canvas.zoomToPoint(this.zoomPoint, this.zoom);
        this.resetOriginAfterZoom()
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
      });
    },
    addcustomize(canvasObject){
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
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / 1, y: mouseY / 1 };
    },
    drawPolygon() {
      this.drawType = "polygon";
      this.polygonMode = true;
      this.pointArray = new Array();
      this.lineArray = new Array();
      this.canvas.isDrawingMode = false;
    },
    addPoint(e) {
      var random = Math.floor(Math.random() * 10000);
      var id = new Date().getTime() + random;
      var circle = new fabric.Circle({
        radius: 5,
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 0.5,
        // left: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        // top: (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
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
        // (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        // (e.pointer.y || e.e.layerY) / this.canvas.getZoom(),
        // (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
        // (e.pointer.y || e.e.layerY) / this.canvas.getZoom()
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
            // x: (e.pointer.x || e.e.layerX) / this.canvas.getZoom(),
            // y: (e.pointer.y || e.e.layerY) / this.canvas.getZoom()
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
      this.pointArray.map((point, index) => {
        points.push({
          x: point.left,
          y: point.top
        });
        this.canvas.remove(point);
      });
      this.lineArray.map((line, index) => {
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
      this.addcustomize(polygon)
      this.drawingObject = polygon
      this.activeLine = null;
      this.activeShape = null;
      this.polygonMode = false;
      this.doDrawing = false;
      this.drawType = null;
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
            switch (this.drawType) {
                case "arrow": //箭头
                var x1 = mouseFrom.x,
                    x2 = mouseTo.x,
                    y1 = mouseFrom.y,
                    y2 = mouseTo.y;
                var w = x2 - x1,
                    h = y2 - y1,
                    sh = Math.cos(Math.PI / 4) * 16;
                var sin = h / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
                var cos = w / Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
                var w1 = (16 * sin) / 4,
                    h1 = (16 * cos) / 4,
                    centerx = sh * cos,
                    centery = sh * sin;
                /**
                 * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
                 * w1 ，h1用于确定四个点
                 */
                var path = " M " + x1 + " " + y1;
                path += " L " + (x2 - centerx + w1) + " " + (y2 - centery - h1);
                path +=
                    " L " + (x2 - centerx + w1 * 2) + " " + (y2 - centery - h1 * 2);
                path += " L " + x2 + " " + y2;
                path +=
                    " L " + (x2 - centerx - w1 * 2) + " " + (y2 - centery + h1 * 2);
                path += " L " + (x2 - centerx - w1) + " " + (y2 - centery + h1);
                path += " Z";
                canvasObject = new fabric.Path(path, {
                    stroke: this.strokecolor,
                    fill: this.fillcolor,
                    strokeWidth: this.drawWidth,
                    opacity:this.opacity
                });
                break;
                case "pentagram": //五角星
                var x1 = mouseFrom.x,
                    x2 = mouseTo.x,
                    y1 = mouseFrom.y,
                    y2 = mouseTo.y;
                /**
                 * 实现思路  (x1,y1)表示鼠标起始的位置 (x2,y2)表示鼠标抬起的位置
                 * r 表示五边形外圈圆的半径，这里建议自己画个图理解
                 * 正五边形夹角为36度。计算出cos18°，sin18°备用
                 */
                var w = Math.abs(x2 - x1),
                    h = Math.abs(y2 - y1),  
                    r = Math.sqrt(w*w+h*h)
                    var cos18 = Math.cos(18*Math.PI / 180)
                    var sin18 = Math.sin(18*Math.PI / 180)
                
                /**
                 * 算出对应五个点的坐标转化为路径
                 */
                var point1 = [x1,y1+r]
                var point2 = [x1+2*r*(sin18),y1+r-2*r*(cos18)]
                var point3 = [x1-r*(cos18),y1+r*(sin18)]
                var point4 = [x1+r*(cos18),y1+r*(sin18)]
                var point5 = [x1-2*r*(sin18),y1+r-2*r*(cos18)]
                var path = " M " + point1[0] + " " + point1[1]
                path += " L " + point2[0] + " " + point2[1]
                path += " L " + point3[0] + " " + point3[1]
                path += " L " + point4[0] + " " + point4[1]
                path += " L " + point5[0] + " " + point5[1]
                path += " Z";
                canvasObject = new fabric.Path(path, {
                    stroke: this.strokecolor,
                    fill: this.fillcolor, 
                    strokeWidth: this.drawWidth,
                    opacity:this.opacity
                    // angle:180,  //设置旋转角度
                });
                break;
                case "ellipse": //椭圆
                var radius =
                    Math.sqrt(
                    (mouseTo.x - left) * (mouseTo.x - left) +
                        (mouseTo.y - top) * (mouseTo.y - top)
                    ) / 2;
                canvasObject = new fabric.Ellipse({
                    left: (mouseTo.x - left) / 2 + left,
                    top: (mouseTo.y - top) / 2 + top,
                    stroke: this.strokecolor,
                    fill: this.fillcolor,
                    originX: "center",
                    originY: "center",
                    rx: Math.abs(left - mouseTo.x) / 2,
                    ry: Math.abs(top - mouseTo.y) / 2,
                    strokeWidth: this.drawWidth,
                    opacity:this.opacity,
                    strokeDashArray:this.strokeDash
                });
                break;
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
                //也可以使用fabric.Rect
                break;
                case "rectangle-text": //长方形带标注框
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
                    opacity:this.opacity
                });
                // this.textbox.enterEditing();
                // this.textbox.hiddenTextarea.focus();
                //也可以使用fabric.Rect
                break;
                case "text": //文本框
                this.textbox = new fabric.Textbox("", {
                    left: mouseFrom.x,
                    top: mouseFrom.y - 10,
                    // width: 150,
                    fontSize: 16,
                    borderColor: this.strokecolor,
                    fill: this.fillcolor,
                    opacity:this.opacity
                });
                this.canvas.add(this.textbox);
                this.textbox.enterEditing();
                this.textbox.hiddenTextarea.focus();
                console.log('Textbox=>'+JSON.stringify(this.textbox))
                break;
                default:
                break;
            }
            if (canvasObject) {
                this.canvas.add(canvasObject); //.setActiveObject(canvasObject)
                this.drawingObject = canvasObject;
                this.addcustomize(canvasObject)
            }
      }
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas", {
      // skipTargetFind: true,
      // selectable: false,
      // selection: false
    });
    
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
    this.canvas.selectionColor = "rgba(0,0,0,0.3)";
    this.canvas.selectionBorderColor ="black"
    this.canvas.selectionDashArray = [5, 5]
    this.canvas.on("mouse:down", this.mousedown);
    this.canvas.on("mouse:move", this.mousemove);
    this.canvas.on("mouse:up", this.mouseup);
    this.canvas.on("mouse:wheel",this.mousewheel);
    this.canvas.on("object:moving",(e) => {
        this.canvas.selection = false
        this.objectaction(e,'moving')
    });
    this.canvas.on('object:modified', (e) => {
        console.log('modified=>'+e.target) // e.target為當前編輯的Object
        //this.setAnimate(e.target)
    });
    document.onkeydown = e => {
      let key = window.event.keyCode;
      if (e.keyCode == 46) {
        this.deleteObj();
      }
      if (e.keyCode == 90 && e.ctrlKey) {
        this.canvas.remove(
          this.canvas.getObjects()[this.canvas.getObjects().length - 1]
        );
      }
      if(e.keyCode == 67 && e.ctrlKey){
          this.copy()
      }
      if(e.keyCode == 86 && e.ctrlKey){
          this.paste()
      }
    };
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
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  flex-direction: column;
}
img,
input {
  display: none;
}
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  border: 1px dashed black;
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
    background: #eee;
  }
}
</style>