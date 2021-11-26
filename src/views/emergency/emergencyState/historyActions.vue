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
            :blockData="reversedMessage"
          ></Block>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { blockmixin } from "@/mixin/index";
export default {
  mixins: [blockmixin],
  computed: {
    ...Vuex.mapGetters(["wsmsg"]),
    blockEvent() {
      return {
        //clickPagination: this.clickPagination,
        resetlistQueryParams: this.resetlistQueryParams,
      };
    },
    reversedMessage: function () {
      var list = this.actionList.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      list = list.filter(
        (item, index) =>
          index <
            this.listQueryParams.pageIndex * this.listQueryParams.pageSize &&
          index >=
            this.listQueryParams.pageSize * (this.listQueryParams.pageIndex - 1)
      );
      return list;
    },
  },
  mounted() {
    this.init();
    this.changeTable(true);
  },
  watch: {
    wsmsg: {
      handler: async function () {
        this.actionList = _.cloneDeep(this.wsmsg);
        this.listQueryParams.total = this.wsmsg.length;
      },
      immediate: true,
    },
  },
  data() {
    return {
      actionList: [],
    };
  },
  methods: {
    init() {
      this.listQueryParams.pageSize = 30;
      this.title = "historyActions";
      this.hasSearch = false;
      this.tableConfig = [
        { label: "時間", prop: "date", isHidden: false },
        { label: "系統", prop: "mode", isHidden: false },
        { label: "動作", prop: "actionName", isHidden: false },
        { label: "區域", prop: "areaName", isHidden: false },
        { label: "門牌", prop: "usageOfFloorName", isHidden: false },
        { label: "設備", prop: "deviceName", isHidden: false },
        { label: "點位", prop: "label", isHidden: false },
      ];
      this.headerButtonsName = [];
      this.isHasButtons = false;
      this.buttonsName = [];
    },
    // async clickPagination() {
    //   console.log(JSON.stringify(this.actionList));
    //   console.log(this.listQueryParams);
    // },
    async resetlistQueryParams() {
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total: 0,
      };
    },
    changeTable(value) {
      this.isTable = value;
    },
  },
};
</script>
