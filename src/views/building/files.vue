<template>
  <div class="editor-container">
    <el-col :xs="24" :sm="24" :md="24" :lg="24">
      <div class="block-wrapper-files">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="15" style="padding: 0px">
            <el-button
              type="info"
              icon="el-icon-delete"
              @click="deletefile"
              style="margin: 0px 5px"
            >
            </el-button>
            <el-radio-group v-model="type" @change="searchType">
              <el-radio-button label="總覽"></el-radio-button>
              <el-radio-button label="大樓"></el-radio-button>
              <el-radio-button label="樓層"></el-radio-button>
              <el-radio-button label="門牌"></el-radio-button>
              <el-radio-button label="維護保養"></el-radio-button>
              <el-radio-button label="檢修申報"></el-radio-button>
              <el-radio-button label="公安申報"></el-radio-button>
            </el-radio-group>
            <span style="margin-left: 10px">類型</span>
            <i
              class="el-icon-caret-top icon"
              :class="[
                { clicked: clickType == 'extName' && sortType == 'ascending' },
              ]"
              @click="sort('extName', 'ascending')"
            ></i>
            <i
              class="el-icon-caret-bottom icon"
              :class="[
                { clicked: clickType == 'extName' && sortType == 'descending' },
              ]"
              @click="sort('extName', 'descending')"
            ></i>
            <span style="margin-left: 10px">來源</span>
            <i
              class="el-icon-caret-top icon"
              :class="[
                {
                  clicked:
                    clickType == 'targetModule' && sortType == 'ascending',
                },
              ]"
              @click="sort('targetModule', 'ascending')"
            ></i>
            <i
              class="el-icon-caret-bottom icon"
              :class="[
                {
                  clicked:
                    clickType == 'targetModule' && sortType == 'descending',
                },
              ]"
              @click="sort('targetModule', 'descending')"
            ></i>
            <span style="margin-left: 10px">上傳時間</span>
            <i
              class="el-icon-caret-top icon"
              :class="[
                {
                  clicked: clickType == 'uploadTime' && sortType == 'ascending',
                },
              ]"
              @click="sort('uploadTime', 'ascending')"
            ></i>
            <i
              class="el-icon-caret-bottom icon"
              :class="[
                {
                  clicked:
                    clickType == 'uploadTime' && sortType == 'descending',
                },
              ]"
              @click="sort('uploadTime', 'descending')"
            ></i>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="9" style="padding: 0px">
            <el-input
              v-model="input"
              placeholder="請輸入關鍵字"
              style="margin-bottom: 10px; width: 100%"
              @input="search"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <div class="files" :style="{ height: filesheight }">
            <div
              v-for="(item, index) in filescopy"
              :key="item.getID()"
              class="filesdiv"
            >
              <el-checkbox v-model="deleteItem" :label="item.getID()"
                >【{{ index + 1 }}】</el-checkbox
              >
              <i
                v-if="
                  item.getExtName() == 'png' ||
                  item.getExtName() == 'jpg' ||
                  item.getExtName() == 'jpeg' ||
                  item.getExtName() == 'pdf'
                "
                class="el-icon-view"
                style="font-size: 18px"
                @click="onPreview(item)"
              />
              <span @click="downloadfile(item)" class="downloadspn">
                <span> {{ item.getFileName() }}.{{ item.getExtName() }} </span>
                <span style="float: right">
                  {{ item.getExtName() }}
                  {{ " / 檔案來源：" }}
                  {{ item.getModule() | changeModule }}
                  {{ " / 上傳時間：" + item.getUploadTime() }}
                </span>
              </span>
            </div>
          </div>
        </el-row>
        <el-row v-if="total > 0">
          <div class="pagination-container">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="limit"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-row>
      </div>
    </el-col>
    <el-dialog
      top="5vh"
      :title="dialogTitle"
      :visible.sync="previewVisible"
      width="80%"
      :modal="false"
    >
      <img v-if="type == 'image'" :src="previewPath" class="previewImg" />
      <div v-else>
        <iframe
          :src="previewPath"
          frameborder="0"
          style="width: 100%; height: 800px"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import sharemixin from "@/mixin/sharemixin";
