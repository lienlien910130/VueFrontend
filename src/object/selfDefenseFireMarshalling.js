import Parent from './parent'
import api from '@/api'
import Account from './account'
import Role from './role'
import { Floors, SampleNodeList } from '.'

//大項
class SelfDefenseFireMarshalling extends Parent {
    constructor (data) {
        super(data)
        const { name  } = data
        this.name = name 
    }
    clone(data){
        return new SelfDefenseFireMarshalling(data)
    }
    async update(){
        var data = await api.selfDefenseFireMarshalling.apiPatchFireMarshalling(this).then(async(response) => {
            return new SelfDefenseFireMarshalling(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async create(){
        var data = await api.selfDefenseFireMarshalling.apiPostFireMarshalling(this).then(response => {
            return new SelfDefenseFireMarshalling(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async delete(){
        var data = await api.selfDefenseFireMarshalling.apiDeleteFireMarshalling(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getMarshallingMgmt(){
        var data = await api.selfDefenseFireMarshalling.apiGetFireMarshallingMgmt(this.id).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new SelfDefenseFireMarshallingMgmt(item) })
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    }
    async patchFloor(){
        await api.selfDefenseFireMarshalling.apiPatchFloorFromMgmt(this.id)
    }
    getName(){
        return this.name
    }
    static empty(){
        return new SelfDefenseFireMarshalling({
            id:'',
            name :''
        })
    }
    static getTableConfig(){
        return [
            { 
                label:'名稱' , 
                prop:'name', 
                mandatory:true, message:'請輸入名稱',
                isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true 
            }
       ]
    }
    static async get (){
        var data = await api.selfDefenseFireMarshalling.apiGetAllFireMarshalling().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new SelfDefenseFireMarshalling(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.selfDefenseFireMarshalling.apiGetFireMarshallingSearchPages(data).then(response => {
            response.result = response.result.map(item=>{ return new SelfDefenseFireMarshalling(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getAccountByRole(roleId){
        var data = await api.selfDefenseFireMarshalling.apiGetAccountByRole(roleId).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new Account(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getProcess(fid){
        var data = await api.selfDefenseFireMarshalling.apiGetAllProcess(fid).then(async(response) => {
            console.log(JSON.stringify(response))
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new ContingencyProcess(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getOfIDMarshallingMgmt(id){ //功能同getMarshallingMgmt，開給process使用
        var data = await api.selfDefenseFireMarshalling.apiGetFireMarshallingMgmt(id).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new SelfDefenseFireMarshallingMgmt(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSampleNode(){
        var data = await api.selfDefenseFireMarshalling.apiGetAllOfMarshallingSampleNode().then(async(response) => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new SampleNodeList(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
}
//細項
class SelfDefenseFireMarshallingMgmt extends Parent {
    constructor (data) {
        super(data)
        const { name, linkRoles, linkAccountList, linkContingencyProcess, linkFloors  } = data
        var roles = linkRoles !== undefined ?  linkRoles.map(item=>{ return new Role(item)}) : []
        var account = linkAccountList !== undefined ?  linkAccountList.map(item=>{ return new Account(item)}) : []
        var process = linkContingencyProcess !== undefined ?  linkContingencyProcess.map(item=>{ return new ContingencyProcess(item)}) : []
        var floor = linkFloors !== undefined ? linkFloors.map(item=>{ return new Floors(item)}) : new Array([]).map(item=>{ return new Floors(item)}) 
        this.name = name 
        this.linkRoles = roles
        this.linkAccountList = account
        this.linkFloors = floor
        this.linkContingencyProcess = process
    }
    clone(data){
        return new SelfDefenseFireMarshallingMgmt(data)
    }
    async update(selfDefenseFireMarshallingId){
        var temp = JSON.parse(JSON.stringify(this))
        temp.name = '{Check}'+temp.name
        var data = await api.selfDefenseFireMarshalling.apiPutFireMarshallingMgmt(selfDefenseFireMarshallingId,temp).then(async(response) => {
            return new SelfDefenseFireMarshallingMgmt(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async create(selfDefenseFireMarshallingId){
        var temp = JSON.parse(JSON.stringify(this))
        temp.name = '{Check}'+temp.name
        var data = await api.selfDefenseFireMarshalling.apiPostFireMarshallingMgmt(selfDefenseFireMarshallingId,temp).then(response => {
            return new SelfDefenseFireMarshallingMgmt(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async delete(){
        var data = await api.selfDefenseFireMarshalling.apiDeleteFireMarshallingMgmt(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.name
    }
    getLinkRole(){
        return this.linkRoles
    }
    getRolesName(){
        return this.linkRoles.map(item => item.getName()).toString()
    }
    getAccountName(){
        return this.linkAccountList.map(item => item.getName()).toString()
    }
    getProcessName(){
        return this.linkContingencyProcess.map(item => item.getName()).toString()
    }
    // getDefaultProcessName(){
    //     var name = this.defaultContingencyProcessId !== null && this.linkContingencyProcess.length !== 0  ? 
    //     this.linkContingencyProcess.filter(item=>{ return item.id == this.defaultContingencyProcessId})[0].name : ''
    //     return name 
    // }
    static empty(){
        return new SelfDefenseFireMarshallingMgmt({
            id:'',
            name :'',
            linkRoles:[],
            linkAccountList:[],
            linkFloors:[],
            linkContingencyProcess:[]
        })
    }
    static getTableConfig(){
        return [
            { 
                label:'名稱' , 
                prop:'name', 
                mandatory:true, message:'請輸入名稱',
                isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true 
            },
            { 
                label:'樓層' , prop:'linkFloors',format:'manyFloorSelect', mandatory:true,
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            // { 
            //     label:'預設流程圖', 
            //     prop:'defaultContingencyProcessId', 
            //     format:'contingencyProcessSelect',
            //     mandatory:false, message:'請選擇流程圖',
            //     isHidden:false,isSearch:false,
            //     isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true 
            // },
            { 
                label:'角色' , prop:'linkRoles',format:'roleSelect', mandatory:true,
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            { 
                label:'帳號' , prop:'linkAccountList',format:'accountSelect', mandatory:false,
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            { 
                label:'流程圖名稱' , prop:'linkContingencyProcess',format:'processList', 
                mandatory:false,
                type:'array',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:false,isUpload:false,isExport:true,isBlock:true
            }
       ]
    }
    static async get(selfDefenseFireMarshallingId){
        var data = await api.selfDefenseFireMarshalling.apiGetFireMarshallingMgmtSearchPages(selfDefenseFireMarshallingId,data).then(response => {
            response.result = response.result.map(item=>{ return new SelfDefenseFireMarshallingMgmt(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(selfDefenseFireMarshallingId,data){
        var data = await api.selfDefenseFireMarshalling.apiGetFireMarshallingMgmtSearchPages(selfDefenseFireMarshallingId,data).then(response => {
            console.log('getSearchPage',response)
            response.result = response.result.map(item=>{ return new SelfDefenseFireMarshallingMgmt(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(selfDefenseFireMarshallingId,data){
        var data = await api.selfDefenseFireMarshalling.apiPostFireMarshallingMgmts(selfDefenseFireMarshallingId,data).then(response => {
            response.result = response.result.map(item=>{ return new SelfDefenseFireMarshallingMgmt(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
}

//細項內的流程圖
class ContingencyProcess extends Parent {
    constructor (data) {
        super(data)
        const { name  } = data
        this.name = name 
    }
    clone(data){
        return new ContingencyProcess(data)
    }
    getName(){
        return this.name
    }
    static empty(){
        return new ContingencyProcess({
            id:'',
            name :''
        })
    }
    static getTableConfig(){
        return [
            { 
                label:'選擇班別' , prop:'selfDefenseFireMarshallingMgmt',format:'marshallingMgmtSelect',
                mandatory:true, message:'請選擇班別',
                isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            { 
                label:'流程圖名稱' , 
                prop:'name', 
                mandatory:true, message:'請輸入名稱',
                isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true 
            }
       ]
    }
    static async create(data){
        var mgmtId = data.selfDefenseFireMarshallingMgmt
        // var temp = JSON.parse(JSON.stringify(data))
        // temp.name = '{Check}'+temp.name 
        var data = await api.selfDefenseFireMarshalling.apiPostContingencyProcess(mgmtId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async update(data){
        // var temp = JSON.parse(JSON.stringify(data))
        // temp.name = '{Check}'+temp.name 
        var data = await api.selfDefenseFireMarshalling.apiPatchContingencyProcess(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async delete(id){
        var data = await api.selfDefenseFireMarshalling.apiDeleteContingencyProcess(id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async get(mgmtId){
        var data = await api.selfDefenseFireMarshalling.apiGetContingencyProcess(mgmtId).then(response => {
            response.result = response.result.map(item=>{ return new ContingencyProcess(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async saveJson(pid, data){
        var data = await api.selfDefenseFireMarshalling.apiPostContingencyProcessJson(pid,data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async getJson(pid){
        var data = await api.selfDefenseFireMarshalling.apiGetContingencyProcessJson(pid).then(async(response) => {
            return response.result
        }).catch(error=>{
            return false
        })
        return data
    }
}

export { SelfDefenseFireMarshalling, SelfDefenseFireMarshallingMgmt, ContingencyProcess }