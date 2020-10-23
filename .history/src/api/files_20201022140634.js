import req from './https';
//bid:building fid:file

const files = {
    apiGetBuildingFiles(params){ return req('get','/basic/'+params.bid+'/filesList') } ,

    apiDeleteFiles(params){ return req('delete','/basic/fileDelete/'+params.fid) }
}

export default files