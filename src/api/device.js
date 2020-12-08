import req from './https';
import store from '../store'

const device = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},

    //設備管理
    apiGetBuildingDevicesManagement(){ return req('get','/devicesManagement/buildings/'+this.getBid()+'/devices') },
    apiGetDevicesManagement(deviceId){ return req('get','/devicesManagement/'+deviceId+'/devices') },
    apiPostDevicesManagement(data){ return req('post','/devicesManagement/'+this.getBid()+'/devices',data) },
    apiPatchDevicesManagement(data){ return req('patch','/devicesManagement/devices',data) },
    apiDeleteDevicesManagement(deviceId){ return req('delete','/devicesManagement/'+deviceId+'/devices') },

    //維護保養
    apiGetBuildingMaintains(){ return req('get','/devicesManagement/buildings/'+this.getBid()+'/maintains') },
    apiGetMaintains(maintainId){ return req('get','/devicesManagement/'+maintainId+'/maintains') },
    apiPostMaintains(data){ return req('post','/devicesManagement/'+this.getBid()+'/maintains',data) },
    apiPatchMaintains(data){ return req('patch','/devicesManagement/maintains',data) },
    apiDeleteMaintains(maintainId){ return req('delete','/devicesManagement/'+maintainId+'/maintains') },

    
}

export default device