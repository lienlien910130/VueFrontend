import store from "../store";
import {
  Account,
  Building,
  Contactunit,
  Device,
  DeviceAddressManagement,
  DeviceType,
  Floors,
  Role,
  UsageOfFloor,
  User,
} from "../object";
import moment from "moment";
const ElementUI = require("element-ui");

let wsConnection = {
  backWs: {
    $ws: null,
    lockReturn: false,
    timeout: 60 * 1000 * 5,
    timeoutObj: null,
    timeoutNum: null,
    serverTimeoutObj: null,
  },
  processWs: {
    $ws: null,
    lockReturn: false,
    timeout: 60 * 1000 * 5,
    timeoutObj: null,
    timeoutNum: null,
    serverTimeoutObj: null,
    cPId: null,
    cNodeId: null,
    floorId: null,
    addressChangeList: null, //有異動的清單
    selfDefenseFireMarshallingListId: null,
    contingencyProcessId: null,
    login: false,
    getProcess: false, //用來判斷關閉後是否要重新連線
  },
  dataWs: {
    $ws: null,
    lockReturn: false,
    timeout: 60 * 1000 * 5,
    timeoutObj: null,
    timeoutNum: null,
    serverTimeoutObj: null,
  },
  //初始化websocket
  initWebSocket: function () {
    let _this = this;
    //back
    let backWsProtocol =
      "clRywHL4CrkA3OUw7qBoFMhx6ZG1bDXTskdhZP6qc07D3U54D6I6FQSEkgHODJUPM3ZcUocC7m64O2XcZYT8VBX4SoHpfiYfkiop2cvRBFzG5jFLTQ98RI2rJe8wiIZz";
    // this.backWs.$ws = new WebSocket('ws://'+backIP+':'+backPort+'/', backWsProtocol);
    this.backWs.$ws = new WebSocket(
      process.env.VUE_APP_WEBSOCKET,
      backWsProtocol
    );
    this.backWs.$ws.onopen = function () {
      console.log("ws open-BACK");
      wsConnection.startWsHeartbeat(_this.backWs);
    };
    this.backWs.$ws.onclose = function () {
      console.log("ws close-BACK");
      wsConnection.reconnect(_this.backWs);
    };
    this.backWs.$ws.onmessage = function (msg) {
      console.log("ws message-BACK");
      var data = JSON.parse(msg.data);
      wsConnection.resetHeartbeat(_this.backWs);
      console.log(data);
      if (data.mode == "signalHistory") {
        //初始歷史資料
        data.addressChangeList.forEach((element) => {
          if (element.internet.indexOf("P") !== -1) {
            //PLC點位
            combineAddress(element, "PLC");
          } else {
            combineAddress(element, "LOC");
          }
        });
      } else if (data.mode !== "emergency") {
        //平常接收訊息
        data.address.forEach((element) => {
          element.createTime = new Date();
          if (data.mode == "main") {
            combineAddress(element, "MAIN");
          } else if (data.mode == "locPlc") {
            combineAddress(element, "PLC", true);
          } else if (data.mode == "loc") {
            //處理復歸001-01-001-1 0
            combineAddress(element, "LOC", true);
          }
        });
      }
    };
    this.backWs.$ws.onerror = function () {
      wsConnection.reconnect(_this.backWs);
    };
    //前端給前端內部溝通
    let dataWsProtocol =
      "JonUmZbPuQj69GnQdefx6w1ygkeU8PkzHO0EknOSdTmTYEhgg7HpDOeniThA96f4PlGlGFKBsVSbICqlEsb91xf15tVt7FGddY80p6AfcBIknQqsEWiPhKf9hByJL1Vt";
    this.dataWs.$ws = new WebSocket(
      process.env.VUE_APP_WEBSOCKET,
      dataWsProtocol
    );
    this.dataWs.$ws.onopen = function () {
      console.log("ws open");
      wsConnection.startWsHeartbeat(_this.dataWs);
    };
    this.dataWs.$ws.onclose = function () {
      console.log("ws close");
      wsConnection.reconnect(_this.dataWs);
    };
    this.dataWs.$ws.onmessage = function (msg) {
      console.log("ws message");
      console.log(msg);
      wsConnection.resetHeartbeat(_this.dataWs);
      var data = JSON.parse(msg.data);
      if (data.SenderName == "MercuryfireWS65") {
        store.dispatch("websocket/saveUserId", data.Id);
      } else {
        getMessage(msg);
      }
    };
    this.dataWs.$ws.onerror = function () {
      wsConnection.reconnect(_this.dataWs);
    };
  },
  initProcessWebSocket: function () {
    let _this = this;
    //process
    let processWsProtocol =
      "Tm7wHKS4JrvrOMYuMfl28xgJ9sWBjFnfq0wXkyYewG12vkyqRunm74bVUyvXwr97tLsrZ9kZB76WIJ5nvZOy06xsEAGKXPgSph3yx3L3ObyCDqeOKtXmP6AoQDI77DqV";
    var connectUrl =
      process.env.VUE_APP_WEBSOCKET + "?cToken=" + store.getters.mToken;
    this.processWs.$ws = new WebSocket(connectUrl, processWsProtocol);
    this.processWs.$ws.onopen = function () {
      console.log("ws open-PROCESS");
      wsConnection.startWsHeartbeat(_this.processWs);
    };
    this.processWs.$ws.onclose = function () {
      console.log("ws close-PROCESS");
      wsConnection.reconnect(_this.processWs, true);
    };
    this.processWs.$ws.onmessage = function (msg) {
      console.log("ws message-PROCESS");
      var data = msg.data.indexOf("{") > -1 ? JSON.parse(msg.data) : msg.data;
      wsConnection.resetHeartbeat(_this.processWs);
      console.log(data);
      if (data == "0x052E") {
        ElementUI.Message.error("尚未訂閱智慧消防平台");
      } else {
        if (data.mode == "wsLogin") {
          store.dispatch("user/saveToken", data.accessToken);
          store.dispatch("user/saveUserID", data.accountListId);
          store.dispatch("user/saveUserRole", data.roleList);
          _this.processWs.login = true;
        } else if (data.mode == "wsLoginInfo") {
          if (data.emergencyInfo !== undefined) {
            emergencyInfo(data.emergencyInfo);
            store.dispatch("websocket/saveProcess", true);
            ElementUI.Message("已啟動緊急應變");
          }
          if (Object.keys(data.cpList).length) {
            //初始節點資料
            var nodeList = Object.values(data.cpList)[0].eventCNodeList;
            for (let node in Object.keys(nodeList)) {
              var obj = nodeList[Object.keys(nodeList)[node]];
              if (obj !== undefined) {
                var temp = {
                  mode: "cNodeResult",
                  cpId: obj.parentId,
                  cNodeId: obj.instanceCNode.id,
                  nodeId: obj.instanceCNode.nodeId,
                  state: obj.instanceCNode.state,
                  name: obj.instanceCNode.name,
                  nType: obj.instanceCNode.nType,
                };
                store.dispatch("websocket/saveNodeResult", temp);
                if (obj.waitResponseOptions !== undefined) {
                  //有等待選擇的
                  var newAccount = obj.instanceCNode.linkAccountList.map(
                    (item) => {
                      return item.id;
                    }
                  );
                  var waitingNode = {
                    cNodeId: obj.instanceCNode.id,
                    nodeId: obj.instanceCNode.nodeId,
                    state: obj.instanceCNode.state,
                    name: obj.instanceCNode.name,
                    nType: obj.instanceCNode.nType,
                    accountList: newAccount.toString(),
                  };
                  store.dispatch("websocket/saveWaitingNode", waitingNode);
                }
              }
            }
          }
        } else if (data.mode == "emergency") {
          //已啟動緊急應變時需重新登入ws要緊急應變的token
          _this.processWs.$ws.close();
        } else if (data.mode == "selectOptions") {
          //使用者收到選項的狀況
          _this.processWs.cPId = data.cpId;
          _this.processWs.cNodeId = data.cNodeId;
          if (data.cOptions !== undefined) {
            store.dispatch("websocket/sendOptions", data.cOptions);
          }
        } else if (data.mode == "cNodeResult") {
          //每個節點執行的結果
          store.dispatch("websocket/saveNodeResult", data);
        } else if (data.mode == "broadcastEmergencyResponse") {
          //使用者選了選項後收到的廣播
          store.dispatch("websocket/updateNodeResult", data);
          store.dispatch("websocket/removeWaitingNode", data);
        }
      }
    };
    this.processWs.$ws.onerror = function () {
      wsConnection.reconnect(_this.processWs, true);
    };
  },
  //重啟
  reconnect: function (ws, isProcess = false) {
    let _this = this;
    if (ws.lockReturn) {
      return;
    }
    ws.lockReturn = true;
    ws.timeoutNum && clearTimeout(ws.timeoutNum);
    ws.timeoutNum = setTimeout(function () {
      isProcess == false ? _this.initWebSocket() : _this.initProcessWebSocket();
      ws.lockReturn = false;
    }, 300);
  },
  //開啟心跳
  startWsHeartbeat: function (ws) {
    let _this = this;
    ws.timeoutObj && clearTimeout(ws.timeoutObj);
    ws.serverTimeoutObj && clearTimeout(ws.serverTimeoutObj);
    ws.timeoutObj = setInterval(function () {
      //判斷當前的狀態
      if (ws.$ws.readyState != 1) {
        _this.reconnect(ws);
      }
    }, ws.timeout);
  },
  //重置心跳
  resetHeartbeat: function (ws) {
    let _this = this;
    clearTimeout(ws.timeoutObj);
    clearTimeout(ws.serverTimeoutObj);
    _this.startWsHeartbeat(ws);
  },
  //內部發送訊息
  sendMsg: function (dataType, sendType, content, Bid = null) {
    let _this = this;
    const msg = {
      DataType: dataType,
      SendType: sendType,
      SenderName: store.getters.name,
      Data: {
        Id: store.getters.wsuserId,
        Bid: Bid == null ? store.getters.buildingid : Bid,
        Content: content,
      },
    };
    _this.dataWs.$ws.send(JSON.stringify(msg));
  },
  // sendProcessWsLogin: function(){
  //   var str = 'accountCToken:'+store.getters.mToken
  //   console.log('accountCToken', str)
  //   this.processWs.$ws.send(str)
  // },
  //手機選擇選項後發送回去的訊息
  sendProcess: function (cOption) {
    let _this = this;
    const msg = {
      mode: "cOptionSelected",
      accountCToken: store.getters.mToken,
      cPId: _this.processWs.cPId,
      cNodeId: _this.processWs.cNodeId,
      cOptions: new Array(cOption),
    };
    _this.processWs.$ws.send(JSON.stringify(msg));
    store.dispatch("websocket/sendOptions", []);
  },
};

