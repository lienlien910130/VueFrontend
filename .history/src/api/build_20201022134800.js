import req from './https';
// uid bid 

const build = {
    apiGetBuilding(params){ return req('get','/index/'+params.uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(params){ return req('get','index/'+params.uid+'/buildings/'+params.bid+'/info') } , //取得該建築物的基本資料
    
}

export default build