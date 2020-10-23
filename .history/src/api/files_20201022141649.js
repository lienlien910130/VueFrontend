import req from './https';
//bid:building fid:file

const files = {
    apiGetBuildingFiles(params){ return req('get','/basic/'+params.bid+'/filesList') } ,
    apiPostBuildingFiles(params){ return req('post','/basic/'+params.uid+'/buildings/'+params.bid+'/fileUpload') } ,
    apiDeleteFiles(params){ return req('delete','/basic/fileDelete/'+params.fid) }
}

export default files