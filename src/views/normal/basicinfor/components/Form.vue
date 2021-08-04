<template>
  <div>
    <el-form class="buildinginfo" 
    ref="form" :model="form" 
    :label-position="label" 
    label-width="auto"> 
      <el-form-item label="名稱" prop="buildingName">
        <span>{{ form.buildingName }}</span>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <span>{{ form.address }}</span>
      </el-form-item>
      <el-form-item label="面積" prop="area">
        <span>{{ form.area }}</span>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <span>{{ form.height }}</span>
      </el-form-item>
      <el-form-item label="層數" prop="floorsOfAboveGround">
        <span>地上 {{ form.floorsOfAboveGround }} 層，地下 {{ form.floorsOfUnderground }} 層</span>
      </el-form-item>
      <el-form-item label="場所電話" prop="contactPhone">
        <span>{{ form.contactPhone }}</span>
      </el-form-item>
      <el-form-item label="場所用途" prop="useful">
        <span>{{ form.useful }}</span>
      </el-form-item>
      <el-form-item label="使用執照字號" prop="licenseNumber">
        <span>{{ form.licenseNumber }}</span>
      </el-form-item>
      <el-form-item label="所有權人" prop="linkOwners">
        <span @click="openUser(form.linkOwners)" 
        style="color:#66b1ff;cursor:pointer">
          {{ changeUserName(form.linkOwners) }}
        </span>
      </el-form-item>
      <el-form-item label="防火管理人" prop="linkFireManagers">
        <span @click="openUser(form.linkFireManagers)" 
        style="color:#66b1ff;cursor:pointer">
        {{ changeUserName(form.linkFireManagers) }}
        </span>
      </el-form-item>
    </el-form>
    <div style="float:right">
      <el-button type="primary" @click="handleClick">修改</el-button>
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
          return val.map(item=>{ return item.getName() }).toString()
        }
        return ''
      } 
    }
  },
  data() {
   
    return {
      buildingUsers:[],
      origin: {},
      form: {
        linkOwners:[],
        linkFireManagers:[]
      },
      type: 'view',
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
        this.buildingUsers = this.buildingusers.map(v => {
              this.$set(v, 'value', v.getID()) 
              this.$set(v, 'label', v.getName()) 
              this.$set(v, 'id', v.getID())
              return v
        })
      },
      immediate:true
    }
  },
  methods: {
    handleClick(){
      this.$emit('handleBuildingInfo', 'open', this.form)
    },
    openUser(id) {
      this.$emit('handleBuildingInfo', 'openUser', id)
    },
    openDialog() {
      this.$emit('handleBuildingInfo', 'empty', '')
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
          this.$store.dispatch('building/setBuildingList',data)
          this.$store.dispatch('building/setBuildingInfo',await Building.getInfo())
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
  height:590px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top:5px;
}

</style>

