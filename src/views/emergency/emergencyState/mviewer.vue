<template>
    <GraphicViewer ref="graphicviewer">
    </GraphicViewer>
</template>
<script>
import { Floors } from '@/object'
import idb from '@/utils/indexedDB'
export default {
    components:{
        GraphicViewer: () => import('@/components/Graphic/viewer.vue')
    },
    computed:{
        ...Vuex.mapGetters([
            'buildingid',
            'actions'
        ]),
    },
    created(){
        this.$store.dispatch('app/toggleDevice', 'mobile')
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    watch: {
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    await this.init()
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
        }
    },
    methods:{
        async init() {
            this.title = 'selfDefenseClass'
            if(this.$route.query.r !== undefined && this.$route.query.u !== undefined && this.$route.query.f !== undefined){
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
    }
}

</script>