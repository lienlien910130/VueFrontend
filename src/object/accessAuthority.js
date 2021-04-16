import Parent from './parent'
import api from '@/api'
import Menu from './menu'
import Role from './role'
class AccessAuthority extends Parent {
    constructor (data) {
        super(data)
        const { name, action, description, status, sort, removable, linkRoles,
            linkMainMenus } = data
        var mainMenu = linkMainMenus.map(item=>{ return new Menu(item)})
        var roles = linkRoles.map(item=>{ return new Role(item)})        
        this.name = name
        this.description = description
        this.status = status
        this.sort = sort
        this.removable = removable
        this.action = action
        this.linkMainMenus = mainMenu
        this.linkRoles = roles
        return this
    }

    clone(data){
        return new AccessAuthority(data)
    }
    async update(){
        var data = await api.authority.apiPatchAccessAuthority(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.authority.apiPostAccessAuthority(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.authority.apiDeleteAccessAuthority(this.id).then(async(response) => {
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
    setlinkMainMenus(linkMainMenus){
        this.linkMainMenus = linkMainMenus
    }
    static empty(){
        return new AccessAuthority({
            id:'',
            name :'',
            description :'',
            status :true,
            sort :'',
            removable :false,
            action :'',
            linkMainMenus :[],
            linkRoles :[]
        })
    }
    static getConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false},
            { label:'權限' , prop:'action', mandatory:true,format:'actionSelect',message:'請選擇權限',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false, message:'請輸入描述',maxlength:'200',isHidden:true},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'排序' , prop:'sort',format:'number', 
            mandatory:true,message:'請輸入排序',isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:true,maxlength:'2' },
            { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:true, message:'請選擇角色'
            ,isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false },
             { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:true},
        ]
    }
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false},
            { label:'權限' , prop:'action', mandatory:true,format:'actionSelect',message:'請選擇權限',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false, message:'請輸入描述',maxlength:'200',isHidden:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'排序' , prop:'sort',format:'number', 
            mandatory:true,message:'請輸入排序',isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:false,maxlength:'2' },
            { label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:true, message:'請選擇角色'
            ,isPattern:false,errorMsg:'',type:'array',typemessage:'',isHidden:false },
             { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
        ]
    }
}

export default AccessAuthority