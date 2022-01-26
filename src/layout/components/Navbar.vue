<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div v-if="backVisible" @click="backTo">
      <i class="el-icon-caret-left hamburger-container">返回自衛消防編組</i>
    </div>

    <!-- <div class="left-menu">
      <router-link to="/">
         <svg-icon  icon-class="indexlogo"
          style="width:200px;height:90px" />
      </router-link>
    </div> v-if="process"-->

    <div class="right-menu">
      <span @click="showToken">TOKEN</span>
      <!-- 火災時的平面圖--有緊急應變才顯示 -->
      <div
        v-if="deviceType !== 'null' && fireButton"
        class="avatar-container right-menu-item hover-effect"
        style="margin-right: 0px"
      >
        <div class="avatar-wrapper">
          <svg-icon icon-class="fire_fs" @click="handleFireFloor" />
        </div>
      </div>

      <Screenfull
        v-if="deviceType == 'null'"
        id="screenfull"
        class="right-menu-item hover-effect"
      />

      <template v-if="buildingarray.length">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <i class="el-icon-office-building icon" />
            <span v-if="device !== 'mobile'" style="margin-left: 3px">{{
              buildingName
            }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item
              v-for="item in selectData"
              :key="item.id"
              @click.native="handleSelect(item)"
            >
              {{ item.buildingName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <template v-if="name !== null">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <svg-icon icon-class="user" />
            <span v-if="device !== 'mobile'" style="margin-left: 3px">{{
              name
            }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> 首頁 </el-dropdown-item>
            </router-link>
            <router-link v-if="id !== undefined" to="/info/index">
              <el-dropdown-item> 個人資料</el-dropdown-item>
            </router-link>
            <router-link v-if="buildingid !== undefined" to="/settings">
              <el-dropdown-item> 設定 </el-dropdown-item>
            </router-link>
            <router-link v-if="buildingid !== undefined" to="/building/files">
              <el-dropdown-item> 大樓總檔 </el-dropdown-item>
            </router-link>
            <router-link v-if="id == '1'" to="/building/index">
              <el-dropdown-item> 編輯大樓 </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <div
        v-if="deviceType == 'null'"
        class="avatar-container right-menu-item"
        style="margin-right: 0px"
      >
        <div class="avatar-wrapper">
          <span class="timer">{{ date | formatDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const Vuex = require('vuex')
import { formatTime } from "@/utils/index.js";
import { getDevice } from "@/utils/auth";
import ws from "@/utils/socket";

export default {
  computed: {
    ...Vuex.mapGetters([
      "sidebar",
      "account",
      "name",
      "id",
      "device",
      "buildingarray",
      "roles",
      "buildinginfo",
      "buildingid",
      "navbarButton",
      "token",
      "permission_routes",
      "process",
      "redirect",
      "fireFloorList",
      "mToken",
      "physicalInfos",
    ]),
    selectAttrs() {
      return {
        selectData: this.selectData,
        title: "Building",
      };
    },
    deviceType: function () {
      return getDevice();
    },
  },
  async mounted() {
    let _this = this;
    this.timer = setInterval(() => {
      _this.date = new Date();
    }, 1000);
  },
  filters: {
    formatDate: function (value) {
      return formatTime(value, "{y}-{m}-{d} {h}:{i}:{s}");
    },
  },
  watch: {
    buildingarray: {
      handler: async function () {
        this.selectData = this.buildingarray;
        if (this.buildingid) {
          var temp = this.buildingarray.filter(
            (item, index) => item.id == this.buildingid
          );
          if (temp.length == 0) {
            this.$store.dispatch("building/resetBuildingid");
            location.reload();
          }
        } else if (this.buildingarray.length) {
          this.handleSelect(this.buildingarray[0]);
        }
      },
      immediate: true,
    },
    buildinginfo: {
      handler: async function () {
        this.buildingName =
          this.buildinginfo.length === 0
            ? "請選擇建築物"
            : this.buildinginfo.buildingName !== undefined
            ? this.buildinginfo.buildingName
            : "";
      },
      immediate: true,
    },
    navbarButton: {
      handler: async function () {
        this.backVisible = this.navbarButton;
      },
      immediate: true,
    },
    process: {
      handler: async function () {
        this.fireButton = this.process;
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  data() {
    return {
      selectData: [],
      date: new Date(),
      buildingName: "請選擇建築物",
      backVisible: false,
      fireButton: false,
    };
  },
  methods: {
    backTo() {
      this.$router.push({ name: "selfDefenseFireMarshalling" });
    },
    handleTo() {
      this.$router.push("/building");
    },
    toggleSideBar() {
      if (this.permission_routes.length == 0) {
        this.$message.error("現在為緊急應變時刻");
      }
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      console.log("logout");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    async handleSelect(content) {
      if (content !== undefined) {
        this.$store.dispatch("building/setBuildingID", content.id);
        this.$store.dispatch("permission/setRoutes");
        this.$store.dispatch("building/setBuildingInfo", content);
        this.$store.dispatch("record/saveRoleRecord", 0);
        this.$store.dispatch("record/saveSettingRecord", 0);
        this.$store.dispatch("record/saveFloorRecord", 0);
        this.$store.dispatch("record/saveFloorOfHouseRecord", 0);
        this.$store.dispatch("record/saveHouseHolderRecord", 0);
        this.$store.dispatch("record/saveDeviceRecord", 0);
        this.$store.dispatch("record/saveContactunitRecord", 0);
        this.$store.dispatch("record/saveDeviceTypeRecord", 0);
        this.$store.dispatch("record/saveAddressManagementRecord", 0);
        this.$router.push("/");
        console.log("Navbardone");
        this.$store.dispatch("app/openSideBar");
        if (this.redirect !== undefined) {
          this.$router.push({ path: this.redirect });
          this.$store.dispatch("app/saveRedirect", undefined);
        } else {
          this.$router.push("/");
        }
      }
    },
    handleFireFloor() {
      console.log("handleFireFloor");
      this.$router.push({ path: "/emergencyGraphic/index" });
    },
    showToken() {
      var hastoken = this.physicalInfos.filter((item) => {
        return item.cToken == this.mToken;
      });
      alert(hastoken.length !== 0);
      alert(this.mToken);
    },
  },
};
// background-image:url("../../assets/image/navbarimg.png");
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
