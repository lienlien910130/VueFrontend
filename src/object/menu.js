import Parent from './parent'
import api from '@/api'
import AccessAuthority from './accessAuthority'
class Menu extends Parent {
    constructor (data) {
        super(data)
        const { name, description, status, sort, removable, code, linkMainMenus,
            linkAccessAuthorities } = data
        var mainMenu = linkMainMenus.map(item=>{ return new Menu(item)})
        var accessAuthority = linkAccessAuthorities.sort((x,y) => x.sort - y.sort).map(item=>{ return new AccessAuthority(item)})   
        this.name = name
        this.description = description
        this.status = status
        this.sort = sort
        this.removable = removable
        this.code = code
        this.linkMainMenus = mainMenu
        this.linkAccessAuthorities = accessAuthority
        return this
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
            var data = await api.authority.apiPostLevelOneMainMenuAuthority(this).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.authority.apiPostLevelTwoMainMenuAuthority(mainMenuId,this).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
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
            sort :'',
            removable :false,
            code :'',
            linkMainMenus :[],
            linkAccessAuthorities :[]
        })
    }
    static getConfig(){
        return [
            { label:'名稱' , prop:'name',format:'disableEdit', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false},
            { label:'Code' , prop:'code',format:'disableEdit', mandatory:true,message:'請輸入Code',maxlength:'40',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false, message:'請輸入描述',maxlength:'200',isHidden:true},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'排序' , prop:'sort',format:'number', 
            mandatory:true,message:'請輸入排序',isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:true,maxlength:'2'},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:true}
        ]
    }
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'name',format:'disableEdit', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false},
            { label:'Code' , prop:'code',format:'disableEdit', mandatory:true,message:'請輸入Code',maxlength:'40',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false, message:'請輸入描述',maxlength:'200',isHidden:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'排序' , prop:'sort',format:'number', 
            mandatory:true,message:'請輸入排序',isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:false,maxlength:'2'},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false}
        ]
    }
    static async get(){
        var data = await api.authority.apiGetBuildingMainMenuAuthority().then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort).map(item=>{ return new Menu(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    
}

export default Menu