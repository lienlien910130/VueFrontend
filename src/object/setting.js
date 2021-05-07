import api from '@/api'

let Setting = {
    getAllOption: async function(){
        var data = await api.setting.apiGetBuildingOptions().then(response => {
            console.log()
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    getOption: async function(optionId){
        var data = await api.setting.apiGetOptionById(optionId).then(response => {
            return response.result
        }).catch(error=>{
            return []
        })
        return data
    },
    postOption: async function(data){
        var data = await api.setting.apiPostOption(data).then(response => {
            return response.result
        }).catch(error=>{
            return null
        })
        return data
    },
    updateOption: async function(data){
        var data = await api.setting.apiPatchOption(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    deleteOption: async function(optionId){
        var data = await api.setting.apiDeleteOption(optionId).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    }
}
export default Setting
