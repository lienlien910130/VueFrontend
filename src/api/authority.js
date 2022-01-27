import req from "./https";
import store from "../store";

const authority = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },
  //選單管理
  apiGetBuildingMainMenuAuthority() {
    return req("get", "/index/mainMenus/a");
  },
  apiGetMainMenuAuthority(mainMenuId) {
    return req("get", "/mainMenuSetting/" + mainMenuId);
  },
  apiPostMainMenu(data) {
    return req("post", "/mainMenuSetting", this.getBid(), data);
  },
  apiPostSubMainMenu(mainMenuId, data) {
    return req("post", "/mainMenuSetting/sub/" + mainMenuId, mainMenuId, data);
  },
  // apiPostLevelOneMainMenuAuthority(data){ return req('post','/mainMenuSetting/buildings/'+this.getBid(),data) },
  // apiPostLevelTwoMainMenuAuthority(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId,data) },
  apiPatchMainMenuAuthority(data) {
    return req("patch", "/mainMenuSetting", null, data);
  },
  apiDeleteMainMenuAuthority(mainMenuId) {
    return req("delete", "/mainMenuSetting/" + mainMenuId);
  },
  apiPostMainMenus(mainMenuId, data) {
    if (mainMenuId !== null) {
      data.forEach((element) => {
        element.parentId = mainMenuId;
      });
    } else {
      data.forEach((element) => {
        element.parentId = this.getBid();
      });
    }
    return req("post", "/mainMenuSetting/sub/" + mainMenuId + "/s", null, data);
  },
  // apiGetAccessAuthoritySearchPages(mainMenuId,data){ return req('post','/mainMenuSetting/accessAuthorities/'+mainMenuId,data)  },

  //權限管理
  // apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
  apiGetMainMenuAccessAuthority(mainMenuId) {
    return req("get", "/accessAuthoritySetting/mainMenu/" + mainMenuId);
  },
  apiPostAccessAuthority(data) {
    return req("post", "/accessAuthoritySetting/check", this.getBid(), data);
  },
  apiPatchAccessAuthority(data) {
    return req("patch", "/accessAuthoritySetting/check", this.getBid(), data);
  },
  apiDeleteAccessAuthority(accessAuthorityId) {
    return req("delete", "/accessAuthoritySetting/" + accessAuthorityId);
  },
  // apiGetCheckAccessAuthority(){ return req('get','/accessAuthoritySetting/checkAssign') },
  apiPostAccessAuthorities(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/accessAuthoritySetting/check/s", null, data);
  },

  //角色管理
  apiGetAllRole() {
    return req("get", "/index/roles/a");
  },
  apiGetRoleOfID(id) {
    return req("get", "/index/roles/" + id);
  },
  // apiGetAllRoleAuthority(){ return req('get','/roleSetting/a') },
  apiGetRoleAuthority(roleId) {
    return req("get", "/roleSetting/" + roleId);
  },
  apiPostRoleAuthority(data) {
    return req("post", "/roleSetting/check", this.getBid(), data);
  },
  apiPatchRoleAuthority(data) {
    return req("patch", "/roleSetting/check", this.getBid(), data);
  },
  apiDeleteRoleAuthority(roleId) {
    return req("delete", "/roleSetting/" + roleId);
  },
  apiGetRoleAuthoritySearchPages(data) {
    return req("post", "/roleSetting/ss", this.getBid(), data);
  },
  apiPostRoleAuthorities(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/roleSetting/check/s", null, data);
  },
  //角色取得權限管理
  apiGetAccountAuthorityByRole(roleId) {
    return req("get", "/roleSetting/accessAuthorities/r/" + roleId);
  },
  //角色管理修改權限 - 多筆更新
  apiPutAuthorityByRole(data) {
    return req("put", "/roleSetting/accessAuthorities", null, data);
  },
  //角色管理透過mainmenuid取得權限管理
  // apiGetAccountAuthorityByMenu(mainMenuId){ return req('get','/roleSetting/accessAuthorities/m/'+mainMenuId) },

  //帳號管理
  apiGetAllAccountAuthority() {
    return req("get", "/accountSetting/a");
  },
  apiGetAllAccount() {
    return req("get", "/index/accounts/a");
  },
  apiGetAccountOfID(id) {
    return req("get", "/index/accounts/" + id);
  },
  apiGetAccountAuthority(accountId) {
    return req("get", "/accountSetting/" + accountId);
  },
  apiPostAccountAuthority(data) {
    return req("post", "/accountSetting/check", null, data);
  },
  apiPatchAccountAuthority(type, data) {
    //更新
    return req("patch", type + "/check", null, data);
  },
  apiPatchAccountFloorOfHouse(type, accountId) {
    //管理員手動驗證住戶門牌-住戶&帳號管理
    return req("patch", type + "/addRole/member/" + accountId, null, null);
  },
  apiDeleteAccountAuthority(accountId) {
    return req("delete", "/accountSetting/" + accountId);
  },

  apiGetAccountAuthoritySearchPages(type, data) {
    return req(
      "post",
      type + "/ss",
      type == "/basic/accountSetting" ? this.getBid() : null,
      data,
      true
    );
  },
  // "/index/accounts/ss"
  apiPostAccountAuthorities(data) {
    return req("post", "/accountSetting/check/s", null, data);
  },
  //帳號取得權限管理
  apiGetAccountAuthorityByAccount(roleId) {
    return req("get", "/accountSetting/accessAuthorities/" + roleId);
  },

  //上傳大頭照
  apiPostUserPhoto(tgUserId, data, type) {
    return req(
      "upload",
      type + "/" + this.getUid() + "/upload/headShot/" + tgUserId,
      this.getBid(),
      data
    );
  },
  //產生人員屬性-以人為主:純人數mode=1, 人數+清單mode=2
  apiGetHouseAttributes(type, mode) {
    if (type === "PE") {
      return req("get", "/basic/accountSetting/ageDistribution/" + mode);
    } else {
      return req(
        "get",
        "/basic/accountSetting/ageDistribution/usageOfFloor/" + mode
      );
    }
  },
  //產生人員屬性-以戶為主:門牌+純人數mode=1, 門牌+純人數+清冊mode=2
  apiGetHouseAttributesOfUaage(mode) {
    return req(
      "get",
      "/basic/accountSetting/ageDistribution/usageOfFloor" + mode
    );
  },
  // 以下暫時用不到
  //帳號的狀態 - type: basic/accountSetting/settings
  apiGetAccountCharacterStatus(type, accountId) {
    return req("get", "/" + type + "/characterStatus/" + accountId + "/a");
  },
  apiGetAccountCharacterStatusSearchPages(type, accountId, data) {
    return req(
      "post",
      "/" + type + "/characterStatus/ss",
      accountId,
      data,
      true
    );
  },
  apiGetCharacterStatusOfID(type, characterStatusId) {
    return req("get", "/" + type + "/characterStatus/" + characterStatusId);
  },
  apiPostCharacterStatus(type, accountId, data) {
    return req("post", "/" + type + "/characterStatus", accountId, data);
  },
  apiPatchCharacterStatus(type, data) {
    return req("patch", "/" + type + "/characterStatus", null, data);
  },
  apiDeleteCharacterStatus(type, characterStatusId) {
    return req("delete", "/" + type + "/characterStatus/" + characterStatusId);
  },
  apiPostCharacterStatuses(type, accountId, data) {
    data.forEach((element) => {
      element.parentId = accountId;
    });
    return req("post", "/" + type + "/characterStatus/s", null, data);
  },
};

export default authority;
