<template>
  <div>
    <div v-loading="loading">
      <p v-if="imageSrc == '-1'">請至相關資料設定樓層平面圖</p>
      <img v-else class="img" :src="imageSrc" :style="{ height: imgheight }" />
    </div>
  </div>
</template>

<script>
// const Vuex = require('vuex')

export default {
  props: ["imageSrc", "loading"],
  computed: {
    ...Vuex.mapGetters(["fullscreen"]),
  },
  watch: {
    fullscreen: {
      handler: async function () {
        this.fullscreen == true
          ? (this.imgheight = "770px")
          : (this.imgheight = "680px");
      },
      immediate: true,
    },
  },
  data() {
    return {
      imgheight: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.img {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  max-width: 100%;
  height: 590px;
}
</style>
