import Parent from './parent'
import DeviceType from './deviceType'

class Device extends Parent {
 
    constructor (data) {
        super(data)
        const { name,dateOfPurchase, dateOfWarranty, location, systemNumber, circuitNumber, address,
            systemUsed,linkKeeperUnits,linkMaintainVendors, linkFloors, linkDeviceTypes  } = data
        var deviceType = linkDeviceTypes.map(item=>{ return new DeviceType(item) })    
        this.name = name
        this.dateOfPurchase = dateOfPurchase
        this.dateOfWarranty = dateOfWarranty
        this.location = location
        this.systemNumber = systemNumber
        this.circuitNumber = circuitNumber
        this.address = address
        this.systemUsed = systemUsed
        this.linkKeeperUnits = linkKeeperUnits
        this.linkMaintainVendors = linkMaintainVendors
        this.linkFloors = linkFloors
        this.linkDeviceTypes = deviceType
        return this
    }
    clone(data){
        return new Device(data)
    }
    
    async update(){
        var data = await api.device.apiPatchDevicesManagement(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.device.apiPostDevicesManagement(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteDevicesManagement(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        var name = this.linkDeviceTypes.length !== 0 ? 
        '【'+this.linkDeviceTypes[0].getTypeName()+'】'+this.name :  '【】'+this.name
        return name
    }
    static empty(){
        return new Device({
            id:'',
            name:'',
            dateOfPurchase : null,
            dateOfWarranty : null,
            location :'',
            systemNumber :'',
            circuitNumber :'',
            address :'',
            systemUsed :false,
            linkKeeperUnits : [],
            linkMaintainVendors :[],
            linkFloors :[],
            linkDeviceTypes: []
        })
    }
    static getConfig(){
       
    }
    
    static async get (){
        var data = await api.device.apiGetBuildingDevicesManagement().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Device(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    
}

export default Device