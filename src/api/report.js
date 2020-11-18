import req from './https';
import store from '../store'

const report = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //檢修申報
    apiGetInspection(){ return req('get','/report/'+this.getBid()+'/inspection') },
    apiPostInspection(data){ return req('post','/report/'+this.getBid()+'/inspection',data) },
    apiPatchInspection(data){ return req('patch','/report/inspection',data) },
    apiDeleteInspection(inspectionId){ return req('delete','/report/'+inspectionId+'/inspection') },
    
    //檢修申報缺失
    apiGetInspectionLack(inspectionId){ return req('get','/reportLack/'+inspectionId+'/inspectionLack') },
    apiPostInspectionLack(inspectionId,data){ return req('post','/reportLack/'+inspectionId+'/inspectionLack',data) },
    apiPatchInspectionLack(data){ return req('patch','/reportLack/inspectionLack',data) },
    apiDeleteInspectionLack(inspectionLackId){ return req('delete','/reportLack/'+inspectionLackId+'/inspectionLack') },
    apiPostInspectionLackFiles(inspectionId,fileId){ return req('post','/reportLack/'+inspectionId+'/inspectionLack/load/'+fileId) },


}

export default report