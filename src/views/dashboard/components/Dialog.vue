<template>
  <div class="components-container">
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="叫修" @dragDialog="handleDrag">
      
      <p>{{ dialogData.id }}</p>

    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'Dialog',
  directives: { elDragDialog },
  props:['dialogTableVisible','dialogData'],
  data() {
    return {
      
    }
  },
  watch: {
    dialogTableVisible:function(){
      
    }
  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$emit('setvisible', false)
    }
  }
}
</script>
