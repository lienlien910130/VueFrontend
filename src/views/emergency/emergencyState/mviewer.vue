<template>
    <div v-if="floorId == null" style="text-align:center;margin-top:10px">
      <span>尚未啟動緊急應變</span>
    </div>
    <div v-else>
      <div style="text-align:center;margin:8px 0px">
        <template template v-for="(item,index) in buttonOptions">
          <el-button :key="index" @click="sendSelect(item.id)" type="danger" round>{{ item.name }}</el-button>
        </template>
      </div>
      <div>
        <GraphicViewer ref="graphicviewer" :canvasHeight="350">
        </GraphicViewer>
      </div>
      <div class="list">
        <template v-for="(item,index) in actionList">
          <div :key="index" style="text-align:center;padding:5px 8px">
            <span style= "display:block">時間：{{ item.date }} / 系統：{{ item.mode }}</span>
            <span style= "display:block">動作：{{ item.action }} / 點位：{{ item.point }}</span>
            <span style= "display:block">--------------------------------------------------</span>
          </div>
        </template>
      </div>
      <div class="videobox">
        <img src="http://192.168.88.221/videourl0.cgi?user=viewer&pass=viewer" width="100%" height="auto">
        <!-- <iframe src="http://192.168.88.221/videourl0.cgi?user=viewer&pass=viewer">
        </iframe> -->
      </div>
    </div>
</template>
<script>
import { Floors } from '@/object'
import idb from '@/utils/indexedDB'
import store from '@/store'
import ws from '@/utils/socket'
export default {
    components:{
        GraphicViewer: () => import('@/components/Graphic/viewer.vue')
    },
    computed:{
        ...Vuex.mapGetters([
            'actions',
            'options',
            'process'
        ])
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
      // var ifm = document.getElementById('cctv')
      // ifm.height = 300
      // ifm.width = document.documentElement.clientWidth
      // this.$socket.initProcessWebSocket()
    },
    watch: {
        process:{ //有登入ws&有發生緊急應變才繪製畫面
            handler:async function(){
              if(this.process == true && ws.processWs.floorId !== null){
                this.floorId = ws.processWs.floorId
                await this.init(ws.processWs.firstTriggerDeviceAddress)
              }
            },
            immediate:true
        },
        actions:{
            handler:async function(){
                if(this.actions.length){
                    this.actions.forEach(element => {
                        this.$refs.graphicviewer.actionObj(element.label)
                    })
                }
            },
            immediate:true
        },
        options:{
            handler:async function(){
                if(this.options.length){
                    this.buttonOptions = _.cloneDeep(this.options)
                }
            },
            immediate:true
        },
        wsmsg:{
            handler:async function(){
                //this.actionList = this.wsmsg
            },
            immediate:true
        }
    },
    data(){
      return{
        // actionList:[],
        // buttonOptions:[]
        floorId:null,
        actionList:[{
          date:'2021/10/21 11:22:33',
          mode:'防災盤',
          action:'0',
          point:'001-0008'
        },{
          date:'2021/10/21 12:47:33',
          mode:'PLC',
          action:'1',
          point:'P002-R100-7'
        },{
          date:'2021/10/21 13:18:33',
          mode:'火警',
          action:'sa-1',
          point:'001-01-010-7'
        }],
        buttonOptions:[{
          "id": "342",
          "name": "滅火中",
          },
          {
          "id": "343",
          "name": "滅火完成",
          },
          {
          "id": "344",
          "name": "滅火失敗",
        }]
      }
    },
    methods:{
        async init(startAddress) {
            this.title = 'selfDefenseClass'
            var floor = await Floors.getOfId(this.floorId)
            var obj = await floor.getGraphicFiles()
            if(floor.getImageID() == null){
                this.$message.error('該樓層尚未設定圖控相關資料')
            }else{
                var data = await idb.loadCacheImage((floor.getImageID()))
                this.$nextTick(() => {
                    this.$refs.graphicviewer.loadBackgroundImage(obj.codeContent,data,startAddress)
                })
            }
        },
        sendSelect(optionID){
          console.log(optionID)
          this.$socket.sendProcess(optionID)
        }
    }
}

</script>

<style lang="scss" scoped>
.list{
  margin:5px;
  border:2px #ccc solid;
  border-radius:10px;
  height:200px;
  background-color:#eee;
  overflow-y: auto;
}


</style>
