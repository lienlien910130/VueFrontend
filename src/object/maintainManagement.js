import api from '@/api'
import Parent from './parent' 
import moment from 'moment'
import Files  from './files'
import Device from './device'
import Contactunit from './contactunit'
import InspectionLacks from './inspectionLacks'

class MaintainManagementList extends Parent {
 
    constructor (data) {
        super(data)
        const { name, createdDate, completedCount, allCount  } = data
        this.name = name
        this.createdDate = createdDate
        this.completedCount = completedCount
        this.allCount = allCount
    }
    clone(data){
        return new MaintainManagementList(data)
    }
    getName(){
        return this.name
    }
    async update(){
        var data = await api.device.apiPatchMaintainsList(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.device.apiPostMaintainsList(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteMaintainsList(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetMaintainsListFiles(this.id).then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(data){
        var data = await api.files.apiPostMaintainsListFiles(this.id,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static empty(){
        return new MaintainManagementList({
            id:'',
            name:'',
            createdDate: moment().format('YYYY-MM-DD'),
            completedCount:0,
            allCount:0
        })
    }
    static getTableConfig(){
        return [
            {
                label: '名稱',
                prop: 'name',
                mandatory:true, message:'請輸入名稱',maxlength:'40',
                isHidden:false,isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '建立時間',
                prop: 'createdDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇建立時間',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '已保養細項',
                prop: 'completedCount',
                mandatory:false, isHidden:true,isSearch:false,type:'number',typemessage:'',
                isAssociate:false,isEdit:false,isUpload:false,isExport:true,isBlock:true
            },
            {
                label: '保養細項總數',
                prop: 'allCount',format:'openmaintain',
                mandatory:false, isHidden:true,isSearch:false,type:'number',typemessage:'',
                isAssociate:false,isEdit:false,isUpload:false,isExport:true,isBlock:true
            },
            //   {
            //     label: '已保養/未保養',
            //     prop: 'linkMaintains',
            //     format:'openmaintain',
            //     mandatory:false, type:'array',typemessage:'',
            //     isHidden:false,isSearch:false,
            //     isAssociate:false,isEdit:true,isUpload:false,isExport:false,isBlock:true
            //   }
        ]
    }
    static getCreateConfig(){
        return [
            {
                label: '名稱',
                prop: 'name',
                mandatory:true, message:'請輸入名稱',maxlength:'40',
                isHidden:false,isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '建立時間',
                prop: 'createdDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇建立時間',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            }
        ]
    }
    static async post(data){
        var data = await api.device.apiPostMaintainsList(data).then(response => {
            return response.result.id
        }).catch(error=>{
            return []
        })
        return data
    }
    static async get (){
        var data = await api.device.apiGetBuildingMaintainsList().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new MaintainManagementList(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getOfID (id){
        var data = await api.device.apiGetMaintainsList(id).then(response => {
            console.log('getOfID')
            console.log(JSON.stringify(response))
            return []
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.device.apiGetMaintainsListSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new MaintainManagementList(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    // static async postMany(data){
    //     var data = await api.device.apiPostMaintainsLists(data).then(response => {
    //         return true
    //     }).catch(error=>{
    //         return false
    //     })
    //     return data
    // }
    static async getAllLack(){
        var data = await api.device.apiGetInspectionListByMaintain().then(response => {
            return response.result.sort(function(x,y){
                var _data1 = new Date(x.label)
                var _data2 = new Date(y.label)
                return  _data2 - _data1
            })
        }).catch(error=>{
            return []
        })
        return data
    }
}

class MaintainManagement extends Parent {
    constructor (data) {
        super(data)
        const { dateOfFailure, dateOfCallRepair,completedTime,processStatus,processContent,note,
            linkDevices,linkInspectionLacks,linkContactUnits  } = data
        var devices = linkDevices !== undefined ?
        linkDevices.map(item=>{ return new Device(item) }) :[]
        var contactUnits = linkContactUnits !== undefined ?
        linkContactUnits.map(item=>{ return new Contactunit(item) }) : []
        var inspectionLacks = linkInspectionLacks !== undefined ?
        linkInspectionLacks.map(item=>{ return new InspectionLacks(item) }) : []
        this.dateOfFailure = dateOfFailure
        this.dateOfCallRepair = dateOfCallRepair
        this.completedTime = completedTime
        this.processStatus = processStatus
        this.processContent = processContent
        this.note = note
        this.linkDevices = devices
        this.linkInspectionLacks = inspectionLacks
        this.linkContactUnits = contactUnits
    }
    clone(data){
        return new MaintainManagement(data)
    }
    async update(){
        var data = await api.device.apiPatchMaintains(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(maintainListId){
        var data = await api.device.apiPostMaintain(maintainListId,this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteMaintains(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetMaintainsFiles(this.id).then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(data){
        var data = await api.files.apiPostMaintainsFiles(this.id,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getDateOfFailure(){
        return moment(this.dateOfFailure).format('YYYY-MM-DD')
    }
    getDevicesName(){
        return this.linkDevices.map(item => item.getName()).toString()
    }
    getInspectionLackName(){
        return this.linkInspectionLacks.map(item => item.getName()).toString()
    }
    getContactUnitsName(){
        return this.linkContactUnits.map(item => item.getName()).toString()
    }
    getProcessStatus(){
        return this.processStatus
    }
    // getInspectionLacks(){
    //     return this.linkInspectionLacks
    // }
    static empty(){
        return new MaintainManagement({
            id:'',
            dateOfFailure:null,
            dateOfCallRepair:null,
            completedTime :null,
            processStatus :'',
            processContent : '',
            note :'',
            linkDevices:[],
            linkInspectionLacks:[],
            linkContactUnits:[]
        })
    }
    static getTableConfig(){
        return [
            { label:'系統' , prop:'processContent',format:'MaintainContentOptions', 
            mandatory:true, message:'請選擇系統',
            isHidden:false,type:'string',typemessage:'',isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'故障日期' , prop:'dateOfFailure',format:'YYYY-MM-DD', 
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'叫修日期' , prop:'dateOfCallRepair',format:'YYYY-MM-DD',  
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'完成時間' , prop:'completedTime',format:'YYYY-MM-DD', 
            mandatory:false, 
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'處理進度' , prop:'processStatus',format:'MaintainProcessOptions', 
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'改善廠商' , prop:'linkContactUnits',format:'contactunitSelect', 
            mandatory:false,
            type:'array',typemessage:'',
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'檢修申報' , prop:'linkInspectionLacks',format:'inspectionSelect', 
            mandatory:false,
            type:'array',typemessage:'',
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'設備' , prop:'linkDevices',format:'deviceSelect', 
            mandatory:true,message:'請選擇設備',type:'array',typemessage:'',
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'備註' , prop:'note',format:'textarea', mandatory:false,
            maxlength:'200',isHidden:false,isSearch:true,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true}
        ]
    }
    static getDeviceOfMaintainTableConfig(){
        return [
            { label:'系統' , prop:'processContent',format:'MaintainContentOptions', 
            mandatory:true, message:'請選擇系統',
            isHidden:false,type:'string',typemessage:'',isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'故障日期' , prop:'dateOfFailure',format:'YYYY-MM-DD', 
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'叫修日期' , prop:'dateOfCallRepair',format:'YYYY-MM-DD',  
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'完成時間' , prop:'completedTime',format:'YYYY-MM-DD', 
            mandatory:false, 
            isHidden:false,isSearch:false,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
            { label:'處理進度' , prop:'processStatus',format:'MaintainProcessOptions', 
            mandatory:false,
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'改善廠商' , prop:'linkContactUnits',format:'contactunitSelect', 
            mandatory:false,
            type:'array',typemessage:'',
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'檢修申報' , prop:'linkInspectionLacks',format:'inspectionSelect', 
            mandatory:false,
            type:'array',typemessage:'',
            isHidden:false,isSearch:false,
            isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'備註' , prop:'note',format:'textarea', mandatory:false,
            maxlength:'200',isHidden:false,isSearch:true,
            isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true}
        ]
    }
    static async get (){
        var data = await api.device.apiGetMaintainAll().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new MaintainManagement(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getOfID (maintainId){
        var data = await api.device.apiGetMaintains(maintainId).then(response => {
            var array = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new MaintainManagement(item) })
            return array[0]
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getAllSearchPage (data){
        var data = await api.device.apiGetMaintainAllSearchPages(data).then(response => {
            response.result = response.result.map(item=>{ return new MaintainManagement(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(maintainListId,data){
        var data = await api.device.apiGetMaintainSearchPages(maintainListId,data).then(response => {
            response.result = response.result.map(item=>{ return new MaintainManagement(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(maintainListId,data){
        var data = await api.device.apiPostMaintains(maintainListId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export { MaintainManagementList,MaintainManagement }