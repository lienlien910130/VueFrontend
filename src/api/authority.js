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
  //權限管理
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
  apiGetRoleAuthoritySearchPages(data) {
    return req("post", "/roleSetting/ss", this.getBid(), data);
  },
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
  //角色管理修改權限 - 一次多筆更新
  apiPutAuthorityByRole(data) {
    return req("put", "/roleSetting/accessAuthorities", null, data);
  },

  //帳號管理
  apiGetAllAccount() {
    return req("get", "/index/accounts/a");
  },
  apiGetAccountOfID(id) {
    return req("get", "/index/accounts/" + id);
  },
  apiGetAllAccountAuthority() {
    return req("get", "/accountSetting/a");
  },
  apiGetAccountAuthority(accountId) {
    return req("get", "/accountSetting/" + accountId);
  },
  apiPostAccountAuthority(data) {
    return req("post", "/accountSetting/check", null, data);
  },
  apiPatchAccountAuthority(type, data) {
    return req("patch", type + "/check", null, data);
  },
  apiDeleteAccountAuthority(accountId) {
    return req("delete", "/accountSetting/" + accountId);
  },
  //多筆新增
  apiPostAccountAuthorities(data) {
    return req("post", "/accountSetting/check/s", null, data);
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
  //管理員手動驗證住戶門牌-住戶&帳號管理
  apiPatchAccountFloorOfHouse(type, accountId) {
    return req("patch", type + "/addRole/member/" + accountId, null, null);
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
  //產生人員屬性
  //type=PE => 以人為主:純人數mode=1, 人數+清單mode=2
  //type=USAG => 以戶為主:門牌+純人數mode=1, 門牌+純人數+清冊mode=2
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
};

export default authority;
