import Parent from './parent'
import api from '@/api'

class InspectionLacks extends Parent {
    constructor (data) {
        super(data)
        const { lackItem, lackContent, status  } = data
        this.lackItem = lackItem
        this.lackContent = lackContent
        this.status = status
        return this
    }
    clone(data){
        return new InspectionLacks(data)
    }
    async update(){
        var data = await api.report.apiPatchInspectionLack(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(inspectionId){
        var data = await api.report.apiPostInspectionLack(inspectionId,this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.report.apiDeleteInspectionLack(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return '【'+this.lackItem+'】'+this.lackContent
    }
    getStatus(){
        return this.status
    }
    static empty(){
        return new InspectionLacks({
            id:'',
            lackItem :'',
            lackContent :'',
            status :''
        })
    }
    static getConfig(){
       return [
            {
                label: '缺失項目',
                prop: 'lackItem',
                mandatory:true, message:'請輸入缺失項目',format:'input',maxlength:'200',isHidden:false
            },
            {
                label: '缺失內容',
                prop: 'lackContent',
                mandatory:true, message:'請輸入缺失內容',format:'textarea',maxlength:'999',isHidden:false
            },
            {
                label: '處理進度',
                prop: 'status',format:'MaintainProcessOptions',
                mandatory:false, format:'Options',isHidden:false
            }
        ]
    }
    static async get (inspectionId){
        var data = await api.report.apiGetInspectionLack(inspectionId).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item => { return new InspectionLacks(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(inspectionId,data){
        var data = await api.report.apiGetInspectionLackSearchPages(inspectionId,data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new InspectionLacks(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(inspectionId,data){
        var data = await api.report.apiPostInspectionLacks(inspectionId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default InspectionLacks