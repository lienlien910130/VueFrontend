import req from './https';
//bid

const files = {
    apiGetBuildingFiles(params){ return req('get','/basic/'+params.bid+'/filesList') } ,
    
}

export default files