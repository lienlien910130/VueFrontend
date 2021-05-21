import Parent from './parent'
import api from '@/api'
import Files  from './files'
import moment from 'moment'

class Inspection extends Parent {
    constructor (data) {
        super(data)
        const { declareYear, declareDeadline, declareDate, declareResult, declarationImproveDate,
            checkStartDate, checkEndDate, professName, certificateNumber, isImproved, imported, nextInspectionDate,
            note } = data
        this.declareYear = declareYear
        this.declareDeadline = declareDeadline
        this.declareDate = declareDate
        this.declareResult = declareResult
        this.declarationImproveDate = declarationImproveDate
        this.checkStartDate = checkStartDate
        this.checkEndDate = checkEndDate
        this.professName = professName
        this.certificateNumber = certificateNumber
        this.isImproved = isImproved
        this.imported = imported
        this.nextInspectionDate = nextInspectionDate
        this.note = note
        return this
    }
    clone(data){
        return new Inspection(data)
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
            lack:''
        })
    }
    static getConfig(){
       return [
            {
                label: '申報年度',
                prop: 'declareYear',
                format:'YYYY',
                mandatory:true, message:'請選擇年度',isSelect:true,options:[],
                selectType:'dateOfYear',select:'',isSort:true,isHidden:false
            },
            {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇期限',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true,isHidden:false
            },
            {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true,isHidden:false
            },
            {
                label: '檢測日期',
                prop: 'rangeDate',
                format:'range',isSelect:false,isSort:false,isHidden:true,
            },
            {
                label: '專技人員',
                prop: 'professName',isSelect:true,options:[],
                        selectType:'',select:'',isSort:true,isHidden:true,maxlength:'10'
            },
            {
                label: '證號',
                prop: 'certificateNumber',isSelect:false,isSort:true,isHidden:true,maxlength:'20'
            },
            {
                label: '改善期限',
                prop: 'declarationImproveDate',
                format:'YYYY-MM-DD',mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                    selectType:'dateOfDate',select:'',isSort:true,isHidden:true
            },
            {
                label: '改善狀況',
                prop: 'isImproved',
                format:'tag',
                type:'boolean',
                mandatory:false, isPattern:false,trigger:'change',isSelect:true,options:[],
                selectType:'reportBool',select:'',isSort:true,isHidden:false
            },
            {
                label: '下次檢查日期',
                prop: 'nextInspectionDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true,isHidden:false
            },
            {
                label: '備註',
                prop: 'note',
                format:'textarea',
                mandatory:false, isPattern:false,isSelect:false,isSort:false,isHidden:true
            },
            {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false,isHidden:false
            },
            {
                label: '缺失項目',
                prop: 'missingContent',
                format:'openlacks',isSelect:false,isSort:false,isHidden:false
            }
        ]  
    }
    static getTableConfig(){
        return [
             {
                 label: '申報年度',
                 prop: 'declareYear',
                 format:'YYYY',
                 mandatory:true, message:'請選擇年度',isHidden:false,isSearch:false
             },
             {
                 label: '申報期限',
                 prop: 'declareDeadline',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇期限',isHidden:false,isSearch:false
             },
             {
                 label: '申報日期',
                 prop: 'declareDate',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇日期',isHidden:false,isSearch:false
             },
             {
                 label: '檢測日期',
                 prop: 'rangeDate',
                 format:'range',isHidden:false,isSearch:false
             },
             {
                 label: '專技人員',
                 prop: 'professName',isHidden:false,maxlength:'10',isSearch:true
             },
             {
                 label: '證號',
                 prop: 'certificateNumber',isHidden:false,maxlength:'20',isSearch:true
             },
             {
                 label: '改善期限',
                 prop: 'declarationImproveDate',
                 format:'YYYY-MM-DD',mandatory:true, message:'請選擇日期',isHidden:false,isSearch:false
             },
             {
                 label: '改善狀況',
                 prop: 'isImproved',
                 format:'tag',
                 type:'boolean',
                 mandatory:false, isPattern:false,trigger:'change',isHidden:false,isSearch:false
             },
             {
                 label: '下次檢查日期',
                 prop: 'nextInspectionDate',
                 format:'YYYY-MM-DD',
                 mandatory:true, message:'請選擇日期',isHidden:false,isSearch:false
             },
             {
                 label: '備註',
                 prop: 'note',
                 format:'textarea',
                 mandatory:false, isPattern:false,isHidden:false,isSearch:true
             },
             {
                 label: '檢附文件',
                 prop: 'file',
                 format:'openfiles',isHidden:true,isSearch:false
             },
             {
                 label: '缺失項目',
                 prop: 'missingContent',
                 format:'openlacks',isHidden:true,isSearch:false
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