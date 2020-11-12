<template>
  <div class="graphic-container">
      <div class="graphic-editor-container">
        <FloorSelect 
          style="margin-bottom: 20px;"
          v-bind="floorselectAttrs" 
          v-on="floorselectEvent">
        </FloorSelect>

        <el-popover
          placement="left-start"
          title="快捷鍵"
          width="270"
          trigger="manual"
          v-model="visible" >
            <p class="tipck">1.【Alt】+【➚】+【滑鼠左鍵】：平移</p>
            <p class="tipck">2.【Alt】+【Q】：放大</p>
            <p class="tipck">3.【Alt】+【W】：縮小</p>
            <p class="tipck">4.【Alt】+【S】：選取</p>
            <p class="tipck">5.【Alt】+【T】：文字</p>
            <p class="tipck">6.【Alt】+【R】：矩形</p>
            <p class="tipck">7.【Alt】+【A】：多邊形</p>
            <p class="tipck">8.【Ctrl】+【C】：複製</p>
            <p class="tipck">9.【Ctrl】+【V】：貼上</p>
            <p class="tipck">10.【Ctrl】+【Z】：返回上一步</p>
            <p class="tipck">11.【Delete】：刪除</p>
            <p class="tipck">12.【Insert】：下載圖片</p>
            <i class="el-icon-warning" slot="reference" @click="visible = !visible"
            style="font-size:40px" type="button"/>
        </el-popover>

        <el-button v-if="type =='view'" type="primary" @click="changetype('edit')">編輯圖控</el-button>
        <el-button v-else type="primary" @click="changetype('view')">關閉編輯</el-button>
        <el-button type="primary" @click="resetcanvas">復原位置</el-button>
        <el-button type="primary" @click="savetoimage">匯出圖片</el-button>

        <div class="block-wrapper">
            <component 
            v-bind:is="tabView" 
            v-bind="graphicAttrs" 
            v-on="graphicEvent"
          ></component>  
        </div>
        

        <!-- <div
        v-if="edit"
        >
        <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="6">
              <div class="block-wrapper">
                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-collapse-item title="圖層" name="1">
                    <ObjectList
                    v-bind="objectListAttrs"
                    v-on="objectListEvent"
                    ></ObjectList>
                  </el-collapse-item>
                  <el-collapse-item title="圖例" name="2">
                    <EquipmentType
                      v-on="equipmentTypeEvent">
                    </EquipmentType>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="18">
                <div class="block-wrapper">
                    <Graphic
                    v-bind="graphicAttrs_edit"
                    v-on="graphicEvent"></Graphic>
                </div>
            </el-col>
        </el-row>
        </div>
        <div
        v-else>
          <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="block-wrapper">
              <Graphic
                v-bind="graphicAttrs_view"
                v-on="graphicEvent"></Graphic>
            </div>
          </el-col>
        </el-row>
        </div> -->
        
           
      </div>
       
  </div>
 
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components:{
      FloorSelect: () => import('@/components/Select/index.vue'),
      GraphicView: () => import('./view.vue'),
      GraphicEdit: () => import('./edit.vue'),
    },
    computed:{
      ...mapGetters([
          'id',
          'buildingid'
      ]),
      floorselectAttrs() {
        return {
          selectData: this.selectData,
          title:'GraphicFloor'
        }
      },
      floorselectEvent(){
        return{
          subChangeOption: this.handleSelectOption
        }
      },
      graphicAttrs(){
        return{
          type:this.type,
          canvasreset:this.reset,
          save:this.save,
          canjson:this.canjson
        }
      },
      graphicEvent(){
        return{
          subResetOption: this.handleResetOption,
          subSaveOption: this.handleSaveOption,
          subJsonOption: this.handleJsonOption,
        }
      }
    },
    data() {
        return {
          selectData:[],
          visible:false,
          reset:false,
          tabView:'GraphicView',
          type:'view',
          save:false,
          canjson:''
        }
    },
    mounted(){
      this.getfloors()
    },
    methods:{
      getfloors() {
        this.selectData = []
        this.$api.building.apiGetFloors().then(response => {
          response.result.forEach(element => {
            var _temp = {
              id:element.id,
              label:element.floors>0 ? element.floors+'F' : '地下'+element.floors.substr(1)+'F'
            }
            this.selectData.push(_temp)
          });
        })
      },
      handleSelectOption(){

      },
      handleResetOption(){
        this.reset = false
      },
      handleSaveOption(){
        this.save = false
      },
      handleJsonOption(val){
        this.canjson = val
        if(this.type == 'view'){
          this.tabView = 'GraphicView'
        }else{
          this.tabView = 'GraphicEdit'
        }
      },
      resetcanvas(){
        this.reset = true
      },
      savetoimage(){
        this.save = true
      },
      changetype(type){
        this.type = type
        // if(type == 'view'){
        //   this.tabView = 'GraphicView'
        // }else{
        //   this.tabView = 'GraphicEdit'
        // }
      },
      
    }
}
</script>

<style lang="scss" scoped>
.graphic-container{
  height: 100%;
}
.graphic-editor-container {
  padding: 20px;
  background-color: rgb(209, 226, 236);
  position: relative;
  max-height: calc(100vh - 125px);
  overflow: auto;

  .block-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 850px;
    overflow-x:hidden;
    overflow-y:auto;
  }

}
i{
  cursor: pointer;
}
</style>


