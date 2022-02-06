<template>
  <el-row class="classDiv">
    <el-col :xs="24" :sm="24" :md="24" :lg="4" class="col">
      <div class="divLeft">
        <h1>{{ marshallingClass.name }}</h1>
        <h2>
          隊長：{{
            changeShowFormatString(
              "classLeaderSelect",
              marshallingClass,
              "classLeaderId"
            )
          }}
        </h2>
        <h2 class="count">
          共 {{ account.length }} 人
          <!-- <i
            class="el-icon-circle-plus-outline"
            @click="handleOpenUser('createUser', marshallingClass)"
          /> -->
          <i
            class="el-icon-edit"
            @click="handleOpenUser('open', marshallingClass)"
          /><i
            class="el-icon-delete"
            @click="handleOpenUser('delete', marshallingClass)"
          />
        </h2>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="20" class="col">
      <div class="divRight">
        <template v-for="(item, index) in account">
          <div :key="index" class="accountInfo">
            <img
              v-if="item.url !== ''"
              :src="item.url"
              class="previewImg"
              @click="handleOpenUser('openUser', item)"
            />
            <svg-icon
              v-else
              icon-class="user"
              class="previewImg"
              @click="handleOpenUser('openUser', item)"
            />
            <h3 class="name">{{ item.name }}</h3>
          </div>
        </template>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { Files, SelfDefenseFireMarshallingMgmt } from "@/object";
import { computedmixin } from "@/mixin/index";
export default {
  name: "People",
  mixins: [computedmixin],
  props: {
    title: {
      type: String,
    },
    marshallingClass: {
      type: Object,
      default: function () {
        return new SelfDefenseFireMarshallingMgmt({});
      },
    },
  },
  data() {
    return {
      account: [],
    };
  },
  watch: {
    marshallingClass: {
      handler: async function () {
        if (this.marshallingClass.linkAccountList.length) {
          this.account = [];
          for await (let element of this.marshallingClass.linkAccountList) {
            console.log(element)
            var url = await this.getUserPhoto(element.headShotFileId);
            element.url = url;
            this.account.push(element);
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    //取得大頭貼
    async getUserPhoto(headShotFileId) {
      if (headShotFileId !== undefined && headShotFileId !== null) {
        var file = await Files.getOfID(headShotFileId);
        if (Object.keys(file).length) {
          var filename = file.getExtName();
          var fileType = filename == "png" ? "image/png" : "image/jpeg";
          var data = await Files.getImage(headShotFileId);
          let url = URL.createObjectURL(new Blob([data], { type: fileType }));
          return url;
        } else {
          return "";
        }
      }
      return "";
    },
    async handleOpenUser(index, content) {
      console.log(this.title);
      if (index === "delete") {
        this.$confirm("是否確認刪除該筆編組?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("handleMarshallingMgmt", this.title, index, content);
          })
          .catch(() => {
            return false;
          });
      } else {
        this.$emit("handleMarshallingMgmt", this.title, index, content);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
i {
  cursor: pointer;
}
.classDiv {
  height: 250px;
  .col {
    height: 100%;
  }
  .divLeft {
    border: 1px dashed black;

    height: 100%;
    padding: 5px;

    .count {
      position: absolute;
      bottom: 0px;
    }
  }
  .divRight {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    border: 1px dashed black;
    .accountInfo {
      width: 250px;
      border: 1px solid black;
      margin: 5px 8px;
      vertical-align: middle;
      text-align: center;
      cursor: pointer;

      .previewImg {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 200px;
        height: 160px;
      }
      .name {
        margin: 2px auto;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .accountInfo:hover {
      border: 1px solid blue;
      background-color: gray;
    }
  }
}
</style>
