<template>
  <div class="app-container">
    <el-form class="buildinginfo" ref="form" :model="form" :rules="formRules" label-width="110px">
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

       <el-form-item label="所有權人" prop="ownerId">
          <el-select
           v-if="this.type === 'edit' && this.selectData.length"
            filterable
            multiple 
            v-model="form.ownerId"
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
          v-else-if="this.type === 'view' && form.ownerId == null && this.selectData.length > 0"
          ref="linkOwners"
          name="linkOwners"
          placeholder="請設定所有權人"
          disabled
          ></el-input>

          <el-button 
          v-else-if="this.selectData.length == 0"
          type="text" @click="opendialog">新增用戶</el-button>
          
          <el-input 
          v-else-if="form.linkOwners.length"
          ref="linkOwners"
          name="linkOwners"
          :placeholder="change(form.ownerId)"
          disabled
          >
          <template slot="append"><el-link :underline="false" @click="openuser(form.ownerId)">查看</el-link></template>
          </el-input>
      </el-form-item>

       <el-form-item label="防火管理人" prop="fireManagerId">
        <el-select
           v-if="this.type === 'edit' && this.selectData.length"
            filterable
            multiple
            v-model="form.fireManagerId"
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
          v-else-if="this.type === 'view' && form.fireManagerId == null && this.selectData.length>0"
          ref="linkFireManagers"
          name="linkFireManagers"
          placeholder="請設定防火管理人"
          disabled
          ></el-input>

          <el-button 
          v-else-if="this.selectData.length == 0"
          type="text" @click="opendialog">新增用戶</el-button>
          
          <el-input 
          v-else-if="form.linkFireManagers.length"
          ref="linkFireManagers"
          name="linkFireManagers"
          :placeholder="change(form.fireManagerId)"
          disabled
          >
          <template slot="append"><el-link :underline="false" @click="openuser(form.fireManagerId)">查看</el-link></template>
          </el-input>
      </el-form-item> 
      
      <el-form-item label="檢視文件">
        <div class="files">
          <div
            v-for="(item,index) in originFiles"
            :key="item.id"
          >
              <el-link 
              class="link"
              :href="downloadbufile(item.id)" target="_blank">{{ index+1 }}.{{ item.fileOriginalName }}
              </el-link>
              <span>
                <i class="el-icon-delete del" style="float:right;" @click="delbufile(item.id)" />
              </span>
          </div>
        </div>
        
         <!-- :href="downloadbufile(item.id)" target="_blank" -->
       </el-form-item>
      <el-form-item>
        <Upload
        v-on="uploadEvent"
        ></Upload>
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
import { editbuInfo,uploadbuildinginfo,downloadbufile,delbufile  } from '@/api/building'

import { mapGetters } from 'vuex'

export default {
  components:{ 
     Upload: () => import('@/components/Upload/index.vue')
  },
  props:{
      selectData: {
            type: Array
      }
  },
  computed: {
      ...mapGetters([
        'id',
        'buildingid'
      ]),
      uploadEvent(){
        return {
          subOpitonButton: this.handleUploadOption
        }
      },
      change(){
        return function (a){
          if(a.indexOf(',') !== -1){
            var str = ""
            var _array = a.split(',')
            _array.forEach(element => {
              let data = this.selectData.filter((item, index) => 
                item.id == element 
              )
              str = str.concat(data[0].label).concat(',')
            });
            str = str.substring(0,str.length-1)
            return str
          }else{
              let data = this.selectData.filter((item, index) => 
                  item.id == a 
              )
              return data[0].label
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
      origin:{},
      form:{},
      type:'view',
      formRules: {
        buildingName: [{ required: true, trigger: 'blur',validator: validateText}],
        address: [{ required: true, trigger: 'blur',validator: validateText}],
        area: [{ required: true, trigger: 'blur',validator: validateNumber}],
        height: [{ required: true, trigger: 'blur',validator: validateNumber }],
        floorsOfAboveGround: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        floorsOfUnderground: [{ required: true, trigger: 'blur', validator: vaildateInt }],
        licenseNumber:[{ required: true, trigger: 'blur',validator: validateText}],
        ownerId:[{ required: true, trigger: 'change',message:'請選擇所有權人'}],
        fireManagerId:[{ required: true, trigger: 'change',message:'請選擇防火管理人'}]
      },
      originFiles:[],
      linkOwners:''
    }
  },
  mounted(){
    this.getbuInfo()
    this.$nextTick(() => {
      this.getbufiles()
    })
  },
  methods: {
    opendialog(){
      this.$emit('subOpitonButton','createUser', '')
    },
    refreshUser(){
      this.$emit('subOpitonButton', 'refreshUser', '')
    },
    openuser(id){
      this.$emit('subOpitonButton', 'viewUser', id)
    },
    onEdit(){
      //把字串轉換成陣列
      this.$emit('subOpitonButton','edit', '')
      this.type = 'edit'
      this.origin = JSON.stringify(this.form)
      var array1 = this.form.ownerId.split(',')
      this.form.ownerId = array1 
      var array2 = this.form.fireManagerId.split(',')
      this.form.fireManagerId = array2 
    },
    onSubmit() { 
      //把陣列轉換成字串
      this.$set(this.form,'ownerId',this.form.ownerId.join(','))
      this.$set(this.form,'fireManagerId',this.form.fireManagerId.join(','))
      var _array = []
      this.$set(this.form,'linkOwners',_array)
      this.$set(this.form,'linkFireManagers',_array)
      console.log('after=>'+JSON.stringify(this.form))
      this.$refs.form.validate(valid =>{
        if(valid){
          editbuInfo(this.id,this.form).then(response => {
            console.log(JSON.stringify(response))
              this.$message('更新成功')
              this.type = 'view'
              this.getbuInfo()
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
    getbuInfo() {
      this.$api.build.apiGetBuildingInfo({uid:this.id,bid:this.buildingid}).then(response=>{
        this.refreshUser()
        this.form = response.result[0]
      })
    },
    getbufiles(){
      this.originFiles = []
      this.$api.files.apiGetBuildingFiles({bid:this.buildingid}).then(response =>{
        response.result.forEach( item => {
          this.originFiles.push(item)
        })
      })
    },
    downloadbufile(fileid){
      return "http://192.168.88.65:59119/basic/fileDownload/"+fileid
    },
    handleUploadOption(index,file){
      const formData = new FormData();
      file.forEach(item => {
        formData.append('file', item.raw)
      })
      uploadbuildinginfo(this.buildingid,this.id,formData).then(response => {
        this.$message('上傳成功')
        this.getbufiles()
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    delbufile(fileid){
      delbufile(fileid).then(response =>{
        this.$message('刪除成功')
        this.getbufiles()
      }).catch(error =>{
        console.log('error=>'+error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}

.files {
  width: 100%;
  max-height: 200px;
  overflow: auto;
}

.del {
  cursor: pointer;
}
</style>

