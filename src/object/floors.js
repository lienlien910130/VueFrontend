import Parent from './parent'
import api from '@/api'
import Device from './device'
import Files from './files'
import UsageOfFloor from './usageOfFloor'
import idb from '@/utils/indexedDB'

class Floors extends Parent {
 
    constructor (data) {
        super(data)
        const { floor, floorPlanID, sort, linkDevices } = data
        var devices = linkDevices !== undefined ? linkDevices.map(item=>{ return new Device(item)}) : []
        this.floor = floor 
        this.floorPlanID =  floorPlanID == undefined ? null :  floorPlanID
        this.sort = sort
        this.linkDevices = devices
        return this
    }
    clone(data){
        return new Floors(data)
    }
    setFloorPlanID(planID){
        this.floorPlanID = planID
    }
    async update(buildingId){
        var temp = JSON.parse(JSON.stringify(this))
        temp.floor = '{Check}'+temp.floor
        var data = await api.building.apiPatchFloors(buildingId,temp).then(async(response) => {
            return new Floors(response.result)
        }).catch(error=>{
            return {}
        })
        return data
    }
    async delete(){
        var data = await api.building.apiDeleteFloors(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getUsageOfFloor(){
        var data = await api.building.apiGetFloorOfHouse(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new UsageOfFloor(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetFloorFiles(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostFloorFiles(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getGraphicFiles(){
        var data = await api.files.apiGetFloorIdToGraphicFile(this.id).then(response => {
            return response.result
        }).catch(error=>{
            return null
        })
        return data        
    }
    async postGraphicFiles(formData){
        var data = await api.files.apiPostGraphicFile(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data        
    }
    getName(){
        return this.floor
    }
    getImageID(){
        return this.floorPlanID !== null ? this.floorPlanID.toString() : null
    }
    async getImage(){
       var src = await idb.loadCacheImage(this.floorPlanID)
       return src
    }
    static empty(){
        return new Floors({
            id:'',
            floor :'',
            floorPlanID:null,
            sort:99,
            linkDevices:[]
        })
    }
    static getTableConfig(){
       return [
            { label:'樓層' , prop:'floor', 
                mandatory:true, message:'請輸入樓層',maxlength:'10',
                isHidden:false,isSearch:true,placeholder:'請輸入樓層',
                isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true},
            { label:'平面圖檔' , prop:'floorPlanID',
                type:'number',typemessage:'',
                mandatory:false, isHidden:false,isSearch:false,
                isAssociate:false,isEdit:false,isUpload:false,isExport:false,isBlock:false },
            { label:'排序' , prop:'sort',format:'inputnumber', mandatory:true, message:'請輸入0~999',
                pattern:/^[0-9]{1,3}$/,errorMsg:'請輸入0~999',isPattern:true,
                type:'number',typemessage:'',placeholder:'請輸入0~999',
                isHidden:false,maxlength:'3',isSearch:true,
                isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true},
       ]
    }
    static async get (){
        var data = await api.building.apiGetFloors().then(response => {
            var result = response.result.sort((x,y) => x.sort - y.sort)
            .map(item=>{ return new Floors(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(buildingId,data){
        var data = await api.building.apiGetFloorSearchPages(buildingId,data).then(response => {
            response.result = response.result.sort((x,y) => x.sort - y.sort)
            .map(item=>{ return new Floors(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async create (buildingId,data){
        var data = await api.building.apiPostFloors(buildingId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Floors