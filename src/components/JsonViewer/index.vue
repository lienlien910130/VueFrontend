<template>
  <el-dialog
    title="JSON數據"
    top="5vh"
    :visible.sync="dialogVisible"
    width="70%"
  >
    <br />
    <!--一个高亮显示的插件-->
    <codemirror
      :value="flowJsonData"
      :options="options"
      class="code"
    ></codemirror>
  </el-dialog>
</template>

<script>
import "codemirror/lib/codemirror.css";
import { codemirror } from "vue-codemirror";
require("codemirror/mode/javascript/javascript.js");
// const vuecodemirror = require('vue-codemirror')
export default {
  name: "JsonViewer",
  props: {
    data: Object,
  },
  data() {
    return {
      dialogVisible: false,
      flowJsonData: {},
      options: {
        mode: { name: "javascript", json: true },
        lineNumbers: true,
      },
    };
  },
  components: {
    codemirror: codemirror,
  },
  methods: {
    init() {
      this.dialogVisible = true;
      this.flowJsonData = JSON.stringify(this.data, null, 4).toString();
    },
  },
};
</script>
