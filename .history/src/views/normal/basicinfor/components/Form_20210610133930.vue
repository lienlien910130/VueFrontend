<template>
  <div>
    <el-form class="buildinginfo" 
    ref="form" :model="form" 
    :rules="formRules" 
    :label-position="label" 
    label-width="auto"> 
      <el-form-item label="名稱" prop="buildingName">
        <el-input ref="buildingName" name="buildingName" v-model="form.buildingName" show-word-limit maxlength="20"
        :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-cascader
          v-model="addressValue"
          :options="options"
          :props="{ value: 'label'}"
          style="width:100%"
          :disabled="type === 'view' ? true : false"
          @change="handleChange"
        ></el-cascader>
        <el-input ref="address" name="address" v-model="form.address"  show-word-limit maxlength="100"
        :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="面積" prop="area">
        <el-input ref="area" name="area" 
          v-model.number="form.area" 
          type="number" min="0" :disabled="type === 'view' ? true : false">
        <template slot="append">
            m<sup>2</sup>
        </template>
        </el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <el-input ref="height" name="height" v-model.number="form.height"  type="number" min="0"
        :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="層數" prop="floorsOfAboveGround">
                      <el-input ref="floorsOfAboveGround" name="floorsOfAboveGround" 
                      v-model.number="form.floorsOfAboveGround" type="number" min="0" :disabled="true">
                      <template slot="prepend">地上</template>
                      <template slot="append">樓</template>
                      </el-input>
      </el-form-item>
      <el-form-item prop="floorsOfUnderground">
                      <el-input ref="floorsOfUnderground" name="floorsOfUnderground" 
                      v-model.number="form.floorsOfUnderground" type="number" min="0" :disabled="true">
                      <template slot="prepend">地下</template>
                      <template slot="append">樓</template>
                      </el-input>
      </el-form-item>
      <el-form-item label="使用執照字號" prop="licenseNumber">
                      <el-input ref="licenseNumber" name="licenseNumber" v-model="form.licenseNumber" show-word-limit maxlength="30"
                      :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="所有權人" prop="linkOwners">
        <el-select 
        v-if="this.type === 'edit'" 
        filterable multiple 
        v-model="linkOwners" style="width:100%">
          <el-option v-for="(item,index) in buildingUsers" 
          :key="index" :label="item.label" :value="item.id">
          </el-option>
        </el-select>

        <el-input v-else-if="this.type === 'view' 
        && form.linkOwners.length == 0 
        && this.buildingusers.length > 0" 
          ref="linkOwners" name="linkOwners" placeholder="請設定所有權人" 
          disabled></el-input>

        <el-button v-else-if="this.buildingusers.length == 0" type="text" 
        @click="openDialog">新增用戶</el-button>
        
        <el-input v-else-if="form.linkOwners.length" ref="linkOwners" name="linkOwners" 
        :placeholder="changeUserName(form.linkOwners)" disabled>
          <template slot="append">
            <el-link :underline="false" @click="openUser(form.linkOwners)">查看</el-link>
          </template>
        </el-input>

      </el-form-item>
      <el-form-item label="防火管理人" prop="linkFireManagers">
        <el-select 
        v-if="this.type === 'edit' " 
        filterable multiple 
        v-model="linkFireManagers" style="width:100%">
          <el-option v-for="(item,index) in buildingUsers" 
          :key="index" :label="item.label" :value="item.id">
          </el-option>
        </el-select>

        <el-input v-else-if="this.type === 'view' && form.linkFireManagers.length == 0 && 
        this.buildingusers.length>0" ref="linkFireManagers" name="linkFireManagers" 
        placeholder="請設定防火管理人" disabled></el-input>

        <el-button v-else-if="this.buildingusers.length == 0" type="text"
         @click="openDialog">新增用戶</el-button>
        
        <el-input v-else-if="form.linkFireManagers.length" ref="linkFireManagers" name="linkFireManagers" 
        :placeholder="changeUserName(form.linkFireManagers)" disabled>
          <template slot="append">
            <el-link :underline="false" @click="openUser(form.linkFireManagers)">查看</el-link>
          </template>
        </el-input>

      </el-form-item>
    </el-form>
    <div style="float:right">
      <el-button type="primary" @click="onEdit" v-if="type === 'view' ">修改</el-button>
      <el-button type="primary" :loading="loading"  @click="postBuildingInfo" v-if="type === 'edit' ">儲存</el-button>
      <el-button type="info" @click="onCancel" v-if="type === 'edit' ">取消</el-button>
    </div>
  </div>
