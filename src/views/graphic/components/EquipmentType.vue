<template>
<div>
    <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="24">
            <el-input 
            v-model="search" 
            placeholder="請輸入名稱"
            prefix-icon="el-icon-search"
            @clear="handleSearch"
            @input="handleSearch"
            clearable
            ></el-input>
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
            tt:require("../../../assets/equipment/1.png")
        }
    },
    mounted(){
        this.temp = Object.assign({}, this.viewlist)
    },
    computed:{
        changeToImage(obj){
            console.log(obj.viewlist[0].imgSrc)
            var str = "../../../assets/equipment/"+obj.viewlist[0].imgSrc
            return require(str)
        }
    },
    methods:{
        // changeToImage(name){
        //     var str = "../../../assets/equipment/"+name
        //     console.log(str)
        //     return require(str)
        // },
        handleChange(type){
            this.type = type
        },
        handleImage(item,e){
            if(e.target.localName == 'img'){
                if(this.select == item){
                    this.select = null
                    window.opener.postMessage('null', window.location)
                }else{
                    this.select = item
                    var str = item.id+','+e.offsetX+','+e.offsetY+','+
                    e.target.naturalWidth+','+e.target.naturalHeight+','+item.name
                    window.opener.postMessage(str, window.location)
                }
            }
        },
        handleSearch(){
            this.temp = []
            this.viewlist.filter((item) => {
                if (item.name.indexOf(this.search) !== -1) {
                    this.temp.push(item)
                }
            }) 
        }
    }
}
</script>
<style lang="scss" scoped>
.leftcontent{
    height:400px;
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