import req from './https';
// uid bid 
export const apiGetBuilding = params => req('get','/index/'+params.uid+'/buildings') //取得帳號的所有建築物
export const apiGetBuildingInfo = params => req('get','index/'+params.uid+'/buildings/'+params.bid+'/info') //取得該建築物的基本資料

const build = {
    apiGetBuilding = params => req('get','/index/'+params.uid+'/buildings'), //取得帳號的所有建築物
    apiGetBuildingInfo = params => req('get','index/'+params.uid+'/buildings/'+params.bid+'/info')
}

export default build