import req from './https';
import store from '../store'

const building = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //基本資料
    apiGetBuilding(){ return req('get','/index/buildings/a') } , //取得所有建築物
    apiGetBuildingInfo(){ return req('get','/index/buildings/'+this.getBid()) } , //取得該建築物的基本資料
    apiPostBuilding(data){ return req('post','/index/buildings',data) },
    apiDeleteBuilding(buildingId){ return req('delete','/index/buildings/'+buildingId) },
    apiPatchBuildingInfo(data){ return req('patch','/index/buildings',data) }, //修改建築物資料
    
    //管委會
    apiGetCommittee(){ return req('get','/basic/'+this.getBid()+'/community-management-committee') },
    apiPostCommittee(data){ return req('post','/basic/'+this.getBid()+'/community-management-committee',data) },
    apiPatchCommittee(data){ return req('patch','/basic/community-management-committee',data) },
    apiDeleteCommittee(committeeId){ return req('delete','/basic/'+committeeId+'/community-management-committee') },
    apiGetCommitteeSearchPages(data){ return req('post','/basic/'+this.getBid()+'/community-management-committee/ss',data)  },
    apiPostCommittees(data){ return req('post','/basic/'+this.getBid()+'/community-management-committee/s',data) },    
    
    //廠商
    apiGetBuildingContactUnit(){ return req('get','/index/'+this.getBid()+'/contact-unit') },
    apiGetContactUnit(contactUnitId){ return req('get','/basic/contact-unit/'+contactUnitId) },
    apiPostContactUnit(data){ return req('post','/basic/'+this.getBid()+'/contact-unit',data) },
    apiPatchContactUnit(data){ return req('patch','/basic/contact-unit',data) },
    apiDeleteContactUnit(contactunitId){ return req('delete','/basic/'+contactunitId+'/contact-unit') },
    apiGetContactUnitSearchPages(data){ return req('post','/basic/'+this.getBid()+'/contact-unit/ss',data)  },
    apiPostContactUnits(data){ return req('post','/basic/'+this.getBid()+'/contact-unit/s',data) },    
    
    //樓層
    apiGetBuildingFloors(){ return req('get','/index/building/'+this.getBid()+'/a/floors') },
    apiGetFloor(floorId){ return req('get','/basic/floors/'+floorId) },
    apiPostFloors(buildingId,data){ return req('post','/index/building/'+buildingId+'/floors',data) },
    apiPatchFloors(data){ return req('patch','/basic/floors',data) },
    apiDeleteFloors(floorId){ return req('delete','/basic/floors/'+floorId) },
    
    //門牌資料
    apiGetBuildingOfHouse(){ return req('get','/basic/buildingId/'+this.getBid()+'/floors/a/usage-of-floors') },
    apiGetFloorOfHouse(floorId){ return req('get','/basic/floors/'+floorId+'/usage-of-floors') },
    apiGetHouse(usageOfFloorId){ return req('get','/basic/usage-of-floors/'+usageOfFloorId) },
    apiPostFloorOfHouse(floorId,data){ return req('post','/basic/floors/'+floorId+'/usage-of-floors',data) },
    apiPatchFloorOfHouse(data){ return req('patch','/basic/usage-of-floors',data) },
    apiDeleteFloorOfHouse(floorofhouseId){ return req('delete','/basic/'+floorofhouseId+'/usage-of-floors') },
    apiGetFloorOfHouseSearchPages(floorId,data){ return req('post','/basic/floors/'+floorId+'/usage-of-floors/ss',data)  },
    apiPostFloorOfHouses(floorId,data){ return req('post','/basic/floors/'+floorId+'/usage-of-floors/s',data) },    
    //門牌底下的使用者資料
    apiGetFloorOfHouseUser(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/house-holders') },
    apiPostFloorOfHouseUser(floorofhouseId,data){ return req('post','/basic/usageOfFloors/'+floorofhouseId+'/house-holders',data) },
    
    //使用者資料
    apiGetAllBuildingOfUser(){ return req('get','/basic/'+this.getBid()+'/a/house-holders') },
    apiGetUser(userId){ return req('get','/basic/house-holders/'+userId) },
    apiPostUser(data){ return req('post','/basic/'+this.getBid()+'/house-holders',data) },
    apiPatchUser(data){ return req('patch','/basic/house-holders',data) },
    apiDeleteUser(userId){ return req('delete','/basic/'+userId+'/house-holders') },
    apiGetUserSearchPages(data){ return req('post','/basic/'+this.getBid()+'/house-holders/ss',data)  },
    apiPostUsers(data){ return req('post','/basic/'+this.getBid()+'/house-holders/s',data) },    
    
}

export default building