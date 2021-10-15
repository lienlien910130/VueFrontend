import req from './https'
import store from '../store'

const nodeList = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
 
    //samplenode
    apiGetAllSampleNode(){ return req('get','/CSampleNodeListMgmt/'+this.getBid()+'/a') },
    apiPostSampleNode(data){ return req('post','/CSampleNodeListMgmt/check',this.getBid(),data) }, 
    apiPatchSampleNode(data){ return req('patch','/CSampleNodeListMgmt/check',this.getBid(),data) },
    apiDeleteSampleNode(sampleNodeId){ return req('delete','/CSampleNodeListMgmt/'+sampleNodeId) },
    apiGetSampleNodeSearchPages(data){ return req('post','/CSampleNodeListMgmt/ss',this.getBid(), data, true)  },
    apiPostSampleNodes(data){ 
        data.forEach(element => {
            element.parentId = this.getBid()
        })
        return req('post','/CSampleNodeListMgmt/check/s', null, data) 
    },
    //節點
    apiGetAllNode(processId){ return req('get','/selfDefenseFireMarshalling/CNodeMgmt/'+processId+'/a') },
    apiPostNode(processId,data){ return req('post','/selfDefenseFireMarshalling/CNodeMgmt',processId,data) }, 
    apiPatchNode(processId,data){ return req('patch','/selfDefenseFireMarshalling/CNodeMgmt',processId,data) },
    apiDeleteNode(nodeId){ return req('delete','/selfDefenseFireMarshalling/CNodeMgmt/'+nodeId) },
    apiPostNodes(processId,data){ 
        data.forEach(element => {
            element.parentId = processId
        })
        return req('post','/selfDefenseFireMarshalling/CNodeMgmt/s', null, data) 
    },
    //選項-線
    apiGetAllOptions(nodeId){ return req('get','/selfDefenseFireMarshalling/COptionMgmt/'+nodeId+'/a') },
    apiPostOption(nodeId,data){ return req('post','/selfDefenseFireMarshalling/COptionMgmt',nodeId,data) }, 
    apiPatchOption(nodeId,data){ return req('patch','/selfDefenseFireMarshalling/COptionMgmt',nodeId,data) },
    apiDeleteOption(optionId){ return req('delete','/selfDefenseFireMarshalling/COptionMgmt/'+optionId) },
    apiPostOptions(processId,data){ 
        data.forEach(element => {
            element.parentId = processId
        })
        return req('post','/selfDefenseFireMarshalling/COptionMgmt/s', null, data) 
    },
    //用流程id取得所有的options
    apiGetAllOptionsOfProcess(processId){ return req('get','/selfDefenseFireMarshalling/contingencyProcessMgmt/'+processId+'/nodeOptions') },
}


export default nodeList