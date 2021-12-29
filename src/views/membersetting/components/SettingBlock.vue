<template>
  <div class="setting-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ titleToch }}</span>
        <template
          v-if="
            title === 'InspectionTypeOfTime' || title === 'PublicSafeTypeOfTime'
          "
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="Top Left 提示文字"
            placement="top-start"
          >
            <i class="el-icon-warning-outline" @click="open"></i>
          </el-tooltip>
        </template>
        <div style="margin-top: 10px">
          <el-row>
            <el-form
              :inline="true"
              :model="formInline"
              class="settingFormInline"
              size="mini"
              ref="settingForm"
              @submit.native.prevent
            >
              <el-form-item
                prop="textName"
                :rules="[{ required: true, message: '不能為空' }]"
              >
                <el-input
                  id="inputText"
                  v-model="formInline.textName"
                  placeholder="請輸入名稱"
                  @keyup.enter.native="onSubmit"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="title === 'PublicSafeTypeOfTime'">
                <el-select v-model="select" placeholder="請選擇">
                  <el-option label="每年一次" value="1"></el-option>
                  <el-option label="每兩年一次" value="2"></el-option>
                  <el-option label="每三年一次" value="3"></el-option>
                  <el-option label="每四年一次" value="4"></el-option>
                  <el-option label="每五年一次" value="5"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="
                  title === 'InspectionTypeOfTime' ||
                  title === 'PublicSafeTypeOfTime'
                "
                prop="value"
                :rules="[{ required: true, message: '不能為空' }]"
              >
                <el-select
                  v-model="formInline.value"
                  multiple
                  placeholder="申報期限月份"
                  collapse-tags
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 
              <el-form-item v-else-if="title === 'PublicSafeTypeOfTime'">
               

                <el-select
                  v-model="formInline.value"
                  multiple
                  placeholder="申報期限季"
                  collapse-tags
                  @change="onchange"
                >
                  <el-option
                    v-for="item in season"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item
                v-else-if="
                  title === 'InspectionTimeOptions' ||
                  title === 'PublicSafeTimeOptions' ||
                  title === 'MaintainTimeOptions'
                "
                prop="value"
                :rules="[
                  { required: true, message: '不能為空' },
                  { pattern: /^\+?[1-9][0-9]*$/, message: '請輸入數字' },
                ]"
              >
                <el-input
                  v-model="formInline.value"
                  placeholder="請輸入天數"
                  @keyup.enter.native="onSubmit"
                ></el-input>
              </el-form-item>
              <el-button
                type="primary"
                size="mini"
                @click="onSubmit"
                class="settingButton"
                >{{ status == "create" ? "新增" : "更新" }}</el-button
              >
              <el-button
                v-if="status == 'update'"
                size="mini"
                @click="onCancel"
                class="settingButton"
                >取消</el-button
              >
            </el-form>
          </el-row>
        </div>
      </div>
      <div class="settingbody">
        <div>
          <div
            v-for="(item, index) in option"
            :key="index"
            class="text"
            :style="itemtext"
          >
            <div>
              <div :style="{ display: 'inline-block', width: labelstyle }">
                <el-radio
                  v-if="
                    title == 'MaintainTimeOptions' ||
                    title === 'InspectionTimeOptions' ||
                    title === 'PublicSafeTimeOptions'
                  "
                  v-model="radio"
                  :label="item.id"
                  @change="onSave"
                >
                  <span style="color: #303133; font-size: 18px">
                    {{ index + 1 }}.
                    {{ item.textName }}
                  </span>
                </el-radio>
                <span v-else>
                  {{ index + 1 }}.
                  {{ item.textName }}
                  <template
                    v-if="
                      title === 'InspectionTypeOfTime' ||
                      title === 'PublicSafeTypeOfTime'
                    "
                  >
                    {{ item.value | changeMonth }}
                  </template>
                </span>
              </div>
              <span>
                <i
                  v-if="!item.systemUse"
                  class="el-icon-delete"
                  style="float: right; font-size: 25px"
                  @click="deleteData(item.id)"
                ></i>
                <i
                  class="el-icon-edit"
                  style="float: right; font-size: 25px"
                  @click="changeEdit(item)"
                ></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { title } from "@/settings";
