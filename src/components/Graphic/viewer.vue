<template>
    <div ref="canvasdiv" class="canvasdiv" id="canvasdiv" >
        <canvas
            id="canvas"
        ></canvas>
    </div>
</template>

<script>
import constant from '@/constant/development'
const fabric = require('fabric')
import { getUUID } from '@/utils'

export default {
    name:'GraphicViewer',
    props:{
      canvasHeight: {
        type: Number,
        default: 0
      }
    },
    mounted() {
        this.canvas = new fabric.Canvas("canvas")
        this.canvas.setWidth(1650)
        this.canvas.setHeight(0)
        this.canvas.skipTargetFind = true
        this.canvas.selection = false
        this.canvas.on("touchstart", this.mouseDown)
        this.canvas.on("touchmove", this.move)
    },
    data(){
        return{
            canvas: {},
            objId:null,
            blockType: '未分類',
            objectName:'', //圖層標題
            addressId:'',
            connectId:'',
            srcId:'',
            hasAnimationStarted:false,
            leftsize:1,
            topsize:1,
            canvasheight:0,
            lastMovePos:{x:0, y:0},
            relativeMouseX: 0,
            relativeMouseY: 0, 
            zoom: window.zoom ? window.zoom : 1,
            zoomPoint: new fabric.Point(0, 0), //初始时缩放原点的位置设为（0,0），这是页面的左上顶点
            lastzoomPoint: { x: 0, y: 0 }, //初始时，前一次缩放原点同样为(0,0)
            lastmousePoint: { x: 0, y: 0 }, //进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
            lastzoom: 1, //表示为上一次的缩放倍数，此刻设为1
        }
    },
    methods:{
        async loadBackgroundImage(objects,imgsrc,startAddress = null){ //載入背景圖
            if(this.canvasHeight == 0){
                document.getElementById("canvasdiv").style.minHeight = "calc(100vh - 80px)"
            }
            this.canvas.setWidth(this.$refs.canvasdiv.clientWidth)
            this.canvasheight = this.canvasHeight == 0 ? this.$refs.canvasdiv.clientHeight : this.canvasHeight
            this.canvas.setHeight(this.canvasheight)
            console.log(this.$refs.canvasdiv.clientHeight)
            console.log(this.$refs.canvasdiv.clientWidth,this.canvasheight)
            console.log(this.$refs.canvasdiv.clientWidth/1650)
            console.log(this.canvasheight/750)
            this.leftsize = this.$refs.canvasdiv.clientWidth/1650
            this.topsize = this.canvasheight/750
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
            if(startAddress !== null){
                var array = []
                for (const key in startAddress) {
                  if(key !== 'status'){
                    array.push(startAddress[key])
                  }
                }
                var address = array.join('-')
                this.setStartView(address)
                this.actionObj(address,startAddress['status'])
            }
        },
        async loadObjects(val){ //載入初始物件，預設關閉顯示
            if(val !== null){
                var self = this
                var obj = JSON.parse(val)
                fabric.util.enlivenObjects(obj, async function(object) {
                    var origRenderOnAddRemove = self.canvas.renderOnAddRemove
                    self.canvas.renderOnAddRemove = false
                    for(let i=0;i<object.length;i++){
                        if(object[i].srcId !== ''){
                            var item = constant.Equipment.filter((item,index) =>
                            item.id == object[i].srcId
                            )[0]
                            var item = require('@/icons/svg/fire_'+item.id+'.svg')
                            var text = item.default.content.replace(/http:\/\//g, 'https://')
                            text = text.replace('symbol', 'svg')
                            text = text.replace('/symbol', '/svg')
                            fabric.loadSVGFromString(text, function(objects, options) {
                                var svgItems = fabric.util.groupSVGElements(objects, options);
                                svgItems.set({
                                    scaleX: object[i].scaleX * self.leftsize,
                                    scaleY: object[i].scaleY * self.topsize,
                                    top: object[i].top * self.topsize,
                                    left: object[i].left * self.leftsize,
                                    hasControls:false,
                                    visible:true
                                })
                                self.canvas.add(svgItems);
                                self.addCustomize(svgItems,object[i].objId,object[i].objectName,object[i].blockType,
                                object[i].srcId,object[i].addressId,object[i].connectId,object[i].status,object[i].action)
                                self.canvas.renderAll();
                            });

                        }else{
                            object[i].visible = true
                            object[i].scaleX = object[i].scaleX * self.leftsize
                            object[i].scaleY = object[i].scaleY * self.topsize
                            object[i].top = object[i].top * self.topsize
                            object[i].left = object[i].left * self.leftsize
                            self.canvas.add(object[i])
                            self.addCustomize(object[i],object[i].objId,object[i].objectName,object[i].blockType,
                            object[i].srcId,object[i].addressId,object[i].connectId,object[i].status,object[i].action)
                        }
                    }
                    self.canvas.renderOnAddRemove = origRenderOnAddRemove
                    self.canvas.renderAll()
                    console.log(JSON.stringify(self.canvas.getObjects()))
                    // self.actionObj('001-01-012-4',1)
                })
            }
        },
        addCustomize(canvasObject, objId = null, objectname = null, blocktype = null, srcId = null, addressId = null,
            connectId = null, status = null, action = null){ //新增客製化元素：貼上/初始化物件/圖例/矩形/文字/多邊
                canvasObject.toObject = (function (toObject) {
                    return function () {
                        return fabric.util.object.extend(toObject.call(this), {
                            objId: this.objId,
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
        setStartView(startAddress){ //設定起始點的視圖
            var index = this.canvas.getObjects().findIndex(o=>o.addressId == startAddress)
            if(index !== -1){
                console.log(this.canvas.getObjects()[index])
                var left = this.canvas.getObjects()[index].left
                var top = this.canvas.getObjects()[index].top
                this.zoomPoint = new fabric.Point(left, top)
                this.canvas.zoomToPoint(this.zoomPoint, 2)
                this.resetOriginAfterZoom()
                this.canvas.renderAll()
            }
        },
        zoomCanvas(){ //放大縮小
            console.log(this.canvas.getZoom(),this.canvas.getCenter())
            // this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.canvas.getZoom()
            // this.zoom = Math.max(0.5, this.zoom)
            // this.zoom = Math.min(3, this.zoom)
            const center = this.canvas.getCenter()
            this.zoomPoint = new fabric.Point(center.left, center.top)
            this.canvas.zoomToPoint(this.zoomPoint, 2)
            this.resetOriginAfterZoom()
            this.canvas.renderAll()
        },
        mouseDown(e){
            console.log('down')
            this.lastMovePos.x = e.e.clientX
            this.lastMovePos.y = e.e.clientY
        },
        move(e){
            console.log('move')
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
        },
        actionObj(str,value){
            var index = this.canvas.getObjects().findIndex(o=>o.addressId == str)
            if(index !== -1){
                var obj = this.canvas.getObjects()[index]
                var equ = constant.Equipment.filter(ele=>{ return ele.id == obj.srcId})[0]
                var src = equ.status.filter(obj=>{ return obj.value == value})[0]
                var self = this
                if(obj.srcId == 'a2' && value == 1){ //需更換svg圖片：探測器動作更換成火災圖片
                    obj.set({ visible : false})
                    var item = require('@/icons/svg/'+src.imgSrc)
                    var text = item.default.content.replace(/http:\/\//g, 'https://')
                    text = text.replace('symbol', 'svg')
                    text = text.replace('/symbol', '/svg')
                    fabric.loadSVGFromString(text, function(objects, options) {
                        var svgItems = fabric.util.groupSVGElements(objects, options);
                        svgItems.set({
                            scaleX: obj.scaleX * self.leftsize,
                            scaleY: obj.scaleY * self.topsize,
                            top: obj.top * self.topsize,
                            left: obj.left * self.leftsize,
                            hasControls:false,
                            visible:true
                        })
                        self.canvas.add(svgItems);
                        svgItems.set({
                            fill:'#ff0000'
                        });
                        self.addCustomize(svgItems,obj.objId,obj.objectName,obj.blockType,
                        'fs',obj.addressId,obj.connectId,obj.status,obj.action)
                        self.canvas.renderAll();
                        self.setAnimate(svgItems)
                    });
                }else{
                    obj.set({
                        fill:src.color
                    })
                    if(obj._objects !== undefined){
                        obj.getObjects().forEach(item=>{
                            if(item.fill !== '#ffffff'){
                                item.set({
                                    fill:src.color
                                })
                            }
                        })
                    }
                    obj.set({ visible : true})
                    if(src.color !== '#00ff00'){
                        this.setAnimate(obj)
                    }
                }

                if(obj.connectId !== ''){
                    var connectindex = this.canvas.getObjects().findIndex(o=>o.objId == obj.connectId)
                    if(connectindex !== -1){
                        var connectObj = this.canvas.getObjects()[connectindex]
                        connectObj.set({fill: 'rgba(230, 83, 83, 1)'})
                        this.setAnimate(connectObj, 0.7)
                    }

                }
                this.canvas.renderAll()
            }
        },
        setAnimate(obj, maximum = 1){ //動畫
            this.hasAnimationStarted = true
            obj.animate('opacity', obj.opacity === 0.2 ? maximum : 0.2, {
                duration: 600,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => this.setAnimate(obj, maximum),
                abort: () => !this.hasAnimationStarted,
                easing: fabric.util.ease.easeInOutCubic
            })
        }
    }
}
</script>


