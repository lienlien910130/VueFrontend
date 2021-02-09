const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
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
  msg: state => state.websocket.msg,
  buildingid : state => state.building.buildingid,
  buildingarray : state => state.building.buildingarray,
  json: state => state.graphic.json,
  permission_routes: state => state.permission.routes
}
export default getters
