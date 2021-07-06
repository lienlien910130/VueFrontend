import { mapGetters } from 'vuex'
import moment from 'moment'

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
                'deviceType',
                'device',
                'fullscreen'
            ]),
            dataStr(){ //日期
                return function (a,b) {
                    if(a !== null && a !== undefined){
                        return moment(a).format(b)
                    }else{
                        return ''
                    }
                }
            },
            multipleStr(){ //多個
                return function (type,value) {
                    var array = []
                    var temp = []
                    type === 'user' ?  temp = this.buildingusers : 
                    type === 'contactunit' ?  temp = this.buildingcontactunit : 
                    type === 'floorOfHouse' ? temp = this.selectData : this.deviceList
                    if(value !== null && value !== undefined ){
                        value.forEach(item=>{
                            var data = temp.filter(element=>{
                                return item.id == element.id
                            })
                            if(data.length>0){
                                type === 'floorOfHouse' ? array.push(data[0].houseNumber) : array.push(data[0].name)
                            }
                        })
                        return array.toString()
                    }else{
                        return ""
                    }
                }   
            },
            label() {
                if (this.device === 'mobile') {
                    return 'top'
                } else {
                    return 'left'
                }
            },
            changeOptionName(){ //設定名稱
                return function (value) {
                    if(value !== null){
                        let _array = this.buildingoptions.filter((item, index) => 
                            item.id == value 
                        )
                        return _array.length !== 0 ? _array[0].textName : ''
                    }
                    return ""
                }
            },
            changeContainUnit(){ //廠商名稱
                return function (val) {
                  if(val !== null){
                    return val.map(item=>{ return item.getName() }).toString()
                  }
                  return ''
                } 
            },
            changeUserName(){ //住戶名稱
                return function (val) {
                    if(val !== null){
                      return val.map(item=>{ return item.getName() }).toString()
                    }
                    return ''
                } 
            },
            stringToBr(){
                return function (a) {
                    return a.replace(/{ln}/g, "<br/>")
                }
            }
        },
        watch:{
            fullscreen:{
                handler:async function(){
                    //this.fullscreen == true ? this.infiniteheight = '800px' : this.infiniteheight = '600px'
                    if(this.fullscreen == true){
                        this.title == 'committee' || this.title == 'contactUnit' || 
                        this.title == 'floorOfHouse' || this.title == 'user' ? 
                        this.infiniteheight = 710 : this.infiniteheight= 780
                    }else{
                        this.title == 'committee' || this.title == 'contactUnit' || 
                        this.title == 'floorOfHouse' || this.title == 'user'   ? 
                        this.infiniteheight = 510 : this.infiniteheight = 640
                    }
                    this.height = (this.infiniteheight -10).toString() + 'px'
                },
                immediate:true
            }
        },
        filters:{
            changeBoolean: function(val,format) {
                if(val == true){
                    switch(format){
                        case 'accountStatusSelect':
                            return '啟用'
                        case 'collaborateBoolean':
                            return '配合中'
                        case 'removableSelect':
                            return '允許'
                        case 'improvedBoolean':
                            return '已改善'
                        case 'systemUsedBoolean':
                            return '已設置'
                    }
                }else{  
                    switch(format){
                        case 'accountStatusSelect':
                            return '禁用'
                        case 'collaborateBoolean':
                            return '未配合'
                        case 'removableSelect':
                            return '禁止'
                        case 'improvedBoolean':
                            return '未改善'
                        case 'systemUsedBoolean':
                            return '未設置'
                    }
                }
            }
        },
        data() {
            return {
                height:'',
                infiniteheight:''
            }
        }
}