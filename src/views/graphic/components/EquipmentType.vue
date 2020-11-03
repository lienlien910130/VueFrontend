<template>
<div>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="24">
            <el-input 
            v-model="search" 
            placeholder="請輸入名稱"
            prefix-icon="el-icon-search"
            @clear="handleSearch"
            clearable
            ></el-input>
            <el-button type="primary" @click="handleSearch">搜尋</el-button>
            <el-button v-if="type=='icon'" type="success" @click="handleChange('text')">轉換成文字</el-button>
            <el-button v-if="type=='text'" type="success" @click="handleChange('icon')">轉換成圖例</el-button>
        </el-col>
    </el-row>
    <div
    class="leftcontent"
    v-if="type =='icon'"
    >
        <el-image
        class="icon"
        v-for="(item,index) in temp"
        :key="index"
        :src="item.imgSrc"
        :alt="item.name"
        @mousedown="handleImage"
        draggable
        ></el-image>
    </div>
    <div
    class="leftcontent"
    v-if="type =='text'">
        <el-link
        class="link"
        v-for="(item,index) in temp"
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
            search:'',
            temp:[]
        }
    },
    mounted(){
        this.temp = Object.assign({}, this.viewlist)
    },
    methods:{
        handleChange(type){
            this.type = type;
        },
        handleImage(e){
            if(e.target.localName == 'img'){
                this.$emit('subDragOption',e)
            }
        },
        handleSearch(){
            this.temp = []
            this.viewlist.filter((item) => {
                if (item.name.indexOf(this.search) !== -1) {
                    this.temp.push(item);
                }
            }) 
        }
    }
}
</script>
<style scoped>
.leftcontent{
    height:720px;
	overflow: auto; 
}
.icon{
    width: 55px;
    height: 55px;
    border: 1px solid black ;
    margin: 5px;
}
.link{
    padding: 8px;
}
</style>