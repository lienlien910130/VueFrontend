import Parent from "./parent";
import api from "@/api";
import Device from "./device";
import Files from "./files";
import UsageOfFloor from "./usageOfFloor";
import idb from "@/utils/indexedDB";

class Floors extends Parent {
  constructor(data) {
    super(data);
    const { floor, floorPlanID, sort, isUnderground } = data;
    this.floor = floor;
    this.floorPlanID = floorPlanID == undefined ? null : floorPlanID;
    this.sort = sort;
    this.isUnderground = isUnderground;
  }
  clone(data) {
    return new Floors(data);
  }
  async update(buildingId) {
    var temp = JSON.parse(JSON.stringify(this));
    temp.floor = "{Check}" + temp.floor;
    var data = await api.building
      .apiPatchFloors(buildingId, temp)
      .then(async (response) => {
        return new Floors(response.result);
      })
      .catch((error) => {
        return {};
      });
    return data;
  }
  async delete() {
    var data = await api.building
      .apiDeleteFloors(this.id)
      .then(async (response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async getUsageOfFloor() {
    var data = await api.building
      .apiGetFloorOfHouse(this.id)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new UsageOfFloor(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async files() {
    var data = await api.files
      .apiGetFloorFiles(this.id)
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new Files(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  async createfiles(formData) {
    var data = await api.files
      .apiPostFloorFiles(this.id, formData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  async getGraphicFiles(type) {
    var data = await api.files
      .apiGetFloorIdToGraphicFile(type, this.id)
      .then((response) => {
        return response.result;
      })
      .catch((error) => {
        return null;
      });
    return data;
  }
  async postGraphicFiles(formData) {
    var data = await api.files
      .apiPostGraphicFile(this.id, formData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
  getName() {
    return this.floor;
  }
  setFloorPlanID(planID) {
    this.floorPlanID = planID;
  }
  getImageID() {
    return this.floorPlanID !== null ? this.floorPlanID.toString() : null;
  }
  async getImage() {
    var src = await idb.loadCacheImage(this.floorPlanID);
    return src;
  }
  static empty() {
    return new Floors({
      id: "",
      floor: "",
      floorPlanID: null,
      sort: 99,
      isUnderground: false, //是否為地下樓層
      linkDevices: [],
    });
  }
  static getTableConfig() {
    return [
      {
        label: "樓層",
        prop: "floor",
        formType: "inputString",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入樓層",
        maxlength: "10",
        placeholder: "請輸入樓層",
        isCheck: false,
        isUpload: false,
        isExport: true,
      },
      {
        label: "平面圖檔",
        prop: "floorPlanID",
        formType: "image",
        isTable: true,
        isBlock: false,
        isSearch: false,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: false,
        mandatory: false,
        type: "number",
        typemessage: "",
        isCheck: false,
        isUpload: false,
        isExport: false,
      },
      {
        label: "排序",
        prop: "sort",
        formType: "inputNumber",
        format: "inputnumber",
        isTable: true,
        isBlock: true,
        isSearch: true,
        selectFilter: false,
        isAssociate: false,
        isShow: true,
        isEdit: true,
        mandatory: true,
        message: "請輸入0~999",
        maxlength: "3",
        placeholder: "請輸入0~999",
        type: "number",
        typemessage: "",
        isPattern: true,
        pattern: /^[0-9]{1,3}$/,
        errorMsg: "請輸入0~999",
        isCheck: false,
        isUpload: true,
        isExport: true,
      },
    ];
  }
  static async get() {
    var data = await api.building
      .apiGetFloors()
      .then((response) => {
        var result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new Floors(item);
          });
        return result;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getOfId(floorId) {
    var data = await api.building
      .apiGetFloor(floorId)
      .then((response) => {
        var result = response.result.map((item) => {
          return new Floors(item);
        });
        return result[0];
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async getSearchPage(buildingId, data) {
    var data = await api.building
      .apiGetFloorSearchPages(buildingId, data)
      .then((response) => {
        response.result = response.result
          .sort((x, y) => x.sort - y.sort)
          .map((item) => {
            return new Floors(item);
          });
        return response;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async create(buildingId, data) {
    var data = await api.building
      .apiPostFloors(buildingId, data)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    return data;
  }
}

export default Floors;
