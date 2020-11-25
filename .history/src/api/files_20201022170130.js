import req from './https';


import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid


const files = {
    //大樓檔案
    apiGetBuildingFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    apiPostBuildingFiles(data){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload',data,true) } ,
    
    //樓層檔案
    apiGetFloorFiles(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/filesList') } ,
    apiPostFloorFiles(floorofhouseId,data){ return req('post','/basic/'+uid+'/usageOfFloors/'+floorofhouseId+'/fileUpload',data,true) } ,
    
    //門牌檔案
    apiGetFloorOfHouseFiles(floorId){ return req('get','/basic/Floors/'+floorId+'/filesList') } ,
    apiPostFloorOfHouseFiles(floorId,data){ return req('post','/basic/'+uid+'/Floors/'+floorId+'/fileUpload',data,true) } ,
    
    //共用方法 刪除/下載
    apiDeleteFile(fileId){ return req('delete','/basic/fileDelete/'+fileId) },
    apiGetFile(fileId){ return req('get','/basic/fileDownload/'+fileId) },
    
}

export default files