function combineAddress(element, type, realTimeAction = false) {
  var mode = "";
  var label = "";
  switch (type) {
    case "PLC":
      mode = "PLC";
      label = element.internet + "-" + element.system + "-" + element.memeryLoc;
      if (element.system == "R400") {
        label = element.internet + "-" + element.system;
        element.actionName = element.status;
        element.deviceName = "水位計";
      }
      break;
    case "LOC":
      mode = "火警";
      label =
        element.internet +
        "-" +
        element.system +
        "-" +
        element.address +
        "-" +
        element.number;
      element.status = element.sAction;
      break;
    case "MAIN":
      mode = "防災盤";
      label = element.internet + "-" + element.memeryLoc;
      if (label == "001-0003" && element.status == "1") {
        //復歸
        store.dispatch("websocket/saveReturn", true);
      }
      break;
  }
  store.dispatch("websocket/sendMsg", {
    mode: mode,
    date: moment(element.createTime).format("YYYY/MM/DD HH:mm:ss"),
    status: element.status,
    actionName: element.actionName,
    areaName: element.areaName,
    deviceName: element.deviceName,
    label: label,
  });
  if (realTimeAction) {
    store.dispatch("websocket/saveAction", {
      mode: mode,
      date: moment(element.createTime).format("YYYY/MM/DD HH:mm:ss"),
      status: element.status,
      label: label,
    });
  }
}

