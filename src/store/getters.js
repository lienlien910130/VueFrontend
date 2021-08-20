const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  fullscreen: state => state.app.fullscreen,
  
  menuId: state => state.permission.menuId,
  menuAuthority: state => state.permission.menuAuthority,
  menu: state => state.permission.menu,
  menuNoLevel: state => state.permission.menuNoLevel,
  needreload: state => state.permission.needreload,
  permission_routes: state => state.permission.routes,

  token: state => state.user.token,
  level: state => state.user.level,
  account: state => state.user.account,
  roles: state => state.user.roles,
  id: state => state.user.id,
  name: state => state.user.name,

  verid: state => state.version.id,
  vername: state => state.version.name,
  verlogo: state => state.version.logo,
  vercom: state => state.version.components,

  wsmsg: state => state.websocket.wsmsg,
  wsuserId: state => state.websocket.wsuserId,

  buildingroles : state => state.building.roles,
  buildingid : state => state.building.buildingid,
  buildinginfo : state => state.building.buildinginfo,
  buildingarray : state => state.building.buildingarray,
  buildingoptions : state => state.building.buildingoptions,
  buildingcontactunit : state => state.building.buildingcontactunit,
  buildingusers : state => state.building.buildingusers,
  buildingfloors : state => state.building.buildingfloors,
  buildingdevices : state => state.building.buildingdevices,
  buildingfloorOfHouse: state => state.building.buildingfloorOfHouse,
  buildingdeviceType: state => state.building.buildingdeviceType,
  buildingaddress: state => state.building.buildingaddress,
  deviceType : state => state.building.deviceType,

  json: state => state.graphic.json,
  
  role_record : state => state.record.role_record,
  menu_record: state => state.record.role_record,
  setting_record: state => state.record.setting_record,
  floor_record: state => state.record.floor_record,
  floorOfHouse_record: state => state.record.floorOfHouse_record,
  householder_record:  state => state.record.householder_record,
  device_record: state => state.record.device_record,
  contactunit_record: state => state.record.contactunit_record,
  deviceType_record: state => state.record.deviceType_record,
  addressManagement_record :state => state.record.addressManagement_record
}
export default getters
