<template>
<div>
  <div v-loading="loading" >
    <p v-if="imageSrc=='-1'">請至相關資料設定樓層平面圖</p>
    <img  v-else class="img" :src="imageSrc"/>
  </div>
</div>
</template>

<script>

export default {
  props: ['imageSrc','loading']
}
</script>

<style lang="scss" scoped>
.img {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  max-width: 100%;
}
</style>
