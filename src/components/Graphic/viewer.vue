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
      },
    },
    mounted() {
        this.canvas = new fabric.Canvas("canvas")
        // this.canvas.setWidth(this.$refs.canvasdiv.clientWidth)
        // this.canvas.setHeight(this.$refs.canvasdiv.clientHeight)
        this.canvas.setWidth(1650)
        this.canvas.setHeight(0)
        this.canvas.skipTargetFind = true
        this.canvas.selection = false
    },
    data(){
        return{
            canvas: {},
            blockType: '未分類',
            objectName:'', //圖層標題
            addressId:'',
            connectId:'',
            srcId:'',
            hasAnimationStarted:false,
            leftsize:1,
            topsize:1,
            canvasheight:0
        }
    },
    methods:{
        async loadBackgroundImage(objects,imgsrc){ //載入背景圖
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
                    for(let i=0;i<object.length;i++){
                        if(object[i].type == 'image'){
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
                    self.actionObj('001-001-02-999')
                    self.actionObj('001-001-02-07')
                })
            }
        },
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
        actionObj(str){
            var index = this.canvas.getObjects().findIndex(o=>o.addressId == str)
            if(index !== -1){
                var obj = this.canvas.getObjects()[index]
                obj.set({
                    fill:'rgb(255, 0, 0)'
                });
                if(obj._objects !== undefined){
                    obj.getObjects()[1].set({
                        fill:'rgb(255, 0, 0)'
                    })
                }
                var equ = constant.Equipment.filter(ele=>{ return ele.id == obj.srcId})[0]
                var src = equ.status.filter(obj=>{ return obj.value == 1})[0]
                obj.set({
                    fill:src.color
                });
                if(obj._objects !== undefined){
                    obj.getObjects()[1].set({
                        fill:src.color
                    })
                }
                obj.set({ visible : true})
                if(src.color !== '#00ff00'){
                    this.setAnimate(obj)
                }
                this.canvas.renderAll()
            }
        },
        setAnimate(obj){ //動畫
            this.hasAnimationStarted = true
            obj.animate('opacity', obj.opacity === 0.2 ? 1 : 0.2, {
                duration: 600,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => this.setAnimate(obj),
                abort: () => !this.hasAnimationStarted,
                easing: fabric.util.ease.easeInOutCubic
            })
        }
    }
}
</script>


