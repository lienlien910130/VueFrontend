
import Parent from './parent'
import api from '@/api'
import { Account, Role } from '.'

class SampleNodeList extends Parent {
    constructor (data) {
        super(data)
        const { name, nodeId, nType, icon  } = data
        this.name = name 
        this.nodeId = nodeId
        this.nType = nType
        this.icon = icon
    }
    clone(data){
        return new SampleNodeList(data)
    }
    async update(){
        var temp = JSON.parse(JSON.stringify(this))
        temp.nType = '{Check}'+temp.nType
        var data = await api.nodeList.apiPatchSampleNode(temp).then(async(response) => {
            return new SampleNodeList(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async create(){
        var temp = JSON.parse(JSON.stringify(this))
        temp.nType = '{Check}'+temp.nType
        var data = await api.nodeList.apiPostSampleNode(temp).then(response => {
            return new SampleNodeList(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async delete(){
        var data = await api.nodeList.apiDeleteSampleNode(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.name
    }
    static empty(){
        return new SampleNodeList({
            id:'',
            name :'',
            nodeId:'',
            nType:'',
            icon:''
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
                label:'節點類型' , 
                prop:'nType',format:'nTypeChange',
                mandatory:true, message:'請輸入節點類型',
                isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入節點類型',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true 
            },
            { 
                label:'icon', 
                prop:'icon', 
                mandatory:false, message:'請輸入icon',
                isHidden:false,maxlength:'40',isSearch:true,placeholder:'請輸入icon',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true 
            }
       ]
    }
    // static async get (){
    //     var data = await api.nodeList.apiGetAllSampleNode().then(response => {
    //         var array = response.result.sort((x,y) => x.id - y.id)
    //         .map(item=>{ return new SelfDefenseFireMarshalling(item) })
    //         return array
    //     }).catch(error=>{
    //         return []
    //     })
    //     return data
    // }
    static async getSearchPage(data){
        var data = await api.nodeList.apiGetSampleNodeSearchPages(data).then(response => {
            response.result = response.result.map(item=>{ return new SampleNodeList(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.nodeList.apiPostSampleNodes(data).then(response => {
            response.result = response.result.map(item=>{ return new SampleNodeList(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
}
//節點
class CNode extends Parent {
    constructor (data) {
        super(data)
        const { name, nodeId, nType, icon, message, state, nextCpId,
            linkRoles, linkAccountList, linkCOptions  } = data
        var roles = linkRoles !== undefined ? linkRoles.map(item=>{ return new Role(item)}) : []
        var accounts = linkAccountList !== undefined ? linkAccountList.map(item=>{ return new Account(item)}) : []
        var options = linkCOptions !== undefined ? linkCOptions.map(item=>{ return new COption(item)}) : []
        this.name = name 
        this.nodeId = nodeId
        this.nType = nType
        this.icon = icon
        this.message = message
        this.state = state
        this.nextCpId = nextCpId
        this.linkRoles = roles
        this.linkAccountList = accounts
        this.linkCOptions = options
    }
    clone(data){
        return new CNode(data)
    }
    // async update(processId){
    //     var data = await api.nodeList.apiPatchNode(processId,this).then(async(response) => {
    //         return new CNode(response.result)
    //     }).catch(error=>{
    //         return {}
    //     })
    //     return data
    // }
    // async create(processId){
    //     var data = await api.nodeList.apiPostNode(processId,this).then(response => {
    //         return new CNode(response.result)
    //     }).catch(error=>{
    //         return {}
    //     })
    //     return data
    // }
    // async delete(){
    //     var data = await api.nodeList.apiDeleteNode(this.id).then(async(response) => {
    //         return true
    //     }).catch(error=>{
    //         return false
    //     })
    //     return data
    // }
    getName(){
        return this.name
    }
    // static empty(){
    //     return new CNode({
    //         id:'',
    //         name :'',
    //         nodeId:'',
    //         nType:'',
    //         icon:'',
    //         message:'',
    //         state:'',
    //         nextCpId:'',
    //         linkRoles:[],
    //         linkAccountList:[],
    //         linkCOptions:[]
    //     })
    // }
    static async get (processId){
        var data = await api.nodeList.apiGetAllNode(processId).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new CNode(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async deleteMany (arrayId){
        var data = await api.nodeList.apiDeleteNode(arrayId).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async postMany(processId,data){
        var data = await api.nodeList.apiPostNodes(processId,data).then(response => {
            response.result = response.result.map(item=>{ return new CNode(item)})
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}
//關聯線
class COption extends Parent {
    constructor (data) {
        super(data)
        const { name, lastNodeId, nextNodeId, optionId } = data
        this.name = name 
        this.lastNodeId = lastNodeId
        this.nextNodeId = nextNodeId
        this.optionId = optionId
    }
    clone(data){
        return new COption(data)
    }
    // async update(nodeId){
    //     var data = await api.nodeList.apiPatchOption(nodeId,this).then(async(response) => {
    //         return new COption(response.result)
    //     }).catch(error=>{
    //         return {}
    //     })
    //     return data
    // }
    // async create(nodeId){
    //     var data = await api.nodeList.apiPostOption(nodeId,this).then(response => {
    //         return new COption(response.result)
    //     }).catch(error=>{
    //         return {}
    //     })
    //     return data
    // }
    // async delete(){
    //     var data = await api.nodeList.apiDeleteOption(this.id).then(async(response) => {
    //         return true
    //     }).catch(error=>{
    //         return false
    //     })
    //     return data
    // }
    getName(){
        return this.name
    }
    // static empty(){
    //     return new COption({
    //         id:'',
    //         name :'',
    //         lastNodeId:'',
    //         nextNodeId:'',
    //         optionId:''
    //     })
    // }
    static async get (nodeId){
        var data = await api.nodeList.apiGetAllOptions(nodeId).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new COption(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getOfProcess (processId){
        var data = await api.nodeList.apiGetAllOptionsOfProcess(processId).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new COption(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async deleteMany (arrayId){
        var data = await api.nodeList.apiDeleteOption(arrayId).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async postMany(processId,data){
        var data = await api.nodeList.apiPostOptions(processId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}
export { SampleNodeList, CNode, COption }