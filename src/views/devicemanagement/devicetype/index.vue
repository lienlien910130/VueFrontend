<template>
  <div class="editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="block-wrapper">
          <Block
            ref="block"
            :list-query-params.sync="listQueryParams"
            v-bind="blockAttrs"
            v-on="blockEvent"
          ></Block>
        </div>
      </el-col>
    </el-row>

    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogForm>

    <DialogExcel
      ref="dialogexcel"
      v-if="excelVisible === true"
      v-bind="excelAttrs"
      v-on:handleDialog="handleDialog"
    ></DialogExcel>
  </div>
</template>
<script>
import { changeDefaultFullType } from "@/utils/index";
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { DeviceType } from "@/object/index";

export default {
  name: "Device",
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getBuildingDevicesType,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
  },
  methods: {
    async init() {
      this.title = "devicetype";
      this.tableConfig = DeviceType.getTableConfig();
      await this.getBuildingDevicesType();
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getBuildingDevicesType();
    },
    async getBuildingDevicesType() {
      var data = await DeviceType.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async handleBlock(title, index, content) {
      //設備
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogConfig = this.tableConfig;
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          DeviceType
        );
        if (isDelete) {
          this.$store.dispatch("building/setDevice");
          await this.getBuildingDevicesType();
        }
      } else {
        await this.handleBlockMixin(title, index, content, DeviceType);
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index !== "cancel") {
        if (index !== "uploadExcelSave") {
          var array = changeDefaultFullType(content.fullType);
          content.setTypeName(array.label);
        }
        const { object, isSuccess } = await this.handleDialogMixin(
          title,
          index,
          content,
          DeviceType
        );
        if (isSuccess) {
          if (index !== "create") {
            this.$store.dispatch("building/setDevice");
          }
          await this.getBuildingDevicesType();
        }
        await this.handleDialogMixin_common(
          DeviceType,
          isSuccess,
          index,
          content,
          object
        );
      } else {
        this.closeAll();
      }
    },
    async changeTable(value) {
      this.isTable = value;
      await this.openDialogWindows();
    },
  },
};
</script>
