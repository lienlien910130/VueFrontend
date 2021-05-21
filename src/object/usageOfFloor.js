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
    getlinkUsers(){
        return this.linkUsers
    }
    getUsers(){
        return this.linkUsers.map(item=>{return item.getName()}).toString()
    }
    getOwners(){
        return this.linkOwners.map(item=>{return item.getName()}).toString()
    }
    getInfo(){
        return this
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
    static getConfig(){
       return [
            { label:'戶號' , prop:'houseNumber', mandatory:true, message:'請輸入戶號',isSelect:false,isSort:true,isHidden:false,maxlength:'20'},
            { label:'場所名稱' , prop:'placeName', mandatory:true, message:'請輸入場所名稱',isSelect:false,isSort:true,isHidden:false,maxlength:'100'},
            { label:'收容人數' , prop:'capacity',format:'inputnumber',type:'number',typemessage:'',mandatory:true,message:'請輸入收容人數',
            isSelect:false,isSort:false,isHidden:false},
            { label:'所有人' , prop:'linkOwners',format:'userInfo', mandatory:true, message:'請選擇所有人',
            isSelect:false,isSort:false,type:'array',typemessage:'',isHidden:false},
            { label:'使用人' , prop:'linkUsers',format:'userInfo', mandatory:true, message:'請選擇使用人',
            isSelect:false,isSort:false,type:'array',typemessage:'',isHidden:false},
            { label:'檢附文件' , prop: 'file',format:'openfiles',isSelect:false,isSort:false,isHidden:false}, 
            { label:'備註' , prop:'note',format:'textarea',mandatory:false,isSelect:false,isSort:false,isHidden:true,maxlength:'200'},
        ]
    }
    static getTableConfig(){
        return [
             { label:'戶號' , prop:'houseNumber', mandatory:true, message:'請輸入戶號',isHidden:false,maxlength:'20',isSearch:false},
             { label:'場所名稱' , prop:'placeName', mandatory:true, message:'請輸入場所名稱',isHidden:false,maxlength:'100',isSearch:true},
             { label:'收容人數' , prop:'capacity',format:'inputnumber',type:'number',typemessage:'',mandatory:true,message:'請輸入收容人數',
             isHidden:false,isSearch:false},
             { label:'所有人' , prop:'linkOwners',format:'userInfo', mandatory:true, message:'請選擇所有人',
             type:'array',typemessage:'',isHidden:false,isSearch:false},
             { label:'使用人' , prop:'linkUsers',format:'userInfo', mandatory:true, message:'請選擇使用人',
             type:'array',typemessage:'',isHidden:false,isSearch:false},
             { label:'檢附文件' , prop: 'file',format:'openfiles',isHidden:true,isSearch:false}, 
             { label:'備註' , prop:'note',format:'textarea',mandatory:false,isHidden:false,maxlength:'200',isSearch:true},
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