</template>
<script>
import Building from '@/object/building'
import { mapGetters } from 'vuex'
import constant from '@/constant/index'

export default {
  computed: {
    ...mapGetters([
        'device',
        'buildingid',
        'buildingusers',
        'buildinginfo'
    ]),
    label() {
      if (this.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    changeUserName(){ //住戶名稱
      return function (val) {
        if(val !== null){
          return val.map(item=>{ return item.getNameOfHouse() }).toString()
        }
        return ''
      } 
    },
    // changeSelectList(){
    //   return function (value) {
    //     return this.buildingusers.map(v => {
    //       this.$set(v, 'value', v.getID()) 
    //       this.$set(v, 'label', v.getName()) 
    //       this.$set(v, 'id', v.getID()) 
    //       return v
    //     })
    //   }
    // }
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
      if (!numberReg.test(value)) {
        callback(new Error('請輸入正確格式'))
      } else if (value == '') {
        rule.name == 'area' ? callback(new Error('請輸入面積')) : callback(new Error('請輸入高度'))
      } else {
        callback()
      }
    }
    const validateText = (rule, value, callback) => {
      if (value == '' || value == undefined) {
        rule.name == 'buildingName' ? callback(new Error('請輸入名稱')) : 
        rule.name == 'address' ? callback(new Error('請輸入地址')) : callback(new Error('請輸入執照字號'))
      } else {
        callback()
      }
    }
    return {
      buildingUsers:[],
      origin: {},
      form: {
        linkOwners:[],
        linkFireManagers:[]
      },
      type: 'view',
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
      linkOwners:'',
      linkFireManagers:'',
      loading:false,
      options:constant.AreaCode,
      addressValue:[]
    }
  },
  watch:{
    buildinginfo:{
      handler:async function(){
        if(this.buildinginfo.length){
          this.form = new Building(this.buildinginfo[0])
        }
      },
      immediate:true
    },
    buildingusers:{
      handler:async function(){
        console.log(JSON.stringify(this.buildingusers))
        this.buildingUsers = this.buildingusers.map(v => {
              this.$set(v, 'value', v.getID()) 
              this.$set(v, 'label', v.getNameOfHouse()) 
              this.$set(v, 'id', v.getID())
              return v
        })
        console.log(JSON.stringify(this.buildingUsers))
      },
      immediate:true
    }
  },
  methods: {
    openDialog() {
      this.$emit('handleBuildingInfo', 'empty', '')
    },
    openUser(id) {
      this.$emit('handleBuildingInfo', 'open', id)
    },
    onEdit() {
      this.type = 'edit'
      this.origin = JSON.stringify(this.form)
      this.linkOwners = []
      this.form.linkOwners.forEach(item=>{ this.linkOwners.push(item.id) })
      this.linkFireManagers = []
      this.form.linkFireManagers.forEach(item=>{ this.linkFireManagers.push(item.id) })
      this.form.linkOwners = this.linkOwners
      this.form.linkFireManagers = this.linkFireManagers
    },
    async postBuildingInfo() {
      var array = []
      this.linkOwners.forEach(item=>{ array.push({ id:item.id == undefined ? item : item.id }) })
      this.form.linkOwners = array
      array = []
      this.linkFireManagers.forEach(item=>{ array.push({ id:item.id == undefined ? item : item.id }) })
      this.form.linkFireManagers = array
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          await this.form.update()
          this.addressValue = []
          var data = await Building.get()
          this.$store.dispatch('building/setbuildingarray',data)
          this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
          this.$message('更新成功')
          this.type = 'view'
        }
      })
    },
    onCancel() {
      this.type = 'view'
      this.addressValue = []
      this.form = new Building(JSON.parse(this.origin))
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleChange(value){
      this.form.address = value[0]+value[1]
    }
  }
}

</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}
.buildinginfo{
  height:600px;
  overflow-x: hidden;
  overflow-y: auto;
}

</style>

