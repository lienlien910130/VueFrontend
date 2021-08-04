import { mapGetters } from 'vuex'
import { removeDuplicates } from '@/utils/index'
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
            'buildingfloors',
            'deviceType',
            'fullscreen',
            'device',
            'menu',
            'wsmsg',
            'wsuserId'
        ]),
        TimeOptions(){ //設定名稱
            return function (value) {
                if(value !== null){
                    let array = this.buildingoptions.filter((item, index) => 
                        item.classType == value 
                    ).sort(function(x,y){
                        var _data1 = new Date(x.textName)
                        var _data2 = new Date(y.textName)
                        return  _data1 - _data2
                    })
                    var datetime = moment(new Date()).valueOf()
                    var index = array.findIndex((element)=>{
                        var data = moment(element.textName).valueOf()
                        return  (datetime-data)<0
                    })
                    return index !== -1 ? array[index].textName : ''
                }
                return ""
            }
        }
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
        device:{
            handler:async function(){
                this.device == 'desktop' ? this.changeTable(true) : this.changeTable(false)
            }
        }
    },
    data() {
        return {
            origin:[],
            selectSetting:[], //儲存篩選資料
            isTable:true,
            filterArray:[],
            exportExcelData:[]
        }
    },
    methods: {
        
        //表格篩選
        // async getFilterItems(otherConfig = null){
        //     var arr = otherConfig == null ? this.tableConfig : otherConfig
        //     var block = otherConfig == null ? this.blockData : this.downData
        //     var config = arr.filter(item=>item.isHidden == false).map(function(obj) {
        //         var rObj = {}
        //         rObj.label = obj.label
        //         rObj.prop = obj.prop
        //         rObj.format = obj.format
        //         return rObj
        //     })
        //     var array = []
        //     var self = this
        //     config.filter(item => item.prop !== undefined).forEach(element => {
        //         if(element.prop.indexOf('link') !== -1){
        //             var data = this.getObject(block,element.prop)
        //             var _con = []
        //             for(let element of data){
        //                 _con.push(element)
        //             }
        //             var concatarray = _con.reduce(
        //                 function(a, b) {
        //                   return a.concat(b)
        //                 },[]
        //             )
        //             concatarray = removeDuplicates(concatarray,'value')
        //             array.push({
        //                 label:element.label,
        //                 text:element.label,
        //                 value:element.prop,
        //                 children:concatarray
        //             })
        //         }else{
        //             var list = this.getItems(block,element.prop,element.format)
        //             list = list.sort(function(str1,str2){ 
        //                 var s1 = str1.value == null ? '' : str1.value
        //                 var s2 = str2.value == null ? '' : str2.value
        //                 return self.sortRule(s1,s2)
        //             })
        //             array.push({
        //                 label:element.label,
        //                 text:element.label,
        //                 value:element.prop,
        //                 children:list
        //             })
        //         }
        //     })
        //     otherConfig == null ? this.selectSetting = array :
        //         this.downselectSetting = array
        // },
        // getItems(block,prop,format){
        //     var list = Object.values(block).map(item => {
        //         if(format == 'YYYY' || format == 'YYYY-MM-DD'){ //日期
        //             var str = item[prop] !== null && item[prop] !== undefined ?
        //             moment(item[prop]).format(format) : '尚未設定值'
        //             return { label: str,text: str, value: item[prop] }
        //         }else if(format == 'range'){ //檢測日期
        //             var str 
        //             if(item['checkStartDate'] !== null && item['checkStartDate'] !== undefined){
        //                 str = '起始時間:'+moment(item['checkStartDate']).format('YYYY-MM-DD')
        //             }else{
        //                 str = '尚未設定值'
        //             }
        //             return { label: str,text: str, value: item['checkStartDate'] }
        //         }else if(typeof item[prop] == 'boolean'){
        //             if(prop == 'status'){
        //                 var str = item[prop] == true ? '啟用' : '禁用'
        //                 return { label: str,text: str, value: item[prop] }
        //             }else if(prop == 'isImproved'){
        //                 var str = item[prop] == true ? '已改善' : '未改善'
        //                 return { label: str,text: str, value: item[prop] }
        //             }else if(prop == 'collaborate'){
        //                 var str = item[prop] == true ? '配合中' : '未配合'
        //                 return { label: str,text: str, value: item[prop] }
        //             }else{
        //                 var str = item[prop] == true ? '允許' : '禁止'
        //                 return { label: str,text: str, value: item[prop] }
        //             }
        //         }else if(format =='DeviceStatusOptions' || 
        //         format == 'ContactUnitOptions' || format == 'MaintainContentOptions' || 
        //         format == 'MaintainProcessOptions'){
        //             let _array = this.buildingoptions.filter((obj, index) => 
        //                 obj.id == item[prop]
        //             )
        //             var str = _array.length !== 0 ? _array[0].textName : '尚未設定值'
        //             return { label: str,text: str, value: item[prop] }
        //         }else {
        //             if(item[prop] == '' || item[prop] == null ){
        //                 return { label: '尚未設定值', text: '尚未設定值', value: null }
        //             }else{
        //                 return { label: item[prop],text: item[prop], value: item[prop] }
        //             }
        //         } 
        //     })
        //     list = removeDuplicates(list,'value')
        //     return list
        // },
        // getObject(block,prop){
        //     var list = Object.values(block).map(item => {
        //         var array = []
        //         for(let element of item[prop]){
        //             array.push({ label: element.getName(),text: element.getName(), value: element.getID() })
        //         }
        //         return array
        //     })
        //     return list
        // },
        // sortRule(str1, str2) {
        //     let res = 0
        //     for (let i = 0; ;i++) {
		// 		if (!str1[i] || !str2[i]) {
        //             res = str1.length - str2.length
        //             if(typeof str1 == 'boolean' && typeof str2 == 'boolean'){
        //                 res = str1 - str2
        //             }
        //             break
        //         }
        //         const char1 = str1[i]
        //         const char1Type = this.getChartType(char1)
        //         const char2 = str2[i]
        //         const char2Type = this.getChartType(char2)

        //         if (char1Type[0] === char2Type[0]) {
        //             if (char1 === char2) {
        //                 continue
        //             } else {
        //                 if (char1Type[0] === 'zh') {
        //                     res = char1.localeCompare(char2)
        //                 } else if (char1Type[0] === 'en') {
        //                     res = char1.charCodeAt(0) - char2.charCodeAt(0)
        //                 } else {
        //                     res = char1 - char2
        //                 }
        //                 break
        //             }
        //         } else {
        //             // 类型不同的，直接用返回的数字相减
        //             res = char1Type[1] - char2Type[1]
        //             break
        //         }
		// 	}
		// 	return res
		// },
		// getChartType(char) {
		// 	// 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
		// 	if (/^[\u4e00-\u9fa5]$/.test(char)) {
		// 		return ['zh', 300]
		// 	}
		// 	if (/^[a-zA-Z]$/.test(char)) {
		// 		return ['en', 200]
		// 	}
		// 	if (/^[0-9]$/.test(char)) {
		// 		return ['number', 100]
		// 	}
		// 	return ['others', 999]
		// },
        openWindows(value){
            var routeData
            if(value == 'user'){
                routeData = this.$router.resolve(
                    { path: '/normal/basic',query:{ type:'user' } })
            }else{
                routeData = this.$router.resolve({ name: value })
            }
            window.open(routeData.href, '_blank')
        }
    }
}