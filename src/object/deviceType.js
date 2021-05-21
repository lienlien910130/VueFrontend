import Parent from './parent'
import api from '@/api'
import { changeDeviceFullType } from '@/utils/index'

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
    setFullType(fullType){
        this.fullType = fullType
    }
    setTypeName(typeName){
        this.name = typeName
    }
    getTypeName(){ //設備種類名稱
        var label = changeDeviceFullType(this.fullType,false,true)
        return label
    }
    getType(){ //設備種類
        var label = changeDeviceFullType(this.fullType,true,true)
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
                mandatory:true, message:'請選擇設備類型',maxlength:'20',
                isHidden:false,isSearch:false
            },
            {
                label: '設備名稱',
                prop: 'name',format:'hide',
                mandatory:false, message:'請輸入設備名稱',isHidden:false,maxlength:'20',isSearch:true
            },
            {
                label: '廠牌名稱',
                prop: 'brand',
                mandatory:true, message:'請輸入廠牌名稱',isHidden:false,maxlength:'20',isSearch:true
            },
            {
                label: '設備型號',
                prop: 'productId',
                mandatory:true, message:'請輸入設備型號',isHidden:false,maxlength:'20',isSearch:true
            },
            {
                label: '國家認證編號',
                prop: 'certificationNumber',
                mandatory:true, message:'請輸入國家認證編號',isHidden:false,maxlength:'20',isSearch:true
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
                console.log(JSON.stringify(response.result))
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
            return JSON.parse(response)
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.device.apiGetDevicesTypeSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new DeviceType(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.device.apiPostDevicesTypes(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default DeviceType