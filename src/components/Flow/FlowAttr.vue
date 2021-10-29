<template>
    <div>
        <div class="ef-node-form">
            <div class="ef-node-form-body">
                <el-form :model="node" ref="dataForm" label-position="left"
                label-width="50px" v-show="type === 'node'" @submit.native.prevent style="padding-left:10px">
                    <el-form-item label="ID">
                        <el-input v-model="node.nodeId" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="類型">
                        <el-input v-model="node.nType" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名稱">
                        <el-input v-model="node.name" @input="save" :disabled="disabled"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="圖標">
                        <el-input v-model="node.ico"></el-input>
                    </el-form-item>
                    <el-form-item label="left座標">
                        <el-input v-model="node.left" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="top座標">
                        <el-input v-model="node.top" :disabled="true"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item label="狀態">
                        <el-select v-model="node.state" placeholder="請選擇" @change="save">
                            <el-option
                                v-for="item in stateList"
                                :key="item.state"
                                :label="item.label"
                                :value="item.state">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item v-if="node.nType == 12" label="流程圖">
                        <el-select
                        v-model="node.nextCpId"
                        placeholder="請選擇"
                        filterable
                        @change="save"
                        :disabled="disabled">
                            <el-option
                                v-for="(item,index) in selectfilter('processSelect')"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                                :disabled="item.id == processId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="node.nType == 21 || node.nType == 50" label="角色">
                        <el-select
                        v-model="node.linkRoles"
                        placeholder="請選擇"
                        filterable
                        multiple
                        value-key="id"
                        @change="filterAccount"
                        :disabled="disabled">
                            <el-option
                                v-for="(item,index) in selectfilter('roleSelect')"
                                :key="index"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="node.nType == 21  || node.nType == 50" label="人員">
                        <el-select
                        v-model="node.linkAccountList"
                        placeholder="請選擇"
                        filterable
                        multiple
                        value-key="id"
                        @change="save"
                        :disabled="disabled">
                            <el-option
                                v-for="(item,index) in accountArray"
                                :key="index"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="node.nType == 21 || node.nType == 25" label="訊息">
                        <el-input
                        v-model="node.message"
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 12}"
                        @input="save" :disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'" @submit.native.prevent>
                    <el-form-item label="備註">
                        <el-input v-model="line.label" :disabled="disabled"
                        ></el-input>
                    </el-form-item>
                    <el-form-item v-show="!disabled">
                        <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>

<script>
    import { Role, SelfDefenseFireMarshalling } from '@/object'

    export default {
        props:{
            title:{
                type: String,
                default: 'contingencyProcess'
            },
            processId:{ type: String },
            processArray: {
                type: Array,
                default: function () {
                    return []
                }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                visible: true,
                // node 或 line
                type: null,
                node: {},
                line: {},
                data: {},
                accountArray:[]
            }
        },
        computed:{
            ...Vuex.mapGetters([
                'buildingroles',
                'role_record'
            ]),
            selectfilter(){
                return function (value) {
                    if(value !== null ){
                        switch(value){
                            case 'processSelect':
                                return this.processArray.map(v => {
                                    var process = {
                                        name:v.name,
                                        id:v.id
                                    }
                                    return process
                                })
                            case 'roleSelect':
                                if(this.role_record == 0){
                                    this.$store.dispatch('building/setroles')
                                    this.$store.dispatch('record/saveRoleRecord',1)
                                }
                                return this.buildingroles.map(v => {
                                    var role = {
                                        name:v.getName(),
                                        id:v.getID()
                                    }
                                    return role
                                })
                        }
                    }
                    else{
                        return []
                    }
                }
            }
        },
        methods: {
            async nodeInit(data, id) {
                this.type = 'node'
                this.data = data
                data.nodeList.filter((node) => {
                    if (node.nodeId === id) {
                        this.node = _.cloneDeep(node)
                    }
                })
                this.node.linkRoles = this.node.linkRoles.map(item=> { return new Role(item)})
                if(this.title == 'selfDefenseClass'){
                    this.accountArray = this.node.linkAccountList
                }else{
                    await this.filterAccount(this.node.linkRoles)
                }
            },
            lineInit(line) {
                this.type = 'line'
                this.line = line
            },
            // 修改線
            saveLine() {
                this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label, this.line.id)
            },
            // 修改節點
            save() {
                this.data.nodeList.filter((node) => {
                    if (node.nodeId === this.node.nodeId) {
                        node.name = this.node.name
                        node.left = this.node.left
                        node.top = this.node.top
                        node.message = this.node.message
                        node.linkRoles = this.node.linkRoles
                        node.linkAccountList = this.node.linkAccountList
                        node.nextCpId = this.node.nextCpId
                        this.$emit('repaintEverything')
                    }
                })
            },
            async filterAccount(value){
                this.save()
                var account = []
                for(let role of value){
                    if(role){
                        var result = await SelfDefenseFireMarshalling.getAccountByRole(role.id)
                        result.forEach(element => {
                            account.push(element)
                        })
                    }
                }
                const set = new Set()
                this.accountArray =
                    account.filter(item => !set.has(item.id) ? set.add(item.id) : false).map(v => {
                        var account = {
                            name:v.name,
                            id:v.id
                        }
                        return account
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-node-form-tag {
        position: absolute;
        top: 50%;
        margin-left: -15px;
        height: 40px;
        width: 15px;
        background-color: #fbfbfb;
        border: 1px solid rgb(220, 227, 232);
        border-right: none;
        z-index: 0;
    }

/*node-form*/
.ef-node-form-header {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #F1F3F4;
    color: #000;
    line-height: 32px;
    padding-left: 12px;
    font-size: 14px;
}

.ef-node-form-body {
    margin-top: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
}


</style>
