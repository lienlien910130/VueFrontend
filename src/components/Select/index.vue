<template>
  <el-select
    ref="selbud"
    v-model="defaultvalue"
    @change="currentSel"
    placeholder="請選擇"
    filterable
    :disabled="isSelect"
  >
    <el-option
      v-if="title == 'contactunit' || title == 'equipment'"
      label="全部"
      key=""
      value="all"
    ></el-option>
    <el-option
      v-for="(item, index) in selectData"
      :key="index"
      :label="item.getName()"
      :value="item.getID()"
    >
    </el-option>
  </el-select>
</template>

<script>
import ws from "@/utils/socket";

export default {
  name: "Select",
  props: {
    selectData: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultvalue: "",
    };
  },
  watch: {
    selectData: {
      handler: async function () {
        if (this.title == "Building" || this.title == "GraphicFloor") {
          if (this.selectData.length) {
            this.defaultvalue = this.selectData[0].getID();
            this.currentSel(this.defaultvalue);
          }
        } else if (this.title == "contactunit" || this.title == "equipment") {
          this.defaultvalue = "all";
        } else if (this.title == "GraphicViewer") {
          if (this.selectData.length) {
            this.defaultvalue =
              ws.processWs.floorId == null
                ? this.selectData[0].getID()
                : ws.processWs.floorId;
            if (ws.processWs.floorId == null) {
              this.currentSel(this.defaultvalue);
            }
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    currentSel(select) {
      const tempData = this.selectData.filter(
        (item, index) => item.id == select
      );
      this.$emit("handleSelect", tempData.length > 0 ? tempData[0] : undefined);
    },
    setDefaultValue(value) {
      this.defaultvalue = value;
    },
  },
};
</script>
