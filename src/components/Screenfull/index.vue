<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
    window.addEventListener("keydown", this.KeyDown, true)
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    KeyDown (event) {
      if (event.keyCode === 122) {
        event.returnValue = false
        this.click()
      }
    },
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '無法使用全螢幕',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      
      this.isFullscreen = screenfull.isFullscreen
      this.$store.dispatch('app/toggleScreen',this.isFullscreen)
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
