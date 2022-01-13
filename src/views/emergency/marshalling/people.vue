<template>
  <div class="editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <Select
          style="margin-bottom: 10px"
          v-bind="floorselectAttrs"
          v-on:handleSelect="handleSelect"
        >
        </Select>
        <el-button
          type="primary"
          @click="
            handleMarshallingMgmt('selfDefenseFireMarshallingMgmt', 'empty', '')
          "
          >新增</el-button
        >
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="block-wrapper">
          <template v-for="(item, index) in peopleList">
            <People :marshallingClass="item" :key="index"> </People>
          </template>
        </div>
      </el-col>
    </el-row>
    <DialogForm
      ref="dialogform"
      v-if="innerVisible === true"
      v-bind="dialogAttrs"
      v-on:handleDialog="handleMarshallingMgmt"
    ></DialogForm>
  </div>
</template>

<script>
import { sharemixin, computedmixin, dialogmixin } from "@/mixin/index";
import { SelfDefenseFireMarshallingMgmt } from "@/object";

export default {
  mixins: [sharemixin, computedmixin, dialogmixin],
  computed: {
    floorselectAttrs() {
      return {
        selectData: this.selectData,
        title: "peopleList",
        isSelect: this.isSelect,
      };
    },
  },
  data() {
    return {
      isSelect: false,
      selectData: [],
      floor: null,
      peopleList: [],
    };
  },
  created() {
    this.$store.dispatch("app/toggleDevice", "mobile");
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
  },
  methods: {
    async init() {
      if (this.floor_record == 0) {
        await this.$store.dispatch("building/setFloors");
        await this.$store.dispatch("record/saveFloorRecord", 1);
      }
      this.selectData = this.buildingfloors.map((v) => {
        this.$set(v, "value", v.getID());
        this.$set(v, "label", v.getName());
        this.$set(v, "id", v.getID());
        return v;
      });
    },
    async handleSelect(content) {
      //起始點
      console.log(content);
      this.floor = content;
      await this.getMgmt();
    },
    async getMgmt() {
      this.peopleList = await SelfDefenseFireMarshallingMgmt.getOfFloor(
        this.floor.getID()
      );
    },
    async handleMarshallingMgmt(title, index, content) {
      console.log(title, index, JSON.stringify(content));
      this.dialogData = [];
      this.dialogTitle = "selfDefenseFireMarshallingMgmt";
      this.dialogConfig = SelfDefenseFireMarshallingMgmt.getTableConfig();
      this.dialogButtonsName = [];
      if (index === "empty") {
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "create" },
          { name: "返回", type: "info", status: "cancel" },
        ];
        this.dialogData.push(SelfDefenseFireMarshallingMgmt.empty());
        this.innerVisible = true;
        this.dialogStatus = "create";
      } else if (index === "open") {
        this.dialogData.push(content);
        this.dialogButtonsName = [
          { name: "儲存", type: "primary", status: "update" },
          { name: "取消", type: "info", status: "cancel" },
        ];
        this.innerVisible = true;
        this.dialogStatus = "update";
      } else if (index === "delete") {
        var isDelete = await content.delete();
        if (isDelete) {
          this.$message("刪除成功");
          if (
            this.listQueryParams.pageIndex !== 1 &&
            this.blockData.length == 1
          ) {
            this.listQueryParams.pageIndex = this.listQueryParams.pageIndex - 1;
          }
          await this.getMgmt();
          // await this.marshallingList.patchFloor();
        } else {
          this.$message.error("系統錯誤");
        }
      } else if (index === "create" || index === "update") {
        var isOk =
          index === "update" ? await content.update() : await content.create();
        if (isOk) {
          index === "update"
            ? this.$message("更新成功")
            : this.$message("新增成功");
          await this.getMgmt();
          this.innerVisible = false;
          // await this.marshallingList.patchFloor();
        } else {
          this.$message.error("班別名稱已存在，請重新輸入");
        }
      } else if (index === "cancel") {
        this.innerVisible = false;
        this.excelVisible = false;
      }
    },

    // async getMarshallingMgmt() {
    //   //取得指定消防編組的細項
    //   var data = await SelfDefenseFireMarshallingMgmt.getSearchPage(
    //     this.marshallingList.getID(),
    //     this.tablelistQueryParams
    //   );
    //   this.tableTitle = "listOfMgmt";
    //   this.dialogtableConfig = SelfDefenseFireMarshallingMgmt.getTableConfig();
    //   this.tableData = data.result;
    //   this.tablelistQueryParams.total = data.totalPageCount;
    // },
    async changeTable(value) {
      this.isTable = value;
    },
  },
};
</script>
