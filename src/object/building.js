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
        this.area = area == undefined ? null : area
        this.height = height == undefined ? null : height
        this.floorsOfAboveGround = floorsOfAboveGround == undefined ? null : floorsOfAboveGround
        this.floorsOfUnderground = floorsOfUnderground == undefined ? null : floorsOfUnderground
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
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'buildingName',mandatory:true, 
            message:'請輸入名稱',maxlength:'20',isHidden:false,isSearch:true,
            placeholder:'請輸入名稱',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'地址' , prop:'address',format:'address',
            mandatory:true, message:'請輸入地址',maxlength:'100',
            isHidden:false,isSearch:true,placeholder:'請輸入地址',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'面積' , prop:'area',
            mandatory:true, message:'請輸入面積',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入面積',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'高度' , prop:'height',
            mandatory:true, message:'請輸入高度',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入高度',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'地上樓層' , prop:'floorsOfAboveGround',format:'inputnumber',
            mandatory:true, message:'請輸入地上樓層，無則輸入0',
            pattern:/^[0-9]{1,4}$/,errorMsg:'請輸入0~9999',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入地上樓層，無則輸入0',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'地下樓層' , prop:'floorsOfUnderground',format:'inputnumber',
            mandatory:true, message:'請輸入地下樓層，無則輸入0',
            pattern:/^[0-9]{1,4}$/,errorMsg:'請輸入0~9999',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入地下樓層，無則輸入0',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'使用執照字號' , prop:'licenseNumber',
            mandatory:true, message:'請輸入使用執照',maxlength:'30',
            isHidden:false,isSearch:true,placeholder:'請輸入使用執照',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'管理權人' , prop:'linkOwners',format:'userInfo',
            type:'array',typemessage:'',
            mandatory:false,isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'防火管理人' , prop:'linkFireManagers',
            type:'array',typemessage:'',
            mandatory:false, format:'userInfo',isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true}
        ]
    }
    static getUpdateConfig(){
        return [
            { label:'名稱' , prop:'buildingName',mandatory:true, 
            message:'請輸入名稱',maxlength:'20',isHidden:false,isSearch:true,
            placeholder:'請輸入名稱',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'地址' , prop:'address',format:'address',
            mandatory:true, message:'請輸入地址',maxlength:'100',
            isHidden:false,isSearch:true,placeholder:'請輸入地址',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'面積' , prop:'area',
            mandatory:true, message:'請輸入面積',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入面積',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'高度' , prop:'height',
            mandatory:true, message:'請輸入高度',format:'inputnumber',
            pattern:/^\d+$|^\d+[.]?\d+$/,errorMsg:'請輸入正確格式',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入高度',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'地上樓層' , prop:'floorsOfAboveGround',format:'inputnumber',
            mandatory:true, message:'請輸入地上樓層，無則輸入0',
            pattern:/^[0-9]{1,4}$/,errorMsg:'請輸入0~9999',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入地上樓層，無則輸入0',
            isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:true},
            { label:'地下樓層' , prop:'floorsOfUnderground',format:'inputnumber',
            mandatory:true, message:'請輸入地下樓層，無則輸入0',
            pattern:/^[0-9]{1,4}$/,errorMsg:'請輸入0~9999',isPattern:true,
            isHidden:false,isSearch:false,placeholder:'請輸入地下樓層，無則輸入0',
            isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:true},
            { label:'使用執照字號' , prop:'licenseNumber',
            mandatory:true, message:'請輸入使用執照',maxlength:'30',
            isHidden:false,isSearch:true,placeholder:'請輸入使用執照',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'管理權人' , prop:'linkOwners',format:'userInfo',
            type:'array',typemessage:'',
            mandatory:false,isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'防火管理人' , prop:'linkFireManagers',
            type:'array',typemessage:'',
            mandatory:false, format:'userInfo',isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true}
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
    static async getSearchPage(data){
        var data = await api.building.apiGetBuildingSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Building(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.building.apiPostBuildings(data).then(response => {
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default Building