<template>
  <div class="operate-menu">
    <ul class="left">
      <li
        v-for="item in operateMenu.left"
        @click.stop="handleOperateMenu(item.type)"
        :class="[middleSelectType === item.type ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
          <i :class="item.icon"></i>
        </el-tooltip>
      </li>
    </ul>
    <ul class="right">
      <li
        v-for="item in operateMenu.right"
        @click.stop="handleOperateMenu(item.type)"
        :class="[middleSelectType === item.type ? 'active' : '' ]"
        :disable="true"
      >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
          <i :class="item.icon"></i>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: "HeaderOperate",
  props:{
    operateMenu: {
      type: Object,
      default: function() {
        return { 
          'left': [],
          'right':[]
        }
      }
    },
  },
  watch: {
      operateMenu:{
          handler:async function(){

          },
          immediate:true
      }
  },
  data() {
    return {
      middleSelectType: "drag-drop",  //操作
      disable:false
    }
  },
  methods: {
    handleOperateMenu(type) { //內部傳出去的
      this.middleSelectType = type
      this.$emit('handleOperateMenu',type)
    },
    setDisable(disable){
      this.disable = disable
    },
    setmiddleSelectType(type){ //外部來的
      this.middleSelectType = type
    }
  }
};
</script>

<style scoped lang="scss">
.operate-menu {
  width: 100%;
  display: flex;
  justify-content: space-between;
  > ul {
    display: flex;
    list-style: none;
    > li {
      cursor: pointer;
      font-size: 18px;
      position: relative;
      display: flex;
      align-items: center;
      &.active {
        color: #2d8cf0;
      }
      &.needed {
        color: red;
      }
      .svg-icon {
        display: flex;
        justify-content: center;
        svg {
          path {
            fill: chartreuse !important;
          }
        }
      }
    }
  }
  .left {
    padding-left: 0px;
  }
  .left{
    >li{
      margin-right: 18px;
    }
  }
  .right{
    >li{
      margin-left: 18px;
    }
  }
  ::v-deep .ivu-tooltip {
    display: flex;
    align-items: center;
  }
}
</style>
