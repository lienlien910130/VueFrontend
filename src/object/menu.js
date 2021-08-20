import Parent from './parent'
import api from '@/api'
import AccessAuthority from './accessAuthority'
class Menu extends Parent {
    constructor (data) {
        super(data)
        const { name, description, status, sort, removable, code, path, redirect, icon,
            linkMainMenus,linkAccessAuthorities } = data
        var mainMenu =  linkMainMenus !== undefined ? linkMainMenus.map(item=>{ return new Menu(item)}) : []
        var accessAuthority = linkAccessAuthorities !== undefined ?  linkAccessAuthorities.sort((x,y) => x.sort - y.sort)
                .map(item=>{ return new AccessAuthority(item)})  : []
        this.name = name
        this.description = description
        this.status = status
        this.sort = sort
        this.removable = removable
        this.code = code
        this.path = path
        this.redirect = redirect
        this.icon = icon
        this.linkMainMenus = mainMenu
        this.linkAccessAuthorities = accessAuthority
    }

    clone(data){
        return new Menu(data)
    }
    async getBelow(){
        var data = await api.authority.apiGetMainMenuAuthority(this.id).then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort).map(item=>{ return new Menu(item) })
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async update(){
        var data = await api.authority.apiPatchMainMenuAuthority(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(mainMenuId = null){
        if(mainMenuId == null){
            var data = await api.authority.apiPostMainMenu(this).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.authority.apiPostSubMainMenu(mainMenuId,this).then(response => {
                console.log(JSON.stringify(response))
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
        
        // if(mainMenuId == null){
        //     var data = await api.authority.apiPostLevelOneMainMenuAuthority(this).then(response => {
        //         return true
        //     }).catch(error=>{
        //         return false
        //     })
        //     return data
        // }else{
        //     var data = await api.authority.apiPostLevelTwoMainMenuAuthority(mainMenuId,this).then(response => {
        //         return true
        //     }).catch(error=>{
        //         return false
        //     })
        //     return data
        // }
    }
    async delete(){
        var data = await api.authority.apiDeleteMainMenuAuthority(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.name
    }
    getLink(){
        return this.linkMainMenus
    }
    getAccessAuthorities(){
        return this.linkAccessAuthorities
    }
    static empty(){
        return new Menu({
            id:'',
            name :'',
            description :'',
            status :true,
            sort :0,
            removable :false,
            code :'',
            path:'',
            redirect:'',
            icon:'',
            linkMainMenus :[],
            linkAccessAuthorities :[]
        })
    }
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',
            isHidden:false,placeholder:'請輸入名稱',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'Code' , prop:'code', mandatory:true,message:'請輸入Code',maxlength:'40',
            isHidden:true,placeholder:'請輸入Code',
            isAssociate:false,isEdit:true,isUpload:true,isExport:false,isBlock:false},
            { label:'路徑' , prop:'path', mandatory:true,message:'請輸入路徑',maxlength:'40',
            isHidden:false,placeholder:'請輸入路徑',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'導向' , prop:'redirect', mandatory:false,
            maxlength:'40',isHidden:true,placeholder:'請輸入導向，若為子目錄，請勿輸入值',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'圖示' , prop:'icon', mandatory:false,
            maxlength:'40',isHidden:false,placeholder:'請輸入圖示名稱',
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false, 
            maxlength:'200',isHidden:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', 
            mandatory:true, message:'請選擇狀態',
            type:'boolean',typemessage:'',isHidden:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'排序' , prop:'sort',format:'inputnumber', mandatory:true, message:'請輸入0~999',
                pattern:/^[0-9]{1,3}$/,errorMsg:'請輸入0~999',isPattern:true,
                type:'number',typemessage:'',placeholder:'請輸入0~999',
                isHidden:false,maxlength:'3',isSearch:true,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'刪除' , prop:'removable',format:'removableSelect', 
                mandatory:true, message:'請選擇是否允許刪除',
               type:'boolean',typemessage:'',
               isHidden:false,isSearch:false,
               isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
        ]
    }
    static async get(){
        var data = await api.authority.apiGetBuildingMainMenuAuthority().then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort).map(item=>{ 
                return new Menu(item)})
            result.forEach(element => {
                element.getLink().sort((x,y) => x.sort - y.sort)
            })
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(mainMenuId,data){
        var data = await api.authority.apiPostMainMenus(mainMenuId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Menu