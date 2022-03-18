<template>
  <div>
    <el-dialog
      top="5vh"
      :width="dialogWidth"
      :title="(title = '聯絡方式')"
      :visible="visible"
      @close="handleClickOption('cancel')"
      append-to-body
      center
    >
      <div class="content">
        <div class="picture">
          <el-avatar v-if="img !== ''" :size="100" :src="img"></el-avatar>
          <el-avatar
            v-else
            :size="100"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </div>

        <!-- <img src="blob:http://127.0.0.1:8088/3c90fd5f-7d24-4799-8484-9bf3f6d9bfd2" alt=""> -->

        <div class="inner-content">
          <ul>
            <li>姓名 :</li>
            <li>緊急連絡人 :</li>
            <li>E-mail :</li>
            <li>聯絡方式 :</li>
          </ul>

          <ul>
            <li v-if="account.name">{{ account.name }}</li>
            <li v-else>無</li>
            <li v-if="account.emergencyContact">
              {{ account.emergencyContact }}
            </li>
            <li v-else>無</li>
            <li v-if="account.email">{{ account.email }}</li>
            <li v-else>無</li>
            <li v-if="account.emergencyNumber">
              緊急電話 : {{ account.emergencyNumber }}
            </li>
            <li v-else>緊急電話 : 無</li>
            <li v-if="account.cellPhoneNumber">
              手機 : {{ account.cellPhoneNumber }}
            </li>
            <li v-else>手機 : 無</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import computedmixin from "@/mixin/computedmixin";

import { Files } from "@/object";
export default {
  name: "DialogContact",
  mixins: [computedmixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    account: {
      type: Object,
      default: {},
    },
  },
  computed: {
    dialogWidth() {
      if (this.$store.state.app.device === "mobile") {
        return "90%";
      } else {
        if (this.excelType == "exportExcel") return "500px";
        return "1000px";
      }
    },
  },
  data() {
    return {
      img: "",
    };
  },
  methods: {
    handleClickOption(status) {
      this.img = "";
      this.$emit("handleDialog", this.title, status, this.accessArray);
    },
    async getImg() {
      if (
        this.account.headShotFileId == undefined ||
        this.account.headShotFileId == null
      ) {
        return false;
      }
      var file = await Files.getOfID(this.account.headShotFileId);
      var filename = file.getExtName();
      var fileType = filename == "png" ? "image/png" : "image/jpeg";
      var data = await Files.getImage(this.account.headShotFileId);
      let url = URL.createObjectURL(new Blob([data], { type: fileType }));
      file.url = url;
      this.img = url;
    },
  },
  mounted() {
    this.getImg();
  },
};
</script>

<style lang="scss" scoped>
.content {
  @media (max-width: 576px) {
    display: block;
  }

  display: flex;

  & .picture {
    @media (max-width: 576px) {
      text-align: center;
      margin-right: 0px;
    }
    margin-right: 50px;
    padding-left: 30px;
    text-align: center;
  }
}

.inner-content {
  @media (max-width: 576px) {
    border: none;
    justify-content: space-evenly;
  }

  display: flex;
  border-left: 2px solid powderblue;

  & ul {
    list-style-type: none;
    @media (max-width: 576px) {
      padding: 0;
    }

    & li {
      line-height: 30px;
    }
  }
}
</style>
