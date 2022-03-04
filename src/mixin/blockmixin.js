export default {
  computed: {
    blockAttrs() {
      return {
        title: this.title,
        config: this.tableConfig,
        blockData: this.blockData,
        hasSearch: this.hasSearch,
        isTable: this.isTable,
        buttonsName: this.buttonsName,
        headerButtonsName: this.headerButtonsName,
        pageSizeList: this.pageSizeList,
      };
    },
  },
  data() {
    return {
      hasSearch: true,
      blockData: [],
      tableConfig: [],
      title: "",
      listQueryParams: {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      },
      buttonsName: [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
      ],
      headerButtonsName: [
        { name: "多筆刪除", icon: "el-icon-delete", status: "deleteMany" },
        { name: "多筆更新", icon: "el-icon-edit", status: "updateMany" },
        {
          name: "新增資料",
          icon: "el-icon-circle-plus-outline",
          status: "empty",
        },
        { name: "匯出檔案", icon: "el-icon-download", status: "exportExcel" },
        { name: "匯入檔案", icon: "el-icon-upload2", status: "uploadExcel" },
      ],
      pageSizeList: [12, 30, 50, 100],
    };
  },
  methods: {
    async handleBlockMixin(title, index, content, constr) {
      console.log("handleBlockMixin", index, content);
      this.dialogTitle = this.title;
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogStatus = "update";
        console.log("content.length", content.length);
        if (content.length !== undefined) {
          //代表不是外傳近來的
          content.forEach((item) => {
            this.dialogData.push(item);
          });
        } else {
          this.dialogData.push(content);
        }
        //this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = false;
        if (index === "delete") {
          isDelete =
            this.title == "devicePLCAddressManagement"
              ? await content.delete(true)
              : await content.delete();
        } else {
          var deleteArray = [];
          content.forEach((item) => {
            deleteArray.push(item.id);
          });
          isDelete =
            this.title == "devicePLCAddressManagement"
              ? await constr.deleteMany(deleteArray.toString(), true)
              : await constr.deleteMany(deleteArray.toString());
        }
        if (isDelete) {
          this.$message("刪除成功");
          var length = content.length !== undefined ? content.length : 1;
          var page = Math.ceil(
            (this.listQueryParams.total - length) /
              this.listQueryParams.pageSize
          );
          if (this.listQueryParams.pageIndex > page) {
            this.listQueryParams.pageIndex = page;
          }
          this.$socket.sendMsg(
            title,
            "delete",
            index === "delete" ? content.getID() : deleteArray.toString()
          );
          this.$refs.block.clearSelectArray();
          return true;
        } else {
          this.$message.error("系統錯誤");
          return false;
        }
      } else if (index === "empty") {
        this.dialogStatus = "create";
        this.dialogData.push(constr.empty());
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "exportExcel") {
        this.exportExcelData = this.blockData;
        this.excelVisible = true;
        this.excelType = "exportExcel";
      } else if (index === "uploadExcel") {
        this.excelVisible = true;
        this.excelType = "uploadExcel";
      } else if (index === "updateMany") {
        this.dialogStatus = "updateMany";
        content.forEach((item) => {
          var obj = _.cloneDeep(item);
          this.dialogData.push(obj);
        });
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "updateManySave" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "contact") {
        this.contactVisible = true;
      }
    },
  },
};
