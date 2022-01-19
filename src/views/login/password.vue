<template>
  <div class="login-container">
    <div class="container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="帳號" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >重設密碼</el-button
        >
        <el-button @click="resetForm('ruleForm')">返回首頁</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
export default {
  data() {
    return {
      ruleForm: {
        account: "",
        email: "",
      },
      rules: {
        account: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
        email: [
          {
            required: true,
            message: "請輸入email",
            trigger: "blur",
          },
          {
            required: true,
            message: "請輸入正確的email格式",
            trigger: "blur",
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.transferUrl = process.env.VUE_APP_RESETPASSWORD;
          this.$store
            .dispatch("user/password", this.ruleForm)
            .then((response) => {
              this.$message(response);
            })
            .catch((error) => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/login" });
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
