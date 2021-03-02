import api from '@/api'

let Building = {
    building : {},
    buildinguserArray:[],
    buildingContactunit:[],
    buildingCommittee:[],
    buildingArray :[],
    
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
    getAllBuilding: async function(){
        var data = await api.building.apiGetBuilding().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            // var mapArray = result.map(v => {
            //     return {
            //         id:v.id,
            //         value: v.id,
            //         label: v.buildingName
            //     }
            // })
            this.buildingArray = result
            // if(isSelect){
            //     var mapArray = result.map(v => {
            //         return {
            //             id:v.id,
            //             value: v.id,
            //             label: v.buildingName
            //         }
            //     })
            //     this.buildingArray = mapArray
            //     return mapArray
            // }
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingInfo: async function(){
        var data = await api.building.apiGetBuildingInfo().then(response => {
            return response.result
        }).catch(error=>{
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
    getBuildingFloors: async function(){
        var data = await api.building.apiGetBuildingFloors().then(response => {
            var floors = []
            response.result.forEach(element => {
                var _temp = {
                  id:element.id,
                  label:element.floor>0 ? element.floor+'F' : '地下 '+element.floor.substr(1)+'F'
                }
                floors.push(_temp)
            })
            return floors
        }).catch(error=>{
            this.building = this.getBuildingDefaultState()
            return []
        })
        return data
    },
    getBuildingFloor: async function(floorId){
        var data = await api.building.apiGetFloor(floorId).then(response => {
            return response.result[0]
        }).catch(error=>{
            return []
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
    updateBuildingFloor: async function(data){
        var data = await api.building.apiPatchFloors(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingUser: async function(){
        var data = await api.building.apiGetAllBuildingOfUser().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            this.buildinguserArray = result
            // response.result.sort((x,y) => x.id - y.id).forEach(item=>{
            //     var _temp = {
            //       id: item.id,
            //       label: item.name,
            //       value: item.id
            //     }
            //     this.userArray.push(_temp)
            // })
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingContactunit: async function(){
        var data = await api.building.apiGetBuildingContactUnit().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            // if(isSelect){
            //     var mapArray = result.map(v => {
            //         return {
            //             id:v.id,
            //             value: v.id,
            //             label: v.buildingName
            //         }
            //     })
            //     this.buildingArray = mapArray
            //     return mapArray
            // }
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postBuildingContactunit: async function(data){
        var data = await api.building.apiPostContactUnit(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateBuildingContactunit: async function(data){
        var data = await api.building.apiPatchContactUnit(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteBuildingContactunit: async function(contactunitId){
        var data = await api.building.apiDeleteContactUnit(contactunitId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getManagementList: async function(){
        var data = await api.building.apiGetCommittee().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            this.buildingCommittee = result
            // if(isSelect){
            //     var mapArray = result.map(v => {
            //         return {
            //             id:v.id,
            //             value: v.id,
            //             label: v.buildingName
            //         }
            //     })
            //     this.buildingArray = mapArray
            //     return mapArray
            // }
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postManagementList: async function(data){
        var data = await api.building.apiPostCommittee(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateManagementList: async function(data){
        var data = await api.building.apiPatchCommittee(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteManagementList: async function(committeeId){
        var data = await api.building.apiDeleteCommittee(committeeId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingOfHouse: async function(){
        var data = await api.building.apiGetBuildingOfHouse().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingOfHouseById: async function(usageOfFloorId){
        var data = await api.building.apiGetHouse(usageOfFloorId).then(response => {
            return response.result[0]
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingFloorOfHouse: async function(floorId){
        var data = await api.building.apiGetFloorOfHouse(floorId).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postBuildingOfHouse: async function(floorId,data){
        var data = await api.building.apiPostFloorOfHouse(floorId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateBuildingOfHouse: async function(data){
        var data = await api.building.apiPatchFloorOfHouse(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteBuildingOfHouse: async function(floorofhouseId){
        var data = await api.building.apiDeleteFloorOfHouse(floorofhouseId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    
    
}
export default Building
