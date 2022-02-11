export default {
  computed: {
    blockAttrs() {
      return {
        hasSearch: this.hasSearch,
        blockData: this.blockData,
        config: this.tableConfig,
        title: this.title,
        isTable: this.isTable,
        isHasButtons: this.isHasButtons,
        buttonsName: this.buttonsName,
        headerButtonsName: this.headerButtonsName,
        selectSetting: this.selectSetting,
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
      isHasButtons: true,
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
    };
  },
  methods: {
    async handleBlockMixin(title, index, content, constr) {
      console.log("handleBlockMixin", index, content);
      this.dialogData = [];
      //this.dialogConfig = constr.getTableConfig();
      //console.log(this.dialogConfig);
      this.dialogTitle = this.title;
      this.dialogButtonsName = [];
      if (index === "open") {
        this.dialogStatus = "update";
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
      } else if (index === "delete" || index === "deleteMany") {
        var isDelete = false;
        if (index === "delete") {
          isDelete = await content.delete();
        } else {
          // var constr = content[0].constructor;
          var deleteArray = [];
          content.forEach((item) => {
            deleteArray.push(item.id);
          });
          isDelete = await constr.deleteMany(deleteArray.toString());
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
          // this.$store.dispatch("building/setCommittee");
          // await this.getAllAccount();
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
      }
    },
    changeConstr() {},
  },
};
