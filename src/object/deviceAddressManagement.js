import api from '@/api'
import Parent from './parent' 
import Device from './device' 

class DeviceAddressManagement extends Parent {
    constructor (data) {
        super(data)
        const { internet, system, address, number, status, systemUsed, linkDevices  } = data
        var devices = linkDevices !== undefined ?
        linkDevices.map(item=>{ return new Device(item) }) :[]
        this.internet = internet
        this.system = system
        this.address = address
        this.number = number
        this.status = status
        this.systemUsed = systemUsed
        this.linkDevices = devices
        return this
    }
    clone(data){
        return new DeviceAddressManagement(data)
    }
    async update(){
        var data = await api.device.apiPatchDevicesAddress(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.device.apiPostDevicesAddress(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteDevicesAddress(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getDevicesName(){
        return this.linkDevices.map(item => item.getName()).toString()
    }
    static empty(){
        return new DeviceAddressManagement({
            id:'',
            internet:'',
            system : '',
            address : '',
            number :'',
            status:'',
            systemUsed:false,
            linkDevices:[]
        })
    }
    static getTableConfig(){
        return [
             {
                 label: '網路編號',
                 prop: 'internet',
                 mandatory:true, message:'請輸入網路編號',isHidden:false,maxlength:'5',
                 isSearch:true,placeholder:'請輸入名稱',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                label: '系統編號',
                prop: 'system',
                mandatory:true, message:'請輸入系統編號',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:true, message:'請輸入位址編號',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:true, message:'請輸入編號',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入名稱',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '狀態',
                prop: 'status',
                mandatory:false, message:'請輸入狀態',isHidden:false,maxlength:'20',
                isSearch:true,placeholder:'請輸入狀態',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            { 
                label:'圖控使用狀態' , prop:'systemUsed',format:'systemUsedBoolean', 
                mandatory:false, 
                type:'boolean',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:true
            },
            { 
                label:'設備' , 
                prop:'linkDevices',
                format:'addressdeviceSelect', 
                mandatory:false,message:'請選擇設備',type:'array',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:true,isEdit:true,isUpload:false,isExport:true,isBlock:true
            }
         ]
    }
    static async get (){
        var data = await api.device.apiGetDevicesAddress().then(response => {
            var array = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DeviceAddressManagement(item) })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.device.apiGetDevicesAddressSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id)
            .map(item=>{ return new DeviceAddressManagement(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.device.apiPostDevicesAddresses(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default DeviceAddressManagement