import req from "./https";
import store from "../store";

const user = {
  getUid() {
    return store.getters.id;
  },
  apiPostLogin(data) {
    return req("post", "/users/login", null, data);
  },
  apiPostRegister(data) {
    return req("post", "/users/support/register", null, data);
  },

  apiPostPassword(data) {
    return req("post", "/users/forgot/checkAndSendInfo", null, data);
  },
  apiPostCheckReset(data) {
    return req("post", "/users/forgot/checkAndSendInfo/modify", null, data);
  },
  apiPatchResetPassword(data) {
    return req(
      "patch",
      "/users/forgot/checkAndSendInfo/modifyPassword",
      null,
      data
    );
  },
  // apiPostLoginSec(tgBuildingId,data){ return req('post','/users/login/'+tgBuildingId, null, data) },
  // apiPostLogout(data){ return req('post','/vue-admin-template/user/logout',data) },
  apiGetUserInfo() {
    return req("get", "/users/" + this.getUid());
  },
  apiPatchUserInfo(data) {
    return req("patch", "/index/accounts", null, data);
  },
  apiGetUserIP() {
    return req("ipconfig", "/ipconfig");
  },
  //訂閱
  apiPatchPhysicalInfo(data) {
    return req("patch", "/index/physicalInfos/check", this.getUid(), data);
  },
  apiPostPhysicalInfo(data) {
    return req("post", "/index/physicalInfos/check", this.getUid(), data);
  },
  apiDeletePhysicalInfo(physicalInfoId) {
    return req("delete", "/index/physicalInfos/" + physicalInfoId);
  },
};

export default user;
