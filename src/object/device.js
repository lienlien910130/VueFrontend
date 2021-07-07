import Parent from './parent'
import DeviceType from './deviceType'
import api from '@/api'
import Contactunit from './contactunit'
import Floors from './floors'
import moment from 'moment'
import { MaintainManagement } from '@/object/maintainManagement'


class Device extends Parent {
 
    constructor (data) {
        super(data)
        const { name,dateOfPurchase, dateOfWarranty, location,groupID, 
            status,lastMaintainTime,nextMaintainTime,
            linkKeeperUnits,linkMaintainVendors, linkFloors, linkDeviceTypes, linkDevices } = data
        var deviceType = linkDeviceTypes !== undefined ?
         linkDeviceTypes.map(item=>{ return new DeviceType(item) }) : []
        var keeperUnits = linkKeeperUnits !== undefined ?
         linkKeeperUnits.map(item=>{ return new Contactunit(item) }) : []
        var maintainVendors = linkMaintainVendors !== undefined ?
         linkMaintainVendors.map(item=>{ return new Contactunit(item) }) : []
        var floors = linkFloors !== undefined ?
         linkFloors.map(item=>{ return new Floors(item) }) :[]
        var devices = linkDevices !== undefined ?
         linkDevices.map(item=>{ return new Device(item) }) :[]
        this.name = name
        this.dateOfPurchase = dateOfPurchase
        this.dateOfWarranty = dateOfWarranty
        this.location = location
        this.groupID = groupID
        this.status = status
        this.lastMaintainTime = lastMaintainTime
        this.nextMaintainTime = nextMaintainTime
        this.linkKeeperUnits = keeperUnits
        this.linkMaintainVendors = maintainVendors
        this.linkFloors = floors
        this.linkDeviceTypes = deviceType
        this.linkDevices = devices
        return this
    }
    clone(data){
        return new Device(data)
    }
    async update(){
        var data = await api.device.apiPatchDevicesManagement(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.device.apiPostDevicesManagement(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteDevicesManagement(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getMaintain(data){
        data.id = this.id
        var data = await api.device.apiGetDevicesManagementMaintain(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new MaintainManagement(item) })
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    getOnlyName(){ //設備名稱
        return this.name
    }
    getOnlyTypeName(){ //設備種類名稱
        return this.linkDeviceTypes.length !== 0 ? this.linkDeviceTypes[0].getName() : '尚未設定種類'
    }
    getType(){ //設備種類
        return this.linkDeviceTypes.length !== 0 ? this.linkDeviceTypes[0].getType() : ''
    }
    getDateOfPurchase(){
        return moment(this.dateOfPurchase).format('YYYY-MM-DD')
    }
    getDateOfWarranty(){
        return moment(this.dateOfWarranty).format('YYYY-MM-DD')
    }
    //首頁tree使用
    getKeeperUnitsName(){
        return this.linkKeeperUnits.map(item=>{return item.getName()}).toString()
    }
    getMaintainVendorsName(){
        return this.linkMaintainVendors.map(item=>{return item.getName()}).toString()
    }
    getDevicesName(){
        return this.linkDevices.map(item => item.getName()).toString()
    }
    getLinkType(){
        return this.linkDeviceTypes.length !== 0 ? this.linkDeviceTypes[0] : DeviceType.empty()
    }
    getName(){ //組合過的名稱：設備種類名稱+設備名稱
        var name = this.linkDeviceTypes.length !== 0 ? 
        '【'+this.linkDeviceTypes[0].getName()+'】'+this.name :  '【尚未設定設備種類】'+this.name
        return name
    }
    static empty(){
        return new Device({
            id:'',
            name:'',
            dateOfPurchase : null,
            dateOfWarranty : null,
            location :'',
            lastMaintainTime:null,
            nextMaintainTime:null,
            linkKeeperUnits : [],
            linkMaintainVendors :[],
            linkFloors :[],
            linkDeviceTypes: [],
            linkDevices:[]
        })
    }
    static getTableConfig(){
        return [
             {
                 label: '名稱',
                 prop: 'name',
                 mandatory:true, message:'請輸入名稱',isHidden:false,maxlength:'20',
                 isSearch:true,placeholder:'請輸入名稱',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '種類',
                 prop: 'linkDeviceTypes',
                 format:'deviceTypeSelect',
                 mandatory:true, message:'請選擇種類',isHidden:false,
                 type:'array',typemessage:'',isSearch:false,
                 isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
             },
             {
                 label: '購買日期',
                 prop: 'dateOfPurchase',
                 format:'YYYY-MM-DD',
                 mandatory:false,
                 isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '保固日期',
                 prop: 'dateOfWarranty',
                 format:'YYYY-MM-DD',
                 mandatory:false, message:'請輸入保固日期',
                 isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '位置設置',
                 prop: 'location',
                 mandatory:false, 
                 isHidden:false,maxlength:'20',isSearch:true,placeholder:'請輸入位置設置',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false
             },
             {
                 label: '分類群組',
                 prop: 'groupID',
                 mandatory:false, 
                 isHidden:false,maxlength:'10',isSearch:true,placeholder:'請輸入分類群組',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false
             },
             {
                 label: '保管單位',
                 prop: 'linkKeeperUnits',
                 format:'contactunitSelect',
                 mandatory:true,trigger: 'change', message:'請選擇保管單位',type:'array',typemessage:'',
                 isHidden:false,isSearch:false,
                 isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
             },
             {
                 label: '維護廠商',
                 prop: 'linkMaintainVendors',
                 format:'contactunitSelect',
                 mandatory:true,trigger: 'change', message:'請選擇維護廠商',type:'array',typemessage:'',
                 isHidden:false,isSearch:false,
                 isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            { 
                label:'設備' , 
                prop:'linkDevices',
                format:'deviceSelect', 
                mandatory:false,message:'請選擇設備',type:'array',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            {
                 label: '設備狀況',
                 prop: 'status',
                 format:'MaintainProcessOptions',
                 mandatory:true, message:'請選擇設備狀況',
                 isHidden:false,isSearch:false,
                 isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
             },
             {
                label: '下次保養時間',
                prop: 'nextMaintainTime',
                format:'YYYY-MM-DD',
                mandatory:false, message:'請輸入保養時間',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '最後保養時間',
                prop: 'lastMaintainTime',
                format:'YYYY-MM-DD',
                mandatory:false,
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            }
         ]
    }
    static getAddressConfig(){
        return [
            { label:'名稱',prop: 'name',mandatory:true, message:'請輸入名稱',isHidden:false,maxlength:'20'},
            { label:'種類' , prop:'linkDeviceTypes',format:'deviceTypeSelect', mandatory:false,
            message:'請輸入描述',maxlength:'200',isHidden:false},
            { label:'設備狀況',prop: 'status',format:'DeviceStatusOptions',mandatory:true, 
            message:'請選擇設備狀況',isHidden:false},
            { label:'系統' , prop:'systemNumber',format:'address', mandatory:true, message:'請輸入系統編號',
            isPattern:false,errorMsg:'',maxlength:'2',isHidden:false},
            { label:'迴路' , prop:'circuitNumber',format:'address', mandatory:true, message:'請輸入迴路編號',
            isPattern:false,errorMsg:'',maxlength:'3',isHidden:false},
            { label:'點位' , prop:'address',format:'address', mandatory:true, message:'請輸入點位',
            isPattern:false,errorMsg:'',maxlength:'5',isHidden:false}
        ]
    }
    static async get (){
        var data = await api.device.apiGetBuildingDevicesManagement().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Device(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.device.apiGetDevicesManagementSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new Device(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.device.apiPostDevicesManagements(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async updateAddress(data){
        var data = await api.device.apiPatchDevicesAddress(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async updatefromGraphic(data){
        var data = await api.device.apiPatchGraphicDevices(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }

}

export default Device