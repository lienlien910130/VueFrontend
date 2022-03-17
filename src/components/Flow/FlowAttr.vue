<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-body">
        <el-form
          :model="node"
          ref="dataForm"
          label-position="left"
          label-width="50px"
          v-show="type === 'node'"
          @submit.native.prevent
          style="padding-left: 10px"
        >
          <el-form-item label="ID">
            <el-input v-model="node.nodeId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="類型">
            <el-input v-model="node.nType" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名稱">
            <el-input
              v-model="node.name"
              @input="save"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="node.nType == 12" label="流程">
            <el-select
              v-model="node.nextCpId"
              placeholder="請選擇"
              filterable
              @change="save"
              :disabled="disabled"
              :key="selectKey"
            >
              <el-option
                v-for="(item, index) in optionFilter('processSelect')"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.id == processId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              node.nType == 21 ||
              node.nType == 50 ||
              node.nType == 61 ||
              node.nType == 62
            "
            label="角色"
          >
            <el-select
              v-model="node.linkRoles"
              placeholder="請選擇"
              filterable
              multiple
              value-key="id"
              @change="filterAccount"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in optionFilter('roleSelect')"
                :key="index"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              node.nType == 21 ||
              node.nType == 50 ||
              node.nType == 61 ||
              node.nType == 62
            "
            label="人員"
          >
            <el-select
              v-model="node.linkAccountList"
              placeholder="請選擇"
              filterable
              multiple
              value-key="id"
              @change="save"
              :disabled="disabled"
            >
              <el-option
                v-for="(item, index) in accountArray"
                :key="index"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            v-if="node.nType == 21 || node.nType == 25"
            label="訊息"
          >
            <el-input
              v-model="node.message"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 12 }"
              @input="save"
              :disabled="disabled"
            ></el-input>
          </el-form-item> -->
          <el-form-item
            v-if="node.nType == 21 || node.nType == 25"
            label="訊息"
          >
            <div
              id="divID"
              :class="divClass"
              :contenteditable="!disabled"
              v-html="innerText"
              @input="changeText"
              @blur="getBlur"
              :key="selectKey"
            ></div>
          </el-form-item>
          <el-form-item v-if="node.nType == 21 || node.nType == 25">
            <el-button
              size="mini"
              round
              @click="addSpan('bN')"
              :disabled="disabled"
              >大樓名稱</el-button
            >
            <el-button
              size="mini"
              round
              @click="addSpan('uofN')"
              :disabled="disabled"
              >門牌名稱</el-button
            >
          </el-form-item>
        </el-form>
        <el-form
          :model="line"
          ref="dataForm"
          label-width="80px"
          v-show="type === 'line'"
          @submit.native.prevent
        >
          <el-form-item label="備註">
            <el-input v-model="line.label" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item v-show="!disabled">
            <el-button type="primary" icon="el-icon-check" @click="saveLine"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Role, SelfDefenseFireMarshalling } from "@/object";
import { getUUID } from "@/utils";

