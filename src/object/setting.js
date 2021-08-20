import api from '@/api'

let Setting = {
    getAllOption: async function(){
        var data = await api.setting.apiGetBuildingOptions().then(response => {
            return response.result.sort((x,y) => x.id - y.id)
        }).catch(error=>{
            return []
        })
        return data
    },
    // getOption: async function(optionId){
    //     var data = await api.setting.apiGetOptionById(optionId).then(response => {
    //         return response.result
    //     }).catch(error=>{
    //         return []
    //     })
    //     return data
    // },
    postOption: async function(data){
        var temp = JSON.parse(JSON.stringify(data))
        temp.textName = '{Check}'+temp.textName
        temp.classType = '{Check}'+temp.classType
        var data = await api.setting.apiPostOption(temp).then(response => {
            return response.result
        }).catch(error=>{
            return {}
        })
        return data
    },
    updateOption: async function(data){
        var temp = JSON.parse(JSON.stringify(data))
        temp.textName = '{Check}'+temp.textName
        temp.classType = '{Check}'+temp.classType
        var data = await api.setting.apiPatchOption(temp).then(async(response) => {
            return response.result
        }).catch(error=>{
            return {}
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
    },
//     checkOption:async function(data){
//         var data = await api.setting.apiCheckOption(data).then(response => {
//             return true
//         }).catch(error=>{
//             return false
//         })
//         return data
//     }
 }
export default Setting
