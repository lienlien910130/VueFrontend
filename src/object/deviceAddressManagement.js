import api from '@/api'
import Parent from './parent'
import Device from './device'

class DeviceAddressManagement extends Parent {
    constructor (data) {
        super(data)
        const { internet, system, address, number, systemUsed, memeryLoc, iconId,  valueType, value, valueLength,
             floorsId, linkDevices  } = data
        var devices = linkDevices !== undefined ?
        linkDevices.map(item=>{ return new Device(item) }) :[]
        this.internet = internet
        this.system = system
        this.address = address
        this.number = number
        this.systemUsed = systemUsed
        this.floorsId = floorsId
        this.value = value
        this.valueType = valueType
        this.memeryLoc = memeryLoc
        this.iconId = iconId
        this.valueLength = valueLength
        this.linkDevices = devices
    }
    clone(data){
        return new DeviceAddressManagement(data)
    }
    async update(resetLink, isPLC = null){
        var temp = JSON.parse(JSON.stringify(this))
        if(isPLC == null){
            temp.internet = '{Check}'+temp.internet
            temp.system = '{Check}'+temp.system
            temp.address = '{Check}'+temp.address
            temp.number = '{Check}'+temp.number
            var data = await api.device.apiPutDevicesAddress(resetLink,temp).then(async(response) => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }else{
            temp.internet = '{Check}'+temp.internet
            temp.system = '{Check}'+temp.system
            temp.memeryLoc = '{Check}'+temp.memeryLoc
            var data = await api.device.apiPutDevicesPLCAddress(resetLink,temp).then(async(response) => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }
    }
    async create(deviceId,isPLC = null){
        var temp = JSON.parse(JSON.stringify(this))
        if(isPLC == null){
            temp.internet = '{Check}'+temp.internet
            temp.system = '{Check}'+temp.system
            temp.address = '{Check}'+temp.address
            temp.number = '{Check}'+temp.number
            var data = await api.device.apiPostDevicesAddress(deviceId,temp).then(response => {
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                return {}
            })
            return data
        }else{
            temp.internet = '{Check}'+temp.internet
            temp.system = '{Check}'+temp.system
            temp.memeryLoc = '{Check}'+temp.memeryLoc
            var data = await api.device.apiPostDevicesPLCAddress(deviceId,temp).then(response => {
                console.log(response)
                return new DeviceAddressManagement(response.result)
            }).catch(error=>{
                console.log(error)
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
    getValueTypeName(){
        return this.value == 'status' ? '監視狀態' : this.value == 'action' ? '控制動作' : '監視電源'
    }
    getAddressStr(){
        var str = this.internet
        if(this.system !== '' && this.system !== null && this.system !== undefined){
            str = str.concat('-'+this.system)
        }
        if(this.address !== '' && this.address !== null && this.address !== undefined){
            str = str.concat('-'+this.address)
        }
        if(this.number !== '' && this.number !== null && this.number !== undefined){
            str = str.concat('-'+this.number)
        }
        return str
    }
    static empty(){
        return new DeviceAddressManagement({
            id:'',
            internet:'',
            system : '',
            address : '',
            number :'',
            systemUsed:false,
            floorsId:null,
            valueType:'bit',
            value:'',
            memeryLoc:'',
            iconId:'',
            valueLength:null,
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
                label:'樓層' ,
                prop:'floorsId',
                format:'floorSelect',
                mandatory:true,message:'請選擇樓層',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            {
                label: '總機編號',
                prop: 'internet',format:'internetNumber',
                mandatory:true, message:'請輸入網路編號',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請輸入網路編號',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
               label: '迴路編號',
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
                mandatory:false, message:'請輸入編號',isHidden:false,maxlength:'11',
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
                mandatory:true,message:'請選擇火警總機',type:'array',typemessage:'',
                isHidden:true,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:false,isBlock:false
            },
            {
                label:'樓層' ,
                prop:'floorsId',
                format:'floorSelect',
                mandatory:true,message:'請選擇樓層',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            {
                label:'點位' ,
                prop:'addressStr',
                format:'addressStr',
                mandatory:false,message:'請輸入點位',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
             {
                 label: '總機編號',
                 prop: 'internet',format:'internetNumber',
                 mandatory:false, message:'請輸入網路編號',isHidden:true,maxlength:'5',
                 pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                 isSearch:true,placeholder:'請輸入網路編號',
                 isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
             },
             {
                label: '迴路編號',
                prop: 'system',
                mandatory:false, message:'請輸入系統編號',isHidden:true,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入系統編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:false, message:'請輸入位址編號',isHidden:true,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入位址編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:false, message:'請輸入編號',isHidden:true,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '記憶體位址',
                prop: 'memeryLoc',
                mandatory:false, message:'請輸入記憶體位址',isHidden:false,maxlength:'6',
                isSearch:true,placeholder:'請輸入0000~FFFF',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '類型',
                prop: 'value', format:'valueType',
                mandatory:true, message:'請選擇類型',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請選擇類型',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label:'圖示' ,
                prop:'iconId',
                format:'iconSelect',
                mandatory:true,message:'請選擇圖示',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
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
                mandatory:true,message:'請選擇設備',type:'array',typemessage:'',
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
                label:'樓層' ,
                prop:'floorsId',
                format:'floorSelect',
                mandatory:true,message:'請選擇樓層',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            {
                label:'點位' ,
                prop:'addressStr',
                format:'addressStr',
                mandatory:false,message:'請輸入點位',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
             {
                 label: '總機編號',
                 prop: 'internet',format:'internetNumber',
                 mandatory:false, message:'請輸入網路編號',isHidden:true,maxlength:'5',
                 isSearch:true,placeholder:'請輸入網路編號',
                 isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
             },
             {
                label: '迴路編號',
                prop: 'system',
                mandatory:false, message:'請輸入系統編號',isHidden:true,maxlength:'5',
                isSearch:true,placeholder:'請輸入系統編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '位址編號',
                prop: 'address',
                mandatory:false, message:'請輸入位址編號',isHidden:true,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入位址編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '編號',
                prop: 'number',
                mandatory:false, message:'請輸入編號',isHidden:true,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入編號',
                isAssociate:false,isEdit:false,isUpload:true,isExport:true,isBlock:false
            },
            {
                label: '記憶體位址',
                prop: 'memeryLoc',
                mandatory:false, message:'請輸入記憶體位址',isHidden:false,maxlength:'5',
                pattern:/^[0-9]*$/g,errorMsg:'請輸入0-9之間的字元',isPattern:true,
                isSearch:true,placeholder:'請輸入記憶體位址',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '記憶體長度',
                prop: 'valueLength',
                mandatory:false, message:'請輸入記憶體長度',isHidden:false,maxlength:'10',
                isSearch:true,placeholder:'請輸入記憶體長度',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label: '類型',
                prop: 'value',format:'valueType',
                mandatory:true, message:'請選擇類型',isHidden:false,maxlength:'5',
                isSearch:true,placeholder:'請選擇類型',
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
            },
            {
                label:'值' ,
                prop:'valueType',
                format:'valueSelect',
                mandatory:false,message:'請選擇值',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
            },
            {
                label:'圖示' ,
                prop:'iconId',
                format:'iconSelect',
                mandatory:true,message:'請選擇圖示',type:'string',typemessage:'',
                isHidden:false,isSearch:false,
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
                mandatory:true,message:'請選擇設備',type:'array',typemessage:'',
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
    static async deleteMany(data, isPLC = null){
      if(isPLC == null){
          var data = await api.device.apiDeleteDevicesAddress(data).then(async(response) => {
              return true
          }).catch(error=>{
              return false
          })
          return data
      }else{
          var data = await api.device.apiDeleteDevicesPLCAddress(data).then(async(response) => {
              return true
          }).catch(error=>{
              return false
          })
          return data
      }
  }
    // static async postMany(data, isPLC = null){
    //     if(isPLC == null){
    //         var data = await api.device.apiPostDevicesAddresses(data).then(response => {
    //             return true
    //         }).catch(error=>{
    //             return false
    //         })
    //         return data
    //     }else{
    //         var data = await api.device.apiPostDevicesPLCAddresses(data).then(response => {
    //             return true
    //         }).catch(error=>{
    //             return false
    //         })
    //         return data
    //     }
    // }
    static async batchInsert(deviceId,data,isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiPostDevicesAddressesBatchInsert(deviceId,data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }else{
            var data = await api.device.apiPostDevicesPLCAddressesBatchInsert(deviceId,data).then(response => {
                return true
            }).catch(error=>{
                return false
            })
            return data
        }
    }
    static async updateMany(data,isPLC = null){
        if(isPLC == null){
            var data = await api.device.apiPatchDevicesAddress(data).then(async(response) => {
                response.result = response.result.map(item=>{ return new DeviceAddressManagement(item)})
                return response
            }).catch(error=>{
                return []
            })
            return data
        }else{
            var data = await api.device.apiPatchDevicesPLCAddress(data).then(async(response) => {
                response.result = response.result.map(item=>{ return new DeviceAddressManagement(item)})
                return response
            }).catch(error=>{
                return []
            })
            return data
        }
    }
}



export default DeviceAddressManagement
