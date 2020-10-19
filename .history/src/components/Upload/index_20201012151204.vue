<template>
<div>
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
        <el-upload
          ref="upload"
          action="upload"
          accept="image/jpeg,image/gif,image/png,application/pdf"
          multiple
          :file-list="fileList"
          :before-remove="beforeRemove"
          :on-change="handleChange"
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
</div>
</template>

<script>
export default {
    
}
</script>