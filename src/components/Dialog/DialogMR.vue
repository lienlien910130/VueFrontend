<template>
  <el-dialog
    top="5vh"
    :title="title"
    :visible.sync="visible"
    :width="dialogWidth"
    center
  >
    <div></div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClickOption(button.status)">
        <span>發送</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogMR",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    dialogWidth() {
      if (this.$store.state.app.device === "mobile") {
        return "90%";
      } else {
        return "1000px";
      }
    },
  },
};
</script>
