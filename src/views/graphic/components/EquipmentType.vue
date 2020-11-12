<template>
<div>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="24">
            <!-- <div
            v-if="this.select"
            style="width:100%">
                <el-form label-width="auto">
                    <el-form-item label="比例">
                        <el-input-number v-model="imgscale" :precision="1" :step="0.1" :min="0.1" :max="1" 
                        @change="changeImg" style="width:100%"  controls-position="right" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="預覽">
                        <el-image
                            class="icon"
                            :style="{ width: scalewidth +'px', height: scaleheight + 'px' }"
                            :src="this.select.imgSrc"
                            :alt="this.select.name"
                            @mousedown="handleImage(item,$event)"
                            draggable
                        >
                        </el-image>
                    </el-form-item>
                </el-form>
            </div> -->
            
            <el-input 
            v-model="search" 
            placeholder="請輸入名稱"
            prefix-icon="el-icon-search"
            @clear="handleSearch"
            @input="handleSearch"
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
        <div
        class="imagediv"
        v-for="(item,index) in temp"
        :key="index"
        >
        <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
            <el-image
            :class="[{active:select==item},{icon:true}]"
            :src="item.imgSrc"
            :alt="item.name"
            @mousedown="handleImage(item,$event)"
            draggable
            >
            </el-image>
        </el-tooltip>
        </div>
    </div>
    <div
    class="leftcontent"
    v-if="type =='text'">
        <div
        class="linkdiv"
        v-for="(item,index) in temp"
        :key="index">
            <el-link
            class="link"
            type="info">{{ item.id }} . {{ item.name }}
            </el-link>
        </div>
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
            temp:[],
            select:null,
            imgscale:0.1,
            natural:{width:0,height:0}
        }
    },
    computed:{
        scalewidth(){
            return this.natural.width * this.imgscale
        },
        scaleheight(){
            return this.natural.height * this.imgscale
        }
    },
    mounted(){
        this.temp = Object.assign({}, this.viewlist)
    },
    methods:{
        handleChange(type){
            this.type = type;
        },
        handleImage(item,e){
            if(e.target.localName == 'img'){
                if(this.select == item){
                    this.select = null
                    this.$emit('subDragOption',null)
                }else{
                    this.select = item
                    this.$emit('subDragOption',e)
                    this.natural = {width:e.target.naturalWidth,height:e.target.naturalHeight}
                }
            }
        },
        handleSearch(){
            this.temp = []
            this.viewlist.filter((item) => {
                if (item.name.indexOf(this.search) !== -1) {
                    this.temp.push(item);
                }
            }) 
        },
        changeImg(){

        }
    }
}
</script>
<style lang="scss" scoped>
.leftcontent{
    height:650px;
    overflow: auto;
    width: 100%;
    

    .linkdiv{
        display: inline-block;
        position: relative;
        width: 50%;
        
    }
    .imagediv{
        display: inline-block;
        position: relative;
    }
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
.active{
    background-color: rgb(194, 193, 193);
}
</style>