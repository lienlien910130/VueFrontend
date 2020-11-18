<template>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            
              <GraphicView
                v-bind="graphicAttrs_view"
                v-on="graphicEvent"></GraphicView>
            
        </el-col>
    </el-row>
</template>

<script>
export default {
    props:['type','canvasreset','save'],
    components:{
      GraphicView: () => import('@/components/Graphic/index.vue'),
    },
    computed:{
        graphicAttrs_view(){
            return{
                movingImage:this.movingImage,
                imgDragOffset:this.imgDragOffset,
                deleteObject:this.deleteObject,
                selectObject:this.selectObject,
                reset:this.canvasreset,
                saveimg:this.save,
                title:this.type
            }
        },
        graphicEvent(){
            return{
                subObjectListOption: this.handleGraphicObjSelectOption,
                subResetOption: this.handleGraphicResetOption,
                subSaveOption: this.handleGraphicSaveOption,
                subJsonOption: this.handleGraphicJsonOption,
            }
        }
    },
    watch:{
    },
    data() {
        return {
            movingImage:null,
            imgDragOffset:{offsetX: 0,offsetY: 0},
            deleteObject:null,
            selectObject:null,
            objectlist:[],
        }
    },
    methods:{
        handleGraphicObjSelectOption(val){
            this.objectlist = val
        },
        handleGraphicResetOption(){
            this.$emit('subResetOption',false)
        },
        handleGraphicSaveOption(){
            this.$emit('subSaveOption',false)
        },
        handleGraphicJsonOption(val){
            this.$emit('subJsonOption',val)
        }
    }

}
</script>