import req from "./https";
import store from "../store";

const selfDefenseFireMarshalling = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  //自衛消防編組大項
  apiGetAllFireMarshalling() {
    return req("get", "/selfDefenseFireMarshalling/" + this.getBid() + "/a");
  },
  apiGetFireMarshalling(selfDefenseFireMarshallingId) {
    return req(
      "get",
      "/selfDefenseFireMarshalling/" + selfDefenseFireMarshallingId
    );
  },
  apiPostFireMarshalling(data) {
    return req("post", "/selfDefenseFireMarshalling", this.getBid(), data);
  },
  apiPatchFireMarshalling(data) {
    return req("patch", "/selfDefenseFireMarshalling", null, data);
  },
  apiDeleteFireMarshalling(selfDefenseFireMarshallingId) {
    return req(
      "delete",
      "/selfDefenseFireMarshalling/" + selfDefenseFireMarshallingId
    );
  },
  // apiGetFireMarshallingSearchPages(type, data) {
  //   return req("post", type + "/ss", this.getBid(), data, true);
  // },
  apiGetAllProcess(type, selfDefenseFireMarshallingId) {
    return req(
      "get",
      type + "/" + selfDefenseFireMarshallingId + "/contingencyProcessList"
    );
  },
  apiGetAccountByRole(roleId) {
    return req("get", "/selfDefenseFireMarshalling/" + roleId + "/accounts");
  },
  apiPatchFloorFromMgmt(selfDefenseFireMarshallingId) {
    return req(
      "delete",
      "/selfDefenseFireMarshalling/" + selfDefenseFireMarshallingId + "/floors"
    );
  },
  //自衛消防編組細項-班別
  apiGetFireMarshallingMgmt(type ,selfDefenseFireMarshallingId) {
    return req(
      "get",
      type +"/" +
        selfDefenseFireMarshallingId +
        "/a"
    );
  },
  apiPostFireMarshallingMgmt(data) {
    return req(
      "post",
      "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/check",
      this.getBid(),
      data
    );
  },
  apiPutFireMarshallingMgmt(data) {
    return req(
      "put",
      "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/check",
      this.getBid(),
      data
    );
  },
  apiDeleteFireMarshallingMgmt(mgmtId) {
    return req(
      "delete",
      "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/" + mgmtId
    );
  },
  apiGetFireMarshallingMgmtSearchPages(selfDefenseFireMarshallingId, data) {
    return req(
      "post",
      "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/ss",
      selfDefenseFireMarshallingId,
      data
    );
  },
  apiPostFireMarshallingMgmts(selfDefenseFireMarshallingId, data) {
    data.forEach((element) => {
      element.parentId = selfDefenseFireMarshallingId;
    });
    return req(
      "post",
      "/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/check/s",
      null,
      data
    );
  },
  //透過樓層取得班別
  apiGetMarshallingMgmtOfFloor(type, floorId) {
    return req("get", type + "/floors/" + floorId);
  },
  //細項的流程資料 p:細項
  apiGetContingencyProcess(mgmtId) {
    return req(
      "get",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess/" + mgmtId + "/a"
    );
  },
  apiPostContingencyProcess(mgmtId, data) {
    return req(
      "post",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess",
      mgmtId,
      data
    );
  },
  apiPatchContingencyProcess(data) {
    return req(
      "patch",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess",
      null,
      data
    );
  },
  apiDeleteContingencyProcess(processId) {
    return req(
      "delete",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess/" + processId
    );
  },
  //apiGetContingencyProcessSearchPages(mgmtId,data){
  //    return req('post','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/ss', mgmtId, data)  },
  //用流程圖ID取得檔案JSON/selfDefenseFireMarshalling
  apiGetContingencyProcessJson(type,processId) {
    return req(
      "get",
      type+"/" + processId + "/f"
    );
  },
  //儲存流程圖檔案
  apiPostContingencyProcessJson(processId, data) {
    return req(
      "upload",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess/" +
        this.getUid() +
        "/" +
        processId +
        "/upload",
      null,
      data
    );
  },

  //預設的所有節點資料
  apiGetAllOfMarshallingSampleNode() {
    return req("get", "/emergencyResponseFlowEdit/flowEditCNodeMgmt/sample/a");
  },
};

export default selfDefenseFireMarshalling;
