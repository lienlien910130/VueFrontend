<template>
  <div class="login-container">
    <div class="title">
      <h1 class="ti">智慧消防管理平台</h1>
    </div>
    <div class="container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div ref="title" class="title-container">
          <img class="pic" :src="src"/>
        </div>
        <!-- <span>帳號:mf44，密碼:1234</span> -->
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="電話號碼、用戶名稱或電子郵件"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="off"
            maxlength="10"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密碼"
            name="password"
            tabindex="1"
            auto-complete="off"
            @keyup.enter.native="handleLogin"
            maxlength="15"
          />
          <span class="show-pwd" @click="showPwd" style="padding-right:10px">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" style="font-size: 25px;"/>
          </span>
        </el-form-item>

        <el-form-item prop="identifyinputCode" >
          <el-input
            ref="identifyinputCode"
            v-model="loginForm.identifyinputCode"
            placeholder="驗證碼"
            name="identifyinputCode"
            type="text"
            tabindex="1"
            auto-complete="off"
            style="width:65%"
          />
          <span class="get-code" style="position:absolute;right:55px;top:5px"> 
            <s-identify :identifyCode="identifyCode"></s-identify>
          </span>
          <span style="position:absolute;right:20px;top:7px" @click="refreshCode">
            <i class="el-icon-refresh" style="font-size: 25px;cursor:pointer"/>
          </span>
        </el-form-item>
          
        <el-button class="btn" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" 
        @click.native.prevent="handleLogin">登入</el-button>
        
      </el-form>
    </div>
    <div class="footer">
      <h3 class="ft">版權所有：水星工程科技有限公司</h3>
    </div>
  </div>
</template>

<script>
import SIdentify from "./components/identify"

export default {
  name: 'Login',
  components: { SIdentify },
  mounted() {
    this.identifyCode = ""
    this.makeCode(this.identifyCodes, 4)
    this.getVersion()
    document.onkeydown = e => {
      if (e.keyCode == 13) {
        this.handleLogin()
      }
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if(value === "") {
        callback(new Error('請輸入帳號'))
      } else if(value.length >10){
        callback(new Error('帳號長度限制十位數內'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if(value === "") {
        callback(new Error('請輸入密碼'))
      } else if(value.length >15){
        callback(new Error('密碼長度限制十五位數內'))
      } else {
        callback()
      }
    }
    const validateIdentify = (rule, value, callback) => {
      if (value == "") {
        callback(new Error('請輸入驗證碼'))
      } else if(value !== "" && value !== this.identifyCode) {
        callback(new Error('驗證碼輸入錯誤'))
      } else{
        callback()
      }
    }
    return {
      identifyCode: '',
      identifyCodes: "0123456789",
      loginForm: {
        username: 'System',
        password: '1234567',
        identifyinputCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        identifyinputCode: [{ required: true, trigger: 'blur', validator: validateIdentify }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      src:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((response) => {
            this.$router.push({ path:  '/' }) //登入成功後跳轉的頁面
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCode() {//
      this.identifyCode = "";
      this.makeCode(this.identifyCodes,4);
    },
    randomNum (min, max) {
      max = max + 1
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 隨機生成驗證碼字符串
    makeCode (data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += data[this.randomNum(0, data.length - 1)]
      }
      // this.loginForm.identifyinputCode = this.identifyCode
    },
    //取得版本解析
    getVersion() {
      this.src = require('../../assets/image/login_logo.png')
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:rgba(255, 255, 255, 0.1);
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  font-family: 'Microsoft YaHei','MingLiU','Arial';

  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 25px;
      color:black;
      height: 47px;
      caret-color: gray;
      font-size: 16px;
      
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  
  .el-form-item {
    border:1px solid hsla(0,0%,100%,.1);
    background: rgba(0,0,0,.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    padding-left: 10px;
    font-size: 14px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("../../assets/image/login_bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .title {
    width: 100%;
    float: left;
    display: table;

    .ti {
      margin-top: 50px;
      margin-left: 100px;
      color: white;
      vertical-align: middle;
    }
  }

  .container {
    position: relative;
    width: 520px;
    max-width: 100%;
    overflow: hidden;
    float: right;
  }

  .register {
    position: relative;
    width: 100%;
    height: 60px;
    float: left;
    margin-top:20px;
    background-image: url("../../assets/image/b_d.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: rgba(255, 255, 255, 0.74);
    text-align: center;
    vertical-align:middle;
  }

  .login-form {
    position: relative;
    width: 100%;
    padding: 35px 35px 35px 35px;
    overflow: hidden;
    float: left;
    background-image: url("../../assets/image/b_u.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: rgba(255, 255, 255, 0.74);
  }
  
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    width: 100%;
    margin: 40px auto;
    margin-top: 0px;
    //background-image: url("../../../dist/static/img/login_logo.png");
    
    .pic {
      width: 300px;
      height: 150px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .footer {
    width: 100%;
    height: 30px;
    background-color: rgb(0, 110,163);
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    display: table;

    .ft {
      float: right;
      margin:10px 100px 10px 0px;
      vertical-align: middle;
      display: table-cell;
      color: white;
    }
  }

}
@media only screen and (min-width: 769px) and (max-width: 1440px) {
  .login-container {
    .container {
       margin: 0 10% 0 0;
    }
  }
}

@media only screen and (min-width: 1441px) {
  .login-container {
    .container {
       margin: 4% 10% 0 0;
    }
  }
}

@media only screen and (min-width: 0px) and (max-width: 768px) {
  .login-container {
    padding: 0px 5px;

    .container {
      margin: 80px auto;
      float: none;
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
