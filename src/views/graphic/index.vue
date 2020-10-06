<template>
  <div class="graphic-container">
      <div class="graphic-editor-container">
          <Graphic></Graphic>
      </div>
  </div>
</template>

<script>
export default {
    components:{
        Graphic: () => import('@/components/Graphic/index.vue'),
    },
}
</script>



