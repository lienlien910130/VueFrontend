
<template>
    <div>
      <el-dialog
        top="5vh"
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleClickOption('cancel')"
        center>
        <div v-if="dialogData.length > 1" >
           <el-tabs 
            v-model="activeName" 
            @tab-click="handleTabClick">
                <el-tab-pane
                v-for="(item) in dialogData"
                :key="item.id"
                :label="title === 'floorOfHouse' ? item.houseNumber :
                title === 'lack' ? item.lackItem : item.name "
                :name="item.id"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- dialogStatus : 一般表單/upload/lack/authority -->
        <keep-alive>
        <el-form
        ref="dataForm"  
        :model="temp"  
        :label-position="label" 
        label-width="auto" 
            >
            <el-form-item 
            v-for="(item, index) in config"
            :key="index"
            :prop="item.prop"
            v-show="item.isEdit"
            :rules="[
                { required: item.mandatory, message: item.message},
                item.isPattern ? 
                    { pattern: item.pattern , message:item.errorMsg } : 
                    { type: item.type, message: item.typemessage }
            ]"
            >
                <!-- label -->
                <span v-if="item.isAssociate == false" slot="label">{{ item.label }}</span>
                <i v-else slot="label" class="el-icon-edit">
                    <a @click="openWindows(item.format)" style="color:#66b1ff"> {{ item.label }} </a>
                </i>
                <!-- 年度&日期 -->
                <el-date-picker 
                v-if="item.format == 'YYYY' || item.format == 'YYYY-MM-DD'" 
                v-model="temp[item.prop]" 
                value-format="yyyy-MM-dd" 
                placeholder="請選擇"
                style="width:100%"
                :type="item.format == 'YYYY' ? 'year' : 'date' " /> 
                <!-- 範圍 -->
                <span v-else-if="item.format == 'range'">
                    <el-date-picker
                        ref="picker"
                        v-model="rangevalue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="開始日期"
                        end-placeholder="結束日期"
                        format="yyyy-MM-dd"
                        style="width:100%"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </span>
                <!--  設備(火警總機/PLC)關聯點位選取關聯的 / 點位選取設備 (limit-1) 
                設備 / 廠商 / 角色 / 建築物 / 門牌 / 住戶 下拉選單 (多)-->
                <el-select
                    v-else-if="item.format == 'assignFireDeviceSelect' ||
                    item.format == 'assignPLCDeviceSelect'
                    || item.format == 'addressdeviceSelect' || item.format == 'deviceSelect' || 
                    item.format =='contactunitSelect' || 
                    item.format =='roleSelect' ||  
                    item.format =='buildingSelect' || 
                    item.format == 'floorOfHouseSelect'
                    || item.format =='userInfo' || item.format == 'maintainListSelect' || item.format == 'usageOfFloorUserInfo' "
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    :multiple-limit="item.format == 'assignFireDeviceSelect' ||
                    item.format == 'assignPLCDeviceSelect'
                    || item.format == 'addressdeviceSelect' || item.format == 'maintainListSelect' || 
                    item.format == 'floorOfHouseSelect' || item.format == 'contactunitSelect' || item.format == 'deviceSelect' ? 1 : 0 "
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    @change="checkMode($event, item.format)"
                    >
                        <el-option
                        v-for="(obj,index) in selectfilter(item.format)"
                        :key="index"
                        :label="item.format =='maintainListSelect' ? obj.getName() : obj.label"
                        :value="obj"
                        :disabled="item.format =='addressdeviceSelect' || item.format == 'usageOfFloorUserInfo' ? obj.disabled : false "
                        >
                        </el-option>  
                </el-select>
                <!-- 點位選擇樓層 -->
                <el-select
                    v-else-if="item.format =='floorSelect'"
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(obj,index) in selectfilter(item.format)"
                        :key="index"
                        :label="obj.label"
                        :value="obj.id"
                        >
                        </el-option>  
                </el-select>
                <!-- 設備種類 -->
                <el-select
                    v-else-if="item.format =='deviceTypeSelect'"
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    :multiple-limit="1"
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    :disabled="dialogStatus == 'create' ? false : true"
                    @change="checkMode($event, item.format)"
                    >
                        <el-option
                        v-for="(obj,index) in selectfilter(item.format)"
                        :key="index"
                        :label="obj.label"
                        :value="obj"
                        >
                        </el-option>  
                </el-select>
                <!-- 管委會的住戶選擇 -->
                <el-select
                    v-else-if="item.format =='commitUserInfo'"
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    :multiple-limit="1"
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    :disabled="disable"
                    >
                        <el-option
                        v-for="(obj,index) in commitUserInfoArray"
                        :key="index"
                        :label="obj.getName()"
                        :value="obj"
                        >
                        </el-option>  
                </el-select>
                <!-- 控制模式 -->
                <el-radio-group 
                v-else-if="item.format == 'protocolMode'"
                v-model="temp[item.prop]" 
                @change="changeprotocolMode">
                    <el-radio :label="0">皆無</el-radio>
                    <el-radio :label="1">接收</el-radio>
                    <el-radio :label="2">控制</el-radio>
                    <el-radio :label="3">皆有</el-radio>
                </el-radio-group>
                <!-- 網路編號 -->
                <el-input v-else-if="item.format =='internetNumber'"
                v-model="temp[item.prop]" 
                :maxlength="item.maxlength"
                show-word-limit
                :disabled="disable">
                </el-input>
                <!-- 檢修申報下拉選單(多)-->
                <el-select
                    v-else-if="item.format == 'inspectionSelect' "
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    :multiple-limit="1"
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option-group
                        v-for="group in selectfilter('inspectionSelect')"
                        :key="group.label"
                        :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item"
                                :disabled="item.status !== ''">
                            </el-option>
                        </el-option-group>
                </el-select>
                <!-- 設備種類(後端)下拉選單(單) -->
                <el-cascader
                    v-else-if="item.format == 'fullType' "
                    v-model="fulltypevalue"
                    placeholder="請選擇"
                    :options="selectfilter('fullTypeSelect')"
                    filterable
                    style="width:100%"
                    clearable
                    @change="changeFullType">
                </el-cascader>
                <!-- 設定的下拉選單(單) -->
                <el-select
                    v-else-if="item.format =='BrandOptions' || 
                    item.format =='MaintainContentOptions' 
                    || item.format =='MaintainProcessOptions' || 
                    item.format == 'DeviceStatusOptions' 
                    || item.format == 'ContactUnitOptions' || 
                    item.format == 'LackStatusOptions'
                    "
                    ref="settingOption"
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇項目，可直接新增值"
                    style="width:100%"
                    allow-create
                    default-first-option
                    @change="changeValue($event,item.format,item.prop)"
                    >
                        <el-option
                        v-for="(item,index) in optionfilter(item.format)"
                        :key="index"
                        :label="item.textName"
                        :value="item.id"
                        >
                        </el-option>  
                </el-select>
                <!-- 地址 -->
                <span
                 v-else-if="item.format =='address'">
                    <el-cascader
                      v-model="addressvalue"
                      :options="selectfilter(item.format)"
                      :props="{ value: 'label'}"
                      style="width:100%"
                      @change="handleChange"
                      placeholder="請選擇縣市區域"
                      ></el-cascader>
                    <el-input ref="address" name="address" v-model="temp[item.prop]"  
                      show-word-limit maxlength="100"/> 
                </span>
                <!-- 權限設定 -->
                <el-select
                    v-else-if="item.format =='actionSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option label="查詢" key="1" value="query"></el-option>
                    <el-option label="新增" key="2" value="add"></el-option>
                    <el-option label="刪除" key="3" value="delete"></el-option>
                    <el-option label="修改" key="4" value="update"></el-option>
                    <el-option label="匯入檔案" key="5" value="export"></el-option>
                    <el-option label="匯出檔案" key="6" value="upload"></el-option>
                </el-select>
                <!-- Boolean:啟用禁用 允許/禁止刪除 配合 改善 -->
                <el-select
                    v-else-if="item.format =='accountStatusSelect' || item.format == 'collaborateBoolean'
                    || item.format == 'removableSelect' || item.format == 'improvedBoolean'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option v-for="(val,index) in [true, false]" 
                    :key="index"
                    :value="val" :label="val | changeBoolean(item.format)"></el-option>
                </el-select>
                <!-- inputnumber -->
                <el-input
                v-else-if="item.format =='inputnumber'"
                v-model.number="temp[item.prop]" 
                type="number" :min="0"  :placeholder="item.placeholder" >
                    <template 
                    v-if="item.prop == 'floorsOfAboveGround' || 
                    item.prop == 'floorsOfUnderground'"
                    slot="prepend">
                    {{ item.prop == 'floorsOfAboveGround' ? '地上' : '地下'}}
                    </template>
                    <template 
                    v-if="item.prop !== 'sort'"
                    slot="append">
                        <span v-if="item.prop =='area'">m<sup>2</sup></span>
                        <span v-else-if="item.prop == 'capacity'">人</span>
                        <span v-else-if="item.prop == 'height'">m</span>
                        <span v-else>樓</span>
                    </template>
                </el-input>
                <!-- 專技人員 -->
                <el-autocomplete
                v-else-if="item.format =='searchColumn'"
                class="inline-input"
                v-model="temp[item.prop]"
                :fetch-suggestions="querySearch"
                :placeholder="item.placeholder"
                style="width:100%"
                ></el-autocomplete>   
                <!-- 區塊 -->
                <el-input v-else-if="item.format =='textarea'"
                v-model="temp[item.prop]" 
                :autosize="{ minRows: 4, maxRows: 8}"
                maxlength="200"
                type="textarea"
                show-word-limit>
                </el-input>

                <span v-else-if="item.format =='inspectionLackStatus'">
                    請至維護保養修改進度
                </span>

                <!-- <div v-else-if="item.format =='openmaintain' ">
                    <Table 
                        :list-query-params.sync="listQueryParams"
                        v-bind="tableAttrs" 
                        v-on="tableEvent">
                    </Table>  
                </div> -->
                
                <el-input v-else
                v-model="temp[item.prop]" 
                :maxlength="item.maxlength"
                show-word-limit
                :placeholder="item.placeholder"
                >
                </el-input>

            </el-form-item>
        </el-form>
        </keep-alive>

        <div v-if="isHasButtons" slot="footer" class="dialog-footer">
            <span
            v-for="(button, index) in buttonsName"
            :key="index"
            >
            <el-button
            :type="button.type"
            @click="handleClickOption(button.status)"
            >
            <span >{{ button.name }}</span>
            </el-button>
            </span>
        </div>
    </el-dialog>  
    </div>
