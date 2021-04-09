import api from '@/api'

class Files {
    constructor (data) {
        const { id, fileOriginalName, uploadTime, extName  } = data
        this.id = id
        this.fileOriginalName = fileOriginalName
        this.uploadTime = uploadTime
        this.extName = extName
        return this
    }

    getID(){ return this.id }
    getFileName(){ return this.fileOriginalName }
    getExtName(){ return this.extName }

    getInfo(){
        return this
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
}

// let Files = {
//     downloadFiles: async function(fileId){
//         var data = await api.files.apiGetFile(fileId).then(response => {
//             console.log(response)
//             return response.result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     getBuildingFiles: async function(){
//         var data = await api.files.apiGetBuildingFiles().then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingFiles: async function(formData){
//         var data = await api.files.apiPostBuildingFiles(formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingFloorFiles: async function(floorId){
//         var data = await api.files.apiGetFloorFiles(floorId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingFloorFiles: async function(floorId,formData){
//         var data = await api.files.apiPostFloorFiles(floorId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingFloorOfHouseFiles: async function(usageofFloorId){
//         var data = await api.files.apiGetFloorOfHouseFiles(usageofFloorId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingFloorOfHouseFiles: async function(floorofhouseId,formData){
//         var data = await api.files.apiPostFloorOfHouseFiles(floorofhouseId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingFloorImage: async function(fileId){
//         var data = await api.files.apiGetFloorImage(fileId).then(response => {
//             return response
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     getBuildingInspectionFiles: async function(inspectionId){
//         var data = await api.files.apiGetInspectionFiles(inspectionId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingInspectionFiles: async function(inspectionId,formData){
//         var data = await api.files.apiPostInspectionFiles(inspectionId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingPublicSafeFiles: async function(reportPublicSafeListId){
//         var data = await api.files.apiGetPublicSafeFiles(reportPublicSafeListId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingPublicSafeFiles: async function(reportPublicSafeListId,formData){
//         var data = await api.files.apiPostPublicSafeFiles(reportPublicSafeListId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingMaintainListFiles: async function(maintainListId){
//         var data = await api.files.apiGetMaintainsListFiles(maintainListId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             console.log(JSON.stringify(response))
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingMaintainListFiles: async function(maintainListId,formData){
//         var data = await api.files.apiPostMaintainsListFiles(maintainListId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getBuildingMaintainFiles: async function(maintainId){
//         var data = await api.files.apiGetMaintainsFiles(maintainId).then(response => {
//             var result = response.result.sort((x,y) => x.id - y.id)
//             return result
//         }).catch(error=>{
//             return []
//         })
//         return data
//     },
//     postBuildingMaintainFiles: async function(maintainListId,maintainId,formData){
//         var data = await api.files.apiPostMaintainsFiles(maintainListId,maintainId,formData).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
//     getFloorGraphicFiles: async function(floorId){
//         var data = await api.files.apiGetFloorIdToGraphicFile(floorId).then(response => {
//             return response.result.codeContent
//         }).catch(error=>{
//             return null
//         })
//         return data
//     },
//     postFloorGraphicFiles: async function(floorId,data){
//         var data = await api.files.apiPostGraphicFile(floorId,data).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
    
//     deleteFiles: async function(id){
//         var data = await api.files.apiDeleteFile(id).then(async(response) => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     },
// }

export default Files