import req from './https';
import store from '../store'

const files = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},

    //大樓檔案
    apiGetBuildingFiles(){ return req('get','/basic/'+this.getBid()+'/filesList') } ,
    apiPostBuildingFiles(data){ return req('post','/basic/'+this.getUid()+'/buildings/'+this.getBid()+'/fileUpload',data,true) } ,
    
    //樓層檔案
    apiGetFloorFiles(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/filesList') } ,
    apiPostFloorFiles(floorofhouseId,data){ return req('post','/basic/'+this.getUid()+'/usageOfFloors/'+floorofhouseId+'/fileUpload',data,true) } ,
    //樓層平面圖檔案
    apiGetFloorImage(filesId){ return req('get','/basic/fileDownload/'+filesId+'/r',null,true) } ,

    //門牌檔案
    apiGetFloorOfHouseFiles(floorId){ return req('get','/basic/Floors/'+floorId+'/filesList') } ,
    apiPostFloorOfHouseFiles(floorId,data){ return req('post','/basic/'+this.getUid()+'/Floors/'+floorId+'/fileUpload',data,true) } ,
    
    //檢修申報
    apiGetInspectionFiles(inspectionId){ return req('get','/report/'+inspectionId+'/filesList/inspection') } ,
    apiPostInspectionFiles(inspectionId,data){ 
        return req('post','/report/'+this.getUid()+'/inspection/'+inspectionId+'/fileUpload',data,true) } ,
    apiPostInspectionLackFiles(inspectionId,data){ 
        return req('post','/reportLack/'+inspectionId+'/inspectionLack',data,true) } ,

    //共用方法 刪除/下載
    apiDeleteFile(fileId){ return req('delete','/basic/fileDelete/'+fileId) },
    apiGetFile(fileId){ return req('get','/basic/fileDownload/'+fileId) },
    
}

export default files