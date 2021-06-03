import req from './https';
import store from '../store'

const report = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //檢修申報
    apiGetBuildingInspection(){ return req('get','/reportInspection/buildings/'+this.getBid()) },
    apiGetInspection(reportInspectionListId){ return req('get','/reportInspection/'+reportInspectionListId) },
    apiPostInspection(data){ return req('post','/reportInspection/'+this.getBid(),data) },
    apiPatchInspection(data){ return req('patch','/reportInspection',data) },
    apiDeleteInspection(reportInspectionListId){ return req('delete','/reportInspection/'+reportInspectionListId) },
    apiGetInspectionSearchPages(data){ return req('post','/index/reportInspection/'+this.getBid()+'/ss',data)  },
    apiPostInspections(data){ return req('post','/reportInspection/'+this.getBid()+'/s',data) },    
    
    //檢修申報缺失
    apiGetInspectionLack(inspectionId){ return req('get','/reportLack/'+inspectionId+'/inspectionLack') },
    apiPostInspectionLack(inspectionId,data){ return req('post','/reportLack/'+inspectionId+'/inspectionLack',data) },
    apiPatchInspectionLack(data){ return req('patch','/reportLack/inspectionLack',data) },
    apiDeleteInspectionLack(inspectionLackId){ return req('delete','/reportLack/'+inspectionLackId+'/inspectionLack') },
    apiPostInspectionLackFiles(autoCreateMaintain,inspectionId,fileId,cover){ 
        return req('post','/reportLack/'+this.getBid()+'/'+autoCreateMaintain+'/'+inspectionId+
        '/inspectionLack/load/'+fileId+'/'+cover) },
    apiGetInspectionLackSearchPages(inspectionId,data){ return req('post','/reportLack/'+inspectionId+'/inspectionLack/ss',data)  },
    apiPostInspectionLacks(inspectionId,data){ return req('post','/reportLack/'+inspectionId+'/inspectionLack/s',data) },    
    
    //公安申報
    apiGetBuildingPublicSafe(){ return req('get','/reportPublicSafe/buildings/'+this.getBid()) },
    apiGetPublicSafe(reportPublicSafeListId){ return req('get','/reportPublicSafe/'+reportPublicSafeListId) },
    apiPostPublicSafe(data){ return req('post','/reportPublicSafe/'+this.getBid(),data) },
    apiPatchPublicSafe(data){ return req('patch','/reportPublicSafe',data) },
    apiDeletePublicSafe(reportPublicSafeListId){ return req('delete','/reportPublicSafe/'+reportPublicSafeListId) },
    apiGetPublicSafeSearchPages(data){ return req('post','/index/reportPublicSafe/'+this.getBid()+'/ss',data)  },
    apiPostPublicSafes(data){ return req('post','/reportPublicSafe/'+this.getBid()+'/s',data) },    
    //公安申報缺失
    apiGetPublicSafeLack(publicSafeId){ return req('get','/reportLack/'+publicSafeId+'/publicSafeLack') },
    apiPostPublicSafeLack(publicSafeId,data){ return req('post','/reportLack/'+publicSafeId+'/publicSafeLack',data) },
    apiPatchPublicSafeLack(data){ return req('patch','/reportLack/publicSafeLack',data) },
    apiDeletePublicSafeLack(publicSafeLackId){ return req('delete','/reportLack/'+publicSafeLackId+'/publicSafeLack') },
    apiGetPublicSafeLackSearchPages(publicSafeId,data){ return req('post','/reportLack/'+publicSafeId+'/publicSafeLack/ss',data)  },
    apiPostPublicSafeLacks(publicSafeId,data){ return req('post','/reportLack/'+publicSafeId+'/publicSafeLack/s',data) },    
    
}

export default report