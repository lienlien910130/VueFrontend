import req from './https'
import store from '../store'

const emergency = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //班別
    apiGetProtectionGroupMgmt(protectionGroupId){ return req('get','/protectionGroupMgmt/'+protectionGroupId) },
    apiPostProtectionGroupMgmt(data){ return req('post','/protectionGroupMgmt/check',this.getBid(),data) }, 
    apiPatchProtectionGroupMgmt(data){ return req('patch','/protectionGroupMgmt/check',this.getBid(),data) },
    apiDeleteProtectionGroupMgmt(protectionGroupId){ return req('delete','/protectionGroupMgmt/'+protectionGroupId) },
    apiGetProtectionGroupMgmtSearchPages(data){ return req('post','/protectionGroupMgmt/ss', null, data)  },
    apiPostProtectionGroupMgmts(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/protectionGroupMgmt/check/s', null, data) 
    }, 
    //自衛消防編組
    apiGetSelfDefenseFireMarshallingMgmt(selfDefenseFireMarshallingMgmtId){ return req('get','/selfDefenseFireMarshallingMgmt/'+selfDefenseFireMarshallingMgmtId) },
    apiPostSelfDefenseFireMarshallingMgmt(data){ return req('post','/selfDefenseFireMarshallingMgmt/check',this.getBid(),data) }, 
    apiPatchSelfDefenseFireMarshallingMgmt(data){ return req('patch','/selfDefenseFireMarshallingMgmt/check',this.getBid(),data) },
    apiDeleteSelfDefenseFireMarshallingMgmt(selfDefenseFireMarshallingMgmtId){ return req('delete','/selfDefenseFireMarshallingMgmt/'+selfDefenseFireMarshallingMgmtId) },
    apiGetSelfDefenseFireMarshallingMgmtSearchPages(data){ return req('post','/selfDefenseFireMarshallingMgmt/ss', null, data)  },
    apiPostSelfDefenseFireMarshallingMgmts(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/selfDefenseFireMarshallingMgmt/check/s', null, data) 
    },
}


export default emergency