<template>
<div>
  <el-button type="primary" @click="OpenCreate">新增</el-button>
  <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    :key="itemkey"
    border
    highlight-current-row
    style="width: 100%;"
    empty-text="暫無資料"
            >
    <el-table-column
      fixed
      type="index">
    </el-table-column>

    <template v-for="(item,index) in config">
        <el-table-column 
          align="left" 
          :label="item.label" 
          :key="index" 
          :prop="item.prop" 
          sortable
          header-align="center"
          :width="item.width"
        >
          <template slot-scope="scope">
              <span >{{  scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
    </template>
    <!-- <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
          <el-button @click="handleUpdata(scope.row)" type="primary" size="small">編輯</el-button>
          <el-button type="info" size="small" @click="handleDelete(scope.row)">刪除</el-button>
      </template>
    </el-table-column> -->
    <el-table-column
      align="right">
      <template slot="header" >
        <el-input
          v-model="search"
          size="mini"
          placeholder="請輸入關鍵字搜尋"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="OpenEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="CancelData"
        center>

        <el-form 
        ref="dataForm"  :model="temp"  
        :label-position="label" label-width="auto" >
                <el-form-item 
                    v-for="(item, index) in config"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :rules="[
                        { required: item.mandatory, message: item.message}
                    ]"
                >
                    <el-input  
                    v-if="item.textarea == false"
                    :ref="item.prop"
                    :name="item.prop"
                    v-model="temp[item.prop]"
                    type="string">
                    </el-input>
                    <el-input  
                    v-else
                    :ref="item.prop"
                    :name="item.prop"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    v-model="temp[item.prop]"
                    type="textarea">
                    </el-input>
                </el-form-item>
        </el-form>                        
        
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="SendData()">
                儲存
            </el-button>
            <el-button type="info" @click="CancelData()">
                取消
            </el-button>
        </div> 
    </el-dialog>
</div>
</template>

<script>
export default {
  props:['tableData','itemkey','config','dialogStatus'],
  computed:{
    label() {
      if (this.$store.state.app.device === 'mobile') {
        return 'top'
      } else {
        return 'left'
      }
    },
    dialogWidth(){
      if (this.$store.state.app.device === 'mobile') {
        return "90%"
      } else {
        return "800px"
      }
    }
  },
  data(){
    return{
      search:'',
      textMap: {
        update: '編輯',
        create: '新增'
      },
      visible:false,
      temp:[]
    }
  },
  methods:{
    CancelData(){
      this.temp = {}
    },
    SendData(){
      if(this.dialogStatus == 'create'){
        this.handleCreate()
      }else{
        this.handleEdit()
      }
    },
    OpenCreate(){

    },
    OpenEdit(index,row){

    },
    handleCreate(){

    },
    handleEdit(index,row){
        
    },
    handleDelete(index,row){
      this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
         }).then(() => {
            
         })
    },
  }
}
</script>