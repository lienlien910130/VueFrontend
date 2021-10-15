<template>
    <div class="flow-menu" ref="tool">
        <div style="height:300px;overflow:auto">
            <!-- <span class="ef-node-pmenu" @click="processopen = !processopen">
                <i :class="{'el-icon-caret-bottom': processopen,'el-icon-caret-right': !processopen}">
                </i>&nbsp;{{ '流程圖' }}
                <i 
                class="el-icon-edit" 
                style="float:right;font-size:24px"
                @click="openEditDialog"
                ></i>
            </span> -->
            <span class="ef-node-pmenu-process">
                <i class="el-icon-caret-bottom"></i>&nbsp;{{ '流程圖' }}
                <el-tooltip class="item" effect="dark" content="編輯流程圖" placement="bottom">
                    <i 
                        class="el-icon-edit" 
                        style="float:right;font-size:24px"
                        @click="openEditDialog"
                    ></i>
                </el-tooltip>
            </span>
            <ul v-show="processopen" class="ef-node-menu-process-ul">
                <li 
                v-for="subMenu in processArray" 
                :class="{ 'ef-node-active': processId == subMenu.id ? true : false }"
                class="ef-node-menu-process-li" 
                :key="subMenu.id" 
                @click="changeProcess(subMenu.id)">
                    {{subMenu.name}}
                </li>
            </ul>
        </div>
        
            <span class="ef-node-pmenu" @click="menuOpen = !menuOpen">
              <i :class="{'el-icon-caret-bottom': menuOpen,'el-icon-caret-right': !menuOpen}"></i>&nbsp;{{ '節點資料' }}</span>
            <ul v-show="menuOpen" class="ef-node-menu-ul">
                <draggable 
                @end="end" @start="move" v-model="sampleNodeArray" :options="draggableOptions">
                    <li v-for="node in sampleNodeArray" class="ef-node-menu-li" :key="node.id" :type="node.nType">
                        <i :class="node.icon"></i> {{node.name}}
                    </li>
                </draggable>
            </ul>
        <!-- <div v-for="menu  in  nodeArray" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open">
              <i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable 
                @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                        <i :class="subMenu.ico"></i> {{subMenu.name}}
                    </li>
                </draggable>
            </ul>
        </div> -->
    </div>
</template>
<script>
    import draggable from 'vuedraggable'

    var mousePosition = {
        left: -1,
        top: -1
    }

    export default {
        name:'FlowMenu',
        props:{
            processId:{ type: String},
            processArray: {
                type: Array,
                default: function () {
                    return []
                }
            },
            sampleNodeArray: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                activeNames: '1',
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                defaultOpeneds: ['1'],
                nodeMenu: {},
                processopen:true,
                menuOpen:true
            }
        },
        components: {
            draggable
        },
        created() {
            /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
            if (this.isFirefox()) {
                document.body.ondrop = function (event) {
                    // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                    mousePosition.left = event.layerX
                    mousePosition.top = event.clientY - 50
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        methods: {
            getMenuByType(type) {
                for (let i = 0; i < this.sampleNodeArray.length; i++) {
                    if (this.sampleNodeArray[i].nType === type) {
                        return this.sampleNodeArray[i]
                    }
                    // let children = this.nodeArray[i].children;
                    // for (let j = 0; j < children.length; j++) {
                    //     if (children[j].type === type) {
                    //         return children[j]
                    //     }
                    // }
                }
            },
            move(evt, a, b, c) {
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenuByType(type)
            },
            end(evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            isFirefox() {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
            },
            changeProcess(id){
                this.$emit('changeProcess', id)
            },
            openEditDialog(){
                 this.$emit('openEditDialog')
            }
        }
    }
</script>

<style scoped lang="scss">
.ef-node-pmenu {
    cursor: pointer;
    height: 38px;
    line-height: 32px;
    width: 200px;
    display: block;
    font-weight: bold;
    color: #4A4A4A;
    padding-left: 5px;
    padding-top: 7px;
}
.ef-node-pmenu-process{
    height: 38px;
    line-height: 32px;
    width: 200px;
    display: block;
    font-weight: bold;
    color: #4A4A4A;
    padding-left: 5px;
    padding-top: 7px;
    i{
        cursor: pointer;
    }
}

.ef-node-active {
    background-color: #F0F7FF;
    /*box-shadow: #1879FF 0px 0px 12px 0px;*/
    background-color: #F0F7FF;
    border: 1px solid #1879FF;
}

.ef-node-pmenu:hover {
    background-color: #E0E0E0;
}

.ef-node-menu-li, .ef-node-menu-process-li {
    color: #565758;
    width: 150px;
    border: 1px dashed #E0E3E7;
    margin: 5px 0 5px 0;
    padding: 5px;
    border-radius: 5px;
    padding-left: 8px;
}

.ef-node-menu-li:hover {
    cursor: move;
    background-color: #F0F7FF;
    border: 1px dashed #1879FF;
    border-left: 4px solid #1879FF;
    padding-left: 5px;
}

.ef-node-menu-process-li:hover {
    cursor: pointer;
    background-color: #F0F7FF;
    border: 1px dashed #1879FF;
    border-left: 4px solid #1879FF;
    padding-left: 5px;
}

.ef-node-menu-ul, .ef-node-menu-process-ul {
    list-style: none;
    padding-left: 20px
}



</style>