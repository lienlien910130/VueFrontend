<template>
    <div class="editor-container">
        <Range></Range>
    </div>
</template>

<script>
export default {
    components: {
        Range: () => import('../../normal/basicinfor/components/Range.vue')
    }
}
</script>