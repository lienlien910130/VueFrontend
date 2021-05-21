<template>
  <div class="editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="7">
          <div class="block-wrapper" :style="{ height: blockwrapperheight }">
              <h3>建築物</h3>
              <el-form class="buildinginfo" 
                  ref="form" :model="form" 
                  :rules="formRules" :label-position="label" label-width="auto">
                  <el-form-item label="名稱" prop="buildingName">
                      <el-input ref="buildingName" name="buildingName" v-model="form.buildingName" show-word-limit maxlength="20"/>
                  </el-form-item>
                  <el-form-item label="地址" prop="address">
                      <el-cascader
                      v-model="addressValue"
                      :options="options"
                      :props="{ value: 'label'}"
                      style="width:100%"
                      ></el-cascader>
                      <el-input ref="address" name="address" v-model="form.address"  
                      show-word-limit maxlength="100"/> 
                  </el-form-item>
                  <el-form-item label="面積" prop="area">
                      <el-input ref="area" name="area" 
                      v-model.number="form.area" 
                      type="number" min="0">
                      <template slot="append">
                          m<sup>2</sup>
                      </template>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="高度" prop="height">
                      <el-input ref="height" name="height" v-model.number="form.height"  type="number" min="0"/>
                  </el-form-item>
                  <el-form-item label="層數" prop="floorsOfAboveGround">
                      <el-input ref="floorsOfAboveGround" name="floorsOfAboveGround" 
                      v-model.number="form.floorsOfAboveGround" type="number" min="0" :disabled="disable">
                      <template slot="prepend">地上</template>
                      <template slot="append">樓</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item prop="floorsOfUnderground">
                      <el-input ref="floorsOfUnderground" name="floorsOfUnderground" 
                      v-model.number="form.floorsOfUnderground" type="number" min="0" :disabled="disable">
                      <template slot="prepend">地下</template>
                      <template slot="append">樓</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="使用執照字號" prop="licenseNumber">
                      <el-input ref="licenseNumber" name="licenseNumber" v-model="form.licenseNumber" show-word-limit maxlength="30"/>
                  </el-form-item>

              </el-form>
              <div style="float:right">
                  <el-button v-if="type=='create'" type="primary" @click="onPost" :loading="loading">新增</el-button>
                  <el-button v-else type="primary" @click="onEdit">更新</el-button>
                  <el-button type="info" @click="onCancel">清空</el-button>
              </div>
          </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="17">
          <div class="block-wrapper" :style="{ height: blockwrapperheight }">
            <Block 
              :list-query-params.sync="listQueryParams"
              :selectSetting.sync="selectSetting"
              v-bind="blockAttrs" 
              v-on="blockEvent"></Block>
          </div>
      </el-col>
    </el-row>
    
  </div>