function emergencyInfo(data) {
  store.dispatch("building/setBuildingID", data.buildingId);
  wsConnection.processWs.floorId = data.floorId;
  wsConnection.processWs.addressChangeList = data.addressChangeList;
  var marList = data.selfDefenseFireMarshallingListId.split(",");
  wsConnection.processWs.selfDefenseFireMarshallingListId = marList.filter(
    function (element, index, arr) {
      return arr.indexOf(element) === index;
    }
  );
  var processList = data.contingencyProcessId.split(",");
  wsConnection.processWs.contingencyProcessId = processList.filter(function (
    element,
    index,
    arr
  ) {
    return arr.indexOf(element) === index;
  });
}

function getMessage(msg) {
  var data = JSON.parse(msg.data);
  console.log("getMessage", data.Data.Id, store.getters.wsuserId);
  if (data.Data.Id !== undefined) {
    // console.log('收到別人的訊息!', data.DataType)
    console.log("收到訊息!", data.DataType);
    if (data.DataType == "building" || data.DataType == "account") {
      switch (data.DataType) {
        case "building":
          handleBuilding(data.SendType, data.Data.Bid, data.Data.Content);
          break;
        case "account":
          handleAccount(data.SendType, data.Data.Content);
          break;
      }
    } else if (data.Data.Bid == store.getters.buildingid) {
      switch (data.DataType) {
        case "roles":
          handleRoles(data.SendType, data.Data.Content);
          break;
        case "menus":
          handleMenus(data.SendType, data.Data.Content);
          break;
        case "setting":
          handleSetting(data.SendType, data.Data.Content);
          break;
        case "floor":
          handleFloor(data.SendType, data.Data.Content);
          break;
        case "contactUnit":
          handleContactUnit(data.SendType, data.Data.Content);
          break;
        case "houseHolder":
          handleHouseHolder(data.SendType, data.Data.Content);
          break;
        case "floorOfHouse":
          handleFloorOfHouse(data.SendType, data.Data.Content);
          break;
        case "device":
          handleDevice(data.SendType, data.Data.Content);
          break;
        case "deviceType":
          handleDeviceType(data.SendType, data.Data.Content);
          break;
        case "deviceAddress":
          handleDeviceAddress(data.SendType, data.Data.Content);
          break;
        case "graphic":
          handleGraphic(msg);
          break;
      }
    }
  }
}

