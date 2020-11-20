import request from '@/utils/request'

//查詢檢修申報
// export function getinspection(buildingId) {
//   return request({
//     url: '/report/'+buildingId+'/inspection',
//     method: 'get'
//   })
// }
//修改檢修申報
// export function editinspection(data) {
//   return request({
//     url: '/report/inspection',
//     method: 'patch',
//     data
//   })
// }
//新增檢修申報
// export function creinspection(buildingId,data) {
//   return request({
//     url: '/report/'+buildingId+'/inspection',
//     method: 'post',
//     data
//   })
// }
//刪除檢修申報
// export function delinspection(inspectionId) {
//   return request({
//     url: '/report/'+inspectionId+'/inspection',
//     method: 'delete'
//   })
// }
//查詢公安申報
// export function getpublicSafe(buildingId) {
//   return request({
//     url: '/report/'+buildingId+'/publicSafe',
//     method: 'get'
//   })
// }
//修改公安申報
// export function editpublicSafe(data) {
//   return request({
//     url: '/report/publicSafe',
//     method: 'patch',
//     data
//   })
// }
//新增公安申報
// export function crepublicSafe(buildingId,data) {
//   return request({
//     url: '/report/'+buildingId+'/publicSafe',
//     method: 'post',
//     data
//   })
// }
//刪除公安申報
// export function delpublicSafe(publicSafeId) {
//   return request({
//     url: '/report/'+publicSafeId+'/publicSafe',
//     method: 'delete'
//   })
// }

//上傳平面圖
// export function uploadfloorimage(floorsId,userId,data) {
//   return request({
//     url: 'basic/'+userId+'/Floors/'+floorsId+'/fileUpload',
//     method: 'post',
//     headers: {'Content-Type': 'multipart/form-data'},
//     data
//   })
// }
//取得平面圖
// export function getfloorimage(floorsId) {
//   return request({
//     url: 'basic/Floors/'+floorsId+'/filesList',
//     method: 'get'
//   })
// }

//上傳檢修申報檔案
// export function uploadinspection(inspectionId,userId,data) {
//   return request({
//     url: '/report/'+userId+'/inspection/'+inspectionId+'/fileUpload',
//     method: 'post',
//     headers: {'Content-Type': 'multipart/form-data'},
//     data
//   })
// }
//取得檢修申報檔案
// export function getinspectionfiles(inspectionId) {
//   return request({
//     url: '/report/'+inspectionId+'/filesList/inspection',
//     method: 'get'
//   })
// }
//上傳公安申報檔案
// export function uploadpublicSafe(publicSafeId,userId,data) {
//   return request({
//     url: '/report/'+userId+'/publicSafe/'+publicSafeId+'/fileUpload',
//     method: 'post',
//     headers: {'Content-Type': 'multipart/form-data'},
//     data
//   })
// }
//取得公安申報檔案
// export function getpublicSafefiles(publicSafeId) {
//   return request({
//     url: '/report/'+publicSafeId+'/filesList/publicSafe',
//     method: 'get'
//   })
// }
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

