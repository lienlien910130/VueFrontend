<template>
<div class="fireequ-container">
    <div class="fireequ-editor-container">
        
        <!-- <FloorSelect 
            style="margin-bottom: 20px;"
            v-bind="floorselectAttrs" 
            v-on="floorselectEvent">
        </FloorSelect>

        <div v-if="isChose">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="15" :lg="15">
                    <div class="block-wrapper">
                        <p>樓層平面圖</p>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9" :lg="9">
                    <div class="block-wrapper">
                        <div class="outside">
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>消防設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>建築設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>防火/防煙設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="5">
                                <p>一般設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="4">
                                <p>其他設備</p>
                                <Checkbox></Checkbox>    
                            </el-col>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="block-wrapper">
                        <p>設備詳細資料</p>
                    </div>
                </el-col>
            </el-row>
        </div> -->

        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                </div>
            </el-col>
        </el-row>
    </div>
    
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name:'Device',
    components:{
        Block: () => import('@/components/Block/index.vue')
    },
    computed:{
        blockAttrs() {
            return {
                blockData: this.blockData,
                buttonsName: this.buttonsName,
                config: this.tableConfig,
                title:'Device',
                selectData: this.selectData,
                devicetypeoption:this.devicetypeoption,
                brandoption:this.brandoption
            }
        },
        blockEvent() {
            return {
                subOpitonButton: this.handleBlockOption
            }
        }
    },
    data() {
        return {
            blockData:[],
            buttonsName: ['編輯','刪除'],
            tableConfig:[
                    {
                        label: '設備種類',
                        prop: 'type',
                        format:'deviceoptionselect',
                        mandatory:true, message:'請選擇設備種類'
                    },
                    {
                        label: '廠牌名稱',
                        prop: 'brand',
                        format:'brandselect',
                        mandatory:true, message:'請選擇廠牌名稱'
                    },
                    {
                        label: '設備型號',
                        prop: 'productId',
                        format:'brand',
                        mandatory:true, message:'請選擇廠牌名稱'
                    },
                    {
                        label: '設備名稱',
                        prop: 'name',
                        mandatory:true, message:'請選擇設備名稱'
                    },
                    {
                        label: '國家認證編號',
                        prop: 'certificationNumber',
                        mandatory:true, message:'請輸入國家認證編號'
                    },
                    {
                        label: '購買日期',
                        prop: 'dateOfPurchase',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請選擇購買日期'
                    },
                    {
                        label: '保固日期',
                        prop: 'dateOfWarranty',
                        format:'YYYY-MM-DD',
                        mandatory:true, message:'請輸入保固日期'
                    },
                    {
                        label: '位置設置',
                        prop: 'location',
                        mandatory:true, message:'請輸入位置設置'
                    },
                    {
                        label: '分類群組',
                        prop: 'groupID',
                        mandatory:true, message:'請輸入分類群組'
                    },
                    {
                        label: '保管單位',
                        prop: 'keeperUnitID',
                        format:'contactunitselect',
                        mandatory:true, message:'請選擇保管單位'
                    },
                    {
                        label: '維護廠商',
                        prop: 'maintainVendorID',
                        format:'contactunitselect',
                        mandatory:true, message:'請選擇維護廠商'
                    },
                    
                ],
            selectData:[],
            devicetypeoption:[],
            brandoption:[]
        }
    },
    watch: {
    },
    async mounted() {
        await this.getdevicetypeOption() //設備種類
        await this.getbrandOption() //廠牌名稱
        await this.getcontactunitList() //廠商資料
        await this.getbuildingdevicesmanage() //大樓的所有設備
    },
    methods: {
        async getbuildingdevicesmanage(){
            this.blockData = []
            var _temp = []
            await this.$api.device.apiGetBuildingDevicesManagement().then(response =>{
                console.log(JSON.stringify(response))
                this.blockData = response.result.sort((x,y) => y.id - x.id)
            })
        },
        async getdevicetypeOption(){ 
            this.devicetypeoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('DeviceOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.devicetypeoption = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getbrandOption(){ 
            this.brandoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('BrandOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.brandoption = _temp.map(v => {
                    this.$set(v, 'value', v.value) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getcontactunitList(){
            this.selectData = []
            var _temp = []
            this.$api.building.apiGetContactUnit().then(response => {
              console.log(JSON.stringify(response))
              _temp = response.result.sort((x,y) => x.id - y.id)
               this.selectData = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.name) 
                    this.$set(v, 'id', v.id) 
                    return v
              })
            })
        },
        async handleBlockOption(index,content){
            if(index == 'opendialog'){
                await this.getdevicetypeOption()
                await this.getbrandOption()
                await this.getcontactunitList()
            }else if(index == 'update'){
                this.$api.device.apiPatchDevicesManagement(JSON.stringify(content)).then(async(response) => {
                    this.$message('更新成功')
                    await this.getbuildingdevicesmanage()
                }).catch(error=>{
                    console.log(error)
                })
            }else if(index === 'create'){
                this.$api.device.apiPostDevicesManagement(JSON.stringify(content)).then(async(response) => {
                    this.$message('新增成功')
                    await this.getbuildingdevicesmanage()
                }).catch(error=>{
                    console.log(error)
                })
            }else if(index === 'delete'){
                this.$api.device.apiDeleteDevicesManagement(content).then(async(response) => {
                    this.$message('刪除成功')
                    await this.getbuildingdevicesmanage()
                }).catch(error=>{
                    console.log(error)
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.fireequ-editor-container {
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;

  .block-wrapper {
    background: #fff;
    padding: 10px;
    margin-bottom: 32px;
    height: 720px;
  }
}
</style>