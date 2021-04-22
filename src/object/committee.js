import Parent from './parent'
import api from '@/api'
import UsageOfFloor from './usageOfFloor'
import { removeDuplicates } from '@/utils/index'

class Committee extends Parent {
 
    constructor (data) {
        super(data)
        const { title, note, linkUsageOfFloors } = data
        var usageOfFloor = linkUsageOfFloors.map(item=>{ return new UsageOfFloor(item)})
        this.title = title
        this.note = note
        this.linkUsageOfFloors = usageOfFloor
        return this
    }
    clone(data){
        return new Committee(data)
    }
    async update(){
        var data = await api.building.apiPatchCommittee(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.building.apiPostCommittee(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.building.apiDeleteCommittee(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return this.name
    }
    getlinkUsageOfFloorsUser(){
        var array = []
        for(let element of this.linkUsageOfFloors){
            array.push(element.getlinkUsers())
        }
        var concatarray = array.reduce(
            function(a, b) {
              return a.concat(b)
            },[]
        )
        var temp = removeDuplicates(concatarray,'id') 
        return temp
    }
    static empty(){
        return new Committee({
            id:'',
            title:'',
            note :'',
            linkUsageOfFloors :[]
        })
    }
    static getConfig(){
       return [
            { label:'所屬單位' , prop:'linkUsageOfFloors',format:'floorOfHouseSelect',
            mandatory:true, message:'請選擇單位',type:'array',typemessage:'',isSelect:true,
            options:[],selectType:'usageOfFloor',select:'',isSort:true,isHidden:false},
            { label:'職稱' , prop:'title', mandatory:true, message:'請輸入職稱',isSelect:false,isSort:true,isHidden:false,maxlength:'50'},
            { label:'姓名' , format:'floorOfHouseUsersName', mandatory:true, 
            message:'請輸入內容',isSelect:false,isSort:true,isHidden:false},
            { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false,isHidden:true,maxlength:'200' }
        ]
    }
    static getDialogConfig(){
        return [
             { label:'所屬單位' , prop:'linkUsageOfFloors',format:'floorOfHouseSelect',
             mandatory:true, message:'請選擇單位',type:'array',typemessage:'',isSelect:true,
             options:[],selectType:'usageOfFloor',select:'',isSort:true,isHidden:false},
             { label:'職稱' , prop:'title', mandatory:true, message:'請輸入職稱',isSelect:false,isSort:true,isHidden:false,maxlength:'50'},
             { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false,isHidden:true,maxlength:'200' }
         ]
     }
    static async get (){
        var data = await api.building.apiGetCommittee().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{return new Committee(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default Committee