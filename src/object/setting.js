import api from '@/api'

let Setting = {
    buildingOptions:[],
    
    getAllOption: async function(){
        var data = await api.setting.apiGetBuildingOptions().then(response => {
            this.buildingOptions = response.result.sort((x,y) => x.id - y.id)
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
}
export default Setting
