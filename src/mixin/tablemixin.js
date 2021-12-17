export default {
  computed: {
    tableAttrs() {
      return {
        title: this.tableTitle,
        visible: this.tableVisible,
        tableData: this.tableData,
        headerButtonsName: this.tableheaderButtonsName,
        buttonsName: this.tablebuttonsName,
        config: this.dialogtableConfig,
        isHasHeaderButtons: this.isHasHeaderButtons,
        tablelistQueryParams: this.tablelistQueryParams,
        hasPagination: this.hasPagination,
      };
    },
  },
  data() {
    return {
      tableTitle: "",
      tableVisible: false,
      tableData: [],
      tableheaderButtonsName: [
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
      tablebuttonsName: [
        { name: "刪除", icon: "el-icon-delete", status: "delete" },
        { name: "編輯", icon: "el-icon-edit", status: "open" },
      ],
      dialogtableConfig: [],
      isHasHeaderButtons: true,
      tablelistQueryParams: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      hasPagination: true,
    };
  },
};
