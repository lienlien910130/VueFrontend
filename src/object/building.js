import Parent from './parent'
import api from '@/api'

class Building extends Parent {
 
    constructor (data) {
        super(data)
        const { buildingName,address, area, height, floorsOfAboveGround, floorsOfUnderground, licenseNumber,
            specialStorageItems,linkOwners,linkFireManagers } = data
        this.buildingName = buildingName
        this.address = address
        this.area = area
        this.height = height
        this.floorsOfAboveGround = floorsOfAboveGround
        this.floorsOfUnderground = floorsOfUnderground
        this.licenseNumber = licenseNumber
        this.specialStorageItems = specialStorageItems
        this.linkOwners = linkOwners
        this.linkFireManagers = linkFireManagers
        return this
    }
    clone(data){
        return new Building(data)
    }
    
    async update(){
        var data = await api.building.apiPatchBuildingInfo(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.building.apiDeleteBuilding(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.buildingName
    }
    static empty(){
        return new Building({
            id:'',
            buildingName :'',
            address :'',
            area :null,
            height :null,
            floorsOfAboveGround :null,
            floorsOfUnderground :null,
            licenseNumber :'',
            specialStorageItems :'',
            linkOwners :[],
            linkFireManagers :[]
        })
    }
    static async get (){
        var data = await api.building.apiGetBuilding().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Building(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async post (data){
        var data = await api.building.apiPostBuilding(data).then(response => {
            return response.result.id
        }).catch(error=>{
            return ''
        })
        return data
    }
    
}

export default Building