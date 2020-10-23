import req from './https';
// uid bid data
// get post patch delete
import store from '../store'

const uid = store.getters.id
const bid = store.getters.buildingid

const building = {
    //基本資料
    apiGetBuilding(){ return req('get','/index/'+uid+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(){ return req('get','/index/'+uid+'/buildings/'+bid+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(data){ return req('patch','/basic/'+uid+'/buildings/info',data) }, //修改建築物資料
    //管委會
    apiGetCommittee(){ return req('get','/basic/'+bid+'/community-management-committee') },
    apiPostCommittee(data){ return req('post','/basic/'+bid+'/community-management-committee',data) },
    apiPatchCommittee(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteCommittee(committeeId){ return req('delete','/basic/'+committeeId+'/community-management-committee') },
    //廠商
    apiGetContactUnit(){ return req('get','/basic/'+bid+'/contact-unit') },
    apiPostContactUnit(data){ return req('post','/basic/'+bid+'/contact-unit',data) },
    apiPatchContactUnit(data){ return req('patch','/basic/contact-unit',data) },
    apiDeleteContactUnit(contactunitId){ return req('delete','/basic/'+contactunitId+'/contact-unit') },
    //廠商類別
    apiGetContactUnitOption(){ return req('get','/basic/'+bid+'/options/cuos') },
    apiPostContactUnitOption(data){ return req('post','/basic/'+bid+'/options',data) },
    apiPatchContactUnitOption(data){ return req('patch','/basic/options',data) },
    apiDeleteContactUnitOption(optionId){ return req('delete','/basic/'+optionId+'/options') },
    //樓層
    apiGetFloors(){ return req('get','/basic/building/'+bid+'/a/floors') },
    apiPostFloors(data){ return req('post','/basic/building/'+bid+'/floors',data) },
    apiPatchFloors(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteFloors(floorId){ return req('delete','/basic/floors/'+floorId) },
    //門牌資料
    apiGetBuildingOfHouse(){ return req('get','/basic/buildingId/'+bid+'/floors/a/usage-of-floors') },
    apiGetFloorOfHouse(floorId){ return req('get','/basic/floors/'+floorId+'/usage-of-floors') },
    apiPostFloorOfHouse(floorId,data){ return req('post','/basic/floors/'+floorId+'/usage-of-floors',data) },
    apiPatchFloorOfHouse(data){ return req('patch','/basic/usage-of-floors',data) },
    apiDeleteFloorOfHouse(floorofhouseId){ return req('delete','/basic/'+floorofhouseId+'/usage-of-floors') },
    //使用者資料
    apiGetAllBuildingOfUser(){ return req('get','/basic/a/house-holders') },
    apiGetUser(userId){ return req('get','/basic/house-holders/'+userId) },
    apiPostUser(data){ return req('post','/basic/house-holders',data) },
    apiPatchUser(data){ return req('patch','/basic/house-holders',data) },
    apiDeleteUser(userId){ return req('delete','/basic/'+userId+'/house-holders') },
    



}

export default building