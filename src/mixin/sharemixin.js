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
            'buildingfloors',
            'deviceType',
            'fullscreen',
            'device',
            'menu',
            'wsmsg'
        ])
    },
    watch: {
        buildingid:{
          handler:async function(){
              if(this.buildingid !== undefined){
                  await this.init()
                  this.device == 'desktop' ? this.changeTable(true) : this.changeTable(false)
              }
          },
          immediate:true
        },
        fullscreen:{
            handler:async function(){
               this.fullscreen == false ? this.blockwrapperheight = '720px' : this.blockwrapperheight = '890px'
            },
            immediate:true
        },
        device:{
            handler:async function(){
                this.device == 'desktop' ? this.changeTable(true) : this.changeTable(false)
            }
        }
    },
    data() {
        return {
            blockwrapperheight:'',
            origin:[],
            selectSetting:[],
            isTable:true
        }
    }
}