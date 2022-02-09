import router from "./router";
import store from "./store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, getBuildingid } from "@/utils/auth";
import { Building, DeviceType, Menu } from "./object/index";
const ElementUI = require("element-ui");
NProgress.configure({ showSpinner: false });

const whiteList = [
  "/login",
  "/emergencyGraphic/index",
  "/password",
  "/reset",
  "/register",
  "/certification",
]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  console.log(to.name, from.name, to.meta.title);
  NProgress.start();
  document.title = `${
    to.meta.title == null ? `載入中` : to.meta.title
  } - 智慧消防管理平台`;
  const hasToken = getToken();
  const buildingID = getBuildingid();
  await store.dispatch("permission/setnavbarButton", to.name == "process"); //為了在navbar顯示返回的button
  var toMenu = to.name;

  if (hasToken) {
    //已經登入過了
    if (
      to.path === "/login" ||
      to.path === "/password" ||
      to.path === "/reset"
    ) {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (to.name !== null) {
        // var isNeedReload = store.getters.needreload;
        // if (isNeedReload) {
        //   await store.dispatch("permission/setmenu", await Menu.get());
        //   await store.dispatch("permission/setneedreload", false);
        // }

        // if (to.name == "emergencyClass") {
        //   toMenu = "drawingControl";
        // }
        var menuarray = store.getters.menuNoLevel.filter(
          (item) => item.code == toMenu
        );
        if (menuarray.length !== 0) {
          await store.dispatch("permission/setmenuId", menuarray[0].getID()); //儲存要進入的頁面ID
          // await store.dispatch(
          //   "permission/setmenuAuthority",
          //   menuarray[0].getAccessAuthorities()
          // ); //儲存要進入的頁面權限
          console.log("setMenuId", menuarray[0].id);
        }
      }

      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        //重新整理時會執行該段
        try {
          // get user info
          await store.dispatch("user/getInfo");
          // await store.dispatch('building/setroles',await Role.get()) //跟大樓無關連
          await store.dispatch(
            "building/setDefaultDeviceType",
            await DeviceType.getDefault()
          ); ////跟大樓無關連
          const isSystem = store.getters.id == "1";
          // if(isSystem){ //系統管理員=>取得所有大樓清單
          //   store.dispatch('building/setBuildingList', await Building.get())
          // }
          if (buildingID) {
            //已經有選過大樓
            console.log("已選擇過建築物大樓");
            await store.dispatch("building/setBuildingID", buildingID);
            //if(!isSystem) await store.dispatch('building/setBuildingList', await Building.get())
            await store.dispatch("permission/setRoutes"); //設定選單資料庫&側邊選單欄
            await store.dispatch(
              "building/setBuildingInfo",
              await Building.getInfo()
            );
            // await store.dispatch('building/setbuildingoptions',await Setting.getAllOption())
            // await store.dispatch('building/setbuildingcontactunit',await Contactunit.get())
            // await store.dispatch('building/setbuildingusers',await User.get())
            // await store.dispatch('building/setbuildingdevices',await Device.get())
            // await store.dispatch('building/setbuildingfloors',await Floors.get())
          } else {
            //第一次登入 選單初始化
            const accessRoutes = await store.dispatch(
              "permission/generateRoutes",
              isSystem
            ); //設定選單
            router.addRoutes(accessRoutes);
          }
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/logout");
          next(`/login?redirect=${to.path}`);
          alert("error" + error);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 直接通行
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
