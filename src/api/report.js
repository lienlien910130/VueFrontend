import req from "./https";
import store from "../store";

const report = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },
  //檢修申報
  apiGetBuildingInspection() {
    return req("get", "/reportInspection/" + this.getBid() + "/a");
  },
  apiGetInspectionSearchPages(data) {
    return req("post", "/reportInspection/ss", this.getBid(), data, true);
  },
  apiGetInspection(reportInspectionListId) {
    return req("get", "/reportInspection/" + reportInspectionListId);
  },
  apiPostInspection(data) {
    return req("post", "/reportInspection", this.getBid(), data);
  },
  apiPatchInspection(data) {
    return req("patch", "/reportInspection", null, data);
  },
  apiDeleteInspection(reportInspectionListId) {
    return req("delete", "/reportInspection/" + reportInspectionListId);
  },
  apiPostInspections(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/reportInspection/s", null, data);
  },
  apiGetInspectionColumn(data) {
    return req("post", "/reportInspection/list/listValue", this.getBid(), data);
  },
  apiGetInspectionRemind(type) {
    return req("get", type + "/inspectionReminder");
  },
  //檢修申報-更新維保細項
  apiPatchMaintainManagementOfInspection(data) {
    return req("patch", "/reportInspection/maintainManagement/s", null, data);
  },

  //檢修申報缺失
  apiGetInspectionLackOfID(id) {
    return req("get", "index/reportInspection/InspectionLack/" + id);
  },
  apiGetInspectionLack(inspectionId) {
    return req(
      "get",
      "/reportInspection/InspectionLack/" + inspectionId + "/a"
    );
  },
  apiPostInspectionLack(inspectionId, data) {
    return req("post", "/reportInspection/InspectionLack", inspectionId, data);
  },
  apiPatchInspectionLack(data) {
    return req("patch", "/reportInspection/InspectionLack", null, data);
  },
  apiDeleteInspectionLack(inspectionLackId) {
    return req(
      "delete",
      "/reportInspection/InspectionLack/" + inspectionLackId
    );
  },
  apiPostInspectionLackFiles(autoCreateMaintain, inspectionId, fileId, cover) {
    return req(
      "post",
      "/reportInspection/InspectionLack/" +
        autoCreateMaintain +
        "/" +
        inspectionId +
        "/inspectionLack/load/" +
        fileId +
        "/" +
        cover,
      null
    );
  },
  apiGetInspectionLackSearchPages(inspectionId, data) {
    return req(
      "post",
      "/reportInspection/InspectionLack/ss",
      inspectionId,
      data
    );
  },
  apiPostInspectionLacks(inspectionId, data) {
    data.forEach((element) => {
      element.parentId = inspectionId;
    });
    return req("post", "/reportInspection/InspectionLack/s", null, data);
  },
  apiGetAllInspectionLackSearchPages(type, data) {
    return req(
      "post",
      type + "/inspectionLack/buildInfo/ss",
      this.getBid(),
      data
    );
  },

  //公安申報
  apiGetBuildingPublicSafe() {
    return req("get", "/reportPublicSafe/" + this.getBid() + "/a");
  },
  apiGetPublicSafe(reportPublicSafeListId) {
    return req("get", "/reportPublicSafe/" + reportPublicSafeListId);
  },
  apiPostPublicSafe(data) {
    return req("post", "/reportPublicSafe", this.getBid(), data);
  },
  apiPatchPublicSafe(data) {
    return req("patch", "/reportPublicSafe", null, data);
  },
  apiDeletePublicSafe(reportPublicSafeListId) {
    return req("delete", "/reportPublicSafe/" + reportPublicSafeListId);
  },
  apiGetPublicSafeSearchPages(data) {
    return req("post", "/reportPublicSafe/ss", this.getBid(), data, true);
  },
  apiPostPublicSafes(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/reportPublicSafe/s", null, data);
  },
  apiGetPublicSafeColumn(data) {
    return req("post", "/reportPublicSafe/list/listValue", this.getBid(), data);
  },
  apiGetPublicSafeRemind(type) {
    return req("get", type + "/publicSafeReminder");
  },

  //公安申報缺失
  apiGetPublicSafeLack(publicSafeId) {
    return req(
      "get",
      "/reportPublicSafe/PublicSafeLack/" + publicSafeId + "/a"
    );
  },
  apiPostPublicSafeLack(publicSafeId, data) {
    return req("post", "/reportPublicSafe/PublicSafeLack", publicSafeId, data);
  },
  apiPatchPublicSafeLack(data) {
    return req("patch", "/reportPublicSafe/PublicSafeLack", null, data);
  },
  apiDeletePublicSafeLack(publicSafeLackId) {
    return req(
      "delete",
      "/reportPublicSafe/PublicSafeLack/" + publicSafeLackId
    );
  },
  apiGetPublicSafeLackSearchPages(publicSafeId, data) {
    return req(
      "post",
      "/reportPublicSafe/PublicSafeLack/ss",
      publicSafeId,
      data
    );
  },
  apiGetAllPublicSafeLackSearchPages(type, data) {
    return req(
      "post",
      type + "/publicSafeLack/buildInfo/ss",
      this.getBid(),
      data
    );
  },
  apiPostPublicSafeLacks(publicSafeId, data) {
    data.forEach((element) => {
      element.parentId = publicSafeId;
    });
    return req("post", "/reportPublicSafe/PublicSafeLack/s", null, data);
  },
};

export default report;
