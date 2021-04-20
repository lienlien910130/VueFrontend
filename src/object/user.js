import Parent from './parent'
import api from '@/api'

class User extends Parent {
 
    constructor (data) {
        super(data)
        const { name,identityCard, birthday, callNumber,cellPhoneNumber, emergencyNumber, email, note } = data
        this.name = name
        this.identityCard = identityCard
        this.birthday = birthday
        this.callNumber = callNumber
        this.cellPhoneNumber = cellPhoneNumber
        this.emergencyNumber = emergencyNumber
        this.email = email
        this.note = note
        return this
    }
    clone(data){
        return new User(data)
    }
    async update(){
        var data = await api.building.apiPatchUser(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.building.apiPostUser(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        
    }
    getName(){
        return this.name
    }
    static empty(){
        return new User({
            id:'',
            name:'',
            identityCard : '',
            birthday :null,
            callNumber :'',
            cellPhoneNumber :'',
            emergencyNumber :'',
            email :''
        })
    }
    static getConfig(){
       return [
        { label:'姓名' , prop:'name', mandatory:true, message:'請輸入姓名',maxlength:'15'},
        { label:'身份證' , prop:'identityCard', mandatory:true,message:'請輸入身份證',
        pattern:/^[A-Z]{1}[1-2]{1}[0-9]{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,maxlength:'10'},
        { label:'生日' , prop:'birthday',format:'YYYY-MM-DD', mandatory:true,message:'請輸入生日'},
        { label:'電話' , prop:'callNumber', mandatory:true,message:'請輸入電話',maxlength:'15'},
        { label:'手機號碼' , prop:'cellPhoneNumber', mandatory:true, message:'請輸入手機號碼',
        pattern:/^09\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,maxlength:'10'},
        { label:'緊急電話' , prop:'emergencyNumber', mandatory:false,maxlength:'15'},   
        { label:'電子信箱' , prop:'email', mandatory:true,message:'請輸入電子信箱',
        pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,maxlength:'25'},    
        { label:'備註' , prop:'note', mandatory:false,format:'textarea',maxlength:'200'}, 
      ]
    }
    static async get (){
        var data = await api.building.apiGetAllBuildingOfUser().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new User(item) })
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default User