<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&& sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div>
      <navbar />
    </div>
    
    <div class="main-container">
      <sidebar class="sidebar-container" />
      
      <div class="hamburger-container" >
        <hamburger :is-active="sidebar.opened" 
        style="padding:0px" @toggleClick="toggleSideBar" />
      </div>
      <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" 
      style="padding:0px" @toggleClick="toggleSideBar" :class="{close:!sidebar.opened}" /> -->
      <app-main />
    </div>

    <div>
      <Footer/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Footer } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Footer,
    Hamburger: () => import('@/components/Hamburger'), 
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .hamburger-container{
    height: 30px;
    margin-left: 0px;
    position: relative;
    background-color: #d1e2ec;
  }

  .openSidebar .hamburger-container{
    margin-left: 180px;
  }

</style>