</template>
<script>
import blockmixin from '@/mixin/blockmixin'
import sharemixin  from '@/mixin/sharemixin'
import Building from '@/object/building'
import Floors from '@/object/floors'
import constant from '@/constant/index'
export default {
  mixins:[sharemixin,blockmixin],
  computed: {
    label() {
      if (this.$store.state.app.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    blockEvent(){
      return{
        handleBlock:this.handleBlock,
        clickPagination:this.getAllBuilding,
      }
    }
  },
  async mounted(){
    await this.init()
  },
  data() {
    const vaildateInt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('請輸入層數'))
      }
      if (!Number(value)) {
        callback(new Error('請輸入正確格式'))
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/
        const rsCheck = re.test(value)
        if (!rsCheck) {
          callback(new Error('請輸入正確格式'))
        } else {
          callback();
        }
      }
    }
    const validateNumber = (rule, value, callback) => {
      let numberReg = /^\d+$|^\d+[.]?\d+$/
      if (!value) {
        rule.name == 'area' ? callback(new Error('請輸入面積')) : callback(new Error('請輸入高度'))
      }else{
        if (!numberReg.test(value)) {
          callback(new Error('請輸入正確格式'))
        } else {
          callback()
        }
      }
    }
    const validateText = (rule, value, callback) => {
      if (!value) {
        rule.name == 'buildingName' ? callback(new Error('請輸入名稱')) : 
        rule.name == 'address' ? callback(new Error('請輸入地址')) : callback(new Error('請輸入執照字號'))
      } else {
        callback()
      }
    }
    return {
      type:'create',
      form: {},
      formRules: {
            buildingName: [{ required: true, trigger: 'blur', validator: validateText, name:'buildingName' }],
            address: [{ required: true, trigger: 'blur', validator: validateText, name:'address' }],
            area: [{ required: true, trigger: 'blur', validator: validateNumber, name:'area' }],
            height: [{ required: true, trigger: 'blur', validator: validateNumber, name:'height' }],
            floorsOfAboveGround: [{ required: true, trigger: 'blur', validator: vaildateInt, name:'floorsOfAboveGround' }],
            floorsOfUnderground: [{ required: true, trigger: 'blur', validator: vaildateInt, name:'floorsOfUnderground' }],
            licenseNumber: [{ required: true, trigger: 'blur', validator: validateText, name:'licenseNumber' }],
            linkOwners: [{ required: false, trigger: 'change', message: '請選擇所有權人' }],
            linkFireManagers: [{ required: false, trigger: 'change', message: '請選擇防火管理人' }]
      },
      floorsArray:[],
      disable:false,
      loading:false,
      options:constant.AreaCode,
      addressValue:[]
    }
  },
  methods: {
    async init(){
      this.tableConfig = Building.getConfig()
      this.title = 'building'
      await this.getAllBuilding()
    },
    async getAllBuilding(){
      this.blockData = []
      var data = await Building.get()
      console.log(JSON.stringify(data))
      this.$store.dispatch('building/setbuildingarray',data)
      this.listQueryParams.total = data.length
      this.blockData = data
      // this.blockData = data.filter((item, index) => 
      //   index < this.listQueryParams.limit * this.listQueryParams.page && 
      //   index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort(function(x,y){
      //     return y.id - x.id
      // })
    },
    async onPost() {
        this.$refs.form.validate(async(valid) => {
          if (valid) {  
              if(this.addressValue.length == 0){
                this.$message.error('請選擇地址')
                return false
              }
              this.loading = true
              const mask = this.$loading({
                  lock: true,
                  text: '建立建築物中，請稍後...',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
              })  
              this.floorsArray = []
              await this.crefloor('up',this.form.floorsOfAboveGround)
              await this.crefloor('down',this.form.floorsOfUnderground)
              this.form.address = this.addressValue[0]+ this.addressValue[1]+this.form.address
              var buildingId = await Building.post(JSON.stringify(this.form))
              if(buildingId !== ''){
                this.$message('新增成功')
                this.onCancel()
                await this.postFloor(buildingId)
                await this.getAllBuilding()
                mask.close()
                this.loading = false
              }
          }else {
            this.$message.error('請輸入完整資訊')
            return false
          }
        })
    },
    async onEdit(){
      this.$refs.form.validate(async(valid) => {
          if (valid) {
            this.form.address = this.addressValue[0]+ this.addressValue[1]+this.form.address
            var isUpadte = await this.form.update()
            if(isUpadte){
              this.$message('更新成功')
              if(this.buildingid == this.form.getID()){
                this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
              }
              this.onCancel()
              await this.getAllBuilding()
            }
          }
        })
    },
    onCancel() {
      this.addressValue = []
      this.form = {}
      this.type = 'create'
      this.disable = false
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async crefloor(index,val) {
      if (index == "up") {
        for (var i = 1; i <= val; i++) {
          var floor = { floor: i.toString() }
          await this.floorsArray.push(floor)
        }
      } else {
        for (var i = 1; i <= val; i++) {
          var count = -i
          var floor = { floor: count.toString() }
          await this.floorsArray.push(floor)
        }
      }
    },
    async postFloor(buildingId){
      await Floors.create(buildingId,this.floorsArray)
    },
    async handleBlock(title,index, content){
        console.log(title,index,JSON.stringify(content))
        if(index === 'open'){
          this.$nextTick(() => {
            if(this.$refs.form !== undefined){
              this.$refs.form.clearValidate()
            }
          })
          this.addressValue = [content.address.substr(0,3), content.address.substr(3,3)]
          content.address = content.address.substr(6)
          this.type = 'edit'
          this.form = new Building(content)
          this.disable = true
        }else if(index === 'delete'){
          var isOk = await content.delete()
          if(isOk){
            this.$message('刪除成功')
            await this.getAllBuilding()
          }
        }
    },
    async changeTable(value){
      this.isTable = value
    }
  }
}

</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}

.block-wrapper {
    background: #fff;
    padding: 15px 15px;
    height: 750px;
}
</style>

