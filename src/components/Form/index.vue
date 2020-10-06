<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="大樓名稱">
        <!-- <el-form-item :label="information.name"></el-form-item> -->
        <el-input v-model="form.name" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="大樓地址">
        <el-input v-model="form.address" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="大樓面積">
        <el-input v-model="form.ares" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="大樓高度">
       <el-input v-model="form.height" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="大樓層數">
       <el-input v-model="form.floor" :disabled="type === 'view' ? true : false"/>
      </el-form-item>
      <el-form-item label="使用執照字號">
       <el-input v-model="form.floor" :disabled="type === 'view' ? true : false"/>
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
import { editinfor  } from '@/api/building'

export default {
    props:['information'],
  data() {
    return {
      form: {
        name: '',
        address: '',
        ares: '',
        height: '',
        floor: ''
      },
      type:'view'
    }
  },
  watch: {
      information: function() {
        this.refresh()
      }
  },
  methods: {
    onEdit(){
        this.type = 'edit'
    },
    onSubmit() {
        this.$message('submit!')
        console.log("onSubmitForm=>"+JSON.stringify(this.form))
        editinfor(this.form).then(respone => {
            this.information.name = this.form.name
            this.information.name = this.form.address
            this.information.ares = this.form.ares
            this.information.height = this.form.height
            this.information.floor = this.form.floor
            this.type = 'view'
            console.log("respone=>"+respone)
        }).catch(error => {
            console.log("error=>"+error)
        })
    },
    onCancel() {
        this.type = 'view'
        this.refresh()
    },
    refresh(){
        this.form.name = this.information.name
        this.form.address = this.information.address
        this.form.ares = this.information.ares
        this.form.height = this.information.height
        this.form.floor = this.information.floor
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

