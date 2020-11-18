<template>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="block-wrapper">
                <GraphicEdit
                    v-bind="graphicAttrs_edit"
                    v-on="graphicEvent"></GraphicEdit>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8">
            <div class="collapse-wrapper">
                <EquipmentType
                    v-on="equipmentTypeEvent">
                </EquipmentType>
              </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8">
            <div class="collapse-wrapper">
                <ObjectList
                    v-bind="objectListAttrs"
                    v-on="objectListEvent"
                ></ObjectList>
            </div>
        </el-col>
        
    </el-row>
</template>
<script>
export default {
    props:['type','canvasreset','save'],
    components:{
      EquipmentType: () => import('./components/EquipmentType'),
      ObjectList: () => import('./components/ObjectList'),
      GraphicEdit: () => import('@/components/Graphic/index.vue'),
    },
    watch:{
        resettoedit(val){
            this.resettocanvas = val
        },
    },
    computed:{
        objectListAttrs(){
            return {
            list: this.objectlist
            }
        },
        objectListEvent(){
            return {
            subSelectOption: this.handleObjSelectOption
            }
        },
        equipmentTypeEvent(){
            return{
            subDragOption: this.handleDragOption
            }
        },
        graphicAttrs_edit(){
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
    data() {
        return {
            movingImage:null,
            imgDragOffset:{offsetX: 0,offsetY: 0},
            objectlist:[],
            deleteObject:null,
            selectObject:null,
            resettocanvas:false,
        }
    },
    methods:{
        handleObjSelectOption(index,val){
            if(index == "del"){
            this.deleteObject = val
            }else{
            this.selectObject = val
            }
        },
        handleDragOption(e){
            if(e !== null){
            this.imgDragOffset.offsetX = e.offsetX
            this.imgDragOffset.offsetY = e.offsetY
            this.movingImage = e.target
            }else{
            this.movingImage = null
            }
        },
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

<style lang="scss" scoped>
.collapse-wrapper{
    background: snow;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    margin-top: 32px;
    margin-left: 32px;
    height: 400px;
    overflow-x:hidden;
    overflow-y:auto;
}
</style>