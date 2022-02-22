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
import { blockmixin, dialogmixin, sharemixin, excelmixin } from "@/mixin/index";
import { SampleNodeList } from "@/object/index";

export default {
  name: "Device",
  mixins: [sharemixin, blockmixin, dialogmixin, excelmixin],
  computed: {
    blockEvent() {
      return {
        handleBlock: this.handleBlock,
        clickPagination: this.getSampleNode,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
  },
  methods: {
    async init() {
      this.title = "instruction";
      this.tableConfig = SampleNodeList.getTableConfig();
      await this.getSampleNode();
    },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
      await this.getSampleNode();
    },
    async getSampleNode() {
      var data = await SampleNodeList.getSearchPage(this.listQueryParams);
      this.blockData = data.result;
      this.listQueryParams.total = data.totalPageCount;
    },
    async handleBlock(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogConfig = this.tableConfig;
      this.dialogData = [];
      if (index === "delete" || index === "deleteMany") {
        var isDelete = await this.handleBlockMixin(
          title,
          index,
          content,
          SampleNodeList
        );
        if (isDelete) {
          await this.getSampleNode();
        }
      } else {
        await this.handleBlockMixin(title, index, content, SampleNodeList);
      }
    },
    async handleDialog(title, index, content) {
      //Dialog相關操作
      console.log(title, index, JSON.stringify(content));
      if (index !== "cancel") {
        const { object, isSuccess } = await this.handleDialogMixin(
          title,
          index,
          content,
          SampleNodeList
        );
        if (isSuccess) {
          await this.getSampleNode();
        }
        await this.handleDialogMixin_common(
          SampleNodeList,
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
    },
  },
};
</script>
