import req from './https';
import store from '../store'

const authority = {
    getBid(){ return store.getters.buildingid},
    //菜單管理
    apiGetAllMainMenuAuthority(){ return req('get','/mainMenuSetting/a') },
    apiGetBuildingMainMenuAuthority(){ return req('get','/mainMenuSetting/buildings/'+this.getBid()) },
    apiGetMainMenuAuthority(mainMenuId){ return req('get','/mainMenuSetting/'+mainMenuId) },
    apiPostLevelOneMainMenuAuthority(data){ return req('post','/mainMenuSetting/buildings/'+this.getBid(),data) },
    apiPostLevelTwoMainMenuAuthority(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId,data) },
    apiPatchMainMenuAuthority(data){ return req('patch','/mainMenuSetting',data) },
    apiDeleteMainMenuAuthority(mainMenuId){ return req('delete','/mainMenuSetting/'+mainMenuId) },
    //權限管理
    apiGetAllAccessAuthority(){ return req('get','/accessAuthoritySetting/a') },
    apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetMainMenuAccessAuthority(mainMenuId){ return req('get','/accessAuthoritySetting/mainMenu/'+mainMenuId) },
    apiPostAccessAuthority(data){ return req('post','/accessAuthoritySetting',data) },
    apiPatchAccessAuthority(data){ return req('patch','/accessAuthoritySetting',data) },
    apiDeleteAccessAuthority(accessAuthorityId){ return req('delete','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetCheckAccessAuthority(){ return req('get','/accessAuthoritySetting/checkAssign') },
    //角色管理
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

}

export default authority