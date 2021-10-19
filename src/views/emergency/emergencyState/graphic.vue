<template>
    <div class="editor-container">
        <GraphicViewer ref="graphicviewer">
        </GraphicViewer>
    </div>
</template>
<script>
import { Floors } from '@/object'
import idb from '@/utils/indexedDB'
import sharemixin  from '@/mixin/sharemixin'

export default {
    name:'EmergencyGraphic',
    mixins:[sharemixin],
    components:{
        GraphicViewer: () => import('@/components/Graphic/viewer.vue')
    },
    created(){
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    watch: {
      actions:{
          handler:async function(){
            console.log(this.actions)
            var data = JSON.parse(this.actions)
            console.log(data)
            this.$refs.graphicviewer.actionObj('123')
          },
          immediate:true
      },
    },
    methods:{
        async init(){
            if(this.$route.query.f !== undefined){
                var floor = await Floors.getOfId(this.$route.query.f)
                var obj = await floor.getGraphicFiles()
                if(floor.getImageID() == null){
                    this.$message.error('該樓層尚未設定緊急應變圖控相關資料')
                }else{
                    var data = await idb.loadCacheImage((floor.getImageID()))
                    this.$nextTick(() => {
                        this.$refs.graphicviewer.loadBackgroundImage(obj.codeContent,data)
                    })
                }
            }
        },
        async changeTable(){},
    }
}

</script>