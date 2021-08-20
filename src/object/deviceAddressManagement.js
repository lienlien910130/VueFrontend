import api from '@/api'
import Parent from './parent' 
import Device from './device' 

class DeviceAddressManagement extends Parent {
    constructor (data) {
        super(data)
        const { internet, system, address, number, status, systemUsed, protocolMode,
            valueType, value, linkDevices  } = data
        var devices = linkDevices !== undefined ?
        linkDevices.map(item=>{ return new Device(item) }) :[]
        this.internet = internet
        this.system = system
        this.address = address
        this.number = number
        this.status = status
        this.systemUsed = systemUsed
        this.protocolMode = parseInt(protocolMode)
        this.valueType = valueType
        this.value = value
        this.linkDevices = devices
    }
    clone(data){
        return new DeviceAddressManagement(data)
    }
    async update(resetLink, isPLC = null){
        var temp = JSON.parse(JSON.stringify(this))
        temp.internet = '{Check}'+temp.internet
        temp.system = '{Check}'+temp.system
        temp.address = '{Check}'+temp.address
        temp.number = '{Check}'+temp.number
        if(isPLC == null){
            var data = await api.device.apiPatchDevicesAddress(resetLink,temp).then(async(response) => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }else{
            var data = await api.device.apiPatchDevicesPLCAddress(resetLink,temp).then(async(response) => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }
    }
    async create(deviceId,isPLC = null){
        var temp = JSON.parse(JSON.stringify(this))
        temp.internet = '{Check}'+temp.internet
        temp.system = '{Check}'+temp.system
        temp.address = '{Check}'+temp.address
        temp.number = '{Check}'+temp.number
        if(isPLC == null){
            var data = await api.device.apiPostDevicesAddress(deviceId,temp).then(response => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }else{
            var data = await api.device.apiPostDevicesPLCAddress(deviceId,temp).then(response => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }
    }
    async delete(isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiDeleteDevicesAddress(this.id).then(async(response) => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.device.apiDeleteDevicesPLCAddress(this.id).then(async(response) => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
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
            protocolMode:1,
            linkDevices:[],
            linkAssignDevices:[]
        })
    }
    static getManyEmptyTableConfig(){
        return [
            { 
                label:'火警總機' , 
                prop:'linkAssignDevices',
                format:'assignFireDeviceSelect', 
                mandatory:true,message:'請選擇火警總機',type:'array',typemessage:'',
                isHidden:true,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:false,isBlock:false
            },
            {
                label: '網路編號',
                prop: 'internet',format:'internetNumber',
                mandatory:true, message:'請輸入網路編號',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入網路編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
               label: '系統編號',
               prop: 'system',
               mandatory:true, message:'請輸入系統編號',isHidden:false,maxlength:'11',
               pattern:/^\d*\-\d*$/g,errorMsg:'請輸入起始值-結束值',isPattern:true,
               isSearch:true,placeholder:'請輸入系統編號',
               isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:true, message:'請輸入位址編號',isHidden:false,maxlength:'11',
                pattern:/^\d*\-\d*$/g,errorMsg:'請輸入起始值-結束值',isPattern:true,
                isSearch:true,placeholder:'請輸入位址編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:true, message:'請輸入編號',isHidden:false,maxlength:'11',
                pattern:/^\d*\-\d*$/g,errorMsg:'請輸入起始值-結束值',isPattern:true,
                isSearch:true,placeholder:'請輸入編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            }
        ]
    }
    static getTableConfig(){
        return [
            { 
                label:'火警總機' , 
                prop:'linkAssignDevices',
                format:'assignFireDeviceSelect', 
                mandatory:false,message:'請選擇火警總機',type:'array',typemessage:'',
                isHidden:true,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:false,isBlock:false
            },
             {
                 label: '網路編號',
                 prop: 'internet',format:'internetNumber',
                 mandatory:true, message:'請輸入網路編號',isHidden:false,maxlength:'5',
                 pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                 isSearch:true,placeholder:'請輸入網路編號',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                label: '系統編號',
                prop: 'system',
                mandatory:true, message:'請輸入系統編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入系統編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:true, message:'請輸入位址編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入位址編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:true, message:'請輸入編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入編號',
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
                label: '控制模式',
                prop: 'protocolMode',format:'protocolMode',
                type:'number',typemessage:'',
                mandatory:true,message:'請選擇控制模式',isHidden:false,
                isSearch:false,placeholder:'請選擇控制模式',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
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
    static getPLCTableConfig(){
        return [
            { 
                label:'PLC' , 
                prop:'linkAssignDevices',
                format:'assignPLCDeviceSelect', 
                mandatory:false,message:'請選擇PLC',type:'array',typemessage:'',
                isHidden:true,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:false,isBlock:false
            },
             {
                 label: '網路編號',
                 prop: 'internet',format:'internetNumber',
                 mandatory:true, message:'請輸入網路編號',isHidden:false,maxlength:'5',
                 isSearch:true,placeholder:'請輸入網路編號',
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                label: '系統編號',
                prop: 'system',
                mandatory:true, message:'請輸入系統編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入系統編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:true, message:'請輸入位址編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入位址編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:true, message:'請輸入編號',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            // {
            //     label: '狀態',
            //     prop: 'status',
            //     mandatory:false, message:'請輸入狀態',isHidden:false,maxlength:'20',
            //     isSearch:true,placeholder:'請輸入狀態',
            //     isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            // },
            {
                label: '類型',
                prop: 'valueType',
                mandatory:false, message:'請輸入類型',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入類型',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '值',
                prop: 'value',
                mandatory:false, message:'請輸入值',isHidden:false,maxlength:'20',
                isSearch:true,placeholder:'請輸入值',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            { 
                label:'圖控使用狀態' , prop:'systemUsed',format:'systemUsedBoolean', 
                mandatory:false, 
                type:'boolean',typemessage:'',isHidden:false,isSearch:false,
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '控制模式',
                prop: 'protocolMode',format:'protocolMode',
                type:'number',typemessage:'',
                mandatory:true,message:'請選擇控制模式',isHidden:false,
                isSearch:false,placeholder:'請選擇控制模式',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
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
    static async getOfID (deviceAddressId,isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiGetDevicesAddress(deviceAddressId).then(response => {
                var array = response.result.map(item=>{ return new DeviceAddressManagement(item) })
                return array[0]
            }).catch(error=>{
                return []
            })
            return data
        }else{
            var data = await api.device.apiGetDevicesPLCAddress(deviceAddressId).then(response => {
                var array = response.result.map(item=>{ return new DeviceAddressManagement(item) })
                return array[0]
            }).catch(error=>{
                return []
            })
            return data
        }
    }
    static async getSearchPage(data,isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiGetDevicesAddressSearchPages(data).then(response => {
                response.result = response.result.sort((x,y) => x.id - y.id)
                .map(item=>{ return new DeviceAddressManagement(item)})
                return response
            }).catch(error=>{
                return []
            })
            return data
        }else{
            var data = await api.device.apiGetDevicesPLCAddressSearchPages(data).then(response => {
                response.result = response.result.sort((x,y) => x.id - y.id)
                .map(item=>{ return new DeviceAddressManagement(item)})
                return response
            }).catch(error=>{
                return []
            })
            return data
        }
    }
    static async postMany(data, isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiPostDevicesAddresses(data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.device.apiPostDevicesPLCAddresses(data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
    }
    static async batchInsert(deviceId,data,isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiPostDevicesAddressesBatchInsert(deviceId,data).then(response => {
                console.log(JSON.stringify(response))
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.device.apiPostDevicesPLCAddressesBatchInsert(deviceId,data).then(response => {
                console.log(JSON.stringify(response))
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
    }
}



export default DeviceAddressManagement