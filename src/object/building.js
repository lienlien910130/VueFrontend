import Parent from './parent'
import api from '@/api'
import Files  from './files'
import User  from './user'

class Building extends Parent {
 
    constructor (data) {
        super(data)
        const { buildingName,address, area, height, floorsOfAboveGround, floorsOfUnderground, licenseNumber,
            specialStorageItems,linkOwners,linkFireManagers } = data
        var owners = linkOwners.map(item=>{ return new User(item)})
        var fireManagers = linkFireManagers.map(item=>{ return new User(item)})
        this.buildingName = buildingName
        this.address = address
        this.area = area
        this.height = height
        this.floorsOfAboveGround = floorsOfAboveGround
        this.floorsOfUnderground = floorsOfUnderground
        this.licenseNumber = licenseNumber
        this.specialStorageItems = specialStorageItems
        this.linkOwners = owners
        this.linkFireManagers = fireManagers
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
    getUsers(){
        return this.linkFireManagers.map(item=>{return item.getName()}).toString()
    }
    getOwners(){
        return this.linkOwners.map(item=>{return item.getName()}).toString()
    }
    static getConfig(){
        return [
            { label:'名稱' , prop:'buildingName',isHidden:false},
            { label:'地址' , prop:'address',isHidden:false},
            { label:'面積' , prop:'area',isHidden:false},
            { label:'高度' , prop:'height',isHidden:false},
            { label:'地上樓層' , prop:'floorsOfAboveGround',isHidden:false},
            { label:'地下樓層' , prop:'floorsOfUnderground',isHidden:false},
            { label:'使用執照字號' , prop:'licenseNumber',isHidden:false},
            { label:'管理權人' , prop:'linkOwners',format:'userInfo',isHidden:false},
            { label:'防火管理人' , prop:'linkFireManagers',format:'userInfo',isHidden:false}
        ]
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
    static async getInfo(){
        var data = await api.building.apiGetBuildingInfo().then(response => {
            var result = response.result.map(item=>{ return new Building(item)})
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
    static async files(){
        var data = await api.files.apiGetBuildingFiles().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async createfiles(formData){
        var data = await api.files.apiPostBuildingFiles(formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Building