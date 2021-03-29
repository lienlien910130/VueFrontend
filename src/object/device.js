import api from '@/api'

let Device = {
    buildingDevice:[],
    buildingMaintain:[],

    getBuildingDevicesManage: async function(){
        var data = await api.device.apiGetBuildingDevicesManagement().then(response => {
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    postBuildingDevicesManage: async function(data){
        var data = await api.device.apiPostDevicesManagement(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateBuildingDevicesManage: async function(data){
        var data = await api.device.apiPatchDevicesManagement(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateBuildingGraphicDevices: async function(data){ //多筆更新
        var data = await api.device.apiPatchGraphicDevices(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteBuildingDevicesManage: async function(deviceId){
        var data = await api.device.apiDeleteDevicesManagement(deviceId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingMaintainList: async function(){
        var data = await api.device.apiGetBuildingMaintainsList().then(response => {
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    getMaintainList: async function(maintainListId){
        var data = await api.device.apiGetMaintainsList(maintainListId).then(response => {
            return response.result[0]
        }).catch(error=>{
            return []
        })
        return data
    },
    postMaintainList: async function(data){
        var data = await api.device.apiPostMaintainsList(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateMaintainList: async function(data){
        var data = await api.device.apiPatchMaintainsList(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteMaintainList: async function(maintainListId){
        var data = await api.device.apiDeleteMaintainsList(maintainListId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingMaintainListOfMaintain: async function(maintainListId){
        var data = await api.device.apiGetListMaintains(maintainListId).then(response => {
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    postMaintain: async function(maintainListId,data){
        var data = await api.device.apiPostMaintains(maintainListId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateMaintain: async function(data){
        var data = await api.device.apiPatchMaintains(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteMaintain: async function(maintainId){
        var data = await api.device.apiDeleteMaintains(maintainId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateDevicesAddress: async function(data){ //多筆更新
        var data = await api.device.apiPatchDevicesAddress(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getDefaultFullType: async function(){
        var data = await api.device.apiGetDefaultFullType().then(response => {
            return response
        }).catch(error=>{
            return []
        })
        return data
    },
    getDeviceType: async function(type){
        var data
        if(type == 'devicesManagement'){
            data = await api.device.apiGetDevicesTypeByDevicesManagement().then(response => {
                return response.result.sort((x,y) => x.id - y.id)
            }).catch(error=>{
                return []
            })
        }else if(type == 'deviceTypesManagement'){
            data = await api.device.apiGetDevicesType().then(response => {
                return response.result.sort((x,y) => x.id - y.id)
            }).catch(error=>{
                return []
            })
        }else{
            data = await api.device.apiGetDevicesTypeByDevicesAddress().then(response => {
                return response.result.sort((x,y) => x.id - y.id)
            }).catch(error=>{
                return []
            })
        }
        return data
    },
    postDeviceType: async function(data){
        var data = await api.device.apiPostDevicesType(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateDeviceType: async function(data){
        var data = await api.device.apiPatchDevicesType(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteDeviceType: async function(deviceTypeId){
        var data = await api.device.apiDeleteDevicesType(deviceTypeId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
}
export default Device
