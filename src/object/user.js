import api from '@/api'

let User = {
    user : {},

    getUserDefaultState : function() {
        return {
            name: '',
            identityCard: '',
            birthday: '',
            callNumber: '',
            cellPhoneNumber: '',
            emergencyNumber: '',
            email: '',
            note: '',
            id: ''
        }
    },
    getUser: async function(userId){
        var data = await api.building.apiGetUser(userId).then(async(response) => {
            return response.result[0]
        })
        return data
    },
    createUser: async function(data){
        var data = await api.building.apiPostUser(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    updateUser: async function(data){
        var data = await api.building.apiPatchUser(data).then(async(response) => {
            return true
        }).catch(error=>{
            return false
        })
        return data
    },
    // getBuildingUser: async function(){
    //     await api.building.apiGetAllBuildingOfUser().then(response => {
    //         response.result.sort((x,y) => x.id - y.id).forEach(item=>{
    //             var _temp = {
    //               id: item.id,
    //               label: item.name,
    //               value: item.id
    //             }
    //             this.user.push(_temp)
    //         })
    //     })
    // },
}
export default User
