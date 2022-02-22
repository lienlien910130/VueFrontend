const moment = require("moment");
export default {
  computed: {
    ...Vuex.mapGetters([
      "id",
      "name",
      "buildingid",
      "buildinginfo",
      "buildingdevices",
      "buildingoptions",
      "buildingusers",
      "buildingcontactunit",
      "buildingroles",
      "buildingarray",
      "buildingfloors",
      "deviceType",
      "fullscreen",
      "device",
      "menu",
      "wsmsg",
      "actions",
      "wsuserId",
      "graphicMsg",
      "menuAuthority",
      "role_record",
      "account",
      "account_record",
      "floor_record",
      "process",
      "processMsg",
      "setting_record",
      "floorOfHouse_record",
      "buildingfloorOfHouse",
    ]),
  },
  created() {
    //因有緊急應變的情況是mobile，跳轉頁面時必須重新判定是否為電腦版
    const rect = document.body.getBoundingClientRect();
    const isMobile = rect.width - 1 < 992;
    if (isMobile && this.device !== "mobile") {
      this.$store.dispatch("app/toggleDevice", "mobile");
    } else if (!isMobile && this.device !== "desktop") {
      this.$store.dispatch("app/toggleDevice", "desktop");
    }
  },
  watch: {
    buildingid: {
      handler: async function () {
        if (this.buildingid !== undefined) {
          await this.init();
          this.device != "desktop"
            ? this.changeTable(false)
            : this.title == "maintain" ||
              this.title == "selfDefenseFireMarshalling"
            ? this.changeTable(false)
            : this.changeTable(true);
        }
      },
      immediate: true,
    },
    // menuAuthority:{
    //     handler:async function(){

    //     },
    //     immediate:true
    // },
    device: {
      handler: async function () {
        this.device != "desktop"
          ? this.changeTable(false)
          : this.changeTable(true);
      },
    },
  },
  data() {
    return {
      origin: [],
      selectSetting: [], //儲存篩選資料
      isTable: true,
      filterArray: [],
      exportExcelData: [],
      selectArray: [],
    };
  },
  methods: {
    async openDialogWindows() {
      if (
        this.$route.params.target !== undefined &&
        this.$route.params.target.length !== 0 &&
        this.$route.params.type == "open"
      ) {
        if (typeof this.$route.params.target == "object") {
          await this.handleBlock(
            this.title,
            "updateMany",
            this.$route.params.target
          );
        }
      } else if (
        this.$route.query.type !== undefined &&
        this.$route.query.type == this.title
      ) {
        await this.handleBlock(this.title, "empty", "");
      }
    },
    closeAll() {
      this.innerVisible = false;
      this.excelVisible = false;
      this.uploadVisible = false;
      this.authorityVisible = false;
      this.$refs.block.clearSelectArray();
    },
  },
};
