import req from "./https";
import store from "../store";

const selfDefenseFireMarshalling = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  //自衛消防編組-班別
  //透過樓層取得班別
  apiGetMarshallingMgmtOfFloor(type, floorId) {
    return req("get", type + "/floors/" + floorId);
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
  //用流程圖ID取得檔案JSON/selfDefenseFireMarshalling
  apiGetContingencyProcessJson(type, processId) {
    return req("get", type + "/" + processId + "/f");
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
  // 取得角色的帳號 - type：/selfDefenseFireMarshalling、/emergencyResponseFlowEdit
  apiGetAccountByRole(type, roleId) {
    return req("get", type + "/" + roleId + "/accounts");
  },
};

export default selfDefenseFireMarshalling;
