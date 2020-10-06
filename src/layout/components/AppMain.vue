<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 85px);
  min-width: calc(100vh - 210px);
  position: relative;
  overflow: hidden;
  margin-left: 54px;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.openSidebar .app-main{
  margin-left: 210px;
}

.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

@media (max-width: 767px) {
  .app-main{
    min-width: 100%;
  }
}
</style>