export default {
  props: {
    title: {
      type: String,
      default: "contingencyProcess",
    },
    processId: { type: String },
    processArray: {
      type: Array,
      default: function () {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: true,
      // node 或 line
      type: null,
      node: {},
      line: {},
      data: {},
      accountArray: [],
      selectKey: getUUID(),
      innerText: "",
      sel: null,
      range: null,
    };
  },
  computed: {
    ...Vuex.mapGetters(["buildingroles", "role_record"]),
    optionFilter() {
      return function (value) {
        if (value !== null) {
          switch (value) {
            case "processSelect":
              return this.processArray.map((v) => {
                var process = {
                  name: v.name,
                  id: v.id,
                };
                return process;
              });
            case "roleSelect":
              if (this.role_record == 0) {
                this.$store.dispatch("building/setroles");
                this.$store.dispatch("record/saveRoleRecord", 1);
              }
              return this.buildingroles.map((v) => {
                var role = {
                  name: v.getName(),
                  id: v.getID(),
                };
                return role;
              });
          }
        } else {
          return [];
        }
      };
    },
    divClass() {
      return {
        contenteditableDIV: true,
        contenteditableDIVdisable: this.disabled,
      };
    },
  },
  methods: {
    async nodeInit(data, id) {
      this.selectKey = getUUID();
      this.sel = null;
      this.range = null;
      this.innerText = "";
      this.type = "node";
      this.data = data;
      data.nodeList.filter((node) => {
        if (node.nodeId === id) {
          this.node = _.cloneDeep(node);
          var msg = _.cloneDeep(this.node.message);
          var str_one = msg.replaceAll(
            "{bN}",
            '<span contentEditable="false" style="border-width: 1px;border-style: dashed;border-color: #ffac55; padding:0 2px;margin:0 5px">大樓名稱</span>'
          );
          this.innerText = str_one.replaceAll(
            "{uofN}",
            '<span contentEditable="false" style="border-width: 1px;border-style: dashed;border-color: #ffac55; padding:0 2px;margin:0 5px">門牌名稱</span>'
          );
        }
      });
      this.node.linkRoles = this.node.linkRoles.map((item) => {
        return new Role(item);
      });
      this.accountArray = this.node.linkAccountList;
      // if (this.title == "selfDefenseClass") {
      //   this.accountArray = this.node.linkAccountList;
      // } else {
      //   await this.filterAccount(this.node.linkRoles);
      // }
    },
    lineInit(line) {
      this.type = "line";
      this.line = line;
    },
    // 修改線
    saveLine() {
      this.$emit(
        "setLineLabel",
        this.line.from,
        this.line.to,
        this.line.label,
        this.line.id
      );
    },
    // 修改節點
    save() {
      this.data.nodeList.filter((node) => {
        if (node.nodeId === this.node.nodeId) {
          node.name = this.node.name;
          node.left = this.node.left;
          node.top = this.node.top;
          node.message = this.node.message;
          node.linkRoles = this.node.linkRoles;
          node.linkAccountList = this.node.linkAccountList;
          node.nextCpId = this.node.nextCpId;
          this.$emit("repaintEverything");
        }
      });
    },
    async filterAccount(value) {
      this.save();
      var account = [];
      for (let role of value) {
        if (role) {
          var result = await SelfDefenseFireMarshalling.getAccountByRole(
            role.id
          );
          result.forEach((element) => {
            account.push(element);
          });
        }
      }
      const set = new Set();
      this.accountArray = account
        .filter((item) => (!set.has(item.id) ? set.add(item.id) : false))
        .map((v) => {
          var account = {
            name: v.name,
            id: v.id,
          };
          return account;
        });
    },
    changeText() {
      var div = document.getElementById("divID");
      var text = div.innerText;
      this.node.message = text.replaceAll("大樓名稱", "{bN}");
      this.node.message = this.node.message.replaceAll("門牌名稱", "{uofN}");
      this.save();
    },
    addSpan(type) {
      //獲取光標位置並插入字
      var text = type == "bN" ? "大樓名稱" : "門牌名稱";
      var str =
        '<span contentEditable="false" style="border-width: 1px;border-style: dashed;border-color: #ffac55; padding:0 2px;margin:0 5px">' +
        text +
        "</span>";
      this.insertHtmlAtCaret(str);
    },
    getBlur() {
      this.sel = window.getSelection();
      this.range = this.sel.getRangeAt(0);
      this.range.deleteContents();
    },
    insertHtmlAtCaret(html) {
      if (window.getSelection) {
        // IE9 and non-IE
        if (this.sel !== null && this.sel.getRangeAt && this.sel.rangeCount) {
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(),
            node,
            lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          this.range.insertNode(frag);
          // Preserve the selection
          if (lastNode) {
            this.range = this.range.cloneRange();
            this.range.setStartAfter(lastNode);
            this.range.collapse(true);
            this.sel.removeAllRanges();
            this.sel.addRange(this.range);
          }
          this.changeText();
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
        this.changeText();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}

/*node-form*/
.ef-node-form-header {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #f1f3f4;
  color: #000;
  line-height: 32px;
  padding-left: 12px;
  font-size: 14px;
}

.ef-node-form-body {
  margin-top: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
}

.contenteditableDIV {
  width: 100%;
  height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px 15px;
  line-height: 1.5;
  color: #606266;
  font-family: sans-serif;
  font-size: 14px;
}
.contenteditableDIVdisable {
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: #f5f7fa;
}
.contenteditableDIV:focus-within {
  border: 1px solid red;
}
</style>
