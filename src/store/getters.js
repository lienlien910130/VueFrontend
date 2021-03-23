const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  menuId: state => state.permission.menuId,
  menu: state => state.permission.menu,
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
  buildingroles : state => state.building.roles,
  buildingid : state => state.building.buildingid,
  buildinginfo : state => state.building.buildinginfo,
  buildingarray : state => state.building.buildingarray,
  buildingoptions : state => state.building.buildingoptions,
  buildingcontactunit : state => state.building.buildingcontactunit,
  buildingusers : state => state.building.buildingusers,
  buildingfloors : state => state.building.buildingfloors,
  buildingdevices : state => state.building.buildingdevices,
  json: state => state.graphic.json,
  permission_routes: state => state.permission.routes
}
export default getters
