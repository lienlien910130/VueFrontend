import req from './https';
import store from '../store'

const setting = {
  getUid(){ return store.getters.id},
  getBid(){ return store.getters.buildingid},

  //取得所有選單設定
  apiGetRouter(){ return req('get','/Index/menuList') },
  //取得所有類別
  apiGetBuildingOptions(){ return req('get','/settings/'+this.getBid()+'/a') },
  //取得指定的分類選單
  apiGetOptionById(optionId){ return req('get','/settings/'+optionId) },
  apiGetOptions(optionName){ return req('get','/settings/'+this.getBid()+'/'+optionName) },
  apiPostOption(data){ return req('post','/settings/'+this.getBid(),data) },
  apiPatchOption(data){ return req('patch','/settings',data) },
  apiDeleteOption(optionId){ return req('delete','/settings/'+optionId) },
  //查詢是否有重複值
  // apiSearchOption(data){ return req('post','/settings/'+this.getBid()+'/ss',data)},
  apiCheckOption(data){ return req('post','/settings/'+this.getBid()+'/check',data)},
}

export default setting