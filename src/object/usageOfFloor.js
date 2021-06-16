import Parent from './parent'
import api from '@/api'
import User from './user'
import Files from './files'

class UsageOfFloor extends Parent {
 
    constructor (data) {
        super(data)
        const { houseNumber,placeName, capacity, note,linkUsers, linkOwners } = data
        var owners = linkUsers.map(item=>{ return new User(item)})
        var users = linkOwners.map(item=>{ return new User(item)})
        this.houseNumber = houseNumber
        this.placeName = placeName
        this.capacity = capacity
        this.note = note
        this.linkUsers = users
        this.linkOwners = owners
        return this
    }
    clone(data){
        return new UsageOfFloor(data)
    }
    async update(){
        var data = await api.building.apiPatchFloorOfHouse(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(floorId){
        var data = await api.building.apiPostFloorOfHouse(floorId,this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.building.apiDeleteFloorOfHouse(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetFloorOfHouseFiles(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostFloorOfHouseFiles(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.houseNumber
    }
    //管委會使用
    getlinkUsers(){
        return this.linkUsers
    }
    static empty(){
        return new UsageOfFloor({
            id:'',
            houseNumber :'',
            placeName :'',
            capacity :0,
            note :'',
            linkUsers :[],
            linkOwners :[]
        })
    }
    static getTableConfig(){
        return [
             { label:'戶號' , prop:'houseNumber', mandatory:true, message:'請輸入戶號',
             isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入戶號',
             isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
             { label:'場所名稱' , prop:'placeName', mandatory:true, message:'請輸入場所名稱',
             isHidden:false,maxlength:'100',isSearch:true,placeholder:'請輸入場所名稱',
             isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
             { label:'收容人數' , prop:'capacity',format:'inputnumber',
             type:'number',typemessage:'',mandatory:false,
             pattern:/^[0-9]{1,10}$/,errorMsg:'格式錯誤，請重新輸入',isPattern: true,
             isHidden:false,isSearch:false,
             isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
             { label:'所有人' , prop:'linkOwners',format:'userInfo', 
             mandatory:true, message:'請選擇所有人',
             type:'array',typemessage:'',
             isHidden:false,isSearch:false,
             isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
             { label:'使用人' , prop:'linkUsers',format:'userInfo', 
             mandatory:true, message:'請選擇使用人',
             type:'array',typemessage:'',
             isHidden:false,isSearch:false,
             isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
             { label:'備註' , prop:'note',format:'textarea',mandatory:false,
             isHidden:false,maxlength:'200',isSearch:true,placeholder:'請輸入備註',
             isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
         ]
     }
    static async getAll(){
        var data = await api.building.apiGetBuildingOfHouse().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new UsageOfFloor(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async get(floorId){
        var data = await api.building.apiGetFloorOfHouse(floorId).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new UsageOfFloor(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(floorId,data){
        var data = await api.building.apiGetFloorOfHouseSearchPages(floorId,data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new UsageOfFloor(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(floorId,data){
        var data = await api.building.apiPostFloorOfHouses(floorId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default UsageOfFloor