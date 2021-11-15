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
    <div v-if="deviceType == 'null' && process == false">
      <Select
        style="margin-bottom: 10px"
        v-bind="floorselectAttrs"
        v-on:handleSelect="handleSelect"
      >
      </Select>
    </div>
    <div>
      <GraphicViewer
        ref="graphicviewer"
        :canvasHeight="deviceType !== 'null' ? 350 : 0"
      >
      </GraphicViewer>
    </div>
    <div v-if="deviceType !== 'null' && actionList.length" class="list">
      <template v-for="(item, index) in reversedMessage">
        <div :key="index" style="text-align: center; padding: 5px 8px">
          <span style="display: block"
            >時間：{{ item.date }} / 系統：{{ item.mode }}</span
          >
          <span style="display: block"
            >動作：{{ item.status }} / 點位：{{ item.label }}</span
          >
          <span style="display: block"
            >--------------------------------------------------</span
          >
        </div>
      </template>
    </div>
    <div v-if="deviceType !== 'null' && process == true" class="videobox">
      <img
        src="http://192.168.88.221/videourl0.cgi?user=viewer&pass=viewer"
        width="100%"
        height="auto"
      />
    </div>
  </div>
</template>
<script>
import { Floors } from "@/object";
import idb from "@/utils/indexedDB";
import store from "@/store";
import ws from "@/utils/socket";
import { getDevice } from "@/utils/auth";

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
      return this.actionList.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
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
    //await this.initsocket()
    this.$store.dispatch("app/toggleDevice", "mobile");
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
  },
  async mounted() {
    await this.init();
  },
  watch: {
    process: {
      //手機版沒有floor可以跳轉
      handler: async function () {
        if (this.process == true && ws.processWs.floorId !== null) {
          this.$nextTick(async () => {
            await this.handleSelect({ id: ws.processWs.floorId });
          });
        }
      },
      immediate: true,
    },
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
  },
  data() {
    return {
      actionList: [],
      buttonOptions: [],
      floorId: null,
      selectData: [],
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
    },
    sendSelect(option) {
      console.log(option);
      var temp = { id: option.id, name: option.name };
      this.$socket.sendProcess(temp);
    },
    async handleSelect(content) {
      var floor = await Floors.getOfId(content.id);
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