<template>
  <div class="login-container">
    <div class="container">
      <el-form
        v-if="show"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密碼" prop="name">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="確認密碼" prop="email">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >確認</el-button
        >
        <el-button @click="resetForm('ruleForm')">返回首頁</el-button>
      </el-form>
      <div v-else-if="show == false">
        <p>驗證碼已過期!請重新輸入帳號信箱並寄送驗證碼</p>
        <el-button @click="toPassword" type="primary">重新取得驗證碼</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from "axios";
import { Account } from "@/object";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入密碼"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請再次輸入密碼"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("兩次輸入密碼不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      show: null,
      id: "",
    };
  },
  mounted() {
    //this.getIp();
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV == "development") {
      this.init();
    } else {
      this.getIp();
    }
  },
  methods: {
    init() {
      Axios.get("http://ip.jsontest.com/")
        .then((response) => {
          var temp = {
            verifyCode: this.$route.query.vc,
            ipAddress: response.data.ip,
          };
          this.$store
            .dispatch("user/checkReset", temp)
            .then((response) => {
              this.show = true;
              this.id = response.id;
            })
            .catch((error) => {
              this.show = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
      // this.$store
      //   .dispatch("user/ipconfig")
      //   .then((response) => {
      //     console.log(response);
      //     this.$message(response);
      //   })
      //   .catch((error) => {
      //     this.$message.error(error);
      //   });
    },
    getIp() {
      var url =
        "https://ipgeolocation.abstractapi.com/v1/?api_key=3a2e16d29ebc4525b84e6b51bc8299e2";
      this.httpGetAsync(url);
    },
    httpGetAsync(url) {
      var _this = this;
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          var ip = JSON.parse(xmlHttp.responseText).ip_address;
          var temp = {
            verifyCode: _this.$route.query.vc,
            ipAddress: ip,
          };
          _this.$store
            .dispatch("user/checkReset", temp)
            .then((response) => {
              _this.show = true;
              _this.id = response.id;
            })
            .catch((error) => {
              _this.show = false;
            });
        }
      };
      xmlHttp.open("GET", url, true); // true for asynchronous
      xmlHttp.send(null);
    },
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var temp = {
            accountId: _this.id,
            changePassword: _this.ruleForm.pass,
            verifyCode: _this.$route.query.vc,
          };
          _this.$store
            .dispatch("user/resetPassword", temp)
            .then((response) => {
              this.$message("修改成功!請重新登入");
              setTimeout(() => {
                this.$router.push({ path: "/login" });
              }, 2000);
            })
            .catch((error) => {
              this.$message.error("系統錯誤，請通知水星服務人員");
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
    toPassword() {
      this.$router.push({ path: "/password" });
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