function handleRoles(index, content) {
  console.log("handleRoles", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateRole", new Role(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteRole", content);
  } else if (index == "create") {
    store.dispatch("building/addRole", new Array(new Role(content)));
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addRole",
      content.map((item) => {
        return new Role(item);
      })
    );
  }
}
function handleAccount(index, content) {
  console.log("handleAccount", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateAccount", new Account(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteAccount", content);
  } else if (index == "create") {
    store.dispatch("building/addAccount", new Array(new Account(content)));
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addAccount",
      content.map((item) => {
        return new Account(item);
      })
    );
  }
}
function handleMenus(index, content) {
  console.log("handleMenus", index, content);
  if (index == "reset") {
    //切換頁面的同時重新載入選單並儲存
    store.dispatch("permission/setneedreload", true);
  } else if (index == "routes") {
    store.dispatch("permission/setRoutes");
  }
}
function handleSetting(index, content) {
  console.log("handleSetting", index, content);
  if (index == "update") {
    store.dispatch("building/updateOption", content);
  } else if (index == "delete") {
    store.dispatch("building/deleteOption", content);
  } else if (index == "create") {
    store.dispatch("building/addOption", content);
  }
}
function handleBuilding(index, bid, content) {
  console.log("handleBuilding", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateBuildingList", new Building(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteBuildingList", content);
  } else if (index == "create") {
    if (store.getters.id == "1") {
      //系統管理員
      store.dispatch("building/addBuildingList", new Building(content));
    }
  } else if (index == "info") {
    if (bid == store.getters.buildingid) {
      store.dispatch("building/setBuildingInfo", new Building(content));
    }
  } else if (index == "set") {
    if (store.getters.id == "1") {
      //系統管理員
      var array = content.map((item) => {
        return new Building(item);
      });
      store.dispatch("building/setBuildingList", array);
    }
  }
}
function handleFloor(index, content) {
  console.log("handleSetting", index, content);
  if (index == "update") {
    store.dispatch("building/updateFloor", new Floors(content));
  }
}
function handleContactUnit(index, content) {
  console.log("handleContactUnit", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateContactunit", new Contactunit(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteContactunit", content);
  } else if (index == "create") {
    store.dispatch(
      "building/addContactunit",
      new Array(new Contactunit(content))
    );
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addContactunit",
      content.map((item) => {
        return new Contactunit(item);
      })
    );
  }
}
function handleHouseHolder(index, content) {
  console.log("handleHouseHolder", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateHouseHolder", new User(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteHouseHolder", content);
  } else if (index == "create") {
    store.dispatch("building/addHouseHolder", new Array(new User(content)));
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addHouseHolder",
      content.map((item) => {
        return new User(item);
      })
    );
  }
}
function handleFloorOfHouse(index, content) {
  console.log("handleFloorOfHouse", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateFloorOfHouse", new UsageOfFloor(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteFloorOfHouse", content);
  } else if (index == "create") {
    store.dispatch(
      "building/addFloorOfHouse",
      new Array(new UsageOfFloor(content))
    );
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addFloorOfHouse",
      content.map((item) => {
        return new UsageOfFloor(item);
      })
    );
  }
}
function handleDevice(index, content) {
  console.log("handleDevice", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateDevice", new Device(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteDevice", content);
  } else if (index == "create") {
    store.dispatch("building/addDevice", new Array(new Device(content)));
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addDevice",
      content.map((item) => {
        return new Device(item);
      })
    );
  }
}
function handleDeviceType(index, content) {
  console.log("handleDeviceType", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch("building/updateDeviceType", new DeviceType(content));
  } else if (index == "delete") {
    store.dispatch("building/deleteDeviceType", content);
  } else if (index == "create") {
    store.dispatch(
      "building/addDeviceType",
      new Array(new DeviceType(content))
    );
  } else if (index == "uploadExcelSave") {
    store.dispatch(
      "building/addDeviceType",
      content.map((item) => {
        return new DeviceType(item);
      })
    );
  }
}
function handleDeviceAddress(index, content) {
  console.log("handleDeviceAddress", index, content);
  if (index == "update" || index == "updateManySave") {
    store.dispatch(
      "building/updateAddressManagement",
      new DeviceAddressManagement(content)
    );
  } else if (index == "delete") {
    store.dispatch("building/deleteAddressManagement", content);
  } else if (index == "create") {
    store.dispatch(
      "building/addAddressManagement",
      new Array(new DeviceAddressManagement(content))
    );
  }
}
function handleGraphic(msg) {
  console.log("handleGraphic", msg);
  store.dispatch("websocket/sendGraphicMsg", msg);
}

export default wsConnection;
