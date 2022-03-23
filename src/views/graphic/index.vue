<template>
  <div class="graphic-container">
    <div class="graphic-editor-container">
      <el-row align="middle">
        <el-col :xs="24" :sm="24" :md="24" :lg="12">
          <Select
            style="margin-bottom: 10px"
            v-bind="floorselectAttrs"
            v-on:handleSelect="handleSelect"
          >
          </Select>
          <el-button
            v-if="type == 'view'"
            type="primary"
            size="mini"
            @click="changeType('edit')"
            :disabled="disabled"
            >編輯</el-button
          >
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="changeType('view')"
            >關閉編輯</el-button
          >
          <el-popover
            placement="left-start"
            title="快捷鍵"
            width="270"
            trigger="click"
          >
            <p class="tipck">1.【Alt】+【➚】+【滑鼠左鍵】：平移</p>
            <p class="tipck">2.【滑鼠滾輪】：放大&縮小</p>
            <p class="tipck">3.【Alt】+【S】：選取</p>
            <p class="tipck">4.【Alt】+【T】：文字</p>
            <p class="tipck">5.【Alt】+【R】：矩形</p>
            <p class="tipck">6.【Alt】+【A】：多邊形</p>
            <p class="tipck">8.【Ctrl】+【C】：複製</p>
            <p class="tipck">9.【Ctrl】+【V】：貼上</p>
            <p class="tipck">10.【Ctrl】+【Z】：上一步</p>
            <p class="tipck">11.【Ctrl】+【Y】：下一步</p>
            <p class="tipck">12.【Delete】：刪除</p>
            <p class="tipck">13.【Insert】：下載圖片</p>
            <el-button slot="reference" type="primary" size="mini"
              >快捷鍵</el-button
            >
          </el-popover>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12">
          <div style="float: right">
            <el-checkbox-group
              v-model="checkList"
              :disabled="disabled"
              style="display: inline-block"
              @change="changeViewBlock"
            >
              <el-checkbox label="未分類" border></el-checkbox>
              <el-checkbox label="警戒區" border></el-checkbox>
              <el-checkbox label="防護區" border></el-checkbox>
              <el-checkbox label="放射區" border></el-checkbox>
              <el-checkbox label="撒水區" border></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <div class="block-wrapper">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <Graphic ref="graphic" v-bind="graphicAttrs" v-on="graphicEvent">
            </Graphic>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import idb from "@/utils/indexedDB";
import { sharemixin, computedmixin } from "@/mixin/index";
import DrawingControl from "@/object/drawingControl";

