import Parent from './parent'
import api from '@/api'
import AccessAuthority from './accessAuthority'

class Role extends Parent {
    constructor (data) {
        super(data)
        const { name,  description, status, sort, removable, linkAccessAuthorities } = data
        var accessAuthorities = linkAccessAuthorities !== undefined ? linkAccessAuthorities.map(item=>{ return new AccessAuthority(item)}) : []
        this.name = name
        this.description = description
        this.status = status
        this.sort = sort
        this.removable = removable
        this.linkAccessAuthorities = accessAuthorities
    }
    clone(data){
        return new Role(data)
    }
    async update(){
        var temp = JSON.parse(JSON.stringify(this))
        temp.name = '{Check}'+temp.name
        var data = await api.authority.apiPatchRoleAuthority(temp).then(async(response) => {
            return new Role(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async create(){
        var temp = JSON.parse(JSON.stringify(this))
        temp.name = '{Check}'+temp.name
        var data = await api.authority.apiPostRoleAuthority(temp).then(response => {
            return new Role(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async delete(){
        var data = await api.authority.apiDeleteRoleAuthority(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    //取得角色權限-角色&帳號
    async getAccess(type){
        if(type == 'role'){
            var data = await api.authority.apiGetAccountAuthorityByRole(this.id).then(response => {
                console.log(JSON.stringify(response))
                var array = []
                response.result.sort((x,y) => x.id - y.id).forEach(item=>{
                    array.push(item.id)
                })
                return array
            }).catch(error=>{
                return []
            })
            return data
        }else{
            var data = await api.authority.apiGetAccountAuthorityByAccount(this.id).then(response => {
                var array = []
                response.result.sort((x,y) => x.id - y.id).forEach(item=>{
                    array.push(item.id)
                })
                return array
            }).catch(error=>{
                return []
            })
            return data
        }
       
    }
    getName(){
        return this.name
    }
    static empty(){
        return new Role({
            id:'',
            name :'',
            description :'',
            status :true,
            sort :0,
            removable :false,
            linkAccessAuthorities :[]
        })
    }
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',
                isHidden:false,isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,
                maxlength:'200',isHidden:false,isSearch:true,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'排序' , prop:'sort',format:'inputnumber', mandatory:true, message:'請輸入0~999',
                pattern:/^[0-9]{1,3}$/,errorMsg:'請輸入0~999',isPattern:true,
                type:'number',typemessage:'',placeholder:'請輸入0~999',
                isHidden:false,maxlength:'3',isSearch:true,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            type:'boolean',typemessage:'',isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇是否允許刪除',
            type:'boolean',typemessage:'',isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false}
        ]
    }
    static async get(){
        var data = await api.authority.apiGetAllRole().then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Role(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.authority.apiGetRoleAuthoritySearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.sort - y.sort).map(item=>{ return new Role(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.authority.apiPostRoleAuthorities(data).then(response => {
            console.log(JSON.stringify(response))
            response.result = response.result.map(item=>{ return new Role(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    // static async getMainMenuAuthority(mainMenuId){
    //     var data = await api.authority.apiGetAccountAuthorityByMenu(mainMenuId).then(response => {
    //         console.log(JSON.stringify(response))
    //         return true
    //     }).catch(error=>{
    //         return false
    //     })
    //     return data
    // }
    static async updateAccessAuthority(data){
        var data = await api.authority.apiPutAuthorityByRole(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Role