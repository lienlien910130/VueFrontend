import api from '@/api'
import Parent from './parent' 

class MaintainManagementList extends Parent {
    constructor (data) {
        super(data)
        const { name, createdDate,linkMaintains  } = data
        var array = []
        linkMaintains.forEach(element => {
            array.push(new MaintainManagement(element))
        })
        this.name = name
        this.createdDate = createdDate
        this.linkMaintains = array
    }
    static getConfig(){
        return [
              {
                label: '名稱',
                prop: 'name',
                mandatory:true, message:'請輸入名稱',isSelect:false,isSort:true,isHidden:false,maxlength:'20'
              },
              {
                label: '建立時間',
                prop: 'createdDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇建立時間',isSelect:true,options:[],
                        selectType:'dateOfDate',select:'',isSort:true,isHidden:false
              },
              {
                label: '細項',
                prop: 'linkMaintains',
                format:'openmaintain',
                mandatory:false, message:'請選擇',isSelect:false,isSort:false,type:'array',typemessage:'',isHidden:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false,isHidden:false
              },
            ]
    }
    //大項
    static async getBuildingMaintainList () {
        var data = await api.device.apiGetBuildingMaintainsList().then(response => {
            var array = []
            response.result.sort((x,y) => x.id - y.id).forEach(element => {
                array.push(new MaintainManagementList(element))
            })
            return array
        }).catch(error=>{
            return []
        })
        return data
    }
}

class MaintainManagement extends Parent {
    constructor (data) {
        super(data)
        const { dateOfFailure, dateOfCallRepair,completedTime,processStatus,processContent,note,
            linkDevices,linkInspectionLacks,linkContactUnits,id  } = data
        this.dateOfFailure = dateOfFailure
        this.dateOfCallRepair = dateOfCallRepair
    }
    
}

export { MaintainManagementList,MaintainManagement }