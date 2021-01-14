import req from './https';
import store from '../store'

const authority = {
    //菜單管理
    apiGetAllMainMenuAuthority(){ return req('get','/mainMenuSetting/a') },
    apiGetMainMenuAuthority(mainMenuId){ return req('get','/mainMenuSetting/'+mainMenuId) },
    apiPostMainMenuAuthority(data){ return req('post','/mainMenuSetting',data) },
    apiPatchMainMenuAuthority(data){ return req('patch','/mainMenuSetting',data) },
    apiDeleteMainMenuAuthority(mainMenuId){ return req('delete','/mainMenuSetting/'+mainMenuId) },
    //權限管理
    apiGetAllAccessAuthority(){ return req('get','/accessAuthoritySetting/a') },
    apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
    apiPostAccessAuthority(data){ return req('post','/accessAuthoritySetting',data) },
    apiPatchAccessAuthority(data){ return req('patch','/accessAuthoritySetting',data) },
    apiDeleteAccessAuthority(accessAuthorityId){ return req('delete','/accessAuthoritySetting/'+accessAuthorityId) },
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