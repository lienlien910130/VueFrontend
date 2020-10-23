import req from './https';

export const apiGetBuildingInfo = params => req('get','/index/'+params+'/buildings')