import req from './https';
// uid bid data
// get post patch delete
import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid

const building = {
    apiGetBuilding(){ return req('get','/index/'+uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(){ return req('get','index/'+uid+'/buildings/'+bid+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(data){ return req('patch','/basic/'+uid+'/buildings/info',data) } //修改建築物資料
}

export default building