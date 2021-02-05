import api from '@/api'

let Device = {
    buildingDevice:[],
    buildingMaintain:[],

    getBuildingDevicesManage: async function(){
        var data = await api.device.apiGetBuildingDevicesManagement().then(response => {
            this.buildingDevice = response.result
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    },
    getBuildingMaintainList: async function(){
        var data = await api.device.apiGetBuildingMaintainsList().then(response => {
            this.buildingMaintain = response.result
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    },
}
export default Device
