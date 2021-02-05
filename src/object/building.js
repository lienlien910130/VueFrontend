import api from '@/api'

let Building = {
    building : {},
    userArray:[],
    buildingContactunit:[],

    getBuildingDefaultState : function() {
        return {
            buildingName: '',
            address: '',
            area: 0,
            height: 0,
            floorsOfAboveGround: 0,
            floorsOfUnderground:0,
            licenseNumber: '',
            ownerId: '',
            fireManagerId: '',
            linkOwners:[],
            linkFireManagers:[],
            id:''
        }
    },
    getAllBuilding: async function(isSelect){
        var data = await api.building.apiGetBuilding().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            if(isSelect){
                var mapArray = result.map(v => {
                    return {
                        id:v.id,
                        value: v.id,
                        label: v.buildingName
                    }
                })
                return mapArray
            }
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingInfo: async function(){
        var data = await api.building.apiGetBuildingInfo().then(response => {
            this.building = response.result[0]
            return response.result[0]
        }).catch(error=>{
            this.building = this.getBuildingDefaultState()
            return []
        })
        return data
    },
    postBuildingInfo: async function(data){
        var data = await api.building.apiPostBuilding(data).then(response => {
            return response.result.id
        }).catch(error=>{
            return ''
        })
        return data
    },
    updateBuildingInfo: async function(data){
        var data = await api.building.apiPatchBuildingInfo(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteBuilding: async function(buildingId){
        var data = await api.building.apiDeleteBuilding(buildingId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    postBuildingFloor: async function(buildingId,data){
        var data = await api.building.apiPostFloors(buildingId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingUser: async function(){
        var data = await api.building.apiGetAllBuildingOfUser().then(response => {
            response.result.sort((x,y) => x.id - y.id).forEach(item=>{
                var _temp = {
                  id: item.id,
                  label: item.name,
                  value: item.id
                }
                this.userArray.push(_temp)
            })
            return this.userArray
        }).catch(error=>{
            this.userArray = []
            return []
        })
        return data
    },
    getBuildingContactunit: async function(){
        var data = await api.building.apiGetBuildingContactUnit().then(response => {
            this.buildingContactunit = response.result.sort((x,y) => x.id - y.id)
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
}
export default Building
