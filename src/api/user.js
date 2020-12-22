import req from './https';
import store from '../store'

const user = { 
  getUid(){ return store.getters.id},
  apiPostLogin(data){ return req('post','/users/login',data) },
  apiPostLogout(data){ return req('post','/vue-admin-template/user/logout',data) },
  apiGetUserInfo(){ return req('get','/users/'+this.getUid()+'/info') }
}

export default user
