import req from './https';
import store from '../store'

const building = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //基本資料
    apiGetBuilding(){ return req('get','/index/'+this.getUid()+'/buildings') } , //取得帳號的所有建築物
    apiGetBuildingInfo(){ return req('get','/index/'+this.getUid()+'/buildings/'+this.getBid()+'/info') } , //取得該建築物的基本資料
    apiPatchBuildingInfo(data){ return req('patch','/basic/'+this.getUid()+'/buildings/info',data) }, //修改建築物資料
    apiDeleteBuildingInfo(){ return req('delete','/index/'+this.getUid()+'/buildings/'+this.getBid()+'/info') },
    //管委會
    apiGetCommittee(){ return req('get','/basic/'+this.getBid()+'/community-management-committee') },
    apiPostCommittee(data){ return req('post','/basic/'+this.getBid()+'/community-management-committee',data) },
    apiPatchCommittee(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteCommittee(committeeId){ return req('delete','/basic/'+committeeId+'/community-management-committee') },
    //廠商
    apiGetContactUnit(){ return req('get','/basic/'+this.getBid()+'/contact-unit') },
    apiPostContactUnit(data){ return req('post','/basic/'+this.getBid()+'/contact-unit',data) },
    apiPatchContactUnit(data){ return req('patch','/basic/contact-unit',data) },
    apiDeleteContactUnit(contactunitId){ return req('delete','/basic/'+contactunitId+'/contact-unit') },
    //樓層
    apiGetBuildingFloors(){ return req('get','/basic/building/'+this.getBid()+'/a/floors') },
    apiGetFloor(floorId){ return req('get','/basic/floors/'+floorId) },
    apiPostFloors(data){ return req('post','/basic/building/'+this.getBid()+'/floors',data) },
    apiPatchFloors(data){ return req('patch','/basic/floors',data) },
    apiDeleteFloors(floorId){ return req('delete','/basic/floors/'+floorId) },
    //門牌資料
    apiGetBuildingOfHouse(){ return req('get','/basic/buildingId/'+this.getBid()+'/floors/a/usage-of-floors') },
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
    //門牌底下的使用者資料
    apiGetFloorOfHouseUser(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/house-holders') },
    apiPostFloorOfHouseUser(floorofhouseId,data){ return req('post','/basic/usageOfFloors/'+floorofhouseId+'/house-holders',data) },
    
}

export default building