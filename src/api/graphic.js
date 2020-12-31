import req from './https';
import store from '../store'

const graphic = {
    getUid(){ return store.getters.id},
    getBid(){ return store.getters.buildingid},
    //用檔案id找資料
    apiGetFileIdToGraphicFile(supervisoryControlSystemId){ 
        return req('get','/drawingControl/'+supervisoryControlSystemId+'/supervisoryControlSystems') },
    //用樓層id找資料
    apiGetFloorIdToGraphicFile(floorId){ 
        return req('get','/drawingControl/floors/'+floorId+'/supervisoryControlSystems') },
    apiPostGraphicFile(floorId,data){ 
        return req('post','/drawingControl/'+this.getUid()+'/floors/'+floorId+'/supervisoryControlSystems',data) },
    apiDeleteGraphicFile(supervisoryControlSystemId){ 
        return req('delete','/drawingControl/'+supervisoryControlSystemId+'/supervisoryControlSystems') },
}

export default graphic