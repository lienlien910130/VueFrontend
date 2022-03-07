<template>
  <div class="login-container">
    <div class="container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="訪客登記" name="first"></el-tab-pane>
        <el-tab-pane label="成為住戶" name="second"></el-tab-pane>
      </el-tabs>
      <el-form
        ref="dataForm"
        :model="temp"
        :label-position="label"
        label-width="auto"
      >
        <el-form-item
          v-for="(item, index) in config"
          :key="index"
          :prop="item.prop"
          v-show="item.isEdit"
          :rules="[
            { required: item.mandatory, message: item.message },
            item.isPattern
              ? { pattern: item.pattern, message: item.errorMsg }
              : { type: item.type, message: item.typemessage },
          ]"
        >
          <span slot="label">{{ item.label }}</span>
          <el-date-picker
            v-if="item.formType == 'date'"
            v-model="temp[item.prop]"
            value-format="yyyy-MM-dd"
            placeholder="請選擇"
            style="width: 100%"
            :type="item.format == 'YYYY' ? 'year' : 'date'"
          />
          <el-input
            v-else-if="item.format == 'textarea'"
            v-model="temp[item.prop]"
            :autosize="{ minRows: 4, maxRows: 8 }"
            :placeholder="item.placeholder"
            maxlength="200"
            type="textarea"
            show-word-limit
          >
          </el-input>
          <el-select
            v-else-if="item.formType == 'boolean'"
            v-model="temp[item.prop]"
            placeholder="請選擇"
            style="width: 100%"
          >
            <el-option
              v-for="(val, index) in [true, false]"
              :key="index"
              :value="val"
              :label="val | changeBoolean(item.format)"
            ></el-option>
          </el-select>
          <el-select
            v-else-if="item.formType == 'singleChoice'"
            v-model="temp[item.prop]"
            placeholder="請選擇"
            filterable
            value-key="id"
            style="width: 100%"
          >
            <el-option
              v-for="(obj, index) in selectfilter(item.format)"
              :key="index"
              :label="obj.label"
              :value="obj"
            >
            </el-option>
          </el-select>
          <el-select
            v-else-if="item.formType == 'selectString'"
            v-model="temp[item.prop]"
            filterable
            placeholder="請選擇"
            style="width: 100%"
          >
            <el-option
              v-for="(obj, index) in selectfilter(item.format)"
              :key="index"
              :label="obj.label"
              :value="obj.id"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="temp[item.prop]"
            :maxlength="item.maxlength"
            show-word-limit
            :placeholder="item.placeholder"
            :show-password="
              item.prop === 'password' || item.prop === 'password2'
            "
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')"
          >儲存</el-button
        >
        <el-button @click="resetForm('dataForm')">清空</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import computedmixin from "@/mixin/computedmixin";
import { Account, UsageOfFloor } from "@/object";
import { setTmpA } from "@/utils/auth";
export default {
  mixins: [computedmixin],
  data() {
    return {
      config: Account.getHouseTableConfig(),
      temp: {},
      activeName: "first",
      selectData: [],
    };
  },
  async mounted() {
    if (this.$route.query.bID !== undefined) {
      var data = await UsageOfFloor.getFromRegister(this.$route.query.bID);
      this.selectData = data.map((v) => {
        this.$set(v, "id", v.id);
        this.$set(v, "label", v.houseNumber);
        this.$set(v, "value", v.id);
        return v;
      });
      this.temp["linkBuildings"] = [{ id: this.$route.query.bID }];
    }
  },
  methods: {
    submitForm(formName) {
      if (this.temp["password"] !== this.temp["password2"]) {
        this.$message.error("密碼輸入不一致，請重新輸入");
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/register", this.temp)
            .then((response) => {
              if (this.buildingid) {
                this.$message("會員註冊成功");
                this.temp = {};
              } else {
                if (this.activeName == "first") {
                  this.$message(
                    "若要成為正式帳號，請登入後申請，或是重新填寫成為住戶"
                  );
                } else {
                  this.$message("註冊成功，可直接登入系統查看資料");
                }
                setTmpA(response.result.account);
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 2000);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClick() {
      this.config =
        this.activeName == "first"
          ? Account.getHouseTableConfig()
          : Account.getRegisterTableConfig();
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
