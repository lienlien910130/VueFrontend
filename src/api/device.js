import req from "./https";
import store from "../store";

const device = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  //設備管理
  apiGetBuildingDevicesManagement() {
    return req("get", "/index/devices/a");
  },
  apiGetDevicesOfID(id) {
    return req("get", "/index/devices/" + id);
  },
  apiPostDevicesManagement(data) {
    return req("post", "/devicesManagement/check", this.getBid(), data);
  },
  apiPatchDevicesManagement(data, resetLink) {
    return req(
      "put",
      "/devicesManagement/check/" + resetLink,
      this.getBid(),
      data
    );
  },
  apiDeleteDevicesManagement(deviceId) {
    return req("delete", "/devicesManagement/" + deviceId + "/true");
  },
  apiGetDevicesManagementSearchPages(data) {
    return req("post", "/devicesManagement/ss", this.getBid(), data, true);
  },
  apiPostDevicesManagements(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("post", "/devicesManagement/check/s", null, data);
  },
  //取得維護保養
  apiGetDevicesManagementMaintain(deviceId, data) {
    return req("post", "/devicesManagement/maintains/ss", deviceId, data, true);
  },
  //取得點位-火警總機類型
  apiGetLinkDeviceAddresss(data) {
    return req(
      "post",
      "/devicesManagement/deviceAddressManagement/ss",
      null,
      data
    );
  },
  //取得點位-plc類型
  apiGetLinkDevicePLCAddresss(data) {
    return req(
      "post",
      "/devicesManagement/devicePlcAddressManagement/ss",
      null,
      data
    );
  },
  //設備清單-取得設備種類
  apiGetDevicesTypeByDevicesManagement() {
    return req("get", "/devicesManagement/devicesType/a");
  },
  //圖控更新設備-多筆更新
  // apiPatchGraphicDevices(data){ return req('patch','/drawingControl/devices',data) },

  //設備種類
  apiGetDefaultFullType() {
    return req("get", "/index/deviceTypes/fta");
  },
  apiGetDevicesTypeOfID(id) {
    return req("get", "/index/deviceTypes/" + id);
  },
  // apiGetDevicesType(){ return req('get','/deviceTypesManagement/a') },
  apiPostDevicesType(data) {
    return req("post", "/deviceTypesManagement", null, data);
  },
  apiPatchDevicesType(data) {
    return req("patch", "/deviceTypesManagement", null, data);
  },
  apiDeleteDevicesType(deviceTypeId) {
    return req("delete", "/deviceTypesManagement/" + deviceTypeId);
  },
  apiGetDevicesTypeSearchPages(data) {
    return req("post", "/deviceTypesManagement/ss", null, data, true);
  },
  apiPostDevicesTypes(data) {
    return req("post", "/deviceTypesManagement/s", null, data);
  },

  //點位設定-火警總機
  // apiGetDevicesAddress(){ return req('get','/deviceAddressManagement/a') },
  apiGetDevicesAddress(deviceAddressId) {
    return req("get", "/deviceAddressManagement/" + deviceAddressId);
  },
  apiPostDevicesAddress(deviceId, data) {
    return req("post", "/deviceAddressManagement/check", deviceId, data);
  }, //單點新增
  apiPutDevicesAddress(deviceId, resetLink, data) {
    return req(
      "put",
      "/deviceAddressManagement/check/" + resetLink,
      deviceId,
      data
    );
  },
  apiPatchDevicesAddress(deviceId, data) {
    return req("patch", "/deviceAddressManagement/s", deviceId, data);
  },
  apiDeleteDevicesAddress(deviceAddressId) {
    return req(
      "delete",
      "/deviceAddressManagement/" + deviceAddressId + "/true"
    );
  },
  apiGetDevicesAddressSearchPages(data) {
    return req("post", "/deviceAddressManagement/ss", null, data);
  },
  apiPostDevicesAddresses(deviceId, data) {
    data.forEach((element) => {
      element.parentId = deviceId;
    });
    return req("post", "/deviceAddressManagement/check/s", null, data);
  },
  //批次新增
  apiPostDevicesAddressesBatchInsert(deviceId, data) {
    return req("post", "/deviceAddressManagement/batchInsert", deviceId, data);
  },

  //點位設定-PLC
  apiGetDevicesPLCAddress(deviceAddressId) {
    return req("get", "/devicePlcAddressManagement/" + deviceAddressId);
  },
  apiPostDevicesPLCAddress(deviceId, data) {
    return req("post", "/devicePlcAddressManagement/check", deviceId, data);
  }, //單點新增
  apiPutDevicesPLCAddress(deviceId, resetLink, data) {
    return req(
      "put",
      "/devicePlcAddressManagement/check/" + resetLink,
      deviceId,
      data
    );
  },
  apiPatchDevicesPLCAddress(deviceId, data) {
    return req("patch", "/devicePlcAddressManagement/s", deviceId, data);
  },
  apiDeleteDevicesPLCAddress(deviceAddressId) {
    return req(
      "delete",
      "/devicePlcAddressManagement/" + deviceAddressId + "/true"
    );
  },
  apiGetDevicesPLCAddressSearchPages(data) {
    return req("post", "/devicePlcAddressManagement/ss", null, data);
  },
  apiPostDevicesPLCAddresses(deviceId, data) {
    data.forEach((element) => {
      element.parentId = deviceId;
    });
    return req("post", "/devicePlcAddressManagement/check/s", null, data);
  },
  //批次新增
  apiPostDevicesPLCAddressesBatchInsert(deviceId, data) {
    return req(
      "post",
      "/devicePlcAddressManagement/batchInsert",
      deviceId,
      data
    );
  },

  //點位設定-取得設備種類
  // apiGetDevicesTypeByDevicesAddress(){ return req('get','/deviceAddressManagement/deviceType/a') },
  //點位設定-多筆更新
  // apiPatchDevicesAddresses(data){ return req('patch','/deviceAddressManagement/s',data) },

  //維護保養提醒
  apiGetMaintainsListRemind() {
    return req("get", "/maintainListManagement/deviceMaintainReminder");
  },
  //維護保養大項
  apiGetBuildingMaintainsList() {
    return req("get", "/maintainListManagement/" + this.getBid() + "/a");
  },
  apiGetMaintainsList(maintainListId) {
    return req("get", "/maintainListManagement/" + maintainListId);
  },
  apiPostMaintainsList(data) {
    return req("post", "/maintainListManagement", this.getBid(), data);
  },
  apiPatchMaintainsList(data) {
    return req("patch", "/maintainListManagement", null, data);
  },
  apiDeleteMaintainsList(maintainListId) {
    return req("delete", "/maintainListManagement/" + maintainListId);
  },
  apiGetMaintainsListSearchPages(data) {
    return req("post", "/maintainListManagement/ss", this.getBid(), data, true);
  },
  // apiPostMaintainsLists(data){ return req('post','/maintainListManagement/s', null, data) },
  //維護保養取得檢修申報缺失內容
  apiGetInspectionListByMaintain() {
    return req("get", "/maintainListManagement/options");
  },

  //維護保養細項
  apiGetMaintainAll() {
    return req("get", "/maintainListManagement/maintainManagement/a/ss");
  },
  apiGetListMaintains(maintainListId) {
    return req(
      "get",
      "/maintainListManagement/maintainManagement/" + maintainListId + "/a"
    );
  },
  apiGetMaintains(maintainId) {
    return req(
      "get",
      "/maintainListManagement/maintainManagement/" + maintainId
    );
  },
  apiPostMaintain(maintainListId, data) {
    return req(
      "post",
      "/maintainListManagement/maintainManagement",
      maintainListId,
      data
    );
  },
  apiPatchMaintains(data) {
    return req(
      "patch",
      "/maintainListManagement/maintainManagement",
      null,
      data
    );
  },
  apiPatchMaintainsDevice(data) {
    return req(
      "patch",
      "/maintainListManagement/devices/check/false",
      null,
      data
    );
  },
  apiDeleteMaintains(maintainId) {
    return req(
      "delete",
      "/maintainListManagement/maintainManagement/" + maintainId
    );
  },
  apiGetMaintainAllSearchPages(data) {
    return req(
      "post",
      "/maintainListManagement/maintainManagement/a/ss",
      this.getBid(),
      data,
      true
    );
  },
  apiGetMaintainSearchPages(maintainListId, data) {
    return req(
      "post",
      "/maintainListManagement/maintainManagement/ss",
      maintainListId,
      data,
      true
    );
  },
  apiGetMaintainDeviceSearchPages(data) {
    return req(
      "post",
      "/maintainListManagement/devices/ss",
      this.getBid(),
      data,
      true
    );
  },
  apiPostMaintains(maintainListId, data) {
    data.forEach((element) => {
      element.parentId = maintainListId;
    });
    return req(
      "post",
      "/maintainListManagement/maintainManagement/s",
      null,
      data
    );
  },
  //取得樓層點位
  apiGetDrawingAddress(floorId) {
    return req("get", "/index/" + floorId + "/address");
  },
  // 圖控更新點位
  apiPatchDevicesAddressOfDrawing(data) {
    return req("patch", "/drawingControl/fdcc/s", null, data);
  },
  apiPatchDevicesPLCAddressOfDrawing(data) {
    return req("patch", "/drawingControl/plc/s", null, data);
  },
  //圖控取得該樓層的該樓層的cNode-nType:61&62
  apiGetDrawingCNode(floorId) {
    return req("get", "/drawingControl/cNode/" + floorId);
  },
};

export default device;
