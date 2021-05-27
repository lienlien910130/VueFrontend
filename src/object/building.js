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
    async create(){
        var data = await api.building.apiPostBuilding(this).then(response => {
            return response.result.id
        }).catch(error=>{
            return ''
        })
        return data
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
    async files(){
        var data = await api.files.apiGetBuildingFiles().then(response => {
            console.log('response')
            console.log(JSON.stringify(response))
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostBuildingFiles(formData).then(response => {
            console.log(response)
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
            { label:'名稱' , prop:'buildingName',mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false,isSearch:true},
            { label:'地址' , prop:'address',format:'address',
            mandatory:true, message:'請輸入地址',maxlength:'100',
            isHidden:false,isSearch:true},
            { label:'面積' , prop:'area',
            mandatory:true, message:'請輸入面積',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'高度' , prop:'height',
            mandatory:true, message:'請輸入高度',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'地上樓層' , prop:'floorsOfAboveGround',
            mandatory:true, message:'請輸入地上樓層',format:'hide',
            pattern:/^[1-9]*[1-9][0-9]*$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'地下樓層' , prop:'floorsOfUnderground',
            mandatory:true, message:'請輸入地下樓層',format:'hide',
            pattern:/^[1-9]*[1-9][0-9]*$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'使用執照字號' , prop:'licenseNumber',
            mandatory:true, message:'請輸入使用執照',maxlength:'30',
            isHidden:false,isSearch:true},
            { label:'管理權人' , prop:'linkOwners',format:'userInfo',
            type:'array',typemessage:'',
            mandatory:false,isHidden:false,isSearch:false},
            { label:'防火管理人' , prop:'linkFireManagers',
            type:'array',typemessage:'',
            mandatory:false, format:'userInfo',isHidden:false,isSearch:false}
        ]
    }
    static getCreateConfig(){
        return [
            { label:'名稱' , prop:'buildingName',
            mandatory:false, message:'請輸入名稱',maxlength:'20',isHidden:false,isSearch:true},
            { label:'地址' , prop:'address',format:'address',
            mandatory:false, message:'請輸入地址',maxlength:'100',
            isHidden:false,isSearch:true},
            { label:'面積' , prop:'area',
            mandatory:false, message:'請輸入面積',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'高度' , prop:'height',
            mandatory:false, message:'請輸入高度',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'地上樓層' , prop:'floorsOfAboveGround',
            mandatory:false, message:'請輸入地上樓層',format:'inputnumber',
            pattern:/^[1-9]*[1-9][0-9]*$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'地下樓層' , prop:'floorsOfUnderground',
            mandatory:false, message:'請輸入地下樓層',format:'inputnumber',
            pattern:/^[1-9]*[1-9][0-9]*$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false},
            { label:'使用執照字號' , prop:'licenseNumber',
            mandatory:false, message:'請輸入使用執照',maxlength:'30',
            isHidden:false,isSearch:true},
            { label:'管理權人' , prop:'linkOwners',format:'userInfo',
            type:'array',typemessage:'',
            mandatory:false,isHidden:false,isSearch:false},
            { label:'防火管理人' , prop:'linkFireManagers',
            type:'array',typemessage:'',
            mandatory:false, format:'userInfo',isHidden:false,isSearch:false}
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
            var result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new Building(item)})
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
    // static async post (data){
    //     var data = await api.building.apiPostBuilding(data).then(response => {
    //         return response.result.id
    //     }).catch(error=>{
    //         return ''
    //     })
    //     return data
    // }
    // static async files(){
    //     var data = await api.files.apiGetBuildingFiles().then(response => {
    //         var result = response.result.sort((x,y) => x.id - y.id).map(item=>{return new Files(item)})
    //         return result
    //     }).catch(error=>{
    //         return []
    //     })
    //     return data
    // }
    // static async createfiles(formData){
    //     var data = await api.files.apiPostBuildingFiles(formData).then(response => {
    //         return true
    //     }).catch(error=>{
    //         return false
    //     })
    //     return data
    // }
}

export default Building