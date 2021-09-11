import req from './https'
import store from '../store'

const selfDefenseFireMarshalling = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
 
    //自衛消防編組大項
    apiGetAllFireMarshalling(){ return req('get','/selfDefenseFireMarshalling/'+this.getBid()+'/a') },
    apiGetFireMarshalling(selfDefenseFireMarshallingId){ return req('get','/selfDefenseFireMarshalling/'+selfDefenseFireMarshallingId) },
    apiPostFireMarshalling(data){ return req('post','/selfDefenseFireMarshalling',this.getBid(),data) }, 
    apiPatchFireMarshalling(data){ return req('patch','/selfDefenseFireMarshalling',null,data) },
    apiDeleteFireMarshalling(selfDefenseFireMarshallingId){ return req('delete','/selfDefenseFireMarshalling/'+selfDefenseFireMarshallingId) },
    apiGetFireMarshallingSearchPages(data){ return req('post','/selfDefenseFireMarshalling/ss', this.getBid(), data, true)  },
    apiGetAllProcess(selfDefenseFireMarshallingId){ 
        return req('get','/selfDefenseFireMarshalling/SelfDefenseFireMarshallingMgmt/'+selfDefenseFireMarshallingId+'/contingencyProcessList')}, 
    apiGetAccountByRole(roleId){ return req('get','/selfDefenseFireMarshalling/'+roleId+'/accounts') },

    //自衛消防編組細項-班別 p:大項
    apiGetFireMarshallingMgmt(selfDefenseFireMarshallingId){ return req('get','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/'+selfDefenseFireMarshallingId+'/a') },
    apiPostFireMarshallingMgmt(selfDefenseFireMarshallingId,data){ return req('post','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt',selfDefenseFireMarshallingId,data) }, 
    apiPatchFireMarshallingMgmt(data){ return req('patch','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt',null,data) },
    apiDeleteFireMarshallingMgmt(mgmtId){ return req('delete','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/'+mgmtId) },
    apiGetFireMarshallingMgmtSearchPages(selfDefenseFireMarshallingId,data){ 
        return req('post','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/ss', selfDefenseFireMarshallingId, data)  },
    apiPostFireMarshallingMgmts(selfDefenseFireMarshallingId,data){ 
        data.forEach(element => {
            element.parentId = selfDefenseFireMarshallingId
        })
        return req('post','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/s', null, data) 
    },
    //細項的流程資料 p:細項
    apiGetContingencyProcess(mgmtId){ return req('get','/selfDefenseFireMarshalling/ContingencyProcessMgmt/'+mgmtId+'/a') },
    apiPostContingencyProcess(mgmtId,data){ return req('post','/selfDefenseFireMarshalling/ContingencyProcessMgmt/check',mgmtId,data) }, 
    apiPatchContingencyProcess(mgmtId,data){ return req('patch','/selfDefenseFireMarshalling/ContingencyProcessMgmt/check',mgmtId,data) },
    apiDeleteContingencyProcess(processId){ return req('delete','/selfDefenseFireMarshalling/ContingencyProcessMgmt/'+processId) },
    apiGetContingencyProcessSearchPages(mgmtId,data){ 
        return req('post','/selfDefenseFireMarshalling/selfDefenseFireMarshallingMgmt/ss', mgmtId, data)  },
    //用流程圖ID取得檔案JSON
    apiGetContingencyProcessJson(processId){ return req('get','/selfDefenseFireMarshalling/ContingencyProcessMgmt/'+processId+'/f') },
    //儲存流程圖檔案    
    apiPostContingencyProcessJson(processId,data){ 
        return req('upload','/selfDefenseFireMarshalling/ContingencyProcessMgmt/'+this.getUid()+'/'+processId+'/upload', null,
        data) },
}


export default selfDefenseFireMarshalling