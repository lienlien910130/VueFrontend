<template>
  <div class="maintenancePlanAdd">
    <div class="middle">
      <header v-if="loadFinsh">
        <HeaderOperate
          ref="operate"
          :operateMenu="operateMenu"
          @handleOperateMenu="handleOperateMenu"
        />
      </header>
      <div class="section" ref="section" style="height: 100%">
        <div id="canvasdiv" ref="canvasdiv" class="canvasdiv">
          <canvas id="canvas"></canvas>
        </div>
      </div>
    </div>
    <div v-if="deviceType !== 'null' && process == true" class="videobox">
      <template v-for="(item, index) in viewList">
        <template v-if="index == 0">
          <span :key="index" style="margin-top: 8px">{{ item.name }}</span>
          <img
            :src="item.url"
            style="width: 100%; height: auto"
            :key="index"
            @click="setView(item, index)"
          />
        </template>
        <template v-else>
          <img
            :src="item.url"
            style="width: 20%; height: auto"
            :key="index"
            @click="setView(item, index)"
          />
        </template>
      </template>
    </div>

    <el-dialog
      top="5vh"
      :title="dialogTitle"
      :visible.sync="previewVisible"
      width="80%"
    >
      <el-image :src="previewPath" class="previewImg">
        <div slot="placeholder" class="image-slot">
          載入中<span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import constant from "@/constant/development";
const fabric = require("fabric");
import { getUUID } from "@/utils";
import ws from "@/utils/socket";
import { DeviceAddressManagement } from "@/object";

