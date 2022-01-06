import req from "./https";
import store from "../store";

const setting = {
  getUid() {
    return store.getters.id;
  },
  getBid() {
    return store.getters.buildingid;
  },

  //取得所有選單設定
  // apiGetRouter(){ return req('get','/Index/menuList') },
  //取得所有類別
  apiGetBuildingOptions() {
    return req("get", "/settings/" + this.getBid() + "/a");
  },
  //取得指定的分類選單
  // apiGetOptionById(optionId){ return req('get','/settings/'+optionId) },
  apiGetOptions(optionName) {
    return req("get", "/settings/" + this.getBid() + "/" + optionName);
  },
  apiPostOption(data) {
    return req("post", "/settings/check", this.getBid(), data);
  },
  apiPatchOption(data) {
    data.forEach((element) => {
      element.parentId = this.getBid();
    });
    return req("patch", "/settings/check/s", null, data);
  },
  apiDeleteOption(optionId) {
    return req("delete", "/settings/" + optionId);
  },
};

export default setting;
