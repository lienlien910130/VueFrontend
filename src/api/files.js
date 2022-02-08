import req from "./https";
import store from "../store";

const files = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  apiGetAllFiles(data) {
    return req("post", "/fileManager/ss", this.getBid(), data, true);
  },

  //大樓檔案
  apiGetBuildingFiles() {
    return req("get", "/index/" + this.getBid() + "/filesList");
  },
  // apiPostBuildingFiles(data){ return req('post','/basic/'+this.getUid()+'/buildings/'+this.getBid()+'/fileUpload',data,false,true) } ,
  apiPostBuildingFiles(data) {
    return req("upload", "/index/" + this.getUid() + "/fileUpload", null, data);
  },
  //樓層檔案
  apiGetFloorFiles(floorId) {
    return req("get", "/index/Floors/" + floorId + "/filesList");
  },
  // apiPostFloorFiles(floorId,data){ return req('post','/basic/'+this.getUid()+'/buildings/'+this.getBid()+'/Floors/'+floorId+'/fileUpload',data,false,true) } ,
  apiPostFloorFiles(floorId, data) {
    return req(
      "upload",
      "/index/" + this.getUid() + "/Floors/" + floorId + "/fileUpload",
      null,
      data
    );
  },
  //樓層平面圖檔案
  // apiGetFloorImage(filesId){ return req('files','/public/fileDownload/'+filesId+'/r') } ,

  //門牌檔案
  apiGetFloorOfHouseFiles(floorofhouseId) {
    return req("get", "/basic/usageOfFloors/" + floorofhouseId + "/filesList");
  },
  // apiPostFloorOfHouseFiles(floorofhouseId,data){
  //     return req('post','/basic/'+this.getUid()+'/buildings/'+this.getBid()+'/usageOfFloors/'+floorofhouseId+'/fileUpload',data,false,true) } ,
  apiPostFloorOfHouseFiles(floorofhouseId, data) {
    return req(
      "upload",
      "/basic/usageOfFloors/" +
        this.getUid() +
        "/" +
        floorofhouseId +
        "/fileUpload",
      null,
      data
    );
  },

  //檢修申報
  apiGetInspectionFiles(reportInspectionListId) {
    return req(
      "get",
      "/reportInspection/" + reportInspectionListId + "/filesList"
    );
  },
  apiPostInspectionFiles(reportInspectionListId, data) {
    return req(
      "upload",
      "/reportInspection/" +
        this.getUid() +
        "/buildings/" +
        this.getBid() +
        "/" +
        reportInspectionListId +
        "/fileUpload",
      null,
      data
    );
  },

  //公安申報
  apiGetPublicSafeFiles(reportPublicSafeListId) {
    return req(
      "get",
      "/reportPublicSafe/" + reportPublicSafeListId + "/filesList"
    );
  },
  apiPostPublicSafeFiles(reportPublicSafeListId, data) {
    return req(
      "upload",
      "/reportPublicSafe/" +
        this.getUid() +
        "/buildings/" +
        this.getBid() +
        "/" +
        reportPublicSafeListId +
        "/fileUpload",
      null,
      data
    );
  },

  //維護保養大項
  apiGetMaintainsListFiles(maintainListId) {
    return req(
      "get",
      "/maintainListManagement/maintains/" + maintainListId + "/filesList"
    );
  },
  apiPostMaintainsListFiles(maintainListId, data) {
    return req(
      "upload",
      "/maintainListManagement/" +
        this.getUid() +
        "/maintains/" +
        maintainListId +
        "/fileUpload",
      null,
      data
    );
  },

  //維護保養細項

  apiGetMaintainsFiles(maintainId) {
    return req(
      "get",
      "/maintainListManageMent/maintainManagement/maintains/list/" +
        maintainId +
        "/filesList"
    );
  },
  apiPostMaintainsFiles(maintainId, data) {
    return req(
      "upload",
      "/maintainListManagement/maintainManagement/" +
        this.getUid() +
        "/maintains/list/" +
        maintainId +
        "/fileUpload",
      null,
      data
    );
  },

  //用圖控檔案id找資料
  // apiGetFileIdToGraphicFile(supervisoryControlSystemId){
  //     return req('get','/drawingControl/'+supervisoryControlSystemId+'/supervisoryControlSystems/file') },
  //用樓層id找資料
  apiGetFloorIdToGraphicFile(type, floorId) {
    return req(
      "get",
      type + "/floors/" + floorId + "/supervisoryControlSystems"
    );
  },
  apiPostGraphicFile(floorId, data) {
    return req(
      "upload",
      "/drawingControl/" +
        this.getUid() +
        "/floors/" +
        floorId +
        "/supervisoryControlSystems/file",
      null,
      data
    );
  },

  //共用方法 刪除/下載
  apiDeleteFile(data) {
    return req("post", "/public/fileDelete", null, data);
  },
  apiGetFile(fileId) {
    return req("files", "/public/fileDownload/" + fileId);
  },
  apiGetImage(fileId) {
    return req("files", "/public/fileDownload/" + fileId + "/r");
  },
  apiGetFileOfId(fileId) {
    return req("get", "/index/fileManager/" + fileId);
  },
};

export default files;