export default {
  name: "GraphicViewer",
  props: {
    canvasHeight: {
      type: Number,
      default: 0,
    },
    deviceType: {
      type: String,
    },
    pointarray: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    ...Vuex.mapGetters([
      "wsmsg",
      "realTimeaction",
      "isReturn",
      "process",
      "waitingNode",
    ]),
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");
    this.canvas.setWidth(1650);
    this.canvas.setHeight(0);
    this.canvas.skipTargetFind = false;
    this.canvas.selection = false;
    this.canvas.allowTouchScrolling = true;
    this.canvas.on("mouse:down", this.mouseDown);
    this.canvas.on("mouse:up", (e) => {
      this.moving = false;
      this.previousTouch = null;
    });
    this.canvas.on("mouse:move", this.mouseMove);
    this.canvas.on("selection:created", this.selectioncreatedandupdated);
    this.canvas.on("selection:updated", this.selectioncreatedandupdated);
    // this.canvas.on("selection:cleared", this.selectioncleared);
  },
  watch: {
    realTimeaction: {
      //已開啟後監聽的動畫
      handler: async function () {
        if (this.realTimeaction.length) {
          this.$nextTick(() => {
            for (let ac of this.realTimeaction) {
              this.actionObj(ac.label, ac.status);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
    // isReturn: {
    //   handler: async function () {
    //     if (this.isReturn == true) {
    //     }
    //   },
    //   immediate: true,
    // },
    waitingNode: {
      handler: async function () {
        if (this.waitingNode.length) {
          this.inPositionList = _.cloneDeep(this.waitingNode).filter((item) => {
            return item.nType == 62 || item.nType == 61;
          });
          this.$nextTick(() => {
            this.setInPosition();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      loadFinsh: false,
      operateMenu: constant.GraphicEmergencyViewer,
      pausePanning: false,
      moving: false,
      canvas: {},
      objId: null,
      blockType: "未分類",
      objectName: "", //圖層標題
      addressId: "",
      connectId: "",
      srcId: "",
      hasAnimationStarted: false,
      leftsize: 1,
      topsize: 1,
      canvasheight: 0,
      lastMovePos: { x: 0, y: 0 },
      relativeMouseX: 0,
      relativeMouseY: 0,
      zoom: window.zoom ? window.zoom : 1,
      zoomPoint: new fabric.Point(0, 0), //初始时缩放原点的位置设为（0,0），这是页面的左上顶点
      lastzoomPoint: { x: 0, y: 0 }, //初始时，前一次缩放原点同样为(0,0)
      lastmousePoint: { x: 0, y: 0 }, //进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
      lastzoom: 1, //表示为上一次的缩放倍数，此刻设为1
      previousTouch: null,
      viewList: [],
      inPositionList: [],
      //攝影機視窗
      dialogTitle: "",
      previewVisible: false,
      previewPath: "",
      monitor: 0,
    };
  },
  methods: {
    async loadBackgroundImage(objects, imgsrc) {
      //載入背景圖
      var isListenWheel = false;
      if (this.canvasHeight == 0) {
        document.getElementById("canvasdiv").style.minHeight =
          "calc(100vh - 170px)";
        isListenWheel = true;
      }
      this.canvas.setWidth(this.$refs.canvasdiv.clientWidth);
      this.canvasheight =
        this.canvasHeight == 0
          ? this.$refs.canvasdiv.clientHeight
          : this.canvasHeight;
      this.canvas.setHeight(this.canvasheight);
      this.leftsize = this.$refs.canvasdiv.clientWidth / 1650;
      this.topsize = this.canvasheight / 750;
      this.canvas.clear();
      this.resetCanvas();
      fabric.Image.fromURL(imgsrc, (img) => {
        const background = img.set({
          scaleX: this.canvas.width / img.width,
          scaleY: this.canvas.height / img.height,
        });
        this.canvas.setBackgroundImage(
          background,
          this.canvas.renderAll.bind(this.canvas)
        );
        this.canvas.renderAll();
      });
      await this.loadObjects(objects);
      if (isListenWheel) {
        this.canvas.on("mouse:wheel", (e) => {
          this.zoomCanvas("", e);
        });
      }
    },
    async loadObjects(val) {
      //載入初始物件，預設關閉顯示
      if (val !== null && val !== undefined) {
        var self = this;
        var obj = JSON.parse(val);
        fabric.util.enlivenObjects(obj, async function (object) {
          var origRenderOnAddRemove = self.canvas.renderOnAddRemove;
          self.canvas.renderOnAddRemove = false;
          for (let i = 0; i < object.length; i++) {
            if (object[i].srcId !== "") {
              var item = constant.Equipment.filter(
                (item, index) => item.id == object[i].srcId
              )[0];
              var item = require("@/icons/svg/fire_" + item.id + ".svg");
              var text = item.default.content.replace(/http:\/\//g, "https://");
              text = text.replace("symbol", "svg");
              text = text.replace("/symbol", "/svg");
              fabric.loadSVGFromString(text, function (objects, options) {
                var svgItems = fabric.util.groupSVGElements(objects, options);
                svgItems.set({
                  scaleX: object[i].scaleX * self.leftsize,
                  scaleY: object[i].scaleY * self.topsize,
                  top: object[i].top * self.topsize,
                  left: object[i].left * self.leftsize,
                  hasControls: false,
                  padding: 5,
                  visible: false,
                  flipY: object[i].flipY,
                  flipX: object[i].flipX,
                  angle: object[i].angle,
                  selectable: true,
                });
                self.canvas.add(svgItems);
                self.addCustomize(
                  svgItems,
                  object[i].objId,
                  object[i].objectName,
                  object[i].blockType,
                  object[i].srcId,
                  object[i].addressId,
                  object[i].connectId,
                  object[i].status,
                  object[i].action
                );
                self.canvas.renderAll();
              });
            } else {
              object[i].visible = false;
              object[i].scaleX = object[i].scaleX * self.leftsize;
              object[i].scaleY = object[i].scaleY * self.topsize;
              object[i].top = object[i].top * self.topsize;
              object[i].left = object[i].left * self.leftsize;
              object[i].selectable = false;
              self.canvas.add(object[i]);
              self.addCustomize(
                object[i],
                object[i].objId,
                object[i].objectName,
                object[i].blockType,
                object[i].srcId,
                object[i].addressId,
                object[i].connectId,
                object[i].status,
                object[i].action
              );
            }
          }
          self.canvas.renderOnAddRemove = origRenderOnAddRemove;
          self.canvas.renderAll();
          self.loadFinsh = true;
          var actionList = ws.processWs.addressChangeList.filter((item) => {
            return item.system !== "R400";
          });
          if (actionList.length !== 0) {
            //打開所有攝影機
            var o3Object = self.canvas.getObjects().filter((obj) => {
              return obj.srcId == "o3";
            });
            o3Object.forEach((item) => {
              item.set({ visible: true });
            });
            for (let [index, value] of actionList.entries()) {
              var isPLC = value.internet.indexOf("P");
              var label = [
                value.internet,
                value.system,
                value.address,
                value.number,
              ];
              if (isPLC !== -1) {
                label.push(value.memeryLoc);
              }
              label = label.filter(Boolean).join("-");
              if (index == 0) {
                //初始起點定位
                self.setStartView(label);
              }
              self.actionObj(label, value.status);
            }
            self.actionObj("001-01-001-1", 2);
          }
          if (self.inPositionList.length) {
            self.setInPosition();
          }
        });
      }
    },
    selectioncreatedandupdated(e) {
      //顯示資訊-訊號內幾點幾分動作什麼
      console.log(e);
      var items = this.canvas.getActiveObjects();
      if (items.length) {
        if (items[0].srcId == "p6" || items[0].srcId == "p7") {
          this.openPositionInfo(items[0]);
        } else {
          this.openInfo(items[0]);
        }
        if (items[0].srcId == "o3") {
          //點選攝影機
          this.dialogTitle = items[0].objectName;
          this.previewPath = items[0].connectId[0];
          this.previewVisible = true;
        }
      }
    },
    openInfo(objItem) {
      const h = this.$createElement;
      const bigData = [];
      var info = this.pointarray.filter((item) => {
        var str = [item.internet, item.system, item.address, item.number];
        if (item.type == "plc") {
          str.push(item.memeryLoc);
        }
        str = str.filter(Boolean).join("-");
        return str == objItem.addressId;
      });
      //先篩選出該樓層點位的資料 > 看是fire or plc 的config > 讀取該點位的list
      if (info.length) {
        //有該點位的資料
        var config =
          info[0].type == "fire"
            ? DeviceAddressManagement.getTableConfig()
            : DeviceAddressManagement.getPLCTableConfig();
        var data = new DeviceAddressManagement(info[0]);
        config = config.filter((item) => {
          return item.isViewerInfo == true;
        });
        var array = [];
        config.forEach((item) => {
          var value = "";
          if (item.format == "addressdeviceSelect") {
            value = data.getDevicesName();
          } else if (item.format == "floorOfHouseSelect") {
            value = data.getUsageOfFloorsName();
          } else {
            value = data[item.prop];
          }
          array.push({
            label: item.label,
            value: value,
          });
        });
        const infoList = [];
        array.forEach((obj) => {
          infoList.push(
            h("p", { style: "width:100%" }, [
              h(
                "span",
                {
                  style:
                    "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.label
              ),
              h(
                "span",
                {
                  style:
                    "width:60%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.value
              ),
            ])
          );
        });
        if (infoList.length) {
          bigData.push(
            h(
              "div",
              { style: "border:1px solid;padding:10px;margin-bottom:5px" },
              infoList
            )
          );
        }
      }
      var detailList = this.wsmsg.filter((item) => {
        return item.label == objItem.addressId;
      });
      if (detailList.length) {
        const actionList = [];
        detailList.forEach((obj) => {
          actionList.push(
            h("p", { style: "width:100%" }, [
              h(
                "span",
                {
                  style:
                    "width:60%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.date
              ),
              h(
                "span",
                {
                  style:
                    "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.actionName
              ),
            ])
          );
        });
        if (actionList.length) {
          bigData.push(
            h(
              "div",
              { style: "border:1px solid;padding:10px;margin-bottom:5px" },
              actionList
            )
          );
        }
      }
      if (bigData.length) {
        this.$msgbox({
          title: "點位資訊",
          message: h(
            "div",
            { style: "max-height:500px;overflow-x:hidden;overflow-y:auto;" },
            bigData
          ),
          showCancelButton: false,
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    openPositionInfo(objItem) {
      const h = this.$createElement;
      const bigData = [];
      var temp = [];
      var infoList = [];
      objItem.connectId.forEach((con) => {
        var list = con.split(",");
        infoList.push(
          h("p", { style: "width:100%" }, [
            h(
              "span",
              {
                style:
                  "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
              },
              list[0]
            ),
            h(
              "span",
              {
                style:
                  "width:60%;display:inline-block;vertical-align:top;word-break:break-all",
              },
              list[1]
            ),
          ])
        );
        var processList = this.inPositionList.filter((item) => {
          return (
            item.linkAccountList.findIndex((ac) => {
              return ac.id == list[1];
            }) !== -1 && item.nodeId == list[0]
          );
        });
        if (processList.length) {
          var account = processList[0].linkAccountList.filter((ac) => {
            return ac.id == list[1];
          })[0];
          var state = "";
          if (processList[0].state == 20) {
            state = "等待回應";
          } else if (processList[0].state == 1) {
            //需檢查是否有回覆
            var hasReply = processList[0].replyUser.findIndex((ac) => {
              return ac.id == account.id;
            });
            if (hasReply !== -1) {
              state = "完成";
            } else {
              state = "等待回應";
            }
          }
          temp.push({
            date: processList[0].createTime,
            nodeName: processList[0].name,
            name: account.name,
            state: state,
          });
        }
      });
      if (infoList.length) {
        bigData.push(
          h(
            "div",
            { style: "border:1px solid;padding:10px;margin-bottom:5px" },
            infoList
          )
        );
      }
      if (temp.length) {
        const pList = [];
        temp.forEach((obj) => {
          pList.push(
            h("p", { style: "width:100%" }, [
              h(
                "span",
                {
                  style:
                    "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.date
              ),
              h(
                "span",
                {
                  style:
                    "width:40%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.nodeName + "-" + obj.name
              ),
              h(
                "span",
                {
                  style:
                    "width:20%;display:inline-block;vertical-align:top;word-break:break-all",
                },
                obj.state
              ),
            ])
          );
        });
        if (pList.length) {
          bigData.push(
            h(
              "div",
              { style: "border:1px solid;padding:10px;margin-bottom:5px" },
              pList
            )
          );
        }
      }
      if (bigData.length) {
        this.$msgbox({
          title: "定位資訊",
          message: h(
            "div",
            { style: "max-height:500px;overflow-x:hidden;overflow-y:auto;" },
            bigData
          ),
          showCancelButton: false,
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    addCustomize(
      canvasObject,
      objId = null,
      objectname = null,
      blocktype = null,
      srcId = null,
      addressId = null,
      connectId = null,
      status = null,
      action = null
    ) {
      //新增客製化元素：貼上/初始化物件/圖例/矩形/文字/多邊
      canvasObject.toObject = (function (toObject) {
        return function () {
          return fabric.util.object.extend(toObject.call(this), {
            objId: this.objId,
            objectName: this.objectName,
            blockType: this.blockType,
            srcId: this.srcId,
            addressId: this.addressId,
            connectId: this.connectId,
            status: status,
            action: action,
          });
        };
      })(canvasObject.toObject);
      canvasObject.set("objId", objId == null ? getUUID() : objId); //唯一性，用來新增icon
      canvasObject.set(
        "objectName",
        objectname !== null
          ? objectname
          : this.objectName == ""
          ? new Date().getTime()
          : this.objectName
      ); //+'_'+ (new Date()).getTime()
      canvasObject.set(
        "blockType",
        blocktype == null ? this.blockType : blocktype
      ); //區塊才有
      canvasObject.set("srcId", srcId == null ? "" : srcId); //圖示的id
      canvasObject.set("addressId", addressId == null ? "" : addressId); //點位，用來websocket接收訊息後找icon並且動作
      canvasObject.set("connectId", connectId == null ? "" : connectId); //關聯，區塊要關聯探測器物件的id(uuid)，下拉選單選取所有scrid=探測器的
      canvasObject.set("status", status);
      canvasObject.set("action", action);
    },
    resetOriginAfterZoom() {
      // 縮放後重置原點
      this.lastzoomPoint.x =
        this.lastzoomPoint.x +
        (this.zoomPoint.x - this.lastmousePoint.x - this.relativeMouseX) /
          this.lastzoom;
      this.lastzoomPoint.y =
        this.lastzoomPoint.y +
        (this.zoomPoint.y - this.lastmousePoint.y - this.relativeMouseY) /
          this.lastzoom;

      this.lastmousePoint.x = this.zoomPoint.x;
      this.lastmousePoint.y = this.zoomPoint.y;
      this.lastzoom = this.zoom;

      this.relativeMouseX = 0;
      this.relativeMouseY = 0;
    },
    resetCanvas() {
      //重置
      this.canvas.setZoom(1);
      this.canvas.absolutePan(new fabric.Point(0, 0));
      this.zoom = 1;
      this.zoomPoint = new fabric.Point(0, 0);
      this.lastzoomPoint = { x: 0, y: 0 };
      this.lastmousePoint = { x: 0, y: 0 };
      this.lastzoom = 1;
      this.lastMovePos = { x: 0, y: 0 };
      this.relativeMouseX = 0;
      this.relativeMouseY = 0;

      this.resetOriginAfterZoom();
    },
    setStartView(startAddress) {
      //設定起始點的視圖
      var index = this.canvas
        .getObjects()
        .findIndex((o) => o.addressId == startAddress);
      if (index !== -1) {
        var left = this.canvas.getObjects()[index].left;
        var top = this.canvas.getObjects()[index].top;
        this.zoomPoint = new fabric.Point(left, top);
        this.canvas.zoomToPoint(this.zoomPoint, 2);
        this.resetOriginAfterZoom();
        this.canvas.renderAll();
      }
    },
    zoomCanvas(operate, e = null) {
      //放大縮小-有分手機版&電腦版
      window.event.stopPropagation();
      window.event.preventDefault();
      var zoomNumber = 0;
      if (e !== null) {
        zoomNumber = event.deltaY > 0 ? -0.1 : 0.1;
      } else {
        zoomNumber = operate == "zoomOut" ? -0.1 : 0.1;
      }
      this.zoom = zoomNumber + this.canvas.getZoom();
      this.zoom = Math.max(0.5, this.zoom);
      this.zoom = Math.min(3, this.zoom);
      const center = this.canvas.getCenter();
      this.zoomPoint = new fabric.Point(center.left, center.top);
      this.canvas.zoomToPoint(this.zoomPoint, this.zoom);
      this.resetOriginAfterZoom();
      this.canvas.renderAll();
    },
    mouseDown(e) {
      window.event.stopPropagation();
      window.event.preventDefault();
      var items = this.canvas.getActiveObjects();
      if (items.length) {
        this.openInfo(items[0]);
      }
      this.lastMovePos.x =
        e.e.type !== "touchstart" ? e.e.clientX : e.e.touches[0].clientX;
      this.lastMovePos.y =
        e.e.type !== "touchstart" ? e.e.clientY : e.e.touches[0].clientY;
      this.moving = true;
    },
    mouseMove(e) {
      window.event.stopPropagation();
      window.event.preventDefault();
      if (this.moving) {
        if (e.e.type == "touchmove") {
          const touch = e.e.touches[0];
          if (this.previousTouch) {
            e.e.movementX = touch.pageX - this.previousTouch.pageX;
            e.e.movementY = touch.pageY - this.previousTouch.pageY;
          } else {
            e.e.movementX = 0;
            e.e.movementY = 0;
          }
          this.previousTouch = touch;
        }
        let deltaX = 0;
        let deltaY = 0;
        if (this.lastMovePos.x) {
          deltaX =
            (e.e.type !== "touchmove" ? e.e.clientX : e.e.touches[0].clientX) -
            this.lastMovePos.x;
        }
        if (this.lastMovePos.y) {
          deltaY =
            (e.e.type !== "touchmove" ? e.e.clientY : e.e.touches[0].clientY) -
            this.lastMovePos.y;
        }
        this.lastMovePos.x =
          e.e.type !== "touchmove" ? e.e.clientX : e.e.touches[0].clientX;
        this.lastMovePos.y =
          e.e.type !== "touchmove" ? e.e.clientY : e.e.touches[0].clientY;
        let delta = new fabric.Point(deltaX, deltaY);
        this.canvas.relativePan(delta);
        this.relativeMouseX += e.e.movementX; //累计每一次移动时候的偏差
        this.relativeMouseY += e.e.movementY;
      }
    },
    actionObj(str, value) {
      console.log(str, value);
      var index = this.canvas.getObjects().findIndex((o) => o.addressId == str);
      if (index !== -1) {
        var obj = this.canvas.getObjects()[index];
        var equ = constant.Equipment.filter((ele) => {
          return ele.id == obj.srcId;
        })[0];
        var src = equ.status.filter((obj) => {
          return obj.value == value;
        })[0];
        var self = this;
        if (obj.srcId == "a2" && value == 2) {
          //需更換svg圖片：探測器動作更換成火災圖片
          obj.set({ visible: false });
          var item = require("@/icons/svg/fire_fs.svg");
          var text = item.default.content.replace(/http:\/\//g, "https://");
          text = text.replace("symbol", "svg");
          text = text.replace("/symbol", "/svg");
          fabric.loadSVGFromString(text, function (objects, options) {
            var svgItems = fabric.util.groupSVGElements(objects, options);
            svgItems.set({
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              top: obj.top,
              left: obj.left,
              hasControls: false,
              visible: true,
              padding: 5,
              selectable: true,
            });
            self.canvas.add(svgItems);
            svgItems.set({
              fill: "#ff0000",
            });
            self.addCustomize(
              svgItems,
              obj.objId,
              obj.objectName,
              obj.blockType,
              "fs",
              "000-00-000-0",
              obj.connectId,
              obj.status,
              obj.action
            );
            self.canvas.renderAll();
            svgItems.hasAnimationStarted = true;
            self.setAnimate(svgItems);
          });
        } else if (obj.srcId == "a2" && value == 0) {
          //刪除火災的svg
          var index = this.canvas
            .getObjects()
            .findIndex((o) => o.addressId == "000-00-000-0" && o.srcId == "fs");
          var fire = this.canvas.getObjects()[index];
          this.canvas.remove(fire);
          obj.set({ visible: true });
        } else if (str == "P001-R400") {
          //水位計
          var color = value !== 0 ? "#ff0000" : "#00a0e9";
          if (obj._objects !== undefined) {
            obj.getObjects().forEach((item) => {
              if (item.fill !== "#ffffff") {
                item.set({
                  fill: color,
                });
              }
            });
          }
          obj.set({ fill: color, visible: true });
        } else if (src !== undefined) {
          //其餘的動畫顯示
          if (obj._objects !== undefined) {
            obj.getObjects().forEach((item) => {
              if (item.fill !== "#ffffff") {
                item.set({
                  fill: src.color,
                });
              }
            });
          }
          obj.set({ fill: src.color, visible: value == 0 ? false : true });
          if (src.color !== "#00ff00" && value == 1) {
            obj.hasAnimationStarted = true;
            this.setAnimate(obj);
          } else if (value == 0) {
            this.stopAnimate(obj);
          }
        }
        //關聯的動畫顯示-區塊or圖片
        if (obj.connectId.length !== 0) {
          self.connectAnimate(obj.connectId, value);
        }
        this.canvas.renderAll();
      }
    },
    connectAnimate(connectList, value) {
      connectList.forEach((item) => {
        var connectindex = this.canvas
          .getObjects()
          .findIndex((o) => o.objId == item);
        if (connectindex == -1) {
          return;
        }
        var connectObj = this.canvas.getObjects()[connectindex];
        if (connectObj.srcId == "") {
          if (value !== 0) {
            connectObj.set({
              fill: "rgba(230, 83, 83, 1)",
              visible: true,
            });
            connectObj.hasAnimationStarted = true;
            this.setAnimate(connectObj, 0.7);
          } else {
            connectObj.set({
              fill: "rgba(197, 195, 195, 1)",
              visible: false,
            });
            this.stopAnimate(connectObj, 0.5);
          }
        } else {
          var equ = constant.Equipment.filter((ele) => {
            return ele.id == connectObj.srcId;
          })[0];
          var src = equ.status.filter((obj) => {
            return obj.value == value;
          })[0];
          var color = src !== undefined ? src.color : "#00ff00";
          if (connectObj._objects !== undefined) {
            connectObj.getObjects().forEach((item) => {
              if (item.fill !== "#ffffff") {
                item.set({
                  fill: color,
                });
              }
            });
          }
          connectObj.set({
            fill: color,
            visible: value !== 0 ? true : false,
          });
          if (color !== "#00ff00" && color !== "#00a0e9") {
            connectObj.hasAnimationStarted = true;
            this.setAnimate(connectObj);
          } else if (value == 0) {
            this.stopAnimate(connectObj);
          }
          if (connectObj.srcId == "o3") {
            //如果關聯的是監視器就存入網址
            if (value !== 0) {
              if (this.viewList.length == 5) {
                return false;
              }
              var hasExist =
                this.viewList.findIndex((item) => {
                  return item.url == connectObj.connectId[0];
                }) !== -1;
              if (!hasExist) {
                this.viewList.push({
                  name: connectObj.objectName,
                  url: connectObj.connectId[0],
                });
              }
            } else {
              this.viewList = this.viewList.filter((item) => {
                return item.url !== connectObj.connectId[0];
              });
            }
          }
        }
        // if (connectObj.connectId.length !== 0) {
        //   console.log("connectObj.connectId", connectObj.connectId);
        //   this.connectAnimate(connectObj.connectId, value);
        // } else {
        //   return;
        // }
      });
    },
    setView(item, index) {
      this.viewList.splice(index, 1);
      this.viewList.unshift(item);
    },
    setAnimate(obj, maximum = 1) {
      //動畫
      obj.animate("opacity", obj.opacity === 0.2 ? maximum : 0.2, {
        duration: 600,
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: () => this.setAnimate(obj, maximum),
        abort: () => !obj.hasAnimationStarted,
        easing: fabric.util.ease.easeInOutCubic,
      });
    },
    stopAnimate(obj, opacity = 1) {
      obj.hasAnimationStarted = false;
      obj.opacity = opacity;
    },
    async handleOperateMenu(operate) {
      switch (operate) {
        case "message":
          if (!this.process) {
            return false;
          }

          break;
        case "retreat":
          if (!this.process) {
            return false;
          }
          if (deviceType !== "null") {
            //手機版
          } else {
          }
          break;
        case "resetlocation":
          this.resetCanvas();
          break;
        case "zoomIn":
        case "zoomOut":
          this.zoomCanvas(operate);
          break;
      }
    },
    setInPosition() {
      //設定定位icon:srcId = p7
      var _peopleIcon = this.canvas.getObjects().filter((item) => {
        return item.srcId == "p7";
      });
      for (let node of this.inPositionList) {
        console.log("node", JSON.stringify(node));
        node.linkAccountList.forEach((ac) => {
          var na = node.nodeId + "," + ac.id;
          var svg = _peopleIcon.filter((item) => {
            return (
              item.connectId.findIndex((obj) => {
                return obj == na;
              }) !== -1
            );
          });
          var index = node.replyUser.findIndex((rU) => {
            return rU.id == ac.id;
          });
          if (index !== -1) {
            svg.forEach((s) => {
              this.inPositionSVGClose(s);
            });
          } else {
            svg.forEach((s) => {
              this.inPositionSVGOpen(s);
            });
          }
        });
      }
    },
    inPositionSVGOpen(obj) {
      //先判斷是否有開啟過，有的話就返回
      var hasOpenRed = this.canvas.getObjects().filter((item) => {
        return (
          item.objId == obj.objId && item.srcId == "p7" && item.visible == true
        );
      });
      if (hasOpenRed.length) {
        return false;
      }
      var hasOpen = this.canvas.getObjects().filter((item) => {
        return item.objId == obj.objId && item.srcId == "p6";
      });
      if (hasOpen.length) {
        return false;
      }
      var self = this;
      obj.set({ visible: false });
      var item = require("@/icons/svg/fire_p6.svg");
      var text = item.default.content.replace(/http:\/\//g, "https://");
      text = text.replace("symbol", "svg");
      text = text.replace("/symbol", "/svg");
      fabric.loadSVGFromString(text, function (objects, options) {
        var svgItems = fabric.util.groupSVGElements(objects, options);
        svgItems.set({
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          top: obj.top,
          left: obj.left,
          hasControls: false,
          visible: true,
          padding: 5,
          selectable: true,
        });
        self.canvas.add(svgItems);
        svgItems.set({
          fill: "#00ff00",
        });
        self.addCustomize(
          svgItems,
          obj.objId,
          obj.objectName,
          obj.blockType,
          "p6",
          "000-00-000-0",
          obj.connectId,
          obj.status,
          obj.action
        );
        self.canvas.renderAll();
        svgItems.hasAnimationStarted = true;
      });
    },
    inPositionSVGClose(obj) {
      var objectIcon = this.canvas.getObjects().filter((item) => {
        return item.objId == obj.objId && obj.visible == true
          ? item.srcId == "p6"
          : item.srcId == "p7";
      });
      if (objectIcon.length) {
        if (obj.visible == true) {
          this.canvas.remove(objectIcon[0]);
        }
        if (obj._objects !== undefined) {
          obj.getObjects().forEach((item) => {
            if (item.fill !== "#ffffff") {
              item.set({
                fill: "#ff0000",
              });
            }
          });
        }
        obj.set({ fill: "#ff0000", visible: true });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
}
.section {
  background-color: #fff;
}
.previewImg {
  width: 100%;
  height: auto;
}
</style>
