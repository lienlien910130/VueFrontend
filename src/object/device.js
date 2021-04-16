import Parent from './parent'
import DeviceType from './deviceType'
import api from '@/api'
import Contactunit from './contactunit'

class Device extends Parent {
 
    constructor (data) {
        super(data)
        const { name,dateOfPurchase, dateOfWarranty, location,groupID, systemNumber, circuitNumber, address,
            systemUsed,linkKeeperUnits,linkMaintainVendors, linkFloors, linkDeviceTypes, status  } = data
        
        var deviceType = linkDeviceTypes.map(item=>{ return new DeviceType(item) })
        var keeperUnits = linkKeeperUnits.map(item=>{ return new Contactunit(item) }) 
        var maintainVendors = linkMaintainVendors.map(item=>{ return new Contactunit(item) }) 
        this.name = name
        this.dateOfPurchase = dateOfPurchase
        this.dateOfWarranty = dateOfWarranty
        this.location = location
        this.groupID = groupID
        this.status = status
        this.systemNumber = systemNumber
        this.circuitNumber = circuitNumber
        this.address = address
        this.systemUsed = systemUsed
        this.linkKeeperUnits = keeperUnits
        this.linkMaintainVendors = maintainVendors
        this.linkFloors = linkFloors
        this.linkDeviceTypes = deviceType
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
    getOnlyName(){
        return this.name
    }
    getOnlyType(){
        return this.linkDeviceTypes.length !== 0 ? this.linkDeviceTypes[0].getTypeName() : ''
    }
    getName(){
        var name = this.linkDeviceTypes.length !== 0 ? 
        '【'+this.linkDeviceTypes[0].getTypeName()+'】'+this.name :  '【】'+this.name
        return name
    }
    static empty(){
        return new Device({
            id:'',
            name:'',
            dateOfPurchase : null,
            dateOfWarranty : null,
            location :'',
            systemNumber :'',
            circuitNumber :'',
            address :'',
            systemUsed :false,
            linkKeeperUnits : [],
            linkMaintainVendors :[],
            linkFloors :[],
            linkDeviceTypes: []
        })
    }
    static getConfig(){
       return [
            {
                label: '名稱',
                prop: 'name',
                mandatory:true, message:'請輸入名稱',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:false,maxlength:'20'
            },
            {
                label: '種類',
                prop: 'linkDeviceTypes',
                format:'deviceTypeSelect',
                mandatory:true, message:'請選擇種類',isSelect:true,options:[],
                selectType:'deviceType',select:'',isSort:true,isHidden:false,type:'array',typemessage:''
            },
            {
                label: '購買日期',
                prop: 'dateOfPurchase',
                format:'YYYY-MM-DD',
                mandatory:false, message:'請輸入購買日期',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:true
            },
            {
                label: '保固日期',
                prop: 'dateOfWarranty',
                format:'YYYY-MM-DD',
                mandatory:false, message:'請輸入保固日期',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:false
            },
            {
                label: '位置設置',
                prop: 'location',
                mandatory:false, message:'請輸入位置設置',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:true,maxlength:'20'
            },
            {
                label: '分類群組',
                prop: 'groupID',
                mandatory:false, message:'請輸入分類群組',isSelect:true,options:[],
                selectType:'group',select:'',isSort:true,isHidden:true,maxlength:'10'
            },
            {
                label: '保管單位',
                prop: 'linkKeeperUnits',
                format:'contactunitSelect',
                mandatory:true,trigger: 'change', message:'請選擇保管單位',isSelect:true,options:[],
                selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:false
            },
            {
                label: '維護廠商',
                prop: 'linkMaintainVendors',
                format:'contactunitSelect',
                mandatory:true,trigger: 'change', message:'請選擇維護廠商',isSelect:true,options:[],
                selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:true 
            },
            {
                label: '設備狀況',
                prop: 'status',
                format:'DeviceStatusOptions',
                mandatory:true, message:'請選擇設備狀況',isSelect:true,options:[],
                selectType:'options',select:'',isSort:true,isHidden:false
            },
            {
                label: '系統',
                prop: 'systemNumber',
                mandatory:false, message:'請輸入系統',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:false,maxlength:'2'
            },
            {
                label: '迴路',
                prop: 'circuitNumber',
                mandatory:false, message:'請輸入迴路',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:false,maxlength:'3'
            },
            {
                label: '點位',
                prop: 'address',
                mandatory:false, message:'請輸入點位',isSelect:false,options:[],selectType:'',
                isSort:true,isHidden:false,maxlength:'5'
            }
        ]
    }
    static getTableConfig(){
        return [
             {
                 label: '名稱',
                 prop: 'name',
                 mandatory:true, message:'請輸入名稱',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false,maxlength:'20'
             },
             {
                 label: '種類',
                 prop: 'linkDeviceTypes',
                 format:'deviceTypeSelect',
                 mandatory:true, message:'請選擇種類',isSelect:true,options:[],
                 selectType:'deviceType',select:'',isSort:true,isHidden:false,type:'array',typemessage:''
             },
             {
                 label: '購買日期',
                 prop: 'dateOfPurchase',
                 format:'YYYY-MM-DD',
                 mandatory:false, message:'請輸入購買日期',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false
             },
             {
                 label: '保固日期',
                 prop: 'dateOfWarranty',
                 format:'YYYY-MM-DD',
                 mandatory:false, message:'請輸入保固日期',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false
             },
             {
                 label: '位置設置',
                 prop: 'location',
                 mandatory:false, message:'請輸入位置設置',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false,maxlength:'20'
             },
             {
                 label: '分類群組',
                 prop: 'groupID',
                 mandatory:false, message:'請輸入分類群組',isSelect:true,options:[],
                 selectType:'group',select:'',isSort:true,isHidden:false,maxlength:'10'
             },
             {
                 label: '保管單位',
                 prop: 'linkKeeperUnits',
                 format:'contactunitSelect',
                 mandatory:true,trigger: 'change', message:'請選擇保管單位',isSelect:true,options:[],
                 selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:false
             },
             {
                 label: '維護廠商',
                 prop: 'linkMaintainVendors',
                 format:'contactunitSelect',
                 mandatory:true,trigger: 'change', message:'請選擇維護廠商',isSelect:true,options:[],
                 selectType:'contactunit',select:'',isSort:true,type:'array',typemessage:'',isHidden:false 
             },
             {
                 label: '設備狀況',
                 prop: 'status',
                 format:'DeviceStatusOptions',
                 mandatory:true, message:'請選擇設備狀況',isSelect:true,options:[],
                 selectType:'options',select:'',isSort:true,isHidden:false
             },
             {
                 label: '系統',
                 prop: 'systemNumber',
                 mandatory:false, message:'請輸入系統',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false,maxlength:'2'
             },
             {
                 label: '迴路',
                 prop: 'circuitNumber',
                 mandatory:false, message:'請輸入迴路',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false,maxlength:'3'
             },
             {
                 label: '點位',
                 prop: 'address',
                 mandatory:false, message:'請輸入點位',isSelect:false,options:[],selectType:'',
                 isSort:true,isHidden:false,maxlength:'5'
             }
         ]
    }
    static getAddressConfig(){
        return [
            { label:'名稱',prop: 'name',mandatory:true, message:'請輸入名稱',isHidden:false,maxlength:'20'},
            { label:'類型' , prop:'linkDeviceTypes',format:'deviceTypeSelect', mandatory:false,
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
    static async updateAddress(data){
        var data = await api.device.apiPatchDevicesAddress(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Device