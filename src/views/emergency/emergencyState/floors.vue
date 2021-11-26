<template>
  <div class="editor-container">
    <Range v-on:handleBuildingFloorSelect="handleBuildingFloorSelect"></Range>
  </div>
</template>

<script>
export default {
  components: {
    Range: () => import("../../normal/basicinfor/components/Range.vue"),
  },
  methods: {
    async handleBuildingFloorSelect(content) {
      //選擇樓層後的操作-儲存樓層&儲存樓層平面圖ID
      console.log(content);
      //this.$socket.saveWatchFloor(content.id);
      //this.$store.dispatch("websocket/saveWatchFloor", content.id);
    },
  },
};
</script>
