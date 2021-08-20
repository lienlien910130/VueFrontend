import req from './https';
import store from '../store'

const building = {
    getBid(){ return store.getters.buildingid},
    //基本資料
    apiGetBuilding(){ return req('get','/index/buildings/a') } , //取得所有建築物
    apiGetBuildingInfo(){ return req('get','/index/buildings/'+this.getBid()) } , //取得該建築物的基本資料
    apiPostBuilding(data){ return req('post','/index/buildings', null, data) },
    apiPatchBuildingInfo(data){ return req('patch','/index/buildings', null, data) }, //修改建築物資料
    apiDeleteBuilding(buildingId){ return req('delete','/index/buildings/'+buildingId) },
    apiGetBuildingSearchPages(data){ return req('post','index/buildings/ss', null, data, true)  },
    apiPostBuildings(data){ return req('post','index/buildings/s', null, data) },    
    
    //管委會
    apiGetCommittee(){ return req('get','/basic/communityManagementCommittee/'+this.getBid()+'/a') },
    apiPostCommittee(data){ return req('post','/basic/communityManagementCommittee',this.getBid(),data)},
    //apiPostCommittee(data){ return req('post','/basic/communityManagementCommittee', this.getBid(), data) },
    apiPatchCommittee(data){ return req('patch','/basic/communityManagementCommittee', null, data) },
    apiDeleteCommittee(committeeId){ return req('delete','/basic/communityManagementCommittee/'+committeeId) },
    apiGetCommitteeSearchPages(data){ return req('post','/basic/communityManagementCommittee/ss', this.getBid(), data, true)  },
    apiPostCommittees(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/basic/communityManagementCommittee/s',null, data) 
    },    
    
    //廠商
    apiGetContactUnit(){ return req('get','/index/contactUnit') },
    // apiGetContactUnit(contactUnitId){ return req('get','/basic/contact-unit/'+contactUnitId) },
    apiPostContactUnit(data){ return req('post','/basic/contactUnit/check',this.getBid(),data)},
    apiPatchContactUnit(data){ return req('patch','/basic/contactUnit/check',this.getBid(),data) },
    apiDeleteContactUnit(contactunitId){ return req('delete','/basic/contactUnit/'+contactunitId) },
    apiGetContactUnitSearchPages(data){ return req('post','/basic/contactUnit/ss', this.getBid(), data, true)  },
    apiPostContactUnits(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','​/basic​/contactUnit​/check​/s', null, data) 
    },    
    
    //樓層
    apiGetFloors(){ return req('get','/index/a/floors') },
    // apiGetFloor(floorId){ return req('get','/basic/floors/'+floorId) },
    apiPostFloors(buildingId,data){ return req('post','/index/floors', buildingId, data) },
    apiPatchFloors(buildingId,data){ return req('patch','/index/floors', buildingId, data) },
    apiDeleteFloors(floorId){ return req('delete','/index/floors/'+floorId) },
    apiGetFloorSearchPages(buildingId, data){ return req('post','/index/a/floors/ss', buildingId, data)  },
    
    //門牌資料
    apiGetBuildingOfHouse(){ return req('get','/basic/usageOfFloors/a') },
    apiGetFloorOfHouse(floorId){ return req('get','/basic/usageOfFloors/'+floorId+'/a') },
    // apiGetHouse(usageOfFloorId){ return req('get','/basic/usage-of-floors/'+usageOfFloorId) },
    apiPostFloorOfHouse(floorId, data){ return req('post','/basic​/usageOfFloors/check', floorId, data) },
    apiPatchFloorOfHouse(data){ return req('patch','/basic/usageOfFloors/check', this.getBid(), data) },
    apiDeleteFloorOfHouse(floorofhouseId){ return req('delete','/basic/usageOfFloors/'+floorofhouseId) },
    apiGetFloorOfHouseSearchPages(floorId, data){ return req('post','/basic/usageOfFloors/floors/ss', floorId, data)  },
    apiPostFloorOfHouses(floorId,data){ 
        data.forEach(element => {
            element.parentId = floorId
        })
        return req('post','/basic​/usageOfFloors/check​/s', null, data) 
    },    
    //門牌底下的使用者資料
    // apiGetFloorOfHouseUser(floorofhouseId){ return req('get','/basic/usageOfFloors/'+floorofhouseId+'/house-holders') },
    // apiPostFloorOfHouseUser(floorofhouseId,data){ return req('post','/basic/usageOfFloors/'+floorofhouseId+'/house-holders',data) },
    //住戶資料
    // apiGetAllBuildingOfUser(){ return req('get','/index/a/house-holders') },
    apiGetBuildingOfUser(buildingId){ return req('get','/index/'+buildingId+'/a/houseHolders​') },
    apiGetUser(){ return req('get','/index/a/houseHolders')},
    // apiGetUser(userId){ return req('get','/basic/house-holders/'+userId) },
    apiPostUser(data){ return req('post','/basic/houseHolders/check',this.getBid(),data)},
    apiPatchUser(data){ return req('patch','/basic/houseHolders/check',this.getBid(),data)},
    apiDeleteUser(userId){ return req('delete','/basic/houseHolders/'+userId)},
    apiGetUserSearchPages(data){ return req('post','/basic/houseHolders/ss',this.getBid(),data,true)},
    apiPostUsers(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','​/basic​/houseHolders​​/check​/s', null, data) 
    },    
    
}

export default building