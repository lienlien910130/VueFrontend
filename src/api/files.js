import req from './https';
import store from '../store'

const files = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},

    //大樓檔案
    apiGetBuildingFiles(){ return req('get','/basic/'+this.getBid()+'/filesList') } ,
    apiPostBuildingFiles(data){ return req('post','/basic/'+this.getUid()+'/buildings/'+this.getBid()+'/fileUpload',data,true) } ,
    
    //樓層檔案
    apiGetFloorFiles(floorId){ return req('get','/basic/Floors/'+floorId+'/filesList') } ,
    apiPostFloorFiles(floorId,data){ return req('post','/basic/'+this.getUid()+'/Floors/'+floorId+'/fileUpload',data,true) } ,
    //樓層平面圖檔案
    apiGetFloorImage(filesId){ return req('get','/Public/fileDownload/'+filesId+'/r',null,true) } ,

    //門牌檔案
    apiGetFloorOfHouseFiles(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/filesList') } ,
    apiPostFloorOfHouseFiles(floorofhouseId,data){ return req('post','/basic/'+this.getUid()+'/usageOfFloors/'+floorofhouseId+'/fileUpload',data,true) } ,
    
    //檢修申報
    apiGetInspectionFiles(reportInspectionListId){ return req('get',
    '/reportInspection/'+reportInspectionListId+'/filesList') } ,
    apiPostInspectionFiles(reportInspectionListId,data){ 
        return req('post',
        '/reportInspection/'+this.getUid()+'/'+reportInspectionListId+'/fileUpload',data,true) } ,
    
    //公安申報
    apiGetPublicSafeFiles(reportPublicSafeListId){ return req('get',
    '/reportPublicSafe/'+reportPublicSafeListId+'/filesList') } ,
    apiPostPublicSafeFiles(reportPublicSafeListId,data){ 
        return req('post','/reportPublicSafe/'+this.getUid()+'/'+reportPublicSafeListId+'/fileUpload',data,true) } ,
    
    //維護保養大項
    apiGetMaintainsListFiles(maintainListId){ return req('get','/maintainManagement/maintains/'+maintainListId+'/filesList') } ,
    apiPostMaintainsListFiles(maintainListId,data){ 
        return req('post','/maintainManagement/'+this.getUid()+'/maintains/'+maintainListId+'/fileUpload',data,true) } ,

    //維護保養細項
    apiGetMaintainsFiles(maintainId){ return req('get','/maintainManagement/maintains/list/'+maintainId+'/filesList') } ,
    apiPostMaintainsFiles(maintainId,data){ 
        return req('post','/maintainManagement/'+this.getUid()+'/maintains/list/'+maintainId+'/fileUpload',data,true) } ,

    //用圖控檔案id找資料
    apiGetFileIdToGraphicFile(supervisoryControlSystemId){ 
        return req('get','/drawingControl/'+supervisoryControlSystemId+'/supervisoryControlSystems/file') },
    //用樓層id找資料
    apiGetFloorIdToGraphicFile(floorId){ 
        return req('get','/drawingControl/floors/'+floorId+'/supervisoryControlSystems') },
    apiPostGraphicFile(floorId,data){ 
        return req('post','/drawingControl/'+this.getUid()+'/floors/'+floorId+'/supervisoryControlSystems/file',
        data,true) },

    //共用方法 刪除/下載
    apiDeleteFile(data){ return req('post','/public/fileDelete',data) },
    apiGetFile(fileId){ return req('get','/Public/fileDownload/'+fileId) },
    
}

export default files