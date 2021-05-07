import api from '@/api'
import moment from 'moment'
import Parent from './parent'

class Files extends Parent {
    constructor (data) {
        super(data)
        const {  fileOriginalName, uploadTime, extName  } = data
        this.fileOriginalName = fileOriginalName
        this.uploadTime = uploadTime
        this.extName = extName
        return this
    }

    getID(){ return this.id }
    getFileName(){ return this.fileOriginalName }
    getExtName(){ return this.extName }
    getUploadTime(){ 
        return moment(this.uploadTime ).format('YYYY-MM-DD HH:mm')
    }

    clone(data){
        return new Files(data)
    }

    static async delete(id){
        var data = await api.files.apiDeleteFile(id).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
    static async get(fileId){
        var data = await api.files.apiGetFloorImage(fileId).then(response => {
            console.log(response)
            return response
        }).catch(error=>{
            return []
        })
        return data        
    }
}

export default Files