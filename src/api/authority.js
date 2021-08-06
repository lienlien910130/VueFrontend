import req from './https';
import store from '../store'

const authority = {
    getBid(){ return store.getters.buildingid},
    //選單管理
    apiGetBuildingMainMenuAuthority(){ return req('get','/index/buildings/'+this.getBid()+'/mainMenus') },
    apiGetMainMenuAuthority(mainMenuId){ return req('get','/mainMenuSetting/'+mainMenuId) },
    apiPostLevelOneMainMenuAuthority(data){ return req('post','/mainMenuSetting/buildings/'+this.getBid(),data) },
    apiPostLevelTwoMainMenuAuthority(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId,data) },
    apiPatchMainMenuAuthority(data){ return req('patch','/mainMenuSetting',data) },
    apiDeleteMainMenuAuthority(mainMenuId){ return req('delete','/mainMenuSetting/'+mainMenuId) },
    apiPostMainMenus(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId+'/s',data) },
    
    //權限管理
    apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetMainMenuAccessAuthority(mainMenuId){ return req('get','/accessAuthoritySetting/mainMenu/'+mainMenuId) },
    apiPostAccessAuthority(data){ return req('post','/accessAuthoritySetting',data) },
    apiPatchAccessAuthority(data){ return req('patch','/accessAuthoritySetting',data) },
    apiDeleteAccessAuthority(accessAuthorityId){ return req('delete','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetCheckAccessAuthority(){ return req('get','/accessAuthoritySetting/checkAssign') },
    apiGetAccessAuthoritySearchPages(mainMenuId,data){ return req('post','/mainMenuSetting/accessAuthorities/'+mainMenuId,data)  },
    apiPostAccessAuthorities(data){ return req('post','/accessAuthoritySetting/s',data) },
    //角色管理
    apiGetAllRole(){ return req('get','/index/default/roles') },
    apiGetAllRoleAuthority(){ return req('get','/roleSetting/a') },
    apiGetRoleAuthority(roleId){ return req('get','/roleSetting/'+roleId) },
    apiPostRoleAuthority(data){ return req('post','/roleSetting/check',data) },
    apiPatchRoleAuthority(data){ return req('patch','/roleSetting/check',data) },
    apiDeleteRoleAuthority(roleId){ return req('delete','/roleSetting/'+roleId) },
    apiGetRoleAuthoritySearchPages(data){ return req('post','/roleSetting/ss',data)  },
    apiPostRoleAuthorities(data){ return req('post','/roleSetting/check/s',data) },
    //角色取得權限管理
    apiGetAccountAuthorityByRole(roleId){ return req('get','/roleSetting/'+this.getBid()+'/accessAuthorities/'+roleId) },
    //角色管理修改權限 - 多筆更新
    apiPutAuthorityByRole(data){ return req('put','/roleSetting/accessAuthorities',data) },
    //選單取得權限管理
    apiGetAccountAuthorityByMenu(mainMenuId){ return req('get','/roleSetting/accessAuthorities/'+mainMenuId) },
    //帳號管理
    apiGetAllAccountAuthority(){ return req('get','/accountSetting/a') },
    apiGetAccountAuthority(accountId){ return req('get','/accountSetting/'+accountId) },
    apiPostAccountAuthority(data){ return req('post','/accountSetting/check',data) },
    apiPatchAccountAuthority(data){ return req('patch','/accountSetting',data) },
    apiPutAccountAuthority(data){ return req('put','/accountSetting/check',data) },
    apiDeleteAccountAuthority(accountId){ return req('delete','/accountSetting/'+accountId) },
    apiGetAccountAuthoritySearchPages(data){ return req('post','/accountSetting/ss',data,true)  },
    apiPostAccountAuthorities(data){ return req('post','/accountSetting/check/s',data) },
    //帳號取得權限管理
    apiGetAccountAuthorityByAccount(roleId){ return req('get','/accountSetting/'+this.getBid()+'/accessAuthorities/'+roleId) },
    
}

export default authority