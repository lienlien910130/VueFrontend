export default {
  data() {
    return {
      dialogTitle: "",
      innerVisible: false,
      dialogData: [],
      dialogStatus: "",
      dialogButtonsName: [],
      dialogConfig: [],
      dialogSelect: [],
    };
  },
  computed: {
    dialogAttrs() {
      return {
        title: this.dialogTitle,
        visible: this.innerVisible,
        dialogData: this.dialogData,
        dialogStatus: this.dialogStatus,
        buttonsName: this.dialogButtonsName,
        config: this.dialogConfig,
        selectData: this.dialogSelect,
      };
    },
  },
  methods: {
    async handleDialogMixin(title, index, content, constr, apiRouter = null) {
      // index === "update" ||
      // index === "create" ||
      // index === "uploadExcelSave" ||
      // index === "updateManySave"
      var result =
        index === "update" || index === "updateManySave"
          ? apiRouter == null
            ? await content.update()
            : await content.update(apiRouter)
          : index === "create"
          ? await content.create()
          : await constr.postMany(content);
      var condition =
        index !== "uploadExcelSave"
          ? Object.keys(result).length !== 0
          : result.result.length !== 0;
      return { object: result, isSuccess: condition };
    },
    async handleDialogMixin_common(constr, isSuccess, index, content, object) {
      if (isSuccess) {
        if (index !== "updateManySave") {
          this.innerVisible = false;
        } else {
          this.dialogData.forEach((item, index) => {
            if (item.id == content.id) {
              this.dialogData.splice(index, 1, content);
            }
          });
        }
        this.excelVisible = false;
      } else {
        if (index !== "uploadExcelSave") {
          this.$message.error("該" + constr.getChName() + "已存在，請重新輸入");
        }
      }

      if (index == "uploadExcelSave" && object.repeatDataList !== undefined) {
        var list = [];
        object.repeatDataList.forEach((item) => {
          list.push(item.account);
        });
        this.$message.error(
          "【" +
            list.toString() +
            "】" +
            constr.getChName() +
            "已存在，請重新上傳"
        );
      }
    },
  },
};
