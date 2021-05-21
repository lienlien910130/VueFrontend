import Parent from './parent'
import api from '@/api'
import AccessAuthority from './accessAuthority'

class Role extends Parent {
    constructor (data) {
        super(data)
        const { name,  description, status, sort, removable, linkAccessAuthorities } = data
        var accessAuthorities = linkAccessAuthorities.map(item=>{ return new AccessAuthority(item)})
        this.name = name
        this.description = description
        this.status = status
        this.sort = sort
        this.removable = removable
        this.linkAccessAuthorities = accessAuthorities
        return this
    }

    clone(data){
        return new Role(data)
    }
    async update(){
        var data = await api.authority.apiPatchRoleAuthority(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.authority.apiPostRoleAuthority(this).then(response => {
            return true
        }).catch(error=>{
            return false
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
    async getAccess(type){
        if(type == 'role'){
            var data = await api.authority.apiGetAccountAuthorityByRole(this.id).then(response => {
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
            sort :'',
            removable :false,
            linkAccessAuthorities :[]
        })
    }
    static getConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200',isHidden:true},
            { label:'排序' , prop:'sort',format:'number', mandatory:true, message:'請輸入排序',
            isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:true,maxlength:'2'},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:true}
        ]
    }
    static getTableConfig(){
        return [
            { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20',isHidden:false,isSearch:true},
            { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200',
            isHidden:false,isSearch:true},
            { label:'排序' , prop:'sort',format:'number', mandatory:true, message:'請輸入排序',
            isPattern:false,errorMsg:'',type:'string',typemessage:'',isHidden:false,maxlength:'2',isSearch:true},
            { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false,isSearch:false},
            { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
            isPattern:false,errorMsg:'',type:'boolean',typemessage:'',isHidden:false,isSearch:false}
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
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
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