import api from '@/api'

let Authority = {
    buildingMenu :[],
    buildingRole:[],
    getBuildingMenu: async function(){
        var data = await api.authority.apiGetBuildingMainMenuAuthority().then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            console.log(JSON.stringify(result))
            var array = []
            result.forEach(element => {
                var node = {
                    id: element.id,
                    label: element.name,
                    children : [],
                    code:element.code,
                    name:element.name,
                    description:element.description,
                    status:element.status,
                    sort:element.sort,
                    removable:element.removable,
                    linkMainMenus:element.linkMainMenus,
                    linkAccessAuthorities:element.linkAccessAuthorities.sort((x,y) => x.sort - y.sort)
                }
                if(element.linkMainMenus.length > 0){
                    element.linkMainMenus.forEach(item => {
                        var children = {
                            id: item.id ,
                            label: item.name,
                            code:item.code,
                            children : [],
                            name:item.name,
                            description:item.description,
                            status:item.status,
                            sort:item.sort,
                            removable:item.removable,
                            linkMainMenus:item.linkMainMenus,
                            linkAccessAuthorities:item.linkAccessAuthorities.sort((x,y) => x.sort - y.sort)
                        }
                        node.children.push(children)
                    })
                }
                array.push(node)
            })
            return array
        }).catch(error=>{
            return []
        })
        return data
    },
    // getBuildingMenuID: async function(){
    //     var data = await api.authority.apiGetBuildingMainMenuAuthority().then(response => {
    //         var result = response.result.sort((x,y) => x.sort - y.sort)
    //         var array = []
    //         result.forEach(element => {
    //             var node = {
    //                 id: element.id,
    //                 name:element.name,
    //                 code:element.code,
    //                 children : [],
    //             }
    //             if(element.linkMainMenus.length>0){
    //                 element.linkMainMenus.forEach(children=>{
    //                     var temp = {
    //                         id: children.id,
    //                         name:children.name,
    //                         code:children.code,
    //                         children : []
    //                     }
    //                     node.children.push(temp)
    //                     //array.push(temp)
    //                 })
    //             }
    //             array.push(node)
    //         })
    //         return array
    //     }).catch(error=>{
    //         return []
    //     })
    //     return data
    // },
    getBuildingMenuBelow: async function(mainMenuId){
        var data = await api.authority.apiGetMainMenuAuthority(mainMenuId).then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postBuildingMenu: async function(mainMenuId = null,data){
        var data = await api.authority.apiPostLevelTwoMainMenuAuthority(mainMenuId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
        // if(mainMenuId == null){
        //     var data = await api.authority.apiPostLevelOneMainMenuAuthority(data).then(response => {
        //         return true
        //     }).catch(error=>{
        //         return false
        //     })
        //     return data
        // }else{
        //     var data = await api.authority.apiPostLevelTwoMainMenuAuthority(mainMenuId,data).then(response => {
        //         return true
        //     }).catch(error=>{
        //         return false
        //     })
        //     return data
        // }
    },
    deleteBuildingMenu: async function(mainMenuId){
        var data = await api.authority.apiDeleteMainMenuAuthority(mainMenuId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateBuildingMenu: async function(data){
        var data = await api.authority.apiPatchMainMenuAuthority(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getMenuAccessAuthority: async function(mainMenuId){
        var data = await api.authority.apiGetMainMenuAccessAuthority(mainMenuId).then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            console.log(JSON.stringify(result))
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getAccessAuthority: async function(accessAuthorityId){
        var data = await api.authority.apiGetAccessAuthority(accessAuthorityId).then(response => {
            return response.result[0]
        }).catch(error=>{
            return []
        })
        return data
    },
    postMenuAccessAuthority: async function(mainMenuId,data){
        var data = await api.authority.apiPostAccessAuthority(mainMenuId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteMenuAccessAuthority: async function(accessAuthorityId){
        var data = await api.authority.apiDeleteAccessAuthority(accessAuthorityId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateMenuAccessAuthority: async function(data){
        var data = await api.authority.apiPatchAccessAuthority(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getAllRole: async function(){
        var data = await api.authority.apiGetAllRole().then(response => {
            return response.result.sort((x,y) => x.id - y.id) 
        }).catch(error=>{
            return []
        })
        return data
    },
    postRole: async function(data){
        var data = await api.authority.apiPostRoleAuthority(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteRole: async function(roleId){
        var data = await api.authority.apiDeleteRoleAuthority(roleId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateRole: async function(data){
        var data = await api.authority.apiPatchRoleAuthority(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getRoleAccessAuthority: async function(roleId){
        var data = await api.authority.apiGetAccountAuthorityByRole(roleId).then(response => {
            var array = []
            response.result.sort((x,y) => x.id - y.id).forEach(item=>{
                array.push(item.id)
            })
            return array
        }).catch(error=>{
            return []
        })
        return data
    },
    updateRoleAccessAuthority: async function(data){
        var data = await api.authority.apiPatchAuthorityByRole(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getMainMenuAccessAuthority: async function(mainMenuId){
        var data = await api.authority.apiGetAccountAuthorityByMenu(mainMenuId).then(response => {
            return response.result.sort((x,y) => x.id - y.id) 
        }).catch(error=>{
            return []
        })
        return data
    },
    getAllAccount: async function(){
        var data = await api.authority.apiGetAllAccountAuthority().then(response => {
            console.log(JSON.stringify(response))
            return response.result.sort((x,y) => x.id - y.id) 
        }).catch(error=>{
            return []
        })
        return data
    },
    postAccount: async function(data){
        var data = await api.authority.apiPostAccountAuthority(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteAccount: async function(accountId){
        var data = await api.authority.apiDeleteAccountAuthority(accountId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateAccount: async function(data){
        var data = await api.authority.apiPatchAccountAuthority(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
}
export default Authority
