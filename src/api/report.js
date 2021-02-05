import req from './https';
import store from '../store'

const report = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //檢修申報
    apiGetBuildingInspection(){ return req('get','/ReportInspection/buildings/'+this.getBid()+'/inspection') },
    apiGetInspection(inspectionId){ return req('get','/ReportInspection/'+inspectionId+'/inspection') },
    apiPostInspection(data){ return req('post','/ReportInspection/'+this.getBid()+'/inspection',data) },
    apiPatchInspection(data){ return req('patch','/ReportInspection/inspection',data) },
    apiDeleteInspection(inspectionId){ return req('delete','/ReportInspection/'+inspectionId+'/inspection') },
    
    //檢修申報缺失
    apiGetInspectionLack(inspectionId){ return req('get','/reportLack/'+inspectionId+'/inspectionLack') },
    apiPostInspectionLack(inspectionId,data){ return req('post','/reportLack/'+inspectionId+'/inspectionLack',data) },
    apiPatchInspectionLack(data){ return req('patch','/reportLack/inspectionLack',data) },
    apiDeleteInspectionLack(inspectionLackId){ return req('delete','/reportLack/'+inspectionLackId+'/inspectionLack') },
    apiPostInspectionLackFiles(inspectionId,fileId,cover){ 
        return req('post','/reportLack/'+inspectionId+'/inspectionLack/load/'+fileId+'/'+cover) },
    
        //公安申報
    apiGetBuildingPublicSafe(){ return req('get','/ReportPublicSafe/buildings/'+this.getBid()+'/publicSafe') },
    apiGetPublicSafe(publicSafeId){ return req('get','/ReportPublicSafe/'+publicSafeId+'/publicSafe') },
    apiPostPublicSafe(data){ return req('post','/ReportPublicSafe/'+this.getBid()+'/publicSafe',data) },
    apiPatchPublicSafe(data){ return req('patch','/ReportPublicSafe/publicSafe',data) },
    apiDeletePublicSafe(publicSafeId){ return req('delete','/ReportPublicSafe/'+publicSafeId+'/publicSafe') },

    //公安申報缺失
    apiGetPublicSafeLack(publicSafeId){ return req('get','/reportLack/'+publicSafeId+'/publicSafeLack') },
    apiPostPublicSafeLack(publicSafeId,data){ return req('post','/reportLack/'+publicSafeId+'/publicSafeLack',data) },
    apiPatchPublicSafeLack(data){ return req('patch','/reportLack/publicSafeLack',data) },
    apiDeletePublicSafeLack(publicSafeLackId){ return req('delete','/reportLack/'+publicSafeLackId+'/publicSafeLack') },
   
}

export default report