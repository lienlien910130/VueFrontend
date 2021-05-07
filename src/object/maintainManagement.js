import api from '@/api'
import Parent from './parent' 
import { formatTime } from '@/utils'
import Files  from './files'
import Device from './device'
import Contactunit from './contactunit'
import InspectionLacks from './inspectionLacks'

class MaintainManagementList extends Parent {
 
    constructor (data) {
        super(data)
        const { name, createdDate, linkMaintains  } = data
        var array = linkMaintains.map(item=>{ return new MaintainManagement(item) })
        this.name = name
        this.createdDate = createdDate
        this.linkMaintains = array
        return this
    }
    clone(data){
        return new MaintainManagementList(data)
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
        console.log(JSON.stringify(this))
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
            createdDate: formatTime(new Date(), '{y}-{m}-{d}'),
            linkMaintains:[]
        })
    }
    static getConfig(){
        return [
            {
                label: '名稱',
                prop: 'name',
                mandatory:true, message:'請輸入名稱',isSelect:false,isSort:true,maxlength:'40',isHidden:false
            },
              {
                label: '建立時間',
                prop: 'createdDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇建立時間',isSelect:true,options:[],
                        selectType:'dateOfDate',select:'',isSort:true,isHidden:false
              },
              {
                label: '細項',
                prop: 'linkMaintains',
                format:'openmaintain',
                mandatory:false, message:'請選擇',isSelect:false,isSort:false,type:'array',typemessage:'',isHidden:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false,isHidden:false
              }
        ]
    }
    static getCreateConfig(){
        return [{
                        label: '名稱',
                        prop: 'name',
                        mandatory:true, message:'請輸入名稱',isSelect:false,isSort:true,maxlength:'40'
                    },
                    {
                        label: '建立時間',
                        prop: 'createdDate',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請選擇建立時間',isSelect:true,options:[],
                                selectType:'dateOfDate',select:'',isSort:true
            }]
    }
    static async get (){
        var data = await api.device.apiGetBuildingMaintainsList().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new MaintainManagementList(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getAllLack(){
        var data = await api.device.apiGetInspectionListByMaintain().then(response => {
            console.log(JSON.stringify(response.result))
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
        var devices = linkDevices.map(item=>{ return new Device(item) })
        var contactUnits = linkContactUnits.map(item=>{ return new Contactunit(item) })
        var inspectionLacks = linkInspectionLacks.map(item=>{ return new InspectionLacks(item) })
        this.dateOfFailure = dateOfFailure
        this.dateOfCallRepair = dateOfCallRepair
        this.completedTime = completedTime
        this.processStatus = processStatus
        this.processContent = processContent
        this.note = note
        this.linkDevices = devices
        this.linkInspectionLacks = inspectionLacks
        this.linkContactUnits = contactUnits
        return this
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
        var data = await api.device.apiPostMaintains(maintainListId,this).then(response => {
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
    getProcess(){
        return this.processStatus
    }
    getInspectionLacks(){
        return this.linkInspectionLacks
    }
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
    static getConfig(){
        return [
            { label:'系統' , prop:'processContent',format:'MaintainContentOptions', mandatory:true, message:'請選擇系統',
            isSelect:true,options:[],selectType:'options',select:'',isHidden:false,type:'string',typemessage:''},
            { label:'故障日期' , prop:'dateOfFailure',format:'YYYY-MM-DD', mandatory:false, message:'請選擇故障日期',isSelect:false,isHidden:false},
            { label:'叫修日期' , prop:'dateOfCallRepair',format:'YYYY-MM-DD',  mandatory:false,message:'請選擇叫修日期',
            isSelect:true,options:[],selectType:'dateOfDate',select:'',isHidden:false},
            { label:'完成時間' , prop:'completedTime',format:'YYYY-MM-DD', mandatory:false, message:'請選擇完成時間',isSelect:false,isHidden:false},
            { label:'處理進度' , prop:'processStatus',format:'MaintainProcessOptions', mandatory:false, message:'請選擇處理進度',
            isSelect:true,options:[],selectType:'options',select:'',isHidden:false},
            { label:'改善廠商' , prop:'linkContactUnits',format:'contactunitSelect', mandatory:false,message:'請選擇廠商',
            type:'array',typemessage:'',isSelect:true,options:[],selectType:'contactunit',select:'',isHidden:false},
            { label:'檢修申報' , prop:'linkInspectionLacks',format:'inspectionSelect', mandatory:false,message:'請選擇申報',
            type:'array',typemessage:'',isSelect:false,isHidden:false},
            { label:'設備' , prop:'linkDevices',format:'deviceSelect', mandatory:true,message:'請選擇設備',type:'array',typemessage:'',isSelect:false,isHidden:false},
            { label:'備註' , prop:'note',format:'textarea', mandatory:false,message:'請輸入備註',maxlength:'200',isSelect:false,isHidden:false},
        ]
    }
}

export { MaintainManagementList,MaintainManagement }