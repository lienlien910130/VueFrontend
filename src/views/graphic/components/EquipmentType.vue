<template>
  <div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :md="8" :lg="24">
        <el-input
          v-model="search"
          placeholder="請輸入種類名稱"
          prefix-icon="el-icon-search"
          @clear="handleSearch"
          @input="handleSearch"
          clearable
        ></el-input>
        <el-button
          type="success"
          @click="handleChange(type == 'text' ? 'icon' : 'text')"
          >轉換成 {{ type == "text" ? "圖例" : "文字" }}</el-button
        >
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="樓層點位" name="floor">
        <div class="leftcontent">
          <div v-if="type == 'icon'">
            <div class="imagediv" v-for="(item, index) in imgList" :key="index">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  　<span>{{ item.label }}</span
                  ><br />
                  　<span> {{ item.deviceFullType }}</span>
                  <br />
                  　<span> {{ item.area }}</span>
                </div>
                <svg-icon
                  :class="[
                    { active: item.draggable == false },
                    { icon: true },
                    { selected: select == item },
                  ]"
                  @mousedown="addSvg(item, $event)"
                  :icon-class="'fire_' + item.iconId"
                  style="font-size: 55px"
                />
              </el-tooltip>
            </div>
          </div>
          <div v-else>
            <div v-for="(item, index) in imgList" :key="index">
              <el-link
                :class="[
                  { active: item.draggable == false },
                  { link: true },
                  { selected: select == item },
                ]"
                type="info"
                @click="addSvg(item, $event)"
                >{{ parseInt(index) + 1 }} . {{ item.label }}-{{
                  item.deviceFullType
                }}
              </el-link>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="圖例" name="allicon">
        <div class="leftcontent">
          <div v-if="type == 'icon'">
            <div class="imagediv" v-for="(item, index) in imgList" :key="index">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.name"
                placement="top-start"
              >
                <svg-icon
                  :class="[{ icon: true }, { selected: select == item }]"
                  :alt="item.name"
                  @mousedown="addSvg(item, $event)"
                  :icon-class="'fire_' + item.id"
                  style="font-size: 55px"
                />
              </el-tooltip>
            </div>
          </div>
          <div v-else>
            <div v-for="(item, index) in imgList" :key="index">
              <el-link
                :class="[{ link: true }, { selected: select == item }]"
                type="info"
                @click="addSvg(item, $event)"
                >{{ parseInt(index) + 1 }} . {{ item.name }}
              </el-link>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import constant from "@/constant";
export default {
  name: "EquipmentType",
  props: {
    imgAddress: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  watch: {
    imgAddress: {
      handler: async function () {
        this.imgList = _.cloneDeep(this.imgAddress);
        this.imgList.forEach((element) => {
          element.draggable = !element.systemUsed;
        });
        this.original = _.cloneDeep(this.imgList);
      },
      immediate: true,
    },
  },
  // computed: {
  //     getImg(){
  //         return function (value) {
  //             if(value !== null){
  //                 let icon = constant.Equipment.filter((item, index) =>
  //                     item.id == value
  //                 )[0]
  //                 return icon !== undefined ?  require('@assets/equipment/'+icon.status[0].imgSrc)  : ""
  //             }
  //             return null
  //         }
  //     }
  // },
  data() {
    return {
      viewlist: constant.Equipment,
      type: "icon",
      search: "",
      select: null,
      imgList: [],
      activeName: "floor",
      original: [],
    };
  },
  // mounted(){
  //     this.temp =  lodash.cloneDeep(this.viewlist)
  // },
  methods: {
    handleChange(type) {
      this.type = type;
    },
    addSvg(item, e) {
      console.log(item, e);
      if (!item.draggable) {
        return false;
      }
      this.select = item;
      this.$emit("sendAddressImageIcon", item, e);
    },
    handleSearch() {
      this.imgList = [];
      console.log(this.original);
      this.original.filter((item) => {
        var name = item.name !== undefined ? item.name : item.deviceFullType;
        if (name.indexOf(this.search) !== -1) {
          this.imgList.push(item);
        }
      });
    },
    setDisableDraggle(id, isdraggable) {
      var address = this.imgList.filter((item) => {
        return item.id == id;
      })[0];
      if (address !== undefined) {
        address.draggable = isdraggable;
      }
    },
    handleClick(tab, event) {
      if (tab.name == "allicon") {
        this.imgList = _.cloneDeep(constant.Equipment);
        this.imgList.forEach((element) => {
          element.draggable = true;
        });
      } else {
        this.imgList = _.cloneDeep(this.imgAddress);
        this.imgList.forEach((element) => {
          element.draggable = !element.systemUsed;
        });
      }
      this.original = _.cloneDeep(this.imgList);
    },
  },
};
</script>
<style lang="scss" scoped>
.leftcontent {
  height: 600px;
  overflow: auto;
  width: 100%;

  .linkdiv {
    display: inline-block;
    position: relative;
    width: 50%;
  }
  .imagediv {
    display: inline-block;
    position: relative;
  }
}
.icon {
  width: 55px;
  height: 55px;
  border: 1px solid black;
  margin: 5px;
  cursor: pointer;
}
.selected {
  background-color: red;
}
.link {
  padding: 5px;
  font-size: 12px;
}
.active {
  background-color: rgb(194, 193, 193);
  cursor: no-drop;
}
</style>