import Files from "@/object/files";

export default {
  name: "Files",
  mixins: [sharemixin],
  computed: {
    page: function () {
      return this.listQueryParams.pageIndex || 1;
    },
    limit: function () {
      return this.listQueryParams.pageSize || 20;
    },
    total: function () {
      return this.listQueryParams.total || 0;
    },
  },
  filters: {
    changeModule: function (val) {
      console.log(val);
      var type = "";
      switch (val) {
        case "BuildingInfo":
          type = "大樓";
          break;
        case "Floors":
          type = "樓層";
          break;
        case "UsageOfFloor":
          type = "門牌";
          break;
        case "MaintainList":
          type = "維護保養";
          break;
        case "Maintain":
          type = "維護保養";
          break;
        case "ReportInspectionList":
          type = "檢修申報";
          break;
        case "ReportPublicSafeList":
          type = "公安申報";
          break;
        default:
          break;
      }
      return type;
    },
  },
  data() {
    return {
      type: "",
      dialogTitle: "",
      previewVisible: false,
      previewPath: "",
      allfiles: [],
      files: [], //初始資料
      filescopy: [],
      deleteItem: [],
      input: "",
      filesheight: "",
      type: "總覽",
      clickType: "",
      sortType: "",
      currentPage: "1",
      listQueryParams: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  watch: {
    fullscreen: {
      handler: async function () {
        this.fullscreen == true
          ? (this.filesheight = "730px")
          : (this.filesheight = "700px");
      },
      immediate: true,
    },
  },
  methods: {
    async init() {
      var data = await Files.getSearchPage(this.listQueryParams);
      this.files = data.result;
      this.allfiles = _.cloneDeep(this.files);
      this.filescopy = this.files;
      this.listQueryParams.total = data.totalPageCount;
    },
    resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 30,
        total: 0,
      };
    },
    async search() {
      //關鍵字搜尋
      // if (this.input !== "") {
      //   this.filescopy = this.filescopy.filter((item) => {
      //     if (
      //       item.fileOriginalName
      //         .toLowerCase()
      //         .includes(this.input.toLowerCase())
      //     ) {
      //       return item;
      //     }
      //   });
      // } else {
      //   this.filescopy = this.files;
      //   await this.searchType();
      // }
    },
    async searchType() {
      //檔案來源分類
      this.resetlistQueryParams();
      switch (this.type) {
        case "總覽":
          await this.init();
          break;
        case "大樓":
          this.listQueryParams.targetModule = "BuildingInfo";
          await this.init();
          break;
        case "樓層":
          this.listQueryParams.targetModule = "Floors";
          await this.init();
          break;
        case "門牌":
          this.listQueryParams.targetModule = "UsageOfFloor";
          await this.init();
          break;
        case "維護保養":
          this.listQueryParams.targetModule = "MaintainList,Maintain";
          await this.init();
          break;
        case "檢修申報":
          this.listQueryParams.targetModule = "ReportInspectionList";
          await this.init();
          break;
        case "公安申報":
          this.listQueryParams.targetModule = "ReportPublicSafeList";
          await this.init();
          break;
      }
    },
    sort(c, s) {
      //排序
      this.clickType = c;
      this.sortType = s;
      var self = this;
      if (s === "descending") {
        this.filescopy = this.filescopy.sort(function (str1, str2) {
          var s1 = str1[c] == null ? "" : str1[c];
          var s2 = str2[c] == null ? "" : str2[c];
          return self.sortRule(s2, s1);
        });
      } else {
        this.filescopy = this.filescopy.sort(function (str1, str2) {
          var s1 = str1[c] == null ? "" : str1[c];
          var s2 = str2[c] == null ? "" : str2[c];
          return self.sortRule(s1, s2);
        });
      }
    },
    sortRule(str1, str2) {
      let res = 0;
      for (let i = 0; ; i++) {
        if (!str1[i] || !str2[i]) {
          res = str1.length - str2.length;
          if (typeof str1 == "boolean" && typeof str2 == "boolean") {
            res = str1 - str2;
          }
          break;
        }
        const char1 = str1[i];
        const char1Type = this.getChartType(char1);
        const char2 = str2[i];
        const char2Type = this.getChartType(char2);

        if (char1Type[0] === char2Type[0]) {
          if (char1 === char2) {
            continue;
          } else {
            if (char1Type[0] === "zh") {
              res = char1.localeCompare(char2);
            } else if (char1Type[0] === "en") {
              res = char1.charCodeAt(0) - char2.charCodeAt(0);
            } else {
              res = char1 - char2;
            }
            break;
          }
        } else {
          res = char1Type[1] - char2Type[1];
          break;
        }
      }
      return res;
    },
    getChartType(char) {
      // 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
      if (/^[\u4e00-\u9fa5]$/.test(char)) {
        return ["zh", 300];
      }
      if (/^[a-zA-Z]$/.test(char)) {
        return ["en", 200];
      }
      if (/^[0-9]$/.test(char)) {
        return ["number", 100];
      }
      return ["others", 999];
    },
    async deletefile() {
      if (this.deleteItem.length == 0) {
        this.$message({
          message: "請選擇要刪除的檔案",
          type: "warning",
        });
      } else {
        this.$confirm("是否確定刪除該筆資料?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }).then(async () => {
          var data = { id: this.deleteItem.toString() };
          var isOk = await Files.delete(data);
          if (isOk) {
            this.$message("刪除成功");
            this.resetlistQueryParams();
            await this.init();
          }
        });
      }
    },
    async onPreview(file) {
      var filename = file.getExtName();
      var fileType = this.changeFileType(filename);
      var data;
      if (filename == "png" || filename == "jpeg" || filename == "jpg") {
        data = await Files.getImage(file.getID());
        this.type = "image";
      } else {
        data = await file.download();
        this.type = "pdf";
      }
      let url = URL.createObjectURL(new Blob([data], { type: fileType }));
      this.previewPath = url;
      this.dialogTitle = "【圖片預覽】" + file.getFileName();
      this.previewVisible = true;
    },
    async downloadfile(item) {
      var fileType = this.changeFileType(item.getExtName());
      var data = await item.download();
      let pdfUrl = URL.createObjectURL(new Blob([data], { type: fileType }));
      let link = document.createElement("a");
      link.href = pdfUrl;
      link.download = item.getFileName() + "." + item.getExtName();
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    },
    changeFileType(extName) {
      var fileType;
      switch (extName) {
        case "txt":
          fileType = "text/plain";
          break;
        case "jpg":
          fileType = "image/jpeg";
          break;
        case "jpeg":
          fileType = "image/jpeg";
          break;
        case "png":
          fileType = "image/png";
          break;
        case "pdf":
          fileType = "application/pdf";
          break;
        case "doc":
          fileType = "application/msword";
        case "docx":
          fileType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "ppt":
          fileType = "application/vnd.ms-powerpoint";
        case "pptx":
          fileType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";
          break;
        case "xls":
          fileType = "application/vnd.ms-excel";
          break;
        case "xlsx":
          fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case "rar":
          fileType = "application/x-rar-compressed";
          break;
        case "zip":
          fileType = "application/zip";
          break;
      }
      return fileType;
    },
    async handleCurrentChange(val) {
      this.listQueryParams.pageIndex = val;
      await this.init();
    },
    async changeTable(value) {
      this.isTable = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-wrapper-files {
  background: #fff;
  padding: 15px 15px;
  height: 100%;
  min-height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  .icon {
    cursor: pointer;
  }
  .clicked {
    color: #409eff;
  }
}
.previewImg {
  width: 100%;
  height: auto;
}
.files {
  width: 100%;
  height: 600px;
  overflow-x: hidden;
  overflow-y: auto;

  .filesdiv {
    padding: 8px;

    .downloadspn {
      cursor: pointer;
      color: #606266;
    }
  }

  i {
    cursor: pointer;
    padding-right: 10px;
  }
}
</style>
