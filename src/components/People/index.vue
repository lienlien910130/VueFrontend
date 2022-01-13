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
          <i class="el-icon-circle-plus-outline" @click="'emptyUser', item" />
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
    marshallingClass: {
      type: Object,
      default: function () {
        return new SelfDefenseFireMarshallingMgmt({
          name: "滅火班",
          classLeaderId: "1",
          linkRoles: [],
          linkAccountList: [
            {
              id: "1",
              name: "系統管理員系統管理員系統管理員",
              headShotFileId: "3499",
            },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
            { id: "1", name: "系統管理員", headShotFileId: "3499" },
          ],
          linkContingencyProcess: [],
          linkFloors: [],
        });
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
            var url = await this.getUserPhoto(element.headShotFileId);
            this.account.push({
              id: element.id,
              name: element.name,
              headShotFileId: element.headShotFileId,
              url: url,
            });
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
        var filename = file.getExtName();
        var fileType = filename == "png" ? "image/png" : "image/jpeg";
        var data = await Files.getImage(headShotFileId);
        let url = URL.createObjectURL(new Blob([data], { type: fileType }));
        return url;
      }
      return "";
    },
    async handleOpenUser(index, content) {
      if (index === "delete") {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$emit("handleMarshallingMgmt", index, content);
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
