import Parent from "./parent";
import api from "@/api";
import UsageOfFloor from "./usageOfFloor";
import { removeDuplicates } from "@/utils/index";
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
  getUsageOfFloorsName() {
    return this.linkUsageOfFloors
      .map((item) => {
        return item.getName();
      })
      .toString();
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
        format: "floorOfHouseSelect",
        mandatory: true,
        message: "請選擇單位",
        type: "object",
        typemessage: "",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "singleChoice",
        limit: 1,
        selectFilter: true,
        hasEvent: true,
      },
      {
        label: "職稱",
        prop: "title",
        mandatory: true,
        message: "請輸入職稱",
        isHidden: false,
        maxlength: "50",
        isSearch: true,
        placeholder: "請輸入職稱",
        isAssociate: false,
        isEdit: true,
        isUpload: true,
        isExport: true,
        isBlock: true,
        selectFilter: false,
      },
      {
        label: "住戶",
        prop: "linkUsers",
        format: "commitUserInfo",
        type: "object",
        typemessage: "",
        mandatory: true,
        message: "請選擇住戶",
        isHidden: false,
        isSearch: false,
        isAssociate: true,
        isEdit: true,
        isUpload: false,
        isExport: true,
        isBlock: true,
        formType: "singleChoice",
        limit: 1,
        selectFilter: true,
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
