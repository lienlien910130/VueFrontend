import req from "./https";
import store from "../store";

const building = {
  getBid() {
    return store.getters.buildingid;
  },
  //建築物
  apiGetBuilding() {
    return req("get", "/index/buildings/a");
  },
  apiGetBuildingSearchPages(data) {
    return req("post", "index/buildings/ss", null, data, true);
  },
  apiGetBuildingInfo() {
    return req("get", "/index/buildings/" + this.getBid());
  },
  apiGetBuildingOfID(id) {
    return req("get", "/index/buildings/" + id);
  },
  apiPostBuilding(data) {
    return req("post", "/index/check", null, data);
  },
  apiPatchBuildingInfo(data) {
    return req("patch", "/index/check", null, data);
  }, //修改建築物資料
  apiDeleteBuilding(buildingId) {
    return req("delete", "/index/buildings/" + buildingId);
  },
  apiPostBuildings(data) {
    return req("post", "index/check/s", null, data);
  },

  //管委會
  apiGetCommittee() {
    return req("get", "/index/communityManagementCommittee/a");
  },
  apiGetCommitteeSearchPages(data) {
    return req(
      "post",
      "/basic/communityManagementCommittee/ss",
      this.getBid(),
      data,
      true
    );
  },
  apiGetCommitteeOfID(id) {
    return req("get", "/index/communityManagementCommittee/" + id);
  },
  apiPostCommittee(data) {
    return req(
      "post",
      "/basic/communityManagementCommittee",
      this.getBid(),
      data
    );
  },
  apiPatchCommittee(data) {
    return req("patch", "/basic/communityManagementCommittee", null, data);
  },
  apiDeleteCommittee(committeeId) {
    return req("delete", "/basic/communityManagementCommittee/" + committeeId);
  },
  apiPostCommittees(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/basic/communityManagementCommittee/s", null, data);
  },

  //廠商
  apiGetContactUnit() {
    return req("get", "/index/contactUnit/a");
  },
  apiGetContactUnitSearchPages(data) {
    return req("post", "/basic/contactUnit/ss", this.getBid(), data, true);
  },
  apiGetContactUnitOfID(id) {
    return req("get", "/index/contactUnit/" + id);
  },
  apiPostContactUnit(data) {
    return req("post", "/basic/contactUnit/check", this.getBid(), data);
  },
  apiPostGovernmentApproval(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req(
      "post",
      "/basic/contactUnit/updateGovernmentApproval",
      null,
      data
    );
  },
  apiPatchContactUnit(data) {
    return req("patch", "/basic/contactUnit/check", this.getBid(), data);
  },
  apiDeleteContactUnit(contactunitId) {
    return req("delete", "/basic/contactUnit/" + contactunitId);
  },
  apiPostContactUnits(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/basic/contactUnit/check/s", null, data);
  },

  //樓層
  apiGetFloors() {
    return req("get", "/index/floors/a");
  },
  apiGetFloor(floorId) {
    return req("get", "/index/floors/" + floorId);
  },
  apiGetFloorSearchPages(buildingId, data) {
    return req("post", "/index/floors/ss", buildingId, data);
  },
  apiPostFloors(buildingId, data) {
    return req("post", "/index/floors/check/s", buildingId, data);
  },
  apiPatchFloors(buildingId, data) {
    return req("patch", "/index/floors/check", buildingId, data);
  },
  apiDeleteFloors(floorId) {
    return req("delete", "/index/floors/" + floorId);
  },

  //門牌資料
  apiGetBuildingOfHouse() {
    return req("get", "/index/usageOfFloors/a");
  },
  apiGetBuildingOfHouseOfID(id) {
    return req("get", "/index/usageOfFloors/" + id);
  },
  apiGetFloorOfHouse(floorId) {
    return req("get", "/basic/usageOfFloors/" + floorId + "/a");
  },
  apiGetFloorOfHouseFromRegister(buildingId) {
    return req("get", "/index/usageOfFloors/" + buildingId + "/nLink/a");
  },
  apiGetHouseSearchPages(data) {
    return req("post", "/basic/usageOfFloors/ss", null, data);
  },
  apiPostFloorOfHouse(floorId, data) {
    return req("post", "/basic/usageOfFloors/check", floorId, data);
  },
  apiPatchFloorOfHouse(floorId, data) {
    return req("patch", "/basic/usageOfFloors/check", floorId, data);
  },
  apiDeleteFloorOfHouse(floorofhouseId) {
    return req("delete", "/basic/usageOfFloors/" + floorofhouseId);
  },
  apiGetFloorOfHouseSearchPages(floorId, data) {
    return req("post", "/basic/usageOfFloors/floors/ss", floorId, data);
  },
  apiPostFloorOfHouses(floorId, data) {
    data.forEach((element) => {
      element.parentId = floorId;
    });
    return req("post", "/basic/usageOfFloors/check/s", null, data);
  },
};

export default building;
