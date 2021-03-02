import api from '@/api'

let Report = {
    getBuildingInspection: async function(){
        var data = await api.report.apiGetBuildingInspection().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getInspection: async function(inspectionId){
        var data = await api.report.apiGetInspection(inspectionId).then(response => {
            return response.result[0].imported.toString()
        }).catch(error=>{
            return []
        })
        return data
    },
    postInspection: async function(data){
        var data = await api.report.apiPostInspection(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateInspection: async function(data){
        var data = await api.report.apiPatchInspection(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteInspection: async function(inspectionId){
        var data = await api.report.apiDeleteInspection(inspectionId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    postInspectionFiles: async function(inspectionId,fileId,cover){
        var data = await api.report.apiPostInspectionLackFiles(inspectionId,fileId,cover).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getInspectionLack: async function(inspectionId){
        var data = await api.report.apiGetInspectionLack(inspectionId).then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    postInspectionLack: async function(inspectionId,data){
        var data = await api.report.apiPostInspectionLack(inspectionId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateInspectionLack: async function(data){
        var data = await api.report.apiPatchInspectionLack(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteInspectionLack: async function(inspectionLackId){
        var data = await api.report.apiDeleteInspectionLack(inspectionLackId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getBuildingPublicSafe: async function(){
        var data = await api.report.apiGetBuildingPublicSafe().then(response => {
            var result = response.result.sort((x,y) => x.id - y.id)
            return result
        }).catch(error=>{
            return []
        })
        return data
    },
    getPublicSafe: async function(reportPublicSafeListId){
        var data = await api.report.apiGetPublicSafe(reportPublicSafeListId).then(response => {
            return response.result[0]
        }).catch(error=>{
            return []
        })
        return data
    },
    postPublicSafe: async function(data){
        var data = await api.report.apiPostPublicSafe(data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updatePublicSafe: async function(data){
        var data = await api.report.apiPatchPublicSafe(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deletePublicSafe: async function(reportPublicSafeListId){
        var data = await api.report.apiDeletePublicSafe(reportPublicSafeListId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    getPublicSafeLack: async function(publicSafeId){
        var data = await api.report.apiGetPublicSafeLack(publicSafeId).then(response => {
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    postPublicSafeLack: async function(publicSafeId,data){
        var data = await api.report.apiPostPublicSafeLack(publicSafeId,data).then(response => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updatePublicSafeLack: async function(data){
        var data = await api.report.apiPatchPublicSafeLack(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deletePublicSafeLack: async function(publicSafeId){
        var data = await api.report.apiDeletePublicSafeLack(publicSafeId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
}

export default Report