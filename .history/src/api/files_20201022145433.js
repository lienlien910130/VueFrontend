import req from './https';


import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid


const files = {
    apiGetBuildingFiles(){ return req('get','/basic/'+bid+'/filesList') } ,
    // apiPostBuildingFiles(params){ return req('post','/basic/'+uid+'/buildings/'+bid+'/fileUpload',params.data,true) } ,
    apiPostBuildingFiles(data){
        return request({
            url: '/basic/'+uid+'/buildings/'+bid+'/fileUpload',
            method: 'post',
            headers: {'Content-Type': 'multipart/form-data'},
            data
        })
    },
    apiDeleteFiles(params){ return req('delete','/basic/fileDelete/'+params.fid) }
}

export default files