<template>
    <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>廠商類別</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="onSubmit">新增</el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>
        
    </div>
</template>

<script>
import { getcontactunitOption  } from '@/api/building'
import { mapGetters } from 'vuex'

export default {
    components:{

    },
    data(){
        return{
            
        }
    },
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ])
    },
    mounted(){
        this.getcontactunitOption()
    },
    methods:{
        getcontactunitOption(){ //取得大樓的廠商分類
            this.options = []
            getcontactunitOption(this.buildingid).then(response => {
                console.log('getcontactunitOption=>'+JSON.stringify(response))
                response.result.forEach(item => {
                    let _array = { 
                        id : item.id, 
                        label: item.textName, 
                        value: item.id
                    }
                    this.options.push(_array)  
                    })
                this.blockData = this.options
            }).catch(error=>{
                console.log('error=>'+error)
            })
        },
        handleBlockOption(index, content){

        }
    }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>