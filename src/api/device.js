import req from './https';
import store from '../store'

const device = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},

    //設備管理
    apiGetBuildingDevicesManagement(){ return req('get','/index/buildings/'+this.getBid()+'/devices') },
    apiGetDevicesManagement(deviceId){ return req('get','/devicesManagement/'+deviceId+'/devices') },
    apiPostDevicesManagement(data){ return req('post','/devicesManagement/'+this.getBid()+'/devices',data) },
    apiPatchDevicesManagement(data){ return req('patch','/devicesManagement/devices',data) },
    apiDeleteDevicesManagement(deviceId){ return req('delete','/devicesManagement/'+deviceId+'/devices') },
    //設備清單-取得設備種類
    apiGetDevicesTypeByDevicesManagement(){ return req('get','/devicesManagement/deviceType/a') },
    //圖控更新設備-多筆更新
    apiPatchGraphicDevices(data){ return req('patch','/drawingControl/devices',data) },
    //點位設定-多筆更新
    apiPatchDevicesAddress(data){ return req('patch','/deviceAddressManagement/s',data) },
    //設備種類
    apiGetDefaultFullType(){ return req('get','/index/deviceTypes/fta') },
    //點位設定-取得設備種類
    apiGetDevicesTypeByDevicesAddress(){ return req('get','/deviceAddressManagement/deviceType/a') },
    apiGetDevicesType(){ return req('get','/deviceTypesManagement/a') },
    apiPostDevicesType(data){ return req('post','/deviceTypesManagement',data) },
    apiPatchDevicesType(data){ return req('patch','/deviceTypesManagement',data) },
    apiDeleteDevicesType(deviceTypeId){ return req('delete','/deviceTypesManagement/'+deviceTypeId) },
    //維護保養大項
    apiGetBuildingMaintainsList(){ return req('get','/maintainManagement/buildings/'+this.getBid()+'/maintains') },
    apiGetMaintainsList(maintainListId){ return req('get','/maintainManagement/maintains/'+maintainListId) },
    apiPostMaintainsList(data){ return req('post','/maintainManagement/buildings/'+this.getBid()+'/maintains',data) },
    apiPatchMaintainsList(data){ return req('patch','/maintainManagement/maintains',data) },
    apiDeleteMaintainsList(maintainListId){ return req('delete','/maintainManagement/'+maintainListId+'/maintains') },

    //維護保養細項
    apiGetListMaintains(maintainListId){ return req('get','/maintainManagement/maintains/'+maintainListId+'/list') },
    apiGetMaintains(maintainId){ return req('get','/maintainManagement/maintains/list/'+maintainId) },
    apiPostMaintains(maintainListId,data){ return req('post','/maintainManagement/maintains/'+maintainListId+'/list',data) },
    apiPatchMaintains(data){ return req('patch','/maintainManagement/maintains/list',data) },
    apiDeleteMaintains(maintainId){ return req('delete','/maintainManagement/maintains/list/'+maintainId) },

}

export default device