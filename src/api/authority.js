import req from './https';
import store from '../store'

const authority = {
    getBid(){ return store.getters.buildingid},
    //菜單管理
    //apiGetAllMainMenuAuthority(){ return req('get','/mainMenuSetting/a') },
    apiGetBuildingMainMenuAuthority(){ return req('get','/index/buildings/'+this.getBid()+'/mainMenus') },
    apiGetMainMenuAuthority(mainMenuId){ return req('get','/mainMenuSetting/'+mainMenuId) },
    apiPostLevelOneMainMenuAuthority(data){ return req('post','/mainMenuSetting/buildings/'+this.getBid(),data) },
    apiPostLevelTwoMainMenuAuthority(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId,data) },
    apiPatchMainMenuAuthority(data){ return req('patch','/mainMenuSetting',data) },
    apiDeleteMainMenuAuthority(mainMenuId){ return req('delete','/mainMenuSetting/'+mainMenuId) },
    //權限管理
    //apiGetAllAccessAuthority(){ return req('get','/accessAuthoritySetting/a') },
    apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetMainMenuAccessAuthority(mainMenuId){ return req('get','/accessAuthoritySetting/mainMenu/'+mainMenuId) },
    apiPostAccessAuthority(data){ return req('post','/accessAuthoritySetting',data) },
    apiPatchAccessAuthority(data){ return req('patch','/accessAuthoritySetting',data) },
    apiDeleteAccessAuthority(accessAuthorityId){ return req('delete','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetCheckAccessAuthority(){ return req('get','/accessAuthoritySetting/checkAssign') },
    //apiPatchBuildingAccountAccessAuthority(accountId){ 
    //    return req('patch','/accessAuthoritySetting/index/'+accountId+'/building/'+this.getBid(),data) }, //建立帳號及場所關聯(提供帳號是否可查看該場所使用)
    //角色管理
    apiGetAllRole(){ return req('get','/index/default/roles') },
    apiGetAllRoleAuthority(){ return req('get','/roleSetting/a') },
    apiGetRoleAuthority(roleId){ return req('get','/roleSetting/'+roleId) },
    apiPostRoleAuthority(data){ return req('post','/roleSetting',data) },
    apiPatchRoleAuthority(data){ return req('patch','/roleSetting',data) },
    apiDeleteRoleAuthority(roleId){ return req('delete','/roleSetting/'+roleId) },
    //帳號管理
    apiGetAllAccountAuthority(){ return req('get','/accountSetting/a') },
    apiGetAccountAuthority(accountId){ return req('get','/accountSetting/'+accountId) },
    apiPostAccountAuthority(data){ return req('post','/accountSetting',data) },
    apiPatchAccountAuthority(data){ return req('patch','/accountSetting',data) },
    apiDeleteAccountAuthority(accountId){ return req('delete','/accountSetting/'+accountId) },
    //角色取得權限管理
    apiGetAccountAuthorityByRole(roleId){ return req('get','/roleSetting/'+this.getBid()+'/accessAuthorities/'+roleId) },
    //角色管理修改權限
    apiPatchAuthorityByRole(data){ return req('patch','/roleSetting/accessAuthorities',data) },
    //選單取得權限管理
    apiGetAccountAuthorityByMenu(mainMenuId){ return req('get','/roleSetting/accessAuthorities/'+mainMenuId) },

}

export default authority