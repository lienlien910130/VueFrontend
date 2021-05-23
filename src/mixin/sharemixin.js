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
               this.fullscreen == false ? this.blockwrapperheight = '750px' : 
               this.blockwrapperheight = '890px'
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
            selectSetting:[], //儲存篩選資料
            isTable:true,
            filterArray:[],
            exportExcelData:[]
        }
    },
    methods: {
        // //表格排序 製作篩選的清單
        // sortChange(column){
        //     var self = this
        //     var data = this.origin.map(item=>{ return item.clone(item) })
        //     this.listQueryParams.page = 1
        //     if (column.order === "descending") {
        //         this.blockData = data.sort(function(str1,str2){
        //             return self.sortRule(str2[column.prop],str1[column.prop])
        //         }).filter((item, index) => 
        //         index < this.listQueryParams.limit * this.listQueryParams.page && 
        //         index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
        //     } else if (column.order === "ascending") {
        //         this.blockData = data.sort(function(str1,str2){
        //             return self.sortRule(str1[column.prop],str2[column.prop])
        //         }).filter((item, index) => 
        //         index < this.listQueryParams.limit * this.listQueryParams.page && 
        //         index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
        //     }
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
        //表格篩選
        async getFilterItems(otherConfig = null){
            var arr = otherConfig == null ? this.tableConfig : otherConfig
            var block = otherConfig == null ? this.blockData : this.downData
            var config = arr.map(function(obj) {
                var rObj = {}
                rObj.prop = obj.prop
                rObj.format = obj.format
                return rObj
            })
            var array = []
            config.filter(item => item.prop !== undefined).forEach(element => {
                if(element.prop.indexOf('link') !== -1){
                    var data = this.getObject(block,element.prop)
                    var _con = []
                    for(let element of data){
                        _con.push(element)
                    }
                    var concatarray = _con.reduce(
                        function(a, b) {
                          return a.concat(b)
                        },[]
                    )
                    concatarray = removeDuplicates(concatarray,'value')
                    array.push({
                        type:element.prop,
                        options:concatarray
                    })
                }else{
                    array.push({
                        type:element.prop,
                        options:this.getItems(block,element.prop,element.format)
                    })
                }
            })
            otherConfig == null ? this.selectSetting = array :
                this.downselectSetting = array
        },
        getItems(block,prop,format){
            var list = Object.values(block).map(item => {
                if(format == 'YYYY' || format == 'YYYY-MM-DD'){ //日期
                    var str = item[prop] !== null && item[prop] !== undefined ?
                    moment(item[prop]).format('YYYY-MM-DD') : '尚未設定值'
                    return { text: str, value: item[prop] }
                }else if(format == 'range'){ //檢測日期
                    var str 
                    if(item['checkStartDate'] !== null && item['checkStartDate'] !== undefined){
                        str = '起始時間:'+moment(item['checkStartDate']).format('YYYY-MM-DD')
                    }else{
                        str = '尚未設定值'
                    }
                    return { text: str, value: item['checkStartDate'] }
                }else if(typeof item[prop] == 'boolean'){
                    if(prop == 'status'){
                        var str = item[prop] == true ? '啟用' : '禁用'
                        return { text: str, value: item[prop] }
                    }else if(prop == 'isImproved'){
                        var str = item[prop] == true ? '已改善' : '未改善'
                        return { text: str, value: item[prop] }
                    }else if(prop == 'collaborate'){
                        var str = item[prop] == true ? '配合中' : '未配合'
                        return { text: str, value: item[prop] }
                    }else{
                        var str = item[prop] == true ? '允許' : '禁止'
                        return { text: str, value: item[prop] }
                    }
                }else if(format =='DeviceStatusOptions' || 
                format == 'ContactUnitOptions' || format == 'MaintainContentOptions' || 
                format == 'MaintainProcessOptions'){
                    let _array = this.buildingoptions.filter((obj, index) => 
                        obj.id == item[prop]
                    )
                    var str = _array.length !== 0 ? _array[0].textName : '尚未設定值'
                    return { text: str, value: item[prop] }
                }else {
                    var str = item[prop] == '' || item[prop] == null ? 
                    '尚未設定值' : item[prop]
                    return { text: str, value: item[prop] }
                } 
            })
            list = removeDuplicates(list,'value')
            return list
        },
        getObject(block,prop){
            var list = Object.values(block).map(item => {
                var array = []
                for(let element of item[prop]){
                    array.push({ text: element.getName(), value: element.getID() })
                }
                return array
            })
            return list
        }
    }
}