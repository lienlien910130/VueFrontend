import req from './https';


import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid


const files = {
    apiGetBuildingFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    apiPostBuildingFiles(params){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload',params,true) } ,
    apiDeleteFiles(fileId){ return req('delete','/basic/fileDelete/'+fileId) }
}

export default files