import Parent from "./parent";
import api from "@/api";
import UsageOfFloor from "./usageOfFloor";
import { Account } from ".";

class Committee extends Parent {
  constructor(data) {
    super(data);
    const { title, note, linkUsageOfFloors, linkUsers } = data;
    var usageOfFloor =
      linkUsageOfFloors !== undefined
        ? linkUsageOfFloors.map((item) => {
            return new UsageOfFloor(item);
          })
        : [];
    var user =
      linkUsers !== undefined
        ? linkUsers.map((item) => {
            return new Account(item);
          })
        : [];
    this.title = title;
    this.note = note;
    this.linkUsageOfFloors = usageOfFloor;
    this.linkUsers = user;
  }
  clone(data) {
    return new Committee(data);
  }
  async update() {
    var data = await api.building
      .apiPatchCommittee(this)
      .then(async (response) => {
        return new Committee(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async create() {
    var data = await api.building
      .apiPostCommittee(this)
      .then((response) => {
        return new Committee(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteCommittee(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return this.title;
  }
  getUsageOfName() {
    return this.title + "-" + this.linkUsers[0].name;
  }
  getLinkUsers() {
    return this.linkUsers;
  }
  getLinkUsageOfFloors() {
    return this.linkUsageOfFloors;
  }
  //搜門關聯門牌的所有使用者，去掉重複的
  static empty() {
    return new Committee({
      id: "",
      title: "",
      note: "",
      linkUsageOfFloors: [],
      linkUsers: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "所屬單位",
        prop: "linkUsageOfFloors",
        formType: "singleChoice",
        format: "floorOfHouseSelect",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇單位",
        type: "object",
        typemessage: "",
        hasEvent: true,
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "職稱",
        prop: "title",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入職稱",
        maxlength: "50",
        placeholder: "請輸入職稱",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
      {
        label: "住戶",
        prop: "linkUsers",
        formType: "singleChoice",
        format: "commitUserInfo",
        isTable: true,
        isBlock: true,
        isSearch: false,
        selectFilter: true,
        isAssociate: true,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請選擇住戶",
        type: "object",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "備註",
        prop: "note",
        formType: "inputString",
        format: "textarea",
        isTable: true,
        isBlock: false,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: false,
        maxlength: "200",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
    ];
  }
  static async get() {
    var data = await api.building
      .apiGetCommittee()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Committee(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfID(id) {
    var data = await api.building
      .apiGetCommitteeOfID(id)
      .then((response) => {
        return new Committee(response.result[0]);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  static async getSearchPage(data) {
    var data = await api.building
      .apiGetCommitteeSearchPages(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Committee(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async postMany(data) {
    var data = await api.building
      .apiPostCommittees(data)
      .then((response) => {
        response.result = response.result.map((item) => {
          return new Committee(item);
        });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async deleteMany(data) {
    var data = await api.building
      .apiDeleteCommittee(data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Committee;
