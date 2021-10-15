<template>
    <div ref="canvasdiv" class="canvasdiv" >
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
    mounted() {
        this.canvas = new fabric.Canvas("canvas")
        this.canvas.setWidth(this.$refs.canvasdiv.clientWidth)
        this.canvas.setHeight(this.$refs.canvasdiv.clientHeight)
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
            srcId:''
        }
    },
    methods:{
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
    }
}
</script>

<style lang="scss" scoped>
.canvasdiv{
    min-height: calc(100vh - 80px);
}
</style>