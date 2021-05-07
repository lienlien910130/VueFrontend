import Parent from './parent'
import api from '@/api'
import Device from './device'
import Files from './files'
import UsageOfFloor from './usageOfFloor'

class Floors extends Parent {
 
    constructor (data) {
        super(data)
        const { floor, floorPlanID, linkDevices } = data
        var devices = linkDevices.map(item=>{ return new Device(item)})
        this.floor = floor
        this.floorPlanID = floorPlanID
        this.linkDevices = devices
        return this
    }
    clone(data){
        return new Floors(data)
    }
    async getUsageOfFloor(){
        var data = await api.building.apiGetFloorOfHouse(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new UsageOfFloor(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetFloorFiles(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostFloorFiles(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getGraphicFiles(){
        var data = await api.files.apiGetFloorIdToGraphicFile(this.id).then(response => {
            return response.result.codeContent
        }).catch(error=>{
            return null
        })
        return data        
    }
    async postGraphicFiles(formData){
        var data = await api.files.apiPostGraphicFile(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data        
    }
    getName(){
        return this.floor>0 ? this.floor+'F' : '地下 '+this.floor.substr(1)+'F'
    }
    getImageID(){
        return this.floorPlanID.toString()
    }
    static getConfig(){
       return []
    }
    static async get (){
        var data = await api.building.apiGetBuildingFloors().then(response => {
            console.log('getFloor',JSON.stringify(response))
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Floors(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async update(data){
        var data = await api.building.apiPatchFloors(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async create (buildingId,data){
        var data = await api.building.apiPostFloors(buildingId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    
}

export default Floors