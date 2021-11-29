<template>
  <div class="editor-container">
    <div
      v-if="deviceType !== 'null'"
      style="text-align: center; margin: 8px 0px"
    >
      <template template v-for="(item, index) in buttonOptions">
        <el-button :key="index" @click="sendSelect(item)" type="danger" round>
          {{ item.name }}
        </el-button>
      </template>
    </div>
    <Select
      ref="selectFloor"
      style="margin-bottom: 10px"
      v-bind="floorselectAttrs"
      v-on:handleSelect="handleSelect"
    >
    </Select>
    <div>
      <GraphicViewer
        ref="graphicviewer"
        :canvasHeight="deviceType !== 'null' ? 350 : 0"
        :deviceType="deviceType"
        :pointarray="pointarray"
      >
      </GraphicViewer>
    </div>
    <div v-if="deviceType !== 'null' && wsmsg.length" class="list">
      <template v-for="(item, index) in reversedMessage">
        <div :key="index" style="text-align: center; padding: 5px 8px">
          <span style="display: block">時間：{{ item.date }} </span>
          <span style="display: block">
            系統：{{ item.mode }} / 點位：{{ item.label }}
          </span>
          <span style="display: block; color: red">
            {{ item.areaName }} {{ item.usageOfFloorName }} -
            {{ item.deviceName }} - {{ item.actionName }}</span
          >
          <span style="display: block"
            >--------------------------------------------------</span
          >
        </div>
      </template>
    </div>
    <!-- <img
      src="/viewer/videourl0.cgi?user=viewer&pass=viewer"
      width="100%"
      height="auto"
    /> -->
    <!-- <div v-if="deviceType !== 'null' && process == true" class="videobox">
      <img
        src="/viewer/videourl0.cgi?user=viewer&pass=viewer"
        width="100%"
        height="auto"
      />
    </div> -->
  </div>
</template>
<script>
import { Floors } from "@/object";
import idb from "@/utils/indexedDB";
import { getDevice } from "@/utils/auth";
import ws from "@/utils/socket";
import DrawingControl from "@/object/drawingControl";

export default {
  name: "EmergencyGraphic",
  components: {
    GraphicViewer: () => import("@/components/Graphic/viewer.vue"),
  },
  computed: {
    ...Vuex.mapGetters([
      "options",
      "process",
      "wsmsg",
      "floor_record",
      "buildingfloors",
    ]),
    reversedMessage: function () {
      return this.actionList.reverse();
    },
    deviceType: function () {
      return getDevice();
    },
    floorselectAttrs() {
      return {
        selectData: this.selectData,
        title: "GraphicViewer",
      };
    },
  },
  async created() {
    await this.initsocket();
    this.$store.dispatch("app/toggleDevice", "mobile");
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
  },
  async mounted() {
    await this.init();
  },
  watch: {
    options: {
      handler: async function () {
        this.buttonOptions = _.cloneDeep(this.options);
      },
      immediate: true,
    },
    wsmsg: {
      handler: async function () {
        if (this.wsmsg.length) {
          this.actionList = _.cloneDeep(this.wsmsg);
        }
      },
      immediate: true,
    },
    process: {
      handler: async function () {
        await this.changeProcessFloorId();
      },
      immediate: true,
    },
  },
  data() {
    return {
      actionList: [],
      buttonOptions: [],
      floorId: null,
      selectData: [],
      pointarray: [],
    };
  },
  methods: {
    async initsocket() {
      if ("WebSocket" in window) {
        if (this.$socket.backWs.$ws == null) {
          this.$socket.initWebSocket();
        }
        if (this.$socket.processWs.$ws == null) {
          await this.getMToken();
        }
      } else {
        console.log("您的瀏覽器不支援 WebSocket!");
      }
    },
    async getMToken() {
      const _this = this;
      this.$messaging
        .getToken({
          vapidKey:
            "BMu0NsMpDOJfRkGUVC1kwS--OOjkM1y7x8j9BJj86J505uDUeUHI05zTqzoj_fM896_QKSLGd-n4Xsq1md5QBDk",
        })
        .then(async function (currentToken) {
          if (currentToken) {
            console.log("currentToken", currentToken);
            await _this.$store.dispatch("user/saveMToken", currentToken);
            _this.$socket.initProcessWebSocket();
          }
        })
        .catch(function (err) {
          console.log("err", err);
        });
    },
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
      await this.changeProcessFloorId();
    },
    async changeProcessFloorId() {
      if (this.process) {
        var floor = this.selectData.filter((item) => {
          return item.id == ws.processWs.floorId;
        })[0];
        await this.handleSelect(floor);
        this.$refs.selectFloor.setDefaultValue(ws.processWs.floorId);
      }
    },
    sendSelect(option) {
      console.log(option);
      var temp = { id: option.id, name: option.name };
      this.$socket.sendProcess(temp);
    },
    async handleSelect(content) {
      if (content == undefined) {
        return false;
      }
      var floor = await Floors.getOfId(content.id);
      this.pointarray = await DrawingControl.getOfFloor(content.id);
      var obj = await floor.getGraphicFiles();
      if (floor.getImageID() == null) {
        this.$message.error("該樓層尚未設定圖控相關資料");
      } else {
        var data = await idb.loadCacheImage(floor.getImageID());
        this.$nextTick(() => {
          this.$refs.graphicviewer.loadBackgroundImage(obj.codeContent, data);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  margin: 5px;
  border: 2px #ccc solid;
  border-radius: 10px;
  height: 200px;
  background-color: #eee;
  overflow-y: auto;
}
</style>
