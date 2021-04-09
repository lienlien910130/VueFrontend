import Parent from './parent'
import api from '@/api'

class Contactunit extends Parent {
    constructor (data) {
        super(data)
        const { type, name, contactNumber, cellPhoneNumber, faxNumber, email, address,
            note, collaborate, hide  } = data
        this.name = name
        this.type = type
        this.contactNumber = contactNumber
        this.cellPhoneNumber = cellPhoneNumber
        this.faxNumber = faxNumber
        this.email = email
        this.address = address
        this.note = note
        this.collaborate = collaborate
        this.hide = hide
        return this
    }

    clone(data){
        return new Contactunit(data)
    }
    
    async update(){
        var data = await api.building.apiPatchContactUnit(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.building.apiPostContactUnit(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.building.apiDeleteContactUnit(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    
    getName(){
        return this.name
    }

    static empty(){
        return new Contactunit({
            id:'',
            name :'',
            type :'',
            contactNumber :'',
            cellPhoneNumber :'',
            faxNumber :'',
            email :'',
            address :'',
            note :'',
            collaborate :true,
            hide :false
        })
    }
    static getConfig(){
       
    }
    
    static async get (){
        var data = await api.building.apiGetBuildingContactUnit().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Contactunit(item) })
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    
}

export default Contactunit