import Parent from './parent'
import store from '@/store'
import api from '@/api'

class DeviceType extends Parent {
    constructor (data) {
        super(data)
        const { name, fullType, brand, productId, certificationNumber  } = data
        this.name = name
        this.fullType = fullType
        this.brand = brand
        this.productId = productId
        this.certificationNumber = certificationNumber
        return this
    }
    clone(data){
        return new DeviceType(data)
    }
    async update(){
        var data = await api.device.apiPatchDevicesType(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.device.apiPostDevicesType(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.device.apiDeleteDevicesType(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getAll(){
        
    }
    setTypeName(typeName){
        this.name = typeName
    }
    getTypeName(){ //設備種類名稱
        var label = ''
        var fullType = this.fullType
        store.getters.deviceType.filter(function(item, index){
            var array = item.options.filter((obj,index)=>{
                return obj.value == fullType
            })
            array.length !== 0 ? label = array[0].label  : ''
        })
        return label
    }
    getType(){ //設備種類
        var label = ''
        var fullType = this.fullType
        store.getters.deviceType.forEach(item=>{
            var array = item.options.filter((obj,index)=>{
                return obj.value == fullType
            })
            array.length !== 0 ? label = item.label  : ''
        })
        return label
    }
    getBrand(){
        return this.brand
    }
    getProductId(){
        return this.productId
    }
    getCertificationNumber(){
        return this.certificationNumber
    }
    getName(){
        return '【'+this.getType()+'】'+this.getTypeName()
    }
    getSelectName(){
        return this.getType() !== '' ? '【'+this.getType()+'】'+this.getTypeName()+'-'+this.getBrand()+'-'+this.getProductId() : 
        ''
    }
    static empty(){
        return new DeviceType({
            id:'',
            name :'',
            fullType :'',
            brand :'',
            productId :'',
            certificationNumber :''
        })
    }
    static getConfig(){
       return [
            {
                label: '設備類型',
                prop: 'fullType',
                format:'fullType',
                mandatory:true, message:'請選擇設備類型',isSelect:true,options:[],selectType:'fullType',select:'',
                isSort:true,isHidden:false,maxlength:'20'
            },
            {
                label: '設備名稱',
                prop: 'name',format:'hide',
                mandatory:false, message:'請輸入設備名稱',isSelect:false,isSort:true,isHidden:false,maxlength:'20'
            },
            {
                label: '廠牌名稱',
                prop: 'brand',
                mandatory:true, message:'請輸入廠牌名稱',isSelect:true,options:[],
                selectType:'options',select:'',isSort:true,isHidden:false,maxlength:'20'
            },
            {
                label: '設備型號',
                prop: 'productId',
                mandatory:true, message:'請輸入設備型號',isSelect:true,options:[],selectType:'',select:'',
                isSort:true,isHidden:false,maxlength:'20'
            },
            {
                label: '國家認證編號',
                prop: 'certificationNumber',
                mandatory:true, message:'請輸入國家認證編號',isSelect:false,options:[],selectType:'',select:'',
                isSort:true,isHidden:false,maxlength:'20'
            }
        ]   
    }
    static async get (type){
        var data
        if(type == 'devicesManagement'){
            data = await api.device.apiGetDevicesTypeByDevicesManagement().then(response => {
                return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DeviceType(item) })
            }).catch(error=>{
                return []
            })
        }else if(type == 'deviceTypesManagement'){
            data = await api.device.apiGetDevicesType().then(response => {
                return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DeviceType(item) })
            }).catch(error=>{
                return []
            })
        }else{
            data = await api.device.apiGetDevicesTypeByDevicesAddress().then(response => {
                return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DeviceType(item) })
            }).catch(error=>{
                return []
            })
        }
        return data
    }
    static async getDefault (){
        var data = await api.device.apiGetDefaultFullType().then(response => {
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default DeviceType