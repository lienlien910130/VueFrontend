import req from './https';
import store from '../store'

const drawingControl = {
    getBid(){ return store.getters.buildingid},
    //取得圖控樓層的點位
    apiGetDrawingAddress(floorId){ return req( 'get','/drawingControl/'+floorId+'/address' ) },
    //圖控資料表
    apiGetElement(codeContentId){ return req('get','/drawingControl/element/'+codeContentId+'/a')},
    apiPostElement(codeContentId,data){ return req('post','/drawingControl/element',codeContentId,data)},
    apiPatchElement(data){ return req('patch','/drawingControl/element',null,data)},
    apiDeleteElement(elementId){ return req('delete','/drawingControl/element'+elementId)}
}

export default drawingControl