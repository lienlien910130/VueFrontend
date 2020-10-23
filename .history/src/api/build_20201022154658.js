import req from './https';
// uid bid data
// get post patch delete
import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid

const building = {
    //大樓基本資料
    apiGetBuilding(){ return req('get','/index/'+uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(){ return req('get','index/'+uid+'/buildings/'+bid+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(data){ return req('patch','/basic/'+uid+'/buildings/info',data) }, //修改建築物資料
    //大樓管委會
    apiGetCommittee(){ return req('get','/basic/'+bid+'/community-management-committee') },
    apiPostCommittee(data){ return req('post','/basic/'+bid+'/community-management-committee',data) },
    apiPatchCommittee(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteCommittee(committeeId){ return req('delete','/basic/'+committeeId+'/community-management-committee') },
    //大樓廠商
    apiGetContactUnit(){ return req('get','/basic/'+bid+'/contact-unit') },
    apiPostContactUnit(data){ return req('post','/basic/'+bid+'/contact-unit',data) },
    apiPatchContactUnit(data){ return req('patch','/basic/contact-unit',data) },
    apiDeleteContactUnit(contactunitId){ return req('delete','/basic/'+contactunitId+'/contact-unit') },
    //大樓廠商類別
    apiGetContactUnitOption(){ return req('get','/basic/'+bid+'/options/cuos') },
    apiPostContactUnitOption(data){ return req('post','/basic/'+bid+'/options',data) },
    apiPatchContactUnitOption(data){ return req('patch','/basic/options',data) },
    apiDeleteContactUnitOption(optionId){ return req('delete','/basic/'+optionId+'/options') },
    //大樓樓層
    apiGetFloors(){ return req('get','/basic/'+bid+'/community-management-committee') },
    apiPostFloors(data){ return req('post','/basic/'+bid+'/community-management-committee',data) },
    apiPatchFloors(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteFloors(committeeId){ return req('delete','/basic/'+committeeId+'/community-management-committee') },




}

export default building