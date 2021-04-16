import Parent from './parent'
import api from '@/api'

class PublicSafeLack extends Parent {
    constructor (data) {
        super(data)
        const { lackItem, lackContent,notPassReason,accordLaws,improvePlan, status  } = data
        this.lackItem = lackItem
        this.lackContent = lackContent
        this.notPassReason = notPassReason
        this.accordLaws = accordLaws
        this.improvePlan = improvePlan
        this.status = status
        return this
    }
    clone(data){
        return new PublicSafeLack(data)
    }
    async update(){
        var data = await api.report.apiPatchPublicSafeLack(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(publicSafeId){
        var data = await api.report.apiPostPublicSafeLack(publicSafeId,this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.report.apiDeletePublicSafeLack(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    getName(){
        return '【'+this.lackItem+'】'+this.lackContent
    }
    static empty(){
        return new PublicSafeLack({
            id:'',
            lackItem :'',
            lackContent :'',
            notPassReason:'',
            accordLaws:'',
            improvePlan:'',
            status :''
        })
    }
    static getConfig(){
       return [
        { label:'項目' , prop:'lackItem',format:'', mandatory:true, message:'請輸入項目',maxlength:'200'},
        { label:'內容' , prop:'lackContent',format:'textarea',  mandatory:true,message:'請輸入內容',maxlength:'999'},
        { label:'無法合格理由' , prop:'notPassReason',format:'textarea', mandatory:true, message:'請輸入無法合格理由',maxlength:'999'},
        { label:'法令依據' , prop:'accordLaws',format:'textarea', mandatory:true, message:'請輸入法令依據',maxlength:'999'},
        { label:'改善計畫' , prop:'improvePlan',format:'textarea', mandatory:false, message:'請輸入改善計畫',maxlength:'999'},
        { label:'處理進度' , prop:'status',format:'LackStatusOptions', mandatory:true, message:'請選擇處理進度'}
      ]
    }
    static async get (publicSafeId){
        var data = await api.report.apiGetPublicSafeLack(publicSafeId).then(response => {
            return response.result.sort((x,y) => x.id - y.id).map(item=>{ return new PublicSafeLack(item)})
        }).catch(error=>{
            return []
        })
        return data
    }
}

export default PublicSafeLack