</template>

<script>
import computedmixin from '@/mixin/computedmixin'
import Setting from '@/object/setting'
import { changeDeviceFullType } from '@/utils/index'
import constant from '@/constant/index'

export default {
    name:'DialogForm',
    mixins:[computedmixin],
    props:{
        dialogData: {
            type: Array,
            default: function () {
                return []
            }
        },
        visible: {
            type: Boolean,
            default: true
        },
        dialogStatus:{
            type: String
        },
        isHasButtons: {
            type: Boolean,
            default: true
        },
        buttonsName: {
            type: Array
        },
        config: {
            type: Array
        },
        title:{
            type: String,
            required: true
        },
        selectData: {
            type: Array
        }
    },
    watch:{
        dialogData:{ 
            handler:function(){
                this.init()
            },
            immediate:true
        }
    },
    computed:{
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                return "1000px"
            }
        },
        selectfilter(){
            return function (value) {
                if(value !== null ){
                    switch(value){
                        case 'deviceSelect': 
                            if(this.device_record == 0){
                               this.$store.dispatch('building/setDevice')
                                this.$store.dispatch('record/saveDeviceRecord',1)
                            }
                            return this.buildingdevices.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getLinkType().getSelectName()+'-'+v.getOnlyName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'floorSelect': 
                            if(this.floor_record == 0){
                                    this.$store.dispatch('building/setFloors')
                                    this.$store.dispatch('record/saveFloorRecord',1)
                            }
                            return this.buildingfloors.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'addressdeviceSelect':
                            if(this.device_record == 0){
                                  this.$store.dispatch('building/setDevice')
                                    this.$store.dispatch('record/saveDeviceRecord',1)
                            }
                            return this.buildingdevices.filter(item => 
                            item.getLinkType().getFullType() !== 'nDeviceTypeList.AE.AE_FireDetectorCentralControl' && 
                            item.getLinkType().getFullType() !== 'nDeviceTypeList.OE.OE_ProgrammableLogicController').map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getLinkType().getSelectName()+'-'+v.getOnlyName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'assignFireDeviceSelect': //火警總機
                            if(this.device_record == 0){
                                    this.$store.dispatch('building/setDevice')
                                    this.$store.dispatch('record/saveDeviceRecord',1)
                            }
                            return this.buildingdevices.filter(item => 
                            item.getLinkType().getFullType() == 'nDeviceTypeList.AE.AE_FireDetectorCentralControl' && 
                            item.getInternetNumber() !== null && item.getInternetNumber() !== '' && item.getInternetNumber() !== undefined).map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getLinkType().getSelectName()+'-'+v.getOnlyName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'assignPLCDeviceSelect': //PLC
                            if(this.device_record == 0){
                                    this.$store.dispatch('building/setDevice')
                                    this.$store.dispatch('record/saveDeviceRecord',1)
                            }
                            return this.buildingdevices.filter(item => 
                            item.getLinkType().getFullType() == 'nDeviceTypeList.OE.OE_ProgrammableLogicController' && 
                            item.getInternetNumber() !== null && item.getInternetNumber() !== '' && item.getInternetNumber() !== undefined).map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getLinkType().getSelectName()+'-'+v.getOnlyName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'contactunitSelect':
                            if(this.contactunit_record == 0){
                                    this.$store.dispatch('building/setContactunit')
                                    this.$store.dispatch('record/saveContactunitRecord',1)
                            }
                            return this.buildingcontactunit.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'maintainListSelect':
                            return this.selectData[1]
                        case 'inspectionSelect':
                            return this.selectData[0]
                        case 'floorOfHouseSelect':
                            if(this.floorOfHouse_record == 0){
                                this.$store.dispatch('building/setFloorOfHouse')
                                this.$store.dispatch('record/saveFloorOfHouseRecord',1)
                            }
                            return this.buildingfloorOfHouse.map(v => {
                                this.$set(v, 'id', v.id) 
                                this.$set(v, 'label', v.houseNumber) 
                                this.$set(v, 'value', v.id) 
                                return v
                            })
                            // return this.selectData
                        case 'deviceTypeSelect':
                            if(this.deviceType_record == 0){
                                    this.$store.dispatch('building/setDeviceType')
                                    this.$store.dispatch('record/saveDeviceTypeRecord',1)
                            }
                            return this.buildingdeviceType.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getSelectName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                            // return this.selectData
                        case 'userInfo':
                            if(this.title == 'building'){
                                return this.selectData
                            }else{
                                if(this.householder_record == 0){
                                    this.$store.dispatch('building/setHouseHolders')
                                    this.$store.dispatch('record/saveHouseHolderRecord',1)
                                }
                                return this.buildingusers.map(v => {
                                    this.$set(v, 'value', v.getID()) 
                                    this.$set(v, 'label', v.getName()) 
                                    this.$set(v, 'id', v.getID()) 
                                    return v
                                })
                            }
                        case 'usageOfFloorUserInfo':
                            if(this.householder_record == 0){
                                this.$store.dispatch('building/setHouseHolders')
                                this.$store.dispatch('record/saveHouseHolderRecord',1)
                            }
                            return this.buildingusers.map(v => {
                                    this.$set(v, 'value', v.getID()) 
                                    this.$set(v, 'label', v.getName()) 
                                    this.$set(v, 'id', v.getID()) 
                                    this.$set(v, 'disabled', !(v.getUsageOfFloor() == null) )
                                    return v
                            })
                        case 'roleSelect' :
                            if(this.role_record == 0){
                                this.$store.dispatch('building/setroles')
                                this.$store.dispatch('record/saveRoleRecord',1)
                            }
                            return this.buildingroles.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'buildingSelect' :
                            return this.buildingarray.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.buildingName) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                        case 'fullTypeSelect':
                            return this.deviceType
                        case 'address':
                            return constant.AreaCode
                    }
                }else{
                    return ""
                }
            }  
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            activeName:'',
            temp:{},
            rangevalue: [],
            fulltypevalue:[],
            addressvalue:[],
            accessArray:[],
            createOption:[],
            prop:[],
            maintainListID:'',
            disable:true,
            //originalProtocolMode:'',
            originalInternet:null,
            commitUserInfoArray:[]
        }
    },
    methods: {
        init(){
            // window.addEventListener("message", this.receiveMessage, false)
            if(this.dialogData.length){
                this.activeName = this.dialogData[0].getID()
                this.temp = this.dialogData[0].clone(this.dialogData[0])
                if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                    if(this.dialogData[0]['checkStartDate'] !== null){
                        this.rangevalue = [this.dialogData[0]['checkStartDate'],
                        this.dialogData[0]['checkEndDate']]
                    }
                }
                if(this.title == 'devicetype'){
                    var fullType = this.dialogData[0]['fullType']
                    var value = changeDeviceFullType(fullType,true,false)
                    this.fulltypevalue = [value,fullType]
                }
                if(this.title == 'deviceAddressManagement' || this.title == 'devicePLCAddressManagement'){
                    this.originalProtocolMode = JSON.parse(JSON.stringify(this.temp['protocolMode']))
                }
                if(this.title == 'equipment'){
                    var type = this.temp.getLinkType().getFullType()
                    if(type == 'nDeviceTypeList.AE.AE_FireDetectorCentralControl' || 
                    type == 'nDeviceTypeList.OE.OE_ProgrammableLogicController'){
                        this.originalInternet = this.temp['internetNumber'] !== undefined ? 
                            JSON.parse(JSON.stringify(this.temp['internetNumber'])) : null
                        this.disable = false
                    }
                }
                if(this.title == 'committee'){
                    var usage = this.temp.getLinkUsageOfFloors()
                    var data = []
                    if(usage.length){
                        this.disable = false
                        var user = this.temp.getLinkUsers()
                        if(user.length){
                            data.push(user[0])
                        }
                        usage[0].getLinkUsers().forEach(element => {
                            data.push(element)
                        })
                        usage[0].getLivingUsers().forEach(element => {
                            data.push(element)
                        })
                        const set = new Set()
                        this.commitUserInfoArray = data.filter(item => !set.has(item.id) ? set.add(item.id) : false)
                    }   
                }
            }
            this.$nextTick(() => {
                if(this.$refs.dataForm !== undefined){
                    this.$refs.dataForm.clearValidate()
                }
            })
        },
        optionfilter(format){
            if(this.setting_record == 0){
                this.$store.dispatch('building/setoptions')
                this.$store.dispatch('record/saveSettingRecord',1)
            }
            if(format !== null ){
                let _array = this.buildingoptions.filter((item, index) => 
                    item.classType == format 
                )
                return _array
            }else{
                return ""
            }
        },
        // 設備清單-設備種類選項
        // 管委會-選擇住戶
        // 點位-指定設備
        checkMode(value,format){
            if(value.length){
               if(this.title == 'equipment' && format == 'deviceTypeSelect'){
                    if(value[0].getFullType() == 'nDeviceTypeList.AE.AE_FireDetectorCentralControl' || 
                    value[0].getFullType() == 'nDeviceTypeList.OE.OE_ProgrammableLogicController'){
                        this.disable = false
                        this.$emit('handleChangeConfig',true)
                    }else{
                        this.$emit('handleChangeConfig',false)
                    }
               }
               else if(format == 'assignFireDeviceSelect' || format == 'assignPLCDeviceSelect'){
                    this.temp['internet'] = value[0].getInternetNumber()
               }
               else if(this.title == 'committee' && format == 'floorOfHouseSelect'){
                    this.disable = false
                    var data = []
                    value[0].getLinkUsers().forEach(element => {
                        data.push(element)
                    })
                    value[0].getLivingUsers().forEach(element => {
                        data.push(element)
                    })
                    const set = new Set()
                    this.commitUserInfoArray = data.filter(item => !set.has(item.id) ? set.add(item.id) : false)
               }
            }else{
                if(this.title == 'equipment' && format == 'deviceTypeSelect'){
                    this.disable = true
                    this.temp['internetNumber'] = null
                    this.$emit('handleChangeConfig',false)
                }
                else if(format == 'assignFireDeviceSelect' || format == 'assignPLCDeviceSelect'){
                    this.temp['internet'] = null
                }
                else if(this.title == 'committee' && format == 'floorOfHouseSelect'){
                    this.disable = true
                    this.temp['linkUsers'] = []
                }
            }
        },
        changeprotocolMode(value){
            if(this.title == 'deviceAddressManagement' && this.dialogStatus == 'update'){
                this.$confirm('更換【控制模式】將會重置關聯的設備，是否要更新【控制模式】?', 
                '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.temp['linkDevices'] = []
                    this.$emit('handleDialog', 'openDialog', this.dialogStatus , this.temp) 
                }).catch(() => {
                    this.temp['protocolMode'] = this.originalProtocolMode
                    this.temp['linkDevices'] = []
                })
            }
        },
        querySearch(queryString, cb) {
            var restaurants = this.selectData
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : this.selectData
            cb(results)
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
            }
        },
        openWindows(format){
            var routeData
            switch (format) {
                case 'userInfo':
                    if(this.buildingid == undefined){
                        this.$message.error('請選擇建築物後才可對所有權人&防火管理人進行新增')
                    }else{
                        routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'user' } })
                    }
                    break;
                case 'deviceTypeSelect':
                    routeData = this.$router.resolve(
                            { path: '/equipment/type',query:{ type:'devicetype' } })
                    break;
                case 'contactunitSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'contactunit' } })
                    break;
                case 'floorOfHouseSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'floorOfHouse' } })
                    break;
                case 'inspectionSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/maintenancereport',query:{ type:'inspection' } })
                    break;
                case 'deviceSelect': case 'addressdeviceSelect':
                    routeData = this.$router.resolve(
                            { path: '/equipment/index',query:{ type:'device' } })
                    break;
                case 'roleSelect':
                    routeData = this.$router.resolve(
                            { path: '/authority/roles',query:{ type:'role' } })
                    break;
                case 'ContactUnitOptions': case 'MaintainProcessOptions': case 'MaintainContentOptions': case 'LackStatusOptions':
                    routeData = this.$router.resolve({ name: 'sys-Setting' })
                    break;
                default:
                    break;
            }
            if(window.child && window.child.open && !window.child.closed){
                window.child.close()
            }
            window.child = window.open(routeData.href, '_blank')
            //window.child = window.open(routeData.href, '_blank', 'toolbar=no, width=400, height=600,location=no')
        },
        //動態新增選項
        changeValue(event,format,prop){
            var array = this.optionfilter(format)
            var data = array.filter(item=> item.id == event)
            if(data.length == 0){
                var item = {
                    'classType':format,
                    'textName':event,
                    'sort':99
                }
                this.prop.push(prop)
                this.createOption.push(item)
            }
        },
        async getOptions(){ //取得大樓的所有分類
            this.options = await Setting.getAllOption()
            this.$store.dispatch('building/setoptions', this.options)
        },
        //fulltype選單變動
        changeFullType(){
            this.temp['fullType'] = this.fulltypevalue[1]
        },
        //地址欄位
        handleChange(value){
            this.temp.address = value[0]+value[1]
        },
        //子傳父窗口
        handleClickOption(status){
            if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                this.temp['checkStartDate'] = this.rangevalue[0]
                this.temp['checkEndDate'] = this.rangevalue[1]
            }
            if(status !== 'cancel' && status !== 'cancellack' && status !== 'empty' && 
            status !== 'cancelfloor'){
                this.$refs.dataForm.validate(async(valid) => {
                    if (valid) {
                        if(this.createOption.length !== 0){ //有動態新增選項
                            for(var i =0;i<this.createOption.length;i++){
                                var result = await Setting.postOption(this.createOption[i])
                                if(Object.keys(result).length !== 0){
                                    this.temp[this.prop[i]] = result.id
                                }else{
                                    this.$message.error('新增設定有誤')
                                }
                            }
                            this.createOption = []
                            this.prop = []
                            await this.getOptions()
                        }
                        //設備更新時判斷有沒有更新控制模式&設備種類
                        if(this.title == 'equipment' && status == 'update'){ 
                            //var protocolMode = this.originalProtocolMode !== this.temp['protocolMode']
                            var inter = this.temp['internetNumber'] !== undefined ? this.temp['internetNumber'] : null
                            var internet = this.originalInternet !== inter
                            if(internet == true){
                                this.$confirm('更換【網路編號】將會重置關聯的點位，是否要更新【網路編號】?', 
                                '提示', {
                                    confirmButtonText: '確定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$emit('handleDialog', true, status , this.temp) 
                                }).catch(() => {
                                    this.temp['internetNumber'] = this.originalInternet
                                    this.$emit('handleDialog', false, status , this.temp)          
                                })
                            }else{
                                this.$emit('handleDialog', false, status , this.temp)  
                            }   
                        }else{
                            this.$emit('handleDialog', this.title, status , this.temp)  
                        }  
                    } else {
                        this.$message.error('請輸入完整資訊')
                        return false
                    }
                })
            }
           
            if(status == 'cancel' || status == 'cancellack' || status == 'cancelfloor' ||
            status == 'empty' || status == 'authoritycreate' ){
                var data = status == 'authoritycreate' ? this.accessArray : ''
                this.$emit('handleDialog',this.title, status , data)
            }else if (status == 'openempty'){
                this.$emit('handleDialog','maintain', status , '')
            }else if (status == 'tablemaintain'){
                this.$emit('handleDialog',this.title, 'empty' , this.maintainListID)
            }
        },
        //頁籤
        async handleTabClick(tab, event) {
            this.temp = this.dialogData
             .filter((element,index) => element.id == tab.name)[0]
        }
    }
}
</script>
