import Parent from "./parent";
import api from "@/api";
import { CNode } from ".";

class DrawingControl extends Parent {
  static async getOfFloor(floorId) {
    var data = await api.device
      .apiGetDrawingAddress(floorId)
      .then((response) => {
        var address = response.resultDeviceAddress.filter((address) => {
          return address.isFDCC == false;
        });
        address.forEach((element) => {
          element.type = "fire";
        });
        response.resultDevicePlcAddress.forEach((element) => {
          element.type = "plc";
        });
        const array = address.concat(response.resultDevicePlcAddress);
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
  static async update(fire, plc) {
    var fireresult = false;
    var plcresult = false;
    if (fire.length) {
      fireresult = await api.device
        .apiPatchDevicesAddressOfDrawing(fire)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    }
    if (plc.length) {
      plcresult = await api.device
        .apiPatchDevicesPLCAddressOfDrawing(plc)
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    }
    return fireresult == true || plcresult == true ? true : false;
  }
  static async getCNode(floorId) {
    var data = await api.device
      .apiGetDrawingCNode(floorId)
      .then((response) => {
        var array = response.result
          .sort((x, y) => x.id - y.id)
          .map((item) => {
            return new CNode(item);
          });
        return array;
      })
      .catch((error) => {
        return [];
      });
    return data;
  }
}

export default DrawingControl;
