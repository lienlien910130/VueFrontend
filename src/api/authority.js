import req from './https';
import store from '../store'

const authority = {
    getBid(){ return store.getters.buildingid},
    //選單管理
    apiGetBuildingMainMenuAuthority(){ return req('get','/index/mainMenus') },
    apiGetMainMenuAuthority(mainMenuId){ return req('get','/mainMenuSetting/'+mainMenuId) },
    apiPostMainMenu(data){ return req('post','/mainMenuSetting',this.getBid(),data) },
    apiPostSubMainMenu(mainMenuId,data){ return req('post','/mainMenuSetting/sub/'+mainMenuId, mainMenuId, data) },
    // apiPostLevelOneMainMenuAuthority(data){ return req('post','/mainMenuSetting/buildings/'+this.getBid(),data) },
    // apiPostLevelTwoMainMenuAuthority(mainMenuId,data){ return req('post','/mainMenuSetting/mainMenu/'+mainMenuId,data) },
    apiPatchMainMenuAuthority(data){ return req('patch','/mainMenuSetting', null, data) },
    apiDeleteMainMenuAuthority(mainMenuId){ return req('delete','/mainMenuSetting/'+mainMenuId) },
    apiPostMainMenus(mainMenuId, data){ 
        if(mainMenuId !== null){
            data.forEach(element => {
                element.parentId = mainMenuId
            })
        }else{
            data.forEach(element => {
                element.parentId = this.getBid()
            })
        }
        return req('post','/mainMenuSetting/s', null, data) 
    },
    // apiGetAccessAuthoritySearchPages(mainMenuId,data){ return req('post','/mainMenuSetting/accessAuthorities/'+mainMenuId,data)  },
    
    //權限管理
    // apiGetAccessAuthority(accessAuthorityId){ return req('get','/accessAuthoritySetting/'+accessAuthorityId) },
    apiGetMainMenuAccessAuthority(mainMenuId){ return req('get','/accessAuthoritySetting/mainMenu/'+mainMenuId) },
    apiPostAccessAuthority(data){ return req('post','/accessAuthoritySetting/check',this.getBid(), data) },
    apiPatchAccessAuthority(data){ return req('patch','/accessAuthoritySetting/check',this.getBid(), data) },
    apiDeleteAccessAuthority(accessAuthorityId){ return req('delete','/accessAuthoritySetting/'+accessAuthorityId) },
    // apiGetCheckAccessAuthority(){ return req('get','/accessAuthoritySetting/checkAssign') },
    apiPostAccessAuthorities(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/accessAuthoritySetting/check/s', null, data) 
    },

    //角色管理
    apiGetAllRole(){ return req('get','/index/default/roles') },
    // apiGetAllRoleAuthority(){ return req('get','/roleSetting/a') },
    apiGetRoleAuthority(roleId){ return req('get','/roleSetting/'+roleId) },
    apiPostRoleAuthority(data){ return req('post','/roleSetting/check', this.getBid(), data) },
    apiPatchRoleAuthority(data){ return req('patch','/roleSetting/check', this.getBid(), data) },
    apiDeleteRoleAuthority(roleId){ return req('delete','/roleSetting/'+roleId) },
    apiGetRoleAuthoritySearchPages(data){ return req('post','/roleSetting/ss', this.getBid(), data)  },
    apiPostRoleAuthorities(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/roleSetting/check/s', null, data) 
    },
    //角色取得權限管理
    apiGetAccountAuthorityByRole(roleId){ return req('get','/roleSetting/accessAuthorities/r/'+roleId) },
    //角色管理修改權限 - 多筆更新
    apiPutAuthorityByRole(data){ return req('put','/roleSetting/accessAuthorities', null, data) },
    //角色管理透過mainmenuid取得權限管理
    // apiGetAccountAuthorityByMenu(mainMenuId){ return req('get','/roleSetting/accessAuthorities/m/'+mainMenuId) },

    //帳號管理
    apiGetAllAccountAuthority(){ return req('get','/accountSetting/a') },
    apiGetAllAccount(){ return req('get','/index/accounts') },
    apiGetAccountAuthority(accountId){ return req('get','/accountSetting/'+accountId) },
    apiPostAccountAuthority(data){ return req('post','/accountSetting/check',null, data) },
    // apiPatchAccountAuthority(data){ return req('patch','/accountSetting/check',data) },
    apiPutAccountAuthority(data){ return req('put','/accountSetting/check', null, data) },
    apiDeleteAccountAuthority(accountId){ return req('delete','/accountSetting/'+accountId) },
    apiGetAccountAuthoritySearchPages(data){ return req('post','/accountSetting/ss', null, data, true)  },
    apiPostAccountAuthorities(data){ 
        // data.forEach(element => {
        //     element.parentId = this.getBid()
        // })
        return req('post','/accountSetting/check/s', null, data) 
    },
    //帳號取得權限管理
    apiGetAccountAuthorityByAccount(roleId){ return req('get','/accountSetting/accessAuthorities/'+roleId) },
    
}

export default authority