<template>
    
        <el-row>
             <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <Graphic
                  v-bind="graphicAttrs"
                  v-on="graphicEvent">
                </Graphic>
            </el-col>
          </el-row>
        
    
</template>

<script>
export default {
    props:['type','canvasreset','save'],
    components:{
      Graphic: () => import('@/components/Graphic/old.vue'),
    },
    computed:{
        graphicAttrs(){
        return{
                movingImage:this.movingImage,
                imgDragOffset:this.imgDragOffset,
                deleteObject:this.deleteObject,
                selectObject:this.selectObject,
                deletesuccess:this.deletesuccess,
                reset:this.reset,
                saveimg:this.save,
                title:this.type
            }
      },
      graphicEvent(){
        return{
              subObjectListOption: this.handleGraphicObjListOption,
              subResetOption: this.handleGraphicResetOption,
              subSaveOption: this.handleGraphicSaveOption,
              subJsonOption: this.handleGraphicJsonOption,
              subResetSelectOption: this.handleResetSelectOption,
              subResetDeleteOption: this.handleResetDeleteOption,
              subObjectDeleteOption:this.handleGraphicObjDeleteOption,
              subObjectSelectOption:this.handleGraphicObjSelectOption
          }
      },
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
            reset:false,
            deletesuccess:null,
            save:false,
            type:'view',
        }
    },
    methods:{
        handleGraphicObjListOption(val){
            this.objectlist = val
        },
        handleGraphicResetOption(){
            this.reset = false
        },
        handleGraphicSaveOption(){
            this.save = false
        },
        handleGraphicJsonOption(val){
            this.canjson = val
        },
        handleResetSelectOption(){
            this.selectObject = null
            this.objectSelect = null
        },
        handleResetDeleteOption(){
            this.deleteObject = null
            this.deletesuccess = null
            this.objectDelete = null
        },
        handleGraphicObjDeleteOption(val){
            this.objectDelete = val
        },
        handleGraphicObjSelectOption(val){
            this.objectSelect = val
        }
    
    }

}
</script>