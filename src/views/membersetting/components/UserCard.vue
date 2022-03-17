<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>{{ userCopy.name }}</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <img :src="previewPath" class="previewImg" />
      </div>
      <div class="box-center">
        <div class="user-name text-center">
          <el-upload
            ref="upload"
            action="upload"
            accept="image/jpeg,image/png"
            :on-change="handleChange"
            :auto-upload="false"
            :file-list="fileList"
            :show-file-list="false"
          >
            <i slot="trigger" class="el-icon-upload" style="cursor: pointer" />
          </el-upload>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="user" /><span>帳號</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ userCopy.account }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-date" /><span>性別</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ sex }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-date" /><span>生日</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ birthday }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="email" /><span>電子信箱</span>
          <template v-if="!userCopy.verifyEmail">
            <span style="color: red; cursor: pointer" @click="certEmail"
              >尚未認證</span
            >
          </template>
          <template v-else>
            <i class="el-icon-success" />
          </template>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ userCopy.email !== undefined ? userCopy.email : "尚未設定" }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-phone-outline" />
          <span>市話</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{
              userCopy.callNumber !== undefined
                ? userCopy.callNumber
                : "尚未設定"
            }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-mobile-phone" />
          <span>手機</span>
          <template v-if="!userCopy.verifyCellPhone">
            <span style="color: red">尚未認證</span>
          </template>
          <template v-else>
            <i class="el-icon-success" />
          </template>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{
              userCopy.cellPhoneNumber !== undefined
                ? userCopy.cellPhoneNumber
                : "尚未設定"
            }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-mobile-phone" /><span>緊急電話</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{
              userCopy.emergencyNumber !== undefined
                ? userCopy.emergencyNumber
                : "尚未設定"
            }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-house" /><span>門牌</span>
          <template v-if="!userCopy.verifyUsageOfFloor">
            <span style="color: red">{{
              userCopy.usageOfFloor !== undefined ? "待認證" : "尚未認證"
            }}</span>
          </template>
          <template v-else>
            <i class="el-icon-success" />
          </template>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{
              userCopy.usageOfFloor !== undefined
                ? floorOfHouse(userCopy.usageOfFloor)
                : "尚未設定"
            }}
          </div>
        </div>
      </div>
      <!-- <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-user" /><span>角色</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ roles }}
          </div>
        </div>
      </div> -->
      <div style="text-align: center">
        <el-button
          v-if="
            userCopy.tmpAccount == userCopy.account &&
            !userCopy.verifyUsageOfFloor
          "
          size="mini"
          type="success"
          @click="updateUser('upgrade')"
          >升級正式帳號</el-button
        >
        <!-- <el-button size="mini" type="success" @click="updateUser('upgrade')"
          >升級正式帳號</el-button
        > -->
        <el-button size="mini" @click="updateUser('password')"
          >修改密碼</el-button
        >
        <el-button type="primary" size="mini" @click="updateUser('open')"
          >修改資料</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import moment from "moment";
export default {
  computed: {
    ...Vuex.mapGetters(["floorOfHouse_record", "buildingfloorOfHouse"]),
    roles() {
      if (this.userCopy.linkRoles) {
        return this.userCopy["linkRoles"]
          .map((item) => {
            return item.getName();
          })
          .toString();
      }
      return "尚未設定";
    },
    birthday() {
      if (this.userCopy.birthday) {
        return moment(this.userCopy.birthday).format("YYYY-MM-DD");
      }
      return "尚未設定";
    },
    sex() {
      if (this.userCopy.sex) {
        return "女";
      } else if (this.userCopy.sex == false) {
        return "男";
      } else {
        return "尚未設定";
      }
    },
    floorOfHouse() {
      return function (value) {
        if (this.floorOfHouse_record == 0) {
          this.$store.dispatch("building/setFloorOfHouse");
          this.$store.dispatch("record/saveFloorOfHouseRecord", 1);
        }
        var data = this.buildingfloorOfHouse.filter((item) => {
          return item.id == value;
        });
        if (data.length) {
          return data[0].houseNumber;
        } else {
          return "尚未設定";
        }
      };
    },
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          role: "",
        };
      },
    },
    previewPath: {
      type: String,
    },
  },
  data() {
    return {
      fileList: [],
      userCopy: {},
    };
  },
  watch: {
    user: {
      handler: async function () {
        this.userCopy = _.cloneDeep(this.user);
      },
      immediate: true,
    },
  },
  methods: {
    handleChange(file, fileList) {
      var data = _.cloneDeep(fileList);
      this.$emit("handleUpload", data);
      this.fileList = [];
    },
    updateUser(index) {
      this.$emit(
        "handleUser",
        "",
        index,
        index === "open" ? _.cloneDeep(this.user) : ""
      );
    },
    certEmail() {
      if (
        this.userCopy.email == undefined ||
        this.userCopy.email == null ||
        this.userCopy.email == ""
      ) {
        this.$message.error("請先設定email再進行驗證");
      } else {
        var data = {
          accountId: this.userCopy.id,
          transferUrl: process.env.VUE_APP_EMAILCERT,
        };
        this.$store
          .dispatch("user/email", data)
          .then((response) => {
            this.$message(response);
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 8px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
.previewImg {
  width: 200px;
  height: auto;
}
</style>
