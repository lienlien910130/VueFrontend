import request from '@/utils/request'

//首頁功能
//取出設定檔
export function getsetting(userid) {
  return request({
    url: '/vue-admin-template/index/getsetting',
    method: 'get',
    userid
  })
}