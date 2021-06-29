import Parent from './parent'
import api from '@/api'
import Files  from './files'
import moment from 'moment'

class Inspection extends Parent {
    constructor (data) {
        super(data)
        const { declareYear, declareDeadline, declareDate, declareResult, declarationImproveDate,
            checkStartDate, checkEndDate, professName, certificateNumber, isImproved, imported, nextInspectionDate,
            note,completedCount,allCount } = data
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
        this.completedCount = completedCount
        this.allCount = allCount
        return this
    }
    clone(data){
        return new Inspection(data)
    }
    getNextInspectionDate(){
        return moment(this.nextInspectionDate).format('YYYY-MM-DD')
    }
    async update(){
        var data = await api.report.apiPatchInspection(this).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async create(){
        var data = await api.report.apiPostInspection(this).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async delete(){
        var data = await api.report.apiDeleteInspection(this.id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async files(){
        var data = await api.files.apiGetInspectionFiles(this.id).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Files(item)})
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    async createfiles(formData){
        var data = await api.files.apiPostInspectionFiles(this.id,formData).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    async getlackfileID(){
        var data = await api.report.apiGetInspection(this.id).then(response => {
            return response.result[0].imported.toString()
        }).catch(error=>{
            return []
        })
        return data
    }
    async settinglackfile(autoCreateMaintain,fileId,cover){
        var data = await api.report.apiPostInspectionLackFiles(autoCreateMaintain,this.id,fileId,cover).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static empty(){
        return new Inspection({
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
            note :'',
            completedCount:0,
            allCount:0
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
                label: '已改善缺失',
                prop: 'completedCount',
                mandatory:false, isHidden:true,isSearch:false,type:'number',typemessage:'',
                isAssociate:false,isEdit:false,isUpload:false,isExport:true,isBlock:true
            },
            {
                label: '缺失項目總數',
                prop: 'allCount',
                mandatory:false, isHidden:true,isSearch:false,type:'number',typemessage:'',
                isAssociate:false,isEdit:false,isUpload:false,isExport:true,isBlock:true
            }
        ]    
    }
    static async get (){
        var data = await api.report.apiGetBuildingInspection().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id).map(item => { 
                return new Inspection(item)
            })
            return result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getSearchPage(data){
        var data = await api.report.apiGetInspectionSearchPages(data).then(response => {
            response.result = response.result.sort((x,y) => x.id - y.id).map(item=>{ return new Inspection(item)})
            return response
        }).catch(error=>{
            return []
        })
        return data
    }
    static async getColumn(data){
        var data = await api.report.apiGetInspectionColumn(data).then(response => {
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    }
    static async postMany(data){
        var data = await api.report.apiPostInspections(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}

export default Inspection