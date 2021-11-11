import req from './https'
import store from '../store'

const user = { 
  getUid(){ return store.getters.id},
  apiPostLogin(data){ return req('post','/users/login', null, data) },
  // apiPostLoginSec(tgBuildingId,data){ return req('post','/users/login/'+tgBuildingId, null, data) },
  // apiPostLogout(data){ return req('post','/vue-admin-template/user/logout',data) },
  apiGetUserInfo(){ return req('get','/users/'+this.getUid()) },
  apiPatchUserInfo(data){ return req('patch','/index/accounts',null,data) },
  
  //訂閱
  apiPatchPhysicalInfo(data){return req('patch','/index/physicalInfos/check',this.getUid(),data)},
  apiPostPhysicalInfo(data){return req('post','/index/physicalInfos/check',this.getUid(),data)}
}

export default user
