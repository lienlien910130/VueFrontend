import Cookies from "js-cookie";

const TokenKey = "_token";
const Version = "_version";
const USERid = "_ID";
const BuildingID = "_buildingid";
const Device = "_device";
const TmpAccount = "_tmpaccount";

export function getVersion() {
  return Cookies.get(Version);
}

export function setVersion(v) {
  return Cookies.set(Version, v);
}

export function removeVersion(v) {
  return Cookies.remove(Version);
}

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getID() {
  return Cookies.get(USERid);
}

export function setID(userid) {
  return Cookies.set(USERid, userid);
}

export function removeID() {
  return Cookies.remove(USERid);
}

export function getBuildingid() {
  return Cookies.get(BuildingID);
}

export function setBuildingid(buildingID) {
  return Cookies.set(BuildingID, buildingID);
}

export function removeBuildingid() {
  return Cookies.remove(BuildingID);
}

export function getDevice() {
  return Cookies.get(Device);
}

export function setDevice(device) {
  return Cookies.set(Device, device);
}

export function removeDevice() {
  return Cookies.remove(Device);
}

export function getTmpA() {
  return Cookies.get(TmpAccount);
}

export function setTmpA(account) {
  return Cookies.set(TmpAccount, account);
}

export function removeTmpA() {
  return Cookies.remove(TmpAccount);
}
