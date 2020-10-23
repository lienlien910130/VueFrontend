import req from './https';
// uid bid data
// get post patch delete
import store from '../store'

const uid = store.getters.id


const building = {
    apiGetBuilding(params){ return req('get','/index/'+uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(params){ return req('get','index/'+params.uid+'/buildings/'+params.bid+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(params){ return req('patch','/basic/'+params.uid+'/buildings/info',params.data) } //修改建築物資料
}

export default building