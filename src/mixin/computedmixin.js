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
                    if(a !== null){
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
            changeRoles(){ //角色名稱
                return function (val) {
                  if(val !== null){
                    return val.map(item=>{ 
                        return item.getName() }).toString()
                  }
                  return ''
                } 
            },
            changeInspectionLack(){ //檢修申報缺失內容
                return function (val) {
                  if(val !== null){
                    return val.map(item=>{ return item.getName() }).toString()
                  }
                  return ''
                }
            },
            changeDevice(){ //設備名稱
                return function (val) {
                    if(val !== null){
                        return val.map(item=>{ return item.getName() }).toString()
                    }
                    return ''
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
            changeBuilding(){ //建築物名稱
                return function (val) {
                    if(val !== null){
                      return val.map(item=>{ return item.getName() }).toString()
                    }
                    return ''
                } 
            },
            changeUsageOfFloor(){ //門牌
                return function (val) {
                    if(val !== null){
                      return val.map(item=>{ return item.getName() }).toString()
                    }
                    return ''
                } 
            },
            changeUsageOfFloorUsersName(){ //門牌底下的使用者名稱
                return function (val) {
                    if(val !== null){
                        return val.map(item => { return item.getName()}).toString()
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
                        this.title == 'committee' || this.title == 'contactUnit' || this.title == 'floorOfHouse' ? 
                        this.infiniteheight = '710px' : this.infiniteheight = '800px'
                    }else{
                        this.title == 'committee' || this.title == 'contactUnit' || this.title == 'floorOfHouse'  ? 
                        this.infiniteheight = '550px' : this.infiniteheight = '600px'
                    }
                },
                immediate:true
            }
        },
        data() {
            return {
                infiniteheight:''
            }
        },
        methods: {
            toAnotherPage(page,data,block){
                console.log(page,data,block)
                this.$router.push({ name: page, params: { block:block, target: data }})
            }
        },
}