export default {
  mixins: [sharemixin, computedmixin],
  computed: {
    floorselectAttrs() {
      return {
        selectData: this.selectData,
        title: "GraphicFloor",
        isSelect: this.isSelect,
      };
    },
    graphicAttrs() {
      return {
        type: this.type,
        checkList: this.checkList,
        floor: this.floor,
        pointarray: this.pointarray,
        cNodeList: this.cNodeList,
      };
    },
    graphicEvent() {
      return {
        sendFloorGraphicFile: this.sendFloorGraphicFile,
        sendSaveToSelect: this.sendSaveToSelect,
        loadFinish: this.loadFinish,
      };
    },
  },
  data() {
    return {
      codeContentId: null,
      pointarray: [], //樓層點位列表
      checkList: [], //區域選擇
      floor: null, //正在開啟的樓層
      selectData: [], //樓層選單
      disabled: true, //若樓層沒平面圖則不開啟按鈕使用
      isSelect: false, //是否有尚未儲存的資料
      type: "view", //檢視&編輯
      //跟wsg相關
      isEdit: false, //是否可編輯圖控
      cNodeList: [],
    };
  },
  watch: {
    graphicMsg: {
      handler: async function () {
        if (this.graphicMsg !== null) {
          var data = JSON.parse(this.graphicMsg.data);
          var type = data.SendType;
          var floor = data.Data.Content; //進入的樓層
          var senderName = data.SenderName;
          if (senderName !== this.name) {
            console.log(data);
            switch (type) {
              case "enterGraphic":
                if (this.type == "edit" && floor == this.floor.getID()) {
                  //監聽到有人進來，判斷是否正在編輯，有的話廣播
                  this.$socket.sendMsg(
                    "graphic",
                    "openEdit",
                    this.floor.getID()
                  );
                }
                break;
              case "openEdit":
                if (floor == this.floor.getID()) {
                  this.isEdit = true;
                }
                break;
              case "closeEdit":
                if (floor == this.floor.getID()) {
                  this.isEdit = false;
                }
                break;
            }
          }
        }
      },
      immediate: true,
    },
    process: {
      handler: async function () {
        this.disabled = this.process;
        if (this.process) {
          this.$nextTick(() => {
            this.checkList = [];
            if (this.floor !== null) {
              this.$socket.sendMsg("graphic", "closeEdit", this.floor.getID());
            }
            this.$refs.graphic.searchBlockType(this.checkList);
            this.type = "view";
          });
        }
      },
      immediate: true,
    },
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
    changeType(type) {
      if (this.process) {
        this.$message.error("現在啟動緊急應變中，請勿編輯圖控");
        return false;
      }
      //編輯/檢視
      if (!this.isEdit) {
        this.type = type;
        if (type == "edit") {
          this.checkList = ["未分類", "警戒區", "防護區", "放射區", "撒水區"];
          this.$socket.sendMsg("graphic", "openEdit", this.floor.getID());
        } else {
          this.checkList = [];
          this.$socket.sendMsg("graphic", "closeEdit", this.floor.getID());
        }
        this.$refs.graphic.searchBlockType(this.checkList);
      } else {
        this.$message.error("請勿同時編輯該樓層圖控系統");
      }
    },
    changeViewBlock() {
      //篩選區塊顯示
      this.$refs.graphic.searchBlockType(this.checkList);
    },
    //樓層事件
    async handleSelect(content) {
      console.log("handleSelect", content);
      if (this.type == "edit") {
        this.$socket.sendMsg("graphic", "closeEdit", this.floor.getID());
        this.$refs.graphic.resetCanvas();
      }
      this.type = "view";
      this.floor = content;
      this.isEdit = false;
      this.pointarray = []; //儲存樓層點位
      this.pointarray = await DrawingControl.getOfFloor(this.floor.getID());
      this.cNodeList = await DrawingControl.getCNode(this.floor.getID());
      this.sortChange({ prop: "iconId", order: "ascending" }, this.pointarray);
      var obj = await this.floor.getGraphicFiles("/drawingControl");
      this.codeContentId = obj.id;
      if (content.getImageID() == null) {
        this.changeType("view");
        this.$refs.graphic.loadBackgroundImage(obj.codeContent, "");
        this.disabled = true;
      } else {
        var data = await idb.loadCacheImage(content.getImageID());
        this.$refs.graphic.loadBackgroundImage(obj.codeContent, data);
      }
      this.$socket.sendMsg("graphic", "enterGraphic", this.floor.getID());
    },
    loadFinish() {
      this.disabled = false;
    },
    //圖控的事件
    sendSaveToSelect(val) {
      this.isSelect = val;
    },
    async sendFloorGraphicFile(state, addressArray) {
      //儲存圖控檔案，同步更新點位有無被設置
      var str = JSON.stringify(state);
      const fileContent = new File([str], this.floor.getID() + ".txt", {
        type: "",
      });
      const formData = new FormData();
      formData.append("file", fileContent);
      var isOk = await this.floor.postGraphicFiles(formData);
      if (isOk) {
        this.$message("儲存成功");
        var fire = [];
        var plc = [];
        for (var i = 0; i < addressArray.length; i++) {
          if (this.pointarray[i].systemUsed !== addressArray[i].systemUsed) {
            if (addressArray[i].type == "fire") {
              fire.push({
                id: addressArray[i].id,
                systemUsed: addressArray[i].systemUsed,
              });
            } else {
              plc.push({
                id: addressArray[i].id,
                systemUsed: addressArray[i].systemUsed,
              });
            }
          }
        }
        if (fire.length || plc.length) {
          var result = await DrawingControl.update(fire, plc);
          if (!result) {
            this.$message.error("系統錯誤");
          } else {
            this.pointarray = await DrawingControl.getOfFloor(
              this.floor.getID()
            );
          }
        }
      } else {
        this.$message.error("系統錯誤");
      }
    },
    //畫面
    async changeTable(value) {},
  },
};
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-right: 0px;
}
.graphic-container {
  height: 100%;
}
.graphic-editor-container {
  padding: 10 20px 5px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;

  .block-wrapper {
    background: #fff;
    padding: 0px 5px 10px;
  }
}
i {
  cursor: pointer;
}
.collapse-wrapper {
  background: snow;
  padding: 8px;
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}
.wrapper {
  background: snow;
  padding: 15px;
  height: 400px;
  margin-bottom: 5px;
  margin-top: 32px;
  overflow-x: hidden;
  overflow-y: auto;
}
.realtime {
  width: 100%;
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
