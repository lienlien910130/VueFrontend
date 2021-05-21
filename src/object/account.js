import Parent from './parent'
import api from '@/api'
import Role from './role'
import Building from './building'

class Account extends Parent {
    constructor (data) {
        super(data)
        const { account,  password, name, description, status, removable,linkRoles,linkBuildings } = data
        var roles = linkRoles.map(item=>{ return new Role(item)})
        var buildings = linkBuildings.map(item=>{ return new Building(item)})
        this.account = account
        this.password = password
        this.name = name
        this.description = description
        this.status = status
        this.removable = removable
        this.linkRoles = roles
        this.linkBuildings = buildings
        return this
    }

    clone(data){
        return new Account(data)
    }
    async update(){
        var data = await api.authority.apiPatchAccountAuthority(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.authority.apiPostAccountAuthority(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.authority.apiDeleteAccountAuthority(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.name
    }
    getRoles(){
        return this.linkRoles
    }
    static empty(){
        return new Account({
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
    static getConfig(){
        return [
            { label:'帳號' , prop:'account', mandatory:true, message:'請輸入帳號',maxlength:'10',
            pattern:/[\w]{6,10}$/,errorMsg:'請輸入至少6位數',isPattern: true,isHidden:false},
            { label:'密碼' , prop:'password', mandatory:true, message:'請輸入密碼',maxlength:'15',
            pattern:/[\w]{6,10}$/,errorMsg:'請輸入至少6位數',isPattern: true,isHidden:true},
            { label:'用戶名' , prop:'name', mandatory:true,message:'請輸入用戶名',maxlength:'20',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200',isHidden:true},
            { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:false,message:'請選擇角色',
            isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:true},
            { label:'大樓' , prop:'linkBuildings',format:'buildingSelect', mandatory:true, message:'請選擇建築物',
            isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false},
        ]
    }
    static getTableConfig(){
        return [
            { label:'帳號' , prop:'account', mandatory:true, message:'請輸入帳號',maxlength:'10',
            pattern:/[\w]{6,10}$/,errorMsg:'請輸入6~10位數英文+數字',isPattern: true,isHidden:false,isSearch:true},
            { label:'密碼' , prop:'password', mandatory:true, message:'請輸入密碼',maxlength:'15',
            pattern:/[\w]{7,15}$/,errorMsg:'請輸入7~15位數英文+數字',isPattern: true,isHidden:false,isSearch:true},
            { label:'用戶名' , prop:'name', mandatory:true,message:'請輸入用戶名',maxlength:'20',isHidden:false,isSearch:true},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200',isHidden:false,isSearch:true},
            { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:false,message:'請選擇角色',
            isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false,isSearch:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false,isSearch:false},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false,isSearch:false},
            { label:'大樓' , prop:'linkBuildings',format:'buildingSelect', mandatory:true, message:'請選擇建築物',
            isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false,isSearch:false},
        ]
    }
    static async get(){
        var data = await api.authority.apiGetAllAccountAuthority().then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Account(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.authority.apiGetAccountAuthoritySearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Account(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.authority.apiPostAccountAuthorities(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Account