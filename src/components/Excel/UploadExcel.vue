<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <div style="height: 20px; margin: 10px auto">拖曳檔案至此</div>
      <el-button
        :loading="loading"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        開啟資料夾
      </el-button>
      <el-button type="info" size="mini" @click="handleDownload">
        下載範例檔案
      </el-button>
      <el-button type="danger" size="mini" @click="handleSave">
        <span>儲存資料</span>
      </el-button>
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
      height="500px"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
const XLSX = require("xlsx");
export default {
  name: "UploadExcel",
  props: {
    config: {
      type: Array,
    },
    isP: {
      type: Boolean,
    },
  },
  watch: {
    config: {
      handler: async function () {
        this.headerconfig = this.config.filter(
          (item, index) => item.isUpload == true
        );
      },
      immediate: true,
    },
  },
  data() {
    return {
      headerconfig: [],
      tableData: [],
      tableHeader: [],
      loading: false,
    };
  },
  methods: {
    resetTableData() {
      this.tableData = [];
      this.tableHeader = [];
      this.headerconfig = [];
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "檔案限制大小1M",
        type: "warning",
      });
      return false;
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.loading) return;
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error("只能上傳一個檔案");
        return;
      }
      const rawFile = files[0]; // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error("只支援 .xlsx, .xls 檔案");
        return false;
      }
      this.upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },
    handleClick(e) {
      const files = e.target.files;
      const rawFile = files[0]; // only use files[0]
      if (!rawFile) return;
      this.upload(rawFile);
    },
    handleSave() {
      var result = this.tableData.map((element) => {
        var array = {};
        for (const key in element) {
          var a = this.headerconfig.filter((obj) => obj.label == key);
          if (key == "檢修專業機構名稱") {
            a = this.headerconfig.filter((obj) => obj.label == "公司名稱");
          }
          if (a.length !== 0) {
            var str = element[key];
            if (this.isP) {
              if (
                a[0].prop == "registerDate" ||
                a[0].prop == "expirationDate"
              ) {
                var list = str.split("/");
                if (parseInt(list[0]) < 1911) {
                  list[0] = parseInt(list[0]) + 1911;
                  str = list.join("-");
                }
              } else if (a[0].prop == "revocation") {
                str = str == "是" ? true : false;
              } else if (a[0].prop == "contactNumber") {
                str = str.toString();
              }
            } else {
              str = a[0].isCheck ? "{Check}" + element[key] : element[key];
            }
            this.$set(array, a[0].prop, str);
          }
        }
        return array;
      });
      var newArr = [];
      result.forEach((item) => {
        if (Object.keys(item).length) {
          newArr.push(item);
        }
      });
      if (newArr.length !== 0) {
        this.$emit("handleFilesUpload", "uploadExcelSave", "", newArr);
        this.tableData = [];
        this.tableHeader = [];
      } else {
        this.$message.error("請先上傳正確的檔案格式再儲存資料");
      }
    },
    handleDownload() {
      let a = document.createElement("a");
      a.href = "/static/excel.rar";
      a.download = "範例檔案.rar";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    upload(rawFile) {
      this.$refs["excel-upload-input"].value = null; // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile);
        return;
      }
      const before = this.beforeUpload(rawFile);
      if (before) {
        this.readerData(rawFile);
      }
    },
    readerData(rawFile) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          var xlsxLth = worksheet["!ref"];
          var stopX = xlsxLth.substr(
            xlsxLth.indexOf(":") + 1,
            worksheet["!ref"].length
          );
          workbook.Sheets[workbook.SheetNames[0]]["!ref"] = "A2:" + stopX;
          const header = this.getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          this.generateData({ header, results });
          this.loading = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },
    getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = "__EMPTY_" + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    generateData({ header, results }) {
      this.tableData = results;
      this.tableHeader = header;
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    },
  },
};
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 100%;
  height: 100px;
  margin: auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}

@media (max-width: 767px) {
  .drop {
    font-size: 16px;
  }
}
</style>
