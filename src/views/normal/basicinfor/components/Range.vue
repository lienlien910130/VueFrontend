<template>
  <div class="frange">
    <div v-if="!mobile">
      <div class="rangediv">
        <el-link
          v-for="item in rangeOptions"
          :key="item.key"
          :class="[{ selected: item.id == selectRange }]"
          type="primary"
          @click="onSelectRange(item.id)"
          >{{ item.name }}
        </el-link>
      </div>
      <div
        class="floordiv"
        v-for="item in divFloor"
        :key="item.id"
        @click="onSelectFloor(item)"
        @mouseover="addClass(item.getID())"
        @mouseleave="removeClass(item.getID())"
        :class="[
          { active: classenable && item.getID() == current },
          { select: item.getID() == selectFloor },
          { process: item.getID() == floorId },
        ]"
      >
        <span>{{ item.getName() }} </span>
      </div>
    </div>
    <div v-else>
      <Select
        style="margin-bottom: 20px; width: 100%"
        :selectData="buildingfloors"
        v-on:handleFloorSelect="handleFloorSelect"
      >
      </Select>
    </div>
  </div>
</template>
<script>
import ws from "@/utils/socket";
export default {
  data() {
    return {
      rangeOptions: [],
      upFloors: [],
      downFloors: [],
      divFloor: [],
      selectRange: "0",
      selectFloor: "",
      current: 0,
      classenable: false,
      floorId: null,
    };
  },
  computed: {
    ...Vuex.mapGetters(["buildingfloors", "floor_record", "process"]),
    mobile() {
      if (this.$store.state.app.device === "mobile") {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    buildingfloors: {
      handler: async function (newValue, oldValue) {
        if (this.floor_record == 0) {
          this.$store.dispatch("building/setFloors");
          this.$store.dispatch("record/saveFloorRecord", 1);
        }
        var array = this.buildingfloors;
        if (
          (this.buildingfloors.length > 0 && oldValue == undefined) ||
          (this.buildingfloors.length > 0 && oldValue.length == 0)
        ) {
          //第一次建立
          this.upFloors = array.filter(
            (item, index) => item.isUnderground == false
          );
          this.downFloors = array.filter(
            (item, index) => item.isUnderground == true
          );
          this.setRange();
        } else if (
          this.buildingfloors.length > 0 &&
          oldValue !== undefined &&
          oldValue.length !== 0
        ) {
          //修改平面圖
          this.upFloors = array.filter(
            (item, index) => item.isUnderground == false
          );
          this.downFloors = array.filter(
            (item, index) => item.isUnderground == true
          );
          this.onSelectRange(this.selectRange);
        }
      },
      immediate: true,
    },
    process: {
      handler: function () {
        this.changeProcessFloorId();
      },
      immediate: true,
    },
  },
  methods: {
    setRange() {
      this.rangeOptions = [];
      if (this.upFloors.length > 0) {
        var _count = Math.ceil(this.upFloors.length / 10);
        for (var i = 1; i <= _count; i++) {
          var start = this.upFloors[i * 10 - 10];
          var end =
            i == _count
              ? this.upFloors[this.upFloors.length - 1]
              : this.upFloors[i * 10 - 1];
          var _temp = {
            id: i,
            name: start.getName() + "~" + end.getName(),
            startId: start.getID(),
            endId: end.getID(),
          };
          this.rangeOptions.push(_temp);
        }
      }
      if (this.downFloors.length > 0) {
        var _temp = {
          id: 0,
          name: "地下樓層",
          startId: null,
          endId: null,
        };
        this.rangeOptions.unshift(_temp);
      }
      this.onSelectRange(0);
      this.changeProcessFloorId();
    },
    changeProcessFloorId() {
      if (this.process == true && ws.processWs.floorId !== null) {
        this.floorId = ws.processWs.floorId;
        var index = this.rangeOptions.findIndex(
          (item) =>
            parseInt(item.startId) < parseInt(this.floorId) &&
            parseInt(this.floorId) < parseInt(item.endId)
        );
        this.onSelectRange(index);
      }
    },
    onSelectRange(val) {
      this.selectRange = val;
      if (val == 0) {
        this.divFloor = this.downFloors;
      } else {
        const pageList = this.upFloors.filter(
          (item, index) => index < 10 * val && index >= 10 * (val - 1)
        );
        this.divFloor = pageList.reverse();
      }
    },
    onSelectFloor(val) {
      this.selectFloor = val.getID();
      this.$emit("handleBuildingFloorSelect", val);
    },
    addClass(index) {
      this.classenable = true;
      this.current = index;
    },
    removeClass(index) {
      this.classenable = false;
      this.current = index;
    },
    handleFloorSelect(val) {
      this.selectFloor = val[0].id;
      this.$emit("handleBuildingFloorSelect", this.selectFloor);
    },
  },
};
</script>

<style lang="scss" scoped>
.floordiv {
  width: 100%;
  height: 50px;
  background-color: rgb(219, 231, 237);
  border: 1px solid black;
  text-align: center;
  vertical-align: middle;
  color: #606266;
  font-weight: bold;
  font-size: 30px;
  line-height: 50px;
}
.active {
  background: rgb(202, 191, 220);
  cursor: pointer;
}
.select {
  background: rgb(147, 180, 197);
  color: white;
}
.process {
  background: red;
  color: white;
}
.rangediv {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  .el-link {
    width: auto;
    margin: 0px 5px;
    color: #606266;
  }
  .selected {
    color: red;
  }
}
</style>
