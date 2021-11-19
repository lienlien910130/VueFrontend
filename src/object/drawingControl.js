import Parent from "./parent";
import api from "@/api";

class DrawingControl extends Parent {
  // constructor (data) {
  //     super(data)
  //     const { iconId,  addressId  } = data
  //     this.iconId = iconId
  //     this.addressId = addressId
  // }
  // clone(data){
  //     return new DrawingControl(data)
  // }
  // async update(){
  //     var data = await api.drawingControl.apiPatchElement(this).then(async(response) => {
  //         return true
  //     }).catch(error=>{
  //         return false
  //     })
  //     return data
  // }
  // async create(codeContentId){
  //     var data = await api.drawingControl.apiPostElement(codeContentId,this).then(response => {
  //         return true
  //     }).catch(error=>{
  //         return false
  //     })
  //     return data
  // }
  // async delete(){
  //     var data = await api.drawingControl.apiDeleteElement(this.id).then(async(response) => {
  //         return true
  //     }).catch(error=>{
  //         return false
  //     })
  //     return data
  // }
  // getAddressId(){
  //     return this.addressId
  // }
  // static empty(){
  //     return new DrawingControl({
  //         id:'',
  //         account :'',
  //         password :'',
  //         name :'',
  //         description :'',
  //         status :true,
  //         removable :false,
  //         linkRoles :[],
  //         linkBuildings :[]
  //     })
  // }
  // static async get(codeContentId){
  //     var data = await api.drawingControl.apiGetElement(codeContentId).then(response => {
  //         return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DrawingControl(item)})
  //     }).catch(error=>{
  //         return []
  //     })
  //     return data
  // }
  static async getOfFloor(floorId) {
    var data = await api.device
      .apiGetDrawingAddress(floorId)
      .then((response) => {
        console.log(JSON.stringify(response));
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
}

export default DrawingControl;
