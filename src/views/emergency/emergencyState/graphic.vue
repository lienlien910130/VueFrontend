<template>
    <div class="editor-container">
        <GraphicViewer ref="graphicviewer">
        </GraphicViewer>
    </div>
</template>
<script>
import { Floors } from '@/object'
import idb from '@/utils/indexedDB'
import store from '@/store'
import ws from '@/utils/socket'

export default {
    name:'EmergencyGraphic',
    components:{
        GraphicViewer: () => import('@/components/Graphic/viewer.vue')
    },
    computed:{
        ...Vuex.mapGetters([
            'actions',
            'options',
            'process',
            'wsmsg'
        ])
    },
    created(){
        this.$store.dispatch('app/toggleDevice', 'mobile')
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    watch: {
        process:{ //有登入ws&有發生緊急應變才繪製畫面
            handler:async function(){
              if(this.process == true && ws.processWs.floorId !== null){
                this.floorId = ws.processWs.floorId
                var startpoint = ws.processWs.addressChangeList[0]
                var index = startpoint.internet.indexOf('P') 
                var label = ''
                if(index !== -1){ //PLC點位
                  label =  startpoint.internet + '-' + startpoint.system + '-' + startpoint.memeryLoc
                }else{
                  label = startpoint.internet + '-' + startpoint.system + '-' + startpoint.address + '-' + startpoint.number
                }
                await this.init(label,startpoint.status)
              }
            },
            immediate:true
        },
        // action:{
        //     handler:async function(){
        //         if(this.actions.length){
        //             this.actions.forEach(element => {
        //                 this.$refs.graphicviewer.actionObj(element.label)
        //             })
        //         }
        //     },
        //     immediate:true
        // }
    },
    mounted(){
      this.$messaging.getToken({vapidKey: 'BMu0NsMpDOJfRkGUVC1kwS--OOjkM1y7x8j9BJj86J505uDUeUHI05zTqzoj_fM896_QKSLGd-n4Xsq1md5QBDk'})
        .then(async function (currentToken) {
            if (currentToken) {
              console.log('currentToken',currentToken)
              await store.dispatch('user/saveMToken',currentToken)
              if(ws.processWs.$ws == null){
                ws.initProcessWebSocket()
              }
            } else {
              //顯示訂閱的視窗
              console.log('no token')
            }
      })
      .catch(function (err) {
            console.log('err',err)
      });
    },
    data(){
      return{
        floorId:null
      }
    },
    methods:{
        async init(startAddress,status) {
            this.title = 'selfDefenseClass'
            var floor = await Floors.getOfId(this.floorId)
            var obj = await floor.getGraphicFiles()
            if(floor.getImageID() == null){
                this.$message.error('該樓層尚未設定圖控相關資料')
            }else{
                var data = await idb.loadCacheImage((floor.getImageID()))
                this.$nextTick(() => {
                    this.$refs.graphicviewer.loadBackgroundImage(obj.codeContent,data,startAddress,status)
                })
            }
        }
    }
}

</script>