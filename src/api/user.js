import request from '@/utils/request'

export function getversion(data) {
  return request({
    url: '/vue-admin-template/user/version',
    method: 'get',
    data
  })
}

export function login(data) {
  return request({
    //url: '/vue-admin-template/user/login',
    url: '/users/login',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    //url: '/vue-admin-template/user/info',
    url: '/users/'+ id+'/info',
    method: 'get'
    //params: { id }
    
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

