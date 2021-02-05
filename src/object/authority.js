import api from '@/api'

let Authority = {
    buildingMenu :[],
    buildingRole:[],
    getBuildingMenu: async function(){
        var data = await api.authority.apiGetBuildingMainMenuAuthority().then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            this.buildingMenu = result
            var array = [{
                id:'-1',
                label:'首頁',
                children : []
            }]
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
                    linkMainMenus:element.linkMainMenus
                }
                if(element.linkMainMenus.length > 0){
                    element.linkMainMenus.forEach(element => {
                        var children = {
                            id: element.id ,
                            label: element.name,
                            code:element.code,
                            children : [],
                            name:element.name,
                            description:element.description,
                            status:element.status,
                            sort:element.sort,
                            removable:element.removable,
                            linkMainMenus:element.linkMainMenus
                        }
                        node.children.push(children)
                    });
                }
                array[0].children.push(node)
            });
            return array
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingMenuBelow: async function(mainMenuId){
        var data = await api.authority.apiGetMainMenuAuthority(mainMenuId).then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            console.log(JSON.stringify(result))
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postBuildingMenu: async function(mainMenuId = null,data){
        if(mainMenuId == null){
            var data = await api.authority.apiPostMainMenuAuthority(data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.authority.apiPostMainMenuAuthority(mainMenuId,data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
        
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
            return await this.getBuildingMenu()
        }).catch(error=>{
            return []
        })
        return data
    },
    getMenuAccessAuthority: async function(mainMenuId){
        var data = await api.authority.apiGetMainMenuAccessAuthority(mainMenuId).then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            result.forEach(item=>{
                var temp = []
                item.linkRoles.forEach(item=>{
                    temp.push(item.id)
                })
                item.linkRoles = temp
            })
            console.log(JSON.stringify(result))
            return result
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
    getRole: async function(){
        var data = await api.authority.apiGetAllRoleAuthority().then(response => {
            this.buildingRole = response.result.sort((x,y) => x.id - y.id)
            return this.buildingRole 
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
}
export default Authority
