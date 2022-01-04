<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>{{ user.name }}</span>
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
            {{ user.account }}
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
          <template v-if="!user.verifyEmail">
            <span style="color: red">尚未認證</span>
          </template>
          <template v-else>
            <i class="el-icon-success" />
          </template>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.email }}
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
            {{ user.callNumber }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-mobile-phone" />
          <span>手機</span>
          <template v-if="!user.verifyCellPhone">
            <span style="color: red">尚未認證</span>
          </template>
          <template v-else>
            <i class="el-icon-success" />
          </template>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.cellPhoneNumber }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-mobile-phone" /><span>緊急電話</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.emergencyNumber }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-house" /><span>門牌</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.usageOfFloor }}
          </div>
        </div>
      </div>
      <div class="user-bio-section">
        <div class="user-bio-section-header">
          <i class="el-icon-user" /><span>角色</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ roles }}
          </div>
        </div>
      </div>
      <div style="text-align: center">
        <el-button size="mini" @click="updateUser('password')"
          >修改密碼</el-button
        >
        <el-button type="primary" size="mini" @click="updateUser('open')"
          >編輯</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import moment from "moment";
export default {
  computed: {
    roles() {
      if (this.user.linkRoles) {
        return this.user.getRolesName();
      }
      return "";
    },
    birthday() {
      if (this.user.birthday) {
        return moment(this.user.birthday).format("YYYY-MM-DD");
      }
      return "";
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
    };
  },
  methods: {
    handleChange(file, fileList) {
      var data = _.cloneDeep(fileList);
      this.$emit("handleUpload", data);
      this.fileList = [];
    },
    updateUser(index) {
      this.$emit("handleUser", "", index, index === "open" ? this.user : "");
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
