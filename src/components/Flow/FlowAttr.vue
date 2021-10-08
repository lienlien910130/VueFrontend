<template>
    <div>
        <div class="ef-node-form">
            <div class="ef-node-form-body">
                <el-form :model="node" ref="dataForm" label-width="80px" v-show="type === 'node'" @submit.native.prevent>
                    <el-form-item label="ID">
                        <el-input v-model="node.id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="類型">
                        <el-input v-model="node.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名稱">
                        <el-input v-model="node.name" @input="save"></el-input>
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
                    <el-form-item label="狀態">
                        <el-select v-model="node.state" placeholder="請選擇" @change="save">
                            <el-option
                                v-for="item in stateList"
                                :key="item.state"
                                :label="item.label"
                                :value="item.state">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select 
                        v-model="node.linkRoles" 
                        placeholder="請選擇" 
                        filterable
                        multiple
                        value-key="id" 
                        @change="filterAccount">
                            <el-option
                                v-for="(item,index) in selectfilter('roleSelect')"
                                :key="index"
                                :label="item.label"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人員">
                        <el-select 
                        v-model="node.linkAccounts" 
                        placeholder="請選擇" 
                        filterable
                        multiple
                        value-key="id" 
                        @change="save">
                            <el-option
                                v-for="(item,index) in accountArray"
                                :key="index"
                                :label="item.label"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="訊息">
                        <el-input 
                        v-model="node.message" 
                        type="textarea" 
                        :autosize="{ minRows: 8, maxRows: 12}"
                        @input="save"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'" @submit.native.prevent>
                    <el-form-item label="備註">
                        <el-input v-model="line.label"  
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>

<script>
    // const Vuex = require('vuex')
    import { Role, SelfDefenseFireMarshalling } from '@/object'

    export default {
        data() {
            return {
                visible: true,
                // node 或 line
                type: null,
                node: {},
                line: {},
                data: {},
                stateList: [{
                    state: 'default',
                    label: '預設'
                },{
                    state: 'success',
                    label: '成功'
                }, {
                    state: 'warning',
                    label: '警告'
                }, {
                    state: 'error',
                    label: '錯誤'
                }, {
                    state: 'running',
                    label: '運行中'
                }],
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
                    }else{
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
                    if (node.id === id) {
                        this.node = _.cloneDeep(node)
                    }
                })
                this.node.linkRoles = this.node.linkRoles.map(item=> { return new Role(item)})
                await this.filterAccount(this.node.linkRoles)
            },
            lineInit(line) {
                this.type = 'line'
                this.line = line
            },
            // 修改線
            saveLine() {
                this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label)
            },
            // 修改節點
            save() {
                this.data.nodeList.filter((node) => {
                    if (node.id === this.node.id) {
                        node.name = this.node.name
                        node.left = this.node.left
                        node.top = this.node.top
                        node.ico = this.node.ico
                        node.state = this.node.state
                        node.message = this.node.message
                        node.linkRoles = this.node.linkRoles
                        node.linkAccounts = this.node.linkAccounts
                        this.$emit('repaintEverything')
                    }
                })
            },
            async filterAccount(value){
                this.save()
                var account = []
                for(let role of value){
                    var result = await SelfDefenseFireMarshalling.getAccountByRole(role.getID())
                    result.forEach(element => {
                        account.push(element)
                    })
                }
                const set = new Set()
                this.accountArray = 
                    account.filter(item => !set.has(item.id) ? set.add(item.id) : false).map(v => {
                        this.$set(v, 'value', v.getID()) 
                        this.$set(v, 'label', v.getName()) 
                        this.$set(v, 'id', v.getID()) 
                        return v
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
