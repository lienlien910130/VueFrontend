import req from "./https";
import store from "../store";

const nodeList = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  //samplenode
  apiGetAllSampleNode() {
    return req("get", "/CSampleNodeListMgmt/" + this.getBid() + "/a");
  },
  apiPostSampleNode(data) {
    return req("post", "/CSampleNodeListMgmt/check", this.getBid(), data);
  },
  apiPatchSampleNode(data) {
    return req("patch", "/CSampleNodeListMgmt/check", this.getBid(), data);
  },
  apiDeleteSampleNode(sampleNodeId) {
    return req("delete", "/CSampleNodeListMgmt/" + sampleNodeId);
  },
  apiGetSampleNodeSearchPages(data) {
    return req("post", "/CSampleNodeListMgmt/ss", this.getBid(), data, true);
  },
  apiPostSampleNodes(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/CSampleNodeListMgmt/check/s", null, data);
  },
  //節點
  apiGetAllNode(processId) {
    return req(
      "get",
      "/emergencyResponseFlowEdit/flowEditCNodeMgmt/" + processId + "/a"
    );
  },
  apiPostNode(processId, data) {
    return req(
      "post",
      "/emergencyResponseFlowEdit/flowEditCNodeMgmt",
      processId,
      data
    );
  },
  apiPatchNode(data) {
    return req(
      "patch",
      "/emergencyResponseFlowEdit/flowEditCNodeMgmt/s",
      null,
      data
    );
  },
  apiDeleteNode(nodeId) {
    return req(
      "delete",
      "/emergencyResponseFlowEdit/flowEditCNodeMgmt/" + nodeId
    );
  },
  apiPostNodes(processId, data) {
    data.forEach((element) => {
      element.parentId = processId;
    });
    return req(
      "post",
      "/emergencyResponseFlowEdit/flowEditCNodeMgmt/s",
      null,
      data
    );
  },
  //選項-線
  apiGetAllOptions(nodeId) {
    return req(
      "get",
      "/emergencyResponseFlowEdit/flowEditCOptionMgmt/" + nodeId + "/a"
    );
  },
  apiPostOption(nodeId, data) {
    return req(
      "post",
      "/emergencyResponseFlowEdit/flowEditCOptionMgmt",
      nodeId,
      data
    );
  },
  apiPatchOption(data) {
    return req(
      "patch",
      "/emergencyResponseFlowEdit/flowEditCOptionMgmt/s",
      null,
      data
    );
  },
  apiDeleteOption(optionId) {
    return req(
      "delete",
      "/emergencyResponseFlowEdit/flowEditCOptionMgmt/" + optionId
    );
  },
  apiPostOptions(processId, data) {
    data.forEach((element) => {
      element.parentId = processId;
    });
    return req(
      "post",
      "/emergencyResponseFlowEdit/flowEditCOptionMgmt/s",
      null,
      data
    );
  },
  //用流程id取得所有的options
  apiGetAllOptionsOfProcess(processId) {
    return req(
      "get",
      "/emergencyResponseFlowEdit/flowEditContingencyProcess/" +
        processId +
        "/nodeOptions"
    );
  },
};

export default nodeList;
