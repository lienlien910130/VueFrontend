<template>
    <div class="auth-container">
        <div class="auth-editor-container">
           <el-row :gutter="32">
               <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="chart-wrapper">
                       <MenuTree
                       v-bind="treeAttrs"
                       v-on="treeEvent"></MenuTree>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="chart-wrapper">
                       <Table
                       v-bind="tableAttrs"
                       v-on="tableEvent">
                       </Table>
                    </div>
                </el-col>
           </el-row>
        </div>
    </div>
</template>
<script>
import path from 'path'
import { constantRoutes } from '@/router'

export default {
    components:{ 
      Table: () => import('@/components/Table/index.vue'),
      MenuTree: () => import('./components/menuTree.vue'),
    },
    data(){
        return{
            tableData:[],
            treeData:[],
            routes:[],
            itemkey:Math.random(),
            config:[
                {
                    label: '權限名稱',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入權限名稱',textarea:false
                },
                {
                    label: '描述',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入描述',textarea:false
                },
                {
                    label: '狀態',
                    prop: 'lackItem',
                    mandatory:true, message:'請輸入狀態',textarea:false
                }
            ]
        }
    },
    computed: {
        tableAttrs(){
            return {
                tableData: this.tableData,
                itemkey:this.itemkey,
                config:this.config
            }
        },
        tableEvent(){
            return {
                
            }
        },
        treeAttrs(){
            return {
                treedata: this.treeData
            }
        },
        treeEvent(){
            return {
                
            }
        },
    },
    async mounted() {
        await this.getRoutes()
    },
    methods:{
        async getRoutes() {
            this.routes = this.generateRoutes(constantRoutes)
            this.treeData = Object.assign([], this.routes)
            console.log(JSON.stringify(this.routes))
        },
        generateRoutes(routes, basePath = '/') {
            const res = []
            for (let route of routes) {
                // skip some route
                if (route.hidden) { continue }
                const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
                if (route.children && onlyOneShowingChild && !route.alwaysShow) {
                route = onlyOneShowingChild
                }
                const data = {
                path: path.resolve(basePath, route.path),
                label: route.meta && route.meta.title
                }
                // recursive child routes
                if (route.children) {
                data.children = this.generateRoutes(route.children, data.path)
                }
                res.push(data)
            }
            return res
        },
        onlyOneShowingChild(children = [], parent) {
            let onlyOneChild = null
            const showingChildren = children.filter(item => !item.hidden)

            // When there is only one child route, the child route is displayed by default
            if (showingChildren.length === 1) {
                onlyOneChild = showingChildren[0]
                onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
                return onlyOneChild
            }

            // Show parent if there are no child route to display
            if (showingChildren.length === 0) {
                onlyOneChild = { ... parent, path: '', noShowingChildren: true }
                return onlyOneChild
            }

            return false
        },

    }
}
</script>
<style lang="scss" scoped>
    
.auth-editor-container {
  padding: 20px;
  background-color: #d1e2ec;
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
   
    .chart-wrapper {
        background: #fff;
        padding: 5px 16px 0;
        margin-bottom: 32px;
        height: 730px;
        overflow-x:hidden;
        overflow-y:auto;
        width: 100%;
    }
    
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }

}
</style>