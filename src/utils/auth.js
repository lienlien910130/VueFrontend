import Cookies from 'js-cookie'

const TokenKey = '_token'
const Version = '_version'
const USERid = '_ID'
const BuildingID = '_buildingid'
const GraphicJson = '_graphic'

export function getVersion() {
  return Cookies.get(Version)
}

export function setVersion(v) {
  return Cookies.set(Version,v)
}

export function removeVersion(v) {
  return Cookies.remove(Version)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getID() {
  return Cookies.get(USERid)
}

export function setID(userid) {
  return Cookies.set(USERid, userid)
}

export function removeID() {
  return Cookies.remove(USERid)
}

export function getBuildingid() {
  return Cookies.get(BuildingID)
}

export function setBuildingid(buildingID) {
  return Cookies.set(BuildingID, buildingID)
}

export function removeBuildingid() {
  return Cookies.remove(BuildingID)
}

export function getBuildingArray() {
  return Cookies.get(BuildingArray)
}

export function setBuildingArray(buildingArray) {
  return Cookies.set(BuildingArray, buildingArray)
}

export function removeBuildingArray() {
  return Cookies.remove(BuildingArray)
}

export function getGraphicJson() {
  return Cookies.get(GraphicJson)
}

export function setGraphicJson(graphicjson) {
  return Cookies.set(GraphicJson, graphicjson)
}
