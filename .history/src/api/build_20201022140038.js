import req from './https';
// uid bid 
// get post patch delete
const build = {
    apiGetBuilding(params){ return req('get','/index/'+params.uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(params){ return req('get','index/'+params.uid+'/buildings/'+params.bid+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(parms){ return req('patch','/basic/'+uid+'/buildings/info',) }
}

export default build