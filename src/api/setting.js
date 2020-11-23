import req from './https';
import store from '../store'

const setting = {
  getUid(){ return store.getters.id},
  getBid(){ return store.getters.buildingid},

  //廠商類別
  apiGetContactUnitOption(){ return req('get','/basic/'+this.getBid()+'/options/cuos') },
  apiPostContactUnitOption(data){ return req('post','/basic/'+this.getBid()+'/options',data) },
  apiPatchContactUnitOption(data){ return req('patch','/basic/options',data) },
  apiDeleteContactUnitOption(optionId){ return req('delete','/basic/'+optionId+'/options') },

  //設備種類
  apiGetDeviceOption(){ return req('get','/basic/'+this.getBid()+'/options/cuos') },
  apiPostDeviceOption(data){ return req('post','/basic/'+this.getBid()+'/options',data) },
  apiPatchDeviceOption(data){ return req('patch','/basic/options',data) },
  apiDeleteDeviceOption(optionId){ return req('delete','/basic/'+optionId+'/options') },

  //維護內容
  apiGetMaintainContentOption(){ return req('get','/basic/'+this.getBid()+'/options/cuos') },
  apiPostMaintainContentOption(data){ return req('post','/basic/'+this.getBid()+'/options',data) },
  apiPatchMaintainContentOption(data){ return req('patch','/basic/options',data) },
  apiDeleteMaintainContentOption(optionId){ return req('delete','/basic/'+optionId+'/options') },
  
}

export default setting