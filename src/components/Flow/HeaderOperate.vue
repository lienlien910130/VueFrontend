<template>
  <div class="operate-menu">
    <ul class="left">
      <li
        @click.stop="handleMiddleMenu('upper-step')"
        :class="[middleSelectType === 'upper-step' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="上一步" placement="bottom">
          <i class="el-icon-refresh-left"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleMiddleMenu('next-step')"
        :class="[middleSelectType === 'next-step' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="下一步" placement="bottom">
          <i class="el-icon-refresh-right"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleMiddleMenu('drag-drop')"
        :class="[middleSelectType === 'drag-drop' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="拖曳" placement="bottom">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </li>
      <!-- <li>
        <Dropdown trigger="click">
          <Icon type="md-git-network" />
          <div class="svg-icon" v-html="selectLineSvg"></div>
          <DropdownMenu slot="list">
            <DropdownItem @click.stop.native="handleMiddleMenu('connection', 'Bezier')">
              <div class="svg-icon" v-html="BezierSvg"></div
            ></DropdownItem>
            <DropdownItem @click.stop.native="handleMiddleMenu('connection', 'Flowchart')">
              <div class="svg-icon" v-html="FlowchartSvg"></div
            ></DropdownItem>
            <DropdownItem @click.stop.native="handleMiddleMenu('connection', 'Straight')">
              <div class="svg-icon" v-html="StraightSvg"></div
            ></DropdownItem>
            <DropdownItem @click.stop.native="handleMiddleMenu('connection', 'StateMachine')">
              <div class="svg-icon" v-html="StateMachineSvg"></div
            ></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li> -->
      <li
        @click.stop="handleMiddleMenu('enlarge')"
        :class="[middleSelectType === 'enlarge' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
          <i class="el-icon-zoom-in"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleMiddleMenu('narrow')"
        :class="[middleSelectType === 'narrow' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="縮小" placement="bottom">
          <i class="el-icon-zoom-out"></i>
        </el-tooltip>
      </li>
    </ul>
    <ul class="right">
      <li
        @click.stop="handleMiddleMenu('import')"
        :class="[middleSelectType === 'import' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="載入檔案" placement="bottom">
          <i class="el-icon-upload"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleMiddleMenu('export')"
        :class="[middleSelectType === 'export' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="下載檔案" placement="bottom">
          <i class="el-icon-download"></i>
        </el-tooltip>
      </li>
      <!-- <li
        @click.stop="handleMiddleMenu('restore')"
        :class="[middleSelectType === 'restore' ? 'active' : '']"
      >
        <Tooltip content="还原视图" placement="bottom">
          <Icon type="md-locate" />
        </Tooltip>
      </li> -->
      <li
        @click.stop="handleMiddleMenu('view-code')"
        :class="[middleSelectType === 'view-code' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="查看json數據" placement="bottom">
          <i class="el-icon-more"></i>
        </el-tooltip>
      </li>
      <!-- <li
        @click.stop="handleMiddleMenu('reset')"
        :class="[middleSelectType === 'reset' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="重置" placement="bottom">
          <i class="el-icon-more"></i>
        </el-tooltip>
      </li> -->
      <li
        @click.stop="handleMiddleMenu('save')"
        :class="[middleSelectType === 'save' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="儲存數據" placement="bottom">
          <i class="el-icon-files"></i>
        </el-tooltip>
      </li>
      <li
        @click.stop="handleMiddleMenu('clear')"
        :class="[middleSelectType === 'clear' ? 'active' : '']"
      >
        <el-tooltip class="item" effect="dark" content="清空" placement="bottom">
          <i class="el-icon-delete"></i>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: "HeaderOperate",
  data() {
    return {
      middleSelectType: "drag-drop"  //操作
    }
  },
  methods: {
    handleMiddleMenu(type) {
      this.middleSelectType = type
      this.$emit('handleMiddleMenu',type)
    }
  },
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
      margin-right: 18px;
      font-size: 18px;
      position: relative;
      display: flex;
      align-items: center;
      &.active {
        color: #2d8cf0;
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
  ::v-deep .ivu-tooltip {
    display: flex;
    align-items: center;
  }
}
</style>
