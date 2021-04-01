import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'id',
            'buildingid',
            'buildinginfo',
            'buildingdevices',
            'buildingoptions',
            'buildingusers',
            'buildingcontactunit',
            'buildingroles',
            'buildingarray',
            'deviceType'
        ]),
    },
    watch: {
        buildingid:{
          handler:async function(){
              if(this.buildingid !== undefined){
                  await this.init()
              }
          },
          immediate:true
        }
    },
}