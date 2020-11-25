import req from './https';
import store from '../store'

const setting = {
  getUid(){ return store.getters.id},
  getBid(){ return store.getters.buildingid},

  //取得所有類別
  apiGetBuildingOptions(){ return req('get','/settings/'+this.getBid()+'/options/a') },
  //取得指定的分類選單
  apiGetOptions(optionName){ return req('get','/settings/'+this.getBid()+'/options/'+optionName) },
  apiPostOption(data){ return req('post','/settings/'+this.getBid()+'/options ',data) },
  apiPatchOption(data){ return req('patch','/settings/options',data) },
  apiDeleteOption(optionId){ return req('delete','/settings/'+optionId+'/options') },

}

export default setting