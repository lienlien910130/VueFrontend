<template>
    <div>
        <Upload v-on="uploadEvent"></Upload>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ]),
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        },
    },
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    methods:{
        handleUploadOption(index,file){
            
        }
    }
}
</script>