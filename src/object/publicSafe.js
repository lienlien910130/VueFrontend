import Parent from './parent'
import api from '@/api'
import moment from 'moment'
import Files  from './files'
import PublicSafeLack from './publicSafeLack'

class PublicSafe extends Parent {
    constructor (data) {
        super(data)
        const { declareYear, declareDeadline, declareDate, declareResult, declarationImproveDate,
            checkStartDate, checkEndDate, professName, certificateNumber, isImproved, imported, nextInspectionDate,
            note,linkReportPublicSafeLacks } = data
        var publicSafeLack = linkReportPublicSafeLacks.map(item=>{ return new PublicSafeLack(item)})    
        this.declareYear = declareYear
        this.declareDeadline = declareDeadline
        this.declareDate = declareDate
        this.declareResult = declareResult
        this.declarationImproveDate = declarationImproveDate
        this.checkStartDate = checkStartDate == undefined ? null : checkStartDate
        this.checkEndDate = checkEndDate == undefined ? null : checkEndDate
        this.professName = professName
        this.certificateNumber = certificateNumber
        this.isImproved = isImproved
        this.imported = imported
        this.nextInspectionDate = nextInspectionDate
        this.note = note
        this.linkReportInspectionLacks = publicSafeLack
        return this
    }
    clone(data){
        return new PublicSafe(data)
    }
    getNextInspectionDate(){
        return moment(this.nextInspectionDate).format('YYYY-MM-DD')
    }
    async update(){
        var data = await api.report.apiPatchPublicSafe(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.report.apiPostPublicSafe(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.report.apiDeletePublicSafe(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetPublicSafeFiles(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostPublicSafeFiles(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static empty(){
        return new PublicSafe({
            id:'',
            declareYear : moment().format('YYYY-MM-DD'),
            declareDeadline :null,
            declareDate : moment().format('YYYY-MM-DD'),
            declareResult :'',
            declarationImproveDate :null,
            checkStartDate :null,
            checkEndDate :null,
            professName :'',
            certificateNumber :'',
            isImproved :false,
            imported :0,
            nextInspectionDate :null,
            note :''
        })
    }
    static getTableConfig(){
        return [
             {
                 label: '申報年度',
                 prop: 'declareYear',
                 format:'YYYY',
                 mandatory:true, message:'請選擇年度',isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '申報期限',
                 prop: 'declareDeadline',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇期限',isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '申報日期',
                 prop: 'declareDate',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇日期',isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '檢測日期',
                 prop: 'rangeDate',
                 format:'range',isHidden:false,isSearch:false,mandatory:false,
                 isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true
             },
             {
                 label: '專技人員',
                 prop: 'professName',mandatory:false,format:'searchColumn',
                 isHidden:false,maxlength:'10',isSearch:true,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false
             },
             {
                 label: '證號',
                 prop: 'certificateNumber',mandatory:false,
                 isHidden:false,maxlength:'20',isSearch:true,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false
             },
             {
                 label: '改善期限',
                 prop: 'declarationImproveDate',
                 format:'YYYY-MM-DD',mandatory:true, message:'請選擇日期',
                 isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '改善狀況',
                 prop: 'isImproved',
                 format:'improvedBoolean',
                 type:'boolean',typemessage:'',
                 mandatory:false, trigger:'change',
                 isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '下次檢查日期',
                 prop: 'nextInspectionDate',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇日期',isHidden:false,isSearch:false,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:true
             },
             {
                 label: '備註',
                 prop: 'note',
                 format:'textarea',maxlength:'200',
                 mandatory:false, isHidden:false,isSearch:true,
                 isAssociate:false,isEdit:true,isUpload:true,isExport:true,isBlock:false
             },
            {
                label: '已改善/未改善',
                prop: 'linkReportInspectionLacks',
                format:'openreportlack',
                mandatory:false, type:'array',typemessage:'',
                isHidden:true,isSearch:false,
                isAssociate:false,isEdit:false,isUpload:false,isExport:false,isBlock:true
            }
            //  {
            //      label: '檢附文件',
            //      prop: 'file', mandatory:false,
            //      format:'openfiles',isHidden:true,isSearch:false,
            //      isAssociate:false,isEdit:false,isUpload:false,isExport:false,isBlock:false
            //  },
            //  {
            //      label: '缺失項目',
            //      prop: 'missingContent',mandatory:false,
            //      format:'openlacks',isHidden:true,isSearch:false,
            //      isAssociate:false,isEdit:false,isUpload:false,isExport:false,isBlock:false
            //  }
         ]  
    }
    static async get (){
        var data = await api.report.apiGetBuildingPublicSafe().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{return new PublicSafe(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.report.apiGetPublicSafeSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new PublicSafe(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getColumn(data){
        var data = await api.report.apiGetPublicSafeColumn(data).then(response => {
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.report.apiPostPublicSafes(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default PublicSafe