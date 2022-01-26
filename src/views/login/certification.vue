<template>
  <div class="login-container">
    <div class="container">
      <div>
        <p>{{ message }}</p>
        <el-button @click="toInfo" type="primary">返回個人資料</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  mounted() {},
  methods: {
    toInfo() {
      this.$router.push({ path: "/info/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("@assets/image/login_bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  .container {
    text-align: center;
    vertical-align: middle;
    width: 50%;
    height: 50%;
    margin: auto;
  }
}

@media only screen and (min-width: 769px) and (max-width: 1440px) {
  .login-container {
    .container {
      width: 90%;
    }
  }
}

@media only screen and (min-width: 0px) and (max-width: 768px) {
  .login-container {
    padding: 0px 5px;

    .container {
      width: 90%;
    }

    .title {
      margin: 20px auto;
    }
    .footer {
      .ft {
        float: none;
        margin-right: 0px;
      }
    }
    .title {
      text-align: center;
      .ti {
        margin-top: 0px;
        margin-left: 0px;
      }
    }
  }
}
</style>
