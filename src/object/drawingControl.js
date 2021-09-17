import Parent from './parent'
import api from '@/api'
import { DeviceAddressManagement } from '.'

class DrawingControl extends Parent {
    constructor (data) {
        super(data)
        const { iconId,  addressId  } = data
        this.iconId = iconId
        this.addressId = addressId
    }
    clone(data){
        return new DrawingControl(data)
    }
    async update(){
        var data = await api.drawingControl.apiPatchElement(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(codeContentId){
        var data = await api.drawingControl.apiPostElement(codeContentId,this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.drawingControl.apiDeleteElement(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getAddressId(){
        return this.addressId
    }
    static empty(){
        return new DrawingControl({
            id:'',
            account :'',
            password :'',
            name :'',
            description :'',
            status :true,
            removable :false,
            linkRoles :[],
            linkBuildings :[]
        })
    }
    static async get(codeContentId){
        var data = await api.drawingControl.apiGetElement(codeContentId).then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DrawingControl(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getOfFloor(floorId){
        var data = await api.drawingControl.apiGetDrawingAddress(floorId).then(response => {
            
            const array = response.resultDeviceAddress.concat(response.resultDevicePlcAddress)
            // response.resultDeviceAddress = response.resultDeviceAddress
            // .sort((x,y) => x.id - y.id).map(item=>{ return new DeviceAddressManagement(item)})
            // response.resultDevicePlcAddress = response.resultDevicePlcAddress
            // .sort((x,y) => x.id - y.id).map(item=>{ return new DeviceAddressManagement(item)})
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default DrawingControl