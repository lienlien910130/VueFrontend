import req from './https';
import store from '../store'

const device = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},

    //設備管理
    apiGetBuildingDevicesManagement(){ return req('get','/index/buildings/'+this.getBid()+'/devices') },
    apiGetDevicesManagement(deviceId){ return req('get','/devicesManagement/'+deviceId) },
    apiPostDevicesManagement(data){ return req('post','/devicesManagement/'+this.getBid(),data) },
    apiPatchDevicesManagement(data){ return req('patch','/devicesManagement',data) },
    apiDeleteDevicesManagement(deviceId){ return req('delete','/devicesManagement/'+deviceId) },
    apiGetDevicesManagementSearchPages(data){ return req('post','/devicesManagement/'+this.getBid()+'/ss',data)  },
    apiPostDevicesManagements(data){ return req('post','/devicesManagement/'+this.getBid()+'/s',data) },    
    //設備清單-取得設備種類
    apiGetDevicesTypeByDevicesManagement(){ return req('get','/devicesManagement/devicesType/a') },
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
    apiGetDevicesTypeSearchPages(data){ return req('post','/deviceTypesManagement/ss',data)  },
    apiPostDevicesTypes(data){ return req('post','/deviceTypesManagement/s',data) },    
    
    //維護保養大項
    apiGetBuildingMaintainsList(){ return req('get','/maintainManagement/buildings/'+this.getBid()+'/maintains') },
    apiGetMaintainsList(maintainListId){ return req('get','/maintainManagement/maintains/'+maintainListId) },
    apiPostMaintainsList(data){ return req('post','/maintainManagement/buildings/'+this.getBid()+'/maintains',data) },
    apiPatchMaintainsList(data){ return req('patch','/maintainManagement/maintains',data) },
    apiDeleteMaintainsList(maintainListId){ return req('delete','/maintainManagement/'+maintainListId) },
    apiGetMaintainsListSearchPages(data){ return req('post','/maintainManagement/'+this.getBid()+'/ss',data)  },
    apiPostMaintainsLists(data){ return req('post','/maintainManagement/'+this.getBid()+'/s',data) },    
    
    //維護保養取得檢修申報缺失內容
    apiGetInspectionListByMaintain(){ return req('get','/maintainManagement/buildings/'+this.getBid()+'/options') },
    //維護保養細項
    apiGetMaintainAll(){ return req('get','/maintainManagement/'+this.getBid()+'/maintains/list') },
    apiGetListMaintains(maintainListId){ return req('get','/maintainManagement/maintains/'+maintainListId+'/list') },
    apiGetMaintains(maintainId){ return req('get','/maintainManagement/maintains/list/'+maintainId) },
    apiPostMaintain(maintainListId,data){ return req('post','/maintainManagement/maintains/'+maintainListId+'/list',data) },
    apiPatchMaintains(data){ return req('patch','/maintainManagement/maintains/list',data) },
    apiDeleteMaintains(maintainId){ return req('delete','/maintainManagement/maintains/list/'+maintainId) },
    apiGetMaintainAllSearchPages(data){ return req('post','/maintainManagement/'+this.getBid()+'/maintains/list/ss',data)  },
    apiGetMaintainSearchPages(maintainListId,data){ return req('post','/maintainManagement/maintains/'+maintainListId+'/list/ss',data)  },
    apiPostMaintains(maintainListId,data){ return req('post','/maintainManagement/maintains/'+maintainListId+'/list/s',data) },    
    
}

export default device