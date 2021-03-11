<template>
  <div class="editor-container">
    <el-col :xs="24" :sm="24" :md="24" :lg="7">
        <div class="block-wrapper">
            <h3>建築物</h3>
            <el-form class="buildinginfo" 
                ref="form" :model="form" 
                :rules="formRules" :label-position="label" label-width="auto">
                <el-form-item label="名稱" prop="buildingName">
                    <el-input ref="buildingName" name="buildingName" v-model="form.buildingName" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input ref="address" name="address" v-model="form.address"  />
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
                    v-model.number="form.floorsOfAboveGround" type="number" min="0">
                    <template slot="prepend">地上</template>
                    <template slot="append">樓</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="floorsOfUnderground">
                    <el-input ref="floorsOfUnderground" name="floorsOfUnderground" 
                    v-model.number="form.floorsOfUnderground" type="number" min="0">
                    <template slot="prepend">地下</template>
                    <template slot="append">樓</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="使用執照字號" prop="licenseNumber">
                    <el-input ref="licenseNumber" name="licenseNumber" v-model="form.licenseNumber" />
                </el-form-item>

                </el-form>
                <div style="float:right">
                <el-button v-if="type=='create'" type="primary" @click="onPost">新增</el-button>
                <el-button v-else type="primary" @click="onEdit">更新</el-button>
                <el-button type="info" @click="onCancel">清空</el-button>
                </div>
        </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="17">
        <div class="block-wrapper">
          <Table
            :list-query-params.sync="listQueryParams"
            v-bind="tableAttrs"
            v-on="tableEvent">
          </Table>
        </div>
    </el-col>
  </div>
</template>
<script>

export default {
  components:{
      Table: () => import('@/components/Table/index.vue'),
  },
  computed: {
    label() {
      if (this.$store.state.app.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    tableAttrs(){
      return {
        tableData: this.tableData,
        itemkey:this.itemkey,
        config:this.tableconfig,
        title:'building'
      }
    },
    tableEvent(){
      return {
          clickPagination:this.getAllBuilding,
          handleTableRow:this.handleTableRow
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
      type:'create',
      origin: {},
      form: {},
      formRules: {
        buildingName: [{ required: true, trigger: 'blur', validator: validateText }],
        address: [{ required: true, trigger: 'blur', validator: validateText }],
        area: [{ required: true, trigger: 'blur', validator: validateNumber }],
        height: [{ required: true, trigger: 'blur', validator: validateNumber }],
        floorsOfAboveGround: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        floorsOfUnderground: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        licenseNumber: [{ required: true, trigger: 'blur', validator: validateText }],
        linkOwners: [{ required: false, trigger: 'change', message: '請選擇所有權人' }],
        linkFireManagers: [{ required: false, trigger: 'change', message: '請選擇防火管理人' }]
      },
      floorsArray:[],
      listQueryParams:{
        page: 1,
        limit: 10,
        total: 0
      },
      tableData:[],
      tableconfig:[
        { label:'名稱' , prop:'buildingName'},
        { label:'地址' , prop:'address'},
        { label:'面積' , prop:'area'},
        { label:'高度' , prop:'height'},
        { label:'地上樓層' , prop:'floorsOfAboveGround'},
        { label:'地下樓層' , prop:'floorsOfUnderground'},
        { label:'使用執照字號' , prop:'licenseNumber'},
        { label:'管理權人' , prop:'linkOwners'},
        { label:'防火管理人' , prop:'linkFireManagers'}
      ]
    }
  },
  async mounted() {
    await this.getAllBuilding()
  },
  methods: {
    async getAllBuilding(){
      this.tableData = []
      var data = await this.$obj.Building.getAllBuilding()
      this.$store.dispatch('building/setbuildingarray',data)
      this.listQueryParams.total = data.length
      this.tableData = data.filter((item, index) => 
        index < this.listQueryParams.limit * this.listQueryParams.page && 
        index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort(function(x,y){
          return y.id - x.id
      })
    },
    async onPost() {
        const loading = this.$loading({
            lock: true,
            text: '建立建築物中，請稍後...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        this.floorsArray = []
        await this.crefloor('up',this.form.floorsOfAboveGround)
        await this.crefloor('down',this.form.floorsOfUnderground)
        this.$refs.form.validate(async(valid) => {
          if (valid) {
              var buildingId = await this.$obj.Building.postBuildingInfo(JSON.stringify(this.form))
              if(buildingId !== ''){
                this.$message('新增成功')
                this.onCancel()
                await this.postFloor(buildingId)
                await this.getAllBuilding()
                loading.close()
              }
          }
        })
    },
    async onEdit(){
      this.$refs.form.validate(async(valid) => {
          if (valid) {
            var isUpadte = await this.$obj.Building.updateBuildingInfo(JSON.stringify(this.form))
            if(isUpadte){
              this.$message('更新成功')
              this.onCancel()
              await this.getAllBuilding()
            }
          }
        })
    },
    async postFloor(buildingId){
      await this.$obj.Building.postBuildingFloor(buildingId,JSON.stringify(this.floorsArray))
    },
    onCancel() {
      this.form = {}
      this.type = 'create'
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
    async handleTableRow(row, option){
        console.log(row,JSON.stringify(option))
        if(option === 'open'){
          this.type = 'edit'
          this.form = this.$deepClone(row)
        }else if(option === 'delete'){
          var isOk = await this.$obj.Building.deleteBuilding(row.id)
          if(isOk){
            this.$message('刪除成功')
            await this.getAllBuilding()
          }
        }
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
    padding: 25px;
    height: 750px;
}
</style>

