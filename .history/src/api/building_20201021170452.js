import request from '@/utils/request'

//取得使用者所有場所
export function getbuilding(uid) {
  return request({
    url: '/index/'+uid+'/buildings',
    method: 'get'
  })
}
//取得場所的廠商類別
export function getcontactunitOption(id) {
  return request({
    url: '/basic/'+id+'/options/cuos',
    method: 'get'
  })
}
//新增場所的廠商類別
export function crecontactunitOption(buildingId,data) {
  return request({
    url: '/basic/'+buildingId+'/options',
    method: 'post',
    data
  })
}
//修改場所的廠商類別
export function editcontactunitOption(data) {
  return request({
    url: '/basic/options',
    method: 'put',
    data
  })
}
//刪除場所的廠商類別
export function delcontactunitOption(optionId) {
  return request({
    url: '/basic/'+optionId+'/options',
    method: 'delete'
  })
}
//取得特定的場所資料
export function getbuInfo(uid,id) {
  return request({
    url: 'index/'+uid+'/buildings/'+id+'/info',
    method: 'get'
  })
}
//修改場所資料
export function editbuInfo(uid,data) {
  return request({
    url: '/basic/'+uid+'/buildings/info',
    method: 'patch',
    data
  })
}
//刪除場所資料
export function delbuInfo(uid,id) {
  return request({
    url: 'index/'+uid+'/buildings/'+id+'/info',
    method: 'delete'
  })
}
//管委會
export function getmanagementList(id) {
    return request({
      url: '/basic/'+id+'/community-management-committee',
      method: 'get'
    })
}
//修改管委會資料
export function editmanagementList(data) {
  return request({
    url: '/basic/community-management-committee',
    method: 'patch',
    data
  })
}
//新增管委會資料
export function cremanagementList(id,data) {
  return request({
    url: '/basic/'+id+'/community-management-committee',
    method: 'post',
    data
  })
}
//刪除管委會資料
export function delmanagementList(id) {
  return request({
    url: '/basic/'+id+'/community-management-committee',
    method: 'delete'
  })
}
//單位資料
export function getcontactunitList(id) {
  return request({
    url: '/basic/'+id+'/contact-unit',
    method: 'get'
  })
}
//修改單位資料
export function editcontactunitList(data) {
  return request({
    url: '/basic/contact-unit',
    method: 'patch',
    data
  })
}
//新增單位資料
export function crecontactunitList(id,data) {
  return request({
    url: '/basic/'+id+'/contact-unit',
    method: 'post',
    data
  })
}
//刪除單位資料
export function delcontactunitList(id) {
  return request({
    url: '/basic/'+id+'/contact-unit',
    method: 'delete'
  })
}
//查詢檢修申報
export function getinspection(buildingId) {
  return request({
    url: '/report/'+buildingId+'/inspection',
    method: 'get'
  })
}
//修改檢修申報
export function editinspection(data) {
  return request({
    url: '/report/inspection',
    method: 'patch',
    data
  })
}
//新增檢修申報
export function creinspection(buildingId,data) {
  return request({
    url: '/report/'+buildingId+'/inspection',
    method: 'post',
    data
  })
}
//刪除檢修申報
export function delinspection(inspectionId) {
  return request({
    url: '/report/'+inspectionId+'/inspection',
    method: 'delete'
  })
}
//查詢公安申報
export function getpublicSafe(buildingId) {
  return request({
    url: '/report/'+buildingId+'/publicSafe',
    method: 'get'
  })
}
//修改公安申報
export function editpublicSafe(data) {
  return request({
    url: '/report/publicSafe',
    method: 'patch',
    data
  })
}
//新增公安申報
export function crepublicSafe(buildingId,data) {
  return request({
    url: '/report/'+buildingId+'/publicSafe',
    method: 'post',
    data
  })
}
//刪除公安申報
export function delpublicSafe(publicSafeId) {
  return request({
    url: '/report/'+publicSafeId+'/publicSafe',
    method: 'delete'
  })
}
//新增多筆樓層
export function crefloor(buildingId,data) {
  return request({
    url: 'basic/building/'+buildingId+'/floors',
    method: 'post',
    data
  })
}
//取得大樓所有樓層
export function getfloors(buildingId) {
  return request({
    url: 'basic/building/'+buildingId+'/a/floors',
    method: 'get'
  })
}
//刪除樓層
export function delfloor(floorId) {
  return request({
    url: 'basic/floors/'+floorId,
    method: 'delete'
  })
}
//取得樓層門牌資料
export function getfloorList(floorId) {
  return request({
    url: 'basic/floors/'+floorId+'/usage-of-floors',
    method: 'get'
  })
}
//新增樓層資料
export function crefloorList(floorsId,data) {
  return request({
    url: 'basic/floors/'+floorsId+'/usage-of-floors',
    method: 'post',
    data
  })
}
//編輯樓層資料
export function editfloorList(data) {
  return request({
    url: '/basic/usage-of-floors',
    method: 'put',
    data
  })
}
//刪除樓層資料
export function delfloorList(id) {
  return request({
    url: '/basic/'+id+'/usage-of-floors',
    method: 'delete'
  })
}
//取得大樓的所有住戶
export function getBuildinguser() {
  return request({
    url: '/basic/a/house-holders',
    method: 'get'
  })
}
//取得指定大樓的所有門牌
export function getuildingusageOfFloor(buildingId) {
  return request({
    url: 'basic/buildingId/'+buildingId+'/floors/a/usage-of-floors',
    method: 'get'
  })
}
//取得指定使用者
export function getuser(userId) {
  return request({
    url: 'basic/house-holders/'+userId,
    method: 'get'
  })
}
//取得指定門牌的所有使用者
export function getflooruserList(usageOfFloorId) {
  return request({
    url: 'basic/usageOfFloors/'+usageOfFloorId+'/house-holders',
    method: 'get'
  })
}
//編輯用戶資料
export function edituserList(data) {
  return request({
    url: '/basic/house-holders',
    method: 'patch',
    data
  })
}
//新增用戶資料
export function creuserList(data) {
  return request({
    url: '/basic/house-holders',
    method: 'post',
    data
  })
}
//新增用戶資料
export function creflooruserList(data) {
  return request({
    url: 'basic/usageOfFloors/'+usageOfFloorId+'/house-holders',
    method: 'post',
    data
  })
}
//刪除用戶資料
export function deluserList(houseHoldersId) {
  return request({
    url: '/basic/'+houseHoldersId+'/house-holders',
    method: 'delete'
  })
}
//上傳平面圖
export function uploadfloorimage(floorsId,userId,data) {
  return request({
    url: 'basic/'+userId+'/Floors/'+floorsId+'/fileUpload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//取得平面圖
export function getfloorimage(floorsId) {
  return request({
    url: 'basic/Floors/'+floorsId+'/filesList',
    method: 'get'
  })
}
//上傳建築物檔案
export function uploadbuildinginfo(buildingId,userId,data) {
  return request({
    url: '/basic/'+userId+'/buildings/'+buildingId+'/fileUpload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//取得建築物檔案
export function getbufiles(buildingId) {
  return request({
    url: '/basic/'+buildingId+'/filesList',
    method: 'get'
  })
}
//下載建築物檔案
export function downloadbufile(filesId) {
  return request({
    url: '/basic/fileDownload/'+filesId,
    method: 'get'
  })
}
//刪除建築物檔案
export function delbufile(filesId) {
  return request({
    url: '/basic/fileDelete/'+filesId,
    method: 'delete'
  })
}
//上傳檢修申報檔案
export function uploadinspection(inspectionId,userId,data) {
  return request({
    url: '/report/'+userId+'/inspection/'+inspectionId+'/fileUpload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//取得檢修申報檔案
export function getinspectionfiles(inspectionId) {
  return request({
    url: '/report/'+inspectionId+'/filesList/inspection',
    method: 'get'
  })
}
//上傳公安申報檔案
export function uploadpublicSafe(publicSafeId,userId,data) {
  return request({
    url: '/report/'+userId+'/publicSafe/'+publicSafeId+'/fileUpload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data
  })
}
//取得公安申報檔案
export function getpublicSafefiles(publicSafeId) {
  return request({
    url: '/report/'+publicSafeId+'/filesList/publicSafe',
    method: 'get'
  })
}
//下載檢修/公安檔案
export function downloadfile(filesId) {
  return request({
    url: '/report/fileDownload/'+filesId,
    method: 'get'
  })
}
//刪除檢修/公安檔案
export function delfile(filesId) {
  return request({
    url: '/report/fileDelete/'+filesId,
    method: 'delete'
  })
}

