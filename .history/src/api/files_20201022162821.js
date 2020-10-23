import req from './https';


import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid


const files = {
    //大樓檔案
    apiGetBuildingFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    apiPostBuildingFiles(params){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload',params,true) } ,
    
    //門牌檔案
    apiGetFloorOfHouseFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    apiPostFloorOfHouseFiles(params){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload',params,true) } ,
    
    //共用方法
    apiDeleteFile(fileId){ return req('delete','/basic/fileDelete/'+fileId) },
    apiGetFile(fileId){ return req('get','/basic/fileDownload/'+fileId) },
    
}

export default files