export default {
  props: {
    title: {
      type: String,
    },
    option: {
      type: Array,
    },
    radio: {
      type: String,
    },
  },
  data() {
    return {
      status: "create",
      options: [
        { label: "1月", value: "1" },
        { label: "2月", value: "2" },
        { label: "3月", value: "3" },
        { label: "4月", value: "4" },
        { label: "5月", value: "5" },
        { label: "6月", value: "6" },
        { label: "7月", value: "7" },
        { label: "8月", value: "8" },
        { label: "9月", value: "9" },
        { label: "10月", value: "10" },
        { label: "11月", value: "11" },
        { label: "12月", value: "12" },
      ],
      // season: [
      //   { label: "第一季(1/1~3/31)", value: "1" },
      //   { label: "第二季(4/1~6/30)", value: "4" },
      //   { label: "第三季(7/1~9/30)", value: "7" },
      //   { label: "第四季(10/1~12/31)", value: "10" },
      // ],
      formInline: {
        id: null,
        textName: "",
        value: "",
      },
      originalRadio: null,
      select: "1",
      value1: [],
    };
  },
  filters: {
    changeMonth: function (val) {
      var list = val.split(",");
      if (title === "InspectionTypeOfTime") {
        var array = list.map((item) => {
          return item + "月";
        });
        var str = array.join("及");
        return "每年" + str + "前";
      } else {
        var str =
          "每" + list[0] + "年一次，" + list[1] + "月到" + list[2] + "月";
        return str;
      }
    },
  },
  mounted() {
    this.onCancel();
  },
  computed: {
    titleToch() {
      switch (this.title) {
        case "ContactUnitOptions":
          return "廠商類別";
        case "MaintainContentOptions":
          return "維護保養內容";
        case "MaintainProcessOptions":
          return "維護保養處理狀況";
        case "MaintainTimeOptions":
          var obj = this.option.filter((item) => {
            return item.checked == true;
          });
          if (obj.length) {
            this.radio = obj[0].id;
            this.originalRadio = obj[0].id;
          }
          return "維護保養提醒設定";
        case "InspectionTypeOfTime":
          return "檢修申報期限設定";
        case "InspectionTimeOptions":
          var obj = this.option.filter((item) => {
            return item.checked == true;
          });
          if (obj.length) {
            this.radio = obj[0].id;
            this.originalRadio = obj[0].id;
          }
          return "檢修申報提醒設定";
        case "LackStatusOptions":
          return "公安申報缺失內容改善狀況";
        case "PublicSafeTypeOfTime":
          return "公安申報期限設定";
        case "PublicSafeTimeOptions":
          var obj = this.option.filter((item) => {
            return item.checked == true;
          });
          if (obj.length) {
            this.radio = obj[0].id;
            this.originalRadio = obj[0].id;
          }
          return "公安申報提醒設定";
        case "PublicSafeTimeStartAndfrequency":
          return "公安申報提醒起始及頻率";
      }
    },
    inputstyle() {
      if (this.$store.state.app.device === "mobile") {
        return "60%";
      } else {
        return "79%";
      }
    },
    labelstyle() {
      if (this.$store.state.app.device === "mobile") {
        return "80%";
      } else {
        return "60%";
      }
    },
    itemtext() {
      if (this.$store.state.app.device === "mobile") {
        return "font-size:14px";
      } else {
        return "font-size:18px";
      }
    },
  },
  methods: {
    onSubmit() {
      this.$refs.settingForm.validate((valid) => {
        if (valid) {
          var temp = _.cloneDeep(this.formInline);
          if (this.title == "PublicSafeTypeOfTime") {
            temp.value = temp.value.sort(function (a, b) {
              return ("" + a).localeCompare(b);
            });
            temp.value = [this.select, temp.value[0], temp.value.pop()];
          }
          this.$emit("handleButton", this.title, this.status, temp);
          this.onCancel();
        } else {
          return false;
        }
      });
    },
    onSave() {
      this.$confirm("是否確定要更新?", "", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var temp = [];
          if (
            this.originalRadio !== null &&
            this.originalRadio !== this.radio
          ) {
            temp.push({ id: this.originalRadio, checked: false });
          }
          if (this.originalRadio !== this.radio) {
            temp.push({ id: this.radio, checked: true });
          }
          this.$emit("handleButton", this.title, "update", temp);
        })
        .catch(() => {
          this.radio = this.originalRadio;
        });
    },
    onCancel() {
      this.status = "create";
      this.$refs.settingForm.resetFields();
      this.formInline = {
        id: null,
        textName: "",
        value:
          this.title === "InspectionTypeOfTime" ||
          this.title === "PublicSafeTypeOfTime"
            ? []
            : "",
      };
      this.select = "1";
      document.getElementById("inputText").blur();
    },
    changeEdit(item) {
      this.status = "update";
      this.formInline = _.cloneDeep(item);
      if (item.classType === "InspectionTypeOfTime") {
        this.formInline.value = item.value.split(",");
      } else if (item.classType === "PublicSafeTypeOfTime") {
        var valueList = item.value.split(",");
        this.select = valueList[0];
        var startMonth = valueList[1];
        var end = valueList[2];
        var array = [];
        for (var i = startMonth; i <= end; i++) {
          array.push(i.toString());
        }
        this.formInline.value = array;
      } else {
        this.formInline.value = item.value;
      }
    },
    deleteData(id) {
      this.$confirm("是否確定刪除該筆資料?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$emit("handleButton", this.title, "delete", id);
      });
    },
    open() {
      this.$alert(
        '<strong>依據<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0120054" target="_blank" style="color:blue">【消防安全設備檢修及申報辦法】</a>及<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0120054" target="_blank" style="color:blue">【各類場所消防安全設備設置標準】</a>之規定如下所述</strong><br/><div class="law-article"><div class="line-0000">各類場所按用途分類如下：</div><div class="line-0004">一、甲類場所：</div><div class="line-0006">（一）電影片映演場所（戲院、電影院）、歌廳、舞廳、夜總會、俱樂部、理容院（觀光理髮、視聽理容等）、指壓按摩場所、錄影節目帶播映場所（MTV等）、視聽歌唱場所（KTV等）、酒家、酒吧、酒店（廊）。</div><div class="line-0006">（二）保齡球館、撞球場、集會堂、健身休閒中心（含提供指壓、三溫暖等設施之美容瘦身場所）、室內螢幕式高爾夫練習場、遊藝場所、電子遊戲場、資訊休閒場所。</div><div class="line-0006">（三）觀光旅館、飯店、旅館、招待所（限有寢室客房者）。</div><div class="line-0006">（四）商場、市場、百貨商場、超級市場、零售市場、展覽場。</div><div class="line-0006">（五）餐廳、飲食店、咖啡廳、茶藝館。</div><div class="line-0006">（六）醫院、療養院、榮譽國民之家、長期照顧服務機構（限機構住宿式、社區式之建築物使用類組非屬H-2之日間照顧、團體家屋及小規模多機能）、老人福利機構（限長期照護型、養護型、失智照顧型之長期照顧機構、安養機構）、兒童及少年福利機構（限托嬰中心、早期療育機構、有收容未滿二歲兒童之安置及教養機構）、護理機構（限一般護理之家、精神護理之家、產後護理機構）、身心障礙福利機構（限供住宿養護、日間服務、臨時及短期照顧者）、身心障礙者職業訓練機構（限提供住宿或使用特殊機具者）、啟明、啟智、啟聰等特殊學校。</div><div class="line-0006">（七）三溫暖、公共浴室。</div><div class="line-0004">二、乙類場所：</div><div class="line-0006">（一）車站、飛機場大廈、候船室。</div><div class="line-0006">（二）期貨經紀業、證券交易所、金融機構。</div><div class="line-0006">（三）學校教室、兒童課後照顧服務中心、補習班、訓練班、K 書中心、前款第六目以外之兒童及少年福利機構（限安置及教養機構）及身心障礙者職業訓練機構。</div><div class="line-0006">（四）圖書館、博物館、美術館、陳列館、史蹟資料館、紀念館及其他類似場所。</div><div class="line-0006">（五）寺廟、宗祠、教堂、供存放骨灰（骸）之納骨堂（塔）及其他類似場所。</div><div class="line-0006">（六）辦公室、靶場、診所、長期照顧服務機構（限社區式之建築物使用類組屬H-2之日間照顧、團體家屋及小規模多機能）、日間型精神復健機構、兒童及少年心理輔導或家庭諮詢機構、身心障礙者就業服務機構、老人文康機構、前款第六目以外之老人福利機構及身心障礙福利機構。</div><div class="line-0006">（七）集合住宅、寄宿舍、住宿型精神復健機構。</div><div class="line-0006">（八）體育館、活動中心。</div><div class="line-0006">（九）室內溜冰場、室內游泳池。</div><div class="line-0006">（十）電影攝影場、電視播送場。</div><div class="line-0008">（十一）倉庫、傢俱展示販售場。</div><div class="line-0008">（十二）幼兒園。</div><div class="line-0004">三、丙類場所：</div><div class="line-0006">（一）電信機器室。</div><div class="line-0006">（二）汽車修護廠、飛機修理廠、飛機庫。</div><div class="line-0006">（三）室內停車場、建築物依法附設之室內停車空間。</div><div class="line-0004">四、丁類場所：</div><div class="line-0006">（一）高度危險工作場所。</div><div class="line-0006">（二）中度危險工作場所。</div><div class="line-0006">（三）低度危險工作場所。</div><div class="line-0004">五、戊類場所：</div><div class="line-0006">（一）複合用途建築物中，有供第一款用途者。</div><div class="line-0006">（二）前目以外供第二款至前款用途之複合用途建築物。</div><div class="line-0006">（三）地下建築物。</div><div class="line-0004">六、其他經中央主管機關公告之場所。</div></div>',
        "內容說明",
        {
          customClass: "message_box_alert",
          dangerouslyUseHTMLString: true,
        }
      );
      var elmnt = document.getElementsByClassName("message_box_alert");
      elmnt.scrollTop = 0;
    },
  },
};
</script>
<style lang="scss">
.message_box_alert {
  height: 80%;
  overflow-y: auto;
  width: 60% !important;
}
.settingFormInline {
  .el-input__inner {
    width: 180px !important;
  }
  .el-button {
    margin: 0px !important;
  }
  .el-button + .el-button {
    margin: 0px !important;
  }
}
</style>

<style lang="scss" scoped>
.setting-wrapper {
  margin: 10px;

  .text {
    line-height: 25px;
    margin-bottom: 10px;
  }

  .settingbody {
    height: 240px;
    overflow: auto;
  }
}

i {
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
