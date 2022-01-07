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
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <div class="block-wrapper">
          <People> </People>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { sharemixin, computedmixin } from "@/mixin/index";
import { SelfDefenseFireMarshallingMgmt } from "@/object";

export default {
  mixins: [sharemixin, computedmixin],
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
    },
    async getMarshallingMgmt() {
      //取得指定消防編組的細項
      var data = await SelfDefenseFireMarshallingMgmt.getSearchPage(
        this.marshallingList.getID(),
        this.tablelistQueryParams
      );
      this.tableTitle = "listOfMgmt";
      this.dialogtableConfig = SelfDefenseFireMarshallingMgmt.getTableConfig();
      this.tableData = data.result;
      this.tablelistQueryParams.total = data.totalPageCount;
    },
    async changeTable(value) {
      this.isTable = value;
    },
  },
};
</script>
