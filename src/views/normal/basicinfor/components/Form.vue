<template>
  <div class="app-container">
    <el-form class="buildinginfo" 
    ref="form" :model="form" 
    :rules="formRules" :label-position="label" label-width="auto">
      <el-form-item label="名稱" prop="buildingName">
        <el-input ref="buildingName" name="buildingName" v-model="form.buildingName" :disabled="type === 'view' ? true : false" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input ref="address" name="address" v-model="form.address" :disabled="type === 'view' ? true : false" />
      </el-form-item>
      <el-form-item label="面積" prop="area">
        <el-input ref="area" name="area" v-model.number="form.area" :disabled="type === 'view' ? true : false" type="number">
          <template slot="append">
            m<sup>2</sup>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <el-input ref="height" name="height" v-model.number="form.height" :disabled="type === 'view' ? true : false" type="number" />
      </el-form-item>
      <el-form-item label="層數" prop="floorsOfAboveGround">
        <el-input ref="floorsOfAboveGround" name="floorsOfAboveGround" v-model.number="form.floorsOfAboveGround" 
        :disabled="true" type="number">
          <template slot="prepend">地上</template>
          <template slot="append">樓</template>
        </el-input>
        <!-- <el-input  v-model="form.floor[2]" :disabled="type === 'view' ? true : false">
          <template slot="prepend">沒有的樓層</template>
          <template slot="append">樓</template>
        </el-input> -->
      </el-form-item>
      <el-form-item prop="floorsOfUnderground">
        <el-input ref="floorsOfUnderground" name="floorsOfUnderground" v-model.number="form.floorsOfUnderground" 
        :disabled="true" type="number">
          <template slot="prepend">地下</template>
          <template slot="append">樓</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用執照字號" prop="licenseNumber">
        <el-input ref="licenseNumber" name="licenseNumber" v-model="form.licenseNumber" :disabled="type === 'view' ? true : false" />
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

        <el-input v-else-if="this.type === 'view' && form.linkOwners.length == 0 && this.buildingUsers.length > 0" 
          ref="linkOwners" name="linkOwners" placeholder="請設定所有權人" disabled></el-input>

        <el-button v-else-if="this.buildingUsers.length == 0" type="text" @click="openDialog">新增用戶</el-button>
        
        <el-input v-else-if="form.linkOwners.length" ref="linkOwners" name="linkOwners" 
        :placeholder="change(form.linkOwners)" disabled>
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
          <el-option v-for="(item,index) in buildingUsers" :key="index" :label="item.label" :value="item.id">
          </el-option>
        </el-select>

        <el-input v-else-if="this.type === 'view' && form.linkFireManagers.length == 0 && 
        this.buildingUsers.length>0" ref="linkFireManagers" name="linkFireManagers" 
        placeholder="請設定防火管理人" disabled></el-input>

        <el-button v-else-if="this.buildingUsers.length == 0" type="text" @click="openDialog">新增用戶</el-button>
        
        <el-input v-else-if="form.linkFireManagers.length" ref="linkFireManagers" name="linkFireManagers" 
        :placeholder="change(form.linkFireManagers)" disabled>
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
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
        'buildingid',
        'buildingusers',
        'buildinginfo'
    ]),
    label() {
      if (this.$store.state.app.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    change() {
      return function(value) {
        var array = []
        if(value !== null && value !== undefined && this.buildingUsers.length>0){
          value.forEach(item=>{
            var data = this.buildingUsers.filter(element=>{
              return item.id == element.id
            })
            array.push(data[0].name)
          })
          return array.toString()
        }else{
          return ""
        }
      }
    },
  },
  data() {
    const vaildateInt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('請輸入數字'));
      }
      if (!Number(value)) {
        callback(new Error('請輸入正確格式'));
      } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
          callback(new Error('請輸入正確格式'));
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
        callback(new Error('請輸入內容'))
      } else {
        callback()
      }
    }
    const validateText = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('請輸入內容'))
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
        buildingName: [{ required: true, trigger: 'blur', validator: validateText }],
        address: [{ required: true, trigger: 'blur', validator: validateText }],
        area: [{ required: true, trigger: 'blur', validator: validateNumber }],
        height: [{ required: true, trigger: 'blur', validator: validateNumber }],
        floorsOfAboveGround: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        floorsOfUnderground: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        licenseNumber: [{ required: true, trigger: 'blur', validator: validateText }],
        linkOwners: [{ required: true, trigger: 'blur', message: '請選擇所有權人' }],
        linkFireManagers: [{ required: true, trigger: 'blur', message: '請選擇防火管理人' }]
      },
      linkOwners:'',
      linkFireManagers:'',
      loading:false
    }
  },
  watch:{
    buildinginfo:{
      handler:async function(){
        this.form = this.$deepClone(this.buildinginfo[0])
      },
      immediate:true
    },
    buildingusers:{
      handler:async function(){
        this.buildingUsers = this.buildingusers.map(v => {
            this.$set(v, 'value', v.id) 
            this.$set(v, 'label', v.name) 
            this.$set(v, 'id', v.id) 
            return v
          })
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
          await this.$obj.Building.updateBuildingInfo(JSON.stringify(this.form))
          this.$store.dispatch('building/setbuildinginfo',await this.$obj.Building.getBuildingInfo())
          this.form = this.$deepClone(this.buildinginfo[0])
          this.$message('更新成功')
          this.type = 'view'
        }
      })
    },
    onCancel() {
      this.type = 'view'
      this.form = JSON.parse(this.origin)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
  }
}

</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}


</style>

