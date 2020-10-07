<template>
  <div class="app-container">
    <el-form class="buildinginfo" ref="form" :model="form" :rules="formRules" label-width="120px">
      <el-form-item label="名稱" prop="buildingName"> 
        <el-input 
        ref="buildingName"
        name="buildingName"
        v-model="form.buildingName" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input 
        ref="address"
        name="address"
        v-model="form.address" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="面積" prop="area">
        <el-input 
        ref="area"
        name="area"
        v-model.number="form.area"
        :disabled="type === 'view' ? true : false" 
        type="number">
          <template slot="append">
            m<sup>2</sup>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
       <el-input 
        ref="height"
        name="height"
        v-model.number="form.height" :disabled="type === 'view' ? true : false"
        type="number"
        />
      </el-form-item>
      <el-form-item label="層數" prop="floorsOfAboveGround">
        <el-input  
        ref="floorsOfAboveGround"
        name="floorsOfAboveGround"
        v-model.number="form.floorsOfAboveGround" :disabled="type === 'view' ? true : false"
        type="number">
          <template slot="prepend">地上</template>
          <template slot="append">樓</template>
        </el-input>
        
        <!-- <el-input  v-model="form.floor[2]" :disabled="type === 'view' ? true : false">
          <template slot="prepend">沒有的樓層</template>
          <template slot="append">樓</template>
        </el-input> -->
      </el-form-item>
      <el-form-item  prop="floorsOfUnderground">
        <el-input  
        ref="floorsOfUnderground"
        name="floorsOfUnderground"
        v-model.number="form.floorsOfUnderground" :disabled="type === 'view' ? true : false"
        type="number">
          <template slot="prepend">地下</template>
          <template slot="append">樓</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用執照字號" prop="licenseNumber">
       <el-input 
       ref="licenseNumber"
        name="licenseNumber"
       v-model="form.licenseNumber" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="所有權人" prop="linkOwners">
          <el-select
           v-if="this.type === 'edit' && this.selectData.length"
            filterable
            v-model="form.linkOwners[0]['id']"
          >
              <el-option
                  v-for="(item,index) in selectData"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
              >
              </el-option>        
          </el-select>
          <el-input 
          v-else
          ref="linkOwners"
          name="linkOwners"
          v-model="form.linkOwners[0]['name']" disabled
          >
          <template slot="append"><el-link :underline="false" @click="openuser(form.linkOwners[0]['id'])">查看</el-link></template>
          </el-input>
      </el-form-item>
      <el-form-item label="防火管理人" prop="linkFireManagers">
        <el-select
          v-if="this.type === 'edit' && this.selectData.length"
          filterable
          v-model="form.linkFireManagers[0]['id']"
        >
            <el-option
              v-for="(item,index) in selectData"
              :key="index"
              :label="item.label"
              :value="item.id"
            >
            </el-option>        
        </el-select>
        <el-input 
          v-else
          ref="linkFireManagers"
          name="linkFireManagers"
          v-model="form.linkFireManagers[0]['name']" disabled
        >
        <template slot="append"><el-link :underline="false" @click="openuser(form.linkFireManagers[0]['id'])">查看</el-link></template>
        </el-input>
      </el-form-item>
      <el-form-item label="檢視文件">
        <!-- <input multiple  type="file" @change="fileChange">
        <el-button type="primary" @click="submitupload">上傳文件</el-button> -->
        <el-upload
          ref="upload"
          action="upload"
          accept="image/jpeg,image/gif,image/png,application/pdf"
          multiple
          :file-list="fileList"
          :before-remove="beforeRemove"
          :on-change="handleChange"
          :on-success="upLoadSuccess"
          :on-error="upLoadError"
          :auto-upload="false"
          >
          <el-button slot="trigger" size="small" type="primary">選取文件</el-button>
          <el-button 
          style="margin-left: 10px;" 
          size="small" 
          type="success"
          :disabled="isDisabled" 
          @click="submitupload">上傳</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onEdit" v-if="type === 'view' ">修改</el-button>
         <el-button type="primary" @click="onSubmit" v-if="type === 'edit' ">儲存</el-button>
        <el-button @click="onCancel" v-if="type === 'edit' ">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editbuInfo,uploadbuildinginfo  } from '@/api/building'
import { mapGetters } from 'vuex'

export default {
  props:{
      information: {
            required: true
      },
      selectData: {
            type: Array
      }

  },
  computed: {
      ...mapGetters([
        'id',
        'buildingid'
      ]),
      
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
      if(!numberReg.test(value)){
        callback(new Error('請輸入正確格式'))
      }else if(value == ''){
        callback(new Error('請輸入內容'))
      }else{
        callback()
      }
    }
    const validateText = (rule, value, callback) => {
      if(value == ''){
        callback(new Error('請輸入內容'))
      }else{
        callback()
      }
    }
    return {
      fileList: [],
      origin:{},
      form:{
        id:'',
        buildingName: '',
        address: '',
        area: '',
        height: '',
        floorsOfAboveGround: '',
        floorsOfUnderground: '',
        licenseNumber:'',
        specialStorageItems:'',
        linkOwners:'',
        linkFireManagers:''
      },
      type:'view',
      formRules: {
        buildingName: [{ required: true, trigger: 'blur',validator: validateText}],
        address: [{ required: true, trigger: 'blur',validator: validateText}],
        area: [{ required: true, trigger: 'blur',validator: validateNumber}],
        height: [{ required: true, trigger: 'blur',validator: validateNumber }],
        floorsOfAboveGround: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        floorsOfUnderground: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        licenseNumber:[{ required: true, trigger: 'blur',validator: validateText}]
      },
      isDisabled:true,
      importFiles:[]
    }
  },
  watch: {
      information: function(){
        this.refresh()
      }
  },
  methods: {
    openuser(id){
      this.$emit('subOpitonButton', 'viewuser', id)
    },
    onEdit(){
        this.$emit('subOpitonButton','edit', '')
        this.type = 'edit'
        this.origin = JSON.stringify(this.form)
    },
    onSubmit() {
      console.log(JSON.stringify(this.form))
      this.$refs.form.validate(valid =>{
        if(valid){
          editbuInfo(this.id,this.form).then(respone => {
              this.$emit('subOpitonButton','update', '')
              this.$message('更新成功')
              this.type = 'view'
          }).catch(error => {
              console.log("error=>"+JSON.stringify(error))
          })
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
    refresh(){
        this.form = this.information
    },
    // fileChange(e){
    //    for (var i = 0; i < e.target.files.length; i++) {
    //       this.formData.append('file', e.target.files[i]) //用迴圈抓出多少筆再append回來
    //     }
    // },
    submitupload(file){
      const formData = new FormData();
      this.importFiles.forEach(item => {
        console.log('importFiles=>'+JSON.stringify(item))
        formData.append('file', item.raw)
      })
      console.log(formData.get('file'))
      // uploadbuildinginfo(this.buildingid,this.id,formData).then(respone => {
      //   console.log('su=>'+JSON.stringify(respone))
      //   this.importFiles = []
      // }).catch(error =>{
      //   console.log('error=>'+error)
      // })
    },
   handleChange(file, fileList) {
      this.importFiles = fileList
      if (this.importFiles.length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm('是否確定刪除 ${ file.name }？');
    },
    upLoadSuccess(response, file, fileList) {
      if (response == "ok") {
        console.log(response + "已上传" + file);
        console.log("项目添加成功");
      } else {
        console.log("项目添加失败");
      }
    },
    upLoadError(response, file, fileList) {
      console.log("项目添加失败");
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}

</style>

