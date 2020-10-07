import request from '@/utils/request'

//取得使用者所有場所
export function getbuilding(uid) {
  return request({
    url: '/index/'+uid+'/buildings',
    method: 'get'
  })
}
//取得場所的類別
export function getselectOption(id) {
  return request({
    url: '/basic/'+id+'/options/cuos',
    method: 'get'
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
    method: 'get'
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
//檢修跟公安申報
export function getreportList(id) {
  return request({
    url: '/basic/'+id+'/declare-inspection',
    method: 'get'
  })
}
//修改檢修跟公安申報
export function editreportList(data) {
  return request({
    url: '/basic/declare-inspection',
    method: 'patch',
    data
  })
}
//新增檢修跟公安申報
export function crereportList(id,data) {
  return request({
    url: '/basic/'+id+'/declare-inspection',
    method: 'post',
    data
  })
}
//刪除檢修跟公安申報
export function delreportList(id) {
  return request({
    url: '/basic/'+id+'/declare-inspection',
    method: 'delete'
  })
}
//取得樓層
export function getfloor(id) {
  return request({
    url: '/basic/'+id+'/usage-of-floors',
    method: 'get'
  })
}
//新增樓層資料
export function crefloorList(bid,data) {
  return request({
    url: '/basic/'+bid+'/usage-of-floors',
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
//取得樓層住戶資料
export function getfloorList(id,fid) {
  return request({
    url: '/basic/'+id+'/usage-of-floors/'+fid,
    method: 'get'
  })
}
//取得用戶資料
export function getuserList(id) {
  return request({
    url: '/basic/house-holders/'+id,
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
//刪除用戶資料
export function deluserList(id) {
  return request({
    url: '/basic/'+id+'/house-holders',
    method: 'delete'
  })
}
//取得平面圖
export function floorImage(query) {
  return request({
    url: '/vue-element-admin/building/floorImage',
    method: 'get',
    params: query
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