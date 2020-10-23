import req from './https';

export const apiGetBuilding = params => req('get','/index/'+params.uid+'/buildings') //取得帳號的所有建築物
export const apiGetBuildingInfo = params => req('get','/index/'+params+'/buildings') //取得該建築物的基本資料

