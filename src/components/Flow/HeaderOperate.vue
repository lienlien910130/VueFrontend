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

      <!-- <li
        @click.stop="handleOperateMenu('upper-step')"
        :class="[middleSelectType === 'upper-step' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="上一步" placement="bottom">
          <i class="el-icon-refresh-left"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('next-step')"
        :class="[middleSelectType === 'next-step' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="下一步" placement="bottom">
          <i class="el-icon-refresh-right"></i>
        </el-tooltip>
      </li> -->
      <!-- <li
        @click.stop="handleOperateMenu('enlarge')"
        :class="[middleSelectType === 'enlarge' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
          <i class="el-icon-zoom-in"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('narrow')"
        :class="[middleSelectType === 'narrow' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="縮小" placement="bottom">
          <i class="el-icon-zoom-out"></i>
        </el-tooltip>
      </li> -->
      <!-- <li
        @click.stop="handleOperateMenu('delete')"
        :class="[middleSelectType === 'delete' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="刪除" placement="bottom">
          <i class="el-icon-delete"></i>
        </el-tooltip>
      </li> -->
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

      <!-- <li
        @click.stop="handleOperateMenu('import')"
        :class="[middleSelectType === 'import' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="載入檔案" placement="bottom">
          <i class="el-icon-upload"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('export')"
        :class="[middleSelectType === 'export' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="下載檔案" placement="bottom">
          <i class="el-icon-download"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('view-code')"
        :class="[middleSelectType === 'view-code' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="查看json數據" placement="bottom">
          <i class="el-icon-more"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('save')"
        :class="[middleSelectType === 'save' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="儲存數據" placement="bottom">
          <i class="el-icon-files"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleOperateMenu('clear')"
        :class="[middleSelectType === 'clear' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="清空" placement="bottom">
          <i class="el-icon-document-delete"></i>
        </el-tooltip>
      </li> -->
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
