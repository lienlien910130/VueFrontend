<template>
    <div class="flow-menu" ref="tool">
        <div v-for="menu  in  menuList" :key="menu.id">
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
        </div>
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
        data() {
            return {
                activeNames: '1',
                // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    // 不使用H5原生的配置
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                // 默认打开的左侧菜单的id
                defaultOpeneds: ['1'],
                menuList: [
                    {
                        id: '1',
                        type: 'group',
                        name: '節點資料',
                        ico: 'el-icon-video-play',
                        open: true,
                        children: [
                            {
                                id: '11',
                                type: 'start',
                                name: '起點',
                                ico: 'el-icon-bell',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '12',
                                type: 'voiceBroadcast',
                                name: '語音廣播',
                                ico: 'el-icon-mic',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '13',
                                type: 'mobilePush',
                                name: '手機推播',
                                ico: 'el-icon-mobile-phone',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '14',
                                type: 'linePush',
                                name: 'Line推播',
                                ico: 'el-icon-chat-line-round',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '15',
                                type: 'messagePush',
                                name: '簡訊推播',
                                ico: 'el-icon-message',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '16',
                                type: 'optionEvents',
                                name: '選項',
                                ico: 'el-icon-more-outline',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '17',
                                type: 'countDown',
                                name: '倒數',
                                ico: 'el-icon-time',
                                // 自定义覆盖样式
                                style: {}
                            }, {
                                id: '18',
                                type: 'end',
                                name: '結束',
                                ico: 'el-icon-bangzhu',
                                // 自定义覆盖样式
                                style: {}
                            }
                        ]
                    }
                ],
                nodeMenu: {}
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
            // 根据类型获取左侧菜单对象
            getMenuByType(type) {
                for (let i = 0; i < this.menuList.length; i++) {
                    let children = this.menuList[i].children;
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].type === type) {
                            return children[j]
                        }
                    }
                }
            },
            // 拖拽开始时触发
            move(evt, a, b, c) {
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenuByType(type)
            },
            // 拖拽结束时触发
            end(evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            // 是否是火狐浏览器
            isFirefox() {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
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

.ef-node-pmenu:hover {
    background-color: #E0E0E0;
}

.ef-node-menu-li {
    color: #565758;
    width: 150px;
    border: 1px dashed #E0E3E7;
    margin: 5px 0 5px 0;
    padding: 5px;
    border-radius: 5px;
    padding-left: 8px;
}

.ef-node-menu-li:hover {
    /* 设置移动样式*/
    cursor: move;
    background-color: #F0F7FF;
    border: 1px dashed #1879FF;
    border-left: 4px solid #1879FF;
    padding-left: 5px;
}

.ef-node-menu-ul {
    list-style: none;
    padding-left: 20px
}

</style>