<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="rgb(0,117,169)"
        text-color="rgb(184, 184, 184)"
        :unique-opened="false"
        active-text-color="white"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item 
        v-for="route in permission_routes" 
        :key="route.path" 
        :item="route" 
        :base-path="route.path" />
      </el-menu>
    
    </el-scrollbar>

    

  </div>
</template>

<script>
// const Vuex = require('vuex')
// import variables from '@/styles/variables.scss'

export default {
  components: { 
    SidebarItem:() => import('./SidebarItem')
  },
  computed: {
    ...Vuex.mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    // routes() {
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // variables() {
    //   return variables
    // },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
