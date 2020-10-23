import request from '@/utils/request'

//首頁功能

//取得設備資料分配在圓餅圖及LIST清單 : data: 
export function equipment(data) {
  return request({
    url: '/vue-admin-template/index/equipment',
    method: 'get',
    data
  })
}
//取得損壞/叫修/妥善的設備清單
export function getequipment(query) {
  return request({
    url: '/vue-admin-template/index/getequipment',
    method: 'get',
    params: query
  })
}