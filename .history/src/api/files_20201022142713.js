import req from './https';


import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid


const files = {
    apiGetBuildingFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    apiPostBuildingFiles(){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload') } ,
    apiDeleteFiles(params){ return req('delete','/basic/fileDelete/'+params.fid) }
}

export default files