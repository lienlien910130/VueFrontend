<template>
<div>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="24">
            <el-input v-model="search" placeholder="請輸入名稱"></el-input>
            <el-button type="primary">搜尋</el-button>
            <el-button v-if="type=='icon'" type="success" @click="handleChange('text')">轉換成文字</el-button>
            <el-button v-if="type=='text'" type="success" @click="handleChange('icon')">轉換成圖例</el-button>
        </el-col>
    </el-row>
    <div
    v-if="type =='icon'"
    >
        <el-image
        class="icon"
        v-for="(item,index) in viewlist"
        :key="index"
        :src="item.imgSrc"
        :alt="item.name"
        width="50px"
        height="50px"
        @click="handleImage"
        ></el-image>
    </div>
    <div
    class=""
    v-if="type =='text'">
        <el-link
        v-for="(item,index) in viewlist"
        :key="index"
        type="info">{{ item.name }}
        </el-link>
    </div>
</div>
</template>

<script>
import constant from '../../../../src/constant';

export default {
    data(){
        return{
            viewlist:constant.Equipment,
            type:'icon',
            search:''
        }
    },
    methods:{
        handleChange(type){
            this.type = type;
        },
        handleImage(){

        }
    }
}
</script>
<style scoped>
.icon{
    width: 50px;
    height: 50px;
}
</style>