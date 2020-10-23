import req from './https';

export const apiGetBuilding = params => req('get','/index/'+params.uid+'/buildings')
export const apiGetBuildingInfo = params => req('get','/index/'+params+'/buildings')