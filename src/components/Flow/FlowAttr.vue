<template>
    <div>
        <div class="ef-node-form">
            <div class="ef-node-form-header">
                编辑
            </div>
            <div class="ef-node-form-body">
                <el-form :model="node" ref="dataForm" label-width="80px" v-show="type === 'node'">
                    <el-form-item label="類型">
                        <el-input v-model="node.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名稱">
                        <el-input v-model="node.name" @input="save"></el-input>
                    </el-form-item>
                    <el-form-item label="圖標">
                        <el-input v-model="node.ico"></el-input>
                    </el-form-item>
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
                </el-form>

                <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'">
                    <el-form-item label="備註">
                        <el-input v-model="line.label" @input="saveLine"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>

</template>

<script>
    import { cloneDeep } from 'lodash'

    export default {
        data() {
            return {
                visible: true,
                // node 或 line
                type: 'node',
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
                }]
            }
        },
        methods: {
            nodeInit(data, id) {
                this.type = 'node'
                this.data = data
                data.nodeList.filter((node) => {
                    if (node.id === id) {
                        this.node = cloneDeep(node)
                    }
                })
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
                        this.$emit('repaintEverything')
                    }
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
