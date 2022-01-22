import Parent from "./parent";
import api from "@/api";

class CharacterStatus extends Parent {
  constructor(data) {
    super(data);
    const { cStatus, note, nowHave, occurDate } = data;
    this.cStatus = cStatus;
    this.note = note;
    this.nowHave = nowHave;
    this.occurDate = occurDate;
  }
  clone(data) {
    return new CharacterStatus(data);
  }
  async update(type) {
    var data = await api.authority
      .apiPatchCharacterStatus(type, this)
      .then(async (response) => {
        return new CharacterStatus(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create(type, accountId) {
    var data = await api.authority
      .apiPostCharacterStatus(type, accountId, this)
      .then((response) => {
        return new CharacterStatus(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete(type) {
    var data = await api.authority
      .apiDeleteCharacterStatus(type, this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  static empty() {
    return new CharacterStatus({
      id: "",
      cStatus: "",
      note: "",
      nowHave: true,
      occurDate: null,
    });
  }
  static getTableConfig() {
    return [
      {
        label: "人物狀態",
        prop: "cStatus",
        format: "cStatusOptions",
        mandatory: true,
        message: "請選擇人物狀態",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "selectSetting",
        selectFilter: true,
      },
      {
        label: "是否現在",
        prop: "nowHave",
        format: "nowHaveBoolean",
        mandatory: true,
        type: "boolean",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        formType: "boolean",
        selectFilter: false,
      },
      {
        label: "發生日期",
        prop: "occurDate",
        format: "YYYY-MM-DD",
        mandatory: false,
        isHidden: false,
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        formType: "date",
        selectFilter: false,
      },
      {
        label: "備註",
        prop: "note",
        format: "textarea",
        mandatory: false,
        isHidden: false,
        maxlength: "200",
        isSearch: true,
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: false,
        selectFilter: false,
      },
    ];
  }
  static async getOfID(type, id) {
    var data = await api.authority
      .apiGetCharacterStatusOfID(type, id)
      .then((response) => {
        return new CharacterStatus(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(type, accountId, data) {
    var data = await api.authority
      .apiGetAccountCharacterStatusSearchPages(type, accountId, data)
      .then((response) => {
        response.result = response.result
          .sort(function (x, y) {
            if (x.nowHave === y.nowHave) {
              return new Date(y.occurDate) - new Date(x.occurDate);
            }
            return y.nowHave - x.nowHave;
          })
          .map((item) => {
            return new CharacterStatus(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(type, accountId, data) {
    var data = await api.authority
      .apiPostCharacterStatuses(type, accountId, data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new CharacterStatus(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async deleteMany(type, data) {
    var data = await api.authority
      .apiDeleteCharacterStatus(type, data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default CharacterStatus;
