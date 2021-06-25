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
        var temp = JSON.parse(JSON.stringify(this))
        temp.account = '{Check}'+temp.account
        var data = await api.authority.apiPutAccountAuthority(temp).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var temp = JSON.parse(JSON.stringify(this))
        temp.account = '{Check}'+temp.account
        var data = await api.authority.apiPostAccountAuthority(temp).then(response => {
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
    //查詢權限用
    getRoles(){
        return this.linkRoles
    }
    //表格&區塊顯示名稱用
    getRolesName(){
        return this.linkRoles.map(item => item.getName()).toString()
    }
    getBuildingsName(){
        return this.linkBuildings.map(item => item.getName()).toString()
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
    static getTableConfig(){
        return [
            { label:'帳號' , prop:'account', mandatory:true, message:'請輸入帳號',maxlength:'10',
                pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                errorMsg:'請輸入至少6個字元，含大小寫字母、至少1個數字',isPattern: true,
                isHidden:false,isSearch:true,placeholder:'請輸入至少6個字元，含大小寫字母、至少1個數字',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'密碼' , prop:'password', mandatory:true, message:'請輸入密碼',maxlength:'15',
                pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                errorMsg:'請輸入至少8個字元，含大小寫字母、至少1個數字',isPattern: true,
                isHidden:true,isSearch:true,placeholder:'請輸入至少8個字元，含大小寫字母、至少1個數字',
                isAssociate:false,isEdit:true,isUpload:true,isExport:false,isBlock:false},
            { label:'用戶名' , prop:'name', mandatory:true,message:'請輸入用戶名',maxlength:'20',
                isHidden:false,isSearch:true,isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,maxlength:'200'
                ,isHidden:false,isSearch:true,isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:false,
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
                type:'boolean',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇是否允許刪除',
                type:'boolean',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'大樓' , prop:'linkBuildings',format:'buildingSelect', mandatory:true, message:'請選擇建築物',
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true},
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