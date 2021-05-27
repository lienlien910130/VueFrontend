import Parent from './parent'
import api from '@/api'
import Device from './device'
import Files from './files'
import UsageOfFloor from './usageOfFloor'

class Floors extends Parent {
 
    constructor (data) {
        super(data)
        const { floor, floorPlanID, sort, linkDevices } = data
        var devices = linkDevices.map(item=>{ return new Device(item)})
        this.floor = floor
        this.floorPlanID = floorPlanID
        this.sort = sort
        this.linkDevices = devices
        return this
    }
    clone(data){
        return new Floors(data)
    }
    async update(){
        var data = await api.building.apiPatchFloors(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
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
            return response.result.codeContent
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
        return this.floorPlanID.toString()
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
    static getConfig(){
       return [
            { label:'樓層' , prop:'floor', 
                mandatory:true, message:'請輸入樓層',maxlength:'10',
                isHidden:false,isSearch:true},
            { label:'平面圖檔' , prop:'floorPlanID',format:'hide',
                type:'number',typemessage:'',
                mandatory:false, isHidden:false,isSearch:false },
            { label:'排序' , prop:'sort', format:'inputnumber',
                type:'number',typemessage:'',
                pattern:/^[1-9]*[1-9][0-9]*$/,errorMsg:'請輸入正整數',isPattern:true,
                mandatory:true, message:'請輸入排序',maxlength:'3',
                isHidden:false,isSearch:true}
       ]
    }
    static getDownloadConfig(){
        return [
             { label:'樓層' , prop:'floor',isHidden:false},
             { label:'排序' , prop:'sort',isHidden:false}
        ]
    }
    static async get (){
        var data = await api.building.apiGetBuildingFloors().then(response => {
            console.log('getfloor')
            console.log(JSON.stringify(response))
            var result = response.result.sort((x,y) => x.id - y